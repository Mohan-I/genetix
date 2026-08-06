// ============================================================
// components/Footer.tsx
// ============================================================
import React from 'react';
import { Link } from 'react-router-dom';
import { Github, Twitter, Mail, Heart } from 'lucide-react';

interface FooterLink {
  label: string;
  href: string;
  external?: boolean;
}

interface FooterColumn {
  title: string;
  links: FooterLink[];
}

interface SocialLink {
  icon: React.ReactNode;
  href: string;
  label: string;
}

interface FooterProps {
  appName?: string;
  version?: string;
  license?: string;
  year?: number;
  columns?: FooterColumn[];
  socialLinks?: SocialLink[];
  bottomText?: string;
  className?: string;
  showHeart?: boolean;
}

export const Footer: React.FC<FooterProps> = ({
  appName = 'GENETIX',
  version = 'v4.2',
  license = 'MIT License',
  year = new Date().getFullYear(),
  columns,
  socialLinks,
  bottomText = 'Built with TypeScript & React',
  className = '',
  showHeart = true,
}) => {
  // Default footer columns
  const defaultColumns: FooterColumn[] = [
    {
      title: 'Product',
      links: [
        { label: 'Features', href: '#features' },
        { label: 'API Reference', href: '#' },
        { label: 'Changelog', href: '#' },
        { label: 'Roadmap', href: '#' },
      ],
    },
    {
      title: 'Resources',
      links: [
        { label: 'Documentation', href: '/resources' },
        { label: 'Research Paper', href: '/resources' },
        { label: 'GitHub', href: 'https://github.com/mohan-i/genetix', external: true },
        { label: 'Community', href: '#' },
      ],
    },
    {
      title: 'Legal',
      links: [
        { label: 'Privacy Policy', href: '#' },
        { label: 'Terms of Service', href: '#' },
        { label: 'Ethics Statement', href: '#' },
        { label: 'HIPAA Compliance', href: '#' },
      ],
    },
  ];

  // Default social links
  const defaultSocialLinks: SocialLink[] = [
    {
      icon: <Github className="w-3 h-3" />,
      href: 'https://github.com/mohan-i/genetix',
      label: 'GitHub',
    },
    {
      icon: <Twitter className="w-3 h-3" />,
      href: 'https://x.com/Mohan_Yadav_Dev',
      label: 'Twitter',
    },
    {
      icon: <Mail className="w-3 h-3" />,
      href: 'mailto:support@genetix.ai',
      label: 'Email',
    },
  ];

  const footerColumns = columns || defaultColumns;
  const footerSocialLinks = socialLinks || defaultSocialLinks;

  return (
    <footer className={`relative z-10 border-t border-white/10 py-12 ${className}`}>
      <div className="max-w-7xl mx-auto px-6">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Brand Column */}
          <div className="col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-6 h-6 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-sm flex items-center justify-center">
                <span className="text-[#0a0a0c] font-bold text-[10px]">
                  {appName.charAt(0)}
                </span>
              </div>
              <span className="text-[10px] font-mono text-white/40">
                {appName} {version}
              </span>
            </div>
            <p className="text-[10px] text-white/30 leading-relaxed max-w-xs">
              Advanced Bayesian inference engine for genetic probability modeling and risk assessment.
            </p>
            {showHeart && (
              <div className="flex items-center gap-1 mt-4 text-[9px] text-white/20">
                Made with <Heart className="w-3 h-3 text-rose-500/60 fill-rose-500/20" /> for science
              </div>
            )}
          </div>

          {/* Footer Columns */}
          {footerColumns.map((column, idx) => (
            <div key={idx} className="col-span-1">
              <h4 className="text-[10px] font-mono text-white/50 uppercase tracking-wider mb-3">
                {column.title}
              </h4>
              <ul className="space-y-2">
                {column.links.map((link, linkIdx) => (
                  <li key={linkIdx}>
                    {link.external ? (
                      <a
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[10px] text-white/30 hover:text-white/50 transition-colors flex items-center gap-1"
                      >
                        {link.label}
                      </a>
                    ) : (
                      <Link
                        to={link.href}
                        className="text-[10px] text-white/30 hover:text-white/50 transition-colors"
                      >
                        {link.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex flex-col sm:flex-row items-center gap-2 text-center sm:text-left">
            <span className="text-[9px] text-white/20 font-mono">
              {appName} {version} • {license}
            </span>
            <span className="hidden sm:inline text-[9px] text-white/10">•</span>
            <span className="text-[9px] text-white/20 font-mono">
              {bottomText}
            </span>
          </div>

          <div className="flex gap-4 items-center">
            {footerSocialLinks.map((social, idx) => (
              <a
                key={idx}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={social.label}
                className="text-white/20 hover:text-white/40 transition-colors"
              >
                {social.icon}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;