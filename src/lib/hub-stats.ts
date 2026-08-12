import type { CourseModule } from "./course-modules.ts";

export type CourseModulesEntry = { course: string; modules: CourseModule[] };

export type HubStats = {
  courseCount: number;
  moduleCount: number;
  fileCount: number;
  latestLabel: string;
};

/** Formatea una fecha corta en español, p.ej. "11 AGO". */
export function formatShortDateEs(date: Date): string {
  const formatted = new Intl.DateTimeFormat("es-CL", { day: "2-digit", month: "short" }).format(date);
  return formatted.replace(/\./g, "").toUpperCase();
}

/**
 * Calcula las cifras del hub a partir de módulos ya cargados (por curso) y las fechas de
 * subida de cada archivo (path -> ISO string). Solo cuenta módulos publicados: es la única
 * unidad de "publicado" disponible en el modelo (los archivos sin módulo no se muestran).
 */
export function computeHubStats(courseModules: readonly CourseModulesEntry[], uploadedAtByPath: ReadonlyMap<string, string>): HubStats {
  let moduleCount = 0;
  let fileCount = 0;
  let courseCount = 0;
  let latestTime = -Infinity;

  for (const { modules } of courseModules) {
    const publishedModules = modules.filter((module) => module.published);
    if (publishedModules.some((module) => module.items.length > 0)) courseCount += 1;
    moduleCount += publishedModules.length;

    for (const module of publishedModules) {
      fileCount += module.items.length;
      for (const item of module.items) {
        const uploadedAt = uploadedAtByPath.get(item.path);
        if (!uploadedAt) continue;
        const time = new Date(uploadedAt).getTime();
        if (!Number.isNaN(time) && time > latestTime) latestTime = time;
      }
    }
  }

  const latestLabel = Number.isFinite(latestTime) ? formatShortDateEs(new Date(latestTime)) : "—";

  return { courseCount, moduleCount, fileCount, latestLabel };
}
