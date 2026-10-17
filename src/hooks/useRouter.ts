import { useEffect, useState } from 'react';

export type Route =
  | { name: 'dashboard' }
  | { name: 'board' }
  | { name: 'my-tasks' }
  | { name: 'projects' }
  | { name: 'settings' };

function parseHash(): Route {
  const h = window.location.hash.replace('#/', '').replace('#', '');
  switch (h) {
    case 'board':
      return { name: 'board' };
    case 'my-tasks':
      return { name: 'my-tasks' };
    case 'projects':
      return { name: 'projects' };
    case 'settings':
      return { name: 'settings' };
    default:
      return { name: 'dashboard' };
  }
}

export function navigate(name: Route['name']): void {
  window.location.hash = `/${name}`;
}

export function useRouter(): Route {
  const [route, setRoute] = useState<Route>(parseHash);
  useEffect(() => {
    const onHash = () => setRoute(parseHash());
    window.addEventListener('hashchange', onHash);
    if (!window.location.hash) window.location.hash = '/dashboard';
    return () => window.removeEventListener('hashchange', onHash);
  }, []);
  return route;
}
