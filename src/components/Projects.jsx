import { useState, useMemo, memo } from 'react';
import { m } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  Terminal, ArrowRight, ChevronsLeft, ChevronsRight, Sparkles 
} from 'lucide-react';
import { useProjects } from '../hooks/useData';

const ITEMS_PER_PAGE = 6;

// High-resolution fallback illustrations matching tech domain if imageUrl is empty
const getProjectFallback = (project) => {
  const p = ((project.id || '') + ' ' + (project.title || '') + ' ' + (project.category || '')).toLowerCase();

  if (p.includes('thyrax') || p.includes('cancer') || p.includes('mri') || p.includes('tumour') || p.includes('medical')) {
    return 'https://res.cloudinary.com/iqldv0aa/image/upload/v1785270487/qkfmwtsyd6b2sooxe11d.png';
  }
  if (p.includes('erp') || p.includes('pos') || p.includes('clean') || p.includes('architecture') || p.includes('stockscan')) {
    return 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=900&q=80';
  }
  if (p.includes('rag') || p.includes('pageindex') || p.includes('vector') || p.includes('llm') || p.includes('genai')) {
    return 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=900&q=80';
  }
  if (p.includes('segmentation') || p.includes('wsss') || p.includes('vision') || p.includes('cv')) {
    return 'https://images.unsplash.com/photo-1507413245164-6160d8298b31?auto=format&fit=crop&w=900&q=80';
  }
  if (p.includes('structural') || p.includes('iot') || p.includes('health') || p.includes('sensor')) {
    return 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=900&q=80';
  }
  if (p.includes('customer') || p.includes('analytics') || p.includes('k-means')) {
    return 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=900&q=80';
  }
  return 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=900&q=80';
};

