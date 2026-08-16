// ============================================================
// TERMS & CONDITIONS PAGE
// ============================================================
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Shield,
  FileText,
  Scale,
  Users,
  Database,
  AlertTriangle,
  CheckCircle,
  Clock,
  Globe,
  Lock,
  Server,
  Cpu,
  Brain,
  Dna,
  FileJson,
  Github,
  Mail,
  ChevronRight,
  ChevronUp,
  ArrowLeft,
  Sparkles,
  BookOpen,
  ExternalLink,
  Info,
  AlertCircle
} from 'lucide-react';
import { Layout } from '../components/Layout';

// ============================================================
// TYPES
// ============================================================

interface TOCSection {
  id: string;
  title: string;
  icon: React.ReactNode;
  subsections: TOSubSection[];
}

interface TOSubSection {
  title: string;
  content: string | string[];
  critical?: boolean;
  warning?: boolean;
}

// ============================================================
// DATA
// ============================================================

const tocSections: TOCSection[] = [
  {
    id: 'scope',
    title: 'Scope of Agreement',
    icon: <Globe className="w-4 h-4" />,
    subsections: [
      {
        title: 'Domain Coverage',
        content: 'This Agreement applies to all versions, branches, and builds of the Genetix application accessed via:',
        warning: false
      },
      {
        title: 'Pre-Production Domains',
        content: 'Any .vercel.app deployment subdomains (e.g., genetix.vercel.app) are classified as Experimental Beta/Pre-production software.',
        warning: true
      },
      {
        title: 'Production Domains',
        content: 'Any future registered custom apex domain or subdomains (e.g., genetix.ai, genetix.org) used for public release represent stable, vetted releases.',
        critical: false
      }
    ]
  },
  {
    id: 'disclaimer',
    title: 'Legal Disclaimer',
    icon: <Scale className="w-4 h-4" />,
    subsections: [
      {
        title: 'Decision Support Only',
        content: 'Genetix is an informational, educational, and research decision-support tool. It does not provide formal medical diagnoses, clinical opinions, or definitive treatment courses.',
        critical: true
      },
      {
        title: 'No Doctor-Patient Relationship',
        content: 'Use of the platform, including the generation of phenotypic synthesis reports via Gemini API, does not establish a healthcare provider-patient relationship.',
        critical: true
      },
      {
        title: 'Mandatory Consultation',
        content: 'Users must consult qualified genetic counselors or medical professionals before acting on clinical alerts (e.g., Rh incompatibility, maternal health risks, or pathogenic variant discoveries).',
        critical: true
      },
      {
        title: 'No Diagnostic Authority',
        content: 'Genetix does not provide clinical diagnoses, medical device functions, or formal healthcare recommendations.',
        critical: true
      }
    ]
  },
  {
    id: 'privacy',
    title: 'Privacy & Data Processing',
    icon: <Lock className="w-4 h-4" />,
    subsections: [
      {
        title: 'Client-Side Execution',
        content: 'Genetix processes raw genomic files (.vcf, .txt) locally in the user\'s browser environment. No raw genomic sequences, SNPs, or individual variant metadata are stored, cached, or persisted on Genetix servers.',
        critical: false
      },
      {
        title: 'Third-Party API Data Flow',
        content: 'Phenotypic indicators and synthesized parameters passed to the @google/genai (Gemini API) layer are governed by Google\'s API Privacy Terms. No identifiable health information (PHI) should be transmitted to the LLM layer.',
        warning: true
      },
      {
        title: 'Compliance Frameworks',
        content: 'The platform aims to respect local privacy frameworks, including the Digital Personal Data Protection Act (DPDPA) of India, GDPR, and HIPAA de-identification standards for client-side processing.',
        critical: false
      },
      {
        title: 'Session-Based State',
        content: 'Current implementation uses strictly ephemeral session-based state. Data ingestion is processed in browser memory. Closing or refreshing the tab permanently purges all data.',
        critical: false
      }
    ]
  },
  {
    id: 'algorithmic',
    title: 'Algorithmic Limitations',
    icon: <Brain className="w-4 h-4" />,
    subsections: [
      {
        title: 'Deterministic Logic Layer',
        content: 'While the Mendelian Bayesian network operates with high mathematical certainty based on parental genotypes, inputs rely entirely on user-provided data accuracy.',
        warning: true
      },
      {
        title: 'Probabilistic ML Layer (VAE)',
        content: 'Polygenic risk scores, deep ancestral component models (ANI/ASI/AASI), and phenotypic predictions (height, skin tone) are statistical probabilities, not certainties.',
        warning: true
      },
      {
        title: 'Algorithmic Variance',
        content: 'Deep ancestry mapping and polygenic traits are probabilistic models based on available South Asian reference datasets. They represent statistical likelihoods, not deterministic certainties.',
        warning: true
      },
      {
        title: 'LLM Output Warning',
        content: 'Phenotypic synthesis reports generated by the Google Gemini API (@google/genai) may occasionally produce errors or hallucinations. These reports must be independently cross-verified by a certified genetic counselor.',
        critical: true
      },
      {
        title: 'Reference Panel Limits',
        content: 'Ancestry and community cluster mapping are based on current, evolving local reference datasets. Results are reflective of probabilistic trends rather than absolute genealogical definitions.',
        warning: true
      }
    ]
  },
  {
    id: 'opensource',
    title: 'Open Source Licensing',
    icon: <Github className="w-4 h-4" />,
    subsections: [
      {
        title: 'As-Is Provision',
        content: 'The software, source code, and logic engines are provided "as-is" without warranties of any kind, explicit or implied.',
        critical: true
      },
      {
        title: 'MIT / Apache License Limits',
        content: 'In alignment with standard open-source distribution models, contributors (including Mohan Yadav and community developers) accept zero liability for any direct, indirect, incidental, or consequential damages arising from code fork modifications, model retraining, or system deployment.',
        critical: true
      },
      {
        title: 'Edge / WASM Execution',
        content: 'Users deploying local instances via WebAssembly (WASM) or Node.js environments are solely responsible for local runtime security and environment misconfigurations.',
        warning: true
      }
    ]
  },
  {
    id: 'acceptable',
    title: 'Acceptable Use',
    icon: <Shield className="w-4 h-4" />,
    subsections: [
      {
        title: 'Non-Commercial Open Use',
        content: 'Unless explicitly authorized under separate commercial terms, deployment of the public code repository must not be used to charge patients for unauthorized clinical diagnostic services.',
        critical: true
      },
      {
        title: 'Generative AI Guardrails',
        content: 'Users may not attempt to reverse-engineer, exploit, or bypass the verified generative AI guardrail layers to generate malicious or deceptive health reports.',
        critical: true
      },
      {
        title: 'Beta & Pre-Production Releases',
        content: 'All builds deployed on .vercel.app domains are classified as Experimental Beta/Pre-production software. Features are under active testing and must not be used for real-world health or ancestry decisions.',
        warning: true
      },
      {
        title: 'Breaking Changes',
        content: 'We reserve the right to push breaking updates, wipe local session caches, or change backend configuration schemas without prior notice on pre-production domains.',
        warning: true
      }
    ]
  },
  {
    id: 'hosting',
    title: 'Hosting & Infrastructure',
    icon: <Server className="w-4 h-4" />,
    subsections: [
      {
        title: 'Zero Interception',
        content: 'Cloud hosting infrastructure (Vercel Edge Network) does not intercept, log, parse, or store the genetic payloads uploaded via client-side web components.',
        critical: false
      },
      {
        title: 'Third-Party Faults',
        content: 'Genetix developers are not liable for upstream data breaches, API downtime, or service failures originating from Vercel or Google AI Studio.',
        critical: true
      },
      {
        title: 'Infrastructure Limitations',
        content: 'Genetix is distributed via Vercel\'s Edge Network and Google AI Studio\'s Gemini API. Users accept that these third-party services operate under their own terms and conditions.',
        warning: false
      }
    ]
  }
];

