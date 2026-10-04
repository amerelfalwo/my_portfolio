import { useState, useEffect } from 'react';
import { useSettings } from '../../hooks/useData';
import { m } from 'framer-motion';
import { 
  Settings as SettingsIcon, Save, CheckCircle2, ShieldAlert, User, Briefcase, 
  FileText, Link2, Github, Linkedin, Twitter, Facebook, Instagram, Image as ImageIcon, Sparkles, Globe,
  Brain, Award, Terminal, Cpu, Code, Zap, Layers, Plus, Trash2, Bot
} from 'lucide-react';
import { authFetch } from '../../lib/authFetch';
import ImageUpload from '../../components/admin/ImageUpload';

const DEFAULT_HERO_STATS = [
  { title: '1+ Year XP', description: 'AI & CV Specialist', iconName: 'Brain' },
  { title: '8+ Certifications', description: 'Industry credentials', iconName: 'Award' },
  { title: 'Linux Admin', description: 'Systems Optimization', iconName: 'Terminal' },
  { title: 'IoT & Edge AI', description: 'Smart Ecosystems', iconName: 'Cpu' },
];

const ICON_OPTIONS = [
  { id: 'Brain', label: 'Brain / Neural' },
  { id: 'Award', label: 'Award / Cert' },
  { id: 'Terminal', label: 'Terminal / CLI' },
  { id: 'Cpu', label: 'CPU / Hardware' },
  { id: 'Code', label: 'Code / Dev' },
  { id: 'Zap', label: 'Zap / Speed' },
  { id: 'Globe', label: 'Globe / Web' },
  { id: 'Layers', label: 'Layers / Arch' },
];

