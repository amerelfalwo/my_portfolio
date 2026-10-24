import { useEffect, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ExternalLink } from 'lucide-react';
import { useProjects } from '../hooks/useData';
import { projects as fallbackProjects } from '../data/projects';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

// Fallback image helper matching tech domain if no imageUrl provided
const getProjectFallback = (project) => {
  const p = ((project?.id || '') + ' ' + (project?.title || '') + ' ' + (project?.category || '')).toLowerCase();

  if (p.includes('mnemos') || p.includes('agentic_memory') || p.includes('cognitive memory')) return '/images/projects/mnemos.webp';
  if (p.includes('sql-llm') || p.includes('text-to-sql') || p.includes('lora')) return '/images/projects/sql-llm.webp';
  if (p.includes('graph') || p.includes('graphrag') || p.includes('knowledge graph')) return '/images/projects/graphrag.webp';
  if (p.includes('langgraph') || p.includes('multiagent') || p.includes('multi-agent')) return '/images/projects/langgraph-agent.webp';
  if (p.includes('crew') || p.includes('procurement') || p.includes('search_agent')) return '/images/projects/crew-procurement.webp';
  if (p.includes('phishing') || p.includes('simulation') || p.includes('cybersecurity')) return '/images/projects/phishing-simulator.webp';
  if (p.includes('sentiment') || p.includes('review') || p.includes('semantic_analysis')) return '/images/projects/sentiment-analyzer.webp';
  if (p.includes('cv-inference') || p.includes('depi_back') || p.includes('yolo') || p.includes('vehicle') || p.includes('traffic')) return '/images/projects/cv-yolo.webp';
  if (p.includes('thyrax') || p.includes('cancer')) return '/images/projects/thyrax.webp';
  if (p.includes('mri') || p.includes('tumour')) return '/images/projects/brain-tumour.webp';
  if (p.includes('segmentation') || p.includes('wsss')) return '/images/projects/wsss.webp';
  if (p.includes('structural') || p.includes('sensor')) return '/images/projects/structural.webp';
  if (p.includes('medical') || p.includes('report')) return '/images/projects/medical-report.webp';
  if (p.includes('customer') || p.includes('analytics')) return '/images/projects/customer-segmentation.webp';
  return '/images/projects/project-placeholder.webp';
};

