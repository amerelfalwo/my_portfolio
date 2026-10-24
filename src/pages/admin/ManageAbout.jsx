import { useState, useEffect } from 'react';
import { Save, User, Sparkles, Layers, ArrowUpRight } from 'lucide-react';
import { useAboutConfig } from '../../hooks/useData';
import { authFetch } from '../../lib/authFetch';
import ImageUpload from '../../components/admin/ImageUpload';
import {
  Button,
  Input,
  Textarea,
  Field,
  Card,
  Alert,
  LoadingState,
} from '../../components/admin/ui';

const DEFAULT_ABOUT = {
  title: 'About me',
  intro: 'I build deep learning, computer vision, and autonomous agent systems, and structure them with Clean Architecture so they stay maintainable. I have 2+ years building AI projects.',
  statDescription: 'Projects across computer vision, LLM agents, and backend systems.',
  bullet1: 'Hands-on background developing medical computer vision, multi-agent systems, advanced RAG, and real-time detection pipelines.',
  bullet2: 'Focused on Clean Architecture: keeping domain logic separate from frameworks, APIs, and storage.',
  workImage: '/about-work.webp',
  codeImage: '/about-code.webp',
  // Preserved legacy fields
  subtitle: 'Architecting high-performance AI systems and scalable digital solutions.',
  paragraph2: '',
  quote: '',
  yearsExp: '2+',
  deployments: '15+',
  availability: 'Available for new opportunities',
  workTypes: 'REMOTE / ONSITE / HYBRID',
};

