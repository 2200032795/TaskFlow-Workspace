import { useState } from 'react';
import { Plus, Filter } from 'lucide-react';
import type { Task, Project, TaskStatus } from '@/types';
import { STATUS_ORDER, STATUS_META } from '@/types';
import { TaskCard } from '@/components/tasks/TaskCard';
import { Button } from '@/components/ui/Button';
import { Select } from '@/components/ui/Field';
import { cn } from '@/lib/cn';

interface BoardProps {
  tasks: Task[];
  projects: Project[];
  onOpenTask: (task: Task) => void;
  onMoveTask: (id: string, status: TaskStatus) => void;
  onQuickAdd: () => void;
}

const COLUMN_ACCENT: Record<TaskStatus, string> = {
  todo: 'bg-coffee-400',
  in_progress: 'bg-caramel-400',
  in_review: 'bg-orange-400',
  completed: 'bg-sage-400',
};

export function Board({
  tasks,
  projects,
  onOpenTask,
  onMoveTask,
  onQuickAdd,
}: BoardProps) {
  const [projectFilter, setProjectFilter] = useState('all');
  const [dragId, setDragId] = useState<string | null>(null);
  const [dropTarget, setDropTarget] = useState<TaskStatus | null>(null);

  const filtered =
    projectFilter === 'all'
      ? tasks
      : tasks.filter((t) => t.projectId === projectFilter);

  const byStatus = (status: TaskStatus) =>
    filtered
      .filter((t) => t.status === status)
      .sort((a, b) => {
        // overdue first, then by due date
        const aOver = a.dueDate ? a.dueDate < new Date().toISOString().slice(0, 10) : false;
        const bOver = b.dueDate ? b.dueDate < new Date().toISOString().slice(0, 10) : false;
        if (aOver !== bOver) return aOver ? -1 : 1;
        if (!a.dueDate && !b.dueDate) return 0;
        if (!a.dueDate) return 1;
        if (!b.dueDate) return -1;
        return a.dueDate < b.dueDate ? -1 : 1;
      });

  const handleDrop = (status: TaskStatus) => {
    if (dragId) {
      const task = tasks.find((t) => t.id === dragId);
      if (task && task.status !== status) onMoveTask(dragId, status);
    }
    setDragId(null);
    setDropTarget(null);
  };

  return (
    <div className="space-y-5">
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-fade-in">
        <div>
          <h1 className="font-display text-3xl font-semibold text-coffee-500">
            Kanban Board
          </h1>
          <p className="text-coffee-400 mt-1">
            Drag cards between columns or use the status menu in task details.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2">
            <Filter size={16} className="text-coffee-400" />
            <Select
              value={projectFilter}
              onChange={(e) => setProjectFilter(e.target.value)}
              className="w-auto py-2"
            >
              <option value="all">All projects</option>
              {projects.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </Select>
          </div>
          <Button onClick={onQuickAdd}>
            <Plus size={18} />
            Add Task
          </Button>
        </div>
      </header>

      <div className="overflow-x-auto pb-4">
        <div className="grid grid-cols-4 gap-4 min-w-[900px]">
          {STATUS_ORDER.map((status) => {
            const columnTasks = byStatus(status);
            return (
              <div
                key={status}
                onDragOver={(e) => {
                  e.preventDefault();
                  setDropTarget(status);
                }}
                onDragLeave={(e) => {
                  if (e.currentTarget === e.target) setDropTarget(null);
                }}
                onDrop={() => handleDrop(status)}
                className={cn(
                  'rounded-2xl bg-cream-200/50 border border-cream-200 p-3 flex flex-col gap-3 min-h-[200px] transition-all duration-200',
                  dropTarget === status && 'drop-target bg-cream-200/80',
                )}
              >
                <div className="flex items-center justify-between px-1">
                  <div className="flex items-center gap-2">
                    <span
                      className={cn(
                        'w-2.5 h-2.5 rounded-full',
                        COLUMN_ACCENT[status],
                      )}
                    />
                    <h3 className="text-sm font-semibold text-coffee-500">
                      {STATUS_META[status].label}
                    </h3>
                  </div>
                  <span className="text-xs text-coffee-400 tabular-nums">
                    {columnTasks.length}
                  </span>
                </div>

                <div className="flex flex-col gap-3">
                  {columnTasks.map((task) => {
                    const project = projects.find((p) => p.id === task.projectId);
                    return (
                      <TaskCard
                        key={task.id}
                        task={task}
                        project={project}
                        onClick={() => onOpenTask(task)}
                        draggable
                        onDragStart={() => setDragId(task.id)}
                        onDragEnd={() => {
                          setDragId(null);
                          setDropTarget(null);
                        }}
                        isDragging={dragId === task.id}
                      />
                    );
                  })}
                  {columnTasks.length === 0 && (
                    <div className="text-center py-8 text-xs text-coffee-400/70 border-2 border-dashed border-cream-300 rounded-xl">
                      Drop tasks here
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
