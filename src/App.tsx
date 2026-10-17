import { useCallback, useState } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { Dashboard } from '@/pages/Dashboard';
import { Board } from '@/pages/Board';
import { MyTasks } from '@/pages/MyTasks';
import { Projects } from '@/pages/Projects';
import { Settings } from '@/pages/Settings';
import { TaskFormModal } from '@/components/tasks/TaskFormModal';
import { TaskDetailPanel } from '@/components/tasks/TaskDetailPanel';
import { ToastContainer } from '@/components/ui/Toast';
import { useTaskStore } from '@/hooks/useTaskStore';
import { useRouter } from '@/hooks/useRouter';
import type { Task } from '@/types';

function App() {
  const route = useRouter();
  const store = useTaskStore();
  const [formOpen, setFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [detailTaskId, setDetailTaskId] = useState<string | null>(null);

  const openQuickAdd = useCallback(() => {
    setEditingTask(null);
    setFormOpen(true);
  }, []);

  const openEditTask = useCallback((task: Task) => {
    setEditingTask(task);
    setFormOpen(true);
    setDetailTaskId(null);
  }, []);

  const openTaskDetail = useCallback((task: Task) => {
    setDetailTaskId(task.id);
  }, []);

  const detailTask =
    store.tasks.find((t) => t.id === detailTaskId) ?? null;

  const renderPage = () => {
    switch (route.name) {
      case 'dashboard':
        return (
          <Dashboard
            tasks={store.tasks}
            projects={store.projects}
            activity={store.activity}
            onQuickAdd={openQuickAdd}
            onOpenTask={openTaskDetail}
          />
        );
      case 'board':
        return (
          <Board
            tasks={store.tasks}
            projects={store.projects}
            onOpenTask={openTaskDetail}
            onMoveTask={store.setTaskStatus}
            onQuickAdd={openQuickAdd}
          />
        );
      case 'my-tasks':
        return (
          <MyTasks
            tasks={store.tasks}
            projects={store.projects}
            onOpenTask={openTaskDetail}
            onQuickAdd={openQuickAdd}
          />
        );
      case 'projects':
        return (
          <Projects
            tasks={store.tasks}
            projects={store.projects}
            onAddProject={store.addProject}
            onUpdateProject={store.updateProject}
            onDeleteProject={store.deleteProject}
            onOpenTask={openTaskDetail}
          />
        );
      case 'settings':
        return (
          <Settings
            onRestoreSample={store.restoreSampleData}
            onClearAll={store.clearAllData}
            taskCount={store.tasks.length}
            projectCount={store.projects.length}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex min-h-screen bg-cream-100">
      <Sidebar current={route.name} onQuickAdd={openQuickAdd} />
      <main className="flex-1 min-w-0 px-4 sm:px-6 lg:px-8 py-6 md:py-8 max-w-7xl mx-auto w-full">
        {renderPage()}
      </main>

      <TaskFormModal
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSubmit={(input) => {
          if (editingTask) store.updateTask(editingTask.id, input);
          else store.addTask(input);
        }}
        projects={store.projects}
        editingTask={editingTask}
      />

      <TaskDetailPanel
        task={detailTask}
        projects={store.projects}
        onClose={() => setDetailTaskId(null)}
        onUpdate={store.updateTask}
        onDelete={store.deleteTask}
        onEdit={openEditTask}
      />

      <ToastContainer toasts={store.toasts} onDismiss={store.dismissToast} />
    </div>
  );
}

export default App;
