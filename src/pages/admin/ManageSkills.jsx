import { useState, useMemo } from 'react';
import { useSkills } from '../../hooks/useData';
import { m, AnimatePresence } from 'framer-motion';
import { 
  Plus, Edit2, Trash2, X, Cpu, Zap, Sparkles, Check, ChevronRight 
} from 'lucide-react';
import { authFetch } from '../../lib/authFetch';
import { getToolIconUrl } from '../../utils/getToolIcon';

const CATEGORY_OPTIONS = [
  { id: 'deep_learning', label: 'Deep Learning' },
  { id: 'computer_vision', label: 'Computer Vision' },
  { id: 'data_science', label: 'Data Science' },
  { id: 'nlp_ai', label: 'NLP & Gen AI' },
  { id: 'development', label: 'Development' },
  { id: 'devops', label: 'DevOps & Tools' },
];

const POPULAR_SKILLS = [
  // Deep Learning
  { name: 'PyTorch', category: 'deep_learning' },
  { name: 'TensorFlow', category: 'deep_learning' },
  { name: 'Keras', category: 'deep_learning' },
  { name: 'JAX', category: 'deep_learning' },
  { name: 'ONNX', category: 'deep_learning' },
  { name: 'TensorRT', category: 'deep_learning' },

  // Computer Vision
  { name: 'OpenCV', category: 'computer_vision' },
  { name: 'YOLO', category: 'computer_vision' },
  { name: 'MediaPipe', category: 'computer_vision' },
  { name: 'Pillow', category: 'computer_vision' },
  { name: 'Segment Anything', category: 'computer_vision' },

  // Data Science
  { name: 'Scikit-Learn', category: 'data_science' },
  { name: 'Pandas', category: 'data_science' },
  { name: 'NumPy', category: 'data_science' },
  { name: 'SciPy', category: 'data_science' },
  { name: 'Matplotlib', category: 'data_science' },
  { name: 'Seaborn', category: 'data_science' },
  { name: 'XGBoost', category: 'data_science' },

  // NLP & Gen AI
  { name: 'LangChain', category: 'nlp_ai' },
  { name: 'LlamaIndex', category: 'nlp_ai' },
  { name: 'Hugging Face', category: 'nlp_ai' },
  { name: 'Transformers', category: 'nlp_ai' },
  { name: 'OpenAI', category: 'nlp_ai' },
  { name: 'Ollama', category: 'nlp_ai' },
  { name: 'Pinecone', category: 'nlp_ai' },
  { name: 'Qdrant', category: 'nlp_ai' },
  { name: 'ChromaDB', category: 'nlp_ai' },

  // Development
  { name: 'Python', category: 'development' },
  { name: 'C++', category: 'development' },
  { name: 'FastAPI', category: 'development' },
  { name: 'Flask', category: 'development' },
  { name: 'Django', category: 'development' },
  { name: 'React', category: 'development' },
  { name: 'Next.js', category: 'development' },
  { name: 'TypeScript', category: 'development' },
  { name: 'JavaScript', category: 'development' },
  { name: 'Node.js', category: 'development' },
  { name: 'PostgreSQL', category: 'development' },
  { name: 'MongoDB', category: 'development' },

  // DevOps & Tools
  { name: 'Docker', category: 'devops' },
  { name: 'Kubernetes', category: 'devops' },
  { name: 'Linux', category: 'devops' },
  { name: 'Ubuntu', category: 'devops' },
  { name: 'Git', category: 'devops' },
  { name: 'MLflow', category: 'devops' },
];

/**
 * Intelligent Category Inference Engine based on technology name
 */
function inferCategory(name) {
  if (!name || typeof name !== 'string') return 'development';
  const clean = name.trim().toLowerCase();

  // Exact dictionary match
  const exact = POPULAR_SKILLS.find((s) => s.name.toLowerCase() === clean);
  if (exact) return exact.category;

  // Keyword rules
  if (/torch|tensor|keras|jax|nn|deep/i.test(clean)) return 'deep_learning';
  if (/vision|opencv|yolo|image|detect|segment|mediapipe|cv/i.test(clean)) return 'computer_vision';
  if (/data|pandas|numpy|scikit|scipy|plot|seaborn|xgboost|learn|stat/i.test(clean)) return 'data_science';
  if (/langchain|llama|hugging|nlp|gpt|bert|rag|openai|pinecone|qdrant|chroma|ai/i.test(clean)) return 'nlp_ai';
  if (/docker|k8s|kube|devops|linux|ubuntu|git|mlflow|dvc|ci/i.test(clean)) return 'devops';

  return 'development';
}

