// The static (GitHub Pages) build cannot know ids created at runtime, so its 404
// page sends /pilotlar/<id> to /pilotlar/_?id=<id>; the installed app's service worker
// serves the `_` page at /pilotlar/<id> itself. Detail pages resolve both here.

export const routeId = (id: string) => {
  if (id !== '_' || typeof location === 'undefined') return id;
  const q = new URLSearchParams(location.search).get('id');
  if (q) return q;
  const last = decodeURIComponent(location.pathname.replace(/\.html$/, '').split('/').filter(Boolean).pop() ?? '');
  return last === '_' ? '' : last;
};
