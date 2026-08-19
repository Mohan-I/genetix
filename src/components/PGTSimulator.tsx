// src/components/PGTSimulator.tsx
import React, { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import {
  Dna,
  AlertCircle,
  CheckCircle,
  Info,
  TrendingUp,
  TrendingDown,
  Activity,
  Heart,
  Clock,
  Users,
  BarChart3,
  Calendar,
  Shield,
  Zap,
  ChevronRight,
  ChevronLeft,
  FileUp,
  Loader2,
  Database,
  HardDrive,
  Cpu,
  FileText,
  AlertTriangle,
  X,
  Download,
  Printer,
  Share2
} from 'lucide-react';
import { VCFParser } from './VCFParser';

// ============================================================================
// 1. TYPES
// ============================================================================

interface PGTResults {
  embryoCount: number;
  unaffected: { count: number; percentage: number; };
  carriers: { count: number; percentage: number; };
  affected: { count: number; percentage: number; };
  aneuploid: { count: number; percentage: number; };
  mosaic: { count: number; percentage: number; };
  recommendations: string[];
  riskSummary: string;
}

interface PGTSimulatorProps {
  maternalAge: number;
  paternalAge: number;
  isCarrierConcordant: boolean;
  recessiveGene: string;
  onResultsGenerated?: (results: PGTResults) => void;
}

interface FileProcessingProgress {
  fileName: string;
  processedLines: number;
  totalLines: number;
  percentage: number;
  variantsFound: number;
  speed: number;
  estimatedTimeRemaining: number;
}

// ============================================================================
// 2. PGT ENGINE
// ============================================================================

class PGTEngine {
  static calculateAneuploidyRisk(age: number): number {
    const baseRisk = 0.02;
    if (age < 30) return baseRisk + 0.01;
    if (age < 35) return baseRisk + 0.03;
    if (age < 38) return baseRisk + 0.06;
    if (age < 40) return baseRisk + 0.10;
    if (age < 42) return baseRisk + 0.18;
    if (age < 44) return baseRisk + 0.30;
    if (age < 46) return baseRisk + 0.45;
    return baseRisk + 0.60;
  }

  static calculateEmbryoYield(age: number): number {
    if (age < 30) return 12;
    if (age < 35) return 10;
    if (age < 38) return 8;
    if (age < 40) return 6;
    if (age < 42) return 4;
    if (age < 44) return 3;
    return 2;
  }

  static calculatePGTM(
    isCarrierConcordant: boolean,
    embryoCount: number,
    maternalAge: number
  ): {
    unaffected: number;
    carriers: number;
    affected: number;
  } {
    if (!isCarrierConcordant) {
      const affectedRate = 0.01;
      return {
        unaffected: Math.round(embryoCount * (1 - affectedRate)),
        carriers: 0,
        affected: Math.round(embryoCount * affectedRate)
      };
    }

    const unaffected = Math.round(embryoCount * 0.25);
    const carriers = Math.round(embryoCount * 0.50);
    const affected = Math.round(embryoCount * 0.25);

    return { unaffected, carriers, affected };
  }

  static calculatePGTA(
    embryoCount: number,
    maternalAge: number
  ): {
    euploid: number;
    aneuploid: number;
    mosaic: number;
  } {
    const aneuploidyRate = this.calculateAneuploidyRisk(maternalAge);
    const mosaicRate = 0.05;
    
    return {
      euploid: Math.round(embryoCount * (1 - aneuploidyRate - mosaicRate)),
      aneuploid: Math.round(embryoCount * aneuploidyRate),
      mosaic: Math.round(embryoCount * mosaicRate)
    };
  }

  static generateResults(
    maternalAge: number,
    paternalAge: number,
    isCarrierConcordant: boolean,
    recessiveGene: string = 'CFTR'
  ): PGTResults {
    const embryoCount = this.calculateEmbryoYield(maternalAge);
    
    const pgtm = this.calculatePGTM(isCarrierConcordant, embryoCount, maternalAge);
    const pgta = this.calculatePGTA(embryoCount, maternalAge);
    const total = embryoCount;
    
    const recommendations: string[] = [];
    
    if (isCarrierConcordant) {
      recommendations.push(
        `⚠️ Both parents are carriers for ${recessiveGene} - 25% affected-embryo risk per conception`
      );
      recommendations.push('✅ PGT-M is strongly recommended for all cycle embryos');
    } else {
      recommendations.push('✅ No autosomal recessive carrier concordance detected');
      recommendations.push('📋 Population-level risk only for recessive conditions');
    }
    
    if (maternalAge >= 35) {
      recommendations.push(
        `⚠️ Advanced maternal age (${maternalAge}) - PGT-A recommended due to increased aneuploidy risk`
      );
    }
    
    if (maternalAge >= 38) {
      recommendations.push(
        '📊 Consider CCS (Comprehensive Chromosome Screening) for all embryos'
      );
    }
    
    recommendations.push(
      '🔬 Orthogonal CLIA/CAP-accredited sequencing confirmation recommended',
      '🧬 Genetic counselling advised to review reproductive options'
    );
    
    const affectedRate = (pgtm.affected / total) * 100;
    const aneuploidRate = (pgta.aneuploid / total) * 100;
    
    let riskSummary = '';
    if (affectedRate > 15) {
      riskSummary = `High risk (${affectedRate.toFixed(0)}% affected embryos) - PGT-M strongly advised`;
    } else if (affectedRate > 5) {
      riskSummary = `Moderate risk (${affectedRate.toFixed(0)}% affected embryos) - PGT-M recommended`;
    } else {
      riskSummary = `Low risk (${affectedRate.toFixed(0)}% affected embryos) - Standard screening sufficient`;
    }
    
    if (aneuploidRate > 30) {
      riskSummary += `, High aneuploidy risk (${aneuploidRate.toFixed(0)}%) - PGT-A recommended`;
    }

    return {
      embryoCount: total,
      unaffected: {
        count: pgtm.unaffected,
        percentage: (pgtm.unaffected / total) * 100
      },
      carriers: {
        count: pgtm.carriers,
        percentage: (pgtm.carriers / total) * 100
      },
      affected: {
        count: pgtm.affected,
        percentage: (pgtm.affected / total) * 100
      },
      aneuploid: {
        count: pgta.aneuploid,
        percentage: (pgta.aneuploid / total) * 100
      },
      mosaic: {
        count: pgta.mosaic,
        percentage: (pgta.mosaic / total) * 100
      },
      recommendations,
      riskSummary
    };
  }
}

// ============================================================================
// 3. PGT SIMULATOR COMPONENT
// ============================================================================

export const PGTSimulator: React.FC<PGTSimulatorProps> = ({
  maternalAge: initialMaternalAge = 28,
  paternalAge: initialPaternalAge = 30,
  isCarrierConcordant = false,
  recessiveGene = 'CFTR',
  onResultsGenerated
}) => {
  const [maternalAge, setMaternalAge] = useState(initialMaternalAge);
  const [paternalAge, setPaternalAge] = useState(initialPaternalAge);
  const [selectedRecessive, setSelectedRecessive] = useState(recessiveGene);
  const [showAllResults, setShowAllResults] = useState(false);
  const [isCarrier, setIsCarrier] = useState(isCarrierConcordant);
  const [importedVariants, setImportedVariants] = useState<any[]>([]);
  const [showFileProcessor, setShowFileProcessor] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [isProcessingVCF, setIsProcessingVCF] = useState(false);
  
  const recessiveConditions = [
    { gene: 'CFTR', disease: 'Cystic Fibrosis', prevalence: 0.04 },
    { gene: 'HBB', disease: 'Sickle Cell Anemia', prevalence: 0.02 },
    { gene: 'SMN1', disease: 'Spinal Muscular Atrophy', prevalence: 0.01 },
    { gene: 'HEXA', disease: 'Tay-Sachs Disease', prevalence: 0.005 },
    { gene: 'FXN', disease: 'Friedreich Ataxia', prevalence: 0.015 },
    { gene: 'BRCA1', disease: 'Breast Cancer', prevalence: 0.02 },
    { gene: 'BRCA2', disease: 'Breast Cancer', prevalence: 0.018 }
  ];

  // FIXED: Handle undefined disease property
  const results = useMemo(() => {
    // Check if imported variants contain relevant genes
    const hasRelevantVariant = importedVariants.some(v => {
      const disease = v.disease || v.condition || '';
      return v.gene === selectedRecessive || 
             disease.includes(recessiveConditions.find(c => c.gene === selectedRecessive)?.disease || '');
    });
    
    const actualCarrierStatus = isCarrier || hasRelevantVariant;
    
    return PGTEngine.generateResults(
      maternalAge,
      paternalAge,
      actualCarrierStatus,
      selectedRecessive
    );
  }, [maternalAge, paternalAge, isCarrier, selectedRecessive, importedVariants]);

  useEffect(() => {
    if (onResultsGenerated) {
      onResultsGenerated(results);
    }
  }, [results, onResultsGenerated]);

  const handleVariantsProcessed = (variants: any[]) => {
    setImportedVariants(variants);
    // Check if any variants match the selected recessive gene
    const hasMatch = variants.some(v => {
      const disease = v.disease || v.condition || '';
      return v.gene === selectedRecessive || 
             disease.includes(recessiveConditions.find(c => c.gene === selectedRecessive)?.disease || '');
    });
    if (hasMatch) {
      setIsCarrier(true);
    }
  };

  const generateReport = () => {
    setShowReportModal(true);
  };

  const downloadReport = () => {
    const reportData = {
      reportType: 'PGT Assessment',
      generated: new Date().toISOString(),
      couple: {
        maternalAge,
        paternalAge,
        isCarrierConcordant: isCarrier,
        recessiveGene: selectedRecessive
      },
      results,
      importedVariants: importedVariants.map(v => ({
        gene: v.gene || 'Unknown',
        disease: v.disease || v.condition || 'Unknown',
        zygosity: v.zygosity || 'Unknown',
        isPathogenic: v.isPathogenic || false
      })),
      clinicalRecommendations: results.recommendations
    };

    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `pgt_report_${new Date().toISOString().slice(0, 19).replace(/:/g, '-')}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setShowReportModal(false);
  };

  const printReport = () => {
    window.print();
  };

  const getRiskColor = (percentage: number, high: number = 30, medium: number = 15) => {
    if (percentage > high) return 'text-red-400';
    if (percentage > medium) return 'text-yellow-400';
    return 'text-emerald-400';
  };

  const getRiskBgColor = (percentage: number, high: number = 30, medium: number = 15) => {
    if (percentage > high) return 'bg-red-500/20 border-red-500/30';
    if (percentage > medium) return 'bg-yellow-500/20 border-yellow-500/30';
    return 'bg-emerald-500/20 border-emerald-500/30';
  };

  // Report Modal
  const ReportModal: React.FC = () => {
    if (!showReportModal) return null;

    return (
      <div className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-[9999] p-4">
        <div className="bg-[#0a0a0c] border border-white/10 p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto relative z-[10000]">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-sm font-mono text-white/80 flex items-center gap-2">
              <FileText className="w-4 h-4 text-emerald-500" />
              PGT Assessment Report
            </h3>
            <button
              onClick={() => setShowReportModal(false)}
              className="text-white/40 hover:text-white/80 transition-colors p-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-6">
            {/* Header */}
            <div className="border-b border-white/10 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-emerald-500/10 rounded flex items-center justify-center">
                  <Dna className="w-5 h-5 text-emerald-500" />
                </div>
                <div>
                  <h2 className="text-lg font-light text-white/90">GENETIX PGT Report</h2>
                  <p className="text-[10px] text-white/40 font-mono">Preimplantation Genetic Testing Assessment</p>
                </div>
              </div>
              <div className="mt-3 grid grid-cols-2 md:grid-cols-4 gap-2 text-[10px] text-white/40 font-mono">
                <div>Generated: {new Date().toLocaleString()}</div>
                <div>Maternal Age: {maternalAge}</div>
                <div>Paternal Age: {paternalAge}</div>
                <div>Gene: {selectedRecessive}</div>
              </div>
            </div>

            {/* Carrier Status */}
            <div className={`p-4 rounded border ${
              isCarrier ? 'bg-yellow-500/10 border-yellow-500/30' : 'bg-emerald-500/10 border-emerald-500/30'
            }`}>
              <div className="flex items-center gap-3">
                {isCarrier ? (
                  <AlertCircle className="w-5 h-5 text-yellow-400" />
                ) : (
                  <CheckCircle className="w-5 h-5 text-emerald-400" />
                )}
                <div>
                  <div className="text-sm font-medium text-white/90">
                    {isCarrier ? '⚠️ Carrier Concordance Detected' : '✅ No Carrier Concordance'}
                  </div>
                  <div className="text-[10px] text-white/40 font-mono">
                    {isCarrier 
                      ? `Both parents are carriers for ${selectedRecessive} - 25% affected-embryo risk`
                      : 'Population-level risk only for recessive conditions'}
                  </div>
                </div>
              </div>
            </div>

            {/* Embryo Metrics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="bg-white/5 p-3 rounded border border-white/5 text-center">
                <div className="text-[8px] text-white/30 uppercase font-mono">Embryos</div>
                <div className="text-2xl font-light text-white">{results.embryoCount}</div>
              </div>
              <div className="bg-emerald-500/5 p-3 rounded border border-emerald-500/20 text-center">
                <div className="text-[8px] text-white/30 uppercase font-mono">Unaffected</div>
                <div className="text-2xl font-light text-emerald-400">{results.unaffected.count}</div>
                <div className="text-[8px] text-emerald-400/60">{results.unaffected.percentage.toFixed(0)}%</div>
              </div>
              <div className="bg-yellow-500/5 p-3 rounded border border-yellow-500/20 text-center">
                <div className="text-[8px] text-white/30 uppercase font-mono">Carriers</div>
                <div className="text-2xl font-light text-yellow-400">{results.carriers.count}</div>
                <div className="text-[8px] text-yellow-400/60">{results.carriers.percentage.toFixed(0)}%</div>
              </div>
              <div className={`p-3 rounded border text-center ${
                results.affected.count > 1 ? 'bg-red-500/5 border-red-500/20' : 'bg-emerald-500/5 border-emerald-500/20'
              }`}>
                <div className="text-[8px] text-white/30 uppercase font-mono">Affected</div>
                <div className={`text-2xl font-light ${
                  results.affected.count > 1 ? 'text-red-400' : 'text-emerald-400'
                }`}>
                  {results.affected.count}
                </div>
                <div className={`text-[8px] ${
                  results.affected.count > 1 ? 'text-red-400/60' : 'text-emerald-400/60'
                }`}>
                  {results.affected.percentage.toFixed(0)}%
                </div>
              </div>
            </div>

            {/* Recommendations */}
            <div>
              <div className="text-[10px] text-white/40 uppercase font-mono tracking-wider mb-2">
                Clinical Recommendations
              </div>
              <ul className="space-y-1 bg-white/5 p-3 rounded border border-white/5">
                {results.recommendations.map((rec, idx) => (
                  <li key={idx} className="text-[10px] text-white/60 font-mono flex items-start gap-2">
                    <span className="text-emerald-500 mt-0.5">▸</span>
                    {rec}
                  </li>
                ))}
              </ul>
            </div>

            {/* Imported Variants Summary */}
            {importedVariants.length > 0 && (
              <div>
                <div className="text-[10px] text-white/40 uppercase font-mono tracking-wider mb-2">
                  Imported Variants ({importedVariants.length})
                </div>
                <div className="max-h-40 overflow-y-auto space-y-1 bg-white/5 p-2 rounded border border-white/5">
                  {importedVariants.slice(0, 20).map((v, idx) => (
                    <div key={idx} className="flex items-center justify-between text-[9px] font-mono">
                      <span className="text-white/60">{v.gene || 'Unknown'}</span>
                      <span className="text-white/40">{v.disease || v.condition || '—'}</span>
                      <span className={`text-[7px] px-1.5 py-0.5 rounded ${
                        v.isPathogenic ? 'bg-red-500/20 text-red-400' : 'bg-white/10 text-white/30'
                      }`}>
                        {v.zygosity || 'Unknown'}
                      </span>
                    </div>
                  ))}
                  {importedVariants.length > 20 && (
                    <div className="text-[8px] text-white/20 font-mono text-center">
                      +{importedVariants.length - 20} more variants
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Disclaimer */}
            <div className="p-3 bg-red-500/5 border border-red-500/20 rounded">
              <p className="text-[8px] text-white/30 font-mono leading-relaxed">
                ⚠️ This report is generated for educational purposes only. Genetic outcomes are probabilistic and actual results may vary. 
                Not intended for clinical decision-making. Always consult with qualified healthcare providers for medical advice.
              </p>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-4 border-t border-white/10">
              <button
                onClick={downloadReport}
                className="flex-1 py-2 bg-emerald-500 hover:bg-emerald-400 text-[#0a0a0c] text-xs font-mono font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2"
              >
                <Download className="w-3 h-3" />
                Download Report
              </button>
              <button
                onClick={printReport}
                className="flex-1 py-2 bg-white/5 hover:bg-white/10 text-white/60 text-xs font-mono transition-all flex items-center justify-center gap-2"
              >
                <Printer className="w-3 h-3" />
                Print
              </button>
              <button
                onClick={() => setShowReportModal(false)}
                className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white/40 text-xs font-mono transition-all"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-[#0a0a0c] border border-white/10 rounded-lg overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-white/10 flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-emerald-500/10 rounded flex items-center justify-center">
            <Dna className="w-4 h-4 text-emerald-500" />
          </div>
          <div>
            <h3 className="text-sm font-mono text-white/80">PGT Simulator</h3>
            <p className="text-[10px] text-white/40 font-mono">Preimplantation Genetic Testing</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowFileProcessor(!showFileProcessor)}
            className="text-[8px] text-purple-400 hover:text-purple-300 font-mono transition-all flex items-center gap-1 px-2 py-1 bg-purple-500/10 border border-purple-500/30 rounded"
          >
            <HardDrive className="w-3 h-3" />
            {showFileProcessor ? 'Hide Importer' : 'Import Data'}
          </button>
          <button
            onClick={generateReport}
            className="text-[8px] text-emerald-400 hover:text-emerald-300 font-mono transition-all flex items-center gap-1 px-2 py-1 bg-emerald-500/10 border border-emerald-500/30 rounded"
          >
            <FileText className="w-3 h-3" />
            Generate Report
          </button>
          <span className="text-[8px] text-emerald-500/60 bg-emerald-500/10 px-2 py-0.5 rounded font-mono">
            v2.0
          </span>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* File Processor */}
        {showFileProcessor && (
          <VCFParser
            onDataParsed={(variants, stats) => {
              console.log('📊 VCF Parsed:', { variants: variants.length, stats });
              const clinicalVariants = variants.filter(v => v.isClinicallyRelevant);
              handleVariantsProcessed(clinicalVariants);
              setIsProcessingVCF(false);
            }}
            onProcessingStart={() => {
              console.log('⏳ Processing VCF...');
              setIsProcessingVCF(true);
            }}
            onProcessingEnd={() => {
              console.log('✅ VCF Processing complete');
              setIsProcessingVCF(false);
            }}
          />
        )}

        {/* Imported Variants Summary */}
        {importedVariants.length > 0 && (
          <div className="p-2 bg-purple-500/5 border border-purple-500/20 rounded flex items-center justify-between">
            <span className="text-[10px] text-purple-400 font-mono">
              {importedVariants.length.toLocaleString()} clinically relevant variants imported
            </span>
            <span className="text-[8px] text-purple-400/60 font-mono">
              {importedVariants.filter(v => v.isPathogenic).length} pathogenic
            </span>
          </div>
        )}

        {/* Controls */}
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-[10px] text-white/40 uppercase font-mono tracking-wider">
                Maternal Age
              </label>
              <span className="text-sm font-light text-white/80">{maternalAge}</span>
            </div>
            <input
              type="range"
              min="18"
              max="45"
              value={maternalAge}
              onChange={(e) => setMaternalAge(parseInt(e.target.value))}
              className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-emerald-500"
            />
            <div className="flex justify-between text-[7px] text-white/20 font-mono">
              <span>18</span>
              <span>35</span>
              <span>45</span>
            </div>
            <div className="text-[8px] text-white/30 font-mono">
              {maternalAge >= 35 ? '⚠️ Advanced maternal age' : '✅ Optimal age range'}
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-[10px] text-white/40 uppercase font-mono tracking-wider">
                Paternal Age
              </label>
              <span className="text-sm font-light text-white/80">{paternalAge}</span>
            </div>
            <input
              type="range"
              min="18"
              max="55"
              value={paternalAge}
              onChange={(e) => setPaternalAge(parseInt(e.target.value))}
              className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-emerald-500"
            />
            <div className="flex justify-between text-[7px] text-white/20 font-mono">
              <span>18</span>
              <span>35</span>
              <span>55</span>
            </div>
            <div className="text-[8px] text-white/30 font-mono">
              {paternalAge >= 40 ? '⚠️ Advanced paternal age' : '✅ Normal range'}
            </div>
          </div>
        </div>

        {/* Carrier Concordance */}
        <div className="flex flex-wrap items-center gap-4 p-3 bg-white/5 rounded border border-white/5">
          <div className="flex items-center gap-3">
            <label className="text-[10px] text-white/40 uppercase font-mono tracking-wider">
              Carrier Concordance
            </label>
            <button
              onClick={() => setIsCarrier(!isCarrier)}
              className={`relative w-10 h-5 rounded-full transition-all ${
                isCarrier ? 'bg-emerald-500' : 'bg-white/20'
              }`}
            >
              <div
                className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition-all ${
                  isCarrier ? 'right-0.5' : 'left-0.5'
                }`}
              />
            </button>
          </div>
          
          <select
            value={selectedRecessive}
            onChange={(e) => setSelectedRecessive(e.target.value)}
            className="px-3 py-1 bg-white/5 border border-white/10 rounded text-xs text-white/80 font-mono focus:border-emerald-500 outline-none"
          >
            {recessiveConditions.map(cond => (
              <option key={cond.gene} value={cond.gene}>
                {cond.gene} ({cond.disease})
              </option>
            ))}
          </select>
          
          <span className={`text-[8px] font-mono ${
            isCarrier ? 'text-yellow-400' : 'text-emerald-400'
          }`}>
            {isCarrier ? '⚠️ Both carriers' : '✅ No concordance'}
          </span>
        </div>

        {/* Results Summary */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="p-3 bg-white/5 rounded border border-white/5 text-center">
            <div className="text-[8px] text-white/30 uppercase font-mono">Embryos</div>
            <div className="text-xl font-light text-white">{results.embryoCount}</div>
            <div className="text-[7px] text-white/20">Projected yield</div>
          </div>
          <div className="p-3 bg-emerald-500/5 rounded border border-emerald-500/20 text-center">
            <div className="text-[8px] text-white/30 uppercase font-mono">Unaffected</div>
            <div className="text-xl font-light text-emerald-400">{results.unaffected.count}</div>
            <div className="text-[7px] text-emerald-400/60">{results.unaffected.percentage.toFixed(0)}%</div>
          </div>
          <div className="p-3 bg-yellow-500/5 rounded border border-yellow-500/20 text-center">
            <div className="text-[8px] text-white/30 uppercase font-mono">Carriers</div>
            <div className="text-xl font-light text-yellow-400">{results.carriers.count}</div>
            <div className="text-[7px] text-yellow-400/60">{results.carriers.percentage.toFixed(0)}%</div>
          </div>
          <div className={`p-3 rounded border text-center ${
            results.affected.count > 1 ? 'bg-red-500/5 border-red-500/20' : 'bg-emerald-500/5 border-emerald-500/20'
          }`}>
            <div className="text-[8px] text-white/30 uppercase font-mono">Affected</div>
            <div className={`text-xl font-light ${
              results.affected.count > 1 ? 'text-red-400' : 'text-emerald-400'
            }`}>
              {results.affected.count}
            </div>
            <div className={`text-[7px] ${
              results.affected.count > 1 ? 'text-red-400/60' : 'text-emerald-400/60'
            }`}>
              {results.affected.percentage.toFixed(0)}%
            </div>
          </div>
        </div>

        {/* Extended Results */}
        <button
          onClick={() => setShowAllResults(!showAllResults)}
          className="w-full py-2 text-[10px] text-white/40 hover:text-white/60 font-mono uppercase tracking-wider transition-all flex items-center justify-center gap-2 border border-white/5 hover:border-white/10 rounded"
        >
          {showAllResults ? 'Hide Detailed Results' : 'Show Detailed Results'}
          {showAllResults ? <ChevronLeft className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
        </button>

        {showAllResults && (
          <div className="space-y-4 pt-2 border-t border-white/5">
            <div>
              <div className="text-[10px] text-white/40 uppercase font-mono tracking-wider mb-2">
                PGT-A (Aneuploidy Screening)
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div className="p-2 bg-emerald-500/5 rounded border border-emerald-500/20 text-center">
                  <div className="text-[7px] text-white/30 uppercase font-mono">Euploid</div>
                  <div className="text-lg font-light text-emerald-400">{results.aneuploid.count}</div>
                  <div className="text-[7px] text-emerald-400/60">{results.aneuploid.percentage.toFixed(0)}%</div>
                </div>
                <div className="p-2 bg-red-500/5 rounded border border-red-500/20 text-center">
                  <div className="text-[7px] text-white/30 uppercase font-mono">Aneuploid</div>
                  <div className="text-lg font-light text-red-400">{results.aneuploid.count}</div>
                  <div className="text-[7px] text-red-400/60">{results.aneuploid.percentage.toFixed(0)}%</div>
                </div>
                <div className="p-2 bg-yellow-500/5 rounded border border-yellow-500/20 text-center">
                  <div className="text-[7px] text-white/30 uppercase font-mono">Mosaic</div>
                  <div className="text-lg font-light text-yellow-400">{results.mosaic.count}</div>
                  <div className="text-[7px] text-yellow-400/60">{results.mosaic.percentage.toFixed(0)}%</div>
                </div>
              </div>
            </div>

            <div className={`p-3 rounded border ${getRiskBgColor(results.affected.percentage)}`}>
              <div className="flex items-start gap-2">
                {results.affected.percentage > 15 ? (
                  <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                ) : results.affected.percentage > 5 ? (
                  <Info className="w-4 h-4 text-yellow-400 flex-shrink-0 mt-0.5" />
                ) : (
                  <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                )}
                <div>
                  <div className="text-sm font-light text-white/90">{results.riskSummary}</div>
                  <div className="text-[8px] text-white/40 font-mono mt-1">
                    Based on {results.embryoCount} projected embryos
                  </div>
                </div>
              </div>
            </div>

            <div>
              <div className="text-[10px] text-white/40 uppercase font-mono tracking-wider mb-2">
                Clinical Recommendations
              </div>
              <ul className="space-y-1">
                {results.recommendations.map((rec, idx) => (
                  <li key={idx} className="text-[9px] text-white/60 font-mono flex items-start gap-2">
                    <span className="text-emerald-500 mt-0.5">▸</span>
                    {rec}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        <div className="pt-2 border-t border-white/5 flex gap-3">
          <button
            onClick={generateReport}
            className="flex-1 py-2 bg-emerald-500 hover:bg-emerald-400 text-[#0a0a0c] text-xs font-mono font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2"
          >
            <BarChart3 className="w-3 h-3" />
            Generate PGT Report
          </button>
          <button
            onClick={() => {
              setMaternalAge(28);
              setPaternalAge(30);
              setIsCarrier(false);
              setSelectedRecessive('CFTR');
              setImportedVariants([]);
            }}
            className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white/60 text-xs font-mono transition-all"
          >
            Reset
          </button>
        </div>
      </div>

      {/* Report Modal */}
      <ReportModal />
    </div>
  );
};

export default PGTSimulator;