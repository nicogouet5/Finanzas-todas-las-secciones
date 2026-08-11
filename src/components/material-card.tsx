import Link from "next/link";
import { ContentIcon } from "@/components/content-icon";
import type { MaterialItem } from "@/lib/materials";

const formatSize = (size: number) => size < 1024 ? `${size} B` : `${(size / 1024).toFixed(1)} KB`;

export function MaterialCard({ item }: { item: MaterialItem }) {
  return <article className="material-card">
    <h3 className="course-card__title"><ContentIcon kind="file" />{item.name}</h3>
    <p>{item.contentType} · {formatSize(item.size)}</p>
    <div className="actions"><Link href={`/material/${item.path}`}>Abrir</Link><a href={item.downloadUrl} download>Descargar</a></div>
  </article>;
}