const ManageSkills = () => {
  const { skills, isLoading, mutate } = useSkills();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  // Form State
  const [name, setName] = useState('');
  const [icon, setIcon] = useState('');
  const [category, setCategory] = useState('deep_learning');
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Filtered auto-suggestions as user types
  const suggestions = useMemo(() => {
    if (!name.trim()) return [];
    const clean = name.trim().toLowerCase();
    return POPULAR_SKILLS.filter((s) => s.name.toLowerCase().includes(clean)).slice(0, 6);
  }, [name]);

  const handleNameChange = (val) => {
    setName(val);
    setShowSuggestions(true);

    // Auto-infer category & resolve icon URL
    if (val.trim()) {
      setCategory(inferCategory(val));
      setIcon(getToolIconUrl(val));
    }
  };

  const selectSuggestion = (skillItem) => {
    setName(skillItem.name);
    setCategory(skillItem.category);
    setIcon(getToolIconUrl(skillItem.name));
    setShowSuggestions(false);
  };

  const openCreateModal = () => {
    setEditingId(null);
    setName('');
    setIcon('');
    setCategory('deep_learning');
    setErrorMessage(null);
    setShowSuggestions(false);
    setIsModalOpen(true);
  };

  const openEditModal = (skill) => {
    setEditingId(skill.id || skill._id);
    setName(skill.name || '');
    setIcon(skill.icon || getToolIconUrl(skill.name) || '');
    setCategory(skill.category || 'deep_learning');
    setErrorMessage(null);
    setShowSuggestions(false);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
    setErrorMessage(null);
    setShowSuggestions(false);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMessage(null);

    const payload = {
      name,
      icon: icon || getToolIconUrl(name),
      category: category || inferCategory(name),
      importance: 1, // Default importance cleanly in backend
    };

    try {
      const url = editingId ? `/api/skills?id=${editingId}` : '/api/skills';
      const method = editingId ? 'PUT' : 'POST';

      const res = await authFetch(url, {
        method,
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to save skill entry');
      }

      await mutate();
      closeModal();
    } catch (err) {
      console.error('Save Skill Error:', err);
      setErrorMessage(err.message || 'Operation failed');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this skill entry?')) return;

    try {
      const res = await authFetch(`/api/skills?id=${id}`, {
        method: 'DELETE',
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to delete skill entry');
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
          <p className="text-slate-400 text-sm">Manage technical arsenal skills with smart auto-categorization.</p>
        </div>

        <button
          onClick={openCreateModal}
          className="flex items-center gap-2.5 px-6 py-3.5 rounded-2xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-black uppercase tracking-wider transition-all shadow-lg shadow-purple-500/20 cursor-pointer"
        >
          <Plus size={18} />
          <span>Add New Skill</span>
        </button>
      </div>

      {/* Grid View */}
      {isLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 animate-pulse">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-36 rounded-3xl bg-slate-900/40 border border-slate-800" />
          ))}
        </div>
      ) : skills.length === 0 ? (
        <div className="text-center py-20 border border-slate-800 rounded-3xl bg-slate-900/20">
          <Cpu className="w-12 h-12 text-slate-600 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-slate-300">No Skills Found</h3>
          <p className="text-slate-500 text-xs mt-1">Click "Add New Skill" above to add your first technology.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {skills.map((skill) => {
            const skillIcon = skill.icon || getToolIconUrl(skill.name);
            return (
              <m.div
                key={skill.id || skill._id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="group relative rounded-3xl bg-slate-900/60 border border-slate-800 hover:border-cyan-400/40 p-5 flex flex-col items-center justify-between text-center transition-all duration-300 backdrop-blur-md shadow-lg"
              >
                {/* Icon Preview */}
                <div className="w-12 h-12 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-center mb-3 mt-2 group-hover:scale-110 transition-transform">
                  {skillIcon ? (
                    <img
                      src={skillIcon}
                      alt={skill.name}
                      className="w-7 h-7 object-contain"
                      onError={(e) => { e.target.style.display = 'none'; }}
                    />
                  ) : (
                    <Zap className="w-5 h-5 text-cyan-400" />
                  )}
                </div>

                <h4 className="text-sm font-bold text-white mb-1 leading-tight">{skill.name}</h4>
                <p className="text-[10px] font-mono uppercase tracking-wider text-purple-400/80 mb-4 font-bold">
                  {CATEGORY_OPTIONS.find((c) => c.id === skill.category)?.label || skill.category}
                </p>

                {/* Actions */}
                <div className="flex items-center gap-2 pt-3 border-t border-slate-800/80 w-full justify-center">
                  <button
                    onClick={() => openEditModal(skill)}
                    className="p-1.5 rounded-lg bg-slate-800/60 border border-slate-700 hover:border-cyan-400 text-cyan-300 transition-colors cursor-pointer"
                    title="Edit Skill"
                  >
                    <Edit2 size={13} />
                  </button>
                  <button
                    onClick={() => handleDelete(skill.id || skill._id)}
                    className="p-1.5 rounded-lg bg-slate-800/60 border border-slate-700 hover:border-red-500 text-red-400 transition-colors cursor-pointer"
                    title="Delete Skill"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </m.div>
            );
          })}
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
              className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 shadow-2xl space-y-6 relative overflow-visible"
            >
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <h3 className="text-lg font-bold text-white uppercase font-mono flex items-center gap-2">
                  <Sparkles size={18} className="text-cyan-400" />
                  {editingId ? 'Edit Skill Entry' : 'Add New Skill'}
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

              <form onSubmit={handleSave} className="space-y-5">
                {/* Skill Name with Live Autocomplete & Icon Badge */}
                <div className="space-y-1.5 relative">
                  <div className="flex items-center justify-between">
                    <label className="text-[10px] font-bold uppercase text-slate-400 font-mono">
                      Skill / Technology Name
                    </label>
                    {name && (
                      <span className="text-[10px] text-cyan-400 font-mono flex items-center gap-1">
                        <Check size={12} /> Auto-suggest active
                      </span>
                    )}
                  </div>

                  <div className="relative">
                    <input 
                      type="text" 
                      value={name} 
                      onChange={(e) => handleNameChange(e.target.value)}
                      onFocus={() => setShowSuggestions(true)}
                      required 
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 px-4 pl-12 text-white text-sm focus:border-cyan-400 focus:outline-none transition-all" 
                      placeholder="Type tool name (e.g. PyTorch, OpenCV, Docker...)" 
                    />

                    {/* Live SVG Icon Preview Badge */}
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center pointer-events-none">
                      {icon || getToolIconUrl(name) ? (
                        <img 
                          src={icon || getToolIconUrl(name)} 
                          alt="" 
                          className="w-4 h-4 object-contain" 
                          onError={(e) => { e.target.style.display = 'none'; }}
                        />
                      ) : (
                        <Zap className="w-3.5 h-3.5 text-slate-500" />
                      )}
                    </div>
                  </div>

                  {/* Autocomplete Dropdown List */}
                  {showSuggestions && suggestions.length > 0 && (
                    <m.div
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="absolute left-0 right-0 top-full mt-1.5 bg-slate-950 border border-slate-800 rounded-2xl p-2 z-50 shadow-2xl space-y-1 max-h-48 overflow-y-auto"
                    >
                      <div className="text-[9px] font-mono text-slate-500 px-3 py-1 uppercase font-bold tracking-wider">
                        Suggested Technologies
                      </div>
                      {suggestions.map((s) => (
                        <button
                          key={s.name}
                          type="button"
                          onClick={() => selectSuggestion(s)}
                          className="w-full text-left px-3 py-2 rounded-xl hover:bg-slate-900/90 text-white text-xs flex items-center justify-between transition-colors cursor-pointer"
                        >
                          <div className="flex items-center gap-2.5">
                            <img 
                              src={getToolIconUrl(s.name)} 
                              alt="" 
                              className="w-4 h-4 object-contain" 
                              onError={(e) => { e.target.style.display = 'none'; }}
                            />
                            <span className="font-bold">{s.name}</span>
                          </div>
                          <span className="text-[9px] font-mono text-purple-400 uppercase tracking-widest bg-purple-500/10 px-2 py-0.5 rounded-md border border-purple-500/20">
                            {CATEGORY_OPTIONS.find((c) => c.id === s.category)?.label || s.category}
                          </span>
                        </button>
                      ))}
                    </m.div>
                  )}
                </div>

                {/* Intelligent Auto-Category Field */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-[10px] font-bold uppercase text-slate-400 font-mono">
                      Category (Auto-Inferred)
                    </label>
                    <span className="text-[10px] text-purple-400 font-mono">
                      Auto-detected from skill name
                    </span>
                  </div>
                  <select 
                    value={category} 
                    onChange={(e) => setCategory(e.target.value)} 
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 px-4 text-white text-sm focus:border-cyan-400 focus:outline-none transition-all font-medium"
                  >
                    {CATEGORY_OPTIONS.map((cat) => (
                      <option key={cat.id} value={cat.id}>{cat.label}</option>
                    ))}
                  </select>
                </div>

                {/* Optional Custom SVG/Icon Override */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase text-slate-400 font-mono">
                    Icon SVG URL (Optional Override)
                  </label>
                  <input 
                    type="text" 
                    value={icon} 
                    onChange={(e) => setIcon(e.target.value)} 
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 px-4 text-white text-xs font-mono focus:border-cyan-400 focus:outline-none" 
                    placeholder={getToolIconUrl(name) || 'https://cdn.simpleicons.org/...'} 
                  />
                </div>

                {/* Action Buttons */}
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
                    disabled={submitting || !name.trim()} 
                    className="px-6 py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-black uppercase tracking-wider disabled:opacity-40 transition-all shadow-lg shadow-purple-500/20"
                  >
                    {submitting ? 'Saving...' : (editingId ? 'Update Skill' : 'Add Skill')}
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

export default ManageSkills;