export default function ManageAbout() {
  const { aboutConfig, isLoading, mutate } = useAboutConfig();

  const [form, setForm] = useState(DEFAULT_ABOUT);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (aboutConfig) {
      setForm((prev) => ({
        ...prev,
        ...aboutConfig,
        title: aboutConfig.title || prev.title,
        intro: aboutConfig.intro || aboutConfig.bio || aboutConfig.paragraph1 || prev.intro,
        statDescription: aboutConfig.statDescription || prev.statDescription,
        bullet1: aboutConfig.bullet1 || prev.bullet1,
        bullet2: aboutConfig.bullet2 || prev.bullet2,
        workImage: aboutConfig.workImage || prev.workImage,
        codeImage: aboutConfig.codeImage || prev.codeImage,
      }));
    }
  }, [aboutConfig]);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(null);

    const payload = {
      ...form,
      title: form.title.trim(),
      intro: form.intro.trim(),
      bio: form.intro.trim(),
      statDescription: form.statDescription.trim(),
      bullet1: form.bullet1.trim(),
      bullet2: form.bullet2.trim(),
      workImage: form.workImage.trim() || '/about-work.webp',
      codeImage: form.codeImage.trim() || '/about-code.webp',
    };

    try {
      const res = await authFetch('/api/config?key=about', {
        method: 'POST',
        body: JSON.stringify(payload),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok || (data.success === false)) {
        throw new Error(data.error || 'Failed to save About section configuration');
      }

      await mutate();
      setSuccess('About section configuration saved successfully.');
    } catch (err) {
      console.error('Save About Error:', err);
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
          <h1 className="text-2xl font-light tracking-tight text-foreground">About & Profile</h1>
          <p className="text-sm text-muted mt-1">
            Configure bio copy, stat card description, images, and architecture bullet points on the public site.
          </p>
        </div>

        <Button type="button" onClick={handleSave} disabled={saving} className="self-start sm:self-auto">
          <Save size={14} />
          <span>{saving ? 'Saving…' : 'Save changes'}</span>
        </Button>
      </div>

      {/* Global Alerts */}
      {error && <Alert variant="error">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}

      {isLoading ? (
        <LoadingState message="Loading about configuration…" />
      ) : (
        <form onSubmit={handleSave} className="space-y-6">
          {/* Main Bio & Headline */}
          <Card
            title="Bio & Narrative"
            description="Displayed on the left column of the About section."
          >
            <div className="space-y-4">
              <Field label="Section title" hint="Default is 'About me'">
                <Input
                  value={form.title}
                  onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))}
                  placeholder="About me"
                />
              </Field>

              <Field
                label="Primary bio paragraph"
                required
                hint="Summarizes your engineering focus, experience, and clean architecture foundation."
              >
                <Textarea
                  value={form.intro}
                  onChange={(e) => setForm((prev) => ({ ...prev, intro: e.target.value }))}
                  placeholder="I build deep learning, computer vision, and autonomous agent systems..."
                  rows={4}
                  required
                />
              </Field>
            </div>
          </Card>

          {/* Stat Card & Bullet Points */}
          <Card
            title="Middle Stat Card & Key Bullet Points"
            description="Content for the stat highlight and right-hand technical capability bullets."
          >
            <div className="space-y-4">
              <Field
                label="Stat card caption"
                hint="Displayed below the dynamic project count in the middle card."
              >
                <Input
                  value={form.statDescription}
                  onChange={(e) => setForm((prev) => ({ ...prev, statDescription: e.target.value }))}
                  placeholder="Projects across computer vision, LLM agents, and backend systems."
                />
              </Field>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field
                  label="Technical highlight bullet 1"
                  hint="First star bullet point in right column."
                >
                  <Textarea
                    value={form.bullet1}
                    onChange={(e) => setForm((prev) => ({ ...prev, bullet1: e.target.value }))}
                    placeholder="Hands-on background developing medical computer vision, multi-agent systems..."
                    rows={3}
                  />
                </Field>

                <Field
                  label="Architecture principle bullet 2"
                  hint="Second star bullet point in right column."
                >
                  <Textarea
                    value={form.bullet2}
                    onChange={(e) => setForm((prev) => ({ ...prev, bullet2: e.target.value }))}
                    placeholder="Focused on Clean Architecture: keeping domain logic separate..."
                    rows={3}
                  />
                </Field>
              </div>
            </div>
          </Card>

          {/* About Images */}
          <Card
            title="Section Imagery"
            description="Manage the tall work portrait and square code snippet visuals."
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <Field
                label="Work portrait image (4:5 aspect)"
                hint="Default is /about-work.webp"
              >
                <ImageUpload
                  currentImage={form.workImage}
                  onImageChange={(url) => setForm((prev) => ({ ...prev, workImage: url }))}
                  placeholder="Upload 4:5 work photo"
                />
              </Field>

              <Field
                label="Code snippet visual (1:1 square)"
                hint="Default is /about-code.webp"
              >
                <ImageUpload
                  currentImage={form.codeImage}
                  onImageChange={(url) => setForm((prev) => ({ ...prev, codeImage: url }))}
                  placeholder="Upload 1:1 code snippet visual"
                />
              </Field>
            </div>
          </Card>

          {/* Secondary / Availability Information */}
          <Card
            title="Availability & Work Preferences"
            description="General contract and availability settings."
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Years of experience" hint="e.g. 2+">
                <Input
                  value={form.yearsExp}
                  onChange={(e) => setForm((prev) => ({ ...prev, yearsExp: e.target.value }))}
                  placeholder="2+"
                />
              </Field>

              <Field label="Availability status" hint="e.g. Available for new opportunities">
                <Input
                  value={form.availability}
                  onChange={(e) => setForm((prev) => ({ ...prev, availability: e.target.value }))}
                  placeholder="Available for new opportunities"
                />
              </Field>

              <Field label="Work types" hint="e.g. REMOTE / ONSITE / HYBRID">
                <Input
                  value={form.workTypes}
                  onChange={(e) => setForm((prev) => ({ ...prev, workTypes: e.target.value }))}
                  placeholder="REMOTE / ONSITE / HYBRID"
                />
              </Field>

              <Field label="Personal quote / motto (optional)">
                <Input
                  value={form.quote}
                  onChange={(e) => setForm((prev) => ({ ...prev, quote: e.target.value }))}
                  placeholder="Continuous learning and relentless discipline..."
                />
              </Field>
            </div>
          </Card>

          <div className="flex items-center justify-end pt-4 border-t border-border">
            <Button type="submit" disabled={saving || !form.intro.trim()}>
              <Save size={14} />
              <span>{saving ? 'Saving…' : 'Save about configuration'}</span>
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}
