import { ArrowDown } from 'lucide-react';
import { memo } from 'react';
import { useProjects, useSettings } from '../hooks/useData';
import { profile } from '../data/profile';
import { projects as staticProjects } from '../data/projects';

const Hero = memo(() => {
  const { projects: liveProjects } = useProjects();
  const { settings } = useSettings();

  const name = settings?.fullName || settings?.name || profile.name;
  const jobTitle = settings?.jobTitle || 'AI Engineer & Systems Analyst';
  const resumeUrl = settings?.resumeUrl || settings?.cvUrl || profile.links.resume;
  const githubUrl = settings?.githubUrl || settings?.socialLinks?.github || profile.links.github;
  const heroImage = settings?.heroImage || settings?.profileImageUrl || '/hero.webp';

  // Derive project count dynamically from projects data
  const projectCount = (liveProjects && liveProjects.length > 0)
    ? liveProjects.length
    : staticProjects.length;

  return (
    <section
      id="hero"
      className="relative min-h-hero lg:h-hero mt-[var(--header-h)] border-b border-border w-full flex flex-col justify-between overflow-hidden bg-transparent select-none"
    >
      {/* ── Left Vertical Margin Rail ── */}
      <div className="hidden lg:flex absolute start-0 top-0 bottom-0 w-16 xl:w-20 border-e border-border flex-col justify-between items-center py-8 pointer-events-none z-20">
        <span className="text-xs text-muted font-normal [writing-mode:vertical-rl] rotate-180">
          AI Engineer
        </span>
        <span className="text-xs text-muted font-normal [writing-mode:vertical-rl] rotate-180">
          2026
        </span>
      </div>

      {/* ── Main Hero Content Grid ── */}
      <div className="page-container flex-1 h-full flex flex-col justify-between relative z-10 pb-0">
        
        {/* Top/Middle Area: Left Content + Right Bottom-Anchored Portrait */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-4 items-stretch flex-1 h-full">
          
          {/* Left Column (6 cols): 4-row layout (auto / 1fr / auto / auto) */}
          <div className="lg:col-span-6 flex flex-col justify-between h-full pt-4 sm:pt-6 lg:pt-8 pb-4 lg:pb-8 text-start relative z-10">
            
            {/* Row 1: Stats */}
            <div className="flex items-start gap-10 sm:gap-14 lg:gap-16 pt-1">
              <div>
                <div className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extralight tracking-tight text-foreground leading-none">
                  +{projectCount}
                </div>
                <div className="text-xs sm:text-sm text-muted mt-2 font-normal leading-tight max-w-[130px]">
                  Projects<br />completed
                </div>
              </div>

              <div>
                <div className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extralight tracking-tight text-foreground leading-none">
                  +2
                </div>
                <div className="text-xs sm:text-sm text-muted mt-2 font-normal leading-tight max-w-[130px]">
                  Years building<br />AI projects
                </div>
              </div>
            </div>

            {/* Row 2: Flexible empty space */}
            <div className="hidden lg:block flex-1 min-h-[1rem]" />

            {/* Row 3: Display Title + Subtitle + CTAs */}
            <div className="my-auto lg:my-0">
              {/* Massive Display Title */}
              <h1 className="font-display text-[88px] sm:text-[115px] md:text-[140px] lg:text-[150px] xl:text-[180px] 2xl:text-[205px] font-light tracking-[-0.035em] text-foreground leading-[0.86] select-none">
                Hello
              </h1>

              {/* Subtitle with Dash */}
              <p className="text-base sm:text-lg text-foreground font-normal tracking-wide mt-3 sm:mt-4">
                — I&apos;m {name}, an {jobTitle}.
              </p>

              {/* Desktop CTAs */}
              <div className="mt-5 lg:mt-6 hidden lg:flex items-center gap-6">
                <a
                  href={resumeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-foreground text-surface text-xs font-medium hover:opacity-90 transition-opacity"
                >
                  <span>Download CV</span>
                  <span className="inline-block rtl:-scale-x-100" aria-hidden="true">→</span>
                </a>

                <a
                  href={githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-medium text-foreground underline underline-offset-4 hover:text-muted transition-colors"
                >
                  View GitHub <span className="inline-block rtl:-scale-x-100" aria-hidden="true">↗</span>
                </a>
              </div>

              {/* Mobile-only "Download CV" pill under Subtitle */}
              <div className="mt-5 block lg:hidden">
                <a
                  href={resumeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-border bg-surface text-foreground text-xs font-medium hover:bg-foreground hover:text-surface transition-colors"
                >
                  <span>Download CV</span>
                  <span className="inline-block rtl:-scale-x-100" aria-hidden="true">→</span>
                </a>
              </div>
            </div>

            {/* Flexible empty space before scroll down */}
            <div className="hidden lg:block flex-1 min-h-[1rem]" />

            {/* Row 4: Scroll down ↓ aligned to bottom-start */}
            <div className="hidden lg:block">
              <a
                href="#about"
                className="inline-flex items-center gap-1.5 text-xs text-muted font-normal hover:text-foreground transition-colors cursor-pointer"
              >
                <span>Scroll down</span>
                <ArrowDown size={13} className="animate-bounce" aria-hidden="true" />
              </a>
            </div>

          </div>

          {/* Right Column (6 cols, 50% width): Studio Portrait, flush to bottom border */}
          <div className="lg:col-span-6 relative flex items-end justify-center self-end w-full h-full overflow-visible">
            <img
              src={heroImage}
              alt={name}
              width="646"
              height="680"
              className="w-full lg:w-auto h-auto max-h-[55vh] sm:max-h-[65vh] lg:max-h-[86%] lg:h-[86%] object-contain object-bottom select-none pointer-events-none lg:scale-110 xl:scale-115 2xl:scale-120 origin-bottom"
              fetchPriority="high"
              decoding="async"
            />
          </div>

        </div>

      </div>
    </section>
  );
});

Hero.displayName = 'Hero';

export default Hero;