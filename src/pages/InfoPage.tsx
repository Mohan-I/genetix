// ============================================================
// EXPLANATION PAGE - Complete Component
// ============================================================
import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import {
  Dna, Brain, Shield, BarChart3, Syringe, Heart, ArrowRight,
  Github, Twitter, Mail, Sparkles, ChevronUp, Info,
  Calculator, Sigma, FunctionSquare, Database, PieChart,
  Layers, Clock as ClockIcon
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
      example: "Example: Predicting blood type inheritance. Prior: 45% Type O, Likelihood: 90% if both parents carry O allele, Posterior: updated probability."
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
      example: "Example: Eye color inheritance. Parent 1: 50% B (brown), 50% b (blue). Parent 2: 100% b. Child: 50% Bb (brown), 50% bb (blue)."
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
      example: "Example: Type 2 diabetes risk. 10 SNPs with effect sizes, sum weighted alleles. PRS > 1.5 indicates 3x increased risk."
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
      example: "Example: Color blindness. Carrier mother (XᶜX) × normal father (XY). Sons: 50% affected (XᶜY). Daughters: 50% carriers (XᶜX)."
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
      example: "Example: 35-year-old, BP 145/90, glucose 100 mg/dL, BMI 32 → 91% predicted risk score."
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
      example: "Example: Rh-negative mother, Rh-positive fetus. Without RhoGAM: 15% sensitization risk. With RhoGAM: <0.5% risk."
    }
  ];

  const methods = [
    {
      title: "Monte Carlo Sampling",
      icon: <Calculator className="w-4 h-4" />,
      description: "We use 10,000+ Monte Carlo simulations to approximate posterior distributions for complex genetic models.",
      color: "emerald"
    },
    {
      title: "Bayesian Updating",
      icon: <FunctionSquare className="w-4 h-4" />,
      description: "Continuous probability refinement as new phenotype data is entered into the system.",
      color: "blue"
    },
    {
      title: "GWAS Integration",
      icon: <Database className="w-4 h-4" />,
      description: "Genome-wide association study data integrated for polygenic risk scoring across 50+ traits.",
      color: "purple"
    },
    {
      title: "Confidence Intervals",
      icon: <PieChart className="w-4 h-4" />,
      description: "95% and 99.8% credible intervals computed using highest density region (HDR) estimation.",
      color: "amber"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0a0c] via-[#0f0f13] to-[#0a0a0c]">
      <Layout >

      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zMCAzMG0yOSAwYTI5IDI5IDAgMSAxLTU4IDAgMjkgMjkgMCAwIDEgNTggMHoiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4wMykiLz48L2c+PC9zdmc+')] opacity-20" />
      </div>

      {/* Hero */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 pt-32 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <motion.div
            style={{ opacity }}
            className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full mb-6"
          >
            <Brain className="w-3 h-3 text-emerald-500" />
            <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-wider">Bayesian v4.2 • ML Active</span>
          </motion.div>
          <h1 className="text-3xl md:text-5xl font-light tracking-tight mb-4">
            <span className="bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 bg-clip-text text-transparent">
              {typedTitle}
            </span>
          </h1>
          <p className="text-white/40 text-md max-w-3xl mx-auto font-mono leading-relaxed">
            Understanding the mathematical foundations behind GENETIX — from Bayes' theorem to polygenic risk scoring.
          </p>
        </motion.div>
      </section>

      {/* Methods Overview */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 pb-16">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="grid md:grid-cols-4 gap-4"
        >
          {methods.map((method, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              viewport={{ once: true }}
              className={`p-4 border border-white/10 bg-white/[0.02] hover:border-${method.color}-500/30 transition-all group`}
            >
              <div className={`text-${method.color}-500 mb-2`}>{method.icon}</div>
              <h4 className="text-xs font-mono text-white/80 mb-1">{method.title}</h4>
              <p className="text-[10px] text-white/40 leading-relaxed">{method.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Equations */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 pb-20">
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
          <h2 className="text-3xl font-light text-white/90 mb-4">Key Equations & Models</h2>
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
              className="border border-white/10 bg-white/[0.02] p-6 hover:border-emerald-500/30 transition-all group"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="text-emerald-500">{eq.symbol}</div>
                <h3 className="text-sm font-mono text-white/80">{eq.title}</h3>
              </div>

              <div className="bg-black/30 border border-white/5 p-4 mb-4 font-mono text-center">
                <span className="text-emerald-400 text-lg tracking-wider">{eq.formula}</span>
              </div>

              <p className="text-[11px] text-white/50 leading-relaxed mb-3">{eq.description}</p>

              <div className="space-y-1.5 mb-3">
                {eq.variables.map((v, vi) => (
                  <p key={vi} className="text-[10px] text-white/30 font-mono">• {v}</p>
                ))}
              </div>

              <div className="bg-emerald-500/5 border border-emerald-500/10 p-3">
                <p className="text-[10px] text-emerald-400/70 font-mono leading-relaxed">
                  <span className="text-emerald-500 font-bold">→</span> {eq.example}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Architecture Flow */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 pb-20 border-t border-white/5 pt-20">
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

      {/* CTA */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 pb-20">
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
            Launch the interactive engine to see these equations in action.
          </p>
          <Link
            to="/app"
            className="inline-flex items-center gap-2 px-8 py-3 bg-emerald-500 hover:bg-emerald-400 text-[#0a0a0c] font-mono text-sm font-bold uppercase tracking-wider transition-all shadow-lg shadow-emerald-500/20"
          >
            Launch App <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>
      </section>
      </ Layout >
    </div>
  );
};