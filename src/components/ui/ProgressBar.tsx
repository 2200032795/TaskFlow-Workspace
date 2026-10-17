import { cn } from '@/lib/cn';

interface ProgressBarProps {
  value: number; // 0-100
  className?: string;
  barClassName?: string;
  animate?: boolean;
}

export function ProgressBar({
  value,
  className,
  barClassName = 'bg-sage-400',
  animate = true,
}: ProgressBarProps) {
  const clamped = Math.max(0, Math.min(100, value));
  return (
    <div
      className={cn(
        'h-2 rounded-full bg-cream-200 overflow-hidden',
        className,
      )}
      role="progressbar"
      aria-valuenow={clamped}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div
        className={cn('h-full rounded-full transition-all duration-700', barClassName)}
        style={{ width: `${clamped}%` }}
        data-animate={animate}
      />
    </div>
  );
}