const ManageSettings = () => {
  const { settings, isLoading, mutate } = useSettings();

  const [fullName, setFullName] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [siteTitle, setSiteTitle] = useState('');
  const [heroBadgeText, setHeroBadgeText] = useState('');
  const [bio, setBio] = useState('');
  const [resumeUrl, setResumeUrl] = useState('');
  const [cvText, setCvText] = useState('');
  const [chatbotKnowledge, setChatbotKnowledge] = useState('');
  const [profileImageUrl, setProfileImageUrl] = useState('');
  const [siteLogoUrl, setSiteLogoUrl] = useState('');
  const [logoText, setLogoText] = useState('');
  const [typewriterInput, setTypewriterInput] = useState('');

  const [githubUrl, setGithubUrl] = useState('');
  const [linkedinUrl, setLinkedinUrl] = useState('');
  const [twitterUrl, setTwitterUrl] = useState('');
  const [facebookUrl, setFacebookUrl] = useState('');
  const [instagramUrl, setInstagramUrl] = useState('');

  const [heroStats, setHeroStats] = useState(DEFAULT_HERO_STATS);

  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => {
    if (settings) {
      setFullName(settings.fullName || settings.name || '');
      setJobTitle(settings.jobTitle || '');
      setSiteTitle(settings.siteTitle || '');
      setHeroBadgeText(settings.heroBadgeText || 'AI COMMAND CENTER');
      setBio(settings.bio || '');
      setResumeUrl(settings.resumeUrl || settings.cvUrl || '');
      setCvText(settings.cvText || '');
      setChatbotKnowledge(settings.chatbotKnowledge || '');
      setProfileImageUrl(settings.profileImageUrl || settings.heroImage || '');
      setSiteLogoUrl(settings.siteLogoUrl || '');
      setLogoText(settings.logoText || 'AMIR.AURA');

      const words = settings.typewriterWords || [];
      setTypewriterInput(Array.isArray(words) ? words.join(', ') : '');

      const socials = settings.socialLinks || {};
      setGithubUrl(socials.github || settings.githubUrl || '');
      setLinkedinUrl(socials.linkedin || 'https://www.linkedin.com/in/amir-elrefai-b3a3212b8/?isSelfProfile=true');
      setTwitterUrl(socials.twitter || '');
      setFacebookUrl(socials.facebook || 'https://www.facebook.com/amir.elref3i');
      setInstagramUrl(socials.instagram || 'https://www.instagram.com/amir.elref3i/');

      if (Array.isArray(settings.heroStats) && settings.heroStats.length > 0) {
        setHeroStats(settings.heroStats);
      } else {
        setHeroStats(DEFAULT_HERO_STATS);
      }
    }
  }, [settings]);

  const handleStatChange = (index, field, value) => {
    setHeroStats((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const handleAddStatCard = () => {
    setHeroStats((prev) => [
      ...prev,
      { title: 'New Stat', description: 'Description', iconName: 'Brain' },
    ]);
  };

  const handleRemoveStatCard = (index) => {
    setHeroStats((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSuccessMsg(null);
    setErrorMsg(null);

    const typewriterWords = typewriterInput
      ? typewriterInput.split(',').map((w) => w.trim()).filter(Boolean)
      : [];

    const payload = {
      fullName,
      jobTitle,
      siteTitle,
      heroBadgeText: heroBadgeText || 'AI COMMAND CENTER',
      bio,
      resumeUrl,
      cvText,
      chatbotKnowledge,
      profileImageUrl,
      heroImage: profileImageUrl,
      siteLogoUrl,
      logoText: logoText || 'AMIR.AURA',
      typewriterWords,
      heroStats,
      socialLinks: {
        github: githubUrl,
        linkedin: linkedinUrl,
        twitter: twitterUrl,
        facebook: facebookUrl,
        instagram: instagramUrl,
      },
    };

    try {
      const settingId = settings?.id || settings?._id;
      const url = settingId ? `/api/settings?id=${settingId}` : '/api/settings';
      const method = settingId ? 'PUT' : 'POST';

      const res = await authFetch(url, {
        method,
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to update settings.');
      }

      setSuccessMsg('Portfolio & AI Chatbot Knowledge settings updated successfully!');
      await mutate();
    } catch (err) {
      console.error('Settings Update Error:', err);
      setErrorMsg(err.message || 'Operation failed.');
    } finally {
      setSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto space-y-6 animate-pulse">
        <div className="h-10 w-48 bg-slate-900/60 rounded-xl" />
        <div className="h-96 w-full bg-slate-900/40 rounded-3xl border border-slate-800" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-slate-400 text-sm">Control Hero avatar, bio, CV details, AI chatbot knowledge base, and social links.</p>
        </div>
      </div>

      {/* Notifications */}
      {successMsg && (
        <m.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center gap-3 text-emerald-400 text-xs font-bold font-mono uppercase"
        >
          <CheckCircle2 size={18} />
          <span>{successMsg}</span>
        </m.div>
      )}

      {errorMsg && (
        <m.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 rounded-2xl bg-red-500/10 border border-red-500/30 flex items-center gap-3 text-red-400 text-xs font-mono font-bold uppercase"
        >
          <ShieldAlert size={18} />
          <span>{errorMsg}</span>
        </m.div>
      )}

      {/* Settings Form Card */}
      <form onSubmit={handleSave} className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-3xl p-6 md:p-10 space-y-8 shadow-2xl">
        
        {/* Section 1: Hero Media & Branding (Avatar + Site Logo) */}
        <div className="space-y-6">
          <div className="flex items-center gap-3 border-b border-slate-800 pb-3">
            <ImageIcon className="text-purple-400 w-5 h-5" />
            <h3 className="text-sm font-bold text-white uppercase font-mono tracking-wider">
              Hero Avatar & Site Logo Upload
            </h3>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <ImageUpload
              value={profileImageUrl}
              onUploadComplete={(url) => setProfileImageUrl(url)}
              label="Hero Profile Avatar / Image"
            />

            <ImageUpload
              value={siteLogoUrl}
              onUploadComplete={(url) => setSiteLogoUrl(url)}
              label="Custom Site Brand Logo"
            />
          </div>
        </div>

        {/* Section 2: Basic Identity & Browser Tab Title */}
        <div className="space-y-6 pt-2">
          <div className="flex items-center gap-3 border-b border-slate-800 pb-3">
            <User className="text-cyan-400 w-5 h-5" />
            <h3 className="text-sm font-bold text-white uppercase font-mono tracking-wider">
              Identity & Eyebrow Badge
            </h3>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] ml-1 font-mono">
                Top Eyebrow Badge Text
              </label>
              <input 
                type="text" 
                value={heroBadgeText} 
                onChange={(e) => setHeroBadgeText(e.target.value)} 
                className="w-full bg-slate-950 border border-slate-800 rounded-2xl py-3.5 px-4 text-white text-sm font-mono focus:border-cyan-400 focus:outline-none transition-all" 
                placeholder="AI COMMAND CENTER" 
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] ml-1 font-mono">
                Browser Tab Title (HTML Document Title)
              </label>
              <input 
                type="text" 
                value={siteTitle} 
                onChange={(e) => setSiteTitle(e.target.value)} 
                className="w-full bg-slate-950 border border-slate-800 rounded-2xl py-3.5 px-4 text-white text-sm font-mono focus:border-purple-400 focus:outline-none transition-all" 
                placeholder="Amir Elrefai | AI & ML Engineer Portfolio" 
              />
            </div>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6 mt-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] ml-1 font-mono">
                Full Logo Text
              </label>
              <input 
                type="text" 
                value={logoText} 
                onChange={(e) => setLogoText(e.target.value)} 
                className="w-full bg-slate-950 border border-slate-800 rounded-2xl py-3.5 px-4 text-white text-sm font-mono focus:border-cyan-400 focus:outline-none transition-all" 
                placeholder="AMIR.AURA" 
              />
              <p className="text-[10px] text-slate-500 mt-1 ml-1">Appears in the Navbar and Footer</p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] ml-1 font-mono">
                Full Name
              </label>
              <input 
                type="text" 
                value={fullName} 
                onChange={(e) => setFullName(e.target.value)} 
                required 
                className="w-full bg-slate-950 border border-slate-800 rounded-2xl py-3.5 px-4 text-white text-sm font-bold focus:border-purple-400 focus:outline-none transition-all" 
                placeholder="Amir Elrefai" 
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] ml-1 font-mono">
                Job Title / Primary Subtitle
              </label>
              <input 
                type="text" 
                value={jobTitle} 
                onChange={(e) => setJobTitle(e.target.value)} 
                required 
                className="w-full bg-slate-950 border border-slate-800 rounded-2xl py-3.5 px-4 text-white text-sm font-bold focus:border-cyan-400 focus:outline-none transition-all" 
                placeholder="AI Architecture & Engineering" 
              />
            </div>
          </div>
        </div>

        {/* Section 3: Typewriter Animation Keywords & Bio */}
        <div className="space-y-6 pt-2">
          <div className="flex items-center gap-3 border-b border-slate-800 pb-3">
            <Sparkles className="text-purple-400 w-5 h-5" />
            <h3 className="text-sm font-bold text-white uppercase font-mono tracking-wider">
              Hero Typewriter Keywords & Bio
            </h3>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] ml-1 font-mono">
              Typewriter Words (Comma Separated)
            </label>
            <input 
              type="text" 
              value={typewriterInput} 
              onChange={(e) => setTypewriterInput(e.target.value)} 
              className="w-full bg-slate-950 border border-slate-800 rounded-2xl py-3.5 px-4 text-white text-sm font-mono focus:border-cyan-400 focus:outline-none transition-all" 
              placeholder="Deep Learning Specialist, Computer Vision Expert, AI Agent Architect" 
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] ml-1 font-mono">
              Professional Bio Paragraph
            </label>
            <textarea 
              rows={4} 
              value={bio} 
              onChange={(e) => setBio(e.target.value)} 
              required 
              className="w-full bg-slate-950 border border-slate-800 rounded-2xl py-3.5 px-4 text-white text-sm font-medium focus:border-purple-400 focus:outline-none transition-all leading-relaxed" 
              placeholder="Passionate AI Engineer specializing in Deep Learning, Computer Vision, and Generative AI..." 
            />
          </div>
        </div>

        {/* Section 4: Interactive Hero 4 Stat Cards Manager */}
        <div className="space-y-6 pt-2">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-3">
              <Zap className="text-cyan-400 w-5 h-5" />
              <h3 className="text-sm font-bold text-white uppercase font-mono tracking-wider">
                Hero Stat Cards Grid (Bottom 4 Cards)
              </h3>
            </div>
            <button
              type="button"
              onClick={handleAddStatCard}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 text-[10px] font-bold uppercase font-mono transition-all cursor-pointer"
            >
              <Plus size={14} /> Add Card
            </button>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {heroStats.map((stat, idx) => (
              <div key={idx} className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3 relative group">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold uppercase text-purple-400">
                    Stat Card #{idx + 1}
                  </span>
                  {heroStats.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveStatCard(idx)}
                      className="p-1 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                      title="Remove Stat Card"
                    >
                      <Trash2 size={13} />
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[9px] font-mono uppercase text-slate-400 font-bold">Title / Headline</label>
                    <input
                      type="text"
                      value={stat.title}
                      onChange={(e) => handleStatChange(idx, 'title', e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl py-2 px-3 text-white text-xs font-bold focus:border-cyan-400 focus:outline-none"
                      placeholder="1+ Year XP"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[9px] font-mono uppercase text-slate-400 font-bold">Icon</label>
                    <select
                      value={stat.iconName || 'Brain'}
                      onChange={(e) => handleStatChange(idx, 'iconName', e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl py-2 px-3 text-white text-xs font-mono focus:border-cyan-400 focus:outline-none"
                    >
                      {ICON_OPTIONS.map((opt) => (
                        <option key={opt.id} value={opt.id}>{opt.label}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] font-mono uppercase text-slate-400 font-bold">Subtitle / Description</label>
                  <input
                    type="text"
                    value={stat.description}
                    onChange={(e) => handleStatChange(idx, 'description', e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl py-2 px-3 text-white text-xs font-medium focus:border-purple-400 focus:outline-none"
                    placeholder="AI & CV Specialist"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Section 5: Resume & Social Profiles */}
        <div className="space-y-6 pt-2">
          <div className="flex items-center gap-3 border-b border-slate-800 pb-3">
            <Link2 className="text-cyan-400 w-5 h-5" />
            <h3 className="text-sm font-bold text-white uppercase font-mono tracking-wider">
              Resume & Social Accounts
            </h3>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] ml-1 font-mono">
              Resume / CV Download URL
            </label>
            <input 
              type="url" 
              value={resumeUrl} 
              onChange={(e) => setResumeUrl(e.target.value)} 
              className="w-full bg-slate-950 border border-slate-800 rounded-2xl py-3.5 px-4 text-white text-sm font-mono focus:border-cyan-400 focus:outline-none transition-all" 
              placeholder="https://drive.google.com/file/d/..." 
            />
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] ml-1 font-mono flex items-center gap-1.5">
                <Linkedin size={12} /> LinkedIn
              </label>
              <input 
                type="url" 
                value={linkedinUrl} 
                onChange={(e) => setLinkedinUrl(e.target.value)} 
                className="w-full bg-slate-950 border border-slate-800 rounded-2xl py-3.5 px-4 text-white text-xs font-mono focus:border-cyan-400 focus:outline-none" 
                placeholder="https://linkedin.com/in/username" 
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] ml-1 font-mono flex items-center gap-1.5">
                <Facebook size={12} /> Facebook
              </label>
              <input 
                type="url" 
                value={facebookUrl} 
                onChange={(e) => setFacebookUrl(e.target.value)} 
                className="w-full bg-slate-950 border border-slate-800 rounded-2xl py-3.5 px-4 text-white text-xs font-mono focus:border-purple-400 focus:outline-none" 
                placeholder="https://facebook.com/username" 
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] ml-1 font-mono flex items-center gap-1.5">
                <Instagram size={12} /> Instagram
              </label>
              <input 
                type="url" 
                value={instagramUrl} 
                onChange={(e) => setInstagramUrl(e.target.value)} 
                className="w-full bg-slate-950 border border-slate-800 rounded-2xl py-3.5 px-4 text-white text-xs font-mono focus:border-pink-400 focus:outline-none" 
                placeholder="https://instagram.com/username" 
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] ml-1 font-mono flex items-center gap-1.5">
                <Github size={12} /> GitHub
              </label>
              <input 
                type="url" 
                value={githubUrl} 
                onChange={(e) => setGithubUrl(e.target.value)} 
                className="w-full bg-slate-950 border border-slate-800 rounded-2xl py-3.5 px-4 text-white text-xs font-mono focus:border-purple-400 focus:outline-none" 
                placeholder="https://github.com/username" 
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] ml-1 font-mono flex items-center gap-1.5">
                <Twitter size={12} /> Twitter / X
              </label>
              <input 
                type="url" 
                value={twitterUrl} 
                onChange={(e) => setTwitterUrl(e.target.value)} 
                className="w-full bg-slate-950 border border-slate-800 rounded-2xl py-3.5 px-4 text-white text-xs font-mono focus:border-purple-400 focus:outline-none" 
                placeholder="https://x.com/username" 
              />
            </div>
          </div>
        </div>

        {/* Section 6: AI Chatbot Assistant Knowledge Base & CV Content */}
        <div className="space-y-6 pt-4 border-t border-slate-800/80">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-3">
              <Bot className="text-cyan-400 w-5 h-5" />
              <h3 className="text-sm font-bold text-white uppercase font-mono tracking-wider">
                AI Chatbot Knowledge Base & CV Information
              </h3>
            </div>
            <button
              type="button"
              onClick={() => {
                if (!cvText) {
                  setCvText(`SUMMARY:
Amir Elrefai is a passionate AI & Machine Learning Engineer specializing in Deep Learning, Computer Vision, and AI Systems.

EXPERIENCE:
- AI Engineer | Freelance / Projects (2023 - Present): Developed custom Computer Vision pipelines using YOLO v11 and OpenCV, built real-time AI agents using LangChain, and deployed full-stack web applications.
- Lead AI Developer: Built high-accuracy neural network models for image classification, object detection, and feature extraction.

EDUCATION:
- B.Sc. in Computer Science | Mansoura University (2020 - 2024)

TECHNICAL SKILLS:
- Frameworks: PyTorch, TensorFlow, OpenCV, YOLO, LangChain, FastAPI, React, Node.js
- Languages: Python, C++, SQL, JavaScript/TypeScript, C#
- Infrastructure: Docker, Git, Linux (Ubuntu), Vector DB (Qdrant), MongoDB, PostgreSQL`);
                }

                if (!chatbotKnowledge) {
                  setChatbotKnowledge(`CAREER PREFERENCES:
- Open to Full-time, Remote, Onsite, or Relocation AI Engineering & Computer Vision roles worldwide.

CONVERSATION INSTRUCTIONS:
- Always highlight Amir's expertise in Computer Vision, Deep Learning, and AI Agents.
- Be polite, encouraging, and invite visitors to connect with Amir via LinkedIn or GitHub.`);
                }
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-600/20 hover:bg-purple-600/40 border border-purple-500/30 text-purple-300 text-[10px] font-bold uppercase font-mono transition-all cursor-pointer"
            >
              <Sparkles size={13} /> Load Sample Template
            </button>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] ml-1 font-mono flex items-center gap-1.5">
              <FileText size={13} className="text-purple-400" /> Full CV Content & Work Experience Details
            </label>
            <textarea 
              rows={6} 
              value={cvText} 
              onChange={(e) => setCvText(e.target.value)} 
              className="w-full bg-slate-950 border border-slate-800 rounded-2xl py-3.5 px-4 text-white text-xs font-mono focus:border-purple-400 focus:outline-none transition-all leading-relaxed" 
              placeholder="Paste or write full CV details here (Work History, AI Achievements, Key Projects, Tech Stack, Education, Certifications)..." 
            />
            <p className="text-[10px] text-slate-500 ml-1">
              The AI Assistant queries this text to answer visitor questions about your CV, background, and career history.
            </p>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] ml-1 font-mono flex items-center gap-1.5">
              <Brain size={13} className="text-cyan-400" /> Custom Knowledge Base & AI Instructions
            </label>
            <textarea 
              rows={6} 
              value={chatbotKnowledge} 
              onChange={(e) => setChatbotKnowledge(e.target.value)} 
              className="w-full bg-slate-950 border border-slate-800 rounded-2xl py-3.5 px-4 text-white text-xs font-mono focus:border-cyan-400 focus:outline-none transition-all leading-relaxed" 
              placeholder="Add extra background info, career objectives, salary expectations, preferred work modes (Remote/Onsite), or specific answers for the AI Assistant..." 
            />
            <p className="text-[10px] text-slate-500 ml-1">
              Custom instructions and knowledge provided directly to the AI Assistant.
            </p>
          </div>
        </div>

        {/* Submit */}
        <div className="pt-6 border-t border-slate-800 flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-3 px-8 py-4 rounded-2xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-black uppercase tracking-[0.2em] shadow-lg shadow-purple-500/20 disabled:opacity-50 transition-all cursor-pointer"
          >
            <Save size={16} />
            <span>{saving ? 'Saving Changes...' : 'Save Settings & Knowledge Base'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default ManageSettings;

