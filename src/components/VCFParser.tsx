// src/components/VCFParser.tsx
import React, { useState, useCallback, useRef, useEffect, useMemo } from 'react';
import {
  FileUp,
  Loader2,
  Database,
  HardDrive,
  FileText,
  AlertTriangle,
  X,
  Dna,
  BarChart3,
  PieChart,
  TrendingUp,
  TrendingDown,
  AlertCircle,
  CheckCircle,
  Info,
  Download,
  Filter,
  Search,
  ChevronDown,
  ChevronRight,
  Activity,
  Heart,
  Brain,
  Eye,
  Droplet,
  Users,
  Clock,
  Calendar,
  Zap
} from 'lucide-react';

// ============================================================================
// 1. TYPES
// ============================================================================

interface VCFVariant {
  chrom: string;
  pos: number;
  id: string;
  ref: string;
  alt: string;
  qual: number;
  filter: string;
  info: Record<string, string>;
  gene: string;
  condition: string;
  genotypes: Record<string, string>;
  isPathogenic: boolean;
  isClinicallyRelevant: boolean;
  alleleFrequency?: number;
  zygosity?: string;
}

interface VCFStats {
  totalVariants: number;
  clinicallyRelevant: number;
  pathogenic: number;
  genes: Record<string, number>;
  conditions: Record<string, number>;
  genotypes: {
    homozygous_ref: number;
    heterozygous: number;
    homozygous_alt: number;
  };
  samples: string[];
  qualityDistribution: {
    high: number;
    medium: number;
    low: number;
  };
  chromosomeDistribution: Record<string, number>;
}

interface VCFParserProps {
  onDataParsed?: (variants: VCFVariant[], stats: VCFStats) => void;
  onProcessingStart?: () => void;
  onProcessingEnd?: () => void;
}

// ============================================================================
// 2. VCF PARSER ENGINE
// ============================================================================

class VCFParserEngine {
  private static clinicalGenes = new Set([
    'BRCA1', 'BRCA2', 'CFTR', 'HBB', 'SMN1', 'HEXA', 'FXN',
    'MSH2', 'MLH1', 'MSH6', 'PMS2', 'APC', 'MUTYH',
    'TCF7L2', 'SLC30A8', 'GCK', 'HNF1A', 'HNF4A',
    'MYP1', 'OPN1LW', 'HTT', 'DMD'
  ]);

  private static pathogenicKeywords = [
    'Pathogenic', 'Likely Pathogenic', 'Risk', 'Deleterious',
    'Disease', 'Carrier', 'Affected'
  ];

  static parseVCF(content: string, sampleFilter?: string[]): { variants: VCFVariant[]; stats: VCFStats } {
    const lines = content.split('\n');
    const variants: VCFVariant[] = [];
    let sampleNames: string[] = [];
    let isDataSection = false;

    // Parse header
    for (const line of lines) {
      if (line.startsWith('#CHROM')) {
        const parts = line.split('\t');
        sampleNames = parts.slice(9);
        isDataSection = true;
        continue;
      }

      if (!isDataSection || line.startsWith('#')) continue;
      if (line.trim() === '') continue;

      const parts = line.split('\t');
      if (parts.length < 10) continue;

      try {
        const variant = this.parseVCFLine(parts, sampleNames);
        if (variant) {
          variants.push(variant);
        }
      } catch (e) {
        console.warn('Failed to parse line:', line);
      }
    }

    const stats = this.calculateStats(variants, sampleNames);
    return { variants, stats };
  }

