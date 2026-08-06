// ============================================================
// ComingSoonPage.tsx
// A "coming soon" page reusing the Genetix visual language
// (dark canvas, emerald accents, mono labels, framer-motion).
// Includes a sticky scroll section where cards enter, hold,
// then fade/slide away as the user keeps scrolling.
// ============================================================
import React, { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import {
    motion,
    useScroll,
    useTransform,
    MotionValue,
} from 'framer-motion';
import {
    Sparkles,
    ArrowRight,
    ArrowLeft,
    Dna,
    Network,
    FileText,
    Users2,
    Smartphone,
    Bell,
    CheckCircle2,
    Clock,
    Rocket,
} from 'lucide-react';
import { Layout } from '../components/Layout';

// ------------------------------------------------------------
// Data
// ------------------------------------------------------------

interface UpcomingCard {
    icon: React.ReactNode;
    title: string;
    description: string;
    tag: string;
}

const upcomingCards: UpcomingCard[] = [
    {
        icon: <Network className="w-6 h-6" />,
        title: '3D Pedigree View',
        description:
            'Rotate, zoom, and explore multi-generational family trees in an interactive 3D canvas instead of a flat diagram.',
        tag: 'Visualization',
    },
    {
        icon: <Dna className="w-6 h-6" />,
        title: 'Extended Trait Library',
        description:
            'Dozens of additional Mendelian and polygenic traits, with citations and inheritance-pattern breakdowns for each.',
        tag: 'Genetics Engine',
    },
    {
        icon: <FileText className="w-6 h-6" />,
        title: 'Clinical-Style Reports',
        description:
            'Export polished, shareable PDF summaries of a pedigree or analysis session — built for classrooms and counseling sessions alike.',
        tag: 'Reporting',
    },
    {
        icon: <Users2 className="w-6 h-6" />,
        title: 'Collaborative Workspaces',
        description:
            'Invite collaborators to build and annotate a pedigree together in real time, with per-member comment threads.',
        tag: 'Collaboration',
    },
    {
        icon: <Smartphone className="w-6 h-6" />,
        title: 'Mobile Companion',
        description:
            'A lightweight mobile view for reviewing pedigrees and risk summaries on the go, synced with your saved sessions.',
        tag: 'Mobile',
    },
];

const milestones = [
    { label: 'Design & Architecture', status: 'done' as const },
    { label: 'Core Engine Rebuild', status: 'done' as const },
    { label: 'Closed Beta', status: 'active' as const },
    { label: 'Public Launch', status: 'upcoming' as const },
];

// ------------------------------------------------------------
// Stacked scroll card
// ------------------------------------------------------------

interface StackCardProps {
    card: UpcomingCard;
    index: number;
    total: number;
    scrollYProgress: MotionValue<number>;
}

const StackCard: React.FC<StackCardProps> = ({ card, index, total, scrollYProgress }) => {
    // Each card owns a slice of the overall scroll progress.
    // It enters from below, holds fully visible, then exits upward
    // and fades out as the next card's slice begins.
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
            <div className="w-full max-w-xl border border-white/10 bg-white/[0.03] backdrop-blur-sm p-8 md:p-10 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-transparent pointer-events-none" />

                <div className="relative z-10">
                    <div className="flex items-center justify-between mb-6">
                        <div className="w-12 h-12 bg-emerald-500/10 border border-emerald-500/20 rounded-sm flex items-center justify-center text-emerald-400">
                            {card.icon}
                        </div>
                        <span className="text-[9px] font-mono text-emerald-400/70 uppercase tracking-wider bg-emerald-500/10 border border-emerald-500/20 px-2 py-1 rounded">
                            {card.tag}
                        </span>
                    </div>

                    <h3 className="text-xl md:text-2xl font-light text-white/90 mb-3">
                        {card.title}
                    </h3>
                    <p className="text-sm text-white/40 font-mono leading-relaxed">
                        {card.description}
                    </p>

                    <div className="mt-6 pt-6 border-t border-white/10 flex items-center gap-2 text-[10px] font-mono text-white/20 uppercase tracking-wider">
                        <Clock className="w-3 h-3" />
                        <span>{index + 1} of {total} — In development</span>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

// ------------------------------------------------------------
// Sticky scroll section wrapper
// ------------------------------------------------------------

const StackedCardsSection: React.FC = () => {
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
            style={{ height: `${upcomingCards.length * 100}vh` }}
        >
            <div className="sticky top-0 h-screen flex flex-col justify-center overflow-hidden">
                {/* Progress bar */}
                <div className="absolute top-24 left-0 right-0 max-w-7xl mx-auto px-6 w-full z-20">
                    <div className="flex items-center justify-between mb-3">
                        <span className="text-[9px] font-mono text-white/30 uppercase tracking-wider">
                            What's coming
                        </span>
                        <span className="text-[9px] font-mono text-white/30 uppercase tracking-wider">
                            Scroll to explore
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
                    {upcomingCards.map((card, idx) => (
                        <StackCard
                            key={card.title}
                            card={card}
                            index={idx}
                            total={upcomingCards.length}
                            scrollYProgress={scrollYProgress}
                        />
                    ))}
                </div>

                {/* Dots indicator */}
                <div className="absolute bottom-16 left-0 right-0 flex items-center justify-center gap-2 z-20">
                    {upcomingCards.map((_, idx) => {
                        const segment = 1 / upcomingCards.length;
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

// ------------------------------------------------------------
// Notify form
// ------------------------------------------------------------

const NotifyForm: React.FC = () => {
    const [email, setEmail] = useState('');
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!email.trim()) return;
        setSubmitted(true);
    };

    if (submitted) {
        return (
            <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center justify-center gap-2 px-6 py-3 border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 text-sm font-mono max-w-md mx-auto"
            >
                <CheckCircle2 className="w-4 h-4" />
                You're on the list — we'll email you at launch.
            </motion.div>
        );
    }

    return (
        <form
            onSubmit={handleSubmit}
            className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
        >
            <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="flex-1 px-4 py-3 bg-white/5 border border-white/10 text-white/90 text-sm font-mono placeholder:text-white/20 focus:border-emerald-500 outline-none transition-colors"
            />
            <button
                type="submit"
                className="px-6 py-3 bg-emerald-500 hover:bg-emerald-400 text-[#0a0a0c] font-mono text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 whitespace-nowrap"
            >
                <Bell className="w-3.5 h-3.5" />
                Notify Me
            </button>
        </form>
    );
};

// ------------------------------------------------------------
// Page
// ------------------------------------------------------------

export const ComingSoonPage: React.FC = () => {
    return (
        <Layout>
            {/* Hero */}
            <section className="relative z-10 max-w-7xl mx-auto px-6 pt-32 pb-24 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full mb-6">
                        <Rocket className="w-3 h-3 text-emerald-500" />
                        <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-wider">
                            Bayesian v5.0 • Launching Soon
                        </span>
                    </div>

                    <h1 className="text-4xl md:text-6xl font-light tracking-tight mb-6">
                        <span className="bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 bg-clip-text text-transparent">
                            Something New
                        </span>
                        <br />
                        <span className="text-white/90">Is On Its Way</span>
                    </h1>

                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        className="text-white/40 text-md max-w-xl mx-auto font-mono leading-relaxed mb-10"
                    >
                        We're building the next chapter of the Genetix platform — deeper
                        visualizations, richer reporting, and tools built for classrooms,
                        clinics, and curious minds alike. Here's a preview of what's coming.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.45 }}
                    >
                        <NotifyForm />
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.6 }}
                        className="mt-8"
                    >
                        <Link
                            to="/"
                            className="inline-flex items-center gap-2 text-white/30 hover:text-white/60 text-xs font-mono transition-colors"
                        >
                            <ArrowLeft className="w-3.5 h-3.5" />
                            Back to home
                        </Link>
                    </motion.div>
                </motion.div>
            </section>

            {/* Roadmap strip */}
            <section className="relative z-10 max-w-4xl mx-auto px-6 pb-20">
                <div className="flex items-center justify-between">
                    {milestones.map((m, idx) => (
                        <React.Fragment key={m.label}>
                            <div className="flex flex-col items-center text-center flex-1">
                                <div
                                    className={`w-3 h-3 rounded-full mb-3 ${m.status === 'done'
                                            ? 'bg-emerald-500'
                                            : m.status === 'active'
                                                ? 'bg-emerald-500 animate-pulse ring-4 ring-emerald-500/20'
                                                : 'bg-white/10 border border-white/20'
                                        }`}
                                />
                                <span
                                    className={`text-[9px] font-mono uppercase tracking-wider leading-tight ${m.status === 'upcoming' ? 'text-white/25' : 'text-white/60'
                                        }`}
                                >
                                    {m.label}
                                </span>
                            </div>
                            {idx < milestones.length - 1 && (
                                <div
                                    className={`h-px flex-1 -mt-6 ${m.status === 'done' ? 'bg-emerald-500/40' : 'bg-white/10'
                                        }`}
                                />
                            )}
                        </React.Fragment>
                    ))}
                </div>
            </section>

            {/* Sticky scroll cards */}
            <StackedCardsSection />

            {/* Closing CTA */}
            <section className="relative z-10 max-w-7xl mx-auto px-6 py-24">
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
                    <h2 className="text-2xl md:text-3xl font-light text-white/90 mb-4">
                        In the meantime, explore what's live today
                    </h2>
                    <p className="text-white/40 text-sm font-mono mb-8 max-w-md mx-auto">
                        The core probability engine, pedigree builder, and risk assessment
                        tools are ready to use right now.
                    </p>
                    <Link
                        to="/app"
                        className="inline-flex items-center gap-2 px-8 py-3 bg-emerald-500 hover:bg-emerald-400 text-[#0a0a0c] font-mono text-sm font-bold uppercase tracking-wider transition-all shadow-lg shadow-emerald-500/20"
                    >
                        Launch Current Engine
                        <ArrowRight className="w-4 h-4" />
                    </Link>
                </motion.div>
            </section>
        </Layout>
    );
};

export default ComingSoonPage;