import { useState } from 'react';
import { useProjects } from '../../hooks/useData';
import { m, AnimatePresence } from 'framer-motion';
import { 
  Plus, Edit2, Trash2, X, Check, FolderKanban, Image as ImageIcon, ExternalLink, Github, Tag 
} from 'lucide-react';
import ImageUpload from '../../components/admin/ImageUpload';
import { authFetch } from '../../lib/authFetch';

const CATEGORY_OPTIONS = [
  { id: 'nlp', label: 'NLP' },
  { id: 'cv', label: 'Computer Vision' },
  { id: 'dl', label: 'Deep Learning' },
  { id: 'ds', label: 'Data Science' },
  { id: 'agents', label: 'AI Agents' },
  { id: 'gen_ai', label: 'Generative AI' },
];

const ManageProjects = () => {
  const { projects, isLoading, isError, mutate } = useProjects();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  // Form State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('nlp');
  const [tagsInput, setTagsInput] = useState('');
  const [repoUrl, setRepoUrl] = useState('');
  const [liveUrl, setLiveUrl] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  const openCreateModal = () => {
    setEditingId(null);
    setTitle('');
    setDescription('');
    setCategory('nlp');
    setTagsInput('');
    setRepoUrl('');
    setLiveUrl('');
    setImageUrl('');
    setErrorMessage(null);
    setIsModalOpen(true);
  };

  const openEditModal = (proj) => {
    setEditingId(proj.id || proj._id);
    setTitle(proj.title || '');
    setDescription(proj.description || '');
    setCategory(proj.category || 'nlp');
    setTagsInput(Array.isArray(proj.tags) ? proj.tags.join(', ') : (proj.techStack ? proj.techStack.join(', ') : ''));
    setRepoUrl(proj.repoUrl || proj.githubLink || '');
    setLiveUrl(proj.liveUrl || proj.demo || '');
    setImageUrl(proj.imageUrl || proj.image || '');
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

    const tagsArray = tagsInput
      ? tagsInput.split(',').map((t) => t.trim()).filter(Boolean)
      : [];

    const payload = {
      title,
      description,
      category,
      tags: tagsArray,
      repoUrl,
      liveUrl,
      imageUrl,
    };

    try {
      const url = editingId ? `/api/projects?id=${editingId}` : '/api/projects';
      const method = editingId ? 'PUT' : 'POST';

      const res = await authFetch(url, {
        method,
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to save project');
      }

      // Revalidate SWR data automatically
      await mutate();
      closeModal();
    } catch (err) {
      console.error('Save Project Error:', err);
      setErrorMessage(err.message || 'Save operation failed');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this project?')) return;

    try {
      const res = await authFetch(`/api/projects?id=${id}`, {
        method: 'DELETE',
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to delete project');
      }

      // Revalidate SWR data
      await mutate();
    } catch (err) {
      alert(`Delete Error: ${err.message}`);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <p className="text-slate-400 text-sm">Manage dynamic portfolio projects and AI domain stacks.</p>
        </div>

        <button
          onClick={openCreateModal}
          className="flex items-center gap-2.5 px-6 py-3.5 rounded-2xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-black uppercase tracking-wider transition-all shadow-lg shadow-purple-500/20 cursor-pointer"
        >
          <Plus size={18} />
          <span>Create Project</span>
        </button>
      </div>

      {/* Projects Table / Grid */}
      {isLoading ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-64 rounded-3xl bg-slate-900/40 border border-slate-800 p-6 flex flex-col justify-between" />
          ))}
        </div>
      ) : projects.length === 0 ? (
        <div className="text-center py-20 border border-slate-800 rounded-3xl bg-slate-900/20">
          <FolderKanban className="w-12 h-12 text-slate-600 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-slate-300">No Projects Found</h3>
          <p className="text-slate-500 text-xs mt-1">Click "Create Project" above to add your first entry.</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((proj) => (
            <m.div
              key={proj.id || proj._id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="group relative rounded-3xl bg-slate-900/60 border border-slate-800 hover:border-purple-500/40 p-6 flex flex-col justify-between transition-all duration-300 backdrop-blur-md shadow-lg"
            >
              <div>
                {/* Image Preview */}
                <div className="w-full h-40 rounded-2xl bg-slate-950/80 border border-slate-800 overflow-hidden mb-5 relative group/img">
                  {(proj.imageUrl || proj.image) ? (
                    <img 
                      src={proj.imageUrl || proj.image} 
                      alt={proj.title} 
                      className="w-full h-full object-cover group-hover/img:scale-105 transition-transform duration-500 opacity-80" 
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-600">
                      <ImageIcon size={32} />
                    </div>
                  )}
                  <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-slate-950/80 border border-slate-700 text-[10px] font-bold tracking-widest uppercase text-cyan-400 font-mono">
                    {proj.category || 'other'}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-white mb-2 leading-snug">{proj.title}</h3>
                <p className="text-slate-400 text-xs line-clamp-2 mb-4">{proj.description}</p>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {(proj.tags || proj.techStack || []).map((t, idx) => (
                    <span key={idx} className="px-2.5 py-1 rounded-lg bg-purple-500/10 border border-purple-500/20 text-purple-300 text-[10px] font-mono font-bold">
                      #{t}
                    </span>
                  ))}
                </div>
              </div>

              {/* Actions Footer */}
              <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {(proj.repoUrl || proj.githubLink) && (
                    <a href={proj.repoUrl || proj.githubLink} target="_blank" rel="noreferrer" className="text-slate-400 hover:text-white transition-colors">
                      <Github size={16} />
                    </a>
                  )}
                  {(proj.liveUrl || proj.demo) && (
                    <a href={proj.liveUrl || proj.demo} target="_blank" rel="noreferrer" className="text-slate-400 hover:text-cyan-400 transition-colors">
                      <ExternalLink size={16} />
                    </a>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => openEditModal(proj)}
                    className="p-2 rounded-xl bg-slate-800/60 border border-slate-700 hover:border-cyan-400 text-cyan-300 transition-colors cursor-pointer"
                    title="Edit Project"
                  >
                    <Edit2 size={14} />
                  </button>
                  <button
                    onClick={() => handleDelete(proj.id || proj._id)}
                    className="p-2 rounded-xl bg-slate-800/60 border border-slate-700 hover:border-red-500 text-red-400 transition-colors cursor-pointer"
                    title="Delete Project"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </m.div>
          ))}
        </div>
      )}

      {/* Modal Dialog for Create & Edit */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
            <m.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <h3 className="text-lg font-bold text-white uppercase font-mono">
                  {editingId ? 'Edit Project' : 'Create New Project'}
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
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase text-slate-400 font-mono">Title</label>
                    <input 
                      type="text" 
                      value={title} 
                      onChange={(e) => setTitle(e.target.value)} 
                      required 
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 px-4 text-white text-sm focus:border-cyan-400 focus:outline-none" 
                      placeholder="Neural Vision Model" 
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase text-slate-400 font-mono">Domain Category</label>
                    <select 
                      value={category} 
                      onChange={(e) => setCategory(e.target.value)} 
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 px-4 text-white text-sm focus:border-cyan-400 focus:outline-none"
                    >
                      {CATEGORY_OPTIONS.map((cat) => (
                        <option key={cat.id} value={cat.id}>{cat.label}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase text-slate-400 font-mono">Description</label>
                  <textarea 
                    rows={3} 
                    value={description} 
                    onChange={(e) => setDescription(e.target.value)} 
                    required 
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 px-4 text-white text-sm focus:border-cyan-400 focus:outline-none" 
                    placeholder="Brief architectural overview of this project..." 
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase text-slate-400 font-mono">Tags / Stack (Comma Separated)</label>
                  <input 
                    type="text" 
                    value={tagsInput} 
                    onChange={(e) => setTagsInput(e.target.value)} 
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 px-4 text-white text-sm focus:border-cyan-400 focus:outline-none" 
                    placeholder="PyTorch, OpenCV, Docker" 
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase text-slate-400 font-mono">GitHub Repo URL</label>
                    <input 
                      type="url" 
                      value={repoUrl} 
                      onChange={(e) => setRepoUrl(e.target.value)} 
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 px-4 text-white text-sm focus:border-cyan-400 focus:outline-none" 
                      placeholder="https://github.com/..." 
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase text-slate-400 font-mono">Live Demo URL</label>
                    <input 
                      type="url" 
                      value={liveUrl} 
                      onChange={(e) => setLiveUrl(e.target.value)} 
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 px-4 text-white text-sm focus:border-cyan-400 focus:outline-none" 
                      placeholder="https://demo.app" 
                    />
                  </div>
                </div>

                <ImageUpload
                  value={imageUrl}
                  onUploadComplete={(url) => setImageUrl(url)}
                  label="Project Cover Image"
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
                    {submitting ? 'Saving...' : (editingId ? 'Update Project' : 'Create Project')}
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

export default ManageProjects;
