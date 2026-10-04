import { useState, useEffect } from 'react';
import { useEducationDegree } from '../../hooks/useData';
import { Link } from 'react-router-dom';
import {
  Save, GraduationCap, CheckCircle2, ShieldAlert, MapPin, Calendar, FileText, Award, ArrowRight
} from 'lucide-react';
import { authFetch } from '../../lib/authFetch';

const ManageEducation = () => {
  const { education, isLoading: eduLoading, mutate: mutateDegree } = useEducationDegree();

  // ── Education Degree Form ──
  const [degree, setDegree] = useState('');
  const [university, setUniversity] = useState('');
  const [location, setLocation] = useState('');
  const [period, setPeriod] = useState('');
  const [eduDescription, setEduDescription] = useState('');
  const [savingDegree, setSavingDegree] = useState(false);
  const [degreeSuccess, setDegreeSuccess] = useState(false);
  const [degreeError, setDegreeError] = useState(null);

  // Populate degree form from fetched data
  useEffect(() => {
    if (education) {
      setDegree(education.degree || '');
      setUniversity(education.university || '');
      setLocation(education.location || '');
      setPeriod(education.period || '');
      setEduDescription(education.description || '');
    }
  }, [education]);

  // ── Save Education Degree ──
  const handleSaveDegree = async (e) => {
    e.preventDefault();
    setSavingDegree(true);
    setDegreeError(null);
    setDegreeSuccess(false);

    try {
      const res = await authFetch('/api/config?key=educationDegree', {
        method: 'POST',
        body: JSON.stringify({
          degree,
          university,
          location,
          period,
          description: eduDescription,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to save education degree');
      }

      await mutateDegree();
      setDegreeSuccess(true);
      setTimeout(() => setDegreeSuccess(false), 3000);
    } catch (err) {
      setDegreeError(err.message);
    } finally {
      setSavingDegree(false);
    }
  };

  return (
    <div className="space-y-8 max-w-5xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-purple-500/10 border border-purple-500/20">
            <GraduationCap className="w-6 h-6 text-purple-400" />
          </div>
          <div>
            <h3 className="text-xl font-extrabold text-white uppercase font-mono tracking-tight">University Education</h3>
            <p className="text-slate-400 text-xs">Manage your degree, university name, period, and specialization details.</p>
          </div>
        </div>

        <Link
          to="/admin/dashboard/certificates"
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-purple-500/40 text-slate-300 hover:text-white text-xs font-bold transition-all"
        >
          <Award size={16} className="text-cyan-400" />
          <span>Manage Certificates</span>
          <ArrowRight size={14} className="text-slate-500" />
        </Link>
      </div>

      {degreeError && (
        <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-mono font-bold flex items-center gap-2">
          <ShieldAlert size={16} /> {degreeError}
        </div>
      )}

      {degreeSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono font-bold flex items-center gap-2">
          <CheckCircle2 size={16} /> Education degree saved successfully!
        </div>
      )}

      {eduLoading ? (
        <div className="space-y-4 animate-pulse">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-14 rounded-2xl bg-slate-900/40 border border-slate-800" />
          ))}
        </div>
      ) : (
        <form onSubmit={handleSaveDegree} className="space-y-6 p-8 rounded-3xl bg-slate-900/60 border border-slate-800 backdrop-blur-md shadow-xl">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase text-slate-300 font-mono flex items-center gap-2">
                <GraduationCap size={14} className="text-purple-400" /> Degree Title
              </label>
              <input
                type="text"
                value={degree}
                onChange={(e) => setDegree(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-2xl py-3.5 px-4 text-white text-sm focus:border-cyan-400 focus:outline-none transition-colors"
                placeholder="B.Sc. Computer Science"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase text-slate-300 font-mono flex items-center gap-2">
                <FileText size={14} className="text-cyan-400" /> University Name
              </label>
              <input
                type="text"
                value={university}
                onChange={(e) => setUniversity(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-2xl py-3.5 px-4 text-white text-sm focus:border-purple-400 focus:outline-none transition-colors"
                placeholder="Mansoura University"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase text-slate-300 font-mono flex items-center gap-2">
                <MapPin size={14} className="text-emerald-400" /> Location
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-2xl py-3.5 px-4 text-white text-sm focus:border-cyan-400 focus:outline-none transition-colors"
                placeholder="Mansoura, Egypt"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase text-slate-300 font-mono flex items-center gap-2">
                <Calendar size={14} className="text-amber-400" /> Period
              </label>
              <input
                type="text"
                value={period}
                onChange={(e) => setPeriod(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-2xl py-3.5 px-4 text-white text-sm focus:border-cyan-400 focus:outline-none transition-colors"
                placeholder="2020 — 2024"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase text-slate-300 font-mono">Degree Overview & Specialization</label>
            <textarea
              value={eduDescription}
              onChange={(e) => setEduDescription(e.target.value)}
              rows={4}
              className="w-full bg-slate-950 border border-slate-800 rounded-2xl py-3.5 px-4 text-white text-sm focus:border-purple-400 focus:outline-none resize-none transition-colors"
              placeholder="Specialized in Artificial Intelligence and High-Performance Software Engineering..."
            />
          </div>

          <div className="pt-4 flex justify-end">
            <button
              type="submit"
              disabled={savingDegree}
              className="flex items-center gap-2.5 px-8 py-3.5 rounded-2xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-black uppercase tracking-wider disabled:opacity-50 transition-all shadow-lg shadow-purple-500/20 cursor-pointer"
            >
              <Save size={16} />
              {savingDegree ? 'Saving...' : 'Save Degree Info'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default ManageEducation;