// ============================================================
// ENVIRONMENT BANNER
// ============================================================

const EnvironmentBanner: React.FC = () => {
  const [isVercel, setIsVercel] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setIsVercel(window.location.hostname.includes('vercel.app'));
    }
  }, []);

  if (!isVercel) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-8 p-4 border border-yellow-500/30 bg-yellow-500/10 rounded-sm"
    >
      <div className="flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-yellow-500 shrink-0 mt-0.5" />
        <div>
          <h4 className="text-xs font-mono text-yellow-400 font-bold uppercase tracking-wider">
            Pre-Production Environment
          </h4>
          <p className="text-[10px] text-white/60 font-mono mt-1">
            You are viewing an unreleased developer preview on a .vercel.app domain.
            Features are under active testing. Do not input real patient data.
            For production use, please visit our official domain.
          </p>
        </div>
      </div>
    </motion.div>
  );
};

// ============================================================
// TABLE OF CONTENTS
// ============================================================

const TableOfContents: React.FC<{ sections: TOCSection[] }> = ({ sections }) => {
  const [activeSection, setActiveSection] = useState<string>(sections[0]?.id || '');

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { threshold: 0.3 }
    );

    sections.forEach((section) => {
      const element = document.getElementById(section.id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, [sections]);

  return (
    <div className="sticky top-24 hidden lg:block w-64 shrink-0">
      <div className="border border-white/10 bg-white/[0.02] p-4">
        <h3 className="text-[9px] font-mono text-white/40 uppercase tracking-wider mb-3 flex items-center gap-2">
          <BookOpen className="w-3 h-3" />
          Contents
        </h3>
        <nav className="space-y-1">
          {sections.map((section) => (
            <a
              key={section.id}
              href={`#${section.id}`}
              className={`flex items-center gap-2 text-[10px] font-mono transition-all px-2 py-1.5 rounded ${
                activeSection === section.id
                  ? 'text-emerald-400 bg-emerald-500/10'
                  : 'text-white/40 hover:text-white/60'
              }`}
            >
              {section.icon}
              <span className="truncate">{section.title}</span>
            </a>
          ))}
        </nav>
        <div className="mt-4 pt-4 border-t border-white/10">
          <p className="text-[8px] text-white/20 font-mono">
            Last Updated: August 2026
          </p>
          <p className="text-[8px] text-white/20 font-mono">Version 2.0</p>
        </div>
      </div>
    </div>
  );
};

// ============================================================
// SECTION COMPONENT
// ============================================================

const TOCSectionRenderer: React.FC<{ section: TOCSection }> = ({ section }) => {
  return (
    <motion.section
      id={section.id}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
      className="scroll-mt-24"
    >
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-emerald-500/10 border border-emerald-500/20 rounded-sm">
          {section.icon}
        </div>
        <h2 className="text-lg font-light text-white/90">{section.title}</h2>
      </div>

      <div className="space-y-4">
        {section.subsections.map((sub, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.05 }}
            className={`border p-4 ${
              sub.critical
                ? 'border-red-500/30 bg-red-500/5'
                : sub.warning
                ? 'border-yellow-500/20 bg-yellow-500/5'
                : 'border-white/10 bg-white/[0.02]'
            }`}
          >
            <div className="flex items-start gap-3">
              {sub.critical ? (
                <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
              ) : sub.warning ? (
                <AlertTriangle className="w-4 h-4 text-yellow-500 shrink-0 mt-0.5" />
              ) : (
                <Info className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              )}
              <div>
                <h4 className="text-xs font-mono text-white/70 mb-1.5">
                  {sub.title}
                  {sub.critical && (
                    <span className="ml-2 text-[8px] text-red-400 uppercase tracking-wider">• Critical</span>
                  )}
                  {sub.warning && !sub.critical && (
                    <span className="ml-2 text-[8px] text-yellow-400 uppercase tracking-wider">• Important</span>
                  )}
                </h4>
                {typeof sub.content === 'string' ? (
                  <p className="text-[11px] text-white/60 leading-relaxed">{sub.content}</p>
                ) : (
                  <ul className="space-y-1 mt-1">
                    {sub.content.map((item, i) => (
                      <li key={i} className="text-[11px] text-white/60 leading-relaxed flex items-start gap-2">
                        <span className="text-emerald-500 text-[8px] mt-1">▸</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
};

// ============================================================
// ACCEPTANCE FORM
// ============================================================

const AcceptanceForm: React.FC = () => {
  const [accepted, setAccepted] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleAccept = () => {
    setAccepted(true);
    setShowSuccess(true);
    localStorage.setItem('genetix_tos_accepted', 'true');
    setTimeout(() => setShowSuccess(false), 3000);
  };

  return (
    <div className="border border-white/10 bg-white/[0.02] p-6 mt-8">
      <h3 className="text-sm font-mono text-white/70 mb-3 flex items-center gap-2">
        <CheckCircle className="w-4 h-4 text-emerald-500" />
        Acceptance of Terms
      </h3>
      <p className="text-[10px] text-white/40 font-mono mb-4 leading-relaxed">
        By using Genetix, you acknowledge that you have read, understood, and agree
        to be bound by these Terms and Conditions. This includes all disclaimers,
        privacy notices, and algorithmic limitations outlined above.
      </p>
      <div className="flex flex-col sm:flex-row gap-3">
        <button
          onClick={handleAccept}
          disabled={accepted}
          className="px-6 py-2 bg-emerald-500 hover:bg-emerald-400 text-[#0a0a0c] text-xs font-mono font-bold uppercase tracking-wider transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {accepted ? 'Accepted ✓' : 'Accept Terms'}
        </button>
        {showSuccess && (
          <motion.span
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-xs text-emerald-400 font-mono flex items-center gap-2"
          >
            <CheckCircle className="w-4 h-4" />
            Terms accepted
          </motion.span>
        )}
      </div>
    </div>
  );
};

// ============================================================
// MAIN PAGE
// ============================================================

export const TermsPage: React.FC = () => {
  return (
    <Layout>
      {/* Hero */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 pt-24 pb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-white/30 hover:text-white/50 text-xs font-mono transition-colors mb-6"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to home
          </Link>

          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-sm">
              <Scale className="w-6 h-6 text-emerald-500" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-light tracking-tight">
                <span className="bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 bg-clip-text text-transparent">
                  Terms & Conditions
                </span>
              </h1>
              <p className="text-white/40 text-sm font-mono mt-1">
                Genetix Engine • Version 2.0 • August 2026
              </p>
            </div>
          </div>

          <p className="text-white/40 text-sm max-w-2xl font-mono leading-relaxed">
            These Terms and Conditions govern your use of the Genetix genetic
            inheritance prediction platform. Please read them carefully before
            using the platform.
          </p>
        </motion.div>
      </section>

      {/* Environment Banner */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 pb-8">
        <EnvironmentBanner />
      </section>

      {/* Main Content */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 pb-20">
        <div className="flex gap-8">
          {/* Table of Contents - Sidebar */}
          <TableOfContents sections={tocSections} />

          {/* Content */}
          <div className="flex-1 min-w-0 space-y-12">
            {tocSections.map((section) => (
              <TOCSectionRenderer key={section.id} section={section} />
            ))}

            {/* Footer Note */}
            <div className="border-t border-white/10 pt-8 mt-8">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h4 className="text-xs font-mono text-white/40">Governing Law</h4>
                  <p className="text-[10px] text-white/20 font-mono mt-1">
                    These terms are governed by the laws of India, with reference to the
                    Digital Personal Data Protection Act (DPDPA) and international
                    privacy standards including GDPR and HIPAA de-identification.
                  </p>
                </div>
                <div className="flex items-center gap-2 text-[8px] text-white/20 font-mono">
                  <Clock className="w-3 h-3" />
                  <span>Last Updated: August 2026</span>
                </div>
              </div>
            </div>

            {/* Acceptance */}
            <AcceptanceForm />

            {/* Contact */}
            <div className="border border-white/10 bg-white/[0.02] p-6">
              <h4 className="text-xs font-mono text-white/60 mb-2 flex items-center gap-2">
                <Mail className="w-3 h-3" />
                Questions About These Terms?
              </h4>
              <p className="text-[10px] text-white/40 font-mono">
                If you have any questions about these Terms and Conditions, please
                contact us at{' '}
                <a
                  href="mailto:mohanshyadav@gmail.com"
                  className="text-emerald-400 hover:text-emerald-300 transition-colors"
                >
                  mohanshyadav@gmail.com
                </a>
              </p>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default TermsPage;