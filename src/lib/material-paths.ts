export type CourseSlug = "finanzas" | "finanzas-corporativas";

const COURSE_LABELS: Record<CourseSlug, string> = {
  finanzas: "Finanzas",
  "finanzas-corporativas": "Finanzas Corporativas",
};

export function normalizeSegment(value: string): string {
  const segment = value
    .trim()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/\s+/g, "-");

  if (!segment || segment === "." || segment === ".." || /[\\/]/.test(segment)) {
    throw new Error("Nombre de carpeta o archivo inválido");
  }

  return segment;
}

export function normalizeMaterialPath(value: string): string {
  if (!value || value.startsWith("/") || value.startsWith("\\")) {
    throw new Error("Ruta inválida");
  }

  const segments = value.split("/");
  if (!segments.length || segments.some((segment) => !segment)) {
    throw new Error("Ruta inválida");
  }

  return segments.map(normalizeSegment).join("/");
}

export function courseLabel(slug: CourseSlug): string {
  return COURSE_LABELS[slug];
}
