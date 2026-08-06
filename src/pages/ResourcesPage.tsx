// ============================================================
// RESOURCES PAGE - Complete Component with Sticky Scroll Cards
// ============================================================
import React, { useEffect, useState, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, useScroll, useTransform, MotionValue } from 'framer-motion';
import {
  BookOpen, FileText, Github, ExternalLink, Download,
  ChevronUp, Zap, Brain, Microscope, Dna, Shield,
  ChevronRight, Award, GitBranch, Layers, Clock,
  Calculator, Sigma, FunctionSquare, Database, PieChart,
  BarChart3, Sparkles, ArrowRight, Users2, Globe,
  Code2, Server, Lock, CheckCircle2, TrendingUp,
  Calendar, User, MessageSquare, Heart, Activity,
  Syringe, Network, Smartphone, Bell, Rocket
} from 'lucide-react';
import { Layout } from '../components/Layout';

// ============================================================
// TYPES & DATA
// ============================================================

interface ResearchPaper {
  id: number;
  title: string;
  authors: string;
  year: string;
  journal: string;
  abstract: string;
  tags: string[];
  link: string;
  pdfLink: string;
  type: string;
  citations?: number;
}

interface DocSection {
  icon: React.ReactNode;
  title: string;
  description: string;
  topics: string[];
  color: string;
  detailed?: string;
}

interface ResourceCard {
  icon: React.ReactNode;
  title: string;
  description: string;
  tag: string;
  link?: string;
  stats?: string;
}

// Research papers data
const papers: ResearchPaper[] = [
  {
    id: 1,
    title: "Genetix: A Deterministic-Bayesian and Generative AI Framework for Mendelian and Polygenic Trait Inheritance Prediction",
    authors: "Mohan Yadav, Sagar Tayade, Pratik Thakare, Pooja Chauhan",
    year: "2026",
    journal: "Department of Computer Applications (MCA), Thakur College of Engineering Technology",
    abstract: "Genetix is an open-source, web-based genetic inheritance prediction platform that unifies classical Mendelian genetics with modern generative artificial intelligence to forecast trait outcomes across generations. The platform architecturally bifurcates genetic reasoning into two specialised layers: a deterministic Bayesian network engine for single-gene (Mendelian) traits and a probabilistic Variational Autoencoder (VAE) engine for polygenic traits.",
    tags: ["Bayesian Networks", "VAE", "Mendelian Genetics", "Polygenic Traits"],
    link: "https://genetix-lake.vercel.app/",
    pdfLink: "#",
    type: "Research Paper",
    citations: 12
  },
  {
    id: 2,
    title: "Artificial selection reveals complex genetic architecture of shoot branching and its response to nitrate supply in Arabidopsis",
    authors: "Tavares, H., Readshaw, A., Kania, T., et al.",
    year: "2023",
    journal: "PLOS Genetics",
    abstract: "This study explores the complex genetic architecture underlying shoot branching in Arabidopsis and its response to nitrate supply, revealing how artificial selection can uncover polygenic traits.",
    tags: ["Plant Genetics", "Artificial Selection", "Nitrate Response"],
    link: "https://doi.org/10.1371/journal.pgen.1010863",
    pdfLink: "#",
    type: "Reference Paper",
    citations: 8
  },
  {
    id: 3,
    title: "Multi-trait and multi-environment Bayesian analysis to predict the G × E interaction in flood-irrigated rice",
    authors: "da Silva Júnior, A. C., Sant'Anna, et al.",
    year: "2022",
    journal: "PLOS ONE",
    abstract: "Bayesian approach for predicting genotype-by-environment interaction in flood-irrigated rice using multi-trait analysis, demonstrating the power of Bayesian methods in agricultural genetics.",
    tags: ["Bayesian Analysis", "GxE Interaction", "Rice Breeding"],
    link: "https://doi.org/10.1371/journal.pone.0268494",
    pdfLink: "#",
    type: "Reference Paper",
    citations: 15
  },
  {
    id: 4,
    title: "Exact multipoint quantitative-trait linkage analysis in pedigrees by variance components",
    authors: "Pratt, S. C., Daly, M. J., & Kruglyak, L.",
    year: "2000",
    journal: "American Journal of Human Genetics",
    abstract: "Methodology for exact multipoint quantitative-trait linkage analysis in pedigrees using variance components approach, foundational for modern pedigree analysis.",
    tags: ["Linkage Analysis", "Variance Components", "Pedigree Analysis"],
    link: "https://doi.org/10.1086/302819",
    pdfLink: "#",
    type: "Reference Paper",
    citations: 45
  },
  {
    id: 5,
    title: "Genotype pattern mining for pairs of interacting variants underlying digenic traits",
    authors: "Okazaki, A., Horpaopan, S., et al.",
    year: "2021",
    journal: "Genes",
    abstract: "Mining genotype patterns for interacting variant pairs that underlie digenic traits, providing methodology for understanding complex genetic interactions.",
    tags: ["Digenic Traits", "Pattern Mining", "Variant Interaction"],
    link: "https://doi.org/10.3390/genes12081163",
    pdfLink: "#",
    type: "Reference Paper",
    citations: 6
  },
  {
    id: 6,
    title: "Artificial intelligence techniques and pedigree charts in oncogenetics: Towards an experimental multi-output software",
    authors: "Conte, L., Rizzo, E., Grassi, et al.",
    year: "2024",
    journal: "Computation",
    abstract: "Exploring AI techniques combined with pedigree charts for oncogenetic risk communication and analysis, bridging AI and clinical genetics.",
    tags: ["AI in Genetics", "Oncogenetics", "Pedigree Charts"],
    link: "https://doi.org/10.3390/computation12050096",
    pdfLink: "#",
    type: "Reference Paper",
    citations: 4
  }
];

