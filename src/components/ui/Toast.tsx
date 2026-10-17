import { cn } from '@/lib/cn';

interface ToastContainerProps {
  toasts: { id: string; kind: string; message: string }[];
  onDismiss: (id: string) => void;
}

const kindStyles: Record<string, string> = {
  success: 'bg-sage-500 text-white',
  error: 'bg-red-500 text-white',
  info: 'bg-coffee-500 text-cream-100',
};

export function ToastContainer({ toasts, onDismiss }: ToastContainerProps) {
  if (toasts.length === 0) return null;
  return (
    <div className="fixed bottom-6 right-6 z-[60] flex flex-col gap-2 max-w-sm">
      {toasts.map((t) => (
        <div
          key={t.id}
          onClick={() => onDismiss(t.id)}
          className={cn(
            'px-4 py-3 rounded-xl shadow-lift cursor-pointer animate-slide-in-right text-sm font-medium',
            kindStyles[t.kind] ?? kindStyles.info,
          )}
        >
          {t.message}
        </div>
      ))}
    </div>
  );
}
