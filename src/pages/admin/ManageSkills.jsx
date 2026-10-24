import { useState, useMemo, useEffect } from 'react';
import { Plus, Search, Edit2, Trash2, Sparkles, ExternalLink } from 'lucide-react';
import { useSkills } from '../../hooks/useData';
import { useAdminCrud } from '../../hooks/useAdminCrud';
import { getToolIconUrl } from '../../utils/getToolIcon';
import {
  Button,
  Input,
  Select,
  Field,
  Card,
  Modal,
  ConfirmDialog,
  Alert,
  LoadingState,
  EmptyState,
} from '../../components/admin/ui';

const CATEGORIES = [
  { value: 'ai_ml', label: 'AI, Deep Learning & CV' },
  { value: 'genai', label: 'Generative AI & Agentic Workflows' },
  { value: 'backend', label: 'Backend & Systems Engineering' },
  { value: 'frontend', label: 'Web & Frontend Development' },
  { value: 'devops', label: 'DevOps & Infrastructure' },
  { value: 'data_science', label: 'Data Science & Analytics' },
];

const POPULAR_SUGGESTIONS = [
  { name: 'PyTorch', category: 'ai_ml' },
  { name: 'TensorFlow', category: 'ai_ml' },
  { name: 'OpenCV', category: 'ai_ml' },
  { name: 'YOLO', category: 'ai_ml' },
  { name: 'MediaPipe', category: 'ai_ml' },
  { name: 'LangChain', category: 'genai' },
  { name: 'LangGraph', category: 'genai' },
  { name: 'LlamaIndex', category: 'genai' },
  { name: 'ChromaDB', category: 'genai' },
  { name: 'Hugging Face', category: 'genai' },
  { name: 'Python', category: 'backend' },
  { name: 'FastAPI', category: 'backend' },
  { name: 'C++', category: 'backend' },
  { name: 'PostgreSQL', category: 'backend' },
  { name: 'MongoDB', category: 'backend' },
  { name: 'Docker', category: 'devops' },
  { name: 'Linux', category: 'devops' },
  { name: 'Git', category: 'devops' },
  { name: 'React', category: 'frontend' },
  { name: 'Next.js', category: 'frontend' },
  { name: 'TypeScript', category: 'frontend' },
  { name: 'Tailwind CSS', category: 'frontend' },
];

function inferCategory(name) {
  if (!name) return 'backend';
  const clean = name.trim().toLowerCase();
  const match = POPULAR_SUGGESTIONS.find((s) => s.name.toLowerCase() === clean);
  if (match) return match.category;
  if (/torch|tensor|keras|cv|vision|opencv|yolo|segment|onnx/i.test(clean)) return 'ai_ml';
  if (/lang|llama|graph|rag|chroma|pinecone|gpt|agent|nlp/i.test(clean)) return 'genai';
  if (/react|next|vue|tailwind|css|html|frontend|script|ui/i.test(clean)) return 'frontend';
  if (/docker|kube|linux|git|aws|gcp|ci|cd|deploy/i.test(clean)) return 'devops';
  if (/pandas|numpy|scikit|sql|data|analytics/i.test(clean)) return 'data_science';
  return 'backend';
}

const INITIAL_FORM = {
  name: '',
  category: 'ai_ml',
  icon: '',
  level: '',
  context: '',
  importance: 1,
};