  static parseVCFLine(parts: string[], sampleNames: string[]): VCFVariant | null {
    const [chrom, pos, id, ref, alt, qual, filter, infoStr] = parts;
    const genotypes: Record<string, string> = {};

    // Parse INFO field
    const info: Record<string, string> = {};
    infoStr.split(';').forEach(field => {
      const [key, value] = field.split('=');
      if (key) info[key] = value || 'true';
    });

    // Parse genotypes
    const sampleIndex = 9;
    for (let i = 0; i < sampleNames.length; i++) {
      const sampleData = parts[sampleIndex + i] || '';
      if (sampleData.includes(':')) {
        const gt = sampleData.split(':')[0];
        genotypes[sampleNames[i]] = gt;
      } else {
        genotypes[sampleNames[i]] = sampleData;
      }
    }

    const gene = info['GENE'] || info['gene'] || 'Unknown';
    const condition = info['COND'] || info['condition'] || info['DISEASE'] || 'Unknown';
    const isPathogenic = this.isPathogenicVariant(info, id);
    const isClinicallyRelevant = this.isClinicallyRelevant(gene, condition, info);

    // Calculate allele frequency from genotypes
    let alleleFreq = 0;
    let homoRef = 0, hetero = 0, homoAlt = 0;
    Object.values(genotypes).forEach(gt => {
      if (gt === '0/0' || gt === '0|0') homoRef++;
      else if (gt === '0/1' || gt === '0|1' || gt === '1/0' || gt === '1|0') hetero++;
      else if (gt === '1/1' || gt === '1|1') homoAlt++;
    });
    const total = Object.keys(genotypes).length;
    if (total > 0) {
      alleleFreq = (hetero + 2 * homoAlt) / (2 * total);
    }

    return {
      chrom,
      pos: parseInt(pos),
      id: id || `v${pos}`,
      ref,
      alt,
      qual: parseFloat(qual) || 0,
      filter: filter || 'PASS',
      info,
      gene,
      condition,
      genotypes,
      isPathogenic,
      isClinicallyRelevant,
      alleleFrequency: alleleFreq,
      zygosity: this.detectZygosity(genotypes)
    };
  }

  static isPathogenicVariant(info: Record<string, string>, id: string): boolean {
    const clnsig = info['CLNSIG'] || info['clnsig'] || '';
    const pathogenic = this.pathogenicKeywords.some(k => 
      clnsig.includes(k) || id.includes('pathogenic') || info['COND']?.includes('Risk')
    );
    return pathogenic || info['CARRIER'] === 'YES';
  }

  static isClinicallyRelevant(gene: string, condition: string, info: Record<string, string>): boolean {
    return this.clinicalGenes.has(gene) || 
           condition !== 'Unknown' || 
           info['CLNSIG'] !== undefined ||
           info['CARRIER'] === 'YES';
  }

  static detectZygosity(genotypes: Record<string, string>): string {
    const values = Object.values(genotypes);
    const hasHetero = values.some(g => g === '0/1' || g === '0|1' || g === '1/0' || g === '1|0');
    const hasHomoAlt = values.some(g => g === '1/1' || g === '1|1');
    if (hasHomoAlt) return 'HOMOZYGOUS_ALT';
    if (hasHetero) return 'HETEROZYGOUS';
    return 'HOMOZYGOUS_REF';
  }

  static calculateStats(variants: VCFVariant[], sampleNames: string[]): VCFStats {
    const stats: VCFStats = {
      totalVariants: variants.length,
      clinicallyRelevant: 0,
      pathogenic: 0,
      genes: {},
      conditions: {},
      genotypes: {
        homozygous_ref: 0,
        heterozygous: 0,
        homozygous_alt: 0
      },
      samples: sampleNames,
      qualityDistribution: {
        high: 0,
        medium: 0,
        low: 0
      },
      chromosomeDistribution: {}
    };

    variants.forEach(v => {
      if (v.isClinicallyRelevant) stats.clinicallyRelevant++;
      if (v.isPathogenic) stats.pathogenic++;
      
      // Gene distribution
      if (v.gene !== 'Unknown') {
        stats.genes[v.gene] = (stats.genes[v.gene] || 0) + 1;
      }
      
      // Condition distribution
      if (v.condition !== 'Unknown') {
        stats.conditions[v.condition] = (stats.conditions[v.condition] || 0) + 1;
      }
      
      // Chromosome distribution
      stats.chromosomeDistribution[v.chrom] = (stats.chromosomeDistribution[v.chrom] || 0) + 1;
      
      // Quality distribution
      if (v.qual >= 100) stats.qualityDistribution.high++;
      else if (v.qual >= 50) stats.qualityDistribution.medium++;
      else stats.qualityDistribution.low++;
      
      // Genotype distribution
      if (v.zygosity === 'HOMOZYGOUS_ALT') stats.genotypes.homozygous_alt++;
      else if (v.zygosity === 'HETEROZYGOUS') stats.genotypes.heterozygous++;
      else stats.genotypes.homozygous_ref++;
    });

    return stats;
  }
}

