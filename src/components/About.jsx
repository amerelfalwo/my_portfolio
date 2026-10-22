import { memo } from 'react';
import { Globe, Sparkles } from 'lucide-react';
import { profile } from '../data/profile';
import { useProjects } from '../hooks/useData';
import { projects as staticProjects } from '../data/projects';

const About = memo(() => {
  const { projects: liveProjects } = useProjects();
  const projectCount = (liveProjects && liveProjects.length > 0)
    ? liveProjects.length
    : staticProjects.length;

  return (
    <section id="about" className="py-24 sm:py-32 relative bg-transparent border-t border-border/60">
      <div className="page-container">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-start">
          
          {/* ── Left Column (4 cols): About Me Headline, Intro & Curved Arrow ── */}
          <div className="lg:col-span-4 flex flex-col justify-between h-full text-start pt-2">
            <div>
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-border text-xs font-medium text-foreground tracking-wide mb-4 bg-surface">
                <span className="text-[7px] text-foreground" aria-hidden="true">●</span>
                <span>About</span>
              </div>

              <h2 className="text-4xl md:text-5xl font-light tracking-tight text-foreground leading-[1.08]">
                About Me
              </h2>

              <p className="text-muted text-sm sm:text-base leading-relaxed mt-5 max-w-sm font-normal">
                I build deep learning, computer vision, and autonomous agent systems, and structure them with Clean Architecture so they stay maintainable. I have 2+ years building AI projects.
              </p>
            </div>

            {/* Subtle Curved Arrow pointing toward middle card per reference screenshot */}
            <div className="hidden lg:block mt-16 ps-6">
              <svg 
                viewBox="0 0 160 120" 
                className="w-36 h-auto text-muted/30 stroke-current fill-none stroke-[2.5] rtl:-scale-x-100 origin-center"
                aria-hidden="true"
              >
                <path 
                  d="M20,100 C60,110 110,95 135,35" 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                />
                <path 
                  d="M115,30 L135,35 L138,55" 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                />
              </svg>
            </div>
          </div>

          {/* ── Middle Column (4 cols): Tall Card with Icon, Stat & about-portrait.webp ── */}
          <div className="lg:col-span-4">
            <div className="bg-surface rounded-lg border border-border p-6 sm:p-7 flex flex-col justify-between text-start">
              <div>
                {/* Globe Icon in Circle */}
                <div className="w-12 h-12 rounded-full border border-border bg-surface-muted/50 flex items-center justify-center mb-6">
                  <Globe className="w-5 h-5 text-foreground stroke-[1.5]" />
                </div>

                {/* Big Stat Number */}
                <div className="text-5xl sm:text-6xl font-light text-foreground tracking-tight leading-none">
                  {projectCount}
                </div>

                {/* Stat Description */}
                <p className="text-xs sm:text-sm text-muted mt-3.5 leading-relaxed font-normal">
                  Projects across computer vision, LLM agents, and backend systems.
                </p>
              </div>

              {/* Bottom Image: about-portrait.webp */}
              <div className="mt-8 rounded-lg overflow-hidden aspect-[4/5] w-full border border-border bg-surface-muted">
                <img
                  src="/about-portrait.webp"
                  alt={profile.name}
                  loading="lazy"
                  className="w-full h-full object-cover object-top"
                />
              </div>
            </div>
          </div>

          {/* ── Right Column (4 cols): Square Face Crop (about-face.webp) + Bullet Points ── */}
          <div className="lg:col-span-4 flex flex-col justify-between text-start pt-2">
            {/* Top: Square Image Card with Bottom-End Link Button */}
            <div className="relative w-full max-w-[280px] aspect-square rounded-lg overflow-hidden border border-border bg-surface-muted group mb-8 sm:mb-10">
              <img
                src="/about-face.webp"
                alt={profile.name}
                loading="lazy"
                className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
              />

              {/* Bottom-End Link Arrow: never over face, visible on hover/focus and on touch */}
              <a
                href={profile.links.github}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="View Amir's GitHub profile"
                className="absolute bottom-3 end-3 w-10 h-10 rounded-full bg-surface border border-border text-foreground flex items-center justify-center transition-opacity duration-200 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 sm:focus-visible:opacity-100 focus-visible:opacity-100 hover:bg-foreground hover:text-surface"
              >
                <span className="inline-block rtl:-scale-x-100 text-sm font-medium" aria-hidden="true">↗</span>
              </a>
            </div>

            {/* Bottom: Two Bullet Points with Dark Circle Star Badges */}
            <div className="space-y-6">
              {/* Bullet 1 */}
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-foreground text-surface flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
                  <Sparkles size={14} className="fill-current text-surface" />
                </div>
                <p className="text-xs sm:text-sm text-foreground/85 leading-relaxed font-normal">
                  Hands-on background developing medical computer vision, multi-agent systems, advanced RAG, and real-time detection pipelines.
                </p>
              </div>

              {/* Bullet 2 */}
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-foreground text-surface flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
                  <Sparkles size={14} className="fill-current text-surface" />
                </div>
                <p className="text-xs sm:text-sm text-foreground/85 leading-relaxed font-normal">
                  Focused on Clean Architecture: keeping domain logic separate from frameworks, APIs, and storage.
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
});

About.displayName = 'About';

export default About;
