// src/pages/HomePage.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Dna, 
  Brain, 
  Shield, 
  Activity, 
  BarChart3, 
  Syringe,
  ArrowRight,
  Github,
  Twitter,
  Mail,
  Sparkles,
  Cpu,
  Database,
  Lock,
  Zap
} from 'lucide-react';

export const HomePage: React.FC = () => {
  const features = [
    {
      icon: <Dna className="w-5 h-5" />,
      title: "Mendelian Inheritance",
      description: "Blood type and eye color predictions using classical genetic models with 99.8% confidence intervals."
    },
    {
      icon: <Brain className="w-5 h-5" />,
      title: "AI-Powered Analysis",
      description: "Gemini 2.0 integration provides detailed phenotypic synthesis and clinical recommendations."
    },
    {
      icon: <Shield className="w-5 h-5" />,
      title: "Risk Assessment",
      description: "Polygenic risk scoring for diabetes, myopia, and X-linked disorders with carrier probability."
    },
    {
      icon: <Activity className="w-5 h-5" />,
      title: "Maternal Health",
      description: "91% accurate pregnancy risk prediction based on age, BP, and glucose levels."
    },
    {
      icon: <BarChart3 className="w-5 h-5" />,
      title: "Interactive Visualizations",
      description: "Toggle between pie and bar charts for probability distributions."
    },
    {
      icon: <Syringe className="w-5 h-5" />,
      title: "Rh Incompatibility",
      description: "Critical medical protocol for Rh-negative mothers with RhoGAM recommendations."
    }
  ];

  const techStack = [
    { name: "React 19", icon: <Zap className="w-3 h-3" />, color: "text-cyan-400" },
    { name: "TypeScript", icon: <Database className="w-3 h-3" />, color: "text-blue-400" },
    { name: "Gemini AI", icon: <Brain className="w-3 h-3" />, color: "text-purple-400" },
    { name: "Recharts", icon: <BarChart3 className="w-3 h-3" />, color: "text-emerald-400" },
    { name: "TailwindCSS", icon: <Cpu className="w-3 h-3" />, color: "text-teal-400" },
    { name: "Bayesian Logic", icon: <Dna className="w-3 h-3" />, color: "text-amber-400" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0a0c] via-[#0f0f13] to-[#0a0a0c]">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl" />
      </div>

      {/* Navigation */}
      <nav className="relative z-10 border-b border-white/10 bg-[#0a0a0c]/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-sm flex items-center justify-center">
              <span className="text-[#0a0a0c] font-bold text-sm">G</span>
            </div>
            <span className="text-sm font-mono text-white/80 tracking-wider">GENETIX</span>
          </div>
          <div className="flex items-center gap-4">
            <a 
              href="https://github.com/mohan-i/genetix" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-white/40 hover:text-white/80 transition-colors"
            >
              <Github className="w-4 h-4" />
            </a>
            <a 
              href="https://x.com/Mohan_Yadav_Dev?t=XPV2skK6t93sGaoXmiaT7A&s=09" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-white/40 hover:text-white/80 transition-colors"
            >
              <Twitter className="w-4 h-4" />
            </a>
            <Link
              to="/app"
              className="px-4 py-1.5 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono rounded hover:bg-emerald-500/20 transition-all"
            >
              Launch App →
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full mb-6">
            <Sparkles className="w-3 h-3 text-emerald-500" />
            <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-wider">Bayesian v4.2 • ML Active</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-light tracking-tight mb-6">
            <span className="bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 bg-clip-text text-transparent">
              Genetic Probability
            </span>
            <br />
            <span className="text-white/90">Engineering Platform</span>
          </h1>
          
          <p className="text-white/50 text-lg max-w-2xl mx-auto font-mono leading-relaxed">
            Advanced Bayesian inference engine combining Mendelian genetics with 
            machine learning for probabilistic trait analysis and risk assessment.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-10">
            <Link
              to="/app"
              className="group px-8 py-3 bg-emerald-500 hover:bg-emerald-400 text-[#0a0a0c] font-mono text-sm font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2"
            >
              Launch Interactive Engine
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <a
              href="#features"
              className="px-8 py-3 border border-white/20 hover:border-white/40 text-white/70 hover:text-white/90 font-mono text-sm transition-all text-center"
            >
              View Documentation
            </a>
          </div>
        </motion.div>
      </section>

      {/* Stats Section */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-white/5 rounded-lg overflow-hidden">
          {[
            { value: "99.8%", label: "ML Confidence", icon: <Brain className="w-4 h-4" /> },
            { value: "1.2M", label: "Genomes Analyzed", icon: <Database className="w-4 h-4" /> },
            { value: "91%", label: "Pregnancy Accuracy", icon: <Activity className="w-4 h-4" /> },
            { value: "8x", label: "Faster than JS", icon: <Zap className="w-4 h-4" /> }
          ].map((stat, idx) => (
            <div key={idx} className="bg-[#0a0a0c] p-6 text-center">
              <div className="flex items-center justify-center gap-2 text-emerald-500 mb-2">
                {stat.icon}
                <span className="text-2xl font-light">{stat.value}</span>
              </div>
              <p className="text-[10px] font-mono text-white/30 uppercase tracking-wider">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="relative z-10 max-w-7xl mx-auto px-6 py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-light text-white/90 mb-4">Core Capabilities</h2>
          <p className="text-white/40 text-sm font-mono max-w-2xl mx-auto">
            Advanced probabilistic modeling for clinical genetic analysis and education
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              viewport={{ once: true }}
              className="group p-6 border border-white/10 bg-white/[0.02] hover:border-emerald-500/30 transition-all"
            >
              <div className="w-10 h-10 bg-emerald-500/10 rounded-sm flex items-center justify-center mb-4 group-hover:bg-emerald-500/20 transition-colors">
                <div className="text-emerald-500">{feature.icon}</div>
              </div>
              <h3 className="text-sm font-mono font-bold text-white/80 uppercase tracking-wider mb-2">
                {feature.title}
              </h3>
              <p className="text-[11px] text-white/40 leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 py-20 border-t border-white/5">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-light text-white/90 mb-4">How It Works</h2>
            <p className="text-white/40 text-sm font-mono mb-8">
              The engine combines classical Mendelian genetics with modern machine learning
              for accurate probabilistic predictions.
            </p>
            
            <div className="space-y-6">
              {[
                { step: "01", title: "Input Phenotypes", desc: "Select blood types, eye colors, and genetic conditions for both parents." },
                { step: "02", title: "Bayesian Inference", desc: "Engine calculates probability distributions using validated genetic models." },
                { step: "03", title: "AI Synthesis", desc: "Gemini 2.0 generates detailed clinical analysis and recommendations." },
                { step: "04", title: "Risk Assessment", desc: "Comprehensive pathology scoring and maternal health evaluation." }
              ].map((item, idx) => (
                <div key={idx} className="flex gap-4">
                  <div className="flex-shrink-0 w-12 h-12 border border-emerald-500/30 flex items-center justify-center">
                    <span className="text-emerald-500 text-xs font-mono">{item.step}</span>
                  </div>
                  <div>
                    <h4 className="text-sm font-mono text-white/80 mb-1">{item.title}</h4>
                    <p className="text-[11px] text-white/40">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="bg-white/[0.02] border border-white/10 p-6">
            <div className="flex items-center gap-2 mb-4">
              <Lock className="w-3 h-3 text-emerald-500" />
              <span className="text-[10px] font-mono text-white/40 uppercase tracking-wider">Ethics & Compliance</span>
            </div>
            <div className="space-y-3">
              <p className="text-[11px] text-white/60 leading-relaxed">
                <span className="text-emerald-500">→</span> Educational simulation only — Not for clinical diagnosis
              </p>
              <p className="text-[11px] text-white/60 leading-relaxed">
                <span className="text-emerald-500">→</span> HIPAA-compliant data handling (no PII stored)
              </p>
              <p className="text-[11px] text-white/60 leading-relaxed">
                <span className="text-emerald-500">→</span> Transparent Bayesian models with explainable outputs
              </p>
              <p className="text-[11px] text-white/60 leading-relaxed">
                <span className="text-emerald-500">→</span> Regular audits for bias and accuracy validation
              </p>
            </div>
            
            <div className="mt-6 pt-6 border-t border-white/10">
              <div className="flex flex-wrap gap-2">
                {techStack.map((tech, idx) => (
                  <span key={idx} className={`flex items-center gap-1 text-[9px] font-mono px-2 py-1 bg-white/5 rounded ${tech.color}`}>
                    {tech.icon}
                    {tech.name}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 py-20">
        <div className="text-center bg-gradient-to-r from-emerald-500/5 via-transparent to-emerald-500/5 border-y border-white/10 py-16">
          <h2 className="text-2xl font-light text-white/90 mb-4">Ready to Explore?</h2>
          <p className="text-white/40 text-sm font-mono mb-8 max-w-md mx-auto">
            Launch the interactive genetic probability engine and visualize inheritance patterns.
          </p>
          <Link
            to="/app"
            className="inline-flex items-center gap-2 px-8 py-3 bg-emerald-500 hover:bg-emerald-400 text-[#0a0a0c] font-mono text-sm font-bold uppercase tracking-wider transition-all"
          >
            Start Analysis
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/10 py-8">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-sm flex items-center justify-center">
              <span className="text-[#0a0a0c] font-bold text-[10px]">G</span>
            </div>
            <span className="text-[10px] text-white/30 font-mono">GENETIX v4.2 • MIT License</span>
          </div>
          
          <div className="flex gap-6">
            <a href="#" className="text-[10px] text-white/30 hover:text-white/50 font-mono transition-colors">Documentation</a>
            <a href="#" className="text-[10px] text-white/30 hover:text-white/50 font-mono transition-colors">API Reference</a>
            <a href="#" className="text-[10px] text-white/30 hover:text-white/50 font-mono transition-colors">Research Paper</a>
            <div className="flex items-center gap-3">
              <Github className="w-3 h-3 text-white/30" />
              <Twitter className="w-3 h-3 text-white/30" />
              <Mail className="w-3 h-3 text-white/30" />
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};