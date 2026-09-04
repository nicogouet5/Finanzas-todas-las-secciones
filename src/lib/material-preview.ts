import type { MaterialItem, MaterialSource } from "./materials.ts";

const PROXIED_CONTENT_TYPES = new Set(["text/html", "image/svg+xml"]);

export function previewUrl(material: Pick<MaterialItem, "path" | "url" | "contentType" | "source"> | { path: string; url: string; contentType: string; source: MaterialSource }): string {
  if (material.source !== "blob" || !PROXIED_CONTENT_TYPES.has(material.contentType)) return material.url;
  return `/api/material/view/${material.path.split("/").map(encodeURIComponent).join("/")}`;
}
