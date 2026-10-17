# TaskFlow Workspace

A modern task and project management dashboard built with React, TypeScript, Vite, Tailwind CSS, and Lucide icons. All data is stored locally in the browser — no account, server, or external services required.

## Features

### Dashboard
- Summary cards for total, completed, pending, and overdue tasks
- Overall completion progress bar
- Per-project progress overview
- Upcoming tasks preview and recent activity feed
- Quick-add task button

### Kanban Board
- Four columns: To Do, In Progress, In Review, Completed
- Drag-and-drop task cards between columns (with drop highlights)
- Filter the board by project
- Cards show title, priority, due date, assignee, and project

### My Tasks
- Full searchable, filterable list of every task
- Filter by status, priority, and project
- Search across title, description, and assignee
- Clear-filters shortcut and empty states

### Projects
- Create, edit, and delete projects (sage / caramel / coffee color tags)
- Each project card shows live progress and active vs. done counts
- View all tasks within a project from the card

### Task Management
- Add and edit tasks via a validated modal form (title + assignee + project required)
- Task detail side panel: inline edit of title, description, status, priority, due date, assignee, and project
- Delete with confirmation
- Toast notifications for every create / update / delete / move

### Task Details Panel
- Slide-in panel when a task card is selected
- Inline editing plus quick status, priority, and project switches
- Delete with confirmation, edit shortcut to the full form

### Persistence
- Everything is saved to `localStorage` automatically on every change
- Sample data is seeded on first launch
- Settings page offers "Restore sample data" and "Clear all data"
- Data is local to this browser only — it does **not** sync across devices or users

### Animations & Accessibility
- Smooth card hover lift, entrance animations for sections, animated progress bars
- `prefers-reduced-motion` respected — animations collapse to instant transitions
- Keyboard support: Esc closes modals and panels; focus rings on interactive controls

### Navigation
- Sidebar with Dashboard, Kanban Board, My Tasks, Projects, Settings
- Collapsible mobile menu with overlay
- Active route highlighting

## Getting Started

```bash
npm install
npm run dev        # start the dev server
npm run build      # production build
npm run typecheck  # type-check
npm run lint       # lint
```

The app seeds realistic sample projects and tasks on first launch so you can explore immediately.

## Tech Stack

- React 18 + TypeScript
- Vite 5
- Tailwind CSS 3 (custom warm palette: cream, coffee, sage, caramel)
- Lucide React icons
- `localStorage` for persistence

## Notes

This version is fully client-side. There is no authentication and no real-time collaboration. All data lives in the browser you're using right now.
