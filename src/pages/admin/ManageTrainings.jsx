import { useState } from 'react';
import { useTrainings } from '../../hooks/useData';
import { m, AnimatePresence } from 'framer-motion';
import {
  Plus, Edit2, Trash2, X, BookOpen, CheckCircle2, Clock, Calendar, ExternalLink, XCircle
} from 'lucide-react';
import { authFetch } from '../../lib/authFetch';

const ManageTrainings = () => {
  const { trainings, isLoading, mutate } = useTrainings();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  // Form State
  const [title, setTitle] = useState('');
  const [provider, setProvider] = useState('');
  const [duration, setDuration] = useState('');
  const [description, setDescription] = useState('');
  const [skillsListed, setSkillsListed] = useState('');
  const [isCompleted, setIsCompleted] = useState(false);
  const [certificateUrl, setCertificateUrl] = useState('');
  const [status, setStatus] = useState('Actively Relevant');

  const openCreateModal = () => {
    setEditingId(null);
    setTitle('');
    setProvider('');
    setDuration('');
    setDescription('');
    setSkillsListed('');
    setIsCompleted(false);
    setCertificateUrl('');
    setStatus('Actively Relevant');
    setErrorMessage(null);
    setIsModalOpen(true);
  };

  const openEditModal = (training) => {
    setEditingId(training.id || training._id);
    setTitle(training.title || '');
    setProvider(training.provider || '');
    setDuration(training.duration || '');
    setDescription(training.description || '');
    setSkillsListed((training.skillsListed || []).join(', '));
    setIsCompleted(training.isCompleted || false);
    setCertificateUrl(training.certificateUrl || '');
    setStatus(training.status || 'Actively Relevant');
    setErrorMessage(null);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
    setErrorMessage(null);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMessage(null);

    const payload = {
      title,
      provider,
      duration,
      description,
      skillsListed: skillsListed
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean),
      isCompleted,
      certificateUrl,
      status,
    };

    try {
      const url = editingId
        ? `/api/collection?name=trainings&id=${editingId}`
        : '/api/collection?name=trainings';
      const method = editingId ? 'PUT' : 'POST';

      const res = await authFetch(url, {
        method,
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to save training');
      }

      await mutate();
      closeModal();
    } catch (err) {
      console.error('Save Training Error:', err);
      setErrorMessage(err.message || 'Operation failed');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this training?')) return;

    try {
      const res = await authFetch(`/api/collection?name=trainings&id=${id}`, {
        method: 'DELETE',
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to delete training');
      }

      await mutate();
    } catch (err) {
      alert(`Delete Error: ${err.message}`);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <p className="text-slate-400 text-sm">
            Manage your training programs, courses, and professional development activities.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="flex items-center gap-2.5 px-6 py-3.5 rounded-2xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-black uppercase tracking-wider transition-all shadow-lg shadow-purple-500/20 cursor-pointer"
        >
          <Plus size={18} />
          <span>Add Training</span>
        </button>
      </div>

      {/* Grid View */}
      {isLoading ? (
        <div className="grid md:grid-cols-2 gap-6 animate-pulse">
          {[1, 2].map((i) => (
            <div key={i} className="h-64 rounded-3xl bg-slate-900/40 border border-slate-800" />
          ))}
        </div>
      ) : trainings.length === 0 ? (
        <div className="text-center py-20 border border-slate-800 rounded-3xl bg-slate-900/20">
          <BookOpen className="w-12 h-12 text-slate-600 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-slate-300">No Trainings Found</h3>
          <p className="text-slate-500 text-xs mt-1">Click "Add Training" above to record your courses.</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {trainings.map((training) => (
            <m.div
              key={training.id || training._id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="group relative rounded-3xl bg-slate-900/60 border border-slate-800 hover:border-purple-500/40 p-6 flex flex-col justify-between transition-all duration-300 backdrop-blur-md shadow-lg"
            >
              <div>
                {/* Header row: Status & Duration */}
                <div className="flex items-center justify-between mb-4">
                  <span
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider font-mono ${
                      training.isCompleted
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                    }`}
                  >
                    {training.isCompleted ? <CheckCircle2 size={12} /> : <Clock size={12} />}
                    {training.isCompleted ? 'Completed' : training.status || 'In Progress'}
                  </span>

                  {training.duration && (
                    <span className="text-slate-400 text-xs font-mono flex items-center gap-1.5">
                      <Calendar size={13} className="text-slate-500" />
                      {training.duration}
                    </span>
                  )}
                </div>

                <h3 className="text-lg font-bold text-white mb-1 leading-snug">{training.title}</h3>
                <p className="text-purple-400/80 font-bold uppercase text-[10px] tracking-widest mb-3">
                  {training.provider || 'Provider'}
                </p>

                {training.description && (
                  <p className="text-slate-400 text-sm leading-relaxed mb-4 line-clamp-3">{training.description}</p>
                )}

                {/* Skills Tags */}
                {training.skillsListed && training.skillsListed.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {training.skillsListed.slice(0, 6).map((skill, i) => (
                      <span
                        key={i}
                        className="px-2.5 py-1 rounded-lg bg-slate-800/60 border border-slate-700/50 text-[10px] font-mono text-cyan-300/80"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Actions Footer */}
              <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between">
                {training.certificateUrl ? (
                  <a
                    href={training.certificateUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs font-bold text-cyan-400 hover:underline flex items-center gap-1.5"
                  >
                    <span>View Certificate</span>
                    <ExternalLink size={13} />
                  </a>
                ) : (
                  <div />
                )}

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => openEditModal(training)}
                    className="p-2 rounded-xl bg-slate-800/60 border border-slate-700 hover:border-cyan-400 text-cyan-300 transition-colors cursor-pointer"
                    title="Edit Training"
                  >
                    <Edit2 size={14} />
                  </button>
                  <button
                    onClick={() => handleDelete(training.id || training._id)}
                    className="p-2 rounded-xl bg-slate-800/60 border border-slate-700 hover:border-red-500 text-red-400 transition-colors cursor-pointer"
                    title="Delete Training"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </m.div>
          ))}
        </div>
      )}

      {/* Modal Dialog */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
            <m.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <h3 className="text-lg font-bold text-white uppercase font-mono">
                  {editingId ? 'Edit Training' : 'Add New Training'}
                </h3>
                <button onClick={closeModal} className="p-2 text-slate-400 hover:text-white rounded-xl bg-slate-800/50">
                  <X size={18} />
                </button>
              </div>

              {errorMessage && (
                <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-mono font-bold">
                  {errorMessage}
                </div>
              )}

              <form onSubmit={handleSave} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase text-slate-400 font-mono">Training Title</label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 px-4 text-white text-sm focus:border-cyan-400 focus:outline-none"
                    placeholder="Deep Learning Specialization"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase text-slate-400 font-mono">Provider / Platform</label>
                  <input
                    type="text"
                    value={provider}
                    onChange={(e) => setProvider(e.target.value)}
                    required
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 px-4 text-white text-sm focus:border-purple-400 focus:outline-none"
                    placeholder="Coursera / Udemy / DeepLearning.AI"
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase text-slate-400 font-mono">Duration</label>
                    <input
                      type="text"
                      value={duration}
                      onChange={(e) => setDuration(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 px-4 text-white text-sm focus:border-cyan-400 focus:outline-none"
                      placeholder="3 months / 40 hours"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase text-slate-400 font-mono">Status</label>
                    <select
                      value={status}
                      onChange={(e) => setStatus(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 px-4 text-white text-sm focus:border-cyan-400 focus:outline-none"
                    >
                      <option value="Actively Relevant">Actively Relevant</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Completed">Completed</option>
                      <option value="Paused">Paused</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase text-slate-400 font-mono">Description</label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={3}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 px-4 text-white text-sm focus:border-purple-400 focus:outline-none resize-none"
                    placeholder="Comprehensive deep learning specialization covering CNNs, RNNs, and Transformers..."
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase text-slate-400 font-mono">Skills Covered (comma-separated)</label>
                  <input
                    type="text"
                    value={skillsListed}
                    onChange={(e) => setSkillsListed(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 px-4 text-white text-sm focus:border-cyan-400 focus:outline-none"
                    placeholder="Python, TensorFlow, Neural Networks"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase text-slate-400 font-mono">Certificate URL (optional)</label>
                  <input
                    type="url"
                    value={certificateUrl}
                    onChange={(e) => setCertificateUrl(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 px-4 text-white text-sm focus:border-cyan-400 focus:outline-none"
                    placeholder="https://coursera.org/verify/..."
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="flex items-center gap-3 p-3 rounded-xl bg-slate-950 border border-slate-800 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isCompleted}
                      onChange={(e) => setIsCompleted(e.target.checked)}
                      className="w-4 h-4 rounded text-purple-600 focus:ring-purple-500"
                    />
                    <span className="text-xs font-bold text-slate-300">Mark as Completed</span>
                  </label>
                </div>

                <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-800">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold uppercase tracking-wider"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-6 py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-black uppercase tracking-wider disabled:opacity-50"
                  >
                    {submitting ? 'Saving...' : editingId ? 'Update Training' : 'Add Training'}
                  </button>
                </div>
              </form>
            </m.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ManageTrainings;
