import { ArrowRight, ArrowDown } from 'lucide-react';
import { memo } from 'react';
import { useSettings, useProjects } from '../hooks/useData';
import { profile } from '../data/profile';
import { projects as staticProjects } from '../data/projects';

const Hero = memo(() => {
  const { settings } = useSettings();
  const { projects: liveProjects } = useProjects();

  // Derive project count dynamically from projects data (no hardcoded numbers, no "+")
  const projectCount = (liveProjects && liveProjects.length > 0)
    ? liveProjects.length
    : staticProjects.length;

  const cvUrl = settings?.resumeUrl || profile.links.resume;
  const githubUrl = settings?.githubUrl || profile.links.github;
  const bioText = settings?.bio || profile.bio.short;

  return (
    <section
      id="hero"
      className="relative min-h-[92dvh] flex items-center lg:items-end justify-center pt-24 sm:pt-28 pb-8 lg:pb-0 overflow-hidden bg-transparent"
    >
      <div className="w-full max-w-7xl mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-end">
          
          {/* Left Column: Text & Content (Editorial Layout per Reference Image 4) */}
          <div className="lg:col-span-7 flex flex-col items-start text-start pb-8 lg:pb-16 xl:pb-20">
            
            {/* Top Stats Group: ONE source of truth, derived count, no "+" on projects */}
            <div className="flex items-center gap-6 sm:gap-8 mb-8 sm:mb-10 text-start">
              <div>
                <div className="text-2xl sm:text-3xl font-medium tracking-tight text-foreground leading-none">
                  {projectCount}
                </div>
                <div className="text-xs text-muted mt-1.5 font-normal">
                  Projects
                </div>
              </div>
              <div className="h-8 w-px bg-border" aria-hidden="true" />
              <div>
                <div className="text-2xl sm:text-3xl font-medium tracking-tight text-foreground leading-none">
                  2+
                </div>
                <div className="text-xs text-muted mt-1.5 font-normal">
                  Years building AI projects
                </div>
              </div>
            </div>

            {/* Display Heading: Large Neo-grotesk font-light */}
            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-light tracking-tight text-foreground leading-[1.04]">
              {profile.name}
            </h1>

            {/* Role / Subtitle */}
            <p className="text-muted text-base sm:text-lg font-normal mt-4">
              — {profile.title}
            </p>

            {/* Bio Narrative */}
            <p className="text-muted text-sm sm:text-base leading-relaxed mt-5 max-w-lg font-normal">
              {bioText}
            </p>

            {/* CTAs: Primary solid pill + Secondary text link */}
            <div className="flex flex-wrap items-center gap-4 sm:gap-6 mt-8 sm:mt-10">
              <a
                href={cvUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-6 sm:px-7 py-3 rounded-full bg-foreground text-surface text-sm font-medium hover:opacity-90 transition-opacity"
              >
                <span>Download CV</span>
                <ArrowRight size={15} className="rtl:rotate-180 ms-0.5" aria-hidden="true" />
              </a>

              <a
                href={githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-sm font-medium text-foreground underline underline-offset-4 hover:text-muted transition-colors py-2"
              >
                <span>View GitHub</span>
                <span className="inline-block rtl:-scale-x-100 ms-0.5 text-xs" aria-hidden="true">↗</span>
              </a>
            </div>

            {/* Scroll Down Indicator */}
            <div className="mt-12 sm:mt-16 inline-flex items-center gap-2 text-xs text-muted font-normal select-none">
              <span>Scroll down</span>
              <ArrowDown size={13} className="animate-bounce" aria-hidden="true" />
            </div>

          </div>

          {/* Right Column: Hero Studio Portrait (Seamlessly anchored to bottom per reference perspective) */}
          <div className="lg:col-span-5 flex items-end justify-center lg:justify-end w-full self-end">
            <div className="relative w-full max-w-sm sm:max-w-md lg:max-w-lg flex items-end justify-center lg:justify-end">
              <img
                src="/hero.webp"
                alt={profile.name}
                width="896"
                height="1200"
                className="w-full h-auto max-h-[500px] sm:max-h-[600px] lg:max-h-[720px] xl:max-h-[780px] object-contain object-bottom select-none pointer-events-none drop-shadow-sm mix-blend-multiply"
                fetchPriority="high"
                decoding="async"
                onError={(e) => {
                  if (!e.currentTarget.dataset.fallbackTried) {
                    e.currentTarget.dataset.fallbackTried = 'true';
                    e.currentTarget.src = '/hero.jpg';
                  }
                }}
              />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
});

Hero.displayName = 'Hero';

export default Hero;