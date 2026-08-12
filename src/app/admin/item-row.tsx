"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { ConfirmButton } from "@/components/confirm-button";
import { ContentIcon, iconKindForContentType } from "@/components/content-icon";
import { InlineEdit } from "@/components/inline-edit";
import type { CourseModule } from "@/lib/course-modules";
import type { CourseSlug } from "@/lib/material-paths";
import type { MaterialItem } from "@/lib/materials";
import { callApi } from "./admin-api";

type Props = {
  course: CourseSlug;
  item: MaterialItem;
  title?: string;
  moduleId: string | null;
  modules: CourseModule[];
  siblingPaths: string[];
  index: number;
  draggable?: boolean;
  onDragStart?: () => void;
  onDragOver?: () => void;
  onDrop?: () => void;
};

export function ItemRow({ course, item, title, moduleId, modules, siblingPaths, index, draggable, onDragStart, onDragOver, onDrop }: Props) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");

  async function run(action: () => Promise<{ ok: boolean; error?: string }>) {
    setBusy(true); setMessage("");
    const result = await action();
    setBusy(false);
    if (!result.ok) setMessage(result.error ?? "No fue posible completar la operación.");
    else router.refresh();
  }

  async function move(newIndex: number) {
    const reordered = [...siblingPaths];
    const [moved] = reordered.splice(index, 1);
    reordered.splice(newIndex, 0, moved);
    await run(() => callApi("/api/materials/modules/items", "PUT", { course, moduleId, orderedPaths: reordered }));
  }

  return <li
    className="item-row"
    draggable={draggable}
    onDragStart={onDragStart}
    onDragOver={(event) => { event.preventDefault(); onDragOver?.(); }}
    onDrop={(event) => { event.preventDefault(); onDrop?.(); }}
  >
    {draggable && <span className="drag-handle" aria-hidden="true">⠿</span>}
    <ContentIcon kind="file" fileType={iconKindForContentType(item.contentType)} />
    <InlineEdit label={`Título de ${item.name}`} value={title ?? item.name} onSave={(next) => run(() => callApi("/api/materials/modules/items", "PATCH", { course, itemPath: item.path, title: next }))} />
    <div className="item-row__actions">
      {moduleId && (
        <>
          <button type="button" disabled={busy || index === 0} onClick={() => void move(index - 1)} aria-label="Subir">↑</button>
          <button type="button" disabled={busy || index === siblingPaths.length - 1} onClick={() => void move(index + 1)} aria-label="Bajar">↓</button>
        </>
      )}
      <select disabled={busy} value={moduleId ?? ""} aria-label="Mover a módulo" onChange={(event) => { const target = event.target.value; void run(() => target ? callApi("/api/materials/modules/items", "POST", { course, itemPath: item.path, moduleId: target, title }) : callApi("/api/materials/modules/items", "DELETE", { course, itemPath: item.path })); }}>
        <option value="">Sin módulo</option>
        {modules.map((entry) => <option key={entry.id} value={entry.id}>{entry.title}</option>)}
      </select>
      <a href={item.downloadUrl} download>Descargar</a>
      <ConfirmButton label="Borrar" confirmLabel={`¿Eliminar ${item.name}?`} disabled={busy} onConfirm={() => run(() => callApi("/api/materials", "DELETE", { path: `materiales/${item.path}`, kind: "file" }))} />
    </div>
    {message && <p role="status">{message}</p>}
  </li>;
}
