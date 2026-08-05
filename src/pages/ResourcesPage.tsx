// ============================================================
// RESOURCES PAGE - Complete Component
// ============================================================
import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  BookOpen, FileText, Github, ExternalLink, Download,
  ChevronUp, Zap, Brain, Microscope, Dna, Shield,
  ChevronRight, Calendar, User, Award, GitBranch
} from 'lucide-react';
import Header from '../components/Header';

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

export const ResourcesPage: React.FC = () => {
  // Research papers data
  const papers = [
    {
      id: 1,
      title: "Genetix: A Deterministic-Bayesian and Generative AI Framework for Mendelian and Polygenic Trait Inheritance Prediction",
      authors: "Mohan Yadav, Sagar Tayade, Pratik Thakare, Pooja Chauhan",
      year: "2026",
      journal: "Department of Computer Applications (MCA), Thakur College of Engineering Technology",
      abstract: "Genetix is an open-source, web-based genetic inheritance prediction platform that unifies classical Mendelian genetics with modern generative artificial intelligence to forecast trait outcomes across generations.",
      tags: ["Bayesian Networks", "VAE", "Mendelian Genetics", "Polygenic Traits"],
      link: "#",
      pdfLink: "#",
      type: "Research Paper"
    },
    {
      id: 2,
      title: "Artificial selection reveals complex genetic architecture of shoot branching and its response to nitrate supply in Arabidopsis",
      authors: "Tavares, H., Readshaw, A., Kania, T., et al.",
      year: "2023",
      journal: "PLOS Genetics",
      abstract: "This study explores the complex genetic architecture underlying shoot branching in Arabidopsis and its response to nitrate supply.",
      tags: ["Plant Genetics", "Artificial Selection", "Nitrate Response"],
      link: "https://doi.org/10.1371/journal.pgen.1010863",
      pdfLink: "#",
      type: "Reference Paper"
    },
    {
      id: 3,
      title: "Multi-trait and multi-environment Bayesian analysis to predict the G × E interaction in flood-irrigated rice",
      authors: "da Silva Júnior, A. C., Sant'Anna, et al.",
      year: "2022",
      journal: "PLOS ONE",
      abstract: "Bayesian approach for predicting genotype-by-environment interaction in flood-irrigated rice using multi-trait analysis.",
      tags: ["Bayesian Analysis", "GxE Interaction", "Rice Breeding"],
      link: "https://doi.org/10.1371/journal.pone.0268494",
      pdfLink: "#",
      type: "Reference Paper"
    },
    {
      id: 4,
      title: "Exact multipoint quantitative-trait linkage analysis in pedigrees by variance components",
      authors: "Pratt, S. C., Daly, M. J., & Kruglyak, L.",
      year: "2000",
      journal: "American Journal of Human Genetics",
      abstract: "Methodology for exact multipoint quantitative-trait linkage analysis in pedigrees using variance components approach.",
      tags: ["Linkage Analysis", "Variance Components", "Pedigree Analysis"],
      link: "https://doi.org/10.1086/302819",
      pdfLink: "#",
      type: "Reference Paper"
    },
    {
      id: 5,
      title: "Genotype pattern mining for pairs of interacting variants underlying digenic traits",
      authors: "Okazaki, A., Horpaopan, S., et al.",
      year: "2021",
      journal: "Genes",
      abstract: "Mining genotype patterns for interacting variant pairs that underlie digenic traits.",
      tags: ["Digenic Traits", "Pattern Mining", "Variant Interaction"],
      link: "https://doi.org/10.3390/genes12081163",
      pdfLink: "#",
      type: "Reference Paper"
    },
    {
      id: 6,
      title: "Artificial intelligence techniques and pedigree charts in oncogenetics: Towards an experimental multi-output software",
      authors: "Conte, L., Rizzo, E., Grassi, et al.",
      year: "2024",
      journal: "Computation",
      abstract: "Exploring AI techniques combined with pedigree charts for oncogenetic risk communication and analysis.",
      tags: ["AI in Genetics", "Oncogenetics", "Pedigree Charts"],
      link: "https://doi.org/10.3390/computation12050096",
      pdfLink: "#",
      type: "Reference Paper"
    }
  ];

  // Documentation sections
  const docs = [
    {
      icon: <Brain className="w-5 h-5" />,
      title: "Mendelian Logic Engine",
      description: "Bayesian network for single-gene traits including ABO/Rh blood typing, autosomal dominant/recessive disorders, and X-linked inheritance.",
      topics: ["Blood Type Prediction", "Autosomal Dominant", "Autosomal Recessive", "X-Linked Traits"]
    },
    {
      icon: <Zap className="w-5 h-5" />,
      title: "Polygenic ML Engine",
      description: "Variational Autoencoder for complex traits governed by hundreds of interacting variables including height, skin tone, and hair texture.",
      topics: ["Height Prediction", "Skin Tone Analysis", "Hair Texture", "Distribution Modeling"]
    },
    {
      icon: <Shield className="w-5 h-5" />,
      title: "Clinical Risk Assessment",
      description: "Risk flagging modules for maternal health, Rh incompatibility, and high-risk pregnancy detection with AI-generated clinical narratives.",
      topics: ["Rh Incompatibility", "Maternal Health", "Risk Flagging", "Clinical Narratives"]
    },
    {
      icon: <GitBranch className="w-5 h-5" />,
      title: "Pedigree Export & Analysis",
      description: "Schema-versioned pedigree export and structured data handling for downstream clinical and research applications.",
      topics: ["JSON Export", "Schema Versioning", "Family Trees", "Data Interoperability"]
    }
  ];

  // Resources categories
  const resourceCategories = [
    {
      title: "Research Papers",
      count: "6+",
      icon: <FileText className="w-4 h-4" />,
      color: "emerald"
    },
    {
      title: "Code Examples",
      count: "12+",
      icon: <GitBranch className="w-4 h-4" />,
      color: "blue"
    },
    {
      title: "API References",
      count: "8+",
      icon: <BookOpen className="w-4 h-4" />,
      color: "purple"
    },
    {
      title: "Case Studies",
      count: "5+",
      icon: <Microscope className="w-4 h-4" />,
      color: "amber"
    }
  ];

  // Citation
  const citation = `@article{yadav2026genetix,
  title={Genetix: A Deterministic-Bayesian and Generative AI Framework for Mendelian and Polygenic Trait Inheritance Prediction},
  author={Yadav, Mohan and Tayade, Sagar and Thakare, Pratik and Chauhan, Pooja},
  journal={Department of Computer Applications (MCA), Thakur College of Engineering Technology},
  year={2026},
  url={https://genetix-lake.vercel.app/}
}`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0a0c] via-[#0f0f13] to-[#0a0a0c]">
      <ScrollToTop />
      <BackToTop />

      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zMCAzMG0yOSAwYTI5IDI5IDAgMSAxLTU4IDAgMjkgMjkgMCAwIDEgNTggMHoiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4wMykiLz48L2c+PC9zdmc+')] opacity-20" />
      </div>

      {/* Navigation */}
      <Header />

      {/* Hero */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 pt-32 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full mb-6"
          >
            <BookOpen className="w-3 h-3 text-emerald-500" />
            <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-wider">Research & Documentation</span>
          </motion.div>
          <h1 className="text-4xl md:text-5xl font-light tracking-tight mb-4">
            <span className="bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 bg-clip-text text-transparent">
              Resources
            </span>
          </h1>
          <p className="text-white/40 text-md max-w-2xl mx-auto font-mono leading-relaxed">
            Explore our research papers, documentation, and reference materials for the Genetix genetic inheritance prediction platform.
          </p>
        </motion.div>
      </section>

      {/* Stats / Quick Links */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 pb-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {resourceCategories.map((cat, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="border border-white/10 bg-white/[0.02] p-4 text-center hover:border-emerald-500/30 transition-all"
            >
              <div className={`inline-flex p-2 rounded-sm bg-${cat.color}-500/10 text-${cat.color}-400 mb-2`}>
                {cat.icon}
              </div>
              <p className="text-white/70 text-sm font-mono">{cat.title}</p>
              <p className="text-white/30 text-xs font-mono">{cat.count}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Research Papers */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 pb-20">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="flex items-center gap-3 mb-8"
        >
          <div className="p-2 bg-emerald-500/10 border border-emerald-500/20 rounded-sm">
            <FileText className="w-4 h-4 text-emerald-500" />
          </div>
          <div>
            <h2 className="text-xl font-light text-white/90">Research Papers</h2>
            <p className="text-white/30 text-[10px] font-mono uppercase tracking-wider">Peer-reviewed publications & references</p>
          </div>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {papers.map((paper, idx) => (
            <motion.div
              key={paper.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              viewport={{ once: true }}
              className="border border-white/10 bg-white/[0.02] p-5 hover:border-emerald-500/30 transition-all group"
            >
              <div className="flex items-start justify-between mb-3">
                <span className="text-[8px] font-mono text-white/30 uppercase tracking-wider px-2 py-0.5 border border-white/10">
                  {paper.type}
                </span>
                <span className="text-[9px] font-mono text-white/20">{paper.year}</span>
              </div>
              <h3 className="text-sm font-mono text-white/80 leading-relaxed mb-2 line-clamp-3">
                {paper.title}
              </h3>
              <p className="text-[10px] text-white/40 font-mono mb-2 line-clamp-2">{paper.authors}</p>
              <p className="text-[10px] text-white/30 font-mono mb-3 line-clamp-2">{paper.journal}</p>
              <div className="flex flex-wrap gap-1.5 mb-4">
                {paper.tags.slice(0, 3).map((tag, i) => (
                  <span key={i} className="text-[8px] font-mono text-white/30 border border-white/10 px-2 py-0.5">
                    {tag}
                  </span>
                ))}
              </div>
              <div className="flex gap-3">
                <a
                  href={paper.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[10px] font-mono text-emerald-400 hover:text-emerald-300 flex items-center gap-1 transition-colors"
                >
                  <ExternalLink className="w-3 h-3" /> View
                </a>
                <a
                  href={paper.pdfLink}
                  className="text-[10px] font-mono text-white/30 hover:text-white/60 flex items-center gap-1 transition-colors"
                >
                  <Download className="w-3 h-3" /> PDF
                </a>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Documentation */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 pb-20 border-t border-white/5 pt-20">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="flex items-center gap-3 mb-8"
        >
          <div className="p-2 bg-blue-500/10 border border-blue-500/20 rounded-sm">
            <BookOpen className="w-4 h-4 text-blue-400" />
          </div>
          <div>
            <h2 className="text-xl font-light text-white/90">Documentation</h2>
            <p className="text-white/30 text-[10px] font-mono uppercase tracking-wider">Architecture & implementation guides</p>
          </div>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-4">
          {docs.map((doc, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              viewport={{ once: true }}
              className="border border-white/10 bg-white/[0.02] p-6 hover:border-emerald-500/30 transition-all"
            >
              <div className="flex items-start gap-4">
                <div className="p-2 bg-emerald-500/10 border border-emerald-500/20 rounded-sm shrink-0">
                  {doc.icon}
                </div>
                <div>
                  <h3 className="text-sm font-mono text-white/80 mb-1.5">{doc.title}</h3>
                  <p className="text-[11px] text-white/40 leading-relaxed mb-3">{doc.description}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {doc.topics.map((topic, i) => (
                      <span key={i} className="text-[8px] font-mono text-white/30 border border-white/10 px-2 py-0.5">
                        {topic}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Citation */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 pb-20 border-t border-white/5 pt-20">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="flex items-center gap-3 mb-6"
        >
          <div className="p-2 bg-purple-500/10 border border-purple-500/20 rounded-sm">
            <Award className="w-4 h-4 text-purple-400" />
          </div>
          <div>
            <h2 className="text-xl font-light text-white/90">Cite This Work</h2>
            <p className="text-white/30 text-[10px] font-mono uppercase tracking-wider">BibTeX citation</p>
          </div>
        </motion.div>

        <div className="border border-white/10 bg-white/[0.02] p-6 relative">
          <pre className="text-[10px] font-mono text-white/50 leading-relaxed whitespace-pre-wrap overflow-x-auto">
            {citation}
          </pre>
          <button
            onClick={() => navigator.clipboard.writeText(citation)}
            className="absolute top-4 right-4 text-[8px] font-mono text-white/20 hover:text-white/50 border border-white/10 px-2 py-1 transition-colors"
          >
            Copy
          </button>
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
          <h2 className="text-2xl font-light text-white/90 mb-4">Contribute to Genetix</h2>
          <p className="text-white/40 text-sm font-mono mb-8 max-w-md mx-auto">
            Join our open-source community. Submit issues, pull requests, or share your research.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="https://github.com/mohan-i/genetix"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-8 py-3 border border-white/20 hover:border-white/40 text-white/70 hover:text-white/90 font-mono text-sm transition-all"
            >
              <Github className="w-4 h-4" /> GitHub
            </a>
            <Link
              to="/app"
              className="inline-flex items-center gap-2 px-8 py-3 bg-emerald-500 hover:bg-emerald-400 text-[#0a0a0c] font-mono text-sm font-bold uppercase tracking-wider transition-all shadow-lg shadow-emerald-500/20"
            >
              Launch App <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/10 py-12">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <span className="text-[9px] text-white/20 font-mono">GENETIX v4.2 • MIT License • Built with TypeScript & React</span>
          <div className="flex gap-4">
            <a href="https://github.com/mohan-i/genetix" className="text-white/20 hover:text-white/40 transition-colors">
              <Github className="w-3 h-3" />
            </a>
            <a href="https://x.com/Mohan_Yadav_Dev" className="text-white/20 hover:text-white/40 transition-colors">
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
            </a>
            <a href="mailto:support@genetix.ai" className="text-white/20 hover:text-white/40 transition-colors">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default ResourcesPage;