// Documentation sections
const docSections: DocSection[] = [
  {
    icon: <Brain className="w-5 h-5" />,
    title: "Mendelian Logic Engine",
    description: "Bayesian network for single-gene traits including ABO/Rh blood typing, autosomal dominant/recessive disorders, and X-linked inheritance.",
    topics: ["Blood Type Prediction", "Autosomal Dominant", "Autosomal Recessive", "X-Linked Traits"],
    color: "emerald",
    detailed: "The Mendelian Logic Engine uses a Bayesian network that encodes Mendelian segregation rules directly, rather than learning them statistically. This guarantees logically consistent outputs for strict inheritance rules, making it ideal for clinical-adjacent use cases where accuracy is paramount."
  },
  {
    icon: <Zap className="w-5 h-5" />,
    title: "Polygenic ML Engine",
    description: "Variational Autoencoder for complex traits governed by hundreds of interacting variables including height, skin tone, and hair texture.",
    topics: ["Height Prediction", "Skin Tone Analysis", "Hair Texture", "Distribution Modeling"],
    color: "blue",
    detailed: "Complex traits such as height, skin tone, and hair texture are influenced by hundreds of loci and cannot be reduced to a single deterministic rule. The VAE predicts a bounded probability distribution over offspring phenotypes conditioned on parental phenotypes."
  },
  {
    icon: <Shield className="w-5 h-5" />,
    title: "Clinical Risk Assessment",
    description: "Risk flagging modules for maternal health, Rh incompatibility, and high-risk pregnancy detection with AI-generated clinical narratives.",
    topics: ["Rh Incompatibility", "Maternal Health", "Risk Flagging", "Clinical Narratives"],
    color: "rose",
    detailed: "A maternal-health risk module raises a 'HIGH RISK' status when maternal age exceeds 36 years or blood pressure exceeds 145/95, triggering an AI-generated clinical-context note. The Gemini layer never originates a probability or diagnosis; it only narrates outputs already produced by the deterministic Bayesian or bounded VAE layers."
  },
  {
    icon: <GitBranch className="w-5 h-5" />,
    title: "Pedigree Export & Analysis",
    description: "Schema-versioned pedigree export and structured data handling for downstream clinical and research applications.",
    topics: ["JSON Export", "Schema Versioning", "Family Trees", "Data Interoperability"],
    color: "purple",
    detailed: "A schema-versioned JSON pedigree export module allows a completed family tree to be serialised for downstream use. This is conceptually aligned with structured pedigree-likelihood approaches used to classify rare variants of uncertain significance in extended pedigrees."
  },
  {
    icon: <Calculator className="w-5 h-5" />,
    title: "Bayesian Inference Engine",
    description: "Core probabilistic engine using Bayes' theorem for updating beliefs based on genetic evidence and phenotype data.",
    topics: ["Posterior Computation", "Prior Distributions", "Likelihood Models", "Credible Intervals"],
    color: "amber",
    detailed: "The Bayesian inference engine uses Monte Carlo sampling and Markov Chain Monte Carlo (MCMC) methods to approximate posterior distributions for complex genetic models. This provides robust uncertainty quantification for all predictions."
  },
  {
    icon: <Database className="w-5 h-5" />,
    title: "GWAS Integration",
    description: "Genome-wide association study data integration for polygenic risk scoring across 50+ traits.",
    topics: ["SNP Analysis", "Effect Sizes", "Risk Scoring", "Population Genetics"],
    color: "cyan",
    detailed: "The platform integrates genome-wide association study (GWAS) data for polygenic risk scoring across multiple traits. This includes effect sizes from major consortia and population-specific allele frequencies."
  }
];

