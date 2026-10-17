import type { AppData, Task, Project, ActivityEntry } from '@/types';

const STORAGE_KEY = 'taskflow:data:v1';

export function loadData(): AppData | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as AppData;
    if (!parsed.tasks || !parsed.projects) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function saveData(data: AppData): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    // ignore quota / serialization errors
  }
}

export function clearData(): void {
  localStorage.removeItem(STORAGE_KEY);
}

export function uid(): string {
  return (
    Date.now().toString(36) + Math.random().toString(36).slice(2, 8)
  );
}

export function nowISO(): string {
  return new Date().toISOString();
}

export function todayISODate(): string {
  return new Date().toISOString().slice(0, 10);
}

export function makeActivity(
  taskId: string,
  taskTitle: string,
  action: string,
): ActivityEntry {
  return { id: uid(), taskId, taskTitle, action, timestamp: nowISO() };
}

export function createTask(
  partial: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>,
): Task {
  return {
    ...partial,
    id: uid(),
    createdAt: nowISO(),
    updatedAt: nowISO(),
  };
}

export function createProject(
  partial: Omit<Project, 'id' | 'createdAt'>,
): Project {
  return { ...partial, id: uid(), createdAt: nowISO() };
}
