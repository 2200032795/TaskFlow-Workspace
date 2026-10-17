import { useEffect, useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Label, Input, Textarea, Select, FieldError } from '@/components/ui/Field';
import type { Task, TaskPriority, TaskStatus } from '@/types';
import { STATUS_ORDER, STATUS_META } from '@/types';
import type { NewTaskInput } from '@/hooks/useTaskStore';
import type { Project } from '@/types';

interface TaskFormModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (input: NewTaskInput) => void;
  projects: Project[];
  defaultProjectId?: string;
  editingTask?: Task | null;
}

interface FormErrors {
  title?: string;
  assignee?: string;
  projectId?: string;
}

export function TaskFormModal({
  open,
  onClose,
  onSubmit,
  projects,
  defaultProjectId,
  editingTask,
}: TaskFormModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<TaskPriority>('medium');
  const [status, setStatus] = useState<TaskStatus>('todo');
  const [dueDate, setDueDate] = useState<string>('');
  const [assignee, setAssignee] = useState('');
  const [projectId, setProjectId] = useState('');
  const [errors, setErrors] = useState<FormErrors>({});

  useEffect(() => {
    if (!open) return;
    if (editingTask) {
      setTitle(editingTask.title);
      setDescription(editingTask.description);
      setPriority(editingTask.priority);
      setStatus(editingTask.status);
      setDueDate(editingTask.dueDate ?? '');
      setAssignee(editingTask.assignee);
      setProjectId(editingTask.projectId);
    } else {
      setTitle('');
      setDescription('');
      setPriority('medium');
      setStatus('todo');
      setDueDate('');
      setAssignee('');
      setProjectId(defaultProjectId ?? projects[0]?.id ?? '');
    }
    setErrors({});
  }, [open, editingTask, defaultProjectId, projects]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const next: FormErrors = {};
    if (!title.trim()) next.title = 'Title is required';
    if (!assignee.trim()) next.assignee = 'Assignee is required';
    if (!projectId) next.projectId = 'Please choose a project';
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    onSubmit({
      title: title.trim(),
      description: description.trim(),
      priority,
      status,
      dueDate: dueDate || null,
      assignee: assignee.trim(),
      projectId,
    });
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={editingTask ? 'Edit Task' : 'New Task'}
      footer={
        <>
          <Button variant="ghost" onClick={onClose} type="button">
            Cancel
          </Button>
          <Button type="submit" form="task-form">
            {editingTask ? 'Save Changes' : 'Create Task'}
          </Button>
        </>
      }
    >
      <form id="task-form" onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="task-title" required>
            Title
          </Label>
          <Input
            id="task-title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Review design mockups"
            autoFocus
          />
          {errors.title && <FieldError>{errors.title}</FieldError>}
        </div>

        <div>
          <Label htmlFor="task-desc">Description</Label>
          <Textarea
            id="task-desc"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Add any details, context, or acceptance criteria…"
            rows={3}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="task-priority">Priority</Label>
            <Select
              id="task-priority"
              value={priority}
              onChange={(e) => setPriority(e.target.value as TaskPriority)}
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="urgent">Urgent</option>
            </Select>
          </div>
          <div>
            <Label htmlFor="task-status">Status</Label>
            <Select
              id="task-status"
              value={status}
              onChange={(e) => setStatus(e.target.value as TaskStatus)}
            >
              {STATUS_ORDER.map((s) => (
                <option key={s} value={s}>
                  {STATUS_META[s].label}
                </option>
              ))}
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="task-due">Due Date</Label>
            <Input
              id="task-due"
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="task-assignee" required>
              Assignee
            </Label>
            <Input
              id="task-assignee"
              value={assignee}
              onChange={(e) => setAssignee(e.target.value)}
              placeholder="e.g. Maya Chen"
            />
            {errors.assignee && <FieldError>{errors.assignee}</FieldError>}
          </div>
        </div>

        <div>
          <Label htmlFor="task-project" required>
            Project
          </Label>
          <Select
            id="task-project"
            value={projectId}
            onChange={(e) => setProjectId(e.target.value)}
          >
            {projects.length === 0 && <option value="">No projects available</option>}
            {projects.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </Select>
          {errors.projectId && <FieldError>{errors.projectId}</FieldError>}
        </div>
      </form>
    </Modal>
  );
}
