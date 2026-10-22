import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { m, AnimatePresence } from 'framer-motion';
import { useSettings } from '../hooks/useData';
import { profile } from '../data/profile';

const spring = { type: 'spring', stiffness: 260, damping: 25 };

const NAV_LINKS = [
  { name: 'About', href: '#about' },
  { name: 'Skills', href: '#skills' },
  { name: 'Projects', href: '#projects' },
  { name: 'Certificates', href: '#education' },
];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { settings } = useSettings();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const siteTitle = settings?.siteTitle || `${profile.name} | ${profile.title}`;
  const siteLogoUrl = (settings?.siteLogoUrl && !settings.siteLogoUrl.includes('nszvb6wnbfzyfcuvvt7n'))
    ? settings.siteLogoUrl
    : '/logo.webp';

  useEffect(() => {
    if (siteTitle) {
      document.title = siteTitle;
    }
    const favicon = document.querySelector("link[rel='icon']");
    if (favicon) {
      favicon.href = siteLogoUrl || '/favicon.ico';
    }
  }, [siteTitle, siteLogoUrl]);

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-background/90 backdrop-blur-md border-b border-border'
          : 'bg-background/60 backdrop-blur-sm border-b border-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-12 h-16 sm:h-20 flex items-center justify-between">
        {/* Brand / Logo */}
        <a
          href="#"
          className="flex items-center gap-3 group text-start"
          aria-label={`${profile.name} Home`}
        >
          {siteLogoUrl && (
            <img
              src={siteLogoUrl}
              alt=""
              className="h-7 w-7 object-contain rounded-lg border border-border"
              onError={(e) => { e.currentTarget.style.display = 'none'; }}
            />
          )}
          <span className="text-base sm:text-lg font-medium tracking-tight text-foreground transition-colors group-hover:text-muted">
            {profile.name}
          </span>
        </a>

        {/* Desktop Nav Links */}
        <nav className="hidden md:flex items-center gap-8" aria-label="Main Navigation">
          {NAV_LINKS.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="text-sm font-normal text-muted hover:text-foreground transition-colors duration-200"
            >
              {link.name}
            </a>
          ))}
        </nav>

        {/* Desktop Right CTA: Underlined Contact ↗ */}
        <div className="hidden md:flex items-center">
          <a
            href="#contact"
            className="text-sm font-medium text-foreground underline underline-offset-4 hover:text-muted transition-colors duration-200 inline-flex items-center gap-1"
          >
            <span>Contact</span>
            <span className="inline-block rtl:-scale-x-100 ms-0.5 text-xs" aria-hidden="true">↗</span>
          </a>
        </div>

        {/* Mobile Toggle Button */}
        <button
          type="button"
          className="md:hidden text-foreground p-2 rounded-lg border border-border hover:bg-surface-muted transition-colors"
          onClick={() => setIsOpen(!isOpen)}
          aria-label={isOpen ? 'Close navigation menu' : 'Open navigation menu'}
          aria-expanded={isOpen}
        >
          {isOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isOpen && (
          <>
            <m.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="md:hidden fixed inset-0 bg-foreground/20 backdrop-blur-sm z-[60]"
            />

            <m.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={spring}
              className="md:hidden fixed top-0 end-0 h-screen w-[280px] bg-surface border-s border-border p-6 flex flex-col z-[70]"
            >
              <div className="flex items-center justify-between pb-6 border-b border-border">
                <span className="text-sm font-semibold text-foreground tracking-tight">
                  {profile.name}
                </span>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  aria-label="Close navigation menu"
                  className="p-1.5 rounded-lg border border-border text-foreground hover:bg-surface-muted transition-colors"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="flex flex-col gap-1 py-6">
                {NAV_LINKS.map((link) => (
                  <a
                    key={link.name}
                    href={link.href}
                    className="text-base font-normal text-muted hover:text-foreground py-3 border-b border-border/40 transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    {link.name}
                  </a>
                ))}
              </div>

              <div className="mt-auto pt-6 border-t border-border">
                <a
                  href="#contact"
                  className="w-full inline-flex items-center justify-center gap-1.5 bg-foreground text-surface rounded-full py-3 text-sm font-medium hover:opacity-90 transition-opacity"
                  onClick={() => setIsOpen(false)}
                >
                  <span>Contact</span>
                  <span className="inline-block rtl:-scale-x-100 ms-0.5 text-xs" aria-hidden="true">↗</span>
                </a>
              </div>
            </m.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;
