import { useEffect, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import { cn } from '@/lib/cn';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: ReactNode;
  children: ReactNode;
  size?: 'sm' | 'md' | 'lg';
  footer?: ReactNode;
}

export function Modal({
  open,
  onClose,
  title,
  children,
  size = 'md',
  footer,
}: ModalProps) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  if (!open) return null;

  const sizeClass =
    size === 'sm'
      ? 'max-w-md'
      : size === 'lg'
        ? 'max-w-3xl'
        : 'max-w-xl';

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-coffee-600/40 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        className={cn(
          'relative w-full bg-cream-50 rounded-2xl shadow-lift animate-scale-in max-h-[90vh] flex flex-col',
          sizeClass,
        )}
      >
        {title && (
          <div className="flex items-center justify-between px-6 py-4 border-b border-cream-200">
            <h2 className="font-display text-xl font-semibold text-coffee-500">
              {title}
            </h2>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-coffee-400 hover:bg-cream-200 transition-colors"
              aria-label="Close"
            >
              <X size={20} />
            </button>
          </div>
        )}
        <div className="px-6 py-5 overflow-y-auto">{children}</div>
        {footer && (
          <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-cream-200 bg-cream-100/50 rounded-b-2xl">
            {footer}
          </div>
        )}
      </div>
    </div>,
    document.body,
  );
}
