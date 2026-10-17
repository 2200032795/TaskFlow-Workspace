import { useState } from 'react';
import {
  RotateCcw,
  Trash2,
  Database,
  Info,
  HardDrive,
  Github,
  Heart,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { cn } from '@/lib/cn';

interface SettingsProps {
  onRestoreSample: () => void;
  onClearAll: () => void;
  taskCount: number;
  projectCount: number;
}

export function Settings({
  onRestoreSample,
  onClearAll,
  taskCount,
  projectCount,
}: SettingsProps) {
  const [confirmClear, setConfirmClear] = useState(false);
  const [confirmRestore, setConfirmRestore] = useState(false);

  return (
    <div className="space-y-6 max-w-3xl">
      <header className="animate-fade-in">
        <h1 className="font-display text-3xl font-semibold text-coffee-500">
          Settings
        </h1>
        <p className="text-coffee-400 mt-1">
          Manage your local data and learn how TaskFlow stores it.
        </p>
      </header>

      {/* Storage info */}
      <section className="bg-cream-50 rounded-2xl border border-cream-200 p-6 shadow-soft animate-slide-up">
        <div className="flex items-center gap-2 mb-4">
          <HardDrive size={18} className="text-coffee-400" />
          <h2 className="font-display text-lg font-semibold text-coffee-500">
            Storage
          </h2>
        </div>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="bg-cream-100/60 rounded-xl p-4 border border-cream-200">
            <p className="text-xs text-coffee-400 mb-1">Tasks</p>
            <p className="text-2xl font-semibold text-coffee-500 tabular-nums">
              {taskCount}
            </p>
          </div>
          <div className="bg-cream-100/60 rounded-xl p-4 border border-cream-200">
            <p className="text-xs text-coffee-400 mb-1">Projects</p>
            <p className="text-2xl font-semibold text-coffee-500 tabular-nums">
              {projectCount}
            </p>
          </div>
        </div>
        <div className="flex items-start gap-3 rounded-xl bg-sage-300/20 border border-sage-300/50 p-4">
          <Info size={18} className="text-sage-600 mt-0.5 shrink-0" />
          <p className="text-sm text-coffee-500 leading-relaxed">
            TaskFlow saves your data in this browser's local storage. It
            persists across page refreshes but does <strong>not</strong>{' '}
            synchronize between devices or users. Clearing your browser data
            will remove it.
          </p>
        </div>
      </section>

      {/* Data management */}
      <section className="bg-cream-50 rounded-2xl border border-cream-200 p-6 shadow-soft animate-slide-up">
        <div className="flex items-center gap-2 mb-4">
          <Database size={18} className="text-coffee-400" />
          <h2 className="font-display text-lg font-semibold text-coffee-500">
            Data Management
          </h2>
        </div>
        <div className="space-y-3">
          <div className="flex items-center justify-between gap-4 p-4 rounded-xl border border-cream-200 bg-cream-100/40">
            <div>
              <p className="text-sm font-medium text-coffee-500">
                Restore sample data
              </p>
              <p className="text-xs text-coffee-400 mt-0.5">
                Replace everything with the original demo tasks and projects.
              </p>
            </div>
            <Button
              variant="secondary"
              onClick={() => setConfirmRestore(true)}
            >
              <RotateCcw size={16} />
              Restore
            </Button>
          </div>
          <div className="flex items-center justify-between gap-4 p-4 rounded-xl border border-red-200 bg-red-50/50">
            <div>
              <p className="text-sm font-medium text-red-700">
                Clear all data
              </p>
              <p className="text-xs text-red-500/80 mt-0.5">
                Permanently delete all tasks and projects.
              </p>
            </div>
            <Button variant="danger" onClick={() => setConfirmClear(true)}>
              <Trash2 size={16} />
              Clear
            </Button>
          </div>
        </div>
      </section>

      {/* About */}
      <section className="bg-cream-50 rounded-2xl border border-cream-200 p-6 shadow-soft animate-slide-up">
        <h2 className="font-display text-lg font-semibold text-coffee-500 mb-3">
          About TaskFlow
        </h2>
        <p className="text-sm text-coffee-400 leading-relaxed mb-4">
          TaskFlow Workspace is a lightweight task and project management
          dashboard built with React, TypeScript, Vite, and Tailwind CSS. This
          version runs entirely in your browser — no account, no server, no
          sync.
        </p>
        <div className="flex items-center gap-4 text-xs text-coffee-400">
          <span className="flex items-center gap-1.5">
            <Github size={14} /> v1.0.0
          </span>
          <span className="flex items-center gap-1.5">
            <Heart size={14} className={cn('text-caramel-500')} /> Built for
            focus
          </span>
        </div>
      </section>

      {/* Confirm dialogs */}
      <Modal
        open={confirmRestore}
        onClose={() => setConfirmRestore(false)}
        title="Restore sample data"
        size="sm"
        footer={
          <>
            <Button variant="ghost" onClick={() => setConfirmRestore(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                onRestoreSample();
                setConfirmRestore(false);
              }}
            >
              Restore sample data
            </Button>
          </>
        }
      >
        <p className="text-sm text-coffee-500">
          This replaces all current tasks and projects with the original demo
          content. Your current data will be lost.
        </p>
      </Modal>

      <Modal
        open={confirmClear}
        onClose={() => setConfirmClear(false)}
        title="Clear all data"
        size="sm"
        footer={
          <>
            <Button variant="ghost" onClick={() => setConfirmClear(false)}>
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={() => {
                onClearAll();
                setConfirmClear(false);
              }}
            >
              Delete everything
            </Button>
          </>
        }
      >
        <p className="text-sm text-coffee-500">
          This permanently deletes all tasks and projects. You can restore the
          demo data afterward, but anything you created will be gone.
        </p>
      </Modal>
    </div>
  );
}
