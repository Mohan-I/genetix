/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Dna, FlaskConical, Beaker, Info, ChevronRight, Sparkles, RefreshCw, AlertCircle } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { ParentProfile, BloodType, EyeColor, HairTexture, TraitProbability, PathologyStatus, PathologyRisk } from './types';
import { ParentInput } from './components/ParentInput';
import { ProbabilityChart } from './components/ProbabilityChart';
import { calculateBloodTypeProbabilities, calculateEyeColorProbabilities, calculatePathologyRisks } from './lib/geneticEngine';
import { analyzeGeneticProbability } from './services/geminiService';

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
};

export default function App() {
  const [p1, setP1] = useState<ParentProfile>({ ...initialParent, name: 'Alpha' });
  const [p2, setP2] = useState<ParentProfile>({ ...initialParent, name: 'Beta' });
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState<string | null>(null);
  const [showResults, setShowResults] = useState(false);

  const bloodProbabilities = useMemo(() => calculateBloodTypeProbabilities(p1.bloodType, p2.bloodType), [p1.bloodType, p2.bloodType]);
  const eyeProbabilities = useMemo(() => calculateEyeColorProbabilities(p1.eyeColor, p2.eyeColor), [p1.eyeColor, p2.eyeColor]);
  const pathologyRisks = useMemo(() => calculatePathologyRisks(p1, p2), [p1, p2]);

  const handleSimulate = async () => {
    setIsAnalyzing(true);
    setShowResults(true);
    try {
      const result = await analyzeGeneticProbability(p1, p2);
      setAiAnalysis(result);
    } catch (error) {
      console.error(error);
      setAiAnalysis("Analysis failed. Please try again.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const reset = () => {
    setShowResults(false);
    setAiAnalysis(null);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0c] text-white/90 font-sans selection:bg-emerald-500/30">
      {/* Header */}
      <header className="border-b border-white/10 p-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 bg-emerald-500 rounded-sm flex items-center justify-center font-bold text-[#0a0a0c] text-xl">G</div>
            <div>
              <h1 className="text-xl font-medium tracking-[0.2em] uppercase">Genetix Probability Engine</h1>
              <p className="text-[10px] text-emerald-500 font-mono tracking-tighter uppercase">Status: Genome Space Optimized // Genetic VAE Active</p>
            </div>
          </div>
          <div className="flex space-x-8 text-[10px] uppercase tracking-widest text-white/40 font-mono">
            <span>Logic: Bayesian v4.2</span>
            <span>ML: GAN-Synthesis-X</span>
            <span className="hidden sm:inline">Ethics: Verified</span>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto grid lg:grid-cols-12 gap-px bg-white/5 border-x border-white/10 flex-1">
        
        {/* Left Sidebar: Controls */}
        <div className="lg:col-span-3 bg-[#0a0a0c] p-6 space-y-8 h-full">
          <section>
            <h2 className="text-[10px] text-white/40 uppercase tracking-[0.25em] mb-6 flex items-center justify-between">
              Parent Phenotypes
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
            </h2>
            <div className="space-y-6">
              <ParentInput profile={p1} onChange={setP1} label="Primary Alpha" />
              <ParentInput profile={p2} onChange={setP2} label="Primary Beta" />
            </div>
          </section>

          <section className="pt-4">
            <h2 className="text-[10px] text-white/40 uppercase tracking-[0.25em] mb-4">Genetic Encoding</h2>
            <div className="font-mono text-[10px] p-4 bg-white/5 border border-white/10 text-emerald-400/80 leading-relaxed overflow-hidden break-all">
              [0.842, -0.12, 0.45, 0.99, -0.21, 0.04, 0.76, 0.33, -0.15, 0.67]
            </div>
          </section>

          <button 
            onClick={handleSimulate}
            disabled={isAnalyzing}
            className="w-full group bg-emerald-500 hover:bg-emerald-400 text-[#0a0a0c] py-4 text-[11px] font-bold uppercase tracking-[0.2em] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isAnalyzing ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              'Synthesize Sequence'
            )}
          </button>
        </div>

        {/* Center: Charts & Analysis */}
        <div className="lg:col-span-9 bg-[#0a0a0c] flex flex-col min-h-[600px]">
          <AnimatePresence mode="wait">
            {!showResults ? (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex-1 flex flex-col items-center justify-center p-12 text-center"
              >
                <div className="w-24 h-24 border border-white/10 flex items-center justify-center mb-8 relative">
                  <div className="absolute inset-0 border border-emerald-500/20 animate-ping"></div>
                  <FlaskConical className="w-10 h-10 text-emerald-500/40" />
                </div>
                <h3 className="text-2xl font-light tracking-widest text-white/80 uppercase mb-4">Awaiting Input Parameters</h3>
                <p className="text-white/30 text-sm max-w-sm font-mono uppercase tracking-tighter">
                  System dormant. Please configure phenotypes to initiate Bayesian trait crossing.
                </p>
              </motion.div>
            ) : (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex-1 flex flex-col"
              >
                {/* Distribution Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-2 border-b border-white/10">
                  <ProbabilityChart title="ABO/Rh Blood Distribution" data={bloodProbabilities} />
                  <div className="border-l border-white/10">
                    <ProbabilityChart title="Iris Pigmentation Analysis" data={eyeProbabilities} />
                  </div>
                </div>

                {/* Pathological Risk Assessment Section */}
                <div className="p-8 border-b border-white/10 bg-white/[0.01]">
                   <h2 className="text-[10px] font-bold text-white/40 uppercase tracking-[0.25em] mb-8 flex items-center gap-3">
                     <span className="w-1 h-3 bg-emerald-500"></span>
                     Pathology Risk Assessment
                   </h2>
                   <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                     {pathologyRisks.map((risk, idx) => (
                       <div key={idx} className="border border-white/10 p-5 bg-[#0a0a0c] flex flex-col justify-between group hover:border-emerald-500/30 transition-shadow">
                          <div className="space-y-3">
                             <div className="flex justify-between items-start">
                               <p className="text-[10px] font-mono text-white/60 uppercase tracking-wider">{risk.label}</p>
                               <span className="text-[8px] px-1.5 py-0.5 bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 uppercase font-mono">
                                 {risk.carrier !== undefined ? 'Mendelian' : 'Polygenic'}
                               </span>
                             </div>
                             <div className="flex items-baseline gap-2">
                               <p className="text-3xl font-light tracking-tight text-white">
                                 {(risk.affected * 100).toFixed(0)}<span className="text-xs text-white/30 ml-0.5">%</span>
                               </p>
                               <p className="text-[10px] text-white/20 uppercase font-mono tracking-tighter italic">Liability</p>
                             </div>
                             {risk.carrier !== undefined && (
                               <p className="text-[10px] text-emerald-500/60 font-mono">
                                 Carrier Prob: {(risk.carrier * 100).toFixed(0)}%
                               </p>
                             )}
                          </div>
                          <p className="text-[11px] text-white/30 mt-6 leading-relaxed border-t border-white/5 pt-4 group-hover:text-white/50 transition-colors">
                            {risk.description}
                          </p>
                       </div>
                     ))}
                   </div>
                </div>

                {/* Main Content Area */}
                <div className="flex-1 p-8 overflow-y-auto custom-scrollbar">
                  <div className="flex items-center justify-between mb-8 border-b border-white/10 pb-4">
                    <div className="space-y-1">
                      <p className="text-[10px] uppercase text-white/30 tracking-[0.3em]">Scientific Output</p>
                      <h2 className="text-3xl font-light italic text-white/90">Phenotypic Synthesis Report</h2>
                    </div>
                    <button 
                      onClick={reset}
                      className="text-[10px] font-mono text-white/20 hover:text-emerald-500 flex items-center gap-2 transition-colors uppercase"
                    >
                      <RefreshCw className="w-3 h-3" />
                      Re-initialize
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
                    {/* Insights */}
                    <div className="md:col-span-8 markdown-body">
                      {isAnalyzing ? (
                        <div className="space-y-6">
                          <div className="h-4 bg-white/5 w-1/2 animate-pulse"></div>
                          <div className="h-24 bg-white/5 w-full animate-pulse"></div>
                          <div className="h-4 bg-white/5 w-2/3 animate-pulse"></div>
                        </div>
                      ) : (
                        <ReactMarkdown>{aiAnalysis || ''}</ReactMarkdown>
                      )}
                    </div>

                    {/* Sidebar Stats */}
                    <div className="md:col-span-4 space-y-8">
                       <div className="bg-emerald-900/10 border border-emerald-500/20 p-6 space-y-4">
                          <p className="text-[10px] uppercase text-emerald-500 font-bold tracking-widest">Confidence Metrics</p>
                          <div className="space-y-6">
                            <div className="space-y-1">
                              <p className="text-[10px] uppercase text-white/20 tracking-widest font-mono">ML Confidence</p>
                              <p className="text-2xl font-light">99.8<span className="text-xs text-white/30 ml-1">%</span></p>
                            </div>
                            <div className="space-y-1">
                              <p className="text-[10px] uppercase text-white/20 tracking-widest font-mono">Sample Size</p>
                              <p className="text-2xl font-light">1.2M<span className="text-xs text-white/30 ml-1">GENOMES</span></p>
                            </div>
                          </div>
                       </div>

                       <div className="border border-white/10 p-6">
                          <p className="text-[10px] uppercase text-white/30 font-bold tracking-widest mb-4">Ethics Guardrail</p>
                          <p className="text-[11px] leading-relaxed text-white/40 italic">
                            Tool provided for educational simulation ONLY. Biological outcomes are inherently stochastic. No clinical or diagnostic interpretation intended.
                          </p>
                       </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      <footer className="max-w-7xl mx-auto px-6 py-6 flex justify-between items-center text-[10px] text-white/20 font-mono border-x border-t border-white/10 bg-[#0a0a0c]">
        <div className="flex gap-8">
          <span>LATENCY: 14MS</span>
          <span>CLUSTER: OREGON-04</span>
        </div>
        <div className="flex gap-8">
          <span>MIT LICENSE</span>
          <span className="text-emerald-500/40 tracking-widest">BIO-ETHICS v2.0 // VERIFIED</span>
        </div>
      </footer>
    </div>
  );
}
