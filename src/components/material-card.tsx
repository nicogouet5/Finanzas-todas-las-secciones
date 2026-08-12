import Link from "next/link";
import { ContentIcon, iconKindForContentType } from "@/components/content-icon";
import type { MaterialItem } from "@/lib/materials";

const formatSize = (size: number) => size < 1024 ? `${size} B` : `${(size / 1024).toFixed(1)} KB`;

export function MaterialCard({ item, title }: { item: MaterialItem; title?: string }) {
  return <article className="material-card">
    <h3 className="course-card__title"><ContentIcon kind="file" fileType={iconKindForContentType(item.contentType)} />{title ?? item.name}</h3>
    <p>{item.contentType} · {formatSize(item.size)}</p>
    <div className="actions"><Link href={`/material/${item.path}`}>Abrir</Link><a href={item.downloadUrl} download>Descargar</a></div>
  </article>;
}
