import { useState, useMemo, useEffect } from 'react';
import { useProjects } from '../../hooks/useData';
import { useAdminCrud } from '../../hooks/useAdminCrud';
import { 
  Plus, Edit2, Trash2, ExternalLink, Search, Tag, 
  Layers, CheckCircle, BarChart3, FileText, Globe 
} from 'lucide-react';
import ImageUpload from '../../components/admin/ImageUpload';
import { 
  Button, Input, Textarea, Select, Field, Card, 
  Modal, ConfirmDialog, Alert, LoadingState, EmptyState 
} from '../../components/admin/ui';

const CATEGORY_OPTIONS = [
  { id: 'genai', label: 'GenAI & Agents' },
  { id: 'ai_ml', label: 'Computer Vision & ML' },
  { id: 'backend', label: 'Clean Architecture' },
  { id: 'nlp', label: 'NLP' },
  { id: 'cv', label: 'Computer Vision' },
  { id: 'dl', label: 'Deep Learning' },
];

const ManageProjects = () => {
  const { projects, isLoading, mutate } = useProjects();
  const crud = useAdminCrud({
    endpoint: '/api/projects',
    mutate,
    entityName: 'Project',
  });

  const [search, setSearch] = useState('');

  // Form State
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('genai');
  const [categoryLabel, setCategoryLabel] = useState('');
  const [badge, setBadge] = useState('');
  const [order, setOrder] = useState(0);
  const [summary, setSummary] = useState('');
  const [tagsInput, setTagsInput] = useState('');
  const [repoUrl, setRepoUrl] = useState('');
  const [liveUrl, setLiveUrl] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [problem, setProblem] = useState('');
  const [approach, setApproach] = useState('');
  const [result, setResult] = useState('');
  const [metrics, setMetrics] = useState([
    { label: '', value: '' },
    { label: '', value: '' },
    { label: '', value: '' },
  ]);

  // Populate form when editing or resetting
  useEffect(() => {
    if (crud.editingItem) {
      const p = crud.editingItem;
      setTitle(p.title || '');
      setCategory(p.category || 'genai');
      setCategoryLabel(p.categoryLabel || '');
      setBadge(p.badge || '');
      setOrder(p.order ?? 0);
      setSummary(p.summary || p.description || '');
      setTagsInput(Array.isArray(p.tags) ? p.tags.join(', ') : '');
      setRepoUrl(p.repoUrl || '');
      setLiveUrl(p.liveUrl || '');
      setImageUrl(p.imageUrl || p.image || '');

      const cs = p.caseStudy || {};
      setProblem(cs.problem || '');
      setApproach(cs.approach || '');
      setResult(cs.result || '');

      if (Array.isArray(p.metrics) && p.metrics.length > 0) {
        setMetrics(p.metrics.map(m => ({ label: m.label || '', value: m.value || '' })));
      } else {
        setMetrics([
          { label: '', value: '' },
          { label: '', value: '' },
          { label: '', value: '' },
        ]);
      }
    } else {
      setTitle('');
      setCategory('genai');
      setCategoryLabel('');
      setBadge('');
      setOrder(projects.length);
      setSummary('');
      setTagsInput('');
      setRepoUrl('');
      setLiveUrl('');
      setImageUrl('');
      setProblem('');
      setApproach('');
      setResult('');
      setMetrics([
        { label: '', value: '' },
        { label: '', value: '' },
        { label: '', value: '' },
      ]);
    }
  }, [crud.editingItem, projects.length]);

  const handleMetricChange = (index, field, value) => {
    setMetrics(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const handleAddMetric = () => {
    setMetrics(prev => [...prev, { label: '', value: '' }]);
  };

  const handleRemoveMetric = (index) => {
    setMetrics(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const tagsArray = tagsInput
      .split(',')
      .map(t => t.trim())
      .filter(Boolean);

    const cleanMetrics = metrics.filter(m => m.label.trim() || m.value.trim());

    const payload = {
      title,
      summary,
      description: summary,
      category,
      categoryLabel: categoryLabel || undefined,
      badge: badge || undefined,
      order: Number(order) || 0,
      tags: tagsArray,
      repoUrl,
      liveUrl,
      imageUrl,
      metrics: cleanMetrics,
      caseStudy: {
        problem,
        approach,
        result,
        stack: tagsArray,
      },
    };

    await crud.saveItem(payload);
  };

  // Filter projects by search query
  const filteredProjects = useMemo(() => {
    if (!search.trim()) return projects;
    const q = search.toLowerCase();
    return projects.filter(p => 
      p.title?.toLowerCase().includes(q) ||
      p.category?.toLowerCase().includes(q) ||
      p.categoryLabel?.toLowerCase().includes(q) ||
      p.tags?.some(t => t.toLowerCase().includes(q))
    );
  }, [projects, search]);

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-foreground">Projects Manager</h2>
          <p className="text-sm text-muted">
            Manage public portfolio works, case study narratives, metrics, and deployments.
          </p>
        </div>

        <Button variant="primary" onClick={crud.openCreate}>
          <Plus size={16} />
          <span>New project</span>
        </Button>
      </div>

      {crud.success && <Alert type="success" message={crud.success} />}
      {crud.error && <Alert type="error" message={crud.error} />}

      {/* Filter and Search Bar */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search projects..."
            className="pl-9"
          />
        </div>
        <span className="text-xs text-muted">
          {filteredProjects.length} {filteredProjects.length === 1 ? 'project' : 'projects'}
        </span>
      </div>

      {/* Projects List Table */}
      {isLoading ? (
        <LoadingState message="Loading projects..." />
      ) : filteredProjects.length === 0 ? (
        <EmptyState
          title="No projects found"
          description={search ? 'No projects match your search.' : 'Add your first project to display it on the public site.'}
          action={
            <Button variant="secondary" onClick={crud.openCreate}>
              <Plus size={15} /> Add project
            </Button>
          }
        />
      ) : (
        <div className="border border-border rounded-lg bg-surface overflow-hidden">
          <div className="divide-y divide-border">
            {filteredProjects.map((project) => {
              const id = project.id || project._id;
              const tags = Array.isArray(project.tags) ? project.tags : [];

              return (
                <div
                  key={id}
                  className="p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:bg-surface-muted/40 transition-colors"
                >
                  <div className="flex items-start gap-4 min-w-0">
                    {/* Thumbnail */}
                    <div className="w-16 h-12 rounded-lg border border-border bg-surface-muted overflow-hidden shrink-0">
                      {(project.imageUrl || project.image) ? (
                        <img
                          src={project.imageUrl || project.image}
                          alt=""
                          className="w-full h-full object-cover object-top"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-muted text-xs">
                          No img
                        </div>
                      )}
                    </div>

                    {/* Meta */}
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="text-sm font-medium text-foreground truncate max-w-md">
                          {project.title}
                        </h3>
                        {project.badge && (
                          <span className="text-[10px] uppercase font-medium px-2 py-0.5 rounded-full border border-border bg-surface-muted text-muted">
                            {project.badge}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2 mt-1 flex-wrap text-xs text-muted">
                        <span>{project.categoryLabel || project.category}</span>
                        {project.order !== undefined && (
                          <>
                            <span>•</span>
                            <span>Order: {project.order}</span>
                          </>
                        )}
                        {project.liveUrl && (
                          <>
                            <span>•</span>
                            <a
                              href={project.liveUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 hover:text-foreground"
                            >
                              <span>Demo</span>
                              <ExternalLink size={10} className="rtl:-scale-x-100" />
                            </a>
                          </>
                        )}
                        {project.repoUrl && (
                          <>
                            <span>•</span>
                            <a
                              href={project.repoUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 hover:text-foreground"
                            >
                              <span>Repo</span>
                              <ExternalLink size={10} className="rtl:-scale-x-100" />
                            </a>
                          </>
                        )}
                      </div>

                      {tags.length > 0 && (
                        <div className="flex items-center gap-1.5 mt-2 flex-wrap">
                          {tags.slice(0, 5).map((tag, i) => (
                            <span
                              key={i}
                              className="text-[11px] px-2 py-0.5 rounded-full border border-border/80 bg-surface text-muted"
                            >
                              {tag}
                            </span>
                          ))}
                          {tags.length > 5 && (
                            <span className="text-[10px] text-muted">+{tags.length - 5}</span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => crud.openEdit(project)}
                    >
                      <Edit2 size={13} />
                      <span>Edit</span>
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => crud.requestDelete(project)}
                    >
                      <Trash2 size={13} />
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Edit / Create Project Modal */}
      <Modal
        isOpen={crud.isModalOpen}
        onClose={crud.closeModal}
        title={crud.editingId ? 'Edit project' : 'Create new project'}
        maxWidth="max-w-2xl"
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Section: Overview */}
          <div className="space-y-4">
            <h4 className="text-xs uppercase font-medium tracking-wider text-muted border-b border-border pb-1">
              Basic information
            </h4>

            <Field label="Project title" required>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. ThyraX — Thyroid Cancer Clinical Decision Support"
                required
              />
            </Field>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <Field label="Category" required>
                <Select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  required
                >
                  {CATEGORY_OPTIONS.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.label} ({c.id})
                    </option>
                  ))}
                </Select>
              </Field>

              <Field label="Category label" hint="Shown on card caption">
                <Input
                  value={categoryLabel}
                  onChange={(e) => setCategoryLabel(e.target.value)}
                  placeholder="e.g. Medical AI & Computer Vision"
                />
              </Field>

              <Field label="Display order" hint="Numerical order (0 first)">
                <Input
                  type="number"
                  value={order}
                  onChange={(e) => setOrder(e.target.value)}
                />
              </Field>
            </div>

            <Field label="Badge pill" hint="Optional uppercase label, e.g. CAPSTONE EXCELLENCE">
              <Input
                value={badge}
                onChange={(e) => setBadge(e.target.value)}
                placeholder="e.g. MULTI-AGENT WORKFLOW"
              />
            </Field>

            <Field label="Summary / Short description" hint="Displayed on project cards and details header">
              <Textarea
                rows={3}
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                placeholder="Brief summary of the architecture, approach, and impact..."
              />
            </Field>
          </div>

          {/* Section: Cover & Media */}
          <div className="space-y-4">
            <h4 className="text-xs uppercase font-medium tracking-wider text-muted border-b border-border pb-1">
              Cover image &amp; URLs
            </h4>

            <ImageUpload
              label="Project cover image (4:3 aspect ratio recommended)"
              value={imageUrl}
              onUploadComplete={setImageUrl}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Field label="Repository URL (GitHub)">
                <Input
                  type="url"
                  value={repoUrl}
                  onChange={(e) => setRepoUrl(e.target.value)}
                  placeholder="https://github.com/amerelfalwo/..."
                />
              </Field>

              <Field label="Live deployment URL">
                <Input
                  type="url"
                  value={liveUrl}
                  onChange={(e) => setLiveUrl(e.target.value)}
                  placeholder="https://..."
                />
              </Field>
            </div>

            <Field label="Technologies / Tech stack" hint="Comma-separated tools and frameworks">
              <Input
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                placeholder="Python, PyTorch, LangGraph, FastAPI, Docker"
              />
            </Field>
          </div>

          {/* Section: Key Facts / Metrics */}
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-border pb-1">
              <h4 className="text-xs uppercase font-medium tracking-wider text-muted">
                Key facts &amp; metrics
              </h4>
              <button
                type="button"
                onClick={handleAddMetric}
                className="text-xs text-muted hover:text-foreground transition-colors cursor-pointer"
              >
                + Add metric
              </button>
            </div>

            <div className="space-y-2">
              {metrics.map((m, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <Input
                    placeholder="Metric label (e.g. Recall Latency)"
                    value={m.label}
                    onChange={(e) => handleMetricChange(idx, 'label', e.target.value)}
                    className="flex-1"
                  />
                  <Input
                    placeholder="Value (e.g. <35ms)"
                    value={m.value}
                    onChange={(e) => handleMetricChange(idx, 'value', e.target.value)}
                    className="flex-1"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveMetric(idx)}
                    className="p-2 text-muted hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors cursor-pointer"
                    title="Remove metric"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Section: 3-Part Case Study */}
          <div className="space-y-4">
            <h4 className="text-xs uppercase font-medium tracking-wider text-muted border-b border-border pb-1">
              Case study narrative (/projects/:id)
            </h4>

            <Field label="The problem">
              <Textarea
                rows={3}
                value={problem}
                onChange={(e) => setProblem(e.target.value)}
                placeholder="Describe the architectural challenge, latency limit, or data bottleneck..."
              />
            </Field>

            <Field label="The approach">
              <Textarea
                rows={3}
                value={approach}
                onChange={(e) => setApproach(e.target.value)}
                placeholder="Describe the technical solution, orchestration, and algorithms used..."
              />
            </Field>

            <Field label="The outcome / Result">
              <Textarea
                rows={3}
                value={result}
                onChange={(e) => setResult(e.target.value)}
                placeholder="Quantifiable outcome, benchmarks achieved, or production deployment status..."
              />
            </Field>
          </div>

          {/* Dialog Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
            <Button variant="secondary" onClick={crud.closeModal} disabled={crud.saving}>
              Cancel
            </Button>
            <Button variant="primary" type="submit" disabled={crud.saving}>
              {crud.saving ? 'Saving project...' : crud.editingId ? 'Save changes' : 'Create project'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={crud.isDeleteOpen}
        onClose={crud.cancelDelete}
        onConfirm={crud.confirmDelete}
        title="Delete project"
        message={`Are you sure you want to delete "${crud.deleteTarget?.title}"? This will remove it from the public portfolio.`}
        loading={crud.deleting}
      />
    </div>
  );
};

export default ManageProjects;
