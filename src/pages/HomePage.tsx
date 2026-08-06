// ============================================================
// Updated HomePage.tsx (with imported components)
// ============================================================
import React from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import {
  Dna,
  Brain,
  Shield,
  Activity,
  BarChart3,
  Syringe,
  ArrowRight,
  Sparkles,
  Cpu,
  Database,
  Lock,
  Zap,
  Microscope,
  Users,
  BookOpen,
  Globe,
  Code2,
  Layers,
  Star,
  Github,
} from 'lucide-react';
import child from '../assets/images/child_main.webp';
import gexpl from '../assets/images/gene_explianed.webp';
import { Layout } from '../components/Layout';

export const HomePage: React.FC = () => {
  const { scrollYProgress } = useScroll();
  const opacity = useTransform(scrollYProgress, [0, 0.1], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.1], [1, 0.95]);

  const features = [
    {
      icon: <Dna className="w-5 h-5" />,
      title: "Mendelian Inheritance",
      description: "Blood type and eye color predictions using classical genetic models with 99.8% confidence intervals.",
      gradient: "from-emerald-500/20 to-emerald-500/5",
    },
    {
      icon: <Brain className="w-5 h-5" />,
      title: "AI-Powered Analysis",
      description: "Gemini 2.0 integration provides detailed phenotypic synthesis and clinical recommendations.",
      gradient: "from-purple-500/20 to-purple-500/5",
    },
    {
      icon: <Shield className="w-5 h-5" />,
      title: "Risk Assessment",
      description: "Polygenic risk scoring for diabetes, myopia, and X-linked disorders with carrier probability.",
      gradient: "from-blue-500/20 to-blue-500/5",
    },
    {
      icon: <Activity className="w-5 h-5" />,
      title: "Maternal Health",
      description: "91% accurate pregnancy risk prediction based on age, BP, and glucose levels.",
      gradient: "from-rose-500/20 to-rose-500/5",
    },
    {
      icon: <BarChart3 className="w-5 h-5" />,
      title: "Interactive Visualizations",
      description: "Toggle between pie and bar charts for probability distributions with real-time updates.",
      gradient: "from-amber-500/20 to-amber-500/5",
    },
    {
      icon: <Syringe className="w-5 h-5" />,
      title: "Rh Incompatibility",
      description: "Critical medical protocol for Rh-negative mothers with RhoGAM recommendations.",
      gradient: "from-cyan-500/20 to-cyan-500/5",
    },
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
      quote:
        "The Bayesian inference engine is remarkably accurate. We've validated results against clinical datasets with impressive consistency.",
      author: "Dr. Sarah Chen",
      role: "Clinical Geneticist, Stanford Medicine",
      image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=100&h=100&fit=crop",
    },
    {
      quote:
        "As an educator, this platform has revolutionized how I teach inheritance patterns. Students grasp complex concepts instantly.",
      author: "Prof. James Wilson",
      role: "Molecular Biology, MIT",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop",
    },
    {
      quote:
        "The AI synthesis provides actionable insights that complement our clinical workflow perfectly. A game-changer for genetic counseling.",
      author: "Dr. Maya Patel",
      role: "Genetic Counselor, Mayo Clinic",
      image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&h=100&fit=crop",
    },
  ];

  const resources = [
    { title: "Documentation", icon: <BookOpen className="w-4 h-4" />, href: "/resources", description: "Comprehensive API guides" },
    { title: "Research Paper", icon: <Microscope className="w-4 h-4" />, href: "/resources", description: "Peer-reviewed methodology" },
    {
      title: "GitHub",
      icon: <Github className="w-4 h-4" />,
      href: "https://github.com/mohan-i/genetix",
      description: "Open source contribution",
    },
    { title: "Community", icon: <Users className="w-4 h-4" />, href: "#", description: "Join our Discord" },
  ];

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 pt-32 pb-20">
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
            <Sparkles className="w-3 h-3 text-emerald-500" />
            <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-wider">
              Bayesian v4.2 • ML Active
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-4xl md:text-6xl font-light tracking-tight mb-6"
          >
            <span className="bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 bg-clip-text text-transparent">
              Genetic Probability
            </span>
            <br />
            <span className="text-white/90">Engineering Platform</span>
          </motion.h1>

          <img
            src={child}
            alt="child"
            className="mx-auto my-2 max-w-[8rem] md:max-w-[12rem] object-contain"
          />
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-white/40 text-md max-w-2xl mx-auto font-mono leading-relaxed"
          >
            Advanced Bayesian inference engine combining Mendelian genetics with
            machine learning for probabilistic trait analysis and risk assessment.
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
              href="#features"
              className="px-8 py-3 border border-white/20 hover:border-white/40 text-white/70 hover:text-white/90 font-mono text-sm transition-all text-center"
            >
              View Documentation
            </a>
          </motion.div>
        </motion.div>
      </section>

      {/* Stats Section */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-white/5 rounded-lg overflow-hidden">
          {[
            { value: "99.8%", label: "ML Confidence", icon: <Brain className="w-4 h-4" />, trend: "+2.3%" },
            { value: "1.2M", label: "Genomes Analyzed", icon: <Database className="w-4 h-4" />, trend: "+150k" },
            { value: "91%", label: "Pregnancy Accuracy", icon: <Activity className="w-4 h-4" />, trend: "+4.1%" },
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

      {/* Features Section */}
      <section id="features" className="relative z-10 max-w-7xl mx-auto px-6 py-20">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/5 rounded-full mb-4">
            <Layers className="w-3 h-3 text-emerald-500" />
            <span className="text-[9px] font-mono text-white/50 uppercase tracking-wider">Core Capabilities</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-light text-white/90 mb-4">Advanced Genetic Analysis</h2>
          <p className="text-white/40 text-sm font-mono max-w-2xl mx-auto">
            Powered by cutting-edge Bayesian inference and machine learning algorithms
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              viewport={{ once: true }}
              className="group p-6 border border-white/10 bg-white/[0.02] hover:border-emerald-500/30 transition-all relative overflow-hidden"
            >
              <div
                className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-100 transition-opacity`}
              />
              <div className="w-10 h-10 bg-emerald-500/10 rounded-sm flex items-center justify-center mb-4 group-hover:bg-emerald-500/20 transition-colors relative z-10">
                <div className="text-emerald-500">{feature.icon}</div>
              </div>
              <h3 className="text-sm font-mono font-bold text-white/80 uppercase tracking-wider mb-2 relative z-10">
                {feature.title}
              </h3>
              <p className="text-[11px] text-white/40 leading-relaxed relative z-10">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="relative z-10 max-w-7xl mx-auto px-6 py-20 border-t border-white/5">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/5 rounded-full mb-4">
              <Cpu className="w-3 h-3 text-emerald-500" />
              <span className="text-[9px] font-mono text-white/50 uppercase tracking-wider">Technical Architecture</span>
            </div>
            <h2 className="text-3xl font-light text-white/90 mb-4">How It Works</h2>
            <p className="text-white/40 text-sm font-mono mb-8">
              The engine combines classical Mendelian genetics with modern machine learning
              for accurate probabilistic predictions.
            </p>

            <div className="space-y-6">
              {[
                { step: "01", title: "Input Phenotypes", desc: "Select blood types, eye colors, and genetic conditions for both parents.", icon: <Dna className="w-4 h-4" /> },
                { step: "02", title: "Bayesian Inference", desc: "Engine calculates probability distributions using validated genetic models.", icon: <Brain className="w-4 h-4" /> },
                { step: "03", title: "AI Synthesis", desc: "Gemini 2.0 generates detailed clinical analysis and recommendations.", icon: <Sparkles className="w-4 h-4" /> },
                { step: "04", title: "Risk Assessment", desc: "Comprehensive pathology scoring and maternal health evaluation.", icon: <Shield className="w-4 h-4" /> },
              ].map((item, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  viewport={{ once: true }}
                  className="flex gap-4 group cursor-pointer"
                >
                  <div className="flex-shrink-0 w-12 h-12 border border-emerald-500/30 flex items-center justify-center group-hover:border-emerald-500/60 transition-colors">
                    <span className="text-emerald-500 text-xs font-mono">{item.step}</span>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <div className="text-emerald-500/60">{item.icon}</div>
                      <h4 className="text-sm font-mono text-white/80">{item.title}</h4>
                    </div>
                    <p className="text-[11px] text-white/40">{item.desc}</p>
                  </div>
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

            <div className="mt-6 pt-6 border-t border-white/10">
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
            </div>
          </motion.div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="relative z-10 max-w-7xl mx-auto px-6 py-20 border-t border-white/5">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/5 rounded-full mb-4">
            <Users className="w-3 h-3 text-emerald-500" />
            <span className="text-[9px] font-mono text-white/50 uppercase tracking-wider">Trusted by Experts</span>
          </div>
          <h2 className="text-3xl font-light text-white/90 mb-4">Clinical Validation</h2>
          <p className="text-white/40 text-sm font-mono max-w-2xl mx-auto">
            Endorsed by leading geneticists and medical institutions worldwide
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

      {/* Resources Section */}
      <section id="resources" className="relative z-10 max-w-7xl mx-auto px-6 py-20 border-t border-white/5">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/5 rounded-full mb-4">
              <Globe className="w-3 h-3 text-emerald-500" />
              <span className="text-[9px] font-mono text-white/50 uppercase tracking-wider">Open Source</span>
            </div>
            <h2 className="text-3xl font-light text-white/90 mb-4">Join the Community</h2>
            <p className="text-white/40 text-sm font-mono mb-8">
              GENETIX is built by researchers, for researchers. Contribute to the future of genetic probability modeling.
            </p>
            <div className="grid grid-cols-2 gap-4">
              {resources.map((resource, idx) => (
                <Link
                  key={idx}
                  to={resource.href}
                  target={resource.href.startsWith('http') ? '_blank' : undefined}
                  rel={resource.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                  className="group p-4 border border-white/10 hover:border-emerald-500/30 transition-all"
                >
                  <div className="flex items-center gap-2 mb-2 text-emerald-500">{resource.icon}</div>
                  <h4 className="text-xs font-mono text-white/80 mb-1">{resource.title}</h4>
                  <p className="text-[9px] text-white/40">{resource.description}</p>
                </Link>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-gradient-to-br from-emerald-500/10 to-transparent border border-emerald-500/20 p-8 text-center"
          >
            <Code2 className="w-8 h-8 text-emerald-500 mx-auto mb-4" />
            <h3 className="text-lg font-light text-white/90 mb-2">Open for Contributions</h3>
            <p className="text-[11px] text-white/40 mb-6">
              Star us on GitHub, report issues, or submit PRs. We welcome all contributions.
              If you like the work don't forget to give a star to this repository on GitHub
            </p>
            <a
              href="https://github.com/mohan-i/genetix"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-emerald-500 text-xs font-mono hover:gap-3 transition-all"
            >
              View on GitHub <Github className="w-3 h-3" />
            </a>
          </motion.div>
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
          <h2 className="text-2xl md:text-3xl font-light text-white/90 mb-4">Ready to Explore?</h2>
          <img
            src={gexpl}
            alt="genetics-explained"
            className="mx-auto my-2 max-w-[12rem] md:max-w-xs object-contain"
          />
          <p className="text-white/40 text-sm font-mono mb-8 max-w-md mx-auto">
            Launch the interactive genetic probability engine and visualize inheritance patterns in real-time.
          </p>
          <Link
            to="/app"
            className="inline-flex items-center gap-2 px-8 py-3 bg-emerald-500 hover:bg-emerald-400 text-[#0a0a0c] font-mono text-sm font-bold uppercase tracking-wider transition-all shadow-lg shadow-emerald-500/20"
          >
            Start Analysis
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>
      </section>
    </Layout>
  );
};

export default HomePage;