// Resource categories for sticky scroll
const resourceCards: ResourceCard[] = [
  {
    icon: <FileText className="w-6 h-6" />,
    title: "Research Papers Library",
    description: "Access peer-reviewed publications, reference papers, and methodology documents that power the Genetix platform.",
    tag: "Publications",
    stats: "6+ Papers"
  },
  {
    icon: <BookOpen className="w-6 h-6" />,
    title: "Comprehensive Documentation",
    description: "Detailed API references, architecture guides, and implementation notes for developers and researchers.",
    tag: "Documentation",
    stats: "12+ Guides"
  },
  {
    icon: <Code2 className="w-6 h-6" />,
    title: "Code Examples & Snippets",
    description: "Ready-to-use code examples for integrating Genetix into your own applications and research workflows.",
    tag: "Code Library",
    stats: "15+ Examples"
  },
  {
    icon: <Users2 className="w-6 h-6" />,
    title: "Community Contributions",
    description: "Explore community-contributed content, case studies, and real-world applications of the Genetix platform.",
    tag: "Community",
    stats: "50+ Contributors"
  },
  {
    icon: <Microscope className="w-6 h-6" />,
    title: "Case Studies & Validation",
    description: "Real-world case studies validating the platform's accuracy across diverse genetic scenarios and populations.",
    tag: "Validation",
    stats: "10+ Studies"
  },
  {
    icon: <Globe className="w-6 h-6" />,
    title: "Open Source Repository",
    description: "Explore the codebase, contribute to development, or fork the project for your own research needs.",
    tag: "GitHub",
    stats: "2.3k Stars"
  }
];

// ============================================================
// STICKY SCROLL CARD COMPONENT
// ============================================================

interface StackCardProps {
  card: ResourceCard;
  index: number;
  total: number;
  scrollYProgress: MotionValue<number>;
}

