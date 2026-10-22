import { useState, useEffect } from 'react';
import { getAboutConfig, saveAboutConfig } from '../../api';
import { m } from 'framer-motion';
import { User, Save, CheckCircle2, ShieldAlert } from 'lucide-react';

const ManageAbout = () => {
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [paragraph1, setParagraph1] = useState('');
  const [paragraph2, setParagraph2] = useState('');
  const [quote, setQuote] = useState('');
  const [yearsExp, setYearsExp] = useState('');
  const [deployments, setDeployments] = useState('');
  const [availability, setAvailability] = useState('');
  const [workTypes, setWorkTypes] = useState('');

  const [isLoading, setIsLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  const fetchAboutData = async () => {
    setIsLoading(true);
    try {
      const data = await getAboutConfig();
      if (data) {
        setTitle(data.title || '');
        setSubtitle(data.subtitle || '');
        setParagraph1(data.paragraph1 || '');
        setParagraph2(data.paragraph2 || '');
        setQuote(data.quote || '');
        setYearsExp(data.yearsExp || '');
        setDeployments(data.deployments || '');
        setAvailability(data.availability || '');
        setWorkTypes(data.workTypes || '');
      }
    } catch (err) {
      console.error(err);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchAboutData();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    const payload = {
      title, subtitle, paragraph1, paragraph2, quote, yearsExp, deployments, availability, workTypes
    };

    try {
      const res = await saveAboutConfig(payload);
      if (res?.success) {
        setSuccessMsg('About section configuration saved successfully!');
        setTimeout(() => setSuccessMsg(null), 3000);
      } else {
        setErrorMsg(res?.message || 'Failed to save configuration');
      }
    } catch (err) {
      setErrorMsg(err.message || 'An error occurred while saving.');
    } finally {
      setSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex-1 p-8 ml-64 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-cyan-500/30 border-t-cyan-400 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex-1 p-8 lg:p-12 ml-64 overflow-y-auto max-h-screen bg-[#020617] text-slate-200">
      <div className="max-w-4xl mx-auto space-y-10 pb-20">
        
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">
              <User className="text-cyan-400" size={24} />
            </div>
            <div>
              <h2 className="text-2xl font-black uppercase tracking-tight text-white">Manage About Section</h2>
              <p className="text-sm text-slate-400 font-mono mt-1">Configure your personal identity and stats</p>
            </div>
          </div>
          
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-6 py-3 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold uppercase tracking-wider transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(34,211,238,0.2)]"
          >
            {saving ? <div className="w-5 h-5 border-2 border-slate-900/30 border-t-slate-900 rounded-full animate-spin" /> : <Save size={18} />}
            {saving ? 'Saving...' : 'Save Config'}
          </button>
        </div>

        {/* Notifications */}
        {successMsg && (
          <m.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center gap-3 text-emerald-400">
            <CheckCircle2 size={18} />
            <span className="font-medium">{successMsg}</span>
          </m.div>
        )}

        {errorMsg && (
          <m.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="p-4 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center gap-3 text-red-400">
            <ShieldAlert size={18} />
            <span className="font-medium">{errorMsg}</span>
          </m.div>
        )}

        {/* Form Grid */}
        <div className="grid grid-cols-1 gap-8">
          
          {/* Main Info Box */}
          <div className="p-6 rounded-lg border border-slate-800 bg-slate-900/50 space-y-6">
            <h3 className="text-lg font-bold text-white uppercase tracking-wider mb-4 border-b border-slate-800 pb-3">Primary Info</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest font-mono">Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all font-mono text-sm"
                  placeholder="e.g. The Architect"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest font-mono">Subtitle</label>
                <input
                  type="text"
                  value={subtitle}
                  onChange={(e) => setSubtitle(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all font-mono text-sm"
                  placeholder="e.g. I build high-performance systems..."
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest font-mono">Paragraph 1</label>
              <textarea
                value={paragraph1}
                onChange={(e) => setParagraph1(e.target.value)}
                rows={3}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all text-sm leading-relaxed"
                placeholder="First paragraph of identity..."
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest font-mono">Paragraph 2</label>
              <textarea
                value={paragraph2}
                onChange={(e) => setParagraph2(e.target.value)}
                rows={3}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all text-sm leading-relaxed"
                placeholder="Second paragraph of identity..."
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest font-mono">Quote</label>
              <input
                type="text"
                value={quote}
                onChange={(e) => setQuote(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all font-mono text-sm"
                placeholder="e.g. 'Efficiency is doing things right...'"
              />
            </div>
          </div>

          {/* Stats & Availability Box */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="p-6 rounded-lg border border-slate-800 bg-slate-900/50 space-y-6">
              <h3 className="text-lg font-bold text-white uppercase tracking-wider mb-4 border-b border-slate-800 pb-3">Stats</h3>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest font-mono">Years Experience</label>
                  <input
                    type="text"
                    value={yearsExp}
                    onChange={(e) => setYearsExp(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all font-mono text-sm"
                    placeholder="e.g. 5+"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest font-mono">Deployments</label>
                  <input
                    type="text"
                    value={deployments}
                    onChange={(e) => setDeployments(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all font-mono text-sm"
                    placeholder="e.g. 50+"
                  />
                </div>
              </div>
            </div>

            <div className="p-6 rounded-lg border border-slate-800 bg-slate-900/50 space-y-6">
              <h3 className="text-lg font-bold text-white uppercase tracking-wider mb-4 border-b border-slate-800 pb-3">Status</h3>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest font-mono">Availability Text</label>
                  <input
                    type="text"
                    value={availability}
                    onChange={(e) => setAvailability(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all font-mono text-sm"
                    placeholder="e.g. Available for new opportunities"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest font-mono">Work Types</label>
                  <input
                    type="text"
                    value={workTypes}
                    onChange={(e) => setWorkTypes(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all font-mono text-sm"
                    placeholder="e.g. REMOTE / ONSITE / RELOCATION"
                  />
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ManageAbout;
