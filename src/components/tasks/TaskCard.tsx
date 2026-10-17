import { Calendar, AlertCircle } from 'lucide-react';
import type { Task } from '@/types';
import { PRIORITY_META } from '@/types';
import { Badge } from '@/components/ui/Badge';
import { Avatar } from '@/components/ui/Avatar';
import { formatDate, isOverdue } from '@/lib/helpers';
import { cn } from '@/lib/cn';
import { PROJECT_COLOR_CLASSES } from '@/lib/helpers';
import type { Project } from '@/types';

interface TaskCardProps {
  task: Task;
  project?: Project;
  onClick?: () => void;
  draggable?: boolean;
  onDragStart?: (e: React.DragEvent) => void;
  onDragEnd?: (e: React.DragEvent) => void;
  isDragging?: boolean;
  compact?: boolean;
}

export function TaskCard({
  task,
  project,
  onClick,
  draggable,
  onDragStart,
  onDragEnd,
  isDragging,
  compact,
}: TaskCardProps) {
  const overdue = isOverdue(task);
  const priority = PRIORITY_META[task.priority];
  const projectColor = project
    ? PROJECT_COLOR_CLASSES[project.color]
    : null;

  return (
    <article
      draggable={draggable}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      onClick={onClick}
      className={cn(
        'group bg-cream-50 rounded-xl border border-cream-200 p-3.5 shadow-soft hover:shadow-card hover:-translate-y-0.5 transition-all duration-200 cursor-pointer',
        draggable && 'active:cursor-grabbing',
        isDragging && 'dragging',
      )}
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <h4 className="text-sm font-semibold text-coffee-500 leading-snug line-clamp-2">
          {task.title}
        </h4>
        <span
          className={cn('w-2 h-2 rounded-full mt-1.5 shrink-0', priority.dotClass)}
          title={`${priority.label} priority`}
        />
      </div>

      {!compact && task.description && (
        <p className="text-xs text-coffee-400/80 line-clamp-2 mb-3 leading-relaxed">
          {task.description}
        </p>
      )}

      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 flex-wrap">
          <Badge className={priority.badgeClass}>{priority.label}</Badge>
          {projectColor && project && (
            <Badge className="bg-cream-200 text-coffee-400">
              <span className={cn('w-1.5 h-1.5 rounded-full', projectColor.dot)} />
              {project.name}
            </Badge>
          )}
        </div>
        <Avatar name={task.assignee} size="sm" />
      </div>

      <div className="flex items-center gap-3 mt-3 pt-3 border-t border-cream-200">
        <div
          className={cn(
            'flex items-center gap-1 text-xs',
            overdue ? 'text-red-500 font-medium' : 'text-coffee-400',
          )}
        >
          {overdue ? <AlertCircle size={13} /> : <Calendar size={13} />}
          {formatDate(task.dueDate)}
          {overdue && <span className="ml-1">· overdue</span>}
        </div>
      </div>
    </article>
  );
}
