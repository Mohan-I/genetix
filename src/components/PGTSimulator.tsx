// src/components/PGTSimulator.tsx
import React, { useState, useMemo, useCallback } from 'react';
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
  ChevronLeft
} from 'lucide-react';

// ============================================================================
// 1. TYPES
// ============================================================================

interface PGTResults {
  embryoCount: number;
  unaffected: {
    count: number;
    percentage: number;
  };
  carriers: {
    count: number;
    percentage: number;
  };
  affected: {
    count: number;
    percentage: number;
  };
  aneuploid: {
    count: number;
    percentage: number;
  };
  mosaic: {
    count: number;
    percentage: number;
  };
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

// ============================================================================
// 2. PGT ENGINE
// ============================================================================

class PGTEngine {
  /**
   * Calculate aneuploidy risk based on maternal age
   * Based on clinical population data
   */
  static calculateAneuploidyRisk(age: number): number {
    // Clinical data: aneuploidy increases with maternal age
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

  /**
   * Calculate expected embryo yield
   */
  static calculateEmbryoYield(age: number): number {
    // Expected number of embryos based on age
    if (age < 30) return 12;
    if (age < 35) return 10;
    if (age < 38) return 8;
    if (age < 40) return 6;
    if (age < 42) return 4;
    if (age < 44) return 3;
    return 2;
  }

  /**
   * Calculate PGT-M outcomes for monogenic disorders
   */
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
      // Population risk (1-2%)
      const affectedRate = 0.01;
      return {
        unaffected: Math.round(embryoCount * (1 - affectedRate)),
        carriers: 0,
        affected: Math.round(embryoCount * affectedRate)
      };
    }

    // Both parents are carriers - Mendelian ratio
    const unaffected = Math.round(embryoCount * 0.25);
    const carriers = Math.round(embryoCount * 0.50);
    const affected = Math.round(embryoCount * 0.25);

    return { unaffected, carriers, affected };
  }

  /**
   * Calculate PGT-A outcomes
   */
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

  /**
   * Generate comprehensive PGT results
   */
  static generateResults(
    maternalAge: number,
    paternalAge: number,
    isCarrierConcordant: boolean,
    recessiveGene: string = 'CFTR'
  ): PGTResults {
    const embryoCount = this.calculateEmbryoYield(maternalAge);
    
    // PGT-M results
    const pgtm = this.calculatePGTM(isCarrierConcordant, embryoCount, maternalAge);
    
    // PGT-A results
    const pgta = this.calculatePGTA(embryoCount, maternalAge);
    
    // Calculate percentages
    const total = embryoCount;
    
    // Build recommendations
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
    
    // Add standard recommendations
    recommendations.push(
      '🔬 Orthogonal CLIA/CAP-accredited sequencing confirmation recommended',
      '🧬 Genetic counselling advised to review reproductive options'
    );
    
    // Calculate risk summary
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
// 3. REACT COMPONENT
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
  
  // Simulate carrier concordance toggle
  const [isCarrier, setIsCarrier] = useState(isCarrierConcordant);
  
  // Known recessive conditions
  const recessiveConditions = [
    { gene: 'CFTR', disease: 'Cystic Fibrosis', prevalence: 0.04 },
    { gene: 'HBB', disease: 'Sickle Cell Anemia', prevalence: 0.02 },
    { gene: 'SMN1', disease: 'Spinal Muscular Atrophy', prevalence: 0.01 },
    { gene: 'HEXA', disease: 'Tay-Sachs Disease', prevalence: 0.005 },
    { gene: 'FXN', disease: 'Friedreich Ataxia', prevalence: 0.015 },
    { gene: 'BRCA1', disease: 'Breast Cancer', prevalence: 0.02 },
    { gene: 'BRCA2', disease: 'Breast Cancer', prevalence: 0.018 }
  ];

  // Calculate results when inputs change
  const results = useMemo(() => {
    return PGTEngine.generateResults(
      maternalAge,
      paternalAge,
      isCarrier,
      selectedRecessive
    );
  }, [maternalAge, paternalAge, isCarrier, selectedRecessive]);

  // Notify parent when results change
  React.useEffect(() => {
    if (onResultsGenerated) {
      onResultsGenerated(results);
    }
  }, [results, onResultsGenerated]);

  // Get color for risk level
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

  return (
    <div className="bg-[#0a0a0c] border border-white/10 rounded-lg overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-emerald-500/10 rounded flex items-center justify-center">
            <Dna className="w-4 h-4 text-emerald-500" />
          </div>
          <div>
            <h3 className="text-sm font-mono text-white/80">PGT Simulator</h3>
            <p className="text-[10px] text-white/40 font-mono">Preimplantation Genetic Testing</p>
          </div>
        </div>
        <span className="text-[8px] text-emerald-500/60 bg-emerald-500/10 px-2 py-0.5 rounded font-mono">
          v2.0
        </span>
      </div>

      <div className="p-4 space-y-4">
        {/* Controls */}
        <div className="grid md:grid-cols-2 gap-4">
          {/* Maternal Age Slider */}
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

          {/* Paternal Age Slider */}
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
            {/* PGT-A Results */}
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

            {/* Risk Summary */}
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

            {/* Recommendations */}
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

        {/* Call to Action */}
        <div className="pt-2 border-t border-white/5 flex gap-3">
          <button
            onClick={() => {
              // Generate report action
              alert('📊 PGT Report generated!');
            }}
            className="flex-1 py-2 bg-emerald-500 hover:bg-emerald-400 text-[#0a0a0c] text-xs font-mono font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2"
          >
            <BarChart3 className="w-3 h-3" />
            Generate PGT Report
          </button>
          <button
            onClick={() => {
              // Reset to defaults
              setMaternalAge(28);
              setPaternalAge(30);
              setIsCarrier(false);
              setSelectedRecessive('CFTR');
            }}
            className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white/60 text-xs font-mono transition-all"
          >
            Reset
          </button>
        </div>
      </div>
    </div>
  );
};

export default PGTSimulator;