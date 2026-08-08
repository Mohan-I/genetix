// ============================================================
// CONTACT PAGE - Complete Component
// ============================================================
import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Mail, MapPin, Phone, Clock as ClockIcon, MessageSquare,
  Send, CheckCircle, Info, Github, Twitter, Linkedin,
  Instagram, Youtube, ArrowRight, ChevronUp
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

export const ContactPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      setFormData({ name: '', email: '', subject: '', message: '' });
      setTimeout(() => setIsSubmitted(false), 5000);
    }, 1500);
  };

  const contactInfo = [
    { icon: <Mail className="w-4 h-4" />, label: "Email", value: "support@genetix.ai", href: "mailto:support@genetix.ai" },
    { icon: <MapPin className="w-4 h-4" />, label: "Location", value: "Mumbai, IN", href: "#" },
    { icon: <Phone className="w-4 h-4" />, label: "Phone", value: "+91 (932) 477-3179", href: "tel:+919324773179" },
    { icon: <ClockIcon className="w-4 h-4" />, label: "Hours", value: "24/7 Support", href: "#" }
  ];

  const faqs = [
    {
      q: "Is GENETIX free to use?",
      a: "Yes, GENETIX is completely free and open-source for educational and research purposes."
    },
    {
      q: "How accurate are the predictions?",
      a: "Our Bayesian models achieve 99.8% confidence intervals for Mendelian traits and 91% accuracy for pregnancy risk predictions."
    },
    {
      q: "Can I use this for clinical diagnosis?",
      a: "No, GENETIX is strictly for educational and research purposes. It should not be used for clinical diagnosis."
    },
    {
      q: "How do I contribute to the project?",
      a: "You can contribute via GitHub by submitting issues, pull requests, or joining our community discussions."
    }
  ];

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
            <MessageSquare className="w-3 h-3 text-emerald-500" />
            <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-wider">Get in Touch</span>
          </motion.div>
          <h1 className="text-4xl md:text-5xl font-light tracking-tight mb-4">
            <span className="bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 bg-clip-text text-transparent">
              Contact Us
            </span>
          </h1>
          <p className="text-white/40 text-md max-w-2xl mx-auto font-mono leading-relaxed">
            Have questions about GENETIX? We're here to help. Reach out to our team for support, collaboration, or feedback.
          </p>
        </motion.div>
      </section>

      {/* Contact Form & Info */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 pb-20">
        <div className="grid lg:grid-cols-5 gap-8">
          {/* Form */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-3"
          >
            <div className="border border-white/10 bg-white/[0.02] p-6 md:p-8">
              <h2 className="text-xl font-light text-white/90 mb-6">Send a Message</h2>
              <hr className='mb-4'/>
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-mono text-white/40 uppercase tracking-wider mb-1.5">Name</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full bg-white/5 border border-white/10 rounded-sm px-4 py-2.5 text-sm text-white/80 focus:border-emerald-500/50 focus:outline-none transition-colors"
                      placeholder="John Doe"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-mono text-white/40 uppercase tracking-wider mb-1.5">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full bg-white/5 border border-white/10 rounded-sm px-4 py-2.5 text-sm text-white/80 focus:border-emerald-500/50 focus:outline-none transition-colors"
                      placeholder="john@example.com"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-mono text-white/40 uppercase tracking-wider mb-1.5">Subject</label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="w-full bg-white/5 border border-white/10 rounded-sm px-4 py-2.5 text-sm text-white/80 focus:border-emerald-500/50 focus:outline-none transition-colors"
                    placeholder="How can we help?"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-mono text-white/40 uppercase tracking-wider mb-1.5">Message</label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={5}
                    className="w-full bg-white/5 border border-white/10 rounded-sm px-4 py-2.5 text-sm text-white/80 focus:border-emerald-500/50 focus:outline-none transition-colors resize-none"
                    placeholder="Your message here..."
                  />
                </div>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 text-[#0a0a0c] font-mono text-sm font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <span className="animate-pulse">Sending...</span>
                  ) : isSubmitted ? (
                    <>
                      <CheckCircle className="w-4 h-4" /> Sent!
                    </>
                  ) : (
                    <>
                      Send Message <Send className="w-4 h-4" />
                    </>
                  )}
                </motion.button>
              </form>

              {/* Success toast */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: isSubmitted ? 1 : 0, y: isSubmitted ? 0 : 20 }}
                className="mt-4 p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-sm flex items-center gap-2 text-emerald-400 text-sm"
              >
                <CheckCircle className="w-4 h-4" />
                Thank you! Your message has been sent successfully.
              </motion.div>
            </div>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-2 space-y-6"
          >
            <div className="border border-white/10 bg-white/[0.02] p-6">
              <h3 className="text-sm font-mono text-white/60 uppercase tracking-wider mb-6">Contact Information</h3>
              <div className="space-y-4">
                {contactInfo.map((item, idx) => (
                  <a
                    key={idx}
                    href={item.href}
                    className="flex items-start gap-3 p-3 border border-white/5 hover:border-emerald-500/20 transition-all group"
                  >
                    <div className="text-emerald-500 mt-0.5">{item.icon}</div>
                    <div>
                      <p className="text-[10px] font-mono text-white/30 uppercase tracking-wider">{item.label}</p>
                      <p className="text-sm text-white/70 group-hover:text-white/90 transition-colors">{item.value}</p>
                    </div>
                  </a>
                ))}
              </div>
            </div>

            {/* Social Links */}
            <div className="border border-white/10 bg-white/[0.02] p-6">
              <h3 className="text-sm font-mono text-white/60 uppercase tracking-wider mb-4">Connect With Us</h3>
              <div className="flex gap-3 flex-wrap">
                {[
                  { icon: <Github className="w-4 h-4" />, label: "GitHub", href: "https://github.com/mohan-i/genetix" },
                  { icon: <Twitter className="w-4 h-4" />, label: "Twitter", href: "https://x.com/Mohan_Yadav_Dev" },
                  { icon: <Linkedin className="w-4 h-4" />, label: "LinkedIn", href: "#" },
                  { icon: <Youtube className="w-4 h-4" />, label: "YouTube", href: "#" },
                  { icon: <Instagram className="w-4 h-4" />, label: "Instagram", href: "#" }
                ].map((social, idx) => (
                  <a
                    key={idx}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 border border-white/10 hover:border-emerald-500/30 text-white/40 hover:text-white/70 transition-all"
                  >
                    {social.icon}
                    <span className="text-[10px] font-mono">{social.label}</span>
                  </a>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 pb-20 border-t border-white/5 pt-20">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/5 rounded-full mb-4">
            <Info className="w-3 h-3 text-emerald-500" />
            <span className="text-[9px] font-mono text-white/50 uppercase tracking-wider">FAQ</span>
          </div>
          <h2 className="text-3xl font-light text-white/90 mb-4">Frequently Asked Questions</h2>
          <p className="text-white/40 text-sm font-mono max-w-2xl mx-auto">
            Quick answers to common questions about GENETIX
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-4 max-w-4xl mx-auto">
          {faqs.map((faq, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              viewport={{ once: true }}
              className="p-5 border border-white/10 bg-white/[0.02] hover:border-emerald-500/30 transition-all"
            >
              <h4 className="text-sm font-mono text-white/80 mb-2">{faq.q}</h4>
              <p className="text-[11px] text-white/40 leading-relaxed">{faq.a}</p>
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
          <h2 className="text-2xl font-light text-white/90 mb-4">Join Our Community</h2>
          <p className="text-white/40 text-sm font-mono mb-8 max-w-md mx-auto">
            Connect with researchers, developers, and geneticists using GENETIX.
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
              Launch App <ArrowRight className="w-4 h-4" />
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
              <Twitter className="w-3 h-3" />
            </a>
            <a href="mailto:support@genetix.ai" className="text-white/20 hover:text-white/40 transition-colors">
              <Mail className="w-3 h-3" />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};