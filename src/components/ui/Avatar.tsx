import { cn } from '@/lib/cn';
import { initials, avatarColor } from '@/lib/helpers';

interface AvatarProps {
  name: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizes = {
  sm: 'w-7 h-7 text-[11px]',
  md: 'w-9 h-9 text-xs',
  lg: 'w-12 h-12 text-sm',
};

export function Avatar({ name, size = 'md', className }: AvatarProps) {
  return (
    <div
      className={cn(
        'flex items-center justify-center rounded-full font-semibold ring-2 ring-cream-50',
        avatarColor(name),
        sizes[size],
        className,
      )}
      title={name}
    >
      {initials(name)}
    </div>
  );
}
