import { get, put } from "@vercel/blob";
import type { CourseSlug } from "./material-paths.ts";
import type { MaterialItem } from "./materials.ts";

export type CourseModuleItem = { path: string; title?: string; order: number };
export type CourseModule = { id: string; title: string; order: number; published: boolean; items: CourseModuleItem[] };
export type CourseMeta = { version: 1; updatedAt: string; modules: CourseModule[] };

const EMPTY_META: CourseMeta = { version: 1, updatedAt: new Date(0).toISOString(), modules: [] };

export function metaKey(course: CourseSlug): string { return `materiales/${course}/_meta.json`; }

function nextOrder(items: ReadonlyArray<{ order: number }>): number { return items.length ? Math.max(...items.map((item) => item.order)) + 1 : 0; }

export function sortByOrder<T extends { order: number }>(items: readonly T[]): T[] { return [...items].sort((a, b) => a.order - b.order); }

/** Filtra referencias a archivos que ya no existen en Blob y calcula los archivos sin módulo del curso. */
export function mergeUnassigned(meta: CourseMeta, allItems: MaterialItem[], course: CourseSlug): { modules: CourseModule[]; unassigned: MaterialItem[] } {
  const existing = new Set(allItems.map((item) => item.path));
  const referenced = new Set<string>();
  const modules = sortByOrder(meta.modules).map((module) => {
    const items = sortByOrder(module.items.filter((item) => existing.has(item.path)));
    for (const item of items) referenced.add(item.path);
    return { ...module, items };
  });
  const unassigned = allItems.filter((item) => item.path.startsWith(`${course}/`) && !referenced.has(item.path));
  return { modules, unassigned };
}

export function reorderBy<T extends { order: number }>(items: readonly T[], orderedKeys: readonly string[], keyOf: (item: T) => string): T[] {
  const byKey = new Map(items.map((item) => [keyOf(item), item]));
  const ordered = orderedKeys.map((key) => byKey.get(key)).filter((item): item is T => !!item);
  for (const item of items) if (!orderedKeys.includes(keyOf(item))) ordered.push(item);
  return ordered.map((item, index) => ({ ...item, order: index }));
}

export async function readCourseMeta(course: CourseSlug): Promise<CourseMeta> {
  // useCache:false evita el CDN público; también se escribe con cacheControlMaxAge:0 (ver abajo)
  // porque el default de put() es cachear 30 días, que useCache:false por sí solo no revierte.
  const result = await get(metaKey(course), { access: "public", useCache: false });
  if (!result || result.statusCode !== 200) return EMPTY_META;
  return JSON.parse(await new Response(result.stream).text()) as CourseMeta;
}

// Vercel Blob no ofrece transacciones; para un panel de un solo admin, sobrescribir
// directamente (último cambio gana) es el trade-off correcto frente a bloqueo optimista.
export async function updateCourseMeta(course: CourseSlug, mutate: (meta: CourseMeta) => CourseMeta): Promise<CourseMeta> {
  const next = mutate(await readCourseMeta(course));
  const body = JSON.stringify({ ...next, updatedAt: new Date().toISOString() });
  await put(metaKey(course), body, { access: "public", contentType: "application/json", addRandomSuffix: false, allowOverwrite: true, cacheControlMaxAge: 0 });
  return next;
}

export async function listCourseModules(course: CourseSlug, allItems: MaterialItem[]): Promise<{ modules: CourseModule[]; unassigned: MaterialItem[] }> {
  const meta = await readCourseMeta(course);
  return mergeUnassigned(meta, allItems, course);
}

export async function createModule(course: CourseSlug, title: string): Promise<CourseModule> {
  let created!: CourseModule;
  await updateCourseMeta(course, (meta) => {
    created = { id: crypto.randomUUID(), title, order: nextOrder(meta.modules), published: true, items: [] };
    return { ...meta, modules: [...meta.modules, created] };
  });
  return created;
}

export async function renameModule(course: CourseSlug, moduleId: string, title: string): Promise<void> {
  await updateCourseMeta(course, (meta) => ({ ...meta, modules: meta.modules.map((module) => module.id === moduleId ? { ...module, title } : module) }));
}

export async function setModulePublished(course: CourseSlug, moduleId: string, published: boolean): Promise<void> {
  await updateCourseMeta(course, (meta) => ({ ...meta, modules: meta.modules.map((module) => module.id === moduleId ? { ...module, published } : module) }));
}

export async function deleteModule(course: CourseSlug, moduleId: string): Promise<void> {
  await updateCourseMeta(course, (meta) => ({ ...meta, modules: meta.modules.filter((module) => module.id !== moduleId) }));
}

export async function reorderModules(course: CourseSlug, orderedModuleIds: string[]): Promise<void> {
  await updateCourseMeta(course, (meta) => ({ ...meta, modules: reorderBy(meta.modules, orderedModuleIds, (module) => module.id) }));
}

export async function assignItemToModule(course: CourseSlug, itemPath: string, moduleId: string, title?: string): Promise<void> {
  await updateCourseMeta(course, (meta) => {
    const withoutItem = meta.modules.map((module) => ({ ...module, items: module.items.filter((item) => item.path !== itemPath) }));
    return { ...meta, modules: withoutItem.map((module) => module.id === moduleId ? { ...module, items: [...module.items, { path: itemPath, title, order: nextOrder(module.items) }] } : module) };
  });
}

export async function unassignItem(course: CourseSlug, itemPath: string): Promise<void> {
  await updateCourseMeta(course, (meta) => ({ ...meta, modules: meta.modules.map((module) => ({ ...module, items: module.items.filter((item) => item.path !== itemPath) })) }));
}

export async function reorderModuleItems(course: CourseSlug, moduleId: string, orderedPaths: string[]): Promise<void> {
  await updateCourseMeta(course, (meta) => ({ ...meta, modules: meta.modules.map((module) => module.id === moduleId ? { ...module, items: reorderBy(module.items, orderedPaths, (item) => item.path) } : module) }));
}

export async function renameModuleItem(course: CourseSlug, itemPath: string, title: string | undefined): Promise<void> {
  await updateCourseMeta(course, (meta) => ({ ...meta, modules: meta.modules.map((module) => ({ ...module, items: module.items.map((item) => item.path === itemPath ? { ...item, title } : item) })) }));
}
