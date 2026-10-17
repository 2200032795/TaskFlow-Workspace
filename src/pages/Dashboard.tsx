import {
  CheckCircle2,
  Clock,
  AlertTriangle,
  ListTodo,
  TrendingUp,
  ArrowRight,
  Plus,
  Activity,
} from 'lucide-react';
import type { Task, Project } from '@/types';
import { STATUS_META } from '@/types';
import { Button } from '@/components/ui/Button';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { Avatar } from '@/components/ui/Avatar';
import { TaskCard } from '@/components/tasks/TaskCard';
import {
  isOverdue,
  relativeTime,
  projectProgress,
  PROJECT_COLOR_CLASSES,
} from '@/lib/helpers';
import { cn } from '@/lib/cn';
import { navigate } from '@/hooks/useRouter';

interface DashboardProps {
  tasks: Task[];
  projects: Project[];
  activity: { id: string; taskTitle: string; action: string; timestamp: string }[];
  onQuickAdd: () => void;
  onOpenTask: (task: Task) => void;
}

export function Dashboard({
  tasks,
  projects,
  activity,
  onQuickAdd,
  onOpenTask,
}: DashboardProps) {
  const total = tasks.length;
  const completed = tasks.filter((t) => t.status === 'completed').length;
  const pending = tasks.filter((t) => t.status !== 'completed').length;
  const overdue = tasks.filter(isOverdue).length;
  const completionPct =
    total === 0 ? 0 : Math.round((completed / total) * 100);

  const stats = [
    {
      label: 'Total Tasks',
      value: total,
      icon: ListTodo,
      color: 'bg-coffee-500',
      soft: 'bg-coffee-500/10',
    },
    {
      label: 'Completed',
      value: completed,
      icon: CheckCircle2,
      color: 'bg-sage-500',
      soft: 'bg-sage-400/15',
    },
    {
      label: 'Pending',
      value: pending,
      icon: Clock,
      color: 'bg-caramel-500',
      soft: 'bg-caramel-400/15',
    },
    {
      label: 'Overdue',
      value: overdue,
      icon: AlertTriangle,
      color: 'bg-red-500',
      soft: 'bg-red-500/10',
    },
  ];

  const upcoming = tasks
    .filter((t) => t.status !== 'completed' && t.dueDate)
    .sort((a, b) => (a.dueDate! < b.dueDate! ? -1 : 1))
    .slice(0, 4);

  return (
    <div className="space-y-6">
      <header className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 animate-fade-in">
        <div>
          <h1 className="font-display text-3xl font-semibold text-coffee-500">
            Dashboard
          </h1>
          <p className="text-coffee-400 mt-1">
            A snapshot of your workspace today.
          </p>
        </div>
        <Button onClick={onQuickAdd}>
          <Plus size={18} />
          Quick Add Task
        </Button>
      </header>

      {/* Stat cards */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s, i) => {
          const Icon = s.icon;
          return (
            <div
              key={s.label}
              className="bg-cream-50 rounded-2xl border border-cream-200 p-5 shadow-soft hover:shadow-card transition-shadow animate-slide-up"
              style={{ animationDelay: `${i * 60}ms` }}
            >
              <div className="flex items-center justify-between mb-3">
                <div
                  className={cn(
                    'flex items-center justify-center w-10 h-10 rounded-xl',
                    s.soft,
                  )}
                >
                  <Icon size={20} className={s.color} />
                </div>
              </div>
              <p className="text-3xl font-semibold text-coffee-500 tabular-nums">
                {s.value}
              </p>
              <p className="text-sm text-coffee-400 mt-1">{s.label}</p>
            </div>
          );
        })}
      </section>

      {/* Progress + Projects */}
      <section className="grid lg:grid-cols-3 gap-4">
        <div
          className="lg:col-span-1 bg-cream-50 rounded-2xl border border-cream-200 p-6 shadow-soft animate-slide-up"
          style={{ animationDelay: '120ms' }}
        >
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp size={18} className="text-sage-500" />
            <h2 className="font-display text-lg font-semibold text-coffee-500">
              Completion
            </h2>
          </div>
          <div className="flex items-end justify-between mb-3">
            <span className="text-4xl font-semibold text-coffee-500 tabular-nums">
              {completionPct}%
            </span>
            <span className="text-sm text-coffee-400">
              {completed} of {total}
            </span>
          </div>
          <ProgressBar value={completionPct} barClassName="bg-sage-400" className="h-3" />
          <div className="grid grid-cols-2 gap-3 mt-5 pt-5 border-t border-cream-200">
            <div>
              <p className="text-xs text-coffee-400">In Progress</p>
              <p className="text-xl font-semibold text-coffee-500">
                {tasks.filter((t) => t.status === 'in_progress').length}
              </p>
            </div>
            <div>
              <p className="text-xs text-coffee-400">In Review</p>
              <p className="text-xl font-semibold text-coffee-500">
                {tasks.filter((t) => t.status === 'in_review').length}
              </p>
            </div>
          </div>
        </div>

        <div
          className="lg:col-span-2 bg-cream-50 rounded-2xl border border-cream-200 p-6 shadow-soft animate-slide-up"
          style={{ animationDelay: '180ms' }}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <h2 className="font-display text-lg font-semibold text-coffee-500">
                Projects
              </h2>
            </div>
            <button
              onClick={() => navigate('projects')}
              className="text-sm text-coffee-400 hover:text-coffee-500 inline-flex items-center gap-1 transition-colors"
            >
              View all <ArrowRight size={14} />
            </button>
          </div>
          {projects.length === 0 ? (
            <EmptyHint text="Create a project to get organized." />
          ) : (
            <ul className="space-y-3">
              {projects.map((p) => {
                const prog = projectProgress(tasks, p.id);
                const pc = PROJECT_COLOR_CLASSES[p.color];
                return (
                  <li key={p.id}>
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2">
                        <span className={cn('w-2.5 h-2.5 rounded-full', pc.dot)} />
                        <span className="text-sm font-medium text-coffee-500">
                          {p.name}
                        </span>
                      </div>
                      <span className="text-xs text-coffee-400 tabular-nums">
                        {prog.completed}/{prog.total}
                      </span>
                    </div>
                    <ProgressBar value={prog.pct} barClassName={pc.bar} />
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </section>

      {/* Upcoming + Activity */}
      <section className="grid lg:grid-cols-3 gap-4">
        <div
          className="lg:col-span-2 bg-cream-50 rounded-2xl border border-cream-200 p-6 shadow-soft animate-slide-up"
          style={{ animationDelay: '240ms' }}
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-lg font-semibold text-coffee-500">
              Upcoming
            </h2>
            <button
              onClick={() => navigate('my-tasks')}
              className="text-sm text-coffee-400 hover:text-coffee-500 inline-flex items-center gap-1 transition-colors"
            >
              All tasks <ArrowRight size={14} />
            </button>
          </div>
          {upcoming.length === 0 ? (
            <EmptyHint text="Nothing due soon. You're all caught up!" />
          ) : (
            <div className="grid sm:grid-cols-2 gap-3">
              {upcoming.map((t) => {
                const project = projects.find((p) => p.id === t.projectId);
                return (
                  <TaskCard
                    key={t.id}
                    task={t}
                    project={project}
                    onClick={() => onOpenTask(t)}
                  />
                );
              })}
            </div>
          )}
        </div>

        <div
          className="bg-cream-50 rounded-2xl border border-cream-200 p-6 shadow-soft animate-slide-up"
          style={{ animationDelay: '300ms' }}
        >
          <div className="flex items-center gap-2 mb-4">
            <Activity size={18} className="text-caramel-500" />
            <h2 className="font-display text-lg font-semibold text-coffee-500">
              Recent Activity
            </h2>
          </div>
          {activity.length === 0 ? (
            <EmptyHint text="Activity will appear here as you work." />
          ) : (
            <ul className="space-y-3">
              {activity.slice(0, 6).map((a) => (
                <li key={a.id} className="flex gap-3">
                  <div className="w-2 h-2 rounded-full bg-caramel-400 mt-1.5 shrink-0" />
                  <div className="min-w-0">
                    <p className="text-sm text-coffee-500 leading-snug">
                      {a.action}
                    </p>
                    <p className="text-xs text-coffee-400 mt-0.5">
                      {relativeTime(a.timestamp)}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </div>
  );
}

function EmptyHint({ text }: { text: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-8 text-center">
      <div className="w-12 h-12 rounded-full bg-cream-200 flex items-center justify-center mb-3">
        <ListTodo size={22} className="text-coffee-400" />
      </div>
      <p className="text-sm text-coffee-400 max-w-xs">{text}</p>
    </div>
  );
}
