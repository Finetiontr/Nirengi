// The static (GitHub Pages) build cannot know ids created at runtime, so its 404
// page sends /pilotlar/<id> to /pilotlar/_?id=<id>. Detail pages resolve it here.

export const routeId = (id: string) =>
  id === '_' && typeof location !== 'undefined' ? (new URLSearchParams(location.search).get('id') ?? '') : id;
