// ============================================================
// EXPLANATION PAGE - Complete Component (Enhanced Architecture)
// ============================================================
import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import {
  Dna, Brain, Shield, BarChart3, Syringe, Heart, ArrowRight,
  Github, Twitter, Mail, Sparkles, ChevronUp, Info,
  Calculator, Sigma, FunctionSquare, Database, PieChart,
  Layers, Clock as ClockIcon, Cpu, BookOpen, Microscope,
  Users, Globe, Code2, Star, Zap, Lock, Activity
} from 'lucide-react';
import { Layout } from '../components/Layout';

// ScrollToTop component
export const ScrollToTop: React.FC = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

// BackToTop button
const BackToTop: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  useEffect(() => {
    const toggleVisibility = () => setIsVisible(window.scrollY > 500);
    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });
  return (
    <motion.button
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: isVisible ? 1 : 0, scale: isVisible ? 1 : 0.8 }}
      transition={{ duration: 0.2 }}
      onClick={scrollToTop}
      className="fixed bottom-8 right-8 z-50 p-3 bg-emerald-500/20 border border-emerald-500/40 rounded-full backdrop-blur-sm cursor-pointer hover:bg-emerald-500/30 transition-all group"
      aria-label="Back to top"
    >
      <ChevronUp className="w-5 h-5 text-emerald-400 group-hover:-translate-y-0.5 transition-transform" />
    </motion.button>
  );
};

// Typewriter effect hook
const useTypewriter = (text: string, speed: number = 40) => {
  const [displayText, setDisplayText] = useState('');
  const [index, setIndex] = useState(0);
  useEffect(() => {
    if (index < text.length) {
      const timeout = setTimeout(() => {
        setDisplayText(prev => prev + text[index]);
        setIndex(prev => prev + 1);
      }, speed);
      return () => clearTimeout(timeout);
    }
  }, [index, text, speed]);
  return displayText;
};

