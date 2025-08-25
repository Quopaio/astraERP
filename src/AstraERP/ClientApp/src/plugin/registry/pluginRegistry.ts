import type { FrontendPlugin } from '../types';

const plugins: FrontendPlugin[] = [];

export function registerPlugin(p: FrontendPlugin) {
  plugins.push(p);
}

export function getRegisteredPlugins() {
  return [...plugins];
}

export async function loadPluginsFromManifest(url = '/api/plugins/manifest') {
  const list: Array<{ id: string; name: string; version: string; feEntry?: string | null }> =
    await (await fetch(url, { credentials: 'include' })).json();

  // With no plugins, list === []; nothing to load, and that's fine.
  for (const item of list) {
    if (!item.feEntry) continue;             // backend will provide later
    const mod = await import(/* @vite-ignore */ item.feEntry);
    if (mod?.default) registerPlugin(mod.default as FrontendPlugin);
  }
}
