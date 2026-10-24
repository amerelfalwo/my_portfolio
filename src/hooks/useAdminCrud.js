import { useState, useCallback } from 'react';
import { authFetch } from '../lib/authFetch';

/**
 * Shared CRUD hook for admin managers.
 * Handles create, update, delete, modal states, loading, and feedback
 * without changing existing API contracts.
 * 
 * @param {object} options
 * @param {string} options.endpoint - Base API endpoint (e.g. '/api/projects')
 * @param {Function} options.mutate - SWR mutate function to revalidate after mutation
 * @param {string} options.entityName - Display name for toast feedback
 */
export function useAdminCrud({ endpoint, mutate, entityName = 'Item' }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const openCreate = useCallback(() => {
    setEditingItem(null);
    setError(null);
    setIsModalOpen(true);
  }, []);

  const openEdit = useCallback((item) => {
    setEditingItem(item);
    setError(null);
    setIsModalOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
    setEditingItem(null);
    setError(null);
  }, []);

  const requestDelete = useCallback((item) => {
    setDeleteTarget(item);
  }, []);

  const cancelDelete = useCallback(() => {
    setDeleteTarget(null);
  }, []);

  const saveItem = useCallback(async (payload, customId) => {
    setSaving(true);
    setError(null);
    setSuccess(null);

    const targetId = customId || editingItem?.id || editingItem?._id;
    const isEdit = Boolean(targetId);

    // Build URL according to existing API contract:
    // If endpoint already contains '?', use '&id=', otherwise '?id='
    let url = endpoint;
    if (isEdit) {
      const sep = url.includes('?') ? '&' : '?';
      url = `${url}${sep}id=${encodeURIComponent(targetId)}`;
    }

    try {
      const res = await authFetch(url, {
        method: isEdit ? 'PUT' : 'POST',
        body: JSON.stringify(payload),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok || (data.success === false)) {
        throw new Error(data.error || data.message || `Failed to save ${entityName.toLowerCase()}`);
      }

      if (mutate) await mutate();
      setSuccess(`${entityName} saved successfully.`);
      closeModal();
      return { success: true, data };
    } catch (err) {
      console.error(`Error saving ${entityName}:`, err);
      setError(err.message || 'Operation failed.');
      return { success: false, error: err.message };
    } finally {
      setSaving(false);
    }
  }, [endpoint, editingItem, entityName, mutate, closeModal]);

  const confirmDelete = useCallback(async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    setError(null);

    const targetId = deleteTarget.id || deleteTarget._id;
    const sep = endpoint.includes('?') ? '&' : '?';
    const url = `${endpoint}${sep}id=${encodeURIComponent(targetId)}`;

    try {
      const res = await authFetch(url, { method: 'DELETE' });
      const data = await res.json().catch(() => ({}));

      if (!res.ok || (data.success === false)) {
        throw new Error(data.error || data.message || `Failed to delete ${entityName.toLowerCase()}`);
      }

      if (mutate) await mutate();
      setSuccess(`${entityName} deleted successfully.`);
      setDeleteTarget(null);
      return { success: true };
    } catch (err) {
      console.error(`Error deleting ${entityName}:`, err);
      setError(err.message || 'Deletion failed.');
      return { success: false, error: err.message };
    } finally {
      setDeleting(false);
    }
  }, [endpoint, deleteTarget, entityName, mutate]);

  const clearFeedback = useCallback(() => {
    setError(null);
    setSuccess(null);
  }, []);

  return {
    isModalOpen,
    editingItem,
    editingId: editingItem?.id || editingItem?._id || null,
    openCreate,
    openEdit,
    closeModal,
    deleteTarget,
    isDeleteOpen: Boolean(deleteTarget),
    requestDelete,
    cancelDelete,
    confirmDelete,
    saveItem,
    saving,
    deleting,
    error,
    success,
    clearFeedback,
  };
}

export default useAdminCrud;
