import { memo } from 'react';
import { ArrowRight, CheckCircle2, ShieldCheck, Cpu, Eye, Sparkles, Layers, Terminal } from 'lucide-react';
import { profile } from '../data/profile';
import { useAboutConfig } from '../hooks/useData';

const PILLAR_ICONS = {
  'vision-ml': Eye,
  'genai-agents': Sparkles,
  'clean-arch': Layers,
  'mlops-cloud': Terminal,
};

const About = memo(() => {
  const { aboutConfig } = useAboutConfig();

  const title = aboutConfig?.title || 'Engineering intelligence into robust systems.';
  const subtitle = aboutConfig?.subtitle || profile.bio.short;
  const extendedBio = profile.bio.extended || [];

  return (
    <section id="about" className="py-24 sm:py-32 relative bg-transparent border-t border-border/60">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-16 sm:mb-20 text-start">
          <div className="inline-flex items-center gap-2 text-xs font-medium text-muted tracking-wide mb-3">
            <span className="text-[8px] text-foreground" aria-hidden="true">●</span>
            <span>About me</span>
          </div>
          
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-light tracking-tight text-foreground leading-[1.12]">
            {title}
          </h2>
          
          <p className="text-muted text-base sm:text-lg font-normal leading-relaxed mt-4">
            {subtitle}
          </p>
        </div>

        {/* 2-Column Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          
          {/* Left Column (7 cols): Narrative & Background */}
          <div className="lg:col-span-7 flex flex-col gap-6 text-start">
            <div className="space-y-4 text-foreground/80 text-sm sm:text-base leading-relaxed font-normal">
              {extendedBio.map((paragraph, idx) => (
                <p key={idx} className="leading-relaxed">
                  {paragraph}
                </p>
              ))}
            </div>

            {/* Academic Standing & Honors */}
            <div className="p-5 sm:p-6 rounded-lg border border-border bg-surface mt-2">
              <div className="flex items-start gap-3.5">
                <ShieldCheck className="w-5 h-5 text-foreground shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-sm sm:text-base font-medium text-foreground tracking-tight">
                    B.Sc. Computer & Information Sciences
                  </h3>
                  <p className="text-xs sm:text-sm text-muted mt-1 leading-normal">
                    Mansoura University (IT Major) • Completed with &quot;Very Good&quot; Honors (Class of 2026).
                  </p>
                </div>
              </div>
            </div>

            {/* Availability Status Card */}
            <div className="p-5 sm:p-6 rounded-lg border border-border bg-surface-muted flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="text-xs uppercase tracking-wider text-muted font-medium">
                  Current Status
                </div>
                <div className="text-sm sm:text-base font-medium text-foreground mt-0.5">
                  {profile.status.message}
                </div>
                <div className="text-xs text-muted mt-0.5">
                  {profile.status.locations}
                </div>
              </div>
              <a
                href="#contact"
                className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-medium text-foreground underline underline-offset-4 hover:text-muted transition-colors shrink-0"
              >
                <span>Get in touch</span>
                <span className="inline-block rtl:-scale-x-100 ms-0.5" aria-hidden="true">↗</span>
              </a>
            </div>
          </div>

          {/* Right Column (5 cols): Core Engineering Pillars */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            <div className="text-xs uppercase tracking-wider text-muted font-medium mb-1 text-start">
              Core Engineering Pillars
            </div>

            {profile.pillars.map((pillar) => {
              const IconComp = PILLAR_ICONS[pillar.id] || Cpu;
              return (
                <div
                  key={pillar.id}
                  className="p-5 rounded-lg border border-border bg-surface hover:border-foreground/30 transition-colors text-start"
                >
                  <div className="flex items-center gap-2.5 mb-2">
                    <IconComp className="w-4 h-4 text-foreground shrink-0" />
                    <h4 className="text-sm font-medium text-foreground tracking-tight">
                      {pillar.title}
                    </h4>
                  </div>
                  <p className="text-xs sm:text-sm text-muted leading-relaxed font-normal">
                    {pillar.description}
                  </p>
                </div>
              );
            })}
          </div>

        </div>

      </div>
    </section>
  );
});

About.displayName = 'About';

export default About;