const ProjectDetails = () => {
  const { id } = useParams();
  const { projects: apiProjects, isLoading } = useProjects();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  const MONGO_ID_ORDER = [
  '6ad9ac7eb1b2b6ec8a3d9936',
  '6ad9ac7eb1b2b6ec8a3d9937',
  '6ad9ac7eb1b2b6ec8a3d9938',
  '6ad9ac7eb1b2b6ec8a3d9939',
  '6ad9ac7eb1b2b6ec8a3d993a',
  '6ad9ac7eb1b2b6ec8a3d993b',
  '6ad9ac7eb1b2b6ec8a3d993c',
  '6ad9ac7eb1b2b6ec8a3d993d',
  '6ad9ac7eb1b2b6ec8a3d993e',
  '6ad9ac7eb1b2b6ec8a3d993f',
  '6ad9ac7eb1b2b6ec8a3d9940',
  '6ad9ac7eb1b2b6ec8a3d9941',
  '6ad9ac7eb1b2b6ec8a3d9942',
  '6ad9ac7eb1b2b6ec8a3d9943',
  '6ad9ac7eb1b2b6ec8a3d9944',
  '6ad9ac7eb1b2b6ec8a3d9945',
  '6ad9ac7eb1b2b6ec8a3d9946',
  '6ad9ac7eb1b2b6ec8a3d9947',
  '6ad9ac7eb1b2b6ec8a3d9948',
];

// Find project dynamically from API data or static fallback data
  const project = useMemo(() => {
    if (!id) return null;
    const pool = (apiProjects && apiProjects.length > 0) ? apiProjects : fallbackProjects;

    // 1. Direct match by id, _id, or title slug in active pool
    let match = pool.find(p =>
      p.id === id ||
      p._id === id ||
      p.title?.toLowerCase().replace(/[^a-z0-9]+/g, '-') === id
    );

    // 2. Fallback to static list if not found in active pool
    if (!match && pool !== fallbackProjects) {
      match = fallbackProjects.find(p =>
        p.id === id ||
        p._id === id ||
        p.title?.toLowerCase().replace(/[^a-z0-9]+/g, '-') === id
      );
    }

    // 3. Fallback match by MongoDB ID index in fallbackProjects
    if (!match) {
      const mongoIdx = MONGO_ID_ORDER.indexOf(id.toLowerCase());
      if (mongoIdx !== -1 && fallbackProjects[mongoIdx]) {
        match = fallbackProjects[mongoIdx];
      }
    }

    // 4. Keyword/fuzzy title match
    if (!match) {
      match = pool.find(p => p.title?.toLowerCase().includes(id.toLowerCase())) ||
              fallbackProjects.find(p => p.title?.toLowerCase().includes(id.toLowerCase()));
    }

    if (!match) return null;

    return {
      ...match,
      tags: match.tags || match.caseStudy?.stack || match.techStack || []
    };
  }, [id, apiProjects]);

  if (!project && isLoading) {
    return (
      <div className="min-h-screen bg-background text-foreground flex flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center pt-24 pb-16">
          <p className="text-sm text-muted">Loading project details…</p>
        </main>
        <Footer />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-background text-foreground flex flex-col">
        <Navbar />
        <main className="flex-1 flex flex-col items-center justify-center text-center px-4 pt-28 pb-20">
          <h1 className="text-3xl md:text-4xl font-light text-foreground tracking-tight mb-3">
            Project not found
          </h1>
          <p className="text-sm text-muted max-w-md mb-8">
            The project you are looking for does not exist or has been moved.
          </p>
          <Link
            to="/#projects"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-foreground text-surface text-sm font-medium hover:opacity-90 transition-opacity"
          >
            <span className="inline-block rtl:-scale-x-100" aria-hidden="true">←</span>
            <span>Back to projects</span>
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  const rawImg = (project.imageUrl || project.image || '').trim();
  const imageSrc = rawImg || getProjectFallback(project);
  const techStack = Array.isArray(project.tags) ? project.tags : [];
  const metrics = Array.isArray(project.metrics) ? project.metrics : [];
  const caseStudy = project.caseStudy || null;

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans selection:bg-foreground/10">
      <Navbar />

      <main className="flex-1 pt-24 sm:pt-28 pb-20">
        <div className="page-container">

          {/* Simple text link: ← Back to projects */}
          <div className="mb-8">
            <Link
              to="/#projects"
              className="inline-flex items-center gap-2 text-sm text-muted hover:text-foreground transition-colors"
            >
              <span className="inline-block rtl:-scale-x-100" aria-hidden="true">←</span>
              <span>Back to projects</span>
            </Link>
          </div>

          {/* Category & Badge Tags */}
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <span className="rounded-full border border-border bg-surface px-3 py-1 text-xs text-muted font-normal">
              {project.categoryLabel || project.category || 'Engineering project'}
            </span>
            {project.badge && (
              <span className="rounded-full border border-border bg-surface px-3 py-1 text-xs text-muted font-normal">
                {project.badge}
              </span>
            )}
          </div>

          {/* Title: sentence case, text-4xl md:text-5xl font-light tracking-tight */}
          <h1 className="text-4xl md:text-5xl font-light tracking-tight text-foreground max-w-4xl leading-[1.15] mb-5">
            {project.title}
          </h1>

          {/* Description */}
          <p className="text-base text-muted max-w-2xl leading-relaxed mb-8">
            {project.description || project.summary}
          </p>

          {/* Action Buttons: Live Demo & View Source */}
          <div className="flex flex-wrap items-center gap-3 mb-10">
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full bg-foreground text-surface px-5 py-2.5 text-sm font-medium hover:opacity-90 transition-opacity inline-flex items-center gap-2"
              >
                <span>Live deployment</span>
                <ExternalLink size={14} className="rtl:-scale-x-100" aria-hidden="true" />
              </a>
            )}

            {project.repoUrl && (
              <a
                href={project.repoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full border border-border bg-surface px-5 py-2.5 text-sm font-medium text-foreground hover:bg-surface-muted transition-colors inline-flex items-center gap-2"
              >
                <span>View source</span>
                <ExternalLink size={14} className="rtl:-scale-x-100" aria-hidden="true" />
              </a>
            )}
          </div>

          {/* Cover image: aspect-[16/9] rounded-lg border border-border */}
          <div className="aspect-[16/9] w-full rounded-lg border border-border overflow-hidden bg-surface-muted mb-12">
            <img
              src={imageSrc}
              alt={project.title}
              className="w-full h-full object-cover object-top"
              onError={(e) => {
                if (!e.currentTarget.dataset.fallbackTried) {
                  e.currentTarget.dataset.fallbackTried = 'true';
                  e.currentTarget.src = getProjectFallback(project);
                }
              }}
            />
          </div>

          {/* Key Facts / Metrics Definition Grid */}
          {metrics.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 py-8 border-y border-border mb-12">
              {metrics.map((metric, idx) => (
                <div key={idx} className="flex flex-col gap-1 text-start">
                  <span className="text-sm text-muted font-normal">{metric.label}</span>
                  <span className="text-base text-foreground font-medium">{metric.value}</span>
                </div>
              ))}
            </div>
          )}

          {/* Case Study Blocks: three plain blocks separated by border-t border-border */}
          {caseStudy && (caseStudy.problem || caseStudy.approach || caseStudy.result) && (
            <div className="space-y-0 mb-12">
              {caseStudy.problem && (
                <div className="py-8 border-t border-border text-start">
                  <h2 className="text-lg font-medium text-foreground mb-3">
                    The problem
                  </h2>
                  <p className="text-base text-muted leading-relaxed max-w-3xl">
                    {caseStudy.problem}
                  </p>
                </div>
              )}

              {caseStudy.approach && (
                <div className="py-8 border-t border-border text-start">
                  <h2 className="text-lg font-medium text-foreground mb-3">
                    The approach
                  </h2>
                  <p className="text-base text-muted leading-relaxed max-w-3xl">
                    {caseStudy.approach}
                  </p>
                </div>
              )}

              {caseStudy.result && (
                <div className="py-8 border-t border-border text-start">
                  <h2 className="text-lg font-medium text-foreground mb-3">
                    The outcome
                  </h2>
                  <p className="text-base text-muted leading-relaxed max-w-3xl">
                    {caseStudy.result}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Technologies: neutral chips (same style as Skills chips, text only) */}
          {techStack.length > 0 && (
            <div className="py-8 border-t border-border text-start mb-8">
              <h2 className="text-lg font-medium text-foreground mb-4">
                Technologies
              </h2>
              <div className="flex flex-wrap gap-2">
                {techStack.map((tech, idx) => (
                  <span
                    key={idx}
                    className="rounded-full border border-border bg-surface px-3 py-1 text-xs text-muted font-normal"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Bottom CTA: flat block, bg-surface-muted rounded-lg, centered */}
          <div className="rounded-lg bg-surface-muted border border-border/60 p-8 sm:p-12 text-center mt-12 mb-6">
            <h3 className="text-2xl sm:text-3xl font-light text-foreground tracking-tight mb-3">
              Interested in building something similar?
            </h3>
            <p className="text-sm sm:text-base text-muted max-w-xl mx-auto mb-6">
              Let's discuss how deep learning pipelines, RAG systems, or robust software architectures can empower your product.
            </p>
            <a
              href="/#contact"
              className="inline-flex items-center gap-1.5 px-6 py-2.5 rounded-full bg-foreground text-surface text-sm font-medium hover:opacity-90 transition-opacity"
            >
              <span>Get in touch</span>
              <span className="inline-block rtl:-scale-x-100" aria-hidden="true">↗</span>
            </a>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ProjectDetails;
