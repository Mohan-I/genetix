// src/pages/MainApp.tsx
import React, { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import ReactMarkdown from 'react-markdown';
import {
  FlaskConical,
  RefreshCw,
  AlertCircle,
  Thermometer,
  ArrowLeft,
  GitBranch,
  Dna,
  BarChart3,
  Users,
  Activity,
  Menu,
  X
} from 'lucide-react';
import { ParentProfile, BloodType, EyeColor, HairTexture, PathologyStatus } from '../types';
import { ParentInput } from '../components/ParentInput';
import { ProbabilityChart } from '../components/ProbabilityChart';
import { RhIncompatibilityWarning } from '../components/RhIncompatibilityWarning';
import { MaternalHealthInput } from '../components/MaternalHealthInput';
import { DownloadReport } from '../components/DownloadReport';
import { PedigreeBuilder } from '../components/PedigreeBuilder';
import { PedigreeData, createDefaultPedigree } from '../types/pedigree';
import { useSafeStorage } from '../utils/storage';
import {
  calculateBloodTypeProbabilities,
  calculateEyeColorProbabilities,
  calculatePathologyRisks,
  checkRhIncompatibility,
  predictPregnancyRisk
} from '../lib/geneticEngine';
import { analyzeGeneticProbability } from '../services/geminiService';
import { GeneticDataImporter } from '../components/GeneticDataImporter';
import { PGTSimulator } from '../components/PGTSimulator';

import myopia from '../assets/custom_icons/myopia.svg';
import diabetes from '../assets/custom_icons/diabetes.svg';

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
  const [activeTab, setActiveTab] = useState<'pedigree' | 'analysis' | 'pgt'>('analysis');
  const [p1, setP1] = useState<ParentProfile>({ ...initialParent, name: 'Mother (Alpha)' });
  const [p2, setP2] = useState<ParentProfile>({ ...initialParent, name: 'Father (Beta)' });
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState<string | null>(null);
  const [showResults, setShowResults] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [pedigreeData, setPedigreeData] = useSafeStorage<PedigreeData>(
    'pedigree_data',
    createDefaultPedigree()
  );

  // Detect mobile
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

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

  const pedigreeStats = {
    members: pedigreeData.members.length,
    withMyopia: pedigreeData.members.filter(m => m.myopia).length,
    withDiabetes: pedigreeData.members.filter(m => m.diabetes).length,
    probands: pedigreeData.members.filter(m => m.isProband).length
  };

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

  const handleSavePedigree = (data: PedigreeData) => {
    setPedigreeData(data);
  };

  const autoPopulateFromPedigree = () => {
    const proband = pedigreeData.members.find(m => m.isProband);
    if (proband) {
      const parents = pedigreeData.relationships
        .filter(r => r.type === 'PARENT_CHILD' && r.targetId === proband.id)
        .map(r => pedigreeData.members.find(m => m.id === r.sourceId))
        .filter(Boolean);

      if (parents.length >= 2) {
        const mother = parents.find(p => p?.gender === 'FEMALE');
        const father = parents.find(p => p?.gender === 'MALE');

        if (mother) {
          setP1({
            ...p1,
            name: mother.name || 'Mother',
            myopia: mother.myopia || false,
            diabetesT2: mother.diabetes || false
          });
        }
        if (father) {
          setP2({
            ...p2,
            name: father.name || 'Father',
            myopia: father.myopia || false,
            diabetesT2: father.diabetes || false
          });
        }
      }
    }
    setActiveTab('analysis');
  };

  // Calculate audience summary
  const audienceSummary = useMemo(() => {
    const total = pedigreeData.members.length;
    if (total === 0) return null;
    
    const affected = pedigreeData.members.filter(m => m.affected).length;
    const carriers = pedigreeData.members.filter(m => m.carrier).length;
    const probands = pedigreeData.members.filter(m => m.isProband).length;
    
    return {
      total,
      affected,
      carriers,
      probands,
      affectedPercent: (affected / total) * 100,
      carrierPercent: (carriers / total) * 100
    };
  }, [pedigreeData]);

  return (
    <div className="min-h-screen bg-[#0a0a0c] text-white/90 font-sans overflow-x-hidden">
      {/* Sticky Header */}
      <div className="sticky top-0 z-30 bg-[#0a0a0c]/95 backdrop-blur-sm border-b border-white/10">
        <header className="p-3 md:p-6">
          <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <Link
                to="/"
                className="text-white/40 hover:text-white/80 transition-colors p-1.5 hover:bg-white/5 rounded-md"
              >
                <ArrowLeft className="w-4 h-4" />
              </Link>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-sm flex items-center justify-center font-bold text-[#0a0a0c] text-sm md:text-xl shrink-0">
                  G
                </div>
                <div className="hidden sm:block">
                  <h1 className="text-sm md:text-xl font-medium tracking-[0.2em] uppercase">Genetix</h1>
                  <p className="text-[8px] md:text-[10px] text-emerald-500 font-mono">Bayesian v4.2</p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {activeTab === 'pedigree' && (
                <span className="text-[10px] md:text-[12px] text-white/40 font-mono bg-white/5 px-2 md:px-4 py-1 rounded flex items-center gap-1 md:gap-2">
                  <Users className="w-3 h-3" />
                  <span className="hidden xs:inline">{pedigreeStats.members} members</span>
                  <span className="xs:hidden">{pedigreeStats.members}</span>
                  {pedigreeStats.withMyopia > 0 && (
                    <span className="text-blue-400 flex items-center gap-0.5">
                      <img src={myopia} alt="Myopia" className="w-3 h-3 object-contain" />
                      <span className="hidden xs:inline">{pedigreeStats.withMyopia}</span>
                    </span>
                  )}
                  {pedigreeStats.withDiabetes > 0 && (
                    <span className="text-red-400 flex items-center gap-0.5">
                      <img src={diabetes} alt="Diabetes" className="w-3 h-3 object-contain" />
                      <span className="hidden xs:inline">{pedigreeStats.withDiabetes}</span>
                    </span>
                  )}
                </span>
              )}
              {showResults && activeTab === 'analysis' && (
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
              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden text-white/60 hover:text-white/80 p-1"
              >
                {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {isMobileMenuOpen && isMobile && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden mt-2 pt-2 border-t border-white/10 space-y-1"
            >
              <button
                onClick={() => { setActiveTab('pedigree'); setIsMobileMenuOpen(false); }}
                className={`w-full text-left px-3 py-2 text-xs font-mono uppercase tracking-wider flex items-center gap-2 rounded ${
                  activeTab === 'pedigree' ? 'bg-emerald-500/10 text-emerald-400' : 'text-white/60 hover:bg-white/5'
                }`}
              >
                <GitBranch className="w-4 h-4" />
                Pedigree Builder
                <span className="text-[8px] bg-white/5 px-1.5 py-0.5 rounded ml-auto">{pedigreeStats.members}</span>
              </button>
              <button
                onClick={() => { setActiveTab('analysis'); setIsMobileMenuOpen(false); }}
                className={`w-full text-left px-3 py-2 text-xs font-mono uppercase tracking-wider flex items-center gap-2 rounded ${
                  activeTab === 'analysis' ? 'bg-emerald-500/10 text-emerald-400' : 'text-white/60 hover:bg-white/5'
                }`}
              >
                <Dna className="w-4 h-4" />
                Genetic Analysis
              </button>
              <button
                onClick={() => { setActiveTab('pgt'); setIsMobileMenuOpen(false); }}
                className={`w-full text-left px-3 py-2 text-xs font-mono uppercase tracking-wider flex items-center gap-2 rounded ${
                  activeTab === 'pgt' ? 'bg-emerald-500/10 text-emerald-400' : 'text-white/60 hover:bg-white/5'
                }`}
              >
                <Activity className="w-4 h-4" />
                PGT Simulator
              </button>
            </motion.div>
          )}
        </header>

        {/* Desktop Tabs */}
        <div className="hidden md:block border-t border-white/10">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex gap-6 overflow-x-auto scrollbar-thin scrollbar-thumb-emerald-500/20 scrollbar-track-transparent">
              <button
                onClick={() => setActiveTab('pedigree')}
                className={`py-3 px-2 text-[10px] font-mono uppercase tracking-wider transition-all border-b-2 flex items-center gap-2 whitespace-nowrap ${
                  activeTab === 'pedigree'
                    ? 'border-emerald-500 text-emerald-400'
                    : 'border-transparent text-white/40 hover:text-white/60'
                }`}
              >
                <GitBranch className="w-3 h-3" />
                Pedigree Builder
                <span className="text-[8px] bg-white/5 px-1.5 py-0.5 rounded">
                  {pedigreeStats.members}
                </span>
              </button>
              <button
                onClick={() => setActiveTab('analysis')}
                className={`py-3 px-2 text-[10px] font-mono uppercase tracking-wider transition-all border-b-2 flex items-center gap-2 whitespace-nowrap ${
                  activeTab === 'analysis'
                    ? 'border-emerald-500 text-emerald-400'
                    : 'border-transparent text-white/40 hover:text-white/60'
                }`}
              >
                <Dna className="w-3 h-3" />
                Genetic Analysis
              </button>
              <button
                onClick={() => setActiveTab('pgt')}
                className={`py-3 px-2 text-[10px] font-mono uppercase tracking-wider transition-all border-b-2 flex items-center gap-2 whitespace-nowrap ${
                  activeTab === 'pgt'
                    ? 'border-emerald-500 text-emerald-400'
                    : 'border-transparent text-white/40 hover:text-white/60'
                }`}
              >
                <Activity className="w-3 h-3" />
                PGT Simulator
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Tabs - Horizontal Scroll */}
        <div className="md:hidden border-t border-white/10">
          <div className="max-w-7xl mx-auto px-3">
            <div className="flex gap-2 overflow-x-auto py-2 scrollbar-thin scrollbar-thumb-emerald-500/20 scrollbar-track-transparent">
              <button
                onClick={() => setActiveTab('pedigree')}
                className={`px-3 py-1.5 text-[9px] font-mono uppercase tracking-wider transition-all border-b-2 flex items-center gap-1.5 whitespace-nowrap ${
                  activeTab === 'pedigree'
                    ? 'border-emerald-500 text-emerald-400'
                    : 'border-transparent text-white/40 hover:text-white/60'
                }`}
              >
                <GitBranch className="w-3 h-3" />
                Pedigree
                <span className="text-[7px] bg-white/5 px-1 py-0.5 rounded">{pedigreeStats.members}</span>
              </button>
              <button
                onClick={() => setActiveTab('analysis')}
                className={`px-3 py-1.5 text-[9px] font-mono uppercase tracking-wider transition-all border-b-2 flex items-center gap-1.5 whitespace-nowrap ${
                  activeTab === 'analysis'
                    ? 'border-emerald-500 text-emerald-400'
                    : 'border-transparent text-white/40 hover:text-white/60'
                }`}
              >
                <Dna className="w-3 h-3" />
                Analysis
              </button>
              <button
                onClick={() => setActiveTab('pgt')}
                className={`px-3 py-1.5 text-[9px] font-mono uppercase tracking-wider transition-all border-b-2 flex items-center gap-1.5 whitespace-nowrap ${
                  activeTab === 'pgt'
                    ? 'border-emerald-500 text-emerald-400'
                    : 'border-transparent text-white/40 hover:text-white/60'
                }`}
              >
                <Activity className="w-3 h-3" />
                PGT
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <main className="max-w-7xl mx-auto overflow-x-hidden px-2 sm:px-4 md:px-6">
        <AnimatePresence mode="wait">
          {activeTab === 'pedigree' ? (
            <motion.div
              key="pedigree"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="py-3 md:py-6"
            >
              <PedigreeBuilder
                data={pedigreeData}
                onSave={handleSavePedigree}
                onMemberSelect={(member) => {
                  console.log('👤 Member selected:', member);
                }}
              />

              {/* Audience Summary */}
              {audienceSummary && (
                <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 bg-white/5 border border-white/5 rounded-lg">
                  <div className="text-center">
                    <div className="text-[8px] text-white/30 uppercase font-mono">Total Members</div>
                    <div className="text-xl font-light text-white">{audienceSummary.total}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-[8px] text-white/30 uppercase font-mono">Affected</div>
                    <div className="text-xl font-light text-red-400">{audienceSummary.affected}</div>
                    <div className="text-[7px] text-white/20">{audienceSummary.affectedPercent.toFixed(0)}%</div>
                  </div>
                  <div className="text-center">
                    <div className="text-[8px] text-white/30 uppercase font-mono">Carriers</div>
                    <div className="text-xl font-light text-amber-400">{audienceSummary.carriers}</div>
                    <div className="text-[7px] text-white/20">{audienceSummary.carrierPercent.toFixed(0)}%</div>
                  </div>
                  <div className="text-center">
                    <div className="text-[8px] text-white/30 uppercase font-mono">Probands</div>
                    <div className="text-xl font-light text-amber-400">{audienceSummary.probands}</div>
                  </div>
                </div>
              )}

              <div className="mt-4 flex justify-end">
                <button
                  onClick={autoPopulateFromPedigree}
                  disabled={pedigreeStats.members === 0}
                  className="px-4 py-2 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono hover:bg-emerald-500/20 transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <BarChart3 className="w-3 h-3" />
                  Run Analysis with Pedigree
                </button>
              </div>
            </motion.div>
          ) : activeTab === 'pgt' ? (
            <motion.div
              key="pgt"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="py-3 md:py-6 space-y-4 md:space-y-6"
            >
              <GeneticDataImporter
                onDataImported={(data) => {
                  console.log('📊 Genetic data imported:', data);
                }}
                onVariantSelected={(variant, memberId) => {
                  console.log('🧬 Variant selected:', variant, memberId);
                }}
              />
              <PGTSimulator
                maternalAge={p1.maternalHealth?.age || 28}
                paternalAge={30}
                isCarrierConcordant={pathologyRisks.some(r => r.carrier !== undefined && r.carrier > 0.1)}
                recessiveGene="CFTR"
                onResultsGenerated={(results) => {
                  console.log('📊 PGT Results:', results);
                }}
              />
            </motion.div>
          ) : (
            <motion.div
              key="analysis"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col lg:flex-row gap-0 lg:gap-px bg-white/5 py-3 md:py-4"
            >
              {/* Left Sidebar */}
              <div className="lg:w-[280px] xl:w-[320px] flex-shrink-0 bg-[#0a0a0c] p-3 md:p-6 space-y-4 md:space-y-6 border-b lg:border-b-0 lg:border-r border-white/5">
                <section>
                  <h2 className="text-[9px] md:text-[10px] text-white/40 uppercase tracking-[0.25em] mb-3 md:mb-6 flex items-center justify-between">
                    Parent Phenotypes
                    <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                  </h2>
                  <div className="space-y-3 md:space-y-6">
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
                  className="w-full bg-emerald-500 hover:bg-emerald-400 text-[#0a0a0c] py-3 md:py-4 text-[10px] md:text-[11px] font-bold uppercase tracking-[0.15em] md:tracking-[0.2em] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isAnalyzing ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span className="hidden xs:inline">ANALYZING...</span>
                    </>
                  ) : (
                    'Synthesize Genome'
                  )}
                </button>
              </div>

              {/* Main Content */}
              <div className="flex-1 bg-[#0a0a0c] min-h-[400px] md:min-h-[600px] overflow-hidden">
                {!showResults ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-col items-center justify-center p-6 md:p-12 text-center min-h-[400px] md:min-h-[600px]"
                  >
                    <div className="w-16 h-16 md:w-24 md:h-24 border border-white/10 flex items-center justify-center mb-4 md:mb-8 relative">
                      <div className="absolute inset-0 border border-emerald-500/20 animate-ping"></div>
                      <FlaskConical className="w-8 h-8 md:w-10 md:h-10 text-emerald-500/40" />
                    </div>
                    <h3 className="text-lg md:text-2xl font-light tracking-widest text-white/80 uppercase mb-2 md:mb-4">
                      Configure Parameters
                    </h3>
                    <p className="text-xs md:text-sm text-white/30 max-w-sm font-mono">
                      Select parent phenotypes and click "Synthesize Genome" to begin analysis
                    </p>
                  </motion.div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex flex-col w-full"
                  >
                    {/* Probability Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-0 md:gap-px bg-white/5 w-full">
                      <div className="bg-[#0a0a0c] min-w-0 overflow-hidden p-2 md:p-4">
                        <ProbabilityChart title="ABO/Rh Blood Distribution" data={bloodProbabilities} />
                      </div>
                      <div className="bg-[#0a0a0c] min-w-0 overflow-hidden md:border-l border-white/10 p-2 md:p-4">
                        <ProbabilityChart title="Eye Color Distribution" data={eyeProbabilities} />
                      </div>
                    </div>

                    {/* Health Analysis */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-0 md:gap-px bg-white/5 border-t border-white/10">
                      <div className="p-3 md:p-8 space-y-3 md:space-y-6 bg-[#0a0a0c]">
                        <h3 className="text-[9px] md:text-[10px] font-bold text-white/40 uppercase tracking-[0.2em] flex items-center gap-2">
                          <AlertCircle className="w-3 h-3 text-red-500" />
                          Maternal Risk
                        </h3>
                        <div className={`inline-flex px-3 md:px-4 py-1.5 md:py-2 text-[10px] md:text-xs font-mono border ${
                          pregnancyRisk.status === 'HIGH'
                            ? 'bg-red-500/10 border-red-500/30 text-red-500'
                            : pregnancyRisk.status === 'MODERATE'
                              ? 'bg-yellow-500/10 border-yellow-500/30 text-yellow-500'
                              : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-500'
                        }`}>
                          {pregnancyRisk.status} RISK (Score: {pregnancyRisk.riskScore})
                        </div>
                        <ul className="space-y-1.5 md:space-y-2">
                          {pregnancyRisk.notes.slice(0, 3).map((note, idx) => (
                            <li key={idx} className="text-[10px] md:text-[11px] text-white/60 flex gap-2">
                              <span className="text-emerald-500">→</span> {note}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="p-3 md:p-8 bg-[#0a0a0c] md:border-l border-white/10">
                        <h3 className="text-[9px] md:text-[10px] font-bold text-white/40 uppercase tracking-[0.2em] mb-3 md:mb-4 flex items-center gap-2">
                          <Thermometer className="w-3 h-3 text-blue-500" />
                          Blood Compatibility
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
                    <div className="p-3 md:p-8 border-t border-white/10 bg-[#0a0a0c]">
                      <h2 className="text-[9px] md:text-[10px] font-bold text-white/40 uppercase tracking-[0.25em] mb-3 md:mb-6 flex items-center gap-3">
                        <span className="w-1 h-3 bg-emerald-500"></span>
                        Genetic Risk Assessment
                      </h2>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6">
                        {pathologyRisks.map((risk, idx) => (
                          <div key={idx} className="border border-white/10 p-3 md:p-5 bg-[#0a0a0c] hover:border-emerald-500/30 transition-all">
                            <div className="flex justify-between items-start mb-2 md:mb-3">
                              <p className="text-[9px] md:text-[10px] font-mono text-white/60">{risk.label}</p>
                              <span className="text-[7px] md:text-[8px] px-1.5 md:px-2 py-0.5 bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                                {risk.carrier !== undefined ? 'Mendelian' : 'Polygenic'}
                              </span>
                            </div>
                            <div className="flex items-baseline gap-2">
                              <p className="text-2xl md:text-3xl font-light text-white">
                                {(risk.affected * 100).toFixed(1)}<span className="text-[10px] md:text-xs text-white/30">%</span>
                              </p>
                            </div>
                            {risk.carrier !== undefined && (
                              <p className="text-[9px] md:text-[10px] text-emerald-500/60 mt-1">
                                Carrier: {(risk.carrier * 100).toFixed(1)}%
                              </p>
                            )}
                            <p className="text-[9px] md:text-[10px] text-white/30 mt-2 md:mt-4 leading-relaxed">
                              {risk.description}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Analysis Output - FIXED: Removed className from ReactMarkdown */}
                    <div className="p-3 md:p-8 border-t border-white/10 bg-[#0a0a0c]">
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-3 md:mb-6 border-b border-white/10 pb-3 md:pb-4 gap-2">
                        <h2 className="text-lg md:text-xl font-light text-white/90">Phenotypic Analysis</h2>
                        <button
                          onClick={reset}
                          className="text-[9px] md:text-[10px] font-mono text-white/20 hover:text-emerald-500 flex items-center gap-2"
                        >
                          <RefreshCw className="w-3 h-3" />
                          Reset
                        </button>
                      </div>

                      <div className="prose prose-invert max-w-none prose-sm">
                        {isAnalyzing ? (
                          <div className="space-y-3 md:space-y-4">
                            <div className="h-3 md:h-4 bg-white/5 w-1/2 animate-pulse rounded"></div>
                            <div className="h-16 md:h-24 bg-white/5 w-full animate-pulse rounded"></div>
                            <div className="h-3 md:h-4 bg-white/5 w-2/3 animate-pulse rounded"></div>
                          </div>
                        ) : (
                          /* FIX: className removed from ReactMarkdown */
                          <ReactMarkdown>
                            {aiAnalysis || 'Analysis complete. Review the probability distributions above for detailed genetic insights.'}
                          </ReactMarkdown>
                        )}
                      </div>

                      <div className="mt-4 md:mt-8 p-3 md:p-4 border border-white/5 bg-white/[0.02]">
                        <p className="text-[8px] md:text-[10px] text-white/30 font-mono text-center">
                          ⚠️ Educational simulation only. Based on Mendelian inheritance patterns. Not for clinical use.
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Custom Scrollbar Styles */}
      <style>{`
        /* Custom scrollbar for tabs */
        .scrollbar-thin::-webkit-scrollbar {
          height: 3px;
          width: 3px;
        }
        .scrollbar-thin::-webkit-scrollbar-track {
          background: transparent;
        }
        .scrollbar-thin::-webkit-scrollbar-thumb {
          background: rgba(16, 185, 129, 0.2);
          border-radius: 10px;
        }
        .scrollbar-thin::-webkit-scrollbar-thumb:hover {
          background: rgba(16, 185, 129, 0.4);
        }
        
        /* Hide scrollbar for Firefox */
        .scrollbar-thin {
          scrollbar-width: thin;
          scrollbar-color: rgba(16, 185, 129, 0.2) transparent;
        }
      `}</style>
    </div>
  );
};

export default MainApp;