import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, BookOpen, ExternalLink, CheckCircle2 } from 'lucide-react';
import { useTrainings } from '../../hooks/useData';
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

export default function ManageTrainings() {
  const { trainings, isLoading, mutate } = useTrainings();
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
  } = useAdminCrud({ endpoint: '/api/collection?name=trainings', mutate, entityName: 'Training' });

  const [form, setForm] = useState({
    title: '',
    provider: '',
    duration: '',
    description: '',
    skillsListedText: '',
    certificateUrl: '',
    isCompleted: true,
  });

  useEffect(() => {
    if (editingItem) {
      setForm({
        title: editingItem.title || '',
        provider: editingItem.provider || '',
        duration: editingItem.duration || '',
        description: editingItem.description || '',
        skillsListedText: Array.isArray(editingItem.skillsListed)
          ? editingItem.skillsListed.join(', ')
          : '',
        certificateUrl: editingItem.certificateUrl || '',
        isCompleted: editingItem.isCompleted !== undefined ? editingItem.isCompleted : true,
      });
    } else {
      setForm({
        title: '',
        provider: '',
        duration: '',
        description: '',
        skillsListedText: '',
        certificateUrl: '',
        isCompleted: true,
      });
    }
  }, [editingItem, isModalOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim() || !form.provider.trim()) return;

    const payload = {
      title: form.title.trim(),
      provider: form.provider.trim(),
      duration: form.duration.trim(),
      description: form.description.trim(),
      skillsListed: form.skillsListedText
        ? form.skillsListedText.split(',').map((s) => s.trim()).filter(Boolean)
        : [],
      certificateUrl: form.certificateUrl.trim(),
      isCompleted: Boolean(form.isCompleted),
    };

    await saveItem(payload);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-border">
        <div>
          <h1 className="text-2xl font-light tracking-tight text-foreground">Trainings & Bootcamps (Dormant)</h1>
          <p className="text-sm text-muted mt-1">
            Manage technical training programs and bootcamp records. Note: Trainings section is dormant on the light public site.
          </p>
        </div>

        <Button onClick={openCreate} className="self-start sm:self-auto">
          <Plus size={16} />
          <span>Add training</span>
        </Button>
      </div>

      {/* Global Alerts */}
      {error && <Alert variant="error">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}

      {isLoading ? (
        <LoadingState message="Loading trainings…" />
      ) : !Array.isArray(trainings) || trainings.length === 0 ? (
        <EmptyState
          title="No training records found"
          description="Trainings collection is currently empty."
          action={
            <Button onClick={openCreate} variant="secondary">
              <Plus size={16} />
              <span>Add training</span>
            </Button>
          }
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {trainings.map((trn) => (
            <div
              key={trn.id || trn._id}
              className="rounded-lg border border-border bg-surface p-5 flex flex-col justify-between hover:border-foreground/30 transition-colors"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-xs font-medium text-muted">{trn.provider}</span>
                  {trn.duration && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] bg-surface-muted border border-border text-muted">
                      {trn.duration}
                    </span>
                  )}
                </div>

                <h3 className="text-sm font-medium text-foreground">{trn.title}</h3>
                {trn.description && (
                  <p className="text-xs text-muted mt-2 line-clamp-3 leading-relaxed">
                    {trn.description}
                  </p>
                )}

                {Array.isArray(trn.skillsListed) && trn.skillsListed.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-1">
                    {trn.skillsListed.slice(0, 3).map((s, i) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 rounded-full text-[10px] bg-surface-muted border border-border text-muted"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between pt-3 mt-4 border-t border-border">
                <span className="text-[11px] text-muted flex items-center gap-1">
                  <CheckCircle2 size={13} className="text-foreground" />
                  <span>{trn.isCompleted ? 'Completed' : 'In Progress'}</span>
                </span>

                <div className="flex items-center gap-1">
                  {trn.certificateUrl && (
                    <a
                      href={trn.certificateUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 text-muted hover:text-foreground rounded transition-colors"
                      title="View certificate"
                    >
                      <ExternalLink size={14} />
                    </a>
                  )}
                  <button
                    type="button"
                    onClick={() => openEdit(trn)}
                    className="p-1.5 text-muted hover:text-foreground rounded transition-colors"
                    title="Edit training"
                  >
                    <Edit2 size={14} />
                  </button>
                  <button
                    type="button"
                    onClick={() => requestDelete(trn)}
                    className="p-1.5 text-muted hover:text-red-600 rounded transition-colors"
                    title="Delete training"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={editingItem ? 'Edit training' : 'Add new training'}
        description="Enter training program details, provider, and duration."
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Field label="Training / Track title" required>
            <Input
              value={form.title}
              onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))}
              placeholder="e.g. Applied Data Science, Deep Learning & MLOps Track"
              required
            />
          </Field>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Provider / Organization" required>
              <Input
                value={form.provider}
                onChange={(e) => setForm((prev) => ({ ...prev, provider: e.target.value }))}
                placeholder="e.g. DEPI, Google Developer Groups"
                required
              />
            </Field>

            <Field label="Duration" hint="e.g. 6 Months, 40 Hours">
              <Input
                value={form.duration}
                onChange={(e) => setForm((prev) => ({ ...prev, duration: e.target.value }))}
                placeholder="6 Months"
              />
            </Field>
          </div>

          <Field label="Program description">
            <Textarea
              value={form.description}
              onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
              placeholder="Intensive professional training in deep neural network development and production deployment..."
              rows={3}
            />
          </Field>

          <Field label="Skills / Topics covered" hint="Comma-separated">
            <Input
              value={form.skillsListedText}
              onChange={(e) => setForm((prev) => ({ ...prev, skillsListedText: e.target.value }))}
              placeholder="PyTorch, Docker, MLOps, CI/CD"
            />
          </Field>

          <Field label="Certificate / Credential link (optional)">
            <Input
              value={form.certificateUrl}
              onChange={(e) => setForm((prev) => ({ ...prev, certificateUrl: e.target.value }))}
              placeholder="https://..."
            />
          </Field>

          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="isCompleted"
              checked={form.isCompleted}
              onChange={(e) => setForm((prev) => ({ ...prev, isCompleted: e.target.checked }))}
              className="rounded border-border text-foreground focus:ring-0"
            />
            <label htmlFor="isCompleted" className="text-xs text-foreground cursor-pointer">
              Mark as successfully completed track
            </label>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
            <Button type="button" variant="secondary" onClick={closeModal} disabled={saving}>
              Cancel
            </Button>
            <Button type="submit" disabled={saving || !form.title.trim() || !form.provider.trim()}>
              {saving ? 'Saving…' : editingItem ? 'Save changes' : 'Add training'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={Boolean(deleteTarget)}
        title="Delete training"
        message={`Are you sure you want to delete training "${deleteTarget?.title}"?`}
        confirmLabel={deleting ? 'Deleting…' : 'Delete training'}
        isDestructive
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
      />
    </div>
  );
}
