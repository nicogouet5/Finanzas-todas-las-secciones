import type { CourseModule } from "./course-modules.ts";
import type { CourseSlug } from "./material-paths.ts";
import { CERTAMEN_1_PRESENTATION_PATH, CERTAMEN_1_PRESENTATION_TITLE, type MaterialItem } from "./materials.ts";

export function addBuiltInCourseModules(course: CourseSlug, remoteModules: CourseModule[], materials: MaterialItem[]): CourseModule[] {
  if (course !== "finanzas-corporativas") return remoteModules;
  if (!materials.some((material) => material.path === CERTAMEN_1_PRESENTATION_PATH)) return remoteModules;
  if (remoteModules.some((module) => module.items.some((item) => item.path === CERTAMEN_1_PRESENTATION_PATH))) return remoteModules;
  return [{
    id: "built-in-certamen-1",
    title: "Certamen 1",
    order: -1,
    published: true,
    items: [{ path: CERTAMEN_1_PRESENTATION_PATH, title: CERTAMEN_1_PRESENTATION_TITLE, order: 0 }],
  }, ...remoteModules];
}
