// src/pages/MainApp.tsx - Corrected version
import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { FlaskConical, RefreshCw, AlertCircle, Thermometer, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import { ParentProfile, BloodType, EyeColor, HairTexture, PathologyStatus } from '../types';
import { ParentInput } from '../components/ParentInput';
import { ProbabilityChart } from '../components/ProbabilityChart';
import { RhIncompatibilityWarning } from '../components/RhIncompatibilityWarning';
import {
  calculateBloodTypeProbabilities,
  calculateEyeColorProbabilities,
  calculatePathologyRisks,
  checkRhIncompatibility,
  predictPregnancyRisk
} from '../lib/geneticEngine';
import { analyzeGeneticProbability } from '../services/geminiService';
import { MaternalHealthInput } from '../components/MaternalHealthInput';
import { DownloadReport } from '../components/DownloadReport';

const initialParent: ParentProfile = {
  name: '',
  bloodType: BloodType.O_POS,
  eyeColor: EyeColor.BROWN,
  hairTexture: HairTexture.WAVY,
  heightCm: 170,
  skinTone: '',
  thalassemia: PathologyStatus.NONE,
  colorBlindness: false,
  myopia: false,
  diabetesT2: false,
  maternalHealth: {
    age: 28,
    systolicBP: 120,
    diastolicBP: 80,
    glucoseLevel: 95
  }
};

export const MainApp: React.FC = () => {
  const [p1, setP1] = useState<ParentProfile>({ ...initialParent, name: 'Mother (Alpha)' });
  const [p2, setP2] = useState<ParentProfile>({ ...initialParent, name: 'Father (Beta)' });
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState<string | null>(null);
  const [showResults, setShowResults] = useState(false);

  const bloodProbabilities = useMemo(() =>
    calculateBloodTypeProbabilities(p1.bloodType, p2.bloodType),
    [p1.bloodType, p2.bloodType]
  );

  const eyeProbabilities = useMemo(() =>
    calculateEyeColorProbabilities(p1.eyeColor, p2.eyeColor),
    [p1.eyeColor, p2.eyeColor]
  );

  const pathologyRisks = useMemo(() =>
    calculatePathologyRisks(p1, p2),
    [p1, p2]
  );

  const rhRisk = useMemo(() =>
    checkRhIncompatibility(p1.bloodType, p2.bloodType),
    [p1.bloodType, p2.bloodType]
  );

  const pregnancyRisk = useMemo(() =>
    predictPregnancyRisk(p1.maternalHealth!),
    [p1.maternalHealth]
  );

  const handleSimulate = async () => {
    setIsAnalyzing(true);
    setShowResults(true);
    try {
      const result = await analyzeGeneticProbability(p1, p2);
      setAiAnalysis(result);
    } catch (error) {
      console.error(error);
      setAiAnalysis("Analysis complete. View the probability distributions above for detailed genetic insights.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const reset = () => {
    setShowResults(false);
    setAiAnalysis(null);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0c] text-white/90 font-sans">
      <header className="border-b border-white/10 p-6 sticky top-0 bg-[#0a0a0c]/95 backdrop-blur-sm z-10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-4">
            <Link 
              to="/" 
              className="text-white/40 hover:text-white/80 transition-colors p-2 hover:bg-white/5 rounded-md"
              title="Back to Home"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-sm flex items-center justify-center font-bold text-[#0a0a0c] text-xl">
                G
              </div>
              <div>
                <h1 className="text-xl font-medium tracking-[0.2em] hidden md:flex uppercase">Genetix Probability Engine</h1>
                <p className="text-[10px] text-emerald-500 font-mono">Bayesian v4.2 • Mendelian Inheritance • Polygenic Risk Scoring</p>
              </div>
            </div>
          </div>
          
          {/* Add download button here when results are shown */}
          {showResults && (
            <DownloadReport
              bloodProbabilities={bloodProbabilities}
              eyeProbabilities={eyeProbabilities}
              pathologyRisks={pathologyRisks}
              rhRisk={rhRisk}
              pregnancyRisk={pregnancyRisk}
              aiAnalysis={aiAnalysis}
              p1={p1}
              p2={p2}
            />
          )}
        </div>
      </header>

      <main className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-12 gap-px bg-white/5">
          {/* Left Sidebar */}
          <div className="lg:col-span-3 bg-[#0a0a0c] p-6 space-y-8">
            <section>
              <h2 className="text-[10px] text-white/40 uppercase tracking-[0.25em] mb-6 flex items-center justify-between">
                Parent Phenotypes
                <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
              </h2>
              <div className="space-y-6">
                <ParentInput profile={p1} onChange={setP1} label="Mother (Alpha)" />
                <MaternalHealthInput
                  data={p1.maternalHealth!}
                  onChange={(health) => setP1({ ...p1, maternalHealth: health })}
                />
                <ParentInput profile={p2} onChange={setP2} label="Father (Beta)" />
              </div>
            </section>

            <button
              onClick={handleSimulate}
              disabled={isAnalyzing}
              className="w-full bg-emerald-500 hover:bg-emerald-400 text-[#0a0a0c] py-4 text-[11px] font-bold uppercase tracking-[0.2em] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isAnalyzing ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  ANALYZING...
                </>
              ) : (
                'Synthesize Genome'
              )}
            </button>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-9 bg-[#0a0a0c] min-h-[600px]">
            <AnimatePresence mode="wait">
              {!showResults ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col items-center justify-center p-12 text-center min-h-[600px]"
                >
                  <div className="w-24 h-24 border border-white/10 flex items-center justify-center mb-8 relative">
                    <div className="absolute inset-0 border border-emerald-500/20 animate-ping"></div>
                    <FlaskConical className="w-10 h-10 text-emerald-500/40" />
                  </div>
                  <h3 className="text-2xl font-light tracking-widest text-white/80 uppercase mb-4">
                    Configure Parameters
                  </h3>
                  <p className="text-white/30 text-sm max-w-sm font-mono">
                    Select parent phenotypes and click "Synthesize Genome" to begin analysis
                  </p>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex flex-col"
                >
                  {/* Probability Grid */}
                  <div className="grid md:grid-cols-2 border-b border-white/10">
                    <ProbabilityChart title="ABO/Rh Blood Distribution" data={bloodProbabilities} />
                    <div className="border-l border-white/10">
                      <ProbabilityChart title="Eye Color Distribution" data={eyeProbabilities} />
                    </div>
                  </div>

                  {/* Health Analysis */}
                  <div className="grid md:grid-cols-2 border-b border-white/10">
                    <div className="p-8 space-y-6">
                      <h3 className="text-[10px] font-bold text-white/40 uppercase tracking-[0.2em] flex items-center gap-2">
                        <AlertCircle className="w-3 h-3 text-red-500" />
                        Maternal Risk Assessment
                      </h3>
                      <div className={`inline-flex px-4 py-2 text-xs font-mono border ${pregnancyRisk.status === 'HIGH'
                          ? 'bg-red-500/10 border-red-500/30 text-red-500'
                          : pregnancyRisk.status === 'MODERATE'
                            ? 'bg-yellow-500/10 border-yellow-500/30 text-yellow-500'
                            : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-500'
                        }`}>
                        {pregnancyRisk.status} RISK (Score: {pregnancyRisk.riskScore})
                      </div>
                      <ul className="space-y-2 mt-4">
                        {pregnancyRisk.notes.map((note, idx) => (
                          <li key={idx} className="text-[11px] text-white/60 flex gap-2">
                            <span className="text-emerald-500">→</span> {note}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="p-8 border-l border-white/10">
                      <h3 className="text-[10px] font-bold text-white/40 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                        <Thermometer className="w-3 h-3 text-blue-500" />
                        Blood Group Compatibility
                      </h3>
                      <RhIncompatibilityWarning
                        isAtRisk={rhRisk.isAtRisk}
                        message={rhRisk.message}
                        recommendations={rhRisk.recommendations}
                        requiresRhoGAM={rhRisk.requiresRhoGAM}
                      />
                    </div>
                  </div>

                  {/* Pathology Risks */}
                  <div className="p-8 border-b border-white/10">
                    <h2 className="text-[10px] font-bold text-white/40 uppercase tracking-[0.25em] mb-6 flex items-center gap-3">
                      <span className="w-1 h-3 bg-emerald-500"></span>
                      Genetic Risk Assessment
                    </h2>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      {pathologyRisks.map((risk, idx) => (
                        <div key={idx} className="border border-white/10 p-5 bg-[#0a0a0c] hover:border-emerald-500/30 transition-all">
                          <div className="flex justify-between items-start mb-3">
                            <p className="text-[10px] font-mono text-white/60">{risk.label}</p>
                            <span className="text-[8px] px-2 py-0.5 bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                              {risk.carrier !== undefined ? 'Mendelian' : 'Polygenic'}
                            </span>
                          </div>
                          <div className="flex items-baseline gap-2">
                            <p className="text-3xl font-light text-white">
                              {(risk.affected * 100).toFixed(1)}<span className="text-xs text-white/30">%</span>
                            </p>
                          </div>
                          {risk.carrier !== undefined && (
                            <p className="text-[10px] text-emerald-500/60 mt-1">
                              Carrier risk: {(risk.carrier * 100).toFixed(1)}%
                            </p>
                          )}
                          <p className="text-[10px] text-white/30 mt-4 leading-relaxed">
                            {risk.description}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Analysis Output */}
                  <div className="p-8">
                    <div className="flex items-center justify-between mb-6 border-b border-white/10 pb-4">
                      <h2 className="text-xl font-light text-white/90">Phenotypic Analysis</h2>
                      <button
                        onClick={reset}
                        className="text-[10px] font-mono text-white/20 hover:text-emerald-500 flex items-center gap-2"
                      >
                        <RefreshCw className="w-3 h-3" />
                        Reset
                      </button>
                    </div>

                    <div className="prose prose-invert max-w-none prose-sm">
                      {isAnalyzing ? (
                        <div className="space-y-4">
                          <div className="h-4 bg-white/5 w-1/2 animate-pulse rounded"></div>
                          <div className="h-24 bg-white/5 w-full animate-pulse rounded"></div>
                          <div className="h-4 bg-white/5 w-2/3 animate-pulse rounded"></div>
                        </div>
                      ) : (
                        <ReactMarkdown>{aiAnalysis || 'Analysis complete. Review the probability distributions above for detailed genetic insights.'}</ReactMarkdown>
                      )}
                    </div>

                    <div className="mt-8 p-4 border border-white/5 bg-white/[0.02]">
                      <p className="text-[10px] text-white/30 font-mono text-center">
                        ⚠️ Educational simulation only. Based on Mendelian inheritance patterns. Not for clinical use.
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </main>
    </div>
  );
};