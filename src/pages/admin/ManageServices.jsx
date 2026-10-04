import { useState } from 'react';
import { useServices } from '../../hooks/useData';
import { m, AnimatePresence } from 'framer-motion';
import {
  Plus, Edit2, Trash2, X, Settings, GripVertical
} from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import { authFetch } from '../../lib/authFetch';

const POPULAR_ICONS = [
  'Code', 'Database', 'Server', 'Cpu', 'Layers', 'Zap', 'Globe', 'Smartphone',
  'Monitor', 'Shield', 'Activity', 'Terminal', 'Cloud', 'Network', 'Lock', 'Key',
  'Briefcase', 'Star', 'Heart', 'Award', 'Hexagon', 'Box', 'Workflow', 'Share2',
  'Settings', 'Search', 'Brain', 'Eye', 'Wifi', 'Lightbulb', 'Sparkles', 'Bot',
];

const ManageServices = () => {
  const { services, isLoading, mutate } = useServices();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  // Form State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [iconName, setIconName] = useState('Code');
  const [features, setFeatures] = useState('');
  const [order, setOrder] = useState(0);
  const [showIconPicker, setShowIconPicker] = useState(false);
  const [iconSearch, setIconSearch] = useState('');

  const filteredIcons = iconSearch.trim() === ''
    ? POPULAR_ICONS
    : Object.keys(LucideIcons)
        .filter((k) => /^[A-Z]/.test(k) && k.toLowerCase().includes(iconSearch.toLowerCase()))
        .slice(0, 30);

  const openCreateModal = () => {
    setEditingId(null);
    setTitle('');
    setDescription('');
    setIconName('Code');
    setFeatures('');
    setOrder(services.length);
    setErrorMessage(null);
    setIsModalOpen(true);
  };

  const openEditModal = (svc) => {
    setEditingId(svc.id || svc._id);
    setTitle(svc.title || '');
    setDescription(svc.description || '');
    setIconName(svc.iconName || svc.icon_name || svc.icon || 'Code');
    setFeatures((svc.features || []).join(', '));
    setOrder(svc.order || 0);
    setErrorMessage(null);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
    setErrorMessage(null);
    setShowIconPicker(false);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMessage(null);

    const payload = {
      title,
      description,
      iconName,
      icon: iconName,
      features: features
        .split(',')
        .map((f) => f.trim())
        .filter(Boolean),
      order,
    };

    try {
      const url = editingId
        ? `/api/collection?name=services&id=${editingId}`
        : '/api/collection?name=services';
      const method = editingId ? 'PUT' : 'POST';

      const res = await authFetch(url, {
        method,
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to save service');
      }

      await mutate();
      closeModal();
    } catch (err) {
      console.error('Save Service Error:', err);
      setErrorMessage(err.message || 'Operation failed');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this service?')) return;

    try {
      const res = await authFetch(`/api/collection?name=services&id=${id}`, {
        method: 'DELETE',
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to delete service');
      }

      await mutate();
    } catch (err) {
      alert(`Delete Error: ${err.message}`);
    }
  };

  const getIconComponent = (name) => {
    const Icon = LucideIcons[name] || LucideIcons.Code;
    return <Icon size={24} />;
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <p className="text-slate-400 text-sm">
            Manage the services displayed on your portfolio. Add, edit, or remove service cards.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="flex items-center gap-2.5 px-6 py-3.5 rounded-2xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-black uppercase tracking-wider transition-all shadow-lg shadow-purple-500/20 cursor-pointer"
        >
          <Plus size={18} />
          <span>Add Service</span>
        </button>
      </div>

      {/* Grid View */}
      {isLoading ? (
        <div className="grid md:grid-cols-2 gap-6 animate-pulse">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-52 rounded-3xl bg-slate-900/40 border border-slate-800" />
          ))}
        </div>
      ) : services.length === 0 ? (
        <div className="text-center py-20 border border-slate-800 rounded-3xl bg-slate-900/20">
          <Settings className="w-12 h-12 text-slate-600 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-slate-300">No Services Found</h3>
          <p className="text-slate-500 text-xs mt-1">Click "Add Service" above to create your first service card.</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {[...services]
            .sort((a, b) => (a.order || 0) - (b.order || 0))
            .map((svc) => {
              const IconComp = LucideIcons[svc.iconName || svc.icon_name || svc.icon] || LucideIcons.Code;

              return (
                <m.div
                  key={svc.id || svc._id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="group relative rounded-3xl bg-slate-900/60 border border-slate-800 hover:border-purple-500/40 p-6 flex flex-col justify-between transition-all duration-300 backdrop-blur-md shadow-lg"
                >
                  <div>
                    {/* Icon & Order */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="p-3 rounded-2xl bg-purple-500/10 border border-purple-500/20 text-purple-400">
                        <IconComp size={24} />
                      </div>
                      <span className="text-slate-500 text-[10px] font-mono font-bold uppercase tracking-wider flex items-center gap-1.5">
                        <GripVertical size={12} />
                        Order: {svc.order || 0}
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-white mb-2 leading-snug">{svc.title}</h3>
                    <p className="text-slate-400 text-sm leading-relaxed mb-4 line-clamp-3">
                      {svc.description}
                    </p>

                    {/* Features Tags */}
                    {svc.features && svc.features.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mb-4">
                        {svc.features.slice(0, 5).map((f, i) => (
                          <span
                            key={i}
                            className="px-2.5 py-1 rounded-lg bg-slate-800/60 border border-slate-700/50 text-[10px] font-mono text-slate-300"
                          >
                            {f}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Actions Footer */}
                  <div className="pt-4 border-t border-slate-800/80 flex items-center justify-end gap-2">
                    <button
                      onClick={() => openEditModal(svc)}
                      className="p-2 rounded-xl bg-slate-800/60 border border-slate-700 hover:border-cyan-400 text-cyan-300 transition-colors cursor-pointer"
                      title="Edit Service"
                    >
                      <Edit2 size={14} />
                    </button>
                    <button
                      onClick={() => handleDelete(svc.id || svc._id)}
                      className="p-2 rounded-xl bg-slate-800/60 border border-slate-700 hover:border-red-500 text-red-400 transition-colors cursor-pointer"
                      title="Delete Service"
                    >
                      <Trash2 size={14} />
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
              className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <h3 className="text-lg font-bold text-white uppercase font-mono">
                  {editingId ? 'Edit Service' : 'Add New Service'}
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
                  <label className="text-[10px] font-bold uppercase text-slate-400 font-mono">Service Title</label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 px-4 text-white text-sm focus:border-cyan-400 focus:outline-none"
                    placeholder="AI Model Development"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase text-slate-400 font-mono">Description</label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={3}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 px-4 text-white text-sm focus:border-purple-400 focus:outline-none resize-none"
                    placeholder="Designing and training custom neural networks..."
                  />
                </div>

                {/* Icon Picker */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase text-slate-400 font-mono">Icon</label>
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setShowIconPicker(!showIconPicker)}
                      className="w-full flex items-center gap-3 bg-slate-950 border border-slate-800 rounded-xl py-3 px-4 text-white text-sm hover:border-purple-500/50 transition-colors"
                    >
                      {getIconComponent(iconName)}
                      <span className="text-slate-300">{iconName}</span>
                    </button>

                    {showIconPicker && (
                      <div className="absolute top-full left-0 right-0 mt-2 bg-slate-900 border border-slate-800 rounded-2xl p-4 z-50 shadow-2xl max-h-64 overflow-y-auto">
                        <input
                          type="text"
                          value={iconSearch}
                          onChange={(e) => setIconSearch(e.target.value)}
                          placeholder="Search icons..."
                          className="w-full bg-slate-950 border border-slate-800 rounded-lg py-2 px-3 text-white text-xs mb-3 focus:border-cyan-400 focus:outline-none"
                        />
                        <div className="grid grid-cols-6 gap-2">
                          {filteredIcons.map((name) => {
                            const Icon = LucideIcons[name];
                            if (!Icon) return null;
                            return (
                              <button
                                key={name}
                                type="button"
                                onClick={() => {
                                  setIconName(name);
                                  setShowIconPicker(false);
                                  setIconSearch('');
                                }}
                                className={`p-2.5 rounded-xl flex items-center justify-center transition-all ${
                                  iconName === name
                                    ? 'bg-purple-500/20 border border-purple-500/50 text-purple-300'
                                    : 'bg-slate-800/40 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-600'
                                }`}
                                title={name}
                              >
                                <Icon size={18} />
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase text-slate-400 font-mono">Features (comma-separated)</label>
                  <input
                    type="text"
                    value={features}
                    onChange={(e) => setFeatures(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 px-4 text-white text-sm focus:border-cyan-400 focus:outline-none"
                    placeholder="Custom Models, Transfer Learning, Fine-tuning"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase text-slate-400 font-mono">Display Order</label>
                  <input
                    type="number"
                    value={order}
                    onChange={(e) => setOrder(parseInt(e.target.value) || 0)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 px-4 text-white text-sm focus:border-cyan-400 focus:outline-none"
                    min={0}
                  />
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
                    {submitting ? 'Saving...' : editingId ? 'Update Service' : 'Add Service'}
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

export default ManageServices;
