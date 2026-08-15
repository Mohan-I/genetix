// src/components/GeneticDataImporter.tsx
import React, { useState, useCallback, useRef } from 'react';
import { 
  Upload, 
  FileText, 
  AlertCircle, 
  CheckCircle, 
  Loader2, 
  X, 
  Download,
  Dna,
  Zap,
  Shield,
  Eye,
  ChevronDown,
  ChevronRight,
  FileUp,
  Database
} from 'lucide-react';
import { PedigreeMember } from '../types/pedigree';

// ============================================================================
// 1. TYPES
// ============================================================================

interface GeneticVariant {
  id: string;
  chromosome: string;
  position: number;
  ref: string;
  alt: string;
  gene: string;
  consequence: string;
  isPathogenic: boolean;
  isCarrier: boolean;
  affected: boolean;
  zygosity: 'HOMOZYGOUS' | 'HETEROZYGOUS' | 'UNKNOWN';
  populationFreq: number;
  clinsig: string;
  disease: string;
  inheritance: string;
}

interface VariantFilter {
  showPathogenic: boolean;
  showCarrier: boolean;
  showBenign: boolean;
  minFrequency: number;
  searchGene: string;
}

interface ImportedData {
  source: '23ANDME' | 'ANCESTRY' | 'VCF' | 'WES' | 'UNKNOWN';
  sampleId: string;
  variants: GeneticVariant[];
  metadata: {
    totalVariants: number;
    pathogenicVariants: number;
    carrierVariants: number;
    platform: string;
    dateImported: string;
  };
}

// ============================================================================
// 2. PARSER CLASSES
// ============================================================================

class VCFParser {
  static parse(content: string): GeneticVariant[] {
    const lines = content.split('\n');
    const variants: GeneticVariant[] = [];
    
    for (const line of lines) {
      if (line.startsWith('#') || line.trim() === '') continue;
      
      const parts = line.split('\t');
      if (parts.length < 8) continue;
      
      const [chrom, pos, id, ref, alt, qual, filter, info] = parts;
      
      // Parse INFO field for gene and disease info
      const infoMap: Record<string, string> = {};
      info.split(';').forEach(field => {
        const [key, value] = field.split('=');
        if (key && value) infoMap[key] = value;
      });
      
      const isPathogenic = infoMap['CLNSIG']?.includes('Pathogenic') || false;
      const isCarrier = infoMap['CARRIER'] === 'YES' || false;
      
      variants.push({
        id: id || `v${pos}`,
        chromosome: chrom,
        position: parseInt(pos),
        ref,
        alt,
        gene: infoMap['GENE'] || 'Unknown',
        consequence: infoMap['CSQ'] || 'unknown',
        isPathogenic,
        isCarrier,
        affected: false,
        zygosity: infoMap['ZYG'] === 'HOM' ? 'HOMOZYGOUS' : 
                  infoMap['ZYG'] === 'HET' ? 'HETEROZYGOUS' : 'UNKNOWN',
        populationFreq: parseFloat(infoMap['AF'] || '0'),
        clinsig: infoMap['CLNSIG'] || 'Unknown',
        disease: infoMap['DISEASE'] || 'Unknown',
        inheritance: infoMap['INHERITANCE'] || 'Unknown'
      });
    }
    
    return variants;
  }
}

class DTCFileParser {
  static parse(content: string, platform: '23ANDME' | 'ANCESTRY'): GeneticVariant[] {
    const lines = content.split('\n');
    const variants: GeneticVariant[] = [];
    let isDataSection = false;
    
    const headerMap: Record<string, number> = {};
    
    for (const line of lines) {
      if (line.trim() === '') continue;
      
      // Find header
      if (line.includes('rsid') && line.includes('chromosome') && line.includes('position')) {
        const headers = line.toLowerCase().split('\t');
        headerMap['rsid'] = headers.indexOf('rsid');
        headerMap['chromosome'] = headers.indexOf('chromosome');
        headerMap['position'] = headers.indexOf('position');
        headerMap['genotype'] = headers.indexOf('genotype');
        headerMap['allele1'] = headers.indexOf('allele1');
        headerMap['allele2'] = headers.indexOf('allele2');
        isDataSection = true;
        continue;
      }
      
      if (!isDataSection) continue;
      
      const parts = line.split('\t');
      const rsid = parts[headerMap['rsid']] || '';
      const chrom = parts[headerMap['chromosome']] || '';
      const pos = parseInt(parts[headerMap['position']] || '0');
      const genotype = parts[headerMap['genotype']] || '';
      
      // Skip if no RSID or invalid position
      if (!rsid || !pos || !genotype) continue;
      
      // Determine if this is a medically relevant variant
      // In production, this would map to a clinical database
      const isPathogenic = this.isClinicallyRelevant(rsid, chrom, pos, genotype);
      const isCarrier = this.isCarrierVariant(rsid, chrom, pos, genotype);
      
      variants.push({
        id: rsid,
        chromosome: chrom,
        position: pos,
        ref: 'A', // Would need actual ref allele
        alt: 'G', // Would need actual alt allele
        gene: this.guessGene(rsid, chrom, pos),
        consequence: 'intergenic_variant',
        isPathogenic,
        isCarrier,
        affected: false,
        zygosity: this.detectZygosity(genotype),
        populationFreq: 0.01,
        clinsig: isPathogenic ? 'Pathogenic' : 'Benign',
        disease: isPathogenic ? this.guessDisease(rsid, chrom, pos) : 'Unknown',
        inheritance: 'Unknown'
      });
    }
    
    return variants;
  }
  
