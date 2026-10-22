import { useState, useMemo, memo } from 'react';
import { Link } from 'react-router-dom';
import { useProjects } from '../hooks/useData';
import { projects as fallbackProjects } from '../data/projects';

const INITIAL_DISPLAY_COUNT = 6;

const getProjectFallbackImage = (project) => {
  const p = ((project?.id || '') + ' ' + (project?.title || '') + ' ' + (project?.category || '')).toLowerCase();

  if (p.includes('mnemos') || p.includes('agentic_memory') || p.includes('cognitive memory')) return '/images/projects/mnemos.webp';
  if (p.includes('sql-llm') || p.includes('text-to-sql') || p.includes('lora')) return '/images/projects/sql-llm.webp';
  if (p.includes('graph') || p.includes('graphrag') || p.includes('knowledge graph')) return '/images/projects/graphrag.webp';
  if (p.includes('langgraph') || p.includes('multiagent') || p.includes('multi-agent')) return '/images/projects/langgraph-agent.webp';
  if (p.includes('crew') || p.includes('procurement') || p.includes('search_agent')) return '/images/projects/crew-procurement.webp';
  if (p.includes('phishing') || p.includes('simulation') || p.includes('cybersecurity')) return '/images/projects/phishing-simulator.webp';
  if (p.includes('sentiment') || p.includes('review') || p.includes('semantic_analysis')) return '/images/projects/sentiment-analyzer.webp';
  if (p.includes('cv-inference') || p.includes('depi_back') || p.includes('yolo') || p.includes('traffic')) return '/images/projects/cv-yolo.webp';
  if (p.includes('thyrax') || p.includes('cancer')) return '/images/projects/thyrax.webp';
  return '/images/projects/project-placeholder.webp';
};

const Projects = memo(() => {
  const { projects: liveProjects } = useProjects();
  const allProjects = (liveProjects && liveProjects.length > 0) ? liveProjects : fallbackProjects;

  const [activeCategory, setActiveCategory] = useState('ALL');
  const [displayCount, setDisplayCount] = useState(INITIAL_DISPLAY_COUNT);

  const filteredProjects = useMemo(() => {
    if (activeCategory === 'ALL') return allProjects;
    return allProjects.filter(p => p.category === activeCategory);
  }, [allProjects, activeCategory]);

  const visibleProjects = useMemo(() => {
    return filteredProjects.slice(0, displayCount);
  }, [filteredProjects, displayCount]);

  const hasMore = displayCount < filteredProjects.length;

  const handleCategoryChange = (catId) => {
    setActiveCategory(catId);
    setDisplayCount(INITIAL_DISPLAY_COUNT);
  };

  return (
    <section id="projects" className="py-24 sm:py-32 relative bg-transparent border-t border-border/60">
      <div className="page-container">
        
        {/* Section Header Centered per Pattern: "● Projects" pill + "Latest Works" heading */}
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-border text-xs font-medium text-foreground tracking-wide mb-4 bg-surface">
            <span className="text-[7px] text-foreground" aria-hidden="true">●</span>
            <span>Projects</span>
          </div>

          <h2 className="text-4xl md:text-5xl font-light tracking-tight text-foreground leading-[1.12]">
            Latest Works
          </h2>

          <p className="text-muted text-sm sm:text-base font-normal leading-relaxed mt-4 max-w-xl mx-auto">
            Production systems, autonomous AI agents, medical computer vision pipelines, and scalable architectures.
          </p>

          {/* Centered Filter Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-6">
            {[
              { id: 'ALL', label: 'All' },
              { id: 'genai', label: 'GenAI & Agents' },
              { id: 'ai_ml', label: 'Computer Vision & ML' },
              { id: 'backend', label: 'Clean Architecture' },
            ].map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => handleCategoryChange(cat.id)}
                className={`px-3.5 py-1 rounded-full text-xs font-medium border transition-colors cursor-pointer ${
                  activeCategory === cat.id
                    ? 'bg-foreground text-surface border-foreground'
                    : 'bg-surface text-muted border-border hover:text-foreground'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* 3-Column Aspect-[4/3] Image Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {visibleProjects.map((project) => {
            const imgSrc = project.imageUrl || getProjectFallbackImage(project);

            return (
              <Link
                key={project.id}
                to={`/projects/${project.id}`}
                className="group flex flex-col text-start"
              >
                {/* 4/3 Aspect Ratio Image Frame with Hover Dark Circle & Arrow */}
                <div className="relative aspect-[4/3] w-full rounded-lg overflow-hidden border border-border bg-surface-muted transition-colors">
                  <img
                    src={imgSrc}
                    alt={project.title}
                    loading="lazy"
                    className="w-full h-full object-cover object-top transition-transform duration-500 ease-out group-hover:scale-105"
                    onError={(e) => {
                      if (!e.currentTarget.dataset.fallbackTried) {
                        e.currentTarget.dataset.fallbackTried = 'true';
                        e.currentTarget.src = getProjectFallbackImage(project);
                      }
                    }}
                  />

                  {/* Hover Overlay: Dark Translucent Tint with Center Circle Arrow & Bottom Meta */}
                  <div className="absolute inset-0 flex flex-col justify-between p-4 bg-foreground/25 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div />
                    <div className="flex items-center justify-center">
                      <div className="w-12 h-12 rounded-full bg-foreground text-surface flex items-center justify-center transform scale-90 group-hover:scale-100 transition-transform duration-300">
                        <span className="inline-block rtl:-scale-x-100 text-lg leading-none" aria-hidden="true">↗</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-surface font-medium">
                      <span>Case Study</span>
                      <span>{project.repoUrl ? 'github.com ↗' : 'overview ↗'}</span>
                    </div>
                  </div>
                </div>

                {/* Caption Below the Card */}
                <div className="mt-3.5 flex flex-col gap-1">
                  <h3 className="text-sm font-normal text-foreground leading-snug line-clamp-2 group-hover:text-muted transition-colors">
                    {project.title}
                  </h3>

                  <span className="text-xs text-muted font-normal">
                    {project.categoryLabel || project.category}
                  </span>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Bottom "View More" Link per Screenshot 2 */}
        {hasMore && (
          <div className="mt-14 sm:mt-16 text-center">
            <button
              type="button"
              onClick={() => setDisplayCount(prev => prev + 6)}
              className="inline-flex items-center gap-2 text-sm font-medium text-foreground underline underline-offset-4 hover:text-muted transition-colors cursor-pointer"
            >
              <span>Check out More</span>
              <span className="inline-block rtl:-scale-x-100" aria-hidden="true">→</span>
              <span className="font-semibold">View More</span>
            </button>
          </div>
        )}

      </div>
    </section>
  );
});

Projects.displayName = 'Projects';

export default Projects;
