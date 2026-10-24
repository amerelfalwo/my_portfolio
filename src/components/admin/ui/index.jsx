import React from 'react';

export const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  type = 'button',
  disabled = false,
  className = '',
  onClick,
  ...props
}) => {
  const base = 'inline-flex items-center justify-center gap-2 font-medium transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed select-none';

  const variants = {
    primary: 'bg-foreground text-surface rounded-full hover:opacity-90',
    secondary: 'border border-border bg-surface text-foreground rounded-full hover:bg-surface-muted',
    danger: 'border border-red-200 bg-red-50 text-red-600 rounded-full hover:bg-red-100',
    ghost: 'text-muted hover:text-foreground hover:bg-surface-muted rounded-lg',
  };

  const sizes = {
    sm: 'text-xs px-3 py-1.5',
    md: 'text-sm px-4 py-2',
    lg: 'text-base px-5 py-2.5',
  };

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`${base} ${variants[variant] || variants.primary} ${sizes[size] || sizes.md} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export const Input = ({
  className = '',
  hasError = false,
  ...props
}) => {
  return (
    <input
      className={`w-full bg-surface border ${
        hasError ? 'border-red-600' : 'border-border'
      } rounded-lg px-3.5 py-2 text-sm text-foreground placeholder:text-muted/60 focus:outline-none focus:border-foreground transition-colors disabled:bg-surface-muted disabled:cursor-not-allowed ${className}`}
      {...props}
    />
  );
};

export const Textarea = ({
  className = '',
  hasError = false,
  rows = 4,
  ...props
}) => {
  return (
    <textarea
      rows={rows}
      className={`w-full bg-surface border ${
        hasError ? 'border-red-600' : 'border-border'
      } rounded-lg px-3.5 py-2 text-sm text-foreground placeholder:text-muted/60 focus:outline-none focus:border-foreground transition-colors disabled:bg-surface-muted disabled:cursor-not-allowed ${className}`}
      {...props}
    />
  );
};

export const Select = ({
  children,
  className = '',
  hasError = false,
  ...props
}) => {
  return (
    <select
      className={`w-full bg-surface border ${
        hasError ? 'border-red-600' : 'border-border'
      } rounded-lg px-3.5 py-2 text-sm text-foreground focus:outline-none focus:border-foreground transition-colors disabled:bg-surface-muted disabled:cursor-not-allowed ${className}`}
      {...props}
    >
      {children}
    </select>
  );
};

export const Field = ({
  label,
  hint,
  error,
  children,
  className = '',
  required = false,
}) => {
  return (
    <div className={`space-y-1.5 ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-foreground">
          {label} {required && <span className="text-red-600">*</span>}
        </label>
      )}
      {children}
      {hint && !error && <p className="text-xs text-muted">{hint}</p>}
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
};

export const Card = ({ children, className = '', ...props }) => {
  return (
    <div className={`bg-surface border border-border rounded-lg p-5 sm:p-6 ${className}`} {...props}>
      {children}
    </div>
  );
};

export const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  maxWidth = 'max-w-xl',
}) => {
  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      onClick={onClose}
      className="fixed inset-0 bg-foreground/40 z-50 flex items-center justify-center p-4"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`bg-surface border border-border rounded-lg w-full ${maxWidth} p-6 relative max-h-[90vh] overflow-y-auto flex flex-col gap-4 text-start`}
      >
        <div className="flex items-center justify-between pb-3 border-b border-border">
          <h3 className="text-base font-semibold text-foreground">{title}</h3>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close dialog"
            className="p-1 rounded-lg text-muted hover:text-foreground hover:bg-surface-muted transition-colors cursor-pointer"
          >
            ✕
          </button>
        </div>
        <div className="flex-1">{children}</div>
      </div>
    </div>
  );
};

export const ConfirmDialog = ({
  isOpen,
  onClose,
  onConfirm,
  title = 'Confirm deletion',
  message = 'Are you sure you want to delete this item? This action cannot be undone.',
  confirmText = 'Delete',
  loading = false,
}) => {
  if (!isOpen) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} maxWidth="max-w-md">
      <div className="space-y-5">
        <p className="text-sm text-muted">{message}</p>
        <div className="flex items-center justify-end gap-3 pt-2">
          <Button variant="secondary" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button variant="danger" onClick={onConfirm} disabled={loading}>
            {loading ? 'Deleting...' : confirmText}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export const Alert = ({ type = 'info', message, className = '' }) => {
  if (!message) return null;

  const styles = {
    success: 'bg-surface border border-border text-foreground',
    error: 'bg-red-50 border border-red-200 text-red-600',
    info: 'bg-surface-muted border border-border text-foreground',
  };

  return (
    <div className={`p-3.5 rounded-lg text-sm flex items-center gap-2.5 ${styles[type] || styles.info} ${className}`}>
      <span>{message}</span>
    </div>
  );
};

export const LoadingState = ({ message = 'Loading...' }) => {
  return (
    <div className="p-12 flex flex-col items-center justify-center gap-3 text-muted text-sm">
      <div className="w-6 h-6 border-2 border-border border-t-foreground rounded-full animate-spin" />
      <span>{message}</span>
    </div>
  );
};

export const EmptyState = ({
  title = 'No items found',
  description,
  action,
}) => {
  return (
    <div className="p-12 text-center rounded-lg border border-border bg-surface flex flex-col items-center justify-center">
      <h4 className="text-sm font-medium text-foreground">{title}</h4>
      {description && <p className="text-xs text-muted mt-1 max-w-sm">{description}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
};
