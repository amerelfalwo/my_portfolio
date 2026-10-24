import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Cpu, Sparkles, Layers, Code, Zap } from 'lucide-react';
import { useServices } from '../../hooks/useData';
import { useAdminCrud } from '../../hooks/useAdminCrud';
import {
  Button,
  Input,
  Textarea,
  Field,
  Card,
  Modal,
  ConfirmDialog,
  Alert,
  LoadingState,
  EmptyState,
} from '../../components/admin/ui';

const ICON_PRESETS = [
  'Code', 'Brain', 'Layers', 'Cpu', 'Terminal', 'Database', 'Server', 'Zap', 'Sparkles'
];

export default function ManageServices() {
  const { services, isLoading, mutate } = useServices();
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
  } = useAdminCrud({ endpoint: '/api/collection?name=services', mutate, entityName: 'Service' });

  const [form, setForm] = useState({
    title: '',
    description: '',
    iconName: 'Brain',
    featuresText: '',
    order: 0,
  });

  useEffect(() => {
    if (editingItem) {
      setForm({
        title: editingItem.title || '',
        description: editingItem.description || '',
        iconName: editingItem.iconName || editingItem.icon || 'Brain',
        featuresText: Array.isArray(editingItem.features) ? editingItem.features.join(', ') : '',
        order: editingItem.order ?? 0,
      });
    } else {
      setForm({
        title: '',
        description: '',
        iconName: 'Brain',
        featuresText: '',
        order: Array.isArray(services) ? services.length : 0,
      });
    }
  }, [editingItem, isModalOpen, services]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) return;

    const payload = {
      title: form.title.trim(),
      description: form.description.trim(),
      iconName: form.iconName.trim(),
      icon: form.iconName.trim(),
      features: form.featuresText
        ? form.featuresText.split(',').map((f) => f.trim()).filter(Boolean)
        : [],
      order: Number(form.order) || 0,
    };

    await saveItem(payload);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-border">
        <div>
          <h1 className="text-2xl font-light tracking-tight text-foreground">Services (Dormant)</h1>
          <p className="text-sm text-muted mt-1">
            Manage engineering service offerings. Note: Services section is currently dormant on the light public portfolio.
          </p>
        </div>

        <Button onClick={openCreate} className="self-start sm:self-auto">
          <Plus size={16} />
          <span>Add service</span>
        </Button>
      </div>

      {/* Global Alerts */}
      {error && <Alert variant="error">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}

      {isLoading ? (
        <LoadingState message="Loading services…" />
      ) : !Array.isArray(services) || services.length === 0 ? (
        <EmptyState
          title="No services configured"
          description="Services collection is currently empty."
          action={
            <Button onClick={openCreate} variant="secondary">
              <Plus size={16} />
              <span>Add service</span>
            </Button>
          }
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {services.map((svc) => (
            <div
              key={svc.id || svc._id}
              className="rounded-lg border border-border bg-surface p-5 flex flex-col justify-between hover:border-foreground/30 transition-colors"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div className="w-9 h-9 rounded-lg border border-border bg-surface-muted flex items-center justify-center text-foreground">
                    <Sparkles size={16} />
                  </div>
                  <span className="text-xs text-muted">Order: {svc.order ?? 0}</span>
                </div>

                <h3 className="text-sm font-medium text-foreground">{svc.title}</h3>
                <p className="text-xs text-muted mt-1.5 line-clamp-3 leading-relaxed">
                  {svc.description}
                </p>

                {Array.isArray(svc.features) && svc.features.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-1">
                    {svc.features.slice(0, 3).map((f, i) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 rounded-full text-[10px] bg-surface-muted border border-border text-muted"
                      >
                        {f}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex items-center justify-end gap-1 pt-3 mt-4 border-t border-border">
                <button
                  type="button"
                  onClick={() => openEdit(svc)}
                  className="p-1.5 text-muted hover:text-foreground rounded transition-colors"
                  title="Edit service"
                >
                  <Edit2 size={14} />
                </button>
                <button
                  type="button"
                  onClick={() => requestDelete(svc)}
                  className="p-1.5 text-muted hover:text-red-600 rounded transition-colors"
                  title="Delete service"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={editingItem ? 'Edit service' : 'Add new service'}
        description="Configure engineering service offerings and capabilities."
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Field label="Service title" required>
            <Input
              value={form.title}
              onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))}
              placeholder="e.g. LLM Systems & Autonomous Agents"
              required
            />
          </Field>

          <Field label="Service description" required>
            <Textarea
              value={form.description}
              onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
              placeholder="Architecting end-to-end multi-agent systems and retrieval-augmented pipelines..."
              rows={3}
              required
            />
          </Field>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Icon name" hint="Preset identifier">
              <Input
                value={form.iconName}
                onChange={(e) => setForm((prev) => ({ ...prev, iconName: e.target.value }))}
                placeholder="Brain"
              />
            </Field>

            <Field label="Sort order">
              <Input
                type="number"
                value={form.order}
                onChange={(e) => setForm((prev) => ({ ...prev, order: e.target.value }))}
              />
            </Field>
          </div>

          <Field
            label="Features / Deliverables"
            hint="Comma-separated list (e.g. Multi-agent, LangGraph, Tool-calling)"
          >
            <Input
              value={form.featuresText}
              onChange={(e) => setForm((prev) => ({ ...prev, featuresText: e.target.value }))}
              placeholder="Tool-calling, RAG pipelines, FastAPI integration"
            />
          </Field>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
            <Button type="button" variant="secondary" onClick={closeModal} disabled={saving}>
              Cancel
            </Button>
            <Button type="submit" disabled={saving || !form.title.trim()}>
              {saving ? 'Saving…' : editingItem ? 'Save changes' : 'Add service'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={Boolean(deleteTarget)}
        title="Delete service"
        message={`Are you sure you want to delete service "${deleteTarget?.title}"?`}
        confirmLabel={deleting ? 'Deleting…' : 'Delete service'}
        isDestructive
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
      />
    </div>
  );
}
