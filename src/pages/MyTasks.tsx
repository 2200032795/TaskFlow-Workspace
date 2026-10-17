import { useMemo, useState } from 'react';
import { Search, Plus, Filter, ListTodo, X } from 'lucide-react';
import type { Task, Project, TaskStatus, TaskPriority } from '@/types';
import { STATUS_ORDER, STATUS_META, PRIORITY_META } from '@/types';
import { TaskCard } from '@/components/tasks/TaskCard';
import { Button } from '@/components/ui/Button';
import { Input, Select } from '@/components/ui/Field';
import { isOverdue } from '@/lib/helpers';

interface MyTasksProps {
  tasks: Task[];
  projects: Project[];
  onOpenTask: (task: Task) => void;
  onQuickAdd: () => void;
}

type StatusFilter = 'all' | TaskStatus | 'overdue';
type PriorityFilter = 'all' | TaskPriority;

export function MyTasks({
  tasks,
  projects,
  onOpenTask,
  onQuickAdd,
}: MyTasksProps) {
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [priorityFilter, setPriorityFilter] = useState<PriorityFilter>('all');
  const [projectFilter, setProjectFilter] = useState('all');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return tasks
      .filter((t) => {
        if (statusFilter === 'overdue') {
          if (!isOverdue(t)) return false;
        } else if (statusFilter !== 'all' && t.status !== statusFilter) {
          return false;
        }
        if (priorityFilter !== 'all' && t.priority !== priorityFilter)
          return false;
        if (projectFilter !== 'all' && t.projectId !== projectFilter)
          return false;
        if (q) {
          const hay =
            `${t.title} ${t.description} ${t.assignee}`.toLowerCase();
          if (!hay.includes(q)) return false;
        }
        return true;
      })
      .sort((a, b) => {
        // incomplete before complete, then by due date
        const aDone = a.status === 'completed' ? 1 : 0;
        const bDone = b.status === 'completed' ? 1 : 0;
        if (aDone !== bDone) return aDone - bDone;
        if (!a.dueDate && !b.dueDate) return 0;
        if (!a.dueDate) return 1;
        if (!b.dueDate) return -1;
        return a.dueDate < b.dueDate ? -1 : 1;
      });
  }, [tasks, query, statusFilter, priorityFilter, projectFilter]);

  const hasFilters =
    query ||
    statusFilter !== 'all' ||
    priorityFilter !== 'all' ||
    projectFilter !== 'all';

  const clearFilters = () => {
    setQuery('');
    setStatusFilter('all');
    setPriorityFilter('all');
    setProjectFilter('all');
  };

  return (
    <div className="space-y-5">
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-fade-in">
        <div>
          <h1 className="font-display text-3xl font-semibold text-coffee-500">
            My Tasks
          </h1>
          <p className="text-coffee-400 mt-1">
            Search, filter, and manage every task in one place.
          </p>
        </div>
        <Button onClick={onQuickAdd}>
          <Plus size={18} />
          Add Task
        </Button>
      </header>

      {/* Filters */}
      <div className="bg-cream-50 rounded-2xl border border-cream-200 p-4 shadow-soft animate-slide-up">
        <div className="flex flex-col lg:flex-row gap-3">
          <div className="relative flex-1">
            <Search
              size={17}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-coffee-400"
            />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by title, description, or assignee…"
              className="pl-10"
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-coffee-400 hover:text-coffee-500"
                aria-label="Clear search"
              >
                <X size={16} />
              </button>
            )}
          </div>
          <div className="flex gap-3 flex-wrap">
            <Select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
              className="w-auto"
            >
              <option value="all">All statuses</option>
              {STATUS_ORDER.map((s) => (
                <option key={s} value={s}>
                  {STATUS_META[s].label}
                </option>
              ))}
              <option value="overdue">Overdue</option>
            </Select>
            <Select
              value={priorityFilter}
              onChange={(e) =>
                setPriorityFilter(e.target.value as PriorityFilter)
              }
              className="w-auto"
            >
              <option value="all">All priorities</option>
              {(Object.keys(PRIORITY_META) as TaskPriority[]).map((p) => (
                <option key={p} value={p}>
                  {PRIORITY_META[p].label}
                </option>
              ))}
            </Select>
            <Select
              value={projectFilter}
              onChange={(e) => setProjectFilter(e.target.value)}
              className="w-auto"
            >
              <option value="all">All projects</option>
              {projects.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </Select>
          </div>
        </div>
        <div className="flex items-center justify-between mt-3 pt-3 border-t border-cream-200">
          <div className="flex items-center gap-2 text-xs text-coffee-400">
            <Filter size={13} />
            <span className="tabular-nums">{filtered.length} task(s)</span>
            {hasFilters && (
              <button
                onClick={clearFilters}
                className="ml-2 inline-flex items-center gap-1 text-coffee-500 hover:underline"
              >
                <X size={12} /> Clear filters
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Results */}
      {filtered.length === 0 ? (
        <div className="bg-cream-50 rounded-2xl border border-cream-200 p-12 text-center shadow-soft animate-slide-up">
          <div className="w-14 h-14 rounded-full bg-cream-200 flex items-center justify-center mx-auto mb-4">
            <ListTodo size={26} className="text-coffee-400" />
          </div>
          <h3 className="font-display text-lg font-semibold text-coffee-500 mb-1">
            {hasFilters ? 'No matching tasks' : 'No tasks yet'}
          </h3>
          <p className="text-sm text-coffee-400 max-w-sm mx-auto">
            {hasFilters
              ? 'Try adjusting your search or filters.'
              : 'Create your first task to start organizing your work.'}
          </p>
          {hasFilters ? (
            <Button variant="secondary" onClick={clearFilters} className="mt-4">
              Clear filters
            </Button>
          ) : (
            <Button onClick={onQuickAdd} className="mt-4">
              <Plus size={18} />
              Add Task
            </Button>
          )}
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-3">
          {filtered.map((task, i) => {
            const project = projects.find((p) => p.id === task.projectId);
            return (
              <div
                key={task.id}
                className="animate-slide-up"
                style={{ animationDelay: `${Math.min(i * 40, 300)}ms` }}
              >
                <TaskCard
                  task={task}
                  project={project}
                  onClick={() => onOpenTask(task)}
                />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}


