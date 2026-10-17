import { useEffect, useState } from 'react';
import {
  Plus,
  Pencil,
  Trash2,
  FolderKanban,
  CheckCircle2,
  ListTodo,
} from 'lucide-react';
import type { Task, Project } from '@/types';
import { Button } from '@/components/ui/Button';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { Modal } from '@/components/ui/Modal';
import { Label, Input, Textarea, Select, FieldError } from '@/components/ui/Field';
import { TaskCard } from '@/components/tasks/TaskCard';
import {
  projectProgress,
  PROJECT_COLOR_CLASSES,
} from '@/lib/helpers';
import { cn } from '@/lib/cn';
import type { NewProjectInput } from '@/hooks/useTaskStore';

interface ProjectsProps {
  tasks: Task[];
  projects: Project[];
  onAddProject: (input: NewProjectInput) => void;
  onUpdateProject: (id: string, patch: Partial<NewProjectInput>) => void;
  onDeleteProject: (id: string) => void;
  onOpenTask: (task: Task) => void;
}

const COLOR_OPTIONS: { value: Project['color']; label: string }[] = [
  { value: 'sage', label: 'Sage' },
  { value: 'caramel', label: 'Caramel' },
  { value: 'coffee', label: 'Coffee' },
];

export function Projects({
  tasks,
  projects,
  onAddProject,
  onUpdateProject,
  onDeleteProject,
  onOpenTask,
}: ProjectsProps) {
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Project | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<Project | null>(null);

  const selected = projects.find((p) => p.id === selectedId) ?? null;
  const selectedTasks = selected
    ? tasks.filter((t) => t.projectId === selected.id)
    : [];

  const openNew = () => {
    setEditing(null);
    setFormOpen(true);
  };
  const openEdit = (p: Project) => {
    setEditing(p);
    setFormOpen(true);
  };

  return (
    <div className="space-y-5">
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-fade-in">
        <div>
          <h1 className="font-display text-3xl font-semibold text-coffee-500">
            Projects
          </h1>
          <p className="text-coffee-400 mt-1">
            Group tasks by project and track progress at a glance.
          </p>
        </div>
        <Button onClick={openNew}>
          <Plus size={18} />
          New Project
        </Button>
      </header>

      {projects.length === 0 ? (
        <div className="bg-cream-50 rounded-2xl border border-cream-200 p-12 text-center shadow-soft animate-slide-up">
          <div className="w-14 h-14 rounded-full bg-cream-200 flex items-center justify-center mx-auto mb-4">
            <FolderKanban size={26} className="text-coffee-400" />
          </div>
          <h3 className="font-display text-lg font-semibold text-coffee-500 mb-1">
            No projects yet
          </h3>
          <p className="text-sm text-coffee-400 max-w-sm mx-auto">
            Create your first project to start grouping related tasks together.
          </p>
          <Button onClick={openNew} className="mt-4">
            <Plus size={18} />
            New Project
          </Button>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
          {projects.map((p, i) => {
            const prog = projectProgress(tasks, p.id);
            const pc = PROJECT_COLOR_CLASSES[p.color];
            return (
              <article
                key={p.id}
                className="bg-cream-50 rounded-2xl border border-cream-200 p-5 shadow-soft hover:shadow-card transition-shadow animate-slide-up flex flex-col"
                style={{ animationDelay: `${i * 60}ms` }}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div
                      className={cn(
                        'w-10 h-10 rounded-xl flex items-center justify-center',
                        pc.soft,
                      )}
                    >
                      <FolderKanban size={20} className={pc.text} />
                    </div>
                    <div>
                      <h3 className="font-display text-lg font-semibold text-coffee-500">
                        {p.name}
                      </h3>
                      <p className="text-xs text-coffee-400">
                        {prog.total} task{prog.total === 1 ? '' : 's'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => openEdit(p)}
                      className="p-1.5 rounded-lg text-coffee-400 hover:bg-cream-200 transition-colors"
                      aria-label="Edit project"
                    >
                      <Pencil size={16} />
                    </button>
                    <button
                      onClick={() => setConfirmDelete(p)}
                      className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 transition-colors"
                      aria-label="Delete project"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                <p className="text-sm text-coffee-400 leading-relaxed line-clamp-2 mb-4 flex-1">
                  {p.description || 'No description.'}
                </p>

                <div className="mb-4">
                  <div className="flex items-center justify-between text-xs text-coffee-400 mb-1.5">
                    <span>Progress</span>
                    <span className="tabular-nums">
                      {prog.completed}/{prog.total} · {prog.pct}%
                    </span>
                  </div>
                  <ProgressBar value={prog.pct} barClassName={pc.bar} />
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-cream-200">
                  <div className="flex items-center gap-3 text-xs text-coffee-400">
                    <span className="flex items-center gap-1">
                      <ListTodo size={13} />
                      {prog.total - prog.completed} active
                    </span>
                    <span className="flex items-center gap-1">
                      <CheckCircle2 size={13} />
                      {prog.completed} done
                    </span>
                  </div>
                  <button
                    onClick={() => setSelectedId(p.id)}
                    className="text-sm font-medium text-coffee-500 hover:underline"
                  >
                    View tasks
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      )}

      <ProjectFormModal
        key={editing?.id ?? 'new'}
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSubmit={(input) => {
          if (editing) onUpdateProject(editing.id, input);
          else onAddProject(input);
          setFormOpen(false);
        }}
        editing={editing}
      />

      {selected && (
        <Modal
          open={!!selected}
          onClose={() => setSelectedId(null)}
          title={
            <span className="flex items-center gap-2">
              <span
                className={cn(
                  'w-2.5 h-2.5 rounded-full',
                  PROJECT_COLOR_CLASSES[selected.color].dot,
                )}
              />
              {selected.name}
            </span>
          }
          size="lg"
        >
          {selectedTasks.length === 0 ? (
            <p className="text-sm text-coffee-400 py-6 text-center">
              No tasks in this project yet.
            </p>
          ) : (
            <div className="grid sm:grid-cols-2 gap-3">
              {selectedTasks.map((t) => (
                <TaskCard
                  key={t.id}
                  task={t}
                  onClick={() => {
                    onOpenTask(t);
                    setSelectedId(null);
                  }}
                />
              ))}
            </div>
          )}
        </Modal>
      )}

      {confirmDelete && (
        <Modal
          open={!!confirmDelete}
          onClose={() => setConfirmDelete(null)}
          title="Delete project"
          size="sm"
          footer={
            <>
              <Button variant="ghost" onClick={() => setConfirmDelete(null)}>
                Cancel
              </Button>
              <Button
                variant="danger"
                onClick={() => {
                  onDeleteProject(confirmDelete.id);
                  setConfirmDelete(null);
                }}
              >
                Delete project & tasks
              </Button>
            </>
          }
        >
          <p className="text-sm text-coffee-500">
            Delete <strong>{confirmDelete.name}</strong>? This also deletes{' '}
            {tasks.filter((t) => t.projectId === confirmDelete.id).length}{' '}
            task(s) inside it. This cannot be undone.
          </p>
        </Modal>
      )}
    </div>
  );
}

interface ProjectFormModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (input: NewProjectInput) => void;
  editing: Project | null;
}

function ProjectFormModal({
  open,
  onClose,
  onSubmit,
  editing,
}: ProjectFormModalProps) {
  const [name, setName] = useState(editing?.name ?? '');
  const [description, setDescription] = useState(editing?.description ?? '');
  const [color, setColor] = useState<Project['color']>(editing?.color ?? 'sage');
  const [error, setError] = useState('');

  useEffect(() => {
    if (open) setError('');
  }, [open]);

  const submit = () => {
    if (!name.trim()) {
      setError('Project name is required');
      return;
    }
    onSubmit({
      name: name.trim(),
      description: description.trim(),
      color,
    });
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={editing ? 'Edit Project' : 'New Project'}
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={submit}>
            {editing ? 'Save Changes' : 'Create Project'}
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        <div>
          <Label htmlFor="proj-name" required>
            Name
          </Label>
          <Input
            id="proj-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Website Redesign"
            autoFocus
          />
          {error && <FieldError>{error}</FieldError>}
        </div>
        <div>
          <Label htmlFor="proj-desc">Description</Label>
          <Textarea
            id="proj-desc"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            placeholder="What is this project about?"
          />
        </div>
        <div>
          <Label>Color</Label>
          <div className="flex gap-2.5">
            {COLOR_OPTIONS.map((c) => (
              <button
                key={c.value}
                type="button"
                onClick={() => setColor(c.value)}
                className={cn(
                  'w-9 h-9 rounded-full transition-all',
                  PROJECT_COLOR_CLASSES[c.value].dot,
                  color === c.value
                    ? 'ring-2 ring-offset-2 ring-offset-cream-50 ring-coffee-400 scale-110'
                    : 'opacity-70 hover:opacity-100',
                )}
                aria-label={`${c.label} color`}
              />
            ))}
          </div>
        </div>
      </div>
    </Modal>
  );
}
