// ============================================================
// components/Layout.tsx (Optional wrapper component)
// ============================================================
import React from 'react';
import { ScrollToTop } from './ScrollToTop';
import { BackToTopButton } from './BackToTopButton';
import { Footer } from './Footer';
import Header from './Header';

interface LayoutProps {
  children: React.ReactNode;
  showFooter?: boolean;
  showBackToTop?: boolean;
  footerProps?: React.ComponentProps<typeof Footer>;
  backToTopProps?: React.ComponentProps<typeof BackToTopButton>;
  headerProps?: React.ComponentProps<typeof Header>;
}

export const Layout: React.FC<LayoutProps> = ({
  children,
  showFooter = true,
  showBackToTop = true,
  footerProps,
  backToTopProps,
  headerProps,
}) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0a0c] via-[#0f0f13] to-[#0a0a0c]">
      <ScrollToTop />
      <Header {...headerProps} />
      
      {/* Animated Background - Same as before */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zMCAzMG0yOSAwYTI5IDI5IDAgMSAxLTU4IDAgMjkgMjkgMCAwIDEgNTggMHoiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4wMykiLz48L2c+PC9zdmc+')] opacity-20" />
      </div>

      <main>{children}</main>

      {showFooter && <Footer {...footerProps} />}
      {showBackToTop && <BackToTopButton {...backToTopProps} />}
    </div>
  );
};

export default Layout;