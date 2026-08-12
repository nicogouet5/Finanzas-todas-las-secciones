// La clasificación de tipo vive en @/lib/content-kind (fuente única, compartida
// con el set de iconos). Se reexporta para no romper los imports existentes.
export { kindForContentType, MATERIAL_KIND_LABELS, type MaterialKind } from "./content-kind.ts";

export type SearchableMaterial = {
  path: string;
  title: string;
  moduleTitle: string;
  contentType: string;
};

/** Minúsculas + elimina tildes/diacríticos vía normalización NFD (precedente: src/lib/material-paths.ts). */
export function normalizeQuery(value: string): string {
  return value
    .trim()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase();
}

function scoreField(normalizedField: string, normalizedQuery: string, weight: number): number {
  if (!normalizedField || !normalizedQuery) return 0;
  if (normalizedField === normalizedQuery) return weight * 3;
  if (normalizedField.startsWith(normalizedQuery)) return weight * 2;
  if (normalizedField.includes(normalizedQuery)) return weight;
  return 0;
}

export function matchMaterials<T extends SearchableMaterial>(items: readonly T[], query: string): T[] {
  const normalizedQuery = normalizeQuery(query);
  if (!normalizedQuery) return [...items];

  const scored = items
    .map((item) => {
      const titleScore = scoreField(normalizeQuery(item.title), normalizedQuery, 10);
      const moduleScore = scoreField(normalizeQuery(item.moduleTitle), normalizedQuery, 3);
      return { item, score: titleScore + moduleScore };
    })
    .filter((entry) => entry.score > 0);

  scored.sort((a, b) => b.score - a.score);
  return scored.map((entry) => entry.item);
}
