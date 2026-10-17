import type { AppData, Task, Project } from '@/types';
import { createTask, createProject } from '@/lib/storage';

function daysFromNow(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

export function buildSampleData(): AppData {
  const projects: Project[] = [
    createProject({
      name: 'Website Redesign',
      description: 'Refresh the marketing site with a new look and improved copy.',
      color: 'sage',
    }),
    createProject({
      name: 'Mobile App Launch',
      description: 'Ship the first public release of the iOS and Android app.',
      color: 'caramel',
    }),
    createProject({
      name: 'Q4 Marketing Campaign',
      description: 'Plan and execute the holiday season promotional campaign.',
      color: 'coffee',
    }),
  ];

  const [web, mobile, marketing] = projects;

  const tasks: Task[] = [
    createTask({
      title: 'Design new homepage hero',
      description:
        'Create three hero concepts exploring different value propositions and layout directions.',
      priority: 'high',
      status: 'in_progress',
      dueDate: daysFromNow(2),
      assignee: 'Maya Chen',
      projectId: web.id,
    }),
    createTask({
      title: 'Write landing page copy',
      description:
        'Draft headline, subhead, and three feature blurbs with a friendly, confident tone.',
      priority: 'medium',
      status: 'in_review',
      dueDate: daysFromNow(1),
      assignee: 'Dev Patel',
      projectId: web.id,
    }),
    createTask({
      title: 'Audit current site accessibility',
      description:
        'Run a keyboard and screen-reader audit across the top 10 pages and log findings.',
      priority: 'urgent',
      status: 'todo',
      dueDate: daysFromNow(-1),
      assignee: 'Riley Brooks',
      projectId: web.id,
    }),
    createTask({
      title: 'Build component library',
      description:
        'Extract reusable Button, Card, and Input components with consistent styling tokens.',
      priority: 'medium',
      status: 'completed',
      dueDate: daysFromNow(-3),
      assignee: 'Maya Chen',
      projectId: web.id,
    }),
    createTask({
      title: 'Set up CI/CD pipeline',
      description:
        'Configure automated build, test, and preview-deploy on every pull request.',
      priority: 'high',
      status: 'completed',
      dueDate: daysFromNow(-5),
      assignee: 'Sam Rivera',
      projectId: mobile.id,
    }),
    createTask({
      title: 'Implement onboarding flow',
      description:
        'Three-screen welcome flow with progress indicator and skip option.',
      priority: 'high',
      status: 'in_progress',
      dueDate: daysFromNow(4),
      assignee: 'Dev Patel',
      projectId: mobile.id,
    }),
    createTask({
      title: 'Fix push notification crash',
      description:
        'App crashes on Android 12 when a notification is tapped from background.',
      priority: 'urgent',
      status: 'todo',
      dueDate: daysFromNow(0),
      assignee: 'Sam Rivera',
      projectId: mobile.id,
    }),
    createTask({
      title: 'App store screenshots',
      description: 'Prepare 6.7" and 6.5" screenshots for App Store listing.',
      priority: 'low',
      status: 'todo',
      dueDate: daysFromNow(7),
      assignee: 'Riley Brooks',
      projectId: mobile.id,
    }),
    createTask({
      title: 'Define campaign target segments',
      description:
        'Identify three audience segments with messaging angles for each.',
      priority: 'medium',
      status: 'in_review',
      dueDate: daysFromNow(3),
      assignee: 'Maya Chen',
      projectId: marketing.id,
    }),
    createTask({
      title: 'Brief the creative agency',
      description:
        'Send creative brief with brand guidelines, timeline, and deliverables.',
      priority: 'high',
      status: 'completed',
      dueDate: daysFromNow(-2),
      assignee: 'Dev Patel',
      projectId: marketing.id,
    }),
    createTask({
      title: 'Schedule social media posts',
      description: 'Schedule 2 weeks of posts across Instagram and LinkedIn.',
      priority: 'low',
      status: 'todo',
      dueDate: daysFromNow(5),
      assignee: 'Riley Brooks',
      projectId: marketing.id,
    }),
  ];

  return { tasks, projects, activity: [] };
}