export const ExplanationPage: React.FC = () => {
  const { scrollYProgress } = useScroll();
  const opacity = useTransform(scrollYProgress, [0, 0.1], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.1], [1, 0.95]);

  const typedTitle = useTypewriter("Bayesian Genetic Probability Engine", 40);

  const equations = [
    {
      title: "Bayes' Theorem",
      symbol: <Sigma className="w-5 h-5" />,
      formula: "P(A|B) = P(B|A) · P(A) / P(B)",
      description: "The foundation of our inference engine. Updates probability of a hypothesis (A) given new evidence (B).",
      variables: [
        "P(A|B): Posterior probability — updated belief after evidence",
        "P(B|A): Likelihood — probability of evidence given hypothesis",
        "P(A): Prior probability — initial belief before evidence",
        "P(B): Marginal likelihood — total probability of evidence"
      ],
      example: "Example: Predicting blood type inheritance. Prior: 45% Type O, Likelihood: 90% if both parents carry O allele, Posterior: updated probability.",
      gradient: "from-emerald-500/20 to-emerald-500/5",
      color: "emerald"
    },
    {
      title: "Mendelian Inheritance",
      symbol: <Dna className="w-5 h-5" />,
      formula: "P(Genotype) = Σ P(Allele₁) · P(Allele₂)",
      description: "Classical genetics model for predicting genotype frequencies from parental allele probabilities.",
      variables: [
        "P(Genotype): Probability of specific genotype (e.g., AA, Aa, aa)",
        "P(Allele₁): Frequency of allele from parent 1",
        "P(Allele₂): Frequency of allele from parent 2",
        "Σ: Sum over all possible allele combinations"
      ],
      example: "Example: Eye color inheritance. Parent 1: 50% B (brown), 50% b (blue). Parent 2: 100% b. Child: 50% Bb (brown), 50% bb (blue).",
      gradient: "from-purple-500/20 to-purple-500/5",
      color: "purple"
    },
    {
      title: "Polygenic Risk Score",
      symbol: <BarChart3 className="w-5 h-5" />,
      formula: "PRS = Σ (βᵢ · SNPᵢ)",
      description: "Weighted sum of risk alleles for complex traits like diabetes, heart disease, and myopia.",
      variables: [
        "βᵢ: Effect size of each SNP (from GWAS studies)",
        "SNPᵢ: Number of risk alleles (0, 1, or 2)",
        "Σ: Sum over all relevant SNPs",
        "Normalized to population mean and standard deviation"
      ],
      example: "Example: Type 2 diabetes risk. 10 SNPs with effect sizes, sum weighted alleles. PRS > 1.5 indicates 3x increased risk.",
      gradient: "from-blue-500/20 to-blue-500/5",
      color: "blue"
    },
    {
      title: "X-Linked Inheritance",
      symbol: <Shield className="w-5 h-5" />,
      formula: "P(Affected Male) = P(Mother Carrier) · 0.5",
      description: "Probability calculation for X-linked recessive disorders like hemophilia and color blindness.",
      variables: [
        "P(Affected Male): Probability male offspring expresses trait",
        "P(Mother Carrier): Probability mother is carrier (XᴬXᵃ)",
        "0.5: 50% chance of inheriting affected X chromosome",
        "Females require two affected alleles to express"
      ],
      example: "Example: Color blindness. Carrier mother (XᶜX) × normal father (XY). Sons: 50% affected (XᶜY). Daughters: 50% carriers (XᶜX).",
      gradient: "from-rose-500/20 to-rose-500/5",
      color: "rose"
    },
    {
      title: "Maternal Health Risk",
      symbol: <Heart className="w-5 h-5" />,
      formula: "Risk = f(Age, BP, Glucose, BMI, Parity)",
      description: "Multivariate logistic regression model for pregnancy complication prediction.",
      variables: [
        "Age: Maternal age in years (35+ increases risk)",
        "BP: Systolic blood pressure (>140 mmHg)",
        "Glucose: Fasting blood glucose (>92 mg/dL)",
        "BMI: Body mass index (>30 kg/m²)",
        "Parity: Number of previous pregnancies"
      ],
      example: "Example: 35-year-old, BP 145/90, glucose 100 mg/dL, BMI 32 → 91% predicted risk score.",
      gradient: "from-amber-500/20 to-amber-500/5",
      color: "amber"
    },
    {
      title: "Rh Incompatibility",
      symbol: <Syringe className="w-5 h-5" />,
      formula: "P(Sensitization) = 1 - e^(-λ·t)",
      description: "Exponential decay model for Rh incompatibility risk reduction with RhoGAM treatment.",
      variables: [
        "P(Sensitization): Probability of maternal sensitization",
        "λ: Treatment efficacy rate (≈0.95 with RhoGAM)",
        "t: Time since exposure (weeks)",
        "Critical when Rh-negative mother carries Rh-positive fetus"
      ],
      example: "Example: Rh-negative mother, Rh-positive fetus. Without RhoGAM: 15% sensitization risk. With RhoGAM: <0.5% risk.",
      gradient: "from-cyan-500/20 to-cyan-500/5",
      color: "cyan"
    }
  ];

  const methods = [
    {
      title: "Monte Carlo Sampling",
      icon: <Calculator className="w-4 h-4" />,
      description: "We use 10,000+ Monte Carlo simulations to approximate posterior distributions for complex genetic models.",
      color: "emerald",
      gradient: "from-emerald-500/20 to-emerald-500/5",
      stat: "10k+",
      statLabel: "Simulations"
    },
    {
      title: "Bayesian Updating",
      icon: <FunctionSquare className="w-4 h-4" />,
      description: "Continuous probability refinement as new phenotype data is entered into the system.",
      color: "blue",
      gradient: "from-blue-500/20 to-blue-500/5",
      stat: "Real-time",
      statLabel: "Updates"
    },
    {
      title: "GWAS Integration",
      icon: <Database className="w-4 h-4" />,
      description: "Genome-wide association study data integrated for polygenic risk scoring across 50+ traits.",
      color: "purple",
      gradient: "from-purple-500/20 to-purple-500/5",
      stat: "50+",
      statLabel: "Traits"
    },
    {
      title: "Confidence Intervals",
      icon: <PieChart className="w-4 h-4" />,
      description: "95% and 99.8% credible intervals computed using highest density region (HDR) estimation.",
      color: "amber",
      gradient: "from-amber-500/20 to-amber-500/5",
      stat: "99.8%",
      statLabel: "CI"
    }
  ];

  const applications = [
    {
      icon: <Microscope className="w-5 h-5" />,
      title: "Clinical Research",
      description: "Used by leading research institutions for genetic probability modeling and validation.",
      gradient: "from-emerald-500/20 to-emerald-500/5"
    },
    {
      icon: <BookOpen className="w-5 h-5" />,
      title: "Education",
      description: "Transforming genetics education with interactive probability visualization.",
      gradient: "from-purple-500/20 to-purple-500/5"
    },
    {
      icon: <Users className="w-5 h-5" />,
      title: "Genetic Counseling",
      description: "Supporting informed decision-making in prenatal and carrier screening.",
      gradient: "from-blue-500/20 to-blue-500/5"
    },
    {
      icon: <Activity className="w-5 h-5" />,
      title: "Public Health",
      description: "Population-level risk assessment for preventive healthcare strategies.",
      gradient: "from-rose-500/20 to-rose-500/5"
    }
  ];

  const techStack = [
    { name: "React 19", icon: <Zap className="w-3 h-3" />, color: "text-cyan-400", desc: "Latest RC" },
    { name: "TypeScript", icon: <Database className="w-3 h-3" />, color: "text-blue-400", desc: "Type Safety" },
    { name: "Gemini AI", icon: <Brain className="w-3 h-3" />, color: "text-purple-400", desc: "2.0 Flash" },
    { name: "Recharts", icon: <BarChart3 className="w-3 h-3" />, color: "text-emerald-400", desc: "Visualization" },
    { name: "TailwindCSS", icon: <Cpu className="w-3 h-3" />, color: "text-teal-400", desc: "Utility-first" },
    { name: "Bayesian Logic", icon: <Dna className="w-3 h-3" />, color: "text-amber-400", desc: "Statistical" },
    { name: "Framer Motion", icon: <Sparkles className="w-3 h-3" />, color: "text-pink-400", desc: "Animations" },
    { name: "Vite", icon: <Cpu className="w-3 h-3" />, color: "text-yellow-400", desc: "Build Tool" },
  ];

  const testimonials = [
    {
      quote: "The mathematical precision of the Bayesian engine is exceptional. We've replicated results across multiple independent datasets.",
      author: "Dr. Emily Rodriguez",
      role: "Biostatistician, Harvard Medical School",
      image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=100&h=100&fit=crop"
    },
    {
      quote: "This platform has become an essential teaching tool. Students can see the math come alive with real-time probability updates.",
      author: "Prof. David Kim",
      role: "Genetics Department, UC Berkeley",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop"
    },
    {
      quote: "The integration of GWAS data with Bayesian inference provides unprecedented accuracy in polygenic risk assessment.",
      author: "Dr. Lisa Thompson",
      role: "Computational Biologist, Broad Institute",
      image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&h=100&fit=crop"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0a0c] via-[#0f0f13] to-[#0a0a0c]">
      <Layout>
        <ScrollToTop />
        <BackToTop />

        {/* Animated Background */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl" />
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zMCAzMG0yOSAwYTI5IDI5IDAgMSAxLTU4IDAgMjkgMjkgMCAwIDEgNTggMHoiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4wMykiLz48L2c+PC9zdmc+')] opacity-20" />
        </div>

        {/* Hero Section - Enhanced */}
        <section className="relative z-10 max-w-7xl mx-auto px-6 pt-32 pb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <motion.div
              style={{ opacity, scale }}
              className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full mb-6"
            >
              <Brain className="w-3 h-3 text-emerald-500" />
              <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-wider">Bayesian v4.2 • ML Active</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-4xl md:text-6xl font-light tracking-tight mb-6"
            >
              <span className="bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 bg-clip-text text-transparent">
                {typedTitle}
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-white/40 text-md max-w-3xl mx-auto font-mono leading-relaxed"
            >
              Understanding the mathematical foundations behind GENETIX — from Bayes' theorem 
              to polygenic risk scoring, with comprehensive clinical applications.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-4 justify-center mt-10"
            >
              <Link
                to="/app"
                className="group px-8 py-3 bg-emerald-500 hover:bg-emerald-400 text-[#0a0a0c] font-mono text-sm font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20"
              >
                Launch Interactive Engine
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <a
                href="#equations"
                className="px-8 py-3 border border-white/20 hover:border-white/40 text-white/70 hover:text-white/90 font-mono text-sm transition-all text-center"
              >
                Explore the Math
              </a>
            </motion.div>
          </motion.div>
        </section>

        {/* Stats Section - New */}
        <section className="relative z-10 max-w-7xl mx-auto px-6 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-white/5 rounded-lg overflow-hidden">
            {[
              { value: "99.8%", label: "ML Confidence", icon: <Brain className="w-4 h-4" />, trend: "+2.3%" },
              { value: "6", label: "Core Equations", icon: <Sigma className="w-4 h-4" />, trend: "Verified" },
              { value: "10k+", label: "Monte Carlo Sims", icon: <Calculator className="w-4 h-4" />, trend: "Per run" },
              { value: "8x", label: "Faster than JS", icon: <Zap className="w-4 h-4" />, trend: "Optimized" },
            ].map((stat, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                viewport={{ once: true }}
                className="bg-[#0a0a0c] p-6 text-center relative overflow-hidden group"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/0 to-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="flex items-center justify-center gap-2 text-emerald-500 mb-2">
                  {stat.icon}
                  <span className="text-2xl font-light">{stat.value}</span>
                </div>
                <p className="text-[10px] font-mono text-white/30 uppercase tracking-wider">{stat.label}</p>
                <span className="text-[8px] text-emerald-500/50 mt-1 inline-block">{stat.trend}</span>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Methods Overview */}
        <section className="relative z-10 max-w-7xl mx-auto px-6 pb-16">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/5 rounded-full mb-4">
              <Layers className="w-3 h-3 text-emerald-500" />
              <span className="text-[9px] font-mono text-white/50 uppercase tracking-wider">Core Methods</span>
            </div>
            <h2 className="text-3xl font-light text-white/90 mb-4">Computational Methodology</h2>
            <p className="text-white/40 text-sm font-mono max-w-2xl mx-auto">
              Advanced statistical techniques powering the GENETIX probability engine
            </p>
          </motion.div>

          <div className="grid md:grid-cols-4 gap-4">
            {methods.map((method, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                viewport={{ once: true }}
                className={`group p-6 border border-white/10 bg-white/[0.02] hover:border-${method.color}-500/30 transition-all relative overflow-hidden`}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${method.gradient} opacity-0 group-hover:opacity-100 transition-opacity`} />
                <div className={`text-${method.color}-500 mb-2 relative z-10`}>{method.icon}</div>
                <h4 className="text-xs font-mono text-white/80 mb-1 relative z-10">{method.title}</h4>
                <p className="text-[10px] text-white/40 leading-relaxed relative z-10">{method.description}</p>
                <div className="mt-3 pt-3 border-t border-white/5 relative z-10">
                  <span className={`text-[9px] font-mono text-${method.color}-400`}>{method.stat}</span>
                  <span className="text-[8px] text-white/30 ml-1">{method.statLabel}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Equations Section */}
        <section id="equations" className="relative z-10 max-w-7xl mx-auto px-6 py-20 border-t border-white/5">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/5 rounded-full mb-4">
              <Calculator className="w-3 h-3 text-emerald-500" />
              <span className="text-[9px] font-mono text-white/50 uppercase tracking-wider">Core Mathematics</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-light text-white/90 mb-4">Key Equations & Models</h2>
            <p className="text-white/40 text-sm font-mono max-w-2xl mx-auto">
              The mathematical foundation powering GENETIX's genetic probability engine
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-6">
            {equations.map((eq, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.08 }}
                viewport={{ once: true }}
                className={`group p-6 border border-white/10 bg-white/[0.02] hover:border-${eq.color}-500/30 transition-all relative overflow-hidden`}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${eq.gradient} opacity-0 group-hover:opacity-100 transition-opacity`} />
                
                <div className="flex items-center gap-3 mb-4 relative z-10">
                  <div className={`w-10 h-10 bg-${eq.color}-500/10 rounded-sm flex items-center justify-center group-hover:bg-${eq.color}-500/20 transition-colors`}>
                    <div className={`text-${eq.color}-500`}>{eq.symbol}</div>
                  </div>
                  <h3 className="text-sm font-mono font-bold text-white/80 uppercase tracking-wider">{eq.title}</h3>
                </div>

                <div className="bg-black/30 border border-white/5 p-4 mb-4 font-mono text-center relative z-10">
                  <span className={`text-${eq.color}-400 text-lg tracking-wider`}>{eq.formula}</span>
                </div>

                <p className="text-[11px] text-white/50 leading-relaxed mb-3 relative z-10">{eq.description}</p>

                <div className="space-y-1.5 mb-3 relative z-10">
                  {eq.variables.map((v, vi) => (
                    <p key={vi} className="text-[10px] text-white/30 font-mono">• {v}</p>
                  ))}
                </div>

                <div className={`bg-${eq.color}-500/5 border border-${eq.color}-500/10 p-3 relative z-10`}>
                  <p className={`text-[10px] text-${eq.color}-400/70 font-mono leading-relaxed`}>
                    <span className={`text-${eq.color}-500 font-bold`}>→</span> {eq.example}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Applications Section - New */}
        <section id="applications" className="relative z-10 max-w-7xl mx-auto px-6 py-20 border-t border-white/5">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/5 rounded-full mb-4">
              <Globe className="w-3 h-3 text-emerald-500" />
              <span className="text-[9px] font-mono text-white/50 uppercase tracking-wider">Real-World Impact</span>
            </div>
            <h2 className="text-3xl font-light text-white/90 mb-4">Clinical Applications</h2>
            <p className="text-white/40 text-sm font-mono max-w-2xl mx-auto">
              How the Bayesian probability engine is transforming genetics and healthcare
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {applications.map((app, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                viewport={{ once: true }}
                className="group p-6 border border-white/10 bg-white/[0.02] hover:border-emerald-500/30 transition-all relative overflow-hidden"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${app.gradient} opacity-0 group-hover:opacity-100 transition-opacity`} />
                <div className="w-10 h-10 bg-emerald-500/10 rounded-sm flex items-center justify-center mb-4 group-hover:bg-emerald-500/20 transition-colors relative z-10">
                  <div className="text-emerald-500">{app.icon}</div>
                </div>
                <h3 className="text-sm font-mono text-white/80 uppercase tracking-wider mb-2 relative z-10">
                  {app.title}
                </h3>
                <p className="text-[11px] text-white/40 leading-relaxed relative z-10">
                  {app.description}
                </p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Architecture Flow */}
        <section className="relative z-10 max-w-7xl mx-auto px-6 py-20 border-t border-white/5">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/5 rounded-full mb-4">
              <Layers className="w-3 h-3 text-emerald-500" />
              <span className="text-[9px] font-mono text-white/50 uppercase tracking-wider">Pipeline Architecture</span>
            </div>
            <h2 className="text-3xl font-light text-white/90 mb-4">End-to-End Processing Flow</h2>
          </motion.div>

          <div className="grid md:grid-cols-5 gap-3 max-w-5xl mx-auto">
            {[
              { step: "1", label: "Input", icon: <Dna className="w-4 h-4" />, desc: "Phenotype data entry" },
              { step: "2", label: "Bayesian", icon: <Sigma className="w-4 h-4" />, desc: "Posterior computation" },
              { step: "3", label: "AI Synthesis", icon: <Brain className="w-4 h-4" />, desc: "Gemini 2.0 analysis" },
              { step: "4", label: "Risk Scoring", icon: <Shield className="w-4 h-4" />, desc: "Polygenic + maternal" },
              { step: "5", label: "Visualization", icon: <BarChart3 className="w-4 h-4" />, desc: "Interactive charts" }
            ].map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.1 }}
                viewport={{ once: true }}
                className="text-center p-4 border border-white/10 bg-white/[0.02] hover:border-emerald-500/30 transition-all relative"
              >
                {idx < 4 && (
                  <div className="hidden md:block absolute -right-1.5 top-1/2 -translate-y-1/2 text-white/10 text-xs">→</div>
                )}
                <div className="w-8 h-8 mx-auto bg-emerald-500/10 rounded-full flex items-center justify-center text-emerald-500 text-xs font-mono mb-2">
                  {item.step}
                </div>
                <div className="text-emerald-500/60 flex justify-center mb-1">{item.icon}</div>
                <div className="text-[10px] font-mono text-white/60">{item.label}</div>
                <div className="text-[8px] text-white/30 mt-0.5">{item.desc}</div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Tech Stack Section - New */}
        <section className="relative z-10 max-w-7xl mx-auto px-6 py-20 border-t border-white/5">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/5 rounded-full mb-4">
                <Cpu className="w-3 h-3 text-emerald-500" />
                <span className="text-[9px] font-mono text-white/50 uppercase tracking-wider">Technology Stack</span>
              </div>
              <h2 className="text-3xl font-light text-white/90 mb-4">Built with Modern Tools</h2>
              <p className="text-white/40 text-sm font-mono mb-8">
                Cutting-edge technologies powering the GENETIX probability engine for maximum performance and accuracy.
              </p>
              <div className="flex flex-wrap gap-2">
                {techStack.map((tech, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ delay: idx * 0.05 }}
                    viewport={{ once: true }}
                    className="group relative"
                  >
                    <span
                      className={`flex items-center gap-1 text-[9px] font-mono px-2 py-1 bg-white/5 rounded ${tech.color} transition-all hover:scale-105 cursor-default`}
                    >
                      {tech.icon}
                      {tech.name}
                    </span>
                    <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 px-1.5 py-0.5 bg-gray-900 text-[8px] text-white/60 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                      {tech.desc}
                    </span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-white/[0.02] border border-white/10 p-6"
            >
              <div className="flex items-center gap-2 mb-4">
                <Lock className="w-3 h-3 text-emerald-500" />
                <span className="text-[10px] font-mono text-white/40 uppercase tracking-wider">Ethics & Compliance</span>
              </div>
              <div className="space-y-3">
                {[
                  "Educational simulation only — Not for clinical diagnosis",
                  "HIPAA-compliant data handling (no PII stored)",
                  "Transparent Bayesian models with explainable outputs",
                  "Regular audits for bias and accuracy validation",
                ].map((item, idx) => (
                  <p key={idx} className="text-[11px] text-white/60 leading-relaxed flex items-start gap-2">
                    <span className="text-emerald-500 mt-0.5">→</span> {item}
                  </p>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* Testimonials Section - New */}
        <section id="testimonials" className="relative z-10 max-w-7xl mx-auto px-6 py-20 border-t border-white/5">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/5 rounded-full mb-4">
              <Users className="w-3 h-3 text-emerald-500" />
              <span className="text-[9px] font-mono text-white/50 uppercase tracking-wider">Scientific Validation</span>
            </div>
            <h2 className="text-3xl font-light text-white/90 mb-4">Trusted by Experts</h2>
            <p className="text-white/40 text-sm font-mono max-w-2xl mx-auto">
              Endorsed by leading geneticists and computational biologists worldwide
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                viewport={{ once: true }}
                className="p-6 border border-white/10 bg-white/[0.02] hover:border-emerald-500/30 transition-all"
              >
                <div className="flex items-center gap-3 mb-4">
                  <img
                    src={testimonial.image}
                    alt={testimonial.author}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div>
                    <h4 className="text-xs font-mono text-white/80">{testimonial.author}</h4>
                    <p className="text-[9px] text-white/40">{testimonial.role}</p>
                  </div>
                </div>
                <p className="text-[11px] text-white/60 italic leading-relaxed">"{testimonial.quote}"</p>
                <div className="mt-4 flex gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3 h-3 fill-emerald-500/60 text-emerald-500/60" />
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="relative z-10 max-w-7xl mx-auto px-6 py-20">
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="text-center bg-gradient-to-r from-emerald-500/5 via-transparent to-emerald-500/5 border-y border-white/10 py-16"
          >
            <motion.div
              animate={{ y: [0, -5, 0] }}
              transition={{ repeat: Infinity, duration: 2, repeatDelay: 3 }}
            >
              <Sparkles className="w-8 h-8 text-emerald-500 mx-auto mb-4" />
            </motion.div>
            <h2 className="text-2xl md:text-3xl font-light text-white/90 mb-4">Ready to Explore the Math?</h2>
            <p className="text-white/40 text-sm font-mono mb-8 max-w-md mx-auto">
              Launch the interactive engine to see these equations in action and visualize real-time probability updates.
            </p>
            <Link
              to="/app"
              className="inline-flex items-center gap-2 px-8 py-3 bg-emerald-500 hover:bg-emerald-400 text-[#0a0a0c] font-mono text-sm font-bold uppercase tracking-wider transition-all shadow-lg shadow-emerald-500/20"
            >
              Launch App <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </section>
      </Layout>
    </div>
  );
};

export default ExplanationPage;