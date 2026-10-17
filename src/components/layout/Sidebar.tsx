import { useState } from 'react';
import {
  LayoutDashboard,
  KanbanSquare,
  ListTodo,
  FolderKanban,
  Settings,
  Menu,
  X,
  Plus,
} from 'lucide-react';
import { cn } from '@/lib/cn';
import { navigate, type Route } from '@/hooks/useRouter';
import { Button } from '@/components/ui/Button';

interface SidebarProps {
  current: Route['name'];
  onQuickAdd: () => void;
}

const navItems: {
  name: Route['name'];
  label: string;
  icon: typeof LayoutDashboard;
}[] = [
  { name: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { name: 'board', label: 'Kanban Board', icon: KanbanSquare },
  { name: 'my-tasks', label: 'My Tasks', icon: ListTodo },
  { name: 'projects', label: 'Projects', icon: FolderKanban },
  { name: 'settings', label: 'Settings', icon: Settings },
];

export function Sidebar({ current, onQuickAdd }: SidebarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const go = (name: Route['name']) => {
    navigate(name);
    setMobileOpen(false);
  };

  return (
    <>
      {/* Mobile top bar */}
      <div className="md:hidden sticky top-0 z-30 flex items-center justify-between px-4 py-3 bg-cream-50 border-b border-cream-200">
        <button
          onClick={() => setMobileOpen(true)}
          className="p-2 rounded-lg text-coffee-500 hover:bg-cream-200"
          aria-label="Open menu"
        >
          <Menu size={22} />
        </button>
        <Brand small />
        <Button size="sm" onClick={onQuickAdd} aria-label="Add task">
          <Plus size={16} />
        </Button>
      </div>

      {/* Mobile drawer backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-coffee-600/40 backdrop-blur-sm md:hidden animate-fade-in"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar (desktop fixed, mobile drawer) */}
      <aside
        className={cn(
          'fixed md:sticky top-0 left-0 z-50 md:z-10 h-screen w-64 shrink-0 bg-cream-50 border-r border-cream-200 flex flex-col transition-transform duration-300 md:translate-x-0',
          mobileOpen ? 'translate-x-0' : '-translate-x-full',
        )}
      >
        <div className="flex items-center justify-between px-5 py-5">
          <Brand />
          <button
            onClick={() => setMobileOpen(false)}
            className="md:hidden p-1.5 rounded-lg text-coffee-400 hover:bg-cream-200"
            aria-label="Close menu"
          >
            <X size={20} />
          </button>
        </div>

        <div className="px-4 pb-4">
          <Button
            onClick={onQuickAdd}
            className="w-full"
            aria-label="Quick add task"
          >
            <Plus size={18} />
            Quick Add Task
          </Button>
        </div>

        <nav className="flex-1 px-3 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = current === item.name;
            return (
              <button
                key={item.name}
                onClick={() => go(item.name)}
                className={cn(
                  'w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200',
                  active
                    ? 'bg-coffee-500 text-cream-100 shadow-soft'
                    : 'text-coffee-500 hover:bg-cream-200',
                )}
              >
                <Icon
                  size={19}
                  className={active ? 'text-cream-100' : 'text-coffee-400'}
                />
                {item.label}
              </button>
            );
          })}
        </nav>

        <div className="px-5 py-4 border-t border-cream-200">
          <p className="text-[11px] text-coffee-400/70 leading-relaxed">
            Data is stored locally in this browser. It does not sync across
            devices or users.
          </p>
        </div>
      </aside>
    </>
  );
}

function Brand({ small }: { small?: boolean }) {
  return (
    <div className="flex items-center gap-2.5">
      <div
        className={cn(
          'flex items-center justify-center rounded-xl bg-coffee-500 text-cream-100 shadow-soft',
          small ? 'w-8 h-8' : 'w-10 h-10',
        )}
      >
        <KanbanSquare size={small ? 18 : 22} />
      </div>
      <div className="leading-tight">
        <p
          className={cn(
            'font-display font-semibold text-coffee-500',
            small ? 'text-base' : 'text-lg',
          )}
        >
          TaskFlow
        </p>
        {!small && (
          <p className="text-[11px] text-coffee-400 tracking-wide">Workspace</p>
        )}
      </div>
    </div>
  );
}
