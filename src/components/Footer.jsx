import { useMemo } from 'react';
import { useSettings } from '../hooks/useData';

const Footer = () => {
  const { settings } = useSettings();

  const logoText = useMemo(() => {
    return settings?.logoText || 'Amir Elrefai';
  }, [settings?.logoText]);

  const jobTitle = settings?.jobTitle || 'AI Architecture & Machine Learning';

  return (
    <footer className="border-t border-border bg-background py-16">
      <div className="page-container">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-12">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-foreground mb-1">
              {logoText}
            </h2>
            <p className="text-xs uppercase font-medium tracking-wider text-muted">
              {jobTitle}
            </p>
          </div>

          <nav className="flex flex-wrap items-center gap-6 text-sm font-medium text-muted">
            <a href="#about" className="hover:text-foreground transition-colors">About</a>
            <a href="#skills" className="hover:text-foreground transition-colors">Skills</a>
            <a href="#projects" className="hover:text-foreground transition-colors">Portfolio</a>
            <a href="#education" className="hover:text-foreground transition-colors">Certificates</a>
            <a href="#contact" className="hover:text-foreground transition-colors">Contact</a>
          </nav>
        </div>

        <div className="pt-8 border-t border-border flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-muted">
          <p>© {new Date().getFullYear()} {settings?.fullName || 'Amir Elrefai'}. All rights reserved.</p>
          <p className="font-mono text-[11px] uppercase tracking-wider">AI Engineer • Mansoura, Egypt</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
