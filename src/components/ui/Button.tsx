import { type ButtonHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/cn';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'soft';
type Size = 'sm' | 'md' | 'lg' | 'icon';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
}

const variants: Record<Variant, string> = {
  primary:
    'bg-coffee-500 text-cream-100 hover:bg-coffee-600 shadow-soft hover:shadow-card',
  secondary:
    'bg-cream-200 text-coffee-500 hover:bg-cream-300 border border-cream-300',
  ghost: 'text-coffee-500 hover:bg-cream-200',
  danger:
    'bg-red-500 text-white hover:bg-red-600 shadow-soft',
  soft: 'bg-sage-300/50 text-sage-600 hover:bg-sage-300/70',
};

const sizes: Record<Size, string> = {
  sm: 'px-3 py-1.5 text-sm gap-1.5',
  md: 'px-4 py-2 text-sm gap-2',
  lg: 'px-5 py-2.5 text-base gap-2',
  icon: 'p-2',
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center rounded-xl font-medium transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-sage-400 focus-visible:ring-offset-2 focus-visible:ring-offset-cream-100 disabled:opacity-50 disabled:pointer-events-none active:scale-[0.97]',
          variants[variant],
          sizes[size],
          className,
        )}
        {...props}
      />
    );
  },
);
Button.displayName = 'Button';
