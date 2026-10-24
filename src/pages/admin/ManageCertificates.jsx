import { useState, useMemo, useEffect } from 'react';
import { Plus, Search, Edit2, Trash2, Award, ExternalLink, ShieldCheck } from 'lucide-react';
import { useCertificates } from '../../hooks/useData';
import { useAdminCrud } from '../../hooks/useAdminCrud';
import ImageUpload from '../../components/admin/ImageUpload';
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

const INITIAL_FORM = {
  title: '',
  issuer: '',
  issuerShort: '',
  date: '',
  year: '',
  badge: 'Verified',
  description: '',
  credentialUrl: '',
  imageUrl: '',
  isVerified: true,
};

export default function ManageCertificates() {
  const { certificates, isLoading, mutate } = useCertificates();
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
  } = useAdminCrud({ endpoint: '/api/certificates', mutate, entityName: 'Certificate' });

  const [form, setForm] = useState(INITIAL_FORM);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (editingItem) {
      const formattedDate = editingItem.date
        ? new Date(editingItem.date).toISOString().split('T')[0]
        : '';
      setForm({
        title: editingItem.title || '',
        issuer: editingItem.issuer || '',
        issuerShort: editingItem.issuerShort || '',
        date: formattedDate,
        year: editingItem.year || '',
        badge: editingItem.badge || 'Verified',
        description: editingItem.description || '',
        credentialUrl: editingItem.credentialUrl || editingItem.verificationUrl || '',
        imageUrl: editingItem.imageUrl || editingItem.image || '',
        isVerified: editingItem.isVerified !== undefined ? editingItem.isVerified : true,
      });
    } else {
      setForm({
        ...INITIAL_FORM,
        date: new Date().toISOString().split('T')[0],
      });
    }
  }, [editingItem, isModalOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim() || !form.issuer.trim()) return;

    const payload = {
      title: form.title.trim(),
      issuer: form.issuer.trim(),
      issuerShort: form.issuerShort.trim(),
      date: form.date ? new Date(form.date) : new Date(),
      year: form.year.trim(),
      badge: form.badge.trim(),
      description: form.description.trim(),
      credentialUrl: form.credentialUrl.trim(),
      imageUrl: form.imageUrl.trim(),
      isVerified: Boolean(form.isVerified),
    };

    await saveItem(payload);
  };

  const filteredCerts = useMemo(() => {
    if (!Array.isArray(certificates)) return [];
    if (!searchQuery.trim()) return certificates;
    const q = searchQuery.toLowerCase();
    return certificates.filter(
      (c) =>
        (c.title || '').toLowerCase().includes(q) ||
        (c.issuer || '').toLowerCase().includes(q) ||
        (c.description || '').toLowerCase().includes(q)
    );
  }, [certificates, searchQuery]);

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-border">
        <div>
          <h1 className="text-2xl font-light tracking-tight text-foreground">Certificates</h1>
          <p className="text-sm text-muted mt-1">
            Manage credentials and verified technical achievements displayed on the public site.
          </p>
        </div>
        <Button onClick={openCreate} className="self-start sm:self-auto">
          <Plus size={16} />
          <span>Add certificate</span>
        </Button>
      </div>

      {/* Global Alerts */}
      {error && <Alert variant="error">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}

      {/* Search Bar */}
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs text-muted">
          Showing {filteredCerts.length} of {Array.isArray(certificates) ? certificates.length : 0} certificates
        </p>
        <div className="relative w-full sm:w-64 shrink-0">
          <Search size={14} className="absolute start-3 top-1/2 -translate-y-1/2 text-muted pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search certificates…"
            className="w-full ps-9 pe-3 py-1.5 rounded-lg border border-border bg-surface text-xs text-foreground placeholder:text-muted focus:outline-none focus:border-foreground"
          />
        </div>
      </div>

      {/* Main Content Area */}
      {isLoading ? (
        <LoadingState message="Loading certificates…" />
      ) : filteredCerts.length === 0 ? (
        <EmptyState
          title="No certificates found"
          description={
            searchQuery
              ? 'Try adjusting your search query.'
              : 'Add your first certificate to display on the public credentials section.'
          }
          action={
            <Button onClick={openCreate} variant="secondary">
              <Plus size={16} />
              <span>Add certificate</span>
            </Button>
          }
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredCerts.map((cert) => {
            const imgSrc = cert.imageUrl || cert.image;
            return (
              <div
                key={cert.id || cert._id}
                className="group rounded-lg border border-border bg-surface p-4 flex flex-col justify-between hover:border-foreground/30 transition-colors"
              >
                <div>
                  {/* Thumbnail / Plaque Preview */}
                  <div className="aspect-[16/10] w-full rounded-lg border border-border bg-surface-muted overflow-hidden mb-3 relative flex items-center justify-center">
                    {imgSrc ? (
                      <img
                        src={imgSrc}
                        alt={cert.title}
                        className="w-full h-full object-contain p-2"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    ) : (
                      <Award size={28} className="text-muted" />
                    )}
                    {cert.badge && (
                      <span className="absolute top-2 start-2 px-2 py-0.5 rounded-full text-[10px] font-medium bg-surface/90 border border-border text-foreground">
                        {cert.badge}
                      </span>
                    )}
                  </div>

                  <h3 className="text-sm font-medium text-foreground leading-snug line-clamp-2">
                    {cert.title}
                  </h3>
                  <p className="text-xs text-muted mt-1">
                    {cert.issuer} {cert.year ? `• ${cert.year}` : ''}
                  </p>
                  {cert.description && (
                    <p className="text-xs text-muted/80 mt-2 line-clamp-2">
                      {cert.description}
                    </p>
                  )}
                </div>

                <div className="flex items-center justify-between pt-3 mt-3 border-t border-border">
                  <div className="flex items-center gap-1.5 text-[11px] text-muted">
                    <ShieldCheck size={13} className="text-foreground" />
                    <span>{cert.isVerified ? 'Verified' : 'Unverified'}</span>
                  </div>

                  <div className="flex items-center gap-1">
                    {cert.credentialUrl && (
                      <a
                        href={cert.credentialUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1.5 text-muted hover:text-foreground rounded transition-colors"
                        title="Open credential link"
                      >
                        <ExternalLink size={14} />
                      </a>
                    )}
                    <button
                      type="button"
                      onClick={() => openEdit(cert)}
                      className="p-1.5 text-muted hover:text-foreground rounded transition-colors"
                      title="Edit certificate"
                      aria-label={`Edit ${cert.title}`}
                    >
                      <Edit2 size={14} />
                    </button>
                    <button
                      type="button"
                      onClick={() => requestDelete(cert)}
                      className="p-1.5 text-muted hover:text-red-600 rounded transition-colors"
                      title="Delete certificate"
                      aria-label={`Delete ${cert.title}`}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
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
        title={editingItem ? 'Edit certificate' : 'Add new certificate'}
        description="Enter certificate details and upload image or credential URL."
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Field label="Certificate title" required>
            <Input
              value={form.title}
              onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))}
              placeholder="e.g. AI & Data Science - Machine Learning Engineer"
              required
            />
          </Field>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Issuer / Organization" required>
              <Input
                value={form.issuer}
                onChange={(e) => setForm((prev) => ({ ...prev, issuer: e.target.value }))}
                placeholder="e.g. DEPI & Microsoft, NVIDIA"
                required
              />
            </Field>

            <Field label="Short issuer label (optional)" hint="e.g. Microsoft, NVIDIA">
              <Input
                value={form.issuerShort}
                onChange={(e) => setForm((prev) => ({ ...prev, issuerShort: e.target.value }))}
                placeholder="e.g. Microsoft"
              />
            </Field>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Field label="Issue date">
              <Input
                type="date"
                value={form.date}
                onChange={(e) => setForm((prev) => ({ ...prev, date: e.target.value }))}
              />
            </Field>

            <Field label="Year badge (optional)" hint="e.g. 2026">
              <Input
                value={form.year}
                onChange={(e) => setForm((prev) => ({ ...prev, year: e.target.value }))}
                placeholder="2026"
              />
            </Field>

            <Field label="Badge label" hint="e.g. Verified, Accredited">
              <Input
                value={form.badge}
                onChange={(e) => setForm((prev) => ({ ...prev, badge: e.target.value }))}
                placeholder="Verified"
              />
            </Field>
          </div>

          <Field
            label="Verification / Credential URL"
            hint="Link to verified certificate or credential viewer"
          >
            <Input
              value={form.credentialUrl}
              onChange={(e) => setForm((prev) => ({ ...prev, credentialUrl: e.target.value }))}
              placeholder="https://..."
            />
          </Field>

          <Field
            label="Certificate image"
            hint="Upload image or specify external URL"
          >
            <ImageUpload
              currentImage={form.imageUrl}
              onImageChange={(url) => setForm((prev) => ({ ...prev, imageUrl: url }))}
              placeholder="Upload certificate image (PNG, WebP, JPEG)"
            />
          </Field>

          <Field label="Short description (optional)" hint="Key skills or achievements covered">
            <Textarea
              value={form.description}
              onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
              placeholder="Specialization covering deep learning architectures, multimodal AI, and deployment pipelines."
              rows={2}
            />
          </Field>

          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="isVerified"
              checked={form.isVerified}
              onChange={(e) => setForm((prev) => ({ ...prev, isVerified: e.target.checked }))}
              className="rounded border-border text-foreground focus:ring-0"
            />
            <label htmlFor="isVerified" className="text-xs text-foreground cursor-pointer">
              Mark as officially accredited and verified credential
            </label>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
            <Button type="button" variant="secondary" onClick={closeModal} disabled={saving}>
              Cancel
            </Button>
            <Button type="submit" disabled={saving || !form.title.trim() || !form.issuer.trim()}>
              {saving ? 'Saving…' : editingItem ? 'Save changes' : 'Add certificate'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={Boolean(deleteTarget)}
        title="Delete certificate"
        message={`Are you sure you want to delete "${deleteTarget?.title}"? This will remove it from the database and public credentials section.`}
        confirmLabel={deleting ? 'Deleting…' : 'Delete certificate'}
        isDestructive
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
      />
    </div>
  );
}
