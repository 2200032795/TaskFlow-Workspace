export type TaskStatus = 'todo' | 'in_progress' | 'in_review' | 'completed';
export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';

export interface Task {
  id: string;
  title: string;
  description: string;
  priority: TaskPriority;
  status: TaskStatus;
  dueDate: string | null; // ISO date string (yyyy-mm-dd) or null
  assignee: string;
  projectId: string;
  createdAt: string; // ISO timestamp
  updatedAt: string; // ISO timestamp
}

export interface Project {
  id: string;
  name: string;
  description: string;
  color: string; // tailwind color key: sage | caramel | coffee
  createdAt: string;
}

export interface ActivityEntry {
  id: string;
  taskId: string;
  taskTitle: string;
  action: string; // human-readable action text
  timestamp: string; // ISO timestamp
}

export interface AppData {
  tasks: Task[];
  projects: Project[];
  activity: ActivityEntry[];
}

export const STATUS_META: Record<
  TaskStatus,
  { label: string; order: number }
> = {
  todo: { label: 'To Do', order: 0 },
  in_progress: { label: 'In Progress', order: 1 },
  in_review: { label: 'In Review', order: 2 },
  completed: { label: 'Completed', order: 3 },
};

export const STATUS_ORDER: TaskStatus[] = [
  'todo',
  'in_progress',
  'in_review',
  'completed',
];

export const PRIORITY_META: Record<
  TaskPriority,
  { label: string; dotClass: string; badgeClass: string }
> = {
  low: {
    label: 'Low',
    dotClass: 'bg-sage-400',
    badgeClass: 'bg-sage-300/60 text-sage-600',
  },
  medium: {
    label: 'Medium',
    dotClass: 'bg-caramel-400',
    badgeClass: 'bg-caramel-300/60 text-coffee-500',
  },
  high: {
    label: 'High',
    dotClass: 'bg-orange-500',
    badgeClass: 'bg-orange-100 text-orange-700',
  },
  urgent: {
    label: 'Urgent',
    dotClass: 'bg-red-500',
    badgeClass: 'bg-red-100 text-red-700',
  },
};
