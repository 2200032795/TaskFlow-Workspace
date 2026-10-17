import { useCallback, useEffect, useState } from 'react';
import type { AppData, Task, Project, ActivityEntry, TaskStatus } from '@/types';
import {
  loadData,
  saveData,
  clearData,
  uid,
  nowISO,
  makeActivity,
  createTask,
  createProject,
} from '@/lib/storage';
import { buildSampleData } from '@/lib/sampleData';

export type ToastKind = 'success' | 'error' | 'info';
export interface Toast {
  id: string;
  kind: ToastKind;
  message: string;
}

export interface NewTaskInput {
  title: string;
  description: string;
  priority: Task['priority'];
  status: Task['status'];
  dueDate: string | null;
  assignee: string;
  projectId: string;
}

export interface NewProjectInput {
  name: string;
  description: string;
  color: Project['color'];
}

export function useTaskStore() {
  const [data, setData] = useState<AppData>(() => {
    const loaded = loadData();
    if (loaded) return loaded;
    const sample = buildSampleData();
    saveData(sample);
    return sample;
  });
  const [toasts, setToasts] = useState<Toast[]>([]);

  useEffect(() => {
    saveData(data);
  }, [data]);

  const pushToast = useCallback((kind: ToastKind, message: string) => {
    const id = uid();
    setToasts((t) => [...t, { id, kind, message }]);
    setTimeout(() => {
      setToasts((t) => t.filter((x) => x.id !== id));
    }, 3200);
  }, []);

  const dismissToast = useCallback((id: string) => {
    setToasts((t) => t.filter((x) => x.id !== id));
  }, []);

  const addTask = useCallback(
    (input: NewTaskInput): Task => {
      const task = createTask(input);
      const activity = makeActivity(
        task.id,
        task.title,
        `Task “${task.title}” was created`,
      );
      setData((d) => ({
        ...d,
        tasks: [task, ...d.tasks],
        activity: [activity, ...d.activity].slice(0, 50),
      }));
      pushToast('success', `Task “${task.title}” created`);
      return task;
    },
    [pushToast],
  );

  const updateTask = useCallback(
    (id: string, patch: Partial<NewTaskInput>): Task | null => {
      let updated: Task | null = null;
      setData((d) => {
        const existing = d.tasks.find((t) => t.id === id);
        if (!existing) return d;
        updated = { ...existing, ...patch, updatedAt: nowISO() };
        const activities: ActivityEntry[] = [];
        if (patch.status && patch.status !== existing.status) {
          activities.push(
            makeActivity(
              id,
              updated.title,
              `Moved “${updated.title}” to ${labelForStatus(patch.status)}`,
            ),
          );
        }
        if (
          patch.title &&
          patch.title !== existing.title
        ) {
          activities.push(
            makeActivity(
              id,
              patch.title,
              `Renamed task to “${patch.title}”`,
            ),
          );
        }
        return {
          ...d,
          tasks: d.tasks.map((t) => (t.id === id ? updated! : t)),
          activity: [...activities, ...d.activity].slice(0, 50),
        };
      });
      if (updated) pushToast('success', 'Task updated');
      return updated;
    },
    [pushToast],
  );

  const setTaskStatus = useCallback(
    (id: string, status: TaskStatus) => {
      setData((d) => {
        const existing = d.tasks.find((t) => t.id === id);
        if (!existing || existing.status === status) return d;
        const updated: Task = {
          ...existing,
          status,
          updatedAt: nowISO(),
        };
        const activity = makeActivity(
          id,
          updated.title,
          `Moved “${updated.title}” to ${labelForStatus(status)}`,
        );
        return {
          ...d,
          tasks: d.tasks.map((t) => (t.id === id ? updated : t)),
          activity: [activity, ...d.activity].slice(0, 50),
        };
      });
    },
    [],
  );

  const deleteTask = useCallback(
    (id: string) => {
      let title = '';
      setData((d) => {
        const existing = d.tasks.find((t) => t.id === id);
        if (!existing) return d;
        title = existing.title;
        return { ...d, tasks: d.tasks.filter((t) => t.id !== id) };
      });
      if (title) pushToast('info', `Task “${title}” deleted`);
    },
    [pushToast],
  );

  const addProject = useCallback(
    (input: NewProjectInput): Project => {
      const project = createProject(input);
      setData((d) => ({ ...d, projects: [...d.projects, project] }));
      pushToast('success', `Project “${project.name}” created`);
      return project;
    },
    [pushToast],
  );

  const updateProject = useCallback(
    (id: string, patch: Partial<NewProjectInput>) => {
      setData((d) => ({
        ...d,
        projects: d.projects.map((p) =>
          p.id === id ? { ...p, ...patch } : p,
        ),
      }));
      pushToast('success', 'Project updated');
    },
    [pushToast],
  );

  const deleteProject = useCallback(
    (id: string) => {
      let name = '';
      setData((d) => {
        const p = d.projects.find((x) => x.id === id);
        if (!p) return d;
        name = p.name;
        return {
          ...d,
          projects: d.projects.filter((x) => x.id !== id),
          tasks: d.tasks.filter((t) => t.projectId !== id),
        };
      });
      if (name) pushToast('info', `Project “${name}” and its tasks deleted`);
    },
    [pushToast],
  );

  const restoreSampleData = useCallback(() => {
    const sample = buildSampleData();
    setData(sample);
    pushToast('success', 'Sample data restored');
  }, [pushToast]);

  const clearAllData = useCallback(() => {
    clearData();
    setData({ tasks: [], projects: [], activity: [] });
    pushToast('info', 'All data cleared');
  }, [pushToast]);

  return {
    tasks: data.tasks,
    projects: data.projects,
    activity: data.activity,
    toasts,
    pushToast,
    dismissToast,
    addTask,
    updateTask,
    setTaskStatus,
    deleteTask,
    addProject,
    updateProject,
    deleteProject,
    restoreSampleData,
    clearAllData,
  };
}

function labelForStatus(status: TaskStatus): string {
  switch (status) {
    case 'todo':
      return 'To Do';
    case 'in_progress':
      return 'In Progress';
    case 'in_review':
      return 'In Review';
    case 'completed':
      return 'Completed';
  }
}
