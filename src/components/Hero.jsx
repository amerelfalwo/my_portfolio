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
      className="relative min-h-[94dvh] lg:min-h-screen w-full flex flex-col justify-between pt-24 sm:pt-28 pb-6 sm:pb-8 overflow-hidden bg-transparent select-none"
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

      {/* ── Main Hero Content Grid (Full Bleed Space Exploitation) ── */}
      <div className="w-full flex-1 flex flex-col justify-between px-6 sm:px-12 lg:ps-24 lg:pe-10 xl:ps-32 xl:pe-16 relative z-10">
        
        {/* Top/Middle Area: Left Content + Right Bottom-Anchored Portrait */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-4 items-end flex-1 my-auto">
          
          {/* Left Column (7 cols): Stats + Massive "Hello" + Role */}
          <div className="lg:col-span-7 flex flex-col justify-center items-start text-start pt-6 sm:pt-10 lg:pt-0">
            
            {/* Stats Row per Reference Image 2 (+200 / +50 layout) */}
            <div className="flex items-start gap-12 sm:gap-16 mb-8 sm:mb-12">
              <div>
                <div className="text-3xl sm:text-4xl md:text-5xl font-light tracking-tight text-foreground leading-none">
                  +{projectCount}
                </div>
                <div className="text-xs text-muted mt-2 font-normal leading-snug">
                  Projects completed
                </div>
              </div>

              <div>
                <div className="text-3xl sm:text-4xl md:text-5xl font-light tracking-tight text-foreground leading-none">
                  +2
                </div>
                <div className="text-xs text-muted mt-2 font-normal leading-snug">
                  Years building AI
                </div>
              </div>
            </div>

            {/* Massive Display Title per Reference Image 2: "Hello" */}
            <h1 className="text-[76px] sm:text-[110px] md:text-[135px] lg:text-[145px] xl:text-[170px] font-normal tracking-[-0.035em] text-foreground leading-[0.9] select-none">
              Hello
            </h1>

            {/* Subtitle with Dash per Reference Image 2: "— It's D.Nova a design wizerd" */}
            <p className="text-base sm:text-lg md:text-xl text-foreground font-normal tracking-wide mt-4 sm:mt-6">
              — It&apos;s {profile.name} an AI Engineer
            </p>

          </div>

          {/* Right Column (5 cols): Studio Portrait, Bottom-Anchored & Giant per Reference */}
          <div className="lg:col-span-5 relative flex items-end justify-center lg:justify-end self-end w-full h-full">
            <div className="relative w-full flex items-end justify-center lg:justify-end">
              <img
                src="/hero-portrait.webp"
                alt={profile.name}
                width="896"
                height="1200"
                className="w-auto h-[55vh] sm:h-[65vh] lg:h-[78vh] xl:h-[84vh] max-h-[820px] xl:max-h-[900px] object-contain object-bottom select-none pointer-events-none"
                fetchPriority="high"
                decoding="async"
              />
            </div>
          </div>

        </div>

        {/* Bottom Bar: Scroll down ↓ per Reference Image 2 */}
        <div className="pt-4 sm:pt-6 pb-2 text-start">
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