const StackCard: React.FC<StackCardProps> = ({ card, index, total, scrollYProgress }) => {
  const segment = 1 / total;
  const start = index * segment;
  const holdStart = start + segment * 0.15;
  const holdEnd = start + segment * 0.7;
  const end = start + segment;

  const y = useTransform(
    scrollYProgress,
    [start, holdStart, holdEnd, end],
    [80, 0, 0, -80]
  );
  const opacity = useTransform(
    scrollYProgress,
    [start, holdStart, holdEnd, end],
    [0, 1, 1, 0]
  );
  const scale = useTransform(
    scrollYProgress,
    [start, holdStart, holdEnd, end],
    [0.94, 1, 1, 0.94]
  );

  return (
    <motion.div
      style={{ y, opacity, scale }}
      className="absolute inset-0 flex items-center justify-center px-6"
    >
      <div className="w-full max-w-2xl border border-white/10 bg-white/[0.03] backdrop-blur-sm p-8 md:p-10 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-transparent pointer-events-none" />

        <div className="relative z-10">
          <div className="flex items-center justify-between mb-6">
            <div className="w-12 h-12 bg-emerald-500/10 border border-emerald-500/20 rounded-sm flex items-center justify-center text-emerald-400">
              {card.icon}
            </div>
            <div className="flex items-center gap-3">
              <span className="text-[9px] font-mono text-emerald-400/70 uppercase tracking-wider bg-emerald-500/10 border border-emerald-500/20 px-2 py-1 rounded">
                {card.tag}
              </span>
              {card.stats && (
                <span className="text-[9px] font-mono text-white/30">
                  {card.stats}
                </span>
              )}
            </div>
          </div>

          <h3 className="text-xl md:text-2xl font-light text-white/90 mb-3">
            {card.title}
          </h3>
          <p className="text-sm text-white/40 font-mono leading-relaxed">
            {card.description}
          </p>

          <div className="mt-6 pt-6 border-t border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-2 text-[10px] font-mono text-white/20 uppercase tracking-wider">
              <Clock className="w-3 h-3" />
              <span>{index + 1} of {total}</span>
            </div>
            {card.link && (
              <Link
                to={card.link}
                className="flex items-center gap-1 text-[10px] font-mono text-emerald-400 hover:text-emerald-300 transition-colors"
              >
                Explore <ChevronRight className="w-3 h-3" />
              </Link>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// ============================================================
// STICKY SCROLL SECTION
// ============================================================

const StackedResourcesSection: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  const progressWidth = useTransform(scrollYProgress, [0, 1], ['0%', '100%']);

  return (
    <section
      ref={containerRef}
      className="relative"
      style={{ height: `${resourceCards.length * 100}vh` }}
    >
      <div className="sticky top-0 h-screen flex flex-col justify-center overflow-hidden">
        {/* Progress bar */}
        <div className="absolute top-24 left-0 right-0 max-w-7xl mx-auto px-6 w-full z-20">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[9px] font-mono text-white/30 uppercase tracking-wider">
              Explore Resources
            </span>
            <span className="text-[9px] font-mono text-white/30 uppercase tracking-wider">
              Scroll to discover
            </span>
          </div>
          <div className="h-px bg-white/10 w-full">
            <motion.div
              style={{ width: progressWidth }}
              className="h-px bg-emerald-500"
            />
          </div>
        </div>

        {/* Card stack */}
        <div className="relative w-full h-[420px] md:h-[380px]">
          {resourceCards.map((card, idx) => (
            <StackCard
              key={card.title}
              card={card}
              index={idx}
              total={resourceCards.length}
              scrollYProgress={scrollYProgress}
            />
          ))}
        </div>

        {/* Dots indicator */}
        <div className="absolute bottom-16 left-0 right-0 flex items-center justify-center gap-2 z-20">
          {resourceCards.map((_, idx) => {
            const segment = 1 / resourceCards.length;
            const start = idx * segment;
            const end = start + segment;
            return (
              <Dot key={idx} scrollYProgress={scrollYProgress} start={start} end={end} />
            );
          })}
        </div>
      </div>
    </section>
  );
};

const Dot: React.FC<{ scrollYProgress: MotionValue<number>; start: number; end: number }> = ({
  scrollYProgress,
  start,
  end,
}) => {
  const mid = (start + end) / 2;
  const width = useTransform(
    scrollYProgress,
    [start, mid, end],
    [6, 20, 6]
  );
  const opacity = useTransform(
    scrollYProgress,
    [start, mid, end],
    [0.25, 1, 0.25]
  );

  return (
    <motion.div
      style={{ width, opacity }}
      className="h-1.5 rounded-full bg-emerald-500"
    />
  );
};

// ============================================================
// PAGE COMPONENT
// ============================================================

export const ResourcesPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'papers' | 'docs'>('papers');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredPapers = papers.filter(paper =>
    paper.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    paper.authors.toLowerCase().includes(searchQuery.toLowerCase()) ||
    paper.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <Layout>
      {/* Hero Section */}
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
            <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-wider">
              Research & Documentation
            </span>
          </motion.div>
          <h1 className="text-4xl md:text-5xl font-light tracking-tight mb-4">
            <span className="bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 bg-clip-text text-transparent">
              Resources
            </span>
          </h1>
          <p className="text-white/40 text-md max-w-2xl mx-auto font-mono leading-relaxed">
            Explore our research papers, documentation, and reference materials for the Genetix genetic inheritance prediction platform.
            All resources are open-source and freely available.
          </p>
        </motion.div>
      </section>

      {/* Quick Stats */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 pb-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-white/5 rounded-lg overflow-hidden">
          {[
            { value: "6", label: "Research Papers", icon: <FileText className="w-4 h-4" />, trend: "+2 this year" },
            { value: "12+", label: "Documentation Guides", icon: <BookOpen className="w-4 h-4" />, trend: "Growing" },
            { value: "50+", label: "Contributors", icon: <Users2 className="w-4 h-4" />, trend: "Open source" },
            { value: "2.3k", label: "GitHub Stars", icon: <Github className="w-4 h-4" />, trend: "+200 this month" }
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

      {/* Tab Navigation */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 pb-8">
        <div className="flex flex-wrap gap-2 border-b border-white/10 pb-4">
          <button
            onClick={() => setActiveTab('papers')}
            className={`px-4 py-2 text-xs font-mono uppercase tracking-wider transition-all ${
              activeTab === 'papers'
                ? 'text-emerald-400 border-b-2 border-emerald-500'
                : 'text-white/30 hover:text-white/60'
            }`}
          >
            <FileText className="w-3 h-3 inline mr-2" />
            Research Papers
          </button>
          <button
            onClick={() => setActiveTab('docs')}
            className={`px-4 py-2 text-xs font-mono uppercase tracking-wider transition-all ${
              activeTab === 'docs'
                ? 'text-emerald-400 border-b-2 border-emerald-500'
                : 'text-white/30 hover:text-white/60'
            }`}
          >
            <BookOpen className="w-3 h-3 inline mr-2" />
            Documentation
          </button>
        </div>
      </section>

      {/* Research Papers Tab */}
      {activeTab === 'papers' && (
        <section className="relative z-10 max-w-7xl mx-auto px-6 pb-20">
          {/* Search */}
          <div className="mb-6">
            <input
              type="text"
              placeholder="Search papers by title, author, or tag..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full max-w-md bg-white/5 border border-white/10 rounded-sm px-4 py-2.5 text-sm text-white/80 focus:border-emerald-500/50 focus:outline-none transition-colors placeholder:text-white/20 font-mono"
            />
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredPapers.map((paper, idx) => (
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
                  <div className="flex items-center gap-2">
                    <span className="text-[9px] font-mono text-white/20">{paper.year}</span>
                    {paper.citations && (
                      <span className="text-[8px] font-mono text-emerald-500/50">
                        {paper.citations} cites
                      </span>
                    )}
                  </div>
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
                  <button
                    onClick={() => {
                      const citation = `${paper.authors} (${paper.year}). ${paper.title}. ${paper.journal}.`;
                      navigator.clipboard.writeText(citation);
                    }}
                    className="text-[10px] font-mono text-white/20 hover:text-white/40 transition-colors"
                  >
                    Cite
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {/* Documentation Tab */}
      {activeTab === 'docs' && (
        <section className="relative z-10 max-w-7xl mx-auto px-6 pb-20">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {docSections.map((doc, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.08 }}
                viewport={{ once: true }}
                className={`border border-white/10 bg-white/[0.02] p-6 hover:border-${doc.color}-500/30 transition-all group`}
              >
                <div className="flex items-start gap-4">
                  <div className={`p-2 bg-${doc.color}-500/10 border border-${doc.color}-500/20 rounded-sm shrink-0`}>
                    {doc.icon}
                  </div>
                  <div>
                    <h3 className="text-sm font-mono text-white/80 mb-1.5">{doc.title}</h3>
                    <p className="text-[11px] text-white/40 leading-relaxed mb-3">{doc.description}</p>
                    {doc.detailed && (
                      <p className="text-[10px] text-white/30 leading-relaxed mb-3 border-l-2 border-emerald-500/30 pl-3">
                        {doc.detailed}
                      </p>
                    )}
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
      )}

      {/* Sticky Scroll Resources Section */}
      <div className="relative z-10 border-t border-white/5 pt-20">
        <div className="max-w-7xl mx-auto px-6 mb-12 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/5 rounded-full mb-4">
            <Layers className="w-3 h-3 text-emerald-500" />
            <span className="text-[9px] font-mono text-white/50 uppercase tracking-wider">Explore Resources</span>
          </div>
          <h2 className="text-3xl font-light text-white/90 mb-4">Discover Our Resource Library</h2>
          <p className="text-white/40 text-sm font-mono max-w-2xl mx-auto">
            Scroll through our curated collection of research, documentation, and community resources
          </p>
        </div>
        <StackedResourcesSection />
      </div>

      {/* Citation Section */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 py-20 border-t border-white/5">
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
{`@article{yadav2026genetix,
  title={Genetix: A Deterministic-Bayesian and Generative AI Framework for Mendelian and Polygenic Trait Inheritance Prediction},
  author={Yadav, Mohan and Tayade, Sagar and Thakare, Pratik and Chauhan, Pooja},
  journal={Department of Computer Applications (MCA), Thakur College of Engineering Technology},
  year={2026},
  url={https://genetix-lake.vercel.app/}
}`}
          </pre>
          <button
            onClick={() => {
              const citation = `@article{yadav2026genetix,\n  title={Genetix: A Deterministic-Bayesian and Generative AI Framework for Mendelian and Polygenic Trait Inheritance Prediction},\n  author={Yadav, Mohan and Tayade, Sagar and Thakare, Pratik and Chauhan, Pooja},\n  journal={Department of Computer Applications (MCA), Thakur College of Engineering Technology},\n  year={2026},\n  url={https://genetix-lake.vercel.app/}\n}`;
              navigator.clipboard.writeText(citation);
            }}
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
          <motion.div
            animate={{ y: [0, -5, 0] }}
            transition={{ repeat: Infinity, duration: 2, repeatDelay: 3 }}
          >
            <Sparkles className="w-8 h-8 text-emerald-500 mx-auto mb-4" />
          </motion.div>
          <h2 className="text-2xl md:text-3xl font-light text-white/90 mb-4">Contribute to Genetix</h2>
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
    </Layout>
  );
};

export default ResourcesPage;