// ============================================================================
// 3. VCF PARSER COMPONENT
// ============================================================================

export const VCFParser: React.FC<VCFParserProps> = ({
  onDataParsed,
  onProcessingStart,
  onProcessingEnd
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [variants, setVariants] = useState<VCFVariant[]>([]);
  const [stats, setStats] = useState<VCFStats | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [fileInfo, setFileInfo] = useState<{ name: string; size: number } | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [filterText, setFilterText] = useState('');
  const [selectedGene, setSelectedGene] = useState<string>('all');
  const [showOnlyClinicallyRelevant, setShowOnlyClinicallyRelevant] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const maxSize = 50 * 1024 * 1024 * 1024; // 50GB
    if (file.size > maxSize) {
      setError(`File too large (${(file.size / (1024 * 1024 * 1024)).toFixed(2)}GB). Maximum is 50GB.`);
      return;
    }

    setFileInfo({
      name: file.name,
      size: file.size
    });
    setError(null);
    setIsProcessing(true);
    setProgress(0);

    if (onProcessingStart) onProcessingStart();

    try {
      const content = await file.text();
      const result = VCFParserEngine.parseVCF(content);
      
      setVariants(result.variants);
      setStats(result.stats);
      
      if (onDataParsed) {
        onDataParsed(result.variants, result.stats);
      }
      
      setIsProcessing(false);
      if (onProcessingEnd) onProcessingEnd();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to parse VCF');
      setIsProcessing(false);
      if (onProcessingEnd) onProcessingEnd();
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    if (bytes < 1024 * 1024 * 1024) return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
    return (bytes / (1024 * 1024 * 1024)).toFixed(2) + ' GB';
  };

  const getFilteredVariants = useCallback(() => {
    let filtered = variants;
    
    if (showOnlyClinicallyRelevant) {
      filtered = filtered.filter(v => v.isClinicallyRelevant);
    }
    
    if (selectedGene !== 'all') {
      filtered = filtered.filter(v => v.gene === selectedGene);
    }
    
    if (filterText) {
      const search = filterText.toLowerCase();
      filtered = filtered.filter(v => 
        v.gene.toLowerCase().includes(search) ||
        v.condition.toLowerCase().includes(search) ||
        v.id.toLowerCase().includes(search) ||
        v.chrom.includes(search)
      );
    }
    
    return filtered;
  }, [variants, filterText, selectedGene, showOnlyClinicallyRelevant]);

  const filteredVariants = getFilteredVariants();

  const geneOptions = useMemo(() => {
    if (!stats) return [];
    return Object.keys(stats.genes).sort();
  }, [stats]);

  return (
    <div className="bg-[#0a0a0c] border border-white/10 rounded-lg overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-white/10 flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-purple-500/10 rounded flex items-center justify-center">
            <Database className="w-4 h-4 text-purple-400" />
          </div>
          <div>
            <h4 className="text-xs font-mono text-white/80">VCF Parser</h4>
            <p className="text-[8px] text-white/40 font-mono">Multi-sample VCF · Clinical Annotation</p>
          </div>
        </div>
        {variants.length > 0 && (
          <div className="flex items-center gap-2 text-[8px] text-white/30 font-mono">
            <span className="text-emerald-400">{variants.length.toLocaleString()} variants</span>
            <span className="text-purple-400">{stats?.clinicallyRelevant || 0} clinical</span>
            <span className="text-red-400">{stats?.pathogenic || 0} pathogenic</span>
          </div>
        )}
      </div>

      <div className="p-4 space-y-4">
        {/* Drop Zone */}
        {!isProcessing && variants.length === 0 && !fileInfo && (
          <div
            className="border-2 border-dashed border-white/10 hover:border-purple-500/30 rounded-lg p-8 text-center cursor-pointer transition-all"
            onClick={() => fileInputRef.current?.click()}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              const file = e.dataTransfer.files[0];
              if (file) {
                const input = fileInputRef.current;
                if (input) {
                  const dt = new DataTransfer();
                  dt.items.add(file);
                  input.files = dt.files;
                  input.dispatchEvent(new Event('change'));
                }
              }
            }}
          >
            <FileUp className="w-12 h-12 text-purple-500/30 mx-auto mb-3" />
            <p className="text-sm text-white/60 font-mono">Drop your VCF file here</p>
            <p className="text-[10px] text-white/30 font-mono mt-1">
              Supports multi-sample VCF v4.0+ • Up to 50GB
            </p>
            <button className="mt-3 px-4 py-2 bg-purple-500/10 border border-purple-500/30 text-purple-400 text-xs font-mono hover:bg-purple-500/20 transition-all rounded">
              Browse Files
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".vcf"
              onChange={handleFileSelect}
              className="hidden"
            />
          </div>
        )}

        {/* File Info & Stats */}
        {variants.length > 0 && stats && (
          <div className="space-y-4">
            {/* Summary Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="bg-white/5 p-3 rounded border border-white/5 text-center">
                <div className="text-[8px] text-white/30 uppercase font-mono">Total Variants</div>
                <div className="text-xl font-light text-white">{stats.totalVariants.toLocaleString()}</div>
              </div>
              <div className="bg-purple-500/5 p-3 rounded border border-purple-500/20 text-center">
                <div className="text-[8px] text-white/30 uppercase font-mono">Clinical Relevant</div>
                <div className="text-xl font-light text-purple-400">{stats.clinicallyRelevant.toLocaleString()}</div>
              </div>
              <div className="bg-red-500/5 p-3 rounded border border-red-500/20 text-center">
                <div className="text-[8px] text-white/30 uppercase font-mono">Pathogenic</div>
                <div className="text-xl font-light text-red-400">{stats.pathogenic.toLocaleString()}</div>
              </div>
              <div className="bg-emerald-500/5 p-3 rounded border border-emerald-500/20 text-center">
                <div className="text-[8px] text-white/30 uppercase font-mono">Samples</div>
                <div className="text-xl font-light text-emerald-400">{stats.samples.length}</div>
              </div>
            </div>

            {/* Genotype Distribution */}
            <div className="grid grid-cols-3 gap-2">
              <div className="p-2 bg-emerald-500/5 rounded border border-emerald-500/20 text-center">
                <div className="text-[7px] text-emerald-400/60 font-mono">Homozygous Ref</div>
                <div className="text-sm font-light text-emerald-400">{stats.genotypes.homozygous_ref}</div>
              </div>
              <div className="p-2 bg-yellow-500/5 rounded border border-yellow-500/20 text-center">
                <div className="text-[7px] text-yellow-400/60 font-mono">Heterozygous</div>
                <div className="text-sm font-light text-yellow-400">{stats.genotypes.heterozygous}</div>
              </div>
              <div className="p-2 bg-red-500/5 rounded border border-red-500/20 text-center">
                <div className="text-[7px] text-red-400/60 font-mono">Homozygous Alt</div>
                <div className="text-sm font-light text-red-400">{stats.genotypes.homozygous_alt}</div>
              </div>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap items-center gap-2 p-2 bg-white/5 rounded border border-white/5">
              <div className="flex items-center gap-1.5 flex-1 min-w-[120px]">
                <Search className="w-3 h-3 text-white/30" />
                <input
                  type="text"
                  placeholder="Search genes, conditions..."
                  value={filterText}
                  onChange={(e) => setFilterText(e.target.value)}
                  className="bg-transparent border-none text-xs text-white/60 font-mono focus:outline-none w-full"
                />
              </div>
              
              <select
                value={selectedGene}
                onChange={(e) => setSelectedGene(e.target.value)}
                className="px-2 py-1 bg-white/5 border border-white/10 rounded text-[10px] text-white/60 font-mono focus:border-purple-500 outline-none"
              >
                <option value="all">All Genes</option>
                {geneOptions.map(gene => (
                  <option key={gene} value={gene}>{gene}</option>
                ))}
              </select>
              
              <label className="flex items-center gap-1.5 text-[10px] text-white/60 font-mono cursor-pointer">
                <input
                  type="checkbox"
                  checked={showOnlyClinicallyRelevant}
                  onChange={(e) => setShowOnlyClinicallyRelevant(e.target.checked)}
                  className="w-3 h-3 accent-purple-500 cursor-pointer"
                />
                Clinical Only
              </label>
            </div>

            {/* Variant List */}
            <div className="max-h-60 overflow-y-auto space-y-1 border border-white/5 rounded">
              {filteredVariants.length === 0 ? (
                <div className="p-4 text-center text-white/30 text-xs font-mono">
                  No variants match the current filters
                </div>
              ) : (
                filteredVariants.slice(0, 100).map((variant, idx) => (
                  <div
                    key={idx}
                    className={`p-2 border-b border-white/5 hover:bg-white/5 transition-all ${
                      variant.isPathogenic ? 'bg-red-500/5' :
                      variant.isClinicallyRelevant ? 'bg-purple-500/5' : ''
                    }`}
                  >
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-[10px] font-mono text-white/60">{variant.chrom}:{variant.pos}</span>
                        <span className="text-[10px] font-mono text-white/80 font-medium">{variant.gene}</span>
                        {variant.isPathogenic && (
                          <span className="text-[7px] px-1.5 py-0.5 bg-red-500/20 text-red-400 rounded font-mono">Pathogenic</span>
                        )}
                        {variant.isClinicallyRelevant && !variant.isPathogenic && (
                          <span className="text-[7px] px-1.5 py-0.5 bg-purple-500/20 text-purple-400 rounded font-mono">Clinical</span>
                        )}
                        {variant.zygosity && (
                          <span className={`text-[7px] px-1.5 py-0.5 rounded font-mono ${
                            variant.zygosity === 'HOMOZYGOUS_ALT' ? 'bg-red-500/20 text-red-400' :
                            variant.zygosity === 'HETEROZYGOUS' ? 'bg-yellow-500/20 text-yellow-400' :
                            'bg-emerald-500/20 text-emerald-400'
                          }`}>
                            {variant.zygosity.replace('_', ' ')}
                          </span>
                        )}
                      </div>
                      <div className="text-[8px] text-white/30 font-mono">
                        {variant.condition !== 'Unknown' ? variant.condition : '—'}
                      </div>
                    </div>
                    {variant.alleleFrequency !== undefined && variant.alleleFrequency > 0 && (
                      <div className="text-[7px] text-white/20 font-mono mt-0.5">
                        AF: {(variant.alleleFrequency * 100).toFixed(2)}%
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
            {filteredVariants.length > 100 && (
              <div className="text-[8px] text-white/20 font-mono text-center">
                Showing 100 of {filteredVariants.length.toLocaleString()} variants
              </div>
            )}

            {/* Export Button */}
            <button
              onClick={() => {
                const data = {
                  variants: filteredVariants,
                  stats,
                  exportedAt: new Date().toISOString()
                };
                const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `genetix_vcf_analysis_${new Date().toISOString().slice(0, 10)}.json`;
                a.click();
                URL.revokeObjectURL(url);
              }}
              className="w-full py-2 bg-purple-500/10 border border-purple-500/30 text-purple-400 text-xs font-mono hover:bg-purple-500/20 transition-all rounded flex items-center justify-center gap-2"
            >
              <Download className="w-3 h-3" />
              Export Analysis JSON
            </button>
          </div>
        )}

        {/* Processing State */}
        {isProcessing && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 text-purple-400 animate-spin" />
                <span className="text-xs font-mono text-white/60">Parsing VCF...</span>
              </div>
              <span className="text-[10px] text-white/40 font-mono">{progress.toFixed(0)}%</span>
            </div>
            <div className="w-full h-2 bg-white/10 rounded overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-purple-500 to-emerald-500 transition-all duration-500"
                style={{ width: `${Math.min(progress, 100)}%` }}
              />
            </div>
          </div>
        )}

        {/* Error Display */}
        {error && (
          <div className="p-3 bg-red-500/10 border border-red-500/20 rounded flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
            <div className="text-xs text-red-400 font-mono">{error}</div>
            <button
              onClick={() => setError(null)}
              className="ml-auto text-red-400/60 hover:text-red-400"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default VCFParser;