import { useState, useEffect } from 'react';
import { Save, Plus, Trash2, Bot, Link2, User, Sparkles, ExternalLink, ShieldCheck } from 'lucide-react';
import { useSettings } from '../../hooks/useData';
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

const TABS = [
  { id: 'identity', label: 'Identity & Profile' },
  { id: 'socials', label: 'Links & Socials' },
  { id: 'hero', label: 'Hero & Highlights' },
  { id: 'ai', label: 'AI Assistant Brain' },
];

export default function ManageSettings() {
  const { settings, isLoading, mutate } = useSettings();

  const [activeTab, setActiveTab] = useState('identity');
  const [form, setForm] = useState({
    fullName: '',
    jobTitle: '',
    siteTitle: '',
    bio: '',
    email: '',
    phone: '',
    location: '',
    resumeUrl: '',
    githubUrl: '',
    linkedinUrl: '',
    twitterUrl: '',
    facebookUrl: '',
    instagramUrl: '',
    heroBadgeText: 'AI COMMAND CENTER',
    heroImage: '/hero.webp',
    heroStats: [
      { title: '19', description: 'Projects completed' },
      { title: '2+', description: 'Years building AI projects' },
    ],
    chatbotKnowledge: '',
    cvText: '',
  });

  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (settings) {
      const socials = settings.socialLinks || {};
      setForm({
        fullName: settings.fullName || settings.name || '',
        jobTitle: settings.jobTitle || '',
        siteTitle: settings.siteTitle || 'Amir Elrefai | AI Engineer',
        bio: settings.bio || '',
        email: settings.email || 'amir.elrefai.dev@gmail.com',
        phone: settings.phone || '+201023524477',
        location: settings.location || 'Mansoura, Egypt',
        resumeUrl: settings.resumeUrl || settings.cvUrl || '',
        githubUrl: settings.github || settings.githubUrl || socials.github || '',
        linkedinUrl: settings.linkedin || settings.linkedinUrl || socials.linkedin || '',
        twitterUrl: settings.twitter || settings.twitterUrl || socials.twitter || '',
        facebookUrl: settings.facebook || socials.facebook || '',
        instagramUrl: settings.instagram || socials.instagram || '',
        heroBadgeText: settings.heroBadgeText || 'AI COMMAND CENTER',
        heroImage: settings.heroImage || settings.profileImageUrl || '/hero.webp',
        heroStats: Array.isArray(settings.heroStats) && settings.heroStats.length > 0
          ? settings.heroStats
          : [
              { title: '19', description: 'Projects completed' },
              { title: '2+', description: 'Years building AI projects' },
            ],
        chatbotKnowledge: settings.chatbotKnowledge || '',
        cvText: settings.cvText || '',
      });
    }
  }, [settings]);

  const handleStatChange = (idx, field, value) => {
    setForm((prev) => {
      const updated = [...prev.heroStats];
      updated[idx] = { ...updated[idx], [field]: value };
      return { ...prev, heroStats: updated };
    });
  };

  const handleAddStat = () => {
    setForm((prev) => ({
      ...prev,
      heroStats: [...prev.heroStats, { title: '', description: '' }],
    }));
  };

  const handleRemoveStat = (idx) => {
    setForm((prev) => ({
      ...prev,
      heroStats: prev.heroStats.filter((_, i) => i !== idx),
    }));
  };

  const handleSave = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(null);

    const payload = {
      ...settings,
      fullName: form.fullName.trim(),
      name: form.fullName.trim(),
      jobTitle: form.jobTitle.trim(),
      siteTitle: form.siteTitle.trim(),
      bio: form.bio.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
      location: form.location.trim(),
      resumeUrl: form.resumeUrl.trim(),
      cvUrl: form.resumeUrl.trim(),
      github: form.githubUrl.trim(),
      githubUrl: form.githubUrl.trim(),
      linkedin: form.linkedinUrl.trim(),
      linkedinUrl: form.linkedinUrl.trim(),
      twitter: form.twitterUrl.trim(),
      twitterUrl: form.twitterUrl.trim(),
      facebook: form.facebookUrl.trim(),
      instagram: form.instagramUrl.trim(),
      socialLinks: {
        github: form.githubUrl.trim(),
        linkedin: form.linkedinUrl.trim(),
        twitter: form.twitterUrl.trim(),
        facebook: form.facebookUrl.trim(),
        instagram: form.instagramUrl.trim(),
      },
      heroBadgeText: form.heroBadgeText.trim(),
      heroImage: form.heroImage.trim() || '/hero.webp',
      profileImageUrl: form.heroImage.trim() || '/hero.webp',
      heroStats: form.heroStats.map((s) => ({
        title: String(s.title || '').trim(),
        description: String(s.description || '').trim(),
      })),
      chatbotKnowledge: form.chatbotKnowledge.trim(),
      cvText: form.cvText.trim(),
    };

    try {
      const res = await authFetch('/api/settings', {
        method: 'POST',
        body: JSON.stringify(payload),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok || (data.success === false)) {
        throw new Error(data.error || 'Failed to save settings');
      }

      await mutate();
      setSuccess('Settings saved successfully and synchronized across site.');
    } catch (err) {
      console.error('Save Settings Error:', err);
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
          <h1 className="text-2xl font-light tracking-tight text-foreground">Global Settings</h1>
          <p className="text-sm text-muted mt-1">
            Manage site-wide identity, social links, contact coordinates, hero counters, and AI assistant intelligence.
          </p>
        </div>

        <Button type="button" onClick={handleSave} disabled={saving} className="self-start sm:self-auto">
          <Save size={14} />
          <span>{saving ? 'Saving…' : 'Save all settings'}</span>
        </Button>
      </div>

      {/* Global Alerts */}
      {error && <Alert variant="error">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}

      {/* Navigation Tabs */}
      <div className="flex items-center gap-1.5 border-b border-border pb-3 overflow-x-auto">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 text-xs font-medium rounded-full border transition-colors shrink-0 ${
              activeTab === tab.id
                ? 'bg-foreground text-surface border-foreground'
                : 'bg-surface text-muted border-border hover:text-foreground'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {isLoading ? (
        <LoadingState message="Loading global settings…" />
      ) : (
        <form onSubmit={handleSave} className="space-y-6">
          {/* TAB 1: Identity & Profile */}
          {activeTab === 'identity' && (
            <div className="space-y-6">
              <Card
                title="Personal Identity & Branding"
                description="Core attributes displayed on hero, navbar, contact, and footer."
              >
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Field label="Full name" required>
                      <Input
                        value={form.fullName}
                        onChange={(e) => setForm((prev) => ({ ...prev, fullName: e.target.value }))}
                        placeholder="Amir Elrefai"
                        required
                      />
                    </Field>

                    <Field label="Job title" required>
                      <Input
                        value={form.jobTitle}
                        onChange={(e) => setForm((prev) => ({ ...prev, jobTitle: e.target.value }))}
                        placeholder="AI Engineer & Systems Analyst"
                        required
                      />
                    </Field>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Field label="Browser window & site title" hint="Meta title for tab">
                      <Input
                        value={form.siteTitle}
                        onChange={(e) => setForm((prev) => ({ ...prev, siteTitle: e.target.value }))}
                        placeholder="Amir Elrefai | AI Engineer"
                      />
                    </Field>

                    <Field label="Location" hint="Displayed in footer">
                      <Input
                        value={form.location}
                        onChange={(e) => setForm((prev) => ({ ...prev, location: e.target.value }))}
                        placeholder="Mansoura, Egypt"
                      />
                    </Field>
                  </div>

                  <Field label="Hero & profile portrait" hint="Visible on the public hero section and meta previews">
                    <div className="flex items-center gap-4 p-3 rounded-lg border border-border bg-surface-muted/30">
                      <img
                        src={form.heroImage || '/hero.webp'}
                        alt="Hero preview"
                        className="w-14 h-14 rounded-lg object-cover border border-border bg-surface shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-foreground truncate">{form.heroImage || '/hero.webp'}</p>
                        <p className="text-[11px] text-muted">Configured in Hero &amp; Highlights tab or editable directly</p>
                      </div>
                      <Button
                        type="button"
                        variant="secondary"
                        onClick={() => setActiveTab('hero')}
                        className="text-xs shrink-0"
                      >
                        Change portrait
                      </Button>
                    </div>
                  </Field>

                  <Field label="Bio summary" hint="High-level engineering summary used across channels">
                    <Textarea
                      value={form.bio}
                      onChange={(e) => setForm((prev) => ({ ...prev, bio: e.target.value }))}
                      placeholder="AI Engineer and Systems Analyst specializing in Deep Learning, Computer Vision, and Generative AI..."
                      rows={3}
                    />
                  </Field>
                </div>
              </Card>

              <Card
                title="Direct Contact Coordinates"
                description="Contact channels shown on public Contact section cards."
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Field label="Primary email" required hint="Used for direct mailto links">
                    <Input
                      type="email"
                      value={form.email}
                      onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
                      placeholder="amir.elrefai.dev@gmail.com"
                      required
                    />
                  </Field>

                  <Field label="Phone / WhatsApp" hint="Include country code, e.g. +201023524477">
                    <Input
                      value={form.phone}
                      onChange={(e) => setForm((prev) => ({ ...prev, phone: e.target.value }))}
                      placeholder="+201023524477"
                    />
                  </Field>
                </div>
              </Card>
            </div>
          )}

          {/* TAB 2: Links & Socials */}
          {activeTab === 'socials' && (
            <Card
              title="Social Media & Resume Links"
              description="Direct URLs for public action buttons and social icons."
            >
              <div className="space-y-4">
                <Field
                  label="CV / Resume download URL"
                  hint="Public Google Drive or hosted PDF link opened by 'Download CV' buttons"
                >
                  <Input
                    value={form.resumeUrl}
                    onChange={(e) => setForm((prev) => ({ ...prev, resumeUrl: e.target.value }))}
                    placeholder="https://drive.google.com/file/d/..."
                  />
                </Field>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Field label="GitHub profile URL">
                    <Input
                      value={form.githubUrl}
                      onChange={(e) => setForm((prev) => ({ ...prev, githubUrl: e.target.value }))}
                      placeholder="https://github.com/amerelfalwo"
                    />
                  </Field>

                  <Field label="LinkedIn profile URL">
                    <Input
                      value={form.linkedinUrl}
                      onChange={(e) => setForm((prev) => ({ ...prev, linkedinUrl: e.target.value }))}
                      placeholder="https://www.linkedin.com/in/amir-elrefai..."
                    />
                  </Field>

                  <Field label="Facebook profile URL">
                    <Input
                      value={form.facebookUrl}
                      onChange={(e) => setForm((prev) => ({ ...prev, facebookUrl: e.target.value }))}
                      placeholder="https://www.facebook.com/amir.elref3i"
                    />
                  </Field>

                  <Field label="Instagram profile URL">
                    <Input
                      value={form.instagramUrl}
                      onChange={(e) => setForm((prev) => ({ ...prev, instagramUrl: e.target.value }))}
                      placeholder="https://www.instagram.com/amir.elref3i/"
                    />
                  </Field>

                  <Field label="Twitter / X profile URL (optional)">
                    <Input
                      value={form.twitterUrl}
                      onChange={(e) => setForm((prev) => ({ ...prev, twitterUrl: e.target.value }))}
                      placeholder="https://x.com/..."
                    />
                  </Field>
                </div>
              </div>
            </Card>
          )}

          {/* TAB 3: Hero & Highlights */}
          {activeTab === 'hero' && (
            <div className="space-y-6">
              <Card
                title="Hero Studio Portrait"
                description="The primary portrait displayed on the right of the Hero section."
              >
                <div className="space-y-4">
                  <ImageUpload
                    value={form.heroImage}
                    onUploadComplete={(url) => setForm((prev) => ({ ...prev, heroImage: url }))}
                    label="Hero portrait image"
                  />
                  <div className="flex items-center justify-between text-xs text-muted">
                    <span>Active file: <code className="text-foreground">{form.heroImage || '/hero.webp'}</code></span>
                    {form.heroImage !== '/hero.webp' && (
                      <button
                        type="button"
                        onClick={() => setForm((prev) => ({ ...prev, heroImage: '/hero.webp' }))}
                        className="text-foreground hover:underline cursor-pointer"
                      >
                        Reset to default (/hero.webp)
                      </button>
                    )}
                  </div>
                </div>
              </Card>

              <Card
                title="Hero Display Settings"
                description="Controls the pill badge text and dynamic stat counters."
              >
                <div className="space-y-6">
                  <Field label="Hero status badge" hint="e.g. AI COMMAND CENTER, SYSTEM ONLINE">
                    <Input
                      value={form.heroBadgeText}
                      onChange={(e) => setForm((prev) => ({ ...prev, heroBadgeText: e.target.value }))}
                      placeholder="AI COMMAND CENTER"
                    />
                  </Field>

                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h4 className="text-sm font-medium text-foreground">Hero Stat Cards</h4>
                        <p className="text-xs text-muted">
                          Displayed at the top of the hero section.
                        </p>
                      </div>
                      <Button type="button" variant="secondary" onClick={handleAddStat}>
                        <Plus size={14} />
                        <span>Add stat</span>
                      </Button>
                    </div>

                    <div className="space-y-3">
                      {form.heroStats.map((stat, idx) => (
                        <div
                          key={idx}
                          className="flex items-center gap-3 p-3 rounded-lg border border-border bg-surface"
                        >
                          <div className="w-24 shrink-0">
                            <Input
                              value={stat.title}
                              onChange={(e) => handleStatChange(idx, 'title', e.target.value)}
                              placeholder="+19 or 2+"
                            />
                          </div>
                          <div className="flex-1">
                            <Input
                              value={stat.description}
                              onChange={(e) => handleStatChange(idx, 'description', e.target.value)}
                              placeholder="Projects completed"
                            />
                          </div>
                          <button
                            type="button"
                            onClick={() => handleRemoveStat(idx)}
                            className="p-2 text-muted hover:text-red-600 rounded transition-colors shrink-0"
                            title="Remove stat"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          )}

          {/* TAB 4: AI Assistant Knowledge */}
          {activeTab === 'ai' && (
            <div className="space-y-6">
              <Card
                title="AI Assistant Knowledge & Persona Protocol"
                description="Defines the behavior, response style, career narrative, and guardrails for the portfolio chat assistant."
              >
                <div className="space-y-4">
                  <Field
                    label="Chatbot system instructions & knowledge base"
                    hint="Markdown formatted prompt injected into every visitor conversation."
                  >
                    <Textarea
                      value={form.chatbotKnowledge}
                      onChange={(e) => setForm((prev) => ({ ...prev, chatbotKnowledge: e.target.value }))}
                      placeholder="### SYSTEM INSTRUCTIONS & BEHAVIORAL PROTOCOLS..."
                      rows={12}
                      className="font-mono text-xs leading-relaxed"
                    />
                  </Field>

                  <Field
                    label="Curriculum Vitae (Markdown Source)"
                    hint="Full technical resume text reference for the chat assistant to answer detailed questions."
                  >
                    <Textarea
                      value={form.cvText}
                      onChange={(e) => setForm((prev) => ({ ...prev, cvText: e.target.value }))}
                      placeholder="# AMIR ELFALW - AI ENGINEER & SYSTEMS ANALYST..."
                      rows={10}
                      className="font-mono text-xs leading-relaxed"
                    />
                  </Field>
                </div>
              </Card>
            </div>
          )}

          <div className="flex items-center justify-end pt-4 border-t border-border">
            <Button type="submit" disabled={saving}>
              <Save size={14} />
              <span>{saving ? 'Saving…' : 'Save all settings'}</span>
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}
