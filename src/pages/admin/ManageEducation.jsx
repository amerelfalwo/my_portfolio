import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Award, ArrowRight, Save, ShieldCheck } from 'lucide-react';
import { useEducationDegree } from '../../hooks/useData';
import { authFetch } from '../../lib/authFetch';
import {
  Button,
  Input,
  Textarea,
  Field,
  Card,
  Alert,
  LoadingState,
} from '../../components/admin/ui';

export default function ManageEducation() {
  const { education, isLoading, mutate } = useEducationDegree();

  const [form, setForm] = useState({
    degree: '',
    university: '',
    location: '',
    major: '',
    period: '',
    honors: '',
    badge: 'Verified Degree',
    description: '',
  });

  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (education) {
      setForm({
        degree: education.degree || '',
        university: education.university || '',
        location: education.location || '',
        major: education.major || '',
        period: education.period || '',
        honors: education.honors || 'Very Good Honors',
        badge: education.badge || 'Verified Degree',
        description: education.description || '',
      });
    }
  }, [education]);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(null);

    try {
      const res = await authFetch('/api/config?key=educationDegree', {
        method: 'POST',
        body: JSON.stringify(form),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok || (data.success === false)) {
        throw new Error(data.error || 'Failed to save academic degree information');
      }

      await mutate();
      setSuccess('Academic degree information saved successfully.');
    } catch (err) {
      console.error('Save Education Error:', err);
      setError(err.message || 'Operation failed');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-border">
        <div>
          <h1 className="text-2xl font-light tracking-tight text-foreground">Education</h1>
          <p className="text-sm text-muted mt-1">
            Manage your academic degree, university credentials, and capstone project details.
          </p>
        </div>

        <Link
          to="/admin/dashboard/certificates"
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-border bg-surface text-xs font-medium text-foreground hover:bg-surface-muted transition-colors self-start sm:self-auto"
        >
          <Award size={14} />
          <span>Manage Certificates</span>
          <ArrowRight size={12} className="text-muted" />
        </Link>
      </div>

      {/* Global Alerts */}
      {error && <Alert variant="error">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}

      {isLoading ? (
        <LoadingState message="Loading education settings…" />
      ) : (
        <div className="space-y-6">
          {/* Degree Form Card */}
          <Card
            title="University Degree"
            description="Details shown in the Academic Background card at the bottom of the public credentials section."
          >
            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="Degree title" required>
                  <Input
                    value={form.degree}
                    onChange={(e) => setForm((prev) => ({ ...prev, degree: e.target.value }))}
                    placeholder="Bachelor of Science in Computer and Information Sciences"
                    required
                  />
                </Field>

                <Field label="University name" required>
                  <Input
                    value={form.university}
                    onChange={(e) => setForm((prev) => ({ ...prev, university: e.target.value }))}
                    placeholder="Mansoura University"
                    required
                  />
                </Field>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Field label="Major / Specialization">
                  <Input
                    value={form.major}
                    onChange={(e) => setForm((prev) => ({ ...prev, major: e.target.value }))}
                    placeholder="Information Technology (IT) Major"
                  />
                </Field>

                <Field label="Location">
                  <Input
                    value={form.location}
                    onChange={(e) => setForm((prev) => ({ ...prev, location: e.target.value }))}
                    placeholder="Mansoura, Egypt"
                  />
                </Field>

                <Field label="Period">
                  <Input
                    value={form.period}
                    onChange={(e) => setForm((prev) => ({ ...prev, period: e.target.value }))}
                    placeholder="2022 — 2026"
                  />
                </Field>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="Honors / Grade badge" hint="e.g. Very Good Honors">
                  <Input
                    value={form.honors}
                    onChange={(e) => setForm((prev) => ({ ...prev, honors: e.target.value }))}
                    placeholder="Very Good Honors"
                  />
                </Field>

                <Field label="Verification badge text" hint="e.g. Verified Degree">
                  <Input
                    value={form.badge}
                    onChange={(e) => setForm((prev) => ({ ...prev, badge: e.target.value }))}
                    placeholder="Verified Degree"
                  />
                </Field>
              </div>

              <Field
                label="Capstone & Specialization description"
                hint="Describe graduation capstone project, multimodal AI focus, and honors distinction."
              >
                <Textarea
                  value={form.description}
                  onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
                  placeholder="Capstone: ThyraX — Thyroid Cancer Clinical Decision Support System (Biomedical Deep Learning & Multimodal AI, Score: Distinction)."
                  rows={3}
                />
              </Field>

              <div className="flex items-center justify-end pt-4 border-t border-border">
                <Button type="submit" disabled={saving || !form.degree.trim() || !form.university.trim()}>
                  <Save size={14} />
                  <span>{saving ? 'Saving…' : 'Save degree information'}</span>
                </Button>
              </div>
            </form>
          </Card>

          {/* Live Preview Card */}
          <div className="space-y-2">
            <h3 className="text-xs font-medium text-muted uppercase tracking-wider">Public Site Card Preview</h3>
            <div className="bg-surface rounded-lg border border-border p-6 sm:p-7 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-[11px] font-medium bg-surface-muted text-foreground mb-3">
                  <span>{form.honors || 'Very Good Honors'}</span>
                  <span className="text-muted">•</span>
                  <span>{form.period || '2022 — 2026'}</span>
                </div>

                <h4 className="text-base sm:text-lg font-medium text-foreground tracking-tight">
                  {form.degree || 'Bachelor of Science in Computer and Information Sciences'}
                </h4>

                <p className="text-xs sm:text-sm text-muted mt-1 font-normal">
                  {form.university || 'Mansoura University'} • {form.major || form.location || 'Information Technology (IT) Major'}
                </p>

                <p className="text-xs text-muted/80 mt-3 font-normal max-w-2xl leading-relaxed">
                  {form.description || 'Capstone: ThyraX — Thyroid Cancer Clinical Decision Support System.'}
                </p>
              </div>

              <div className="shrink-0 flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-border text-xs font-medium text-foreground bg-surface-muted/60">
                  <ShieldCheck className="w-3.5 h-3.5 text-foreground" />
                  <span>{form.badge || 'Verified Degree'}</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