  private static isClinicallyRelevant(rsid: string, chrom: string, pos: number, genotype: string): boolean {
    // Simplified - in production, query ClinVar or similar database
    const pathogenicSnps = [
      { rs: 'rs80358171', gene: 'CFTR' },
      { rs: 'rs113993960', gene: 'CFTR' },
      { rs: 'rs121918719', gene: 'HBB' },
      { rs: 'rs334', gene: 'HBB' },
      { rs: 'rs121908080', gene: 'SMN1' },
      { rs: 'rs386833395', gene: 'BRCA1' },
      { rs: 'rs80357413', gene: 'BRCA1' },
      { rs: 'rs80359421', gene: 'BRCA2' },
      { rs: 'rs80359382', gene: 'BRCA2' }
    ];
    
    return pathogenicSnps.some(snp => snp.rs === rsid);
  }
  
  private static isCarrierVariant(rsid: string, chrom: string, pos: number, genotype: string): boolean {
    // Check if heterozygous for recessive conditions
    return this.isClinicallyRelevant(rsid, chrom, pos, genotype) && 
           this.detectZygosity(genotype) === 'HETEROZYGOUS';
  }
  
  private static detectZygosity(genotype: string): 'HOMOZYGOUS' | 'HETEROZYGOUS' | 'UNKNOWN' {
    if (!genotype || genotype === '--') return 'UNKNOWN';
    const alleles = genotype.replace(/[^ACGT]/g, '');
    if (alleles.length === 1) return 'HOMOZYGOUS';
    if (alleles[0] === alleles[1]) return 'HOMOZYGOUS';
    return 'HETEROZYGOUS';
  }
  
  private static guessGene(rsid: string, chrom: string, pos: number): string {
    const geneMap: Record<string, string> = {
      'rs80358171': 'CFTR',
      'rs113993960': 'CFTR',
      'rs121918719': 'HBB',
      'rs334': 'HBB',
      'rs121908080': 'SMN1',
      'rs386833395': 'BRCA1',
      'rs80357413': 'BRCA1',
      'rs80359421': 'BRCA2',
      'rs80359382': 'BRCA2'
    };
    return geneMap[rsid] || `Gene_${chrom}_${pos}`;
  }
  
  private static guessDisease(rsid: string, chrom: string, pos: number): string {
    const diseaseMap: Record<string, string> = {
      'rs80358171': 'Cystic Fibrosis',
      'rs113993960': 'Cystic Fibrosis',
      'rs121918719': 'Sickle Cell Anemia',
      'rs334': 'Sickle Cell Anemia',
      'rs121908080': 'Spinal Muscular Atrophy',
      'rs386833395': 'Breast/Ovarian Cancer',
      'rs80357413': 'Breast/Ovarian Cancer',
      'rs80359421': 'Breast/Ovarian Cancer',
      'rs80359382': 'Breast/Ovarian Cancer'
    };
    return diseaseMap[rsid] || 'Unknown';
  }
}

// ============================================================================
// 3. REACT COMPONENT
// ============================================================================

interface GeneticDataImporterProps {
  onDataImported?: (data: ImportedData) => void;
  onVariantSelected?: (variant: GeneticVariant, memberId: string) => void;
  targetMemberId?: string;
}

