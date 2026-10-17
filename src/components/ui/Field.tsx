import type {
  InputHTMLAttributes,
  TextareaHTMLAttributes,
  SelectHTMLAttributes,
  ReactNode,
} from 'react';
import { cn } from '@/lib/cn';

const fieldBase =
  'w-full rounded-xl border border-cream-300 bg-cream-50 px-3.5 py-2.5 text-sm text-coffee-500 placeholder:text-coffee-400/50 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-sage-400 focus:border-sage-400';

export function Label({
  children,
  htmlFor,
  required,
}: {
  children: ReactNode;
  htmlFor?: string;
  required?: boolean;
}) {
  return (
    <label
      htmlFor={htmlFor}
      className="block text-sm font-medium text-coffee-500 mb-1.5"
    >
      {children}
      {required && <span className="text-red-500 ml-0.5">*</span>}
    </label>
  );
}

export function Input({
  className,
  ...props
}: InputHTMLAttributes<HTMLInputElement>) {
  return <input className={cn(fieldBase, className)} {...props} />;
}

export function Textarea({
  className,
  ...props
}: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea className={cn(fieldBase, 'resize-none', className)} {...props} />
  );
}

export function Select({
  className,
  children,
  ...props
}: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select className={cn(fieldBase, 'cursor-pointer', className)} {...props}>
      {children}
    </select>
  );
}

export function FieldError({ children }: { children: ReactNode }) {
  return (
    <p className="mt-1.5 text-xs text-red-500 animate-fade-in">{children}</p>
  );
}