const Projects = memo(() => {
  const { projects, isLoading } = useProjects();
  const [currentPage, setCurrentPage] = useState(1);
  const [activeCategory, setActiveCategory] = useState('ALL');

  // Filtered projects
  const filteredProjects = useMemo(() => {
    if (activeCategory === 'ALL') return projects;
    return projects.filter(p => p.category === activeCategory);
  }, [projects, activeCategory]);

  // Pagination calculation
  const totalPages = Math.max(1, Math.ceil(filteredProjects.length / ITEMS_PER_PAGE));
  const currentProjects = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredProjects.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredProjects, currentPage]);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      const element = document.getElementById('projects');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  return (
    <section id="projects" className="py-28 md:py-36 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Header matching requested screenshot */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 md:mb-16">
          <div>
            <div className="mb-2">
              <h2 className="text-3xl md:text-5xl font-black tracking-tight uppercase">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-fuchsia-400 to-purple-300">
                  All
                </span>{' '}
                <span className="text-cyan-400">
                  projects
                </span>
              </h2>
            </div>
            <p className="text-slate-400 text-sm md:text-base font-normal max-w-xl">
              A collection of my recent work and technical projects.
            </p>
          </div>

          {/* Action button in top right as in screenshot */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                setActiveCategory('ALL');
                setCurrentPage(1);
              }}
              className="px-5 py-2.5 rounded-xl border border-purple-500/40 bg-[#1c1132] hover:bg-[#281846] text-white font-bold text-xs flex items-center gap-2 shadow-[0_0_20px_rgba(168,85,247,0.2)] transition-all cursor-pointer"
            >
              <span>All Projects</span>
              <ArrowRight size={14} className="text-purple-400" />
            </button>
          </div>
        </div>

        {/* 3-Column Cards Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-7">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div 
                key={i} 
                className="h-[430px] rounded-2xl bg-slate-900/40 border border-purple-500/20 p-6 flex flex-col justify-between animate-pulse"
              >
                <div className="w-full h-48 bg-white/5 rounded-xl" />
                <div className="space-y-3 mt-4 flex-1">
                  <div className="h-6 w-3/4 bg-white/5 rounded-lg" />
                  <div className="h-4 w-full bg-white/5 rounded-lg" />
                  <div className="h-4 w-2/3 bg-white/5 rounded-lg" />
                </div>
                <div className="h-10 w-full bg-white/5 rounded-xl mt-4" />
              </div>
            ))}
          </div>
        ) : filteredProjects.length === 0 ? (
          <div className="text-center py-24 bg-slate-900/40 border border-slate-800/80 rounded-3xl backdrop-blur-xl">
            <Sparkles className="w-10 h-10 text-purple-400/60 mx-auto mb-3" />
            <p className="text-slate-400 font-medium">No projects found in this category.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-7">
            {currentProjects.map((project) => {
              const imageSrc = project.imageUrl || project.image || getProjectFallback(project);
              const projectLink = `/projects/${project.id}`;

              return (
                <m.div
                  key={project.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-40px' }}
                  transition={{ duration: 0.4 }}
                  className="group relative flex flex-col rounded-2xl bg-[#0c081e]/90 hover:bg-[#0f0a26] border border-purple-500/30 hover:border-purple-400/80 transition-all duration-300 overflow-hidden shadow-lg hover:shadow-[0_0_35px_rgba(168,85,247,0.25)] h-full"
                >
                  {/* Top Image Banner */}
                  <Link to={projectLink} className="relative w-full h-48 sm:h-52 overflow-hidden bg-slate-950/80 border-b border-purple-500/10 block cursor-pointer">
                    <img
                      src={imageSrc}
                      alt={project.title}
                      loading="lazy"
                      className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                      onError={(e) => {
                        e.target.src = getProjectFallback(project);
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0c081e] via-transparent to-transparent opacity-60" />
                  </Link>

                  {/* Card Content */}
                  <div className="p-5 md:p-6 flex flex-col flex-1 justify-between">
                    <div>
                      <Link to={projectLink} className="block group/title">
                        <h3 className="text-base md:text-lg font-bold text-white line-clamp-2 leading-snug group-hover/title:text-purple-300 transition-colors mb-2">
                          {project.title}
                        </h3>
                      </Link>
                      <p className="text-xs md:text-sm text-slate-400 font-normal leading-relaxed line-clamp-3 mb-5">
                        {project.description || project.summary}
                      </p>
                    </div>

                    {/* Details Button - ONLY appears on hover with smooth slide & fade */}
                    <div className="pt-2">
                      <Link
                        to={projectLink}
                        className="w-full py-2.5 px-4 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs md:text-sm shadow-[0_0_20px_rgba(147,51,234,0.35)] flex items-center justify-center gap-2 cursor-pointer transition-all duration-300 opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto translate-y-2 group-hover:translate-y-0"
                      >
                        Details
                      </Link>
                    </div>
                  </div>
                </m.div>
              );
            })}
          </div>
        )}

        {/* Pagination Section (Exact design from Screenshot 2) */}
        {!isLoading && totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-12 md:mt-16">
            {/* Previous Button */}
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              aria-label="Previous Page"
              className="w-10 h-10 rounded-lg flex items-center justify-center font-bold text-sm bg-slate-800/80 hover:bg-slate-700 text-slate-300 border border-slate-700/60 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
            >
              <ChevronsLeft size={16} />
            </button>

            {/* Numbered Page Buttons */}
            {Array.from({ length: totalPages }, (_, idx) => {
              const pageNum = idx + 1;
              const isActive = pageNum === currentPage;

              return (
                <button
                  key={pageNum}
                  onClick={() => handlePageChange(pageNum)}
                  className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold text-sm transition-all cursor-pointer ${
                    isActive
                      ? 'bg-purple-600 text-white shadow-[0_0_15px_rgba(168,85,247,0.45)] border border-purple-500'
                      : 'bg-[#e2e8f0] text-slate-900 hover:bg-white font-bold'
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}

            {/* Next Button */}
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              aria-label="Next Page"
              className="w-10 h-10 rounded-lg flex items-center justify-center font-bold text-sm bg-[#e2e8f0] text-slate-900 hover:bg-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
            >
              <ChevronsRight size={16} />
            </button>
          </div>
        )}
      </div>
    </section>
  );
});

Projects.displayName = 'Projects';
export default Projects;