export default function ManageSkills() {
  const { skills, isLoading, mutate } = useSkills();
  const {
    isModalOpen,
    editingItem,
    deleteTarget,
    saving,
    deleting,
    error,
    success,
    openCreate,
    openEdit,
    closeModal,
    requestDelete,
    cancelDelete,
    saveItem,
    confirmDelete,
  } = useAdminCrud({ endpoint: '/api/skills', mutate, entityName: 'Skill' });

  const [form, setForm] = useState(INITIAL_FORM);
  const [filterCategory, setFilterCategory] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (editingItem) {
      setForm({
        name: editingItem.name || '',
        category: editingItem.category || 'ai_ml',
        icon: editingItem.icon || '',
        level: editingItem.level || '',
        context: editingItem.context || '',
        importance: editingItem.importance ?? 1,
      });
    } else {
      setForm(INITIAL_FORM);
    }
  }, [editingItem, isModalOpen]);

  const handleNameChange = (val) => {
    const autoCat = inferCategory(val);
    const autoIcon = getToolIconUrl(val) || '';
    setForm((prev) => ({
      ...prev,
      name: val,
      category: prev.category === 'ai_ml' && val.trim() ? autoCat : prev.category,
      icon: !prev.icon || prev.icon.includes('devicon') || prev.icon.includes('simpleicons') ? autoIcon : prev.icon,
    }));
  };

  const handleAutoResolveIcon = () => {
    if (!form.name.trim()) return;
    const resolved = getToolIconUrl(form.name);
    if (resolved) {
      setForm((prev) => ({ ...prev, icon: resolved }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) return;

    const payload = {
      name: form.name.trim(),
      category: form.category,
      icon: form.icon.trim() || getToolIconUrl(form.name) || '',
      level: form.level.trim(),
      context: form.context.trim(),
      importance: Number(form.importance) || 1,
    };

    await saveItem(payload);
  };

  const filteredSkills = useMemo(() => {
    if (!Array.isArray(skills)) return [];
    return skills.filter((item) => {
      const matchCat = filterCategory === 'ALL' || item.category === filterCategory;
      const matchQuery =
        !searchQuery.trim() ||
        (item.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.context || '').toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchQuery;
    });
  }, [skills, filterCategory, searchQuery]);

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-border">
        <div>
          <h1 className="text-2xl font-light tracking-tight text-foreground">Skills</h1>
          <p className="text-sm text-muted mt-1">
            Manage technologies, frameworks, and tools displayed on the public site.
          </p>
        </div>
        <Button onClick={openCreate} className="self-start sm:self-auto">
          <Plus size={16} />
          <span>Add skill</span>
        </Button>
      </div>

      {/* Global Alerts */}
      {error && <Alert variant="error">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          <button
            type="button"
            onClick={() => setFilterCategory('ALL')}
            className={`px-3 py-1.5 text-xs font-medium rounded-full border transition-colors shrink-0 ${
              filterCategory === 'ALL'
                ? 'bg-foreground text-surface border-foreground'
                : 'bg-surface text-muted border-border hover:text-foreground'
            }`}
          >
            All ({Array.isArray(skills) ? skills.length : 0})
          </button>
          {CATEGORIES.map((cat) => {
            const count = Array.isArray(skills) ? skills.filter((s) => s.category === cat.value).length : 0;
            return (
              <button
                key={cat.value}
                type="button"
                onClick={() => setFilterCategory(cat.value)}
                className={`px-3 py-1.5 text-xs font-medium rounded-full border transition-colors shrink-0 ${
                  filterCategory === cat.value
                    ? 'bg-foreground text-surface border-foreground'
                    : 'bg-surface text-muted border-border hover:text-foreground'
                }`}
              >
                {cat.label} ({count})
              </button>
            );
          })}
        </div>

        <div className="relative w-full sm:w-64 shrink-0">
          <Search size={14} className="absolute start-3 top-1/2 -translate-y-1/2 text-muted pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search skills…"
            className="w-full ps-9 pe-3 py-1.5 rounded-lg border border-border bg-surface text-xs text-foreground placeholder:text-muted focus:outline-none focus:border-foreground"
          />
        </div>
      </div>

      {/* Main Content Area */}
      {isLoading ? (
        <LoadingState message="Loading skills…" />
      ) : filteredSkills.length === 0 ? (
        <EmptyState
          title="No skills found"
          description={
            searchQuery || filterCategory !== 'ALL'
              ? 'Try adjusting your search or category filter.'
              : 'Add your first skill to display on the public site.'
          }
          action={
            <Button onClick={openCreate} variant="secondary">
              <Plus size={16} />
              <span>Add skill</span>
            </Button>
          }
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {filteredSkills.map((skill) => {
            const iconUrl = skill.icon || getToolIconUrl(skill.name);
            const catLabel = CATEGORIES.find((c) => c.value === skill.category)?.label || skill.category || 'Skill';

            return (
              <div
                key={skill.id || skill._id}
                className="group rounded-lg border border-border bg-surface p-4 flex items-start justify-between gap-3 hover:border-foreground/30 transition-colors"
              >
                <div className="flex items-start gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-lg border border-border bg-surface-muted flex items-center justify-center shrink-0 overflow-hidden p-2">
                    {iconUrl ? (
                      <img
                        src={iconUrl}
                        alt=""
                        className="w-full h-full object-contain grayscale"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    ) : (
                      <Sparkles size={16} className="text-muted" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-sm font-medium text-foreground truncate">{skill.name}</h3>
                    <p className="text-xs text-muted truncate mt-0.5">{catLabel}</p>
                    {skill.level && (
                      <span className="inline-block mt-2 px-2 py-0.5 text-[10px] font-medium rounded-full bg-surface-muted border border-border text-muted">
                        {skill.level}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  <button
                    type="button"
                    onClick={() => openEdit(skill)}
                    className="p-1.5 text-muted hover:text-foreground rounded transition-colors"
                    title="Edit skill"
                    aria-label={`Edit ${skill.name}`}
                  >
                    <Edit2 size={14} />
                  </button>
                  <button
                    type="button"
                    onClick={() => requestDelete(skill)}
                    className="p-1.5 text-muted hover:text-red-600 rounded transition-colors"
                    title="Delete skill"
                    aria-label={`Delete ${skill.name}`}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add / Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={editingItem ? 'Edit skill' : 'Add new skill'}
        description="Enter skill details to appear in the public tech stack grid."
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Field label="Skill name" required>
            <Input
              value={form.name}
              onChange={(e) => handleNameChange(e.target.value)}
              placeholder="e.g. PyTorch, LangGraph, Docker"
              required
            />
          </Field>

          {/* Quick preset suggestions if creating new */}
          {!editingItem && !form.name && (
            <div className="space-y-1.5">
              <label className="text-[11px] font-medium text-muted">Suggested presets</label>
              <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto">
                {POPULAR_SUGGESTIONS.slice(0, 10).map((s) => (
                  <button
                    key={s.name}
                    type="button"
                    onClick={() => {
                      setForm((prev) => ({
                        ...prev,
                        name: s.name,
                        category: s.category,
                        icon: getToolIconUrl(s.name) || '',
                      }));
                    }}
                    className="text-xs px-2.5 py-1 rounded-full border border-border bg-surface-muted text-foreground hover:bg-surface transition-colors"
                  >
                    + {s.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          <Field label="Category" required>
            <Select
              value={form.category}
              onChange={(e) => setForm((prev) => ({ ...prev, category: e.target.value }))}
              options={CATEGORIES}
            />
          </Field>

          <Field
            label="Icon URL"
            hint="Supports SVG or PNG URLs. Click auto-detect to generate from simpleicons/devicons."
          >
            <div className="flex items-center gap-2">
              <Input
                value={form.icon}
                onChange={(e) => setForm((prev) => ({ ...prev, icon: e.target.value }))}
                placeholder="https://..."
              />
              <Button
                type="button"
                variant="secondary"
                onClick={handleAutoResolveIcon}
                disabled={!form.name.trim()}
                className="shrink-0"
              >
                Auto-detect
              </Button>
            </div>
            {form.icon && (
              <div className="mt-2 flex items-center gap-2 p-2 rounded-lg border border-border bg-surface-muted">
                <img
                  src={form.icon}
                  alt="Preview"
                  className="w-5 h-5 object-contain grayscale shrink-0"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
                <span className="text-xs text-muted truncate">{form.icon}</span>
              </div>
            )}
          </Field>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Proficiency level (optional)" hint="e.g. Production, Advanced, Core">
              <Input
                value={form.level}
                onChange={(e) => setForm((prev) => ({ ...prev, level: e.target.value }))}
                placeholder="e.g. Production"
              />
            </Field>

            <Field label="Display priority / importance" hint="Higher numbers appear first">
              <Input
                type="number"
                value={form.importance}
                onChange={(e) => setForm((prev) => ({ ...prev, importance: e.target.value }))}
                min="0"
              />
            </Field>
          </div>

          <Field label="Usage context / notes (optional)" hint="Internal note or hover info">
            <Input
              value={form.context}
              onChange={(e) => setForm((prev) => ({ ...prev, context: e.target.value }))}
              placeholder="e.g. Custom CNNs, loss surface tuning, agentic tools"
            />
          </Field>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
            <Button type="button" variant="secondary" onClick={closeModal} disabled={saving}>
              Cancel
            </Button>
            <Button type="submit" disabled={saving || !form.name.trim()}>
              {saving ? 'Saving…' : editingItem ? 'Save changes' : 'Add skill'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={Boolean(deleteTarget)}
        title="Delete skill"
        message={`Are you sure you want to delete "${deleteTarget?.name}"? This will remove it from the database and public site.`}
        confirmLabel={deleting ? 'Deleting…' : 'Delete skill'}
        isDestructive
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
      />
    </div>
  );
}
