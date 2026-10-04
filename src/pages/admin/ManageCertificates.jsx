import { useState } from 'react';
import { useCertificates } from '../../hooks/useData';
import { m, AnimatePresence } from 'framer-motion';
import { 
  Plus, Edit2, Trash2, X, Award, CheckCircle2, XCircle, Calendar, Image as ImageIcon, ExternalLink 
} from 'lucide-react';
import ImageUpload from '../../components/admin/ImageUpload';
import { authFetch } from '../../lib/authFetch';

const ManageCertificates = () => {
  const { certificates, isLoading, mutate } = useCertificates();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  // Form State
  const [title, setTitle] = useState('');
  const [issuer, setIssuer] = useState('');
  const [date, setDate] = useState('');
  const [isVerified, setIsVerified] = useState(true);
  const [imageUrl, setImageUrl] = useState('');

  const openCreateModal = () => {
    setEditingId(null);
    setTitle('');
    setIssuer('');
    setDate(new Date().toISOString().split('T')[0]);
    setIsVerified(true);
    setImageUrl('');
    setErrorMessage(null);
    setIsModalOpen(true);
  };

  const openEditModal = (cert) => {
    setEditingId(cert.id || cert._id);
    setTitle(cert.title || '');
    setIssuer(cert.issuer || cert.institution || '');
    const formattedDate = cert.date ? new Date(cert.date).toISOString().split('T')[0] : '';
    setDate(formattedDate);
    setIsVerified(cert.isVerified !== undefined ? cert.isVerified : true);
    setImageUrl(cert.imageUrl || cert.verificationUrl || cert.image || '');
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
      issuer,
      date: date ? new Date(date) : new Date(),
      isVerified,
      imageUrl,
    };

    try {
      const url = editingId ? `/api/certificates?id=${editingId}` : '/api/certificates';
      const method = editingId ? 'PUT' : 'POST';

      const res = await authFetch(url, {
        method,
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to save certificate entry');
      }

      await mutate();
      closeModal();
    } catch (err) {
      console.error('Save Certificate Error:', err);
      setErrorMessage(err.message || 'Operation failed');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this certificate entry?')) return;

    try {
      const res = await authFetch(`/api/certificates?id=${id}`, {
        method: 'DELETE',
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to delete certificate entry');
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
          <p className="text-slate-400 text-sm">Manage academic credentials and professional certificates.</p>
        </div>

        <button
          onClick={openCreateModal}
          className="flex items-center gap-2.5 px-6 py-3.5 rounded-2xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-black uppercase tracking-wider transition-all shadow-lg shadow-purple-500/20 cursor-pointer"
        >
          <Plus size={18} />
          <span>Add Certificate</span>
        </button>
      </div>

      {/* Grid / Table View */}
      {isLoading ? (
        <div className="grid md:grid-cols-2 gap-6 animate-pulse">
          {[1, 2].map((i) => (
            <div key={i} className="h-64 rounded-3xl bg-slate-900/40 border border-slate-800" />
          ))}
        </div>
      ) : certificates.length === 0 ? (
        <div className="text-center py-20 border border-slate-800 rounded-3xl bg-slate-900/20">
          <Award className="w-12 h-12 text-slate-600 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-slate-300">No Certificates Found</h3>
          <p className="text-slate-500 text-xs mt-1">Click "Add Certificate" above to record your credentials.</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {certificates.map((cert) => (
            <m.div
              key={cert.id || cert._id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="group relative rounded-3xl bg-slate-900/60 border border-slate-800 hover:border-purple-500/40 p-6 flex flex-col justify-between transition-all duration-300 backdrop-blur-md shadow-lg"
            >
              <div>
                {/* Header row: Verified badge & Date */}
                <div className="flex items-center justify-between mb-4">
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider font-mono ${
                    cert.isVerified 
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                      : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                  }`}>
                    {cert.isVerified ? <CheckCircle2 size={12} /> : <XCircle size={12} />}
                    {cert.isVerified ? 'Verified' : 'Pending'}
                  </span>

                  <span className="text-slate-400 text-xs font-mono flex items-center gap-1.5">
                    <Calendar size={13} className="text-slate-500" />
                    {cert.date ? new Date(cert.date).toLocaleDateString() : 'N/A'}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-white mb-1 leading-snug">{cert.title}</h3>
                <p className="text-purple-400/80 font-bold uppercase text-[10px] tracking-widest mb-4">
                  {cert.issuer || cert.institution || 'Issuer Authority'}
                </p>

                {/* Preview Link if present */}
                {(cert.imageUrl || cert.verificationUrl) && (
                  <div className="w-full h-36 rounded-2xl bg-slate-950 border border-slate-800 overflow-hidden mb-4 relative">
                    <img 
                      src={cert.imageUrl || cert.verificationUrl} 
                      alt={cert.title} 
                      className="w-full h-full object-cover opacity-75 group-hover:scale-105 transition-transform duration-500" 
                      onError={(e) => { e.target.style.display = 'none'; }}
                    />
                  </div>
                )}
              </div>

              {/* Actions Footer */}
              <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between">
                {(cert.imageUrl || cert.verificationUrl) ? (
                  <a 
                    href={cert.imageUrl || cert.verificationUrl} 
                    target="_blank" 
                    rel="noreferrer" 
                    className="text-xs font-bold text-cyan-400 hover:underline flex items-center gap-1.5"
                  >
                    <span>View Credential</span>
                    <ExternalLink size={13} />
                  </a>
                ) : <div />}

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => openEditModal(cert)}
                    className="p-2 rounded-xl bg-slate-800/60 border border-slate-700 hover:border-cyan-400 text-cyan-300 transition-colors cursor-pointer"
                    title="Edit Certificate"
                  >
                    <Edit2 size={14} />
                  </button>
                  <button
                    onClick={() => handleDelete(cert.id || cert._id)}
                    className="p-2 rounded-xl bg-slate-800/60 border border-slate-700 hover:border-red-500 text-red-400 transition-colors cursor-pointer"
                    title="Delete Certificate"
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
              className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 shadow-2xl space-y-6"
            >
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <h3 className="text-lg font-bold text-white uppercase font-mono">
                  {editingId ? 'Edit Certificate' : 'Add New Certificate'}
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
                  <label className="text-[10px] font-bold uppercase text-slate-400 font-mono">Certificate Title</label>
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
                  <label className="text-[10px] font-bold uppercase text-slate-400 font-mono">Issuer / Institution</label>
                  <input 
                    type="text" 
                    value={issuer} 
                    onChange={(e) => setIssuer(e.target.value)} 
                    required 
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 px-4 text-white text-sm focus:border-purple-400 focus:outline-none" 
                    placeholder="DeepLearning.AI / Coursera" 
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase text-slate-400 font-mono">Issue Date</label>
                    <input 
                      type="date" 
                      value={date} 
                      onChange={(e) => setDate(e.target.value)} 
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 px-4 text-white text-sm focus:border-cyan-400 focus:outline-none" 
                    />
                  </div>

                  <div className="space-y-1.5 flex flex-col justify-end">
                    <label className="flex items-center gap-3 p-3 rounded-xl bg-slate-950 border border-slate-800 cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={isVerified} 
                        onChange={(e) => setIsVerified(e.target.checked)} 
                        className="w-4 h-4 rounded text-purple-600 focus:ring-purple-500" 
                      />
                      <span className="text-xs font-bold text-slate-300">Verification Status</span>
                    </label>
                  </div>
                </div>

                <ImageUpload
                  value={imageUrl}
                  onUploadComplete={(url) => setImageUrl(url)}
                  label="Certificate Preview Image"
                />

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
                    {submitting ? 'Saving...' : (editingId ? 'Update Certificate' : 'Add Certificate')}
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

export default ManageCertificates;
