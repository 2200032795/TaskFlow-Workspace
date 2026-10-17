import type { Task, Project } from '@/types';

export function isOverdue(task: Task): boolean {
  if (!task.dueDate || task.status === 'completed') return false;
  const today = new Date().toISOString().slice(0, 10);
  return task.dueDate < today;
}

export function formatDate(iso: string | null): string {
  if (!iso) return 'No due date';
  const d = new Date(iso + 'T00:00:00');
  return d.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });
}

export function formatDateLong(iso: string | null): string {
  if (!iso) return 'No due date';
  const d = new Date(iso + 'T00:00:00');
  return d.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}

export function relativeTime(iso: string): string {
  const then = new Date(iso).getTime();
  const now = Date.now();
  const diff = Math.round((now - then) / 1000);
  if (diff < 60) return 'just now';
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;
  return new Date(iso).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });
}

export function projectProgress(
  tasks: Task[],
  projectId: string,
): { total: number; completed: number; pct: number } {
  const projectTasks = tasks.filter((t) => t.projectId === projectId);
  const total = projectTasks.length;
  const completed = projectTasks.filter(
    (t) => t.status === 'completed',
  ).length;
  const pct = total === 0 ? 0 : Math.round((completed / total) * 100);
  return { total, completed, pct };
}

export function initials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

const AVATAR_COLORS = [
  'bg-sage-400 text-white',
  'bg-caramel-400 text-coffee-600',
  'bg-coffee-400 text-cream-100',
  'bg-orange-400 text-white',
  'bg-rose-400 text-white',
  'bg-teal-400 text-white',
  'bg-amber-600 text-white',
  'bg-emerald-500 text-white',
];

export function avatarColor(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = (hash << 5) - hash + name.charCodeAt(i);
    hash |= 0;
  }
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

export const PROJECT_COLOR_CLASSES: Record<
  Project['color'],
  { dot: string; soft: string; text: string; bar: string }
> = {
  sage: {
    dot: 'bg-sage-400',
    soft: 'bg-sage-300/40',
    text: 'text-sage-600',
    bar: 'bg-sage-400',
  },
  caramel: {
    dot: 'bg-caramel-400',
    soft: 'bg-caramel-300/40',
    text: 'text-caramel-600',
    bar: 'bg-caramel-400',
  },
  coffee: {
    dot: 'bg-coffee-400',
    soft: 'bg-coffee-400/15',
    text: 'text-coffee-500',
    bar: 'bg-coffee-400',
  },
};
