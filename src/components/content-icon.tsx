import type { ReactNode } from "react";
import type { FileIconKind } from "@/lib/content-kind";

// La clasificación vive en @/lib/content-kind para compartirla con la búsqueda.
// Se reexporta aquí porque varios componentes ya la importaban desde este módulo.
export { iconKindForContentType, type FileIconKind } from "@/lib/content-kind";

const FILE_ICON_PATHS: Record<FileIconKind, ReactNode> = {
  pdf: <><path d="M6 3h8l4 4v14H6V3Z" /><path d="M14 3v5h5M8.5 13v4M8.5 13h1.25a1.25 1.25 0 1 1 0 2.5H8.5M12.5 13v4M12.5 15h1M15.5 13v4M15.5 13h1.25" /></>,
  doc: <><path d="M6 3h8l4 4v14H6V3Z" /><path d="M14 3v5h5M8.5 12.5 9.75 17l1.25-3 1.25 3 1.25-4.5M15 12.5v4.5" /></>,
  ppt: <><path d="M6 3h8l4 4v14H6V3Z" /><path d="M14 3v5h5M9 17V12.5h1.6a1.65 1.65 0 0 1 0 3.3H9" /></>,
  image: <><path d="M6 3h8l4 4v14H6V3Z" /><path d="M14 3v5h5" /><circle cx="10" cy="13.5" r="1" /><path d="M8 17.5l2.2-2.6 1.6 1.7 1.3-1.6L16 17.5" /></>,
  audio: <><path d="M6 3h8l4 4v14H6V3Z" /><path d="M14 3v5h5" /><circle cx="10" cy="16" r="1.5" /><path d="M11.5 16V10.5L15 10v5.5" /></>,
  video: <><path d="M6 3h8l4 4v14H6V3Z" /><path d="M14 3v5h5" /><path d="M9.5 12.5l4 2.25-4 2.25v-4.5Z" /></>,
  archive: <><path d="M6 3h8l4 4v14H6V3Z" /><path d="M14 3v5h5M10.5 12h2M10.5 14h2M10.5 16h2" /></>,
  html: <><path d="M6 3h8l4 4v14H6V3Z" /><path d="M14 3v5h5M9 12.5 7.5 15l1.5 2.5M15 12.5l1.5 2.5-1.5 2.5M12.2 12l-1 5.5" /></>,
  other: <><path d="M6 3h8l4 4v14H6V3Z" /><path d="M14 3v5h5M9 13h6M9 17h6" /></>,
};

export function ContentIcon({ kind, fileType = "other" }: { kind: "course" | "folder" | "file"; fileType?: FileIconKind }) {
  const icon = kind === "course"
    ? <><path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v16H6.5A2.5 2.5 0 0 0 4 21.5v-16Z" /><path d="M4 5.5v16" /></>
    : kind === "folder"
      ? <path d="M3 6.5h6l2 2H21v10.75A1.75 1.75 0 0 1 19.25 21h-14A1.75 1.75 0 0 1 3.5 19.25V6.5Z" />
      : FILE_ICON_PATHS[fileType];

  return <svg className="content-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{icon}</svg>;
}