export const GeneticDataImporter: React.FC<GeneticDataImporterProps> = ({
  onDataImported,
  onVariantSelected,
  targetMemberId
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [importedData, setImportedData] = useState<ImportedData | null>(null);
  const [selectedVariants, setSelectedVariants] = useState<string[]>([]);
  const [filter, setFilter] = useState<VariantFilter>({
    showPathogenic: true,
    showCarrier: true,
    showBenign: false,
    minFrequency: 0,
    searchGene: ''
  });
  const [expandedVariant, setExpandedVariant] = useState<string | null>(null);
  const [importError, setImportError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileDrop = useCallback(async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = e.dataTransfer.files;
    if (files.length === 0) return;
    
    await processFile(files[0]);
  }, []);

  const handleFileSelect = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    await processFile(files[0]);
  }, []);

  const processFile = useCallback(async (file: File) => {
    setIsLoading(true);
    setImportError(null);
    
    try {
      const content = await file.text();
      const fileType = detectFileType(file.name, content);
      
      let variants: GeneticVariant[] = [];
      let sampleId = file.name.replace(/\.[^/.]+$/, '');
      
      switch (fileType) {
        case 'VCF':
          variants = VCFParser.parse(content);
          break;
        case '23ANDME':
          variants = DTCFileParser.parse(content, '23ANDME');
          break;
        case 'ANCESTRY':
          variants = DTCFileParser.parse(content, 'ANCESTRY');
          break;
        default:
          throw new Error('Unsupported file format. Please upload a VCF or 23andMe/AncestryDNA file.');
      }
      
      const pathogenicVariants = variants.filter(v => v.isPathogenic);
      const carrierVariants = variants.filter(v => v.isCarrier);
      
      const imported: ImportedData = {
        source: fileType,
        sampleId,
        variants,
        metadata: {
          totalVariants: variants.length,
          pathogenicVariants: pathogenicVariants.length,
          carrierVariants: carrierVariants.length,
          platform: fileType,
          dateImported: new Date().toISOString()
        }
      };
      
      setImportedData(imported);
      if (onDataImported) onDataImported(imported);
      
      // Auto-select pathogenic and carrier variants
      const autoSelect = [...pathogenicVariants, ...carrierVariants].map(v => v.id);
      setSelectedVariants(autoSelect);
      
    } catch (error) {
      setImportError(error instanceof Error ? error.message : 'Failed to process file');
    } finally {
      setIsLoading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  }, [onDataImported]);

  const detectFileType = (filename: string, content: string): 'VCF' | '23ANDME' | 'ANCESTRY' | 'UNKNOWN' => {
    const ext = filename.toLowerCase().split('.').pop();
    
    if (ext === 'vcf' || content.includes('##fileformat=VCF')) {
      return 'VCF';
    }
    
    if (content.includes('rsid') && content.includes('chromosome') && content.includes('genotype')) {
      if (content.includes('23andMe') || content.includes('23andme')) {
        return '23ANDME';
      }
      if (content.includes('AncestryDNA') || content.includes('ancestry')) {
        return 'ANCESTRY';
      }
      return '23ANDME';
    }
    
    return 'UNKNOWN';
  };

  const toggleVariantSelection = useCallback((variantId: string) => {
    setSelectedVariants(prev => {
      if (prev.includes(variantId)) {
        return prev.filter(id => id !== variantId);
      }
      return [...prev, variantId];
    });
  }, []);

  const applySelectedVariants = useCallback(() => {
    if (!importedData || !onVariantSelected || !targetMemberId) return;
    
    const selected = importedData.variants.filter(v => selectedVariants.includes(v.id));
    selected.forEach(variant => {
      onVariantSelected(variant, targetMemberId);
    });
    
    // Show success feedback
    alert(`✅ Applied ${selected.length} variants to pedigree member`);
  }, [importedData, selectedVariants, onVariantSelected, targetMemberId]);

  const getFilteredVariants = useCallback(() => {
    if (!importedData) return [];
    
    return importedData.variants.filter(v => {
      if (!filter.showPathogenic && v.isPathogenic) return false;
      if (!filter.showCarrier && v.isCarrier) return false;
      if (!filter.showBenign && !v.isPathogenic && !v.isCarrier) return false;
      if (v.populationFreq < filter.minFrequency) return false;
      if (filter.searchGene && !v.gene.toLowerCase().includes(filter.searchGene.toLowerCase())) return false;
      return true;
    });
  }, [importedData, filter]);

  const getVariantSummary = (variant: GeneticVariant) => {
    const badges = [];
    if (variant.isPathogenic) badges.push({ label: 'Pathogenic', color: 'bg-red-100 text-red-700' });
    if (variant.isCarrier) badges.push({ label: 'Carrier', color: 'bg-yellow-100 text-yellow-700' });
    if (variant.zygosity === 'HOMOZYGOUS') badges.push({ label: 'Homozygous', color: 'bg-blue-100 text-blue-700' });
    if (variant.zygosity === 'HETEROZYGOUS') badges.push({ label: 'Heterozygous', color: 'bg-green-100 text-green-700' });
    return badges;
  };

  const filteredVariants = getFilteredVariants();

  return (
    <div className="bg-[#0a0a0c] border border-white/10 rounded-lg overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Database className="w-5 h-5 text-emerald-500" />
          <div>
            <h3 className="text-sm font-mono text-white/80">Genetic Data Importer</h3>
            <p className="text-[10px] text-white/40 font-mono">VCF · 23andMe · AncestryDNA</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Shield className="w-4 h-4 text-emerald-500/60" />
          <span className="text-[8px] text-emerald-500/60 font-mono">Local Processing</span>
        </div>
      </div>

      {/* Drop Zone */}
      {!importedData ? (
        <div
          className={`p-8 text-center border-2 border-dashed transition-all ${
            isDragging 
              ? 'border-emerald-500/60 bg-emerald-500/5' 
              : 'border-white/10 hover:border-emerald-500/30'
          }`}
          onDragEnter={() => setIsDragging(true)}
          onDragLeave={() => setIsDragging(false)}
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleFileDrop}
        >
          <div className="flex flex-col items-center gap-4">
            <div className="w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center">
              <FileUp className="w-8 h-8 text-emerald-500" />
            </div>
            <div>
              <p className="text-sm text-white/60 font-mono">
                Drag & drop your genetic data file here
              </p>
              <p className="text-[10px] text-white/30 font-mono mt-1">
                Supports .vcf, .txt (23andMe/AncestryDNA)
              </p>
            </div>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="px-4 py-2 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono hover:bg-emerald-500/20 transition-all flex items-center gap-2"
            >
              <Upload className="w-3 h-3" />
              Browse Files
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".vcf,.txt"
              onChange={handleFileSelect}
              className="hidden"
            />
            
            <div className="text-[8px] text-white/20 font-mono flex items-center gap-2">
              <Shield className="w-3 h-3" />
              All processing is done locally in your browser
            </div>
          </div>
        </div>
      ) : (
        /* Imported Data View */
        <div className="p-4">
          {/* Summary */}
          <div className="grid grid-cols-4 gap-3 mb-4">
            <div className="bg-white/5 p-3 rounded border border-white/5">
              <div className="text-[8px] text-white/30 uppercase font-mono">Total Variants</div>
              <div className="text-lg font-light text-white">{importedData.metadata.totalVariants.toLocaleString()}</div>
            </div>
            <div className="bg-red-500/5 p-3 rounded border border-red-500/20">
              <div className="text-[8px] text-white/30 uppercase font-mono">Pathogenic</div>
              <div className="text-lg font-light text-red-400">{importedData.metadata.pathogenicVariants}</div>
            </div>
            <div className="bg-yellow-500/5 p-3 rounded border border-yellow-500/20">
              <div className="text-[8px] text-white/30 uppercase font-mono">Carrier</div>
              <div className="text-lg font-light text-yellow-400">{importedData.metadata.carrierVariants}</div>
            </div>
            <div className="bg-blue-500/5 p-3 rounded border border-blue-500/20">
              <div className="text-[8px] text-white/30 uppercase font-mono">Selected</div>
              <div className="text-lg font-light text-blue-400">{selectedVariants.length}</div>
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-3 mb-4 p-3 bg-white/5 rounded border border-white/5">
            <label className="flex items-center gap-1.5 text-[10px] text-white/60 font-mono">
              <input
                type="checkbox"
                checked={filter.showPathogenic}
                onChange={(e) => setFilter({ ...filter, showPathogenic: e.target.checked })}
                className="w-3 h-3 accent-emerald-500"
              />
              Pathogenic
            </label>
            <label className="flex items-center gap-1.5 text-[10px] text-white/60 font-mono">
              <input
                type="checkbox"
                checked={filter.showCarrier}
                onChange={(e) => setFilter({ ...filter, showCarrier: e.target.checked })}
                className="w-3 h-3 accent-emerald-500"
              />
              Carrier
            </label>
            <label className="flex items-center gap-1.5 text-[10px] text-white/60 font-mono">
              <input
                type="checkbox"
                checked={filter.showBenign}
                onChange={(e) => setFilter({ ...filter, showBenign: e.target.checked })}
                className="w-3 h-3 accent-emerald-500"
              />
              Benign
            </label>
            <div className="flex-1" />
            <input
              type="text"
              placeholder="Filter by gene..."
              value={filter.searchGene}
              onChange={(e) => setFilter({ ...filter, searchGene: e.target.value })}
              className="px-2 py-1 bg-white/5 border border-white/10 rounded text-xs text-white/60 font-mono focus:border-emerald-500 outline-none w-32"
            />
            <button
              onClick={() => {
                setFilter({
                  showPathogenic: true,
                  showCarrier: true,
                  showBenign: false,
                  minFrequency: 0,
                  searchGene: ''
                });
              }}
              className="text-[8px] text-white/30 hover:text-white/60 font-mono uppercase tracking-wider"
            >
              Reset
            </button>
          </div>

          {/* Variant List */}
          <div className="max-h-60 overflow-y-auto space-y-1 border border-white/5 rounded">
            {filteredVariants.length === 0 ? (
              <div className="p-4 text-center text-white/30 text-sm font-mono">
                No variants match the current filters
              </div>
            ) : (
              filteredVariants.slice(0, 50).map(variant => {
                const isSelected = selectedVariants.includes(variant.id);
                const isExpanded = expandedVariant === variant.id;
                const badges = getVariantSummary(variant);
                
                return (
                  <div
                    key={variant.id}
                    className={`border-b border-white/5 hover:bg-white/5 transition-all ${
                      isSelected ? 'bg-emerald-500/5' : ''
                    }`}
                  >
                    <div className="flex items-center gap-3 p-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleVariantSelection(variant.id)}
                        className="w-3.5 h-3.5 accent-emerald-500 cursor-pointer"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-xs font-mono text-white/80">{variant.gene}</span>
                          <span className="text-[9px] text-white/40 font-mono">{variant.chromosome}:{variant.position}</span>
                          {badges.map((badge, i) => (
                            <span key={i} className={`text-[7px] px-1.5 py-0.5 rounded font-mono ${badge.color}`}>
                              {badge.label}
                            </span>
                          ))}
                          {variant.disease !== 'Unknown' && (
                            <span className="text-[7px] text-red-400/60 font-mono">{variant.disease}</span>
                          )}
                        </div>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setExpandedVariant(isExpanded ? null : variant.id);
                        }}
                        className="text-white/30 hover:text-white/60 transition-colors"
                      >
                        {isExpanded ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
                      </button>
                    </div>
                    
                    {isExpanded && (
                      <div className="px-8 pb-2 text-[9px] text-white/40 font-mono space-y-1">
                        <div>RSID: {variant.id}</div>
                        <div>Ref: {variant.ref} → Alt: {variant.alt}</div>
                        <div>Zygosity: {variant.zygosity}</div>
                        <div>ClinSig: {variant.clinsig}</div>
                        <div>Population Frequency: {(variant.populationFreq * 100).toFixed(2)}%</div>
                        {variant.disease !== 'Unknown' && (
                          <div className="text-red-400/60">Disease: {variant.disease}</div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>

          <div className="text-[8px] text-white/20 font-mono mt-2">
            Showing {Math.min(filteredVariants.length, 50)} of {filteredVariants.length} variants
          </div>

          {/* Actions */}
          <div className="flex gap-3 mt-4">
            <button
              onClick={applySelectedVariants}
              disabled={!targetMemberId || selectedVariants.length === 0}
              className="flex-1 px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-[#0a0a0c] text-xs font-mono font-bold uppercase tracking-wider transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <Dna className="w-3 h-3" />
              Apply to Pedigree
            </button>
            <button
              onClick={() => {
                setImportedData(null);
                setSelectedVariants([]);
              }}
              className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white/60 text-xs font-mono transition-all flex items-center gap-2"
            >
              <X className="w-3 h-3" />
              Clear
            </button>
          </div>
        </div>
      )}

      {/* Error Display */}
      {importError && (
        <div className="p-3 bg-red-500/10 border-t border-red-500/20 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
          <span className="text-xs text-red-400 font-mono">{importError}</span>
          <button
            onClick={() => setImportError(null)}
            className="ml-auto text-red-400/60 hover:text-red-400"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      )}

      {/* Processing Indicator */}
      {isLoading && (
        <div className="p-4 bg-emerald-500/5 border-t border-emerald-500/20 flex items-center justify-center gap-3">
          <Loader2 className="w-4 h-4 text-emerald-500 animate-spin" />
          <span className="text-xs text-emerald-400 font-mono">Processing genetic data...</span>
        </div>
      )}
    </div>
  );
};

export default GeneticDataImporter;