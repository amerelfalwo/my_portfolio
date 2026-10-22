import { memo } from 'react';
import { Globe, Sparkles } from 'lucide-react';
import { profile } from '../data/profile';

const About = memo(() => {
  return (
    <section id="about" className="py-24 sm:py-32 relative bg-transparent border-t border-border/60">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-start">
          
          {/* ── Left Column (4 cols): About Me Headline, Intro & Curved Arrow ── */}
          <div className="lg:col-span-4 flex flex-col justify-between h-full text-start pt-2">
            <div>
              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-light tracking-tight text-foreground leading-[1.08]">
                About Me
              </h2>

              <p className="text-muted text-sm sm:text-base leading-relaxed mt-5 max-w-sm font-normal">
                I specialize in turning complex problems into scalable neural solutions. My approach blends deep learning rigor with clean architectural design to deliver AI systems that not only look great but work seamlessly. Ready to build your next project?
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
            <div className="bg-surface rounded-3xl border border-border p-6 sm:p-7 shadow-xs flex flex-col justify-between text-start">
              <div>
                {/* Globe Icon in Circle */}
                <div className="w-12 h-12 rounded-full border border-border bg-surface-muted/50 flex items-center justify-center mb-6">
                  <Globe className="w-5 h-5 text-foreground stroke-[1.5]" />
                </div>

                {/* Big Stat Number */}
                <div className="text-5xl sm:text-6xl font-light text-foreground tracking-tight leading-none">
                  100%
                </div>

                {/* Stat Description */}
                <p className="text-xs sm:text-sm text-muted mt-3.5 leading-relaxed font-normal">
                  Production-ready systems engineered with domain-driven Clean Architecture and resilient pipelines.
                </p>
              </div>

              {/* Bottom Image: about-portrait.webp */}
              <div className="mt-8 rounded-2xl overflow-hidden aspect-[4/5] w-full border border-border/50 bg-surface-muted">
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
            {/* Top: Square Image Card with Center Arrow Button */}
            <div className="relative w-full max-w-[280px] aspect-square rounded-3xl overflow-hidden border border-border bg-surface-muted group mb-8 sm:mb-10 shadow-xs">
              <img
                src="/about-face.webp"
                alt={profile.name}
                loading="lazy"
                className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
              />

              {/* Center White Circle Button with Arrow ↗ */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-12 h-12 rounded-full bg-surface text-foreground shadow-md flex items-center justify-center">
                  <span className="inline-block rtl:-scale-x-100 text-lg font-medium" aria-hidden="true">↗</span>
                </div>
              </div>
            </div>

            {/* Bottom: Two Bullet Points with Dark Circle Star Badges */}
            <div className="space-y-6">
              {/* Bullet 1 */}
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-foreground text-surface flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
                  <Sparkles size={14} className="fill-current text-surface" />
                </div>
                <p className="text-xs sm:text-sm text-foreground/85 leading-relaxed font-normal">
                  With 2+ years of experience, I specialize in architecting deep learning, computer vision, and autonomous agent systems that solve real-world problems and deliver seamless digital experiences.
                </p>
              </div>

              {/* Bullet 2 */}
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-foreground text-surface flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
                  <Sparkles size={14} className="fill-current text-surface" />
                </div>
                <p className="text-xs sm:text-sm text-foreground/85 leading-relaxed font-normal">
                  I thrive on working closely with engineering teams and clients, blending algorithmic rigor with domain-driven design to bring intelligent systems to life.
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
