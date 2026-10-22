import { ArrowDown } from 'lucide-react';
import { memo } from 'react';
import { useProjects } from '../hooks/useData';
import { profile } from '../data/profile';
import { projects as staticProjects } from '../data/projects';

const Hero = memo(() => {
  const { projects: liveProjects } = useProjects();

  // Derive project count dynamically from projects data
  const projectCount = (liveProjects && liveProjects.length > 0)
    ? liveProjects.length
    : staticProjects.length;

  return (
    <section
      id="hero"
      className="relative min-h-[calc(100svh-4rem)] sm:min-h-[calc(100svh-5rem)] w-full flex flex-col justify-between pt-20 sm:pt-24 pb-0 sm:pb-8 overflow-hidden bg-transparent select-none"
    >
      {/* ── Left Vertical Margin Rail per Reference Image 2 ── */}
      <div className="hidden lg:flex absolute start-0 top-0 bottom-0 w-16 xl:w-20 border-e border-border/60 flex-col justify-between items-center py-28 pointer-events-none z-20">
        <span className="text-[11px] uppercase tracking-widest text-muted/70 font-medium [writing-mode:vertical-rl] rotate-180">
          AI Engineer
        </span>
        <span className="text-[11px] tracking-widest text-muted/60 font-mono [writing-mode:vertical-rl] rotate-180">
          2026
        </span>
      </div>

      {/* ── Main Hero Content Grid ── */}
      <div className="page-container flex-1 flex flex-col justify-between relative z-10 pb-0">
        
        {/* Top/Middle Area: Left Content + Right Bottom-Anchored Portrait */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-4 items-end flex-1 my-auto">
          
          {/* Left Column (7 cols): Stats + Massive "Hello" + Role */}
          <div className="lg:col-span-7 flex flex-col justify-center items-start text-start pt-4 sm:pt-10 lg:pt-0">
            
            {/* Stats Row */}
            <div className="flex items-start gap-12 sm:gap-16 mb-6 sm:mb-12">
              <div>
                <div className="text-3xl sm:text-4xl md:text-5xl font-light tracking-tight text-foreground leading-none">
                  {projectCount}
                </div>
                <div className="text-xs text-muted mt-2 font-normal leading-snug">
                  Projects
                </div>
              </div>

              <div>
                <div className="text-3xl sm:text-4xl md:text-5xl font-light tracking-tight text-foreground leading-none">
                  2+
                </div>
                <div className="text-xs text-muted mt-2 font-normal leading-snug">
                  Years building AI projects
                </div>
              </div>
            </div>

            {/* Massive Display Title per Reference Image 2: "Hello" */}
            <h1 className="text-[76px] sm:text-[110px] md:text-[135px] lg:text-[145px] xl:text-[170px] font-normal tracking-[-0.035em] text-foreground leading-[0.9] select-none">
              Hello
            </h1>

            {/* Subtitle with Dash */}
            <p className="text-base sm:text-lg md:text-xl text-foreground font-normal tracking-wide mt-4 sm:mt-6">
              — I&apos;m {profile.name}, an AI Engineer &amp; Systems Analyst.
            </p>

            {/* Mobile-only "Download CV" pill under Subtitle */}
            <div className="mt-5 block lg:hidden">
              <a
                href={profile.links.resume}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-border bg-surface text-foreground text-xs font-medium hover:bg-foreground hover:text-surface transition-colors"
              >
                <span>Download CV</span>
                <span className="inline-block rtl:-scale-x-100" aria-hidden="true">→</span>
              </a>
            </div>

          </div>

          {/* Right Column (5 cols): Studio Portrait, w-full on mobile, flush to bottom border */}
          <div className="lg:col-span-5 relative flex items-end justify-center lg:justify-end self-end w-full">
            <div className="relative w-full flex items-end justify-center lg:justify-end">
              <img
                src="/hero-portrait.webp"
                alt={profile.name}
                width="896"
                height="1200"
                className="w-full lg:w-auto h-auto max-h-[50vh] sm:max-h-[60vh] lg:h-[78vh] xl:h-[84vh] max-h-[820px] xl:max-h-[900px] object-contain object-bottom select-none pointer-events-none"
                fetchPriority="high"
                decoding="async"
              />
            </div>
          </div>

        </div>

        {/* Bottom Bar: Scroll down ↓ */}
        <div className="hidden sm:block pt-4 sm:pt-6 pb-2 text-start">
          <a
            href="#about"
            className="inline-flex items-center gap-1.5 text-xs text-muted font-normal hover:text-foreground transition-colors cursor-pointer"
          >
            <span>Scroll down</span>
            <ArrowDown size={13} className="animate-bounce" aria-hidden="true" />
          </a>
        </div>

      </div>
    </section>
  );
});

Hero.displayName = 'Hero';

export default Hero;