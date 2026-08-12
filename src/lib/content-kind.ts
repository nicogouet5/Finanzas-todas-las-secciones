/**
 * Única fuente de verdad para clasificar un `contentType` en un tipo de archivo.
 *
 * Vive en `lib/` y no en el componente del icono porque lo consumen tanto la UI
 * (src/components/content-icon.tsx) como la búsqueda y los filtros
 * (src/lib/search.ts), y así queda libre de JSX y se puede testear con
 * `node --experimental-strip-types --test`.
 */

/** Clasificación fina: la usa el set de iconos SVG. */
export type FileIconKind = "pdf" | "doc" | "ppt" | "image" | "audio" | "video" | "archive" | "html" | "other";

export function iconKindForContentType(contentType: string): FileIconKind {
  if (contentType === "application/pdf") return "pdf";
  if (contentType === "text/html") return "html";
  if (contentType.startsWith("image/")) return "image";
  if (contentType.startsWith("audio/")) return "audio";
  if (contentType.startsWith("video/")) return "video";
  if (contentType.includes("zip")) return "archive";
  if (contentType.includes("word") || contentType.includes("opendocument.text")) return "doc";
  if (contentType.includes("powerpoint") || contentType.includes("presentation")) return "ppt";
  return "other";
}

/** Clasificación gruesa: la usan los chips de filtro, que agrupan para el alumno. */
export type MaterialKind = "pdf" | "slides" | "doc" | "video" | "other";

const MATERIAL_KIND_BY_ICON_KIND: Record<FileIconKind, MaterialKind> = {
  pdf: "pdf",
  ppt: "slides",
  doc: "doc",
  video: "video",
  html: "other",
  image: "other",
  audio: "other",
  archive: "other",
  other: "other",
};

export function kindForContentType(contentType: string): MaterialKind {
  return MATERIAL_KIND_BY_ICON_KIND[iconKindForContentType(contentType)];
}

export const MATERIAL_KIND_LABELS: Record<MaterialKind, string> = {
  pdf: "PDF",
  slides: "Slides",
  doc: "Doc",
  video: "Video",
  other: "Otro",
};
