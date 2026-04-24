import { useEffect } from 'react';
import { X, AlertTriangle, ShieldCheck, Trash2, ShoppingCart } from 'lucide-react';


const ConfirmModal = ({
  open,
  onClose,
  onConfirm,
  title = 'Are you sure?',
  message,
  confirmText = 'Confirm',
  cancelText  = 'Cancel',
  variant     = 'danger',
  icon,
}) => {
  // Close on Escape
  useEffect(() => {
    if (!open) return;
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [open, onClose]);

  // Lock body scroll
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  if (!open) return null;

  const config = {
    danger:  { iconBg: 'bg-red-100 dark:bg-red-900/30',    iconColor: 'text-red-600 dark:text-red-400',    btnClass: 'bg-red-600 hover:bg-red-700',    border: 'border-red-200 dark:border-red-900/50',  DefaultIcon: Trash2 },
    warning: { iconBg: 'bg-amber-100 dark:bg-amber-900/30', iconColor: 'text-amber-600 dark:text-amber-400', btnClass: 'bg-amber-500 hover:bg-amber-600',  border: 'border-amber-200 dark:border-amber-900/50', DefaultIcon: AlertTriangle },
    success: { iconBg: 'bg-green-100 dark:bg-green-900/30', iconColor: 'text-green-600 dark:text-green-400', btnClass: 'bg-green-600 hover:bg-green-700',  border: 'border-green-200 dark:border-green-900/50', DefaultIcon: ShieldCheck },
    info:    { iconBg: 'bg-blue-100 dark:bg-blue-900/30',   iconColor: 'text-blue-600 dark:text-blue-400',   btnClass: 'bg-blue-600 hover:bg-blue-700',    border: 'border-blue-200 dark:border-blue-900/50',  DefaultIcon: ShieldCheck },
  }[variant];

  const IconEl = config.DefaultIcon;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center px-4"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-[fadeIn_0.15s_ease]" />

      {/* Dialog */}
      <div className={`relative w-full max-w-sm bg-white dark:bg-gray-900
        rounded-2xl shadow-2xl border ${config.border}
        animate-[slideUp_0.2s_cubic-bezier(0.22,1,0.36,1)]`}>

        {/* Close btn */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 h-7 w-7 flex items-center justify-center rounded-lg
            text-gray-400 hover:text-gray-600 dark:hover:text-gray-300
            hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer">
          <X size={15} />
        </button>

        <div className="p-6">
          {/* Icon */}
          <div className={`h-12 w-12 rounded-2xl ${config.iconBg} flex items-center justify-center mb-4`}>
            {icon ?? <IconEl size={22} className={config.iconColor} />}
          </div>

          {/* Text */}
          <h3 className="text-base font-bold text-gray-900 dark:text-white mb-2">{title}</h3>
          {message && (
            <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{message}</p>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-2 px-6 pb-5">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl text-sm font-semibold
              border border-gray-200 dark:border-gray-700
              text-gray-600 dark:text-gray-400
              hover:bg-gray-50 dark:hover:bg-gray-800
              transition-colors cursor-pointer">
            {cancelText}
          </button>
          <button
            onClick={() => { onConfirm(); onClose(); }}
            className={`flex-1 py-2.5 rounded-xl text-sm font-bold text-white
              ${config.btnClass}
              shadow-sm hover:shadow-md hover:-translate-y-0.5
              transition-all duration-200 cursor-pointer`}>
            {confirmText}
          </button>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn  { from { opacity: 0 } to { opacity: 1 } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(16px) scale(0.97) } to { opacity: 1; transform: translateY(0) scale(1) } }
      `}</style>
    </div>
  );
};

export default ConfirmModal;