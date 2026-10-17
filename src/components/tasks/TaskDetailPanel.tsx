import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import {
  X,
  Trash2,
  Pencil,
  Calendar,
  User,
  FolderOpen,
  AlertCircle,
} from 'lucide-react';
import type { Task, Project, TaskStatus } from '@/types';
import { PRIORITY_META, STATUS_META, STATUS_ORDER } from '@/types';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Avatar } from '@/components/ui/Avatar';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { Input, Textarea, Select, Label } from '@/components/ui/Field';
import {
  formatDateLong,
  isOverdue,
  relativeTime,
  PROJECT_COLOR_CLASSES,
} from '@/lib/helpers';
import { cn } from '@/lib/cn';

interface TaskDetailPanelProps {
  task: Task | null;
  projects: Project[];
  onClose: () => void;
  onUpdate: (id: string, patch: Partial<Task>) => void;
  onDelete: (id: string) => void;
  onEdit: (task: Task) => void;
}

export function TaskDetailPanel({
  task,
  projects,
  onClose,
  onUpdate,
  onDelete,
  onEdit,
}: TaskDetailPanelProps) {
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [localTitle, setLocalTitle] = useState('');
  const [localDesc, setLocalDesc] = useState('');

  useEffect(() => {
    if (task) {
      setLocalTitle(task.title);
      setLocalDesc(task.description);
      setConfirmDelete(false);
    }
  }, [task?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!task) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [task, onClose]);

  if (!task) return null;

  const project = projects.find((p) => p.id === task.projectId);
  const priority = PRIORITY_META[task.priority];
  const overdue = isOverdue(task);
  const projectColor = project ? PROJECT_COLOR_CLASSES[project.color] : null;

  const commitField = <K extends keyof Task>(key: K, value: Task[K]) => {
    if (task[key] === value) return;
    onUpdate(task.id, { [key]: value } as Partial<Task>);
  };

  const commitText = () => {
    if (localTitle.trim() && localTitle !== task.title) {
      onUpdate(task.id, { title: localTitle.trim() });
    } else if (!localTitle.trim()) {
      setLocalTitle(task.title);
    }
    if (localDesc !== task.description) {
      onUpdate(task.id, { description: localDesc });
    }
  };

  return createPortal(
    <div className="fixed inset-0 z-50 flex justify-end">
      <div
        className="absolute inset-0 bg-coffee-600/40 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      />
      <aside
        role="dialog"
        aria-modal="true"
        className="relative w-full max-w-md bg-cream-50 shadow-lift animate-slide-in-right h-full flex flex-col overflow-hidden"
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-cream-200 bg-cream-50/95">
          <div className="flex items-center gap-2">
            {projectColor && project && (
              <Badge className="bg-cream-200 text-coffee-400">
                <span className={cn('w-1.5 h-1.5 rounded-full', projectColor.dot)} />
                {project.name}
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => onEdit(task)}
              className="p-2 rounded-lg text-coffee-400 hover:bg-cream-200 transition-colors"
              aria-label="Edit task"
              title="Edit in full form"
            >
              <Pencil size={18} />
            </button>
            <button
              onClick={() => setConfirmDelete(true)}
              className="p-2 rounded-lg text-red-500 hover:bg-red-50 transition-colors"
              aria-label="Delete task"
              title="Delete task"
            >
              <Trash2 size={18} />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-lg text-coffee-400 hover:bg-cream-200 transition-colors"
              aria-label="Close panel"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-5 space-y-5">
          <div>
            <input
              value={localTitle}
              onChange={(e) => setLocalTitle(e.target.value)}
              onBlur={commitText}
              className="w-full font-display text-2xl font-semibold text-coffee-500 bg-transparent border-none focus:outline-none focus:ring-0 p-0 -ml-0.5"
            />
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <Badge className={priority.badgeClass}>
              <span className={cn('w-1.5 h-1.5 rounded-full', priority.dotClass)} />
              {priority.label} priority
            </Badge>
            {overdue && (
              <Badge className="bg-red-100 text-red-700">
                <AlertCircle size={12} />
                Overdue
              </Badge>
            )}
          </div>

          <div className="space-y-3 bg-cream-100/60 rounded-xl p-4 border border-cream-200">
            <div>
              <Label htmlFor="detail-status">Status</Label>
              <Select
                id="detail-status"
                value={task.status}
                onChange={(e) => commitField('status', e.target.value as TaskStatus)}
              >
                {STATUS_ORDER.map((s) => (
                  <option key={s} value={s}>
                    {STATUS_META[s].label}
                  </option>
                ))}
              </Select>
            </div>
            <div>
              <Label htmlFor="detail-priority">Priority</Label>
              <Select
                id="detail-priority"
                value={task.priority}
                onChange={(e) =>
                  commitField('priority', e.target.value as Task['priority'])
                }
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </Select>
            </div>
            <div>
              <Label htmlFor="detail-due">Due date</Label>
              <Input
                id="detail-due"
                type="date"
                value={task.dueDate ?? ''}
                onChange={(e) => commitField('dueDate', e.target.value || null)}
              />
            </div>
            <div>
              <Label htmlFor="detail-assignee">Assignee</Label>
              <Input
                id="detail-assignee"
                value={task.assignee}
                onChange={(e) => commitField('assignee', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="detail-project">Project</Label>
              <Select
                id="detail-project"
                value={task.projectId}
                onChange={(e) => commitField('projectId', e.target.value)}
              >
                {projects.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="detail-desc">Description</Label>
            <Textarea
              id="detail-desc"
              value={localDesc}
              onChange={(e) => setLocalDesc(e.target.value)}
              onBlur={commitText}
              rows={5}
              placeholder="Add a description…"
            />
          </div>

          <div className="flex items-center gap-2 text-xs text-coffee-400 pt-2 border-t border-cream-200">
            <div className="flex items-center gap-1.5">
              <Calendar size={13} /> Due {formatDateLong(task.dueDate)}
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs text-coffee-400">
            <div className="flex items-center gap-1.5">
              <User size={13} /> Assigned to {task.assignee}
            </div>
          </div>
          {project && (
            <div className="flex items-center gap-2 text-xs text-coffee-400">
              <div className="flex items-center gap-1.5">
                <FolderOpen size={13} /> {project.name}
              </div>
            </div>
          )}
          <p className="text-[11px] text-coffee-400/70">
            Created {relativeTime(task.createdAt)} · Updated{' '}
            {relativeTime(task.updatedAt)}
          </p>

          {confirmDelete && (
            <div className="rounded-xl border border-red-200 bg-red-50 p-4 animate-scale-in">
              <p className="text-sm text-red-700 mb-3">
                Delete this task permanently? This cannot be undone.
              </p>
              <div className="flex gap-2">
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => {
                    onDelete(task.id);
                    onClose();
                  }}
                >
                  Yes, delete
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setConfirmDelete(false)}
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </div>

        <div className="px-5 py-3 border-t border-cream-200 bg-cream-100/50 flex items-center gap-3">
          <div className="flex-1">
            <div className="flex items-center justify-between text-xs text-coffee-400 mb-1">
              <span>Progress</span>
              <span>{STATUS_META[task.status].label}</span>
            </div>
            <ProgressBar
              value={
                task.status === 'completed'
                  ? 100
                  : task.status === 'in_review'
                    ? 75
                    : task.status === 'in_progress'
                      ? 50
                      : 15
              }
              barClassName={projectColor?.bar ?? 'bg-sage-400'}
            />
          </div>
          <Avatar name={task.assignee} size="md" />
        </div>
      </aside>
    </div>,
    document.body,
  );
}
