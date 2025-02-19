import { useEffect, useCallback } from 'react';
import { X } from 'lucide-react';

const TOAST_DURATION = 3000; // Auto-dismiss duration in milliseconds

// Icons for different notification types
const TOAST_ICONS = {
  success: '✓',
  error: '✕',
  warning: '⚠',
  info: 'ℹ'
};

export default function Toast({ 
  message, 
  type = 'info', 
  duration = TOAST_DURATION, 
  onClose 
}) {
  const handleClose = useCallback(() => {
    onClose();
  }, [onClose]);

  // Auto-dismiss timer setup
  useEffect(() => {
    if (!duration) return;

    const timer = setTimeout(handleClose, duration);
    return () => clearTimeout(timer);
  }, [duration, handleClose]);

  return (
    <div className={`toast toast-${type}`} role="alert">
      <div className="toast-icon">
        {TOAST_ICONS[type]}
      </div>
      <div className="toast-content">
        {message}
      </div>
      <button 
        onClick={handleClose}
        className="toast-close"
        aria-label="Close notification"
        type="button"
      >
        <X size={16} />
      </button>
    </div>
  );
}