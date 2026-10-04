import { useEffect, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { m } from 'framer-motion';
import { 
  ArrowLeft, ExternalLink, Github, Terminal, Layers, 
  CheckCircle2, Sparkles, Cpu, Shield, ArrowUpRight,
  Database, Calendar, Code2
} from 'lucide-react';
import { useProjects } from '../hooks/useData';
import GlobalBackground from '../components/GlobalBackground';
import Footer from '../components/Footer';

// Fallback images matching tech domain if no imageUrl provided
const getProjectFallback = (project) => {
  const p = ((project?.id || '') + ' ' + (project?.title || '') + ' ' + (project?.category || '')).toLowerCase();

  if (p.includes('thyrax') || p.includes('cancer')) return '/images/projects/thyrax.webp';
  if (p.includes('mri') || p.includes('tumour')) return '/images/projects/brain-tumour.webp';
  if (p.includes('erp') || p.includes('clean') || p.includes('architecture')) return '/images/projects/aura.webp';
  if (p.includes('pageindex') || p.includes('rag') || p.includes('search')) return '/images/projects/vision.webp';
  if (p.includes('segmentation') || p.includes('wsss')) return '/images/projects/wsss.webp';
  if (p.includes('structural') || p.includes('sensor')) return '/images/projects/structural.webp';
  if (p.includes('vector') || p.includes('postgres')) return '/images/projects/edge.webp';
  if (p.includes('medical') || p.includes('report')) return '/images/projects/medical-report.webp';
  if (p.includes('customer') || p.includes('analytics')) return '/images/projects/customer-segmentation.webp';
  return '/images/projects/project-placeholder.webp';
};

const ProjectDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { projects: apiProjects, isLoading } = useProjects();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  // Find project dynamically from API data
  const project = useMemo(() => {
    if (!id || !apiProjects || apiProjects.length === 0) return null;

    // 1. Direct ID or slug match from API
    const match = apiProjects.find(p => 
      p.id === id || 
      p._id === id || 
      p.title?.toLowerCase().replace(/[^a-z0-9]+/g, '-') === id
    );

    if (match) {
      return {
        ...match,
        tags: match.tags || match.caseStudy?.stack || match.techStack || []
      };
    }

    // 2. Fallback search by title keyword
    const fuzzy = apiProjects.find(p => p.title?.toLowerCase().includes(id.toLowerCase()));
    if (fuzzy) {
      return {
        ...fuzzy,
        tags: fuzzy.tags || fuzzy.caseStudy?.stack || fuzzy.techStack || []
      };
    }

    return null;
  }, [id, apiProjects]);

  if (!project && isLoading) {
    return (
      <div className="min-h-screen bg-[#06060e] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-purple-500/30 border-t-purple-400 rounded-full animate-spin" />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-[#06060e] text-white flex flex-col items-center justify-center p-6">
        <GlobalBackground />
        <h2 className="text-3xl font-black mb-4">Project Not Found</h2>
        <p className="text-slate-400 mb-8">The project you are looking for does not exist or was moved.</p>
        <Link
          to="/"
          className="px-6 py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-sm transition-all"
        >
          Return to Portfolio
        </Link>
      </div>
    );
  }

  const rawImg = (project?.imageUrl || project?.image || '').trim();
  const imageSrc = rawImg || getProjectFallback(project);
  const techStack = project.tags || project.caseStudy?.stack || [];

  return (
    <div className="relative min-h-screen bg-[#06060e] text-slate-100 overflow-x-hidden selection:bg-purple-500/30 font-sans">
      <GlobalBackground />

      {/* ── Top Header Navigation Bar ── */}
      <header className="sticky top-0 z-50 bg-[#06060e]/80 backdrop-blur-2xl border-b border-purple-500/10 px-6 md:px-12 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2.5 px-4 py-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-slate-300 hover:text-white transition-all text-xs font-bold uppercase tracking-wider cursor-pointer group"
          >
            <ArrowLeft size={16} className="text-purple-400 group-hover:-translate-x-1 transition-transform" />
            <span>Back to Projects</span>
          </button>

          <Link to="/" className="text-lg font-black tracking-widest uppercase text-white hover:text-purple-300 transition-colors">
            AMIR<span className="text-purple-400">.</span>AURA
          </Link>
        </div>
      </header>

      {/* ── Main Content Container ── */}
      <main className="relative z-10 max-w-5xl mx-auto px-6 py-12 md:py-20">
        
        {/* Category & Badge */}
        <div className="flex flex-wrap items-center gap-3 mb-6">
          <span className="px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 font-mono text-[11px] font-bold uppercase tracking-widest">
            {project.categoryLabel || project.category || 'Engineering Solution'}
          </span>
          {project.badge && (
            <span className="px-4 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 font-mono text-[11px] font-bold uppercase tracking-widest">
              {project.badge}
            </span>
          )}
        </div>

        {/* Project Title */}
        <m.h1 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-3xl md:text-5xl lg:text-6xl font-black tracking-tight text-white uppercase leading-tight mb-6"
        >
          {project.title}
        </m.h1>

        {/* Project Short Summary */}
        <m.p 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-slate-300 text-base md:text-xl font-medium leading-relaxed mb-8 max-w-3xl"
        >
          {project.description || project.summary}
        </m.p>

        {/* Action Buttons: Live Demo & GitHub */}
        <m.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="flex flex-wrap items-center gap-4 mb-12"
        >
          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-7 py-3.5 rounded-2xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs md:text-sm uppercase tracking-wider flex items-center gap-2.5 shadow-[0_0_25px_rgba(147,51,234,0.35)] hover:shadow-[0_0_35px_rgba(147,51,234,0.5)] hover:scale-105 transition-all cursor-pointer"
            >
              <span>Live Deployment</span>
              <ExternalLink size={16} />
            </a>
          )}

          {project.repoUrl && (
            <a
              href={project.repoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-7 py-3.5 rounded-2xl bg-slate-900/90 border border-purple-500/30 hover:border-cyan-400/50 text-white font-bold text-xs md:text-sm uppercase tracking-wider flex items-center gap-2.5 transition-all hover:scale-105 cursor-pointer shadow-lg"
            >
              <Github size={16} className="text-purple-400" />
              <span>Source Repository</span>
            </a>
          )}
        </m.div>

        {/* ── Hero Image / Preview Banner ── */}
        <m.div 
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="relative w-full rounded-3xl overflow-hidden bg-[#0c081e] border border-purple-500/40 shadow-[0_0_50px_rgba(168,85,247,0.25)] mb-16 group"
        >
          <img
            src={imageSrc}
            alt={project.title}
            className="w-full h-auto max-h-[560px] object-cover object-top transition-transform duration-700 group-hover:scale-[1.02]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#06060e] via-transparent to-transparent opacity-40 pointer-events-none" />
        </m.div>

        {/* ── Key Metrics Section (If Available) ── */}
        {Array.isArray(project.metrics) && project.metrics.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-16">
            {project.metrics.map((metric, idx) => (
              <div 
                key={idx}
                className="p-5 rounded-2xl bg-[#0c081e]/80 border border-purple-500/20 backdrop-blur-xl"
              >
                <p className="text-[10px] font-mono font-bold uppercase tracking-widest text-slate-400 mb-1">
                  {metric.label}
                </p>
                <p className="text-xl md:text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-300">
                  {metric.value}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* ── Comprehensive Case Study ── */}
        {project.caseStudy && (
          <div className="space-y-8 mb-16">
            <h2 className="text-2xl md:text-3xl font-black uppercase text-white tracking-tight flex items-center gap-3">
              <span className="h-6 w-1.5 bg-gradient-to-b from-purple-500 to-cyan-400 rounded-full" />
              <span>Engineering Architecture & Case Study</span>
            </h2>

            {project.caseStudy.problem && (
              <div className="p-6 md:p-8 rounded-3xl bg-[#0c081e]/90 border border-slate-800/80 hover:border-purple-500/30 transition-colors">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-400 animate-pulse" />
                  <h3 className="text-xs font-mono font-bold uppercase tracking-widest text-red-400">
                    The Problem & Technical Challenge
                  </h3>
                </div>
                <p className="text-slate-300 text-sm md:text-base leading-relaxed">
                  {project.caseStudy.problem}
                </p>
              </div>
            )}

            {project.caseStudy.approach && (
              <div className="p-6 md:p-8 rounded-3xl bg-[#0c081e]/90 border border-slate-800/80 hover:border-purple-500/30 transition-colors">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
                  <h3 className="text-xs font-mono font-bold uppercase tracking-widest text-cyan-400">
                    The Architectural Approach & Implementation
                  </h3>
                </div>
                <p className="text-slate-300 text-sm md:text-base leading-relaxed">
                  {project.caseStudy.approach}
                </p>
              </div>
            )}

            {project.caseStudy.result && (
              <div className="p-6 md:p-8 rounded-3xl bg-[#0c081e]/90 border border-slate-800/80 hover:border-purple-500/30 transition-colors">
                <div className="flex items-center gap-2 mb-3">
                  <CheckCircle2 size={16} className="text-emerald-400" />
                  <h3 className="text-xs font-mono font-bold uppercase tracking-widest text-emerald-400">
                    Production Outcomes & Benchmarks
                  </h3>
                </div>
                <p className="text-slate-300 text-sm md:text-base leading-relaxed">
                  {project.caseStudy.result}
                </p>
              </div>
            )}
          </div>
        )}

        {/* ── Technologies & Tools ── */}
        {techStack.length > 0 && (
          <div className="mb-20">
            <h2 className="text-2xl font-black uppercase text-white tracking-tight mb-4 flex items-center gap-3">
              <span className="h-6 w-1.5 bg-gradient-to-b from-purple-500 to-cyan-400 rounded-full" />
              <span>Technologies & Stack</span>
            </h2>
            <div className="flex flex-wrap gap-2.5">
              {techStack.map((tech, idx) => (
                <span
                  key={idx}
                  className="px-4 py-2 rounded-xl bg-[#0c081e] border border-purple-500/30 text-xs md:text-sm font-mono font-bold text-slate-200 shadow-sm"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* ── Bottom Call To Action ── */}
        <div className="p-8 md:p-12 rounded-3xl bg-gradient-to-br from-purple-950/40 via-[#0c081e] to-cyan-950/20 border border-purple-500/30 text-center relative overflow-hidden">
          <h3 className="text-2xl md:text-3xl font-black text-white uppercase mb-3">
            Interested in Building Something Similar?
          </h3>
          <p className="text-slate-400 text-sm md:text-base max-w-xl mx-auto mb-6">
            Let's discuss how deep learning pipelines, RAG systems, or robust software architectures can empower your product.
          </p>
          <a
            href="/#contact"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs uppercase tracking-widest shadow-[0_0_30px_rgba(147,51,234,0.3)] hover:scale-105 transition-all"
          >
            <span>Get In Touch</span>
            <ArrowUpRight size={16} />
          </a>
        </div>

      </main>

      <Footer />
    </div>
  );
};

export default ProjectDetails;
