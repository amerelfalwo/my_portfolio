import { useState, useEffect, useMemo } from 'react';
import { Mail, Trash2, MailOpen, Reply, Search, Clock, CheckCircle2 } from 'lucide-react';
import { authFetch } from '../../lib/authFetch';
import {
  Button,
  ConfirmDialog,
  Alert,
  LoadingState,
  EmptyState,
} from '../../components/admin/ui';

export default function ManageInbox() {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('ALL'); // 'ALL' | 'UNREAD' | 'READ'
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const fetchMessages = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await authFetch('/api/collection?name=messages');
      const data = await res.json().catch(() => ([]));
      if (Array.isArray(data)) {
        setMessages(data.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0)));
      } else {
        setMessages([]);
      }
    } catch (err) {
      setError(err.message || 'Failed to load inbox messages');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const toggleReadStatus = async (msg) => {
    const id = msg.id || msg._id;
    const nextStatus = !msg.read;

    try {
      const res = await authFetch(`/api/collection?name=messages&id=${id}`, {
        method: 'PUT',
        body: JSON.stringify({ read: nextStatus }),
      });

      if (!res.ok) throw new Error('Failed to update message status');

      setMessages((prev) =>
        prev.map((m) => ((m.id || m._id) === id ? { ...m, read: nextStatus } : m))
      );
    } catch (err) {
      setError(err.message || 'Failed to update message');
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    const id = deleteTarget.id || deleteTarget._id;
    setDeleting(true);

    try {
      const res = await authFetch(`/api/collection?name=messages&id=${id}`, {
        method: 'DELETE',
      });

      if (!res.ok) throw new Error('Failed to delete message');

      setMessages((prev) => prev.filter((m) => (m.id || m._id) !== id));
      setDeleteTarget(null);
      setSuccess('Message deleted successfully.');
    } catch (err) {
      setError(err.message || 'Failed to delete message');
    } finally {
      setDeleting(false);
    }
  };

  const filteredMessages = useMemo(() => {
    return messages.filter((msg) => {
      const isUnread = !msg.read;
      if (filterStatus === 'UNREAD' && !isUnread) return false;
      if (filterStatus === 'READ' && isUnread) return false;

      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      return (
        (msg.name || '').toLowerCase().includes(q) ||
        (msg.email || '').toLowerCase().includes(q) ||
        (msg.subject || '').toLowerCase().includes(q) ||
        (msg.message || '').toLowerCase().includes(q)
      );
    });
  }, [messages, filterStatus, searchQuery]);

  const unreadCount = messages.filter((m) => !m.read).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-border">
        <div>
          <h1 className="text-2xl font-light tracking-tight text-foreground">Inbox</h1>
          <p className="text-sm text-muted mt-1">
            Direct messages received from the portfolio contact form.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {unreadCount > 0 && (
            <span className="px-3 py-1 rounded-full text-xs font-medium bg-foreground text-surface">
              {unreadCount} unread
            </span>
          )}
        </div>
      </div>

      {/* Global Alerts */}
      {error && <Alert variant="error">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => setFilterStatus('ALL')}
            className={`px-3 py-1.5 text-xs font-medium rounded-full border transition-colors ${
              filterStatus === 'ALL'
                ? 'bg-foreground text-surface border-foreground'
                : 'bg-surface text-muted border-border hover:text-foreground'
            }`}
          >
            All ({messages.length})
          </button>
          <button
            type="button"
            onClick={() => setFilterStatus('UNREAD')}
            className={`px-3 py-1.5 text-xs font-medium rounded-full border transition-colors ${
              filterStatus === 'UNREAD'
                ? 'bg-foreground text-surface border-foreground'
                : 'bg-surface text-muted border-border hover:text-foreground'
            }`}
          >
            Unread ({unreadCount})
          </button>
          <button
            type="button"
            onClick={() => setFilterStatus('READ')}
            className={`px-3 py-1.5 text-xs font-medium rounded-full border transition-colors ${
              filterStatus === 'READ'
                ? 'bg-foreground text-surface border-foreground'
                : 'bg-surface text-muted border-border hover:text-foreground'
            }`}
          >
            Read ({messages.length - unreadCount})
          </button>
        </div>

        <div className="relative w-full sm:w-64">
          <Search size={14} className="absolute start-3 top-1/2 -translate-y-1/2 text-muted pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search messages…"
            className="w-full ps-9 pe-3 py-1.5 rounded-lg border border-border bg-surface text-xs text-foreground placeholder:text-muted focus:outline-none focus:border-foreground"
          />
        </div>
      </div>

      {/* Messages List */}
      {isLoading ? (
        <LoadingState message="Loading inbox messages…" />
      ) : filteredMessages.length === 0 ? (
        <EmptyState
          title={searchQuery || filterStatus !== 'ALL' ? 'No matching messages' : 'Inbox is empty'}
          description={
            searchQuery || filterStatus !== 'ALL'
              ? 'Try adjusting your search query or filter.'
              : 'Messages sent via the public contact form will appear here.'
          }
        />
      ) : (
        <div className="space-y-3">
          {filteredMessages.map((msg) => {
            const id = msg.id || msg._id;
            const isUnread = !msg.read;
            const dateStr = msg.createdAt
              ? new Date(msg.createdAt).toLocaleString(undefined, {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })
              : '';

            return (
              <div
                key={id}
                className={`p-5 rounded-lg border transition-all text-start ${
                  isUnread
                    ? 'border-foreground/30 bg-surface shadow-xs'
                    : 'border-border bg-surface/60'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 pb-3 border-b border-border">
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-medium text-foreground">{msg.name}</span>
                      <a
                        href={`mailto:${msg.email}`}
                        className="text-xs text-muted hover:text-foreground transition-colors"
                      >
                        &lt;{msg.email}&gt;
                      </a>
                      {isUnread && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-foreground text-surface">
                          New
                        </span>
                      )}
                    </div>

                    {msg.subject && (
                      <p className="text-xs font-medium text-foreground mt-1">
                        Subject: {msg.subject}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-xs text-muted flex items-center gap-1">
                      <Clock size={12} />
                      {dateStr}
                    </span>

                    <button
                      type="button"
                      onClick={() => toggleReadStatus(msg)}
                      className="p-1.5 text-muted hover:text-foreground rounded transition-colors"
                      title={isUnread ? 'Mark as read' : 'Mark as unread'}
                    >
                      {isUnread ? <MailOpen size={15} /> : <Mail size={15} />}
                    </button>

                    <a
                      href={`mailto:${msg.email}?subject=${encodeURIComponent('Re: ' + (msg.subject || 'Portfolio Inquiry'))}`}
                      className="p-1.5 text-muted hover:text-foreground rounded transition-colors"
                      title="Reply via email"
                    >
                      <Reply size={15} />
                    </a>

                    <button
                      type="button"
                      onClick={() => setDeleteTarget(msg)}
                      className="p-1.5 text-muted hover:text-red-600 rounded transition-colors"
                      title="Delete message"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>

                <div className="pt-3">
                  <p className="text-sm text-foreground/90 whitespace-pre-wrap leading-relaxed font-normal">
                    {msg.message}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmDialog
        isOpen={Boolean(deleteTarget)}
        title="Delete message"
        message={`Are you sure you want to delete message from "${deleteTarget?.name}"? This action cannot be undone.`}
        confirmLabel={deleting ? 'Deleting…' : 'Delete message'}
        isDestructive
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
