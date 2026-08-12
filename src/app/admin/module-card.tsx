"use client";

import { upload } from "@vercel/blob/client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ConfirmButton } from "@/components/confirm-button";
import { InlineEdit } from "@/components/inline-edit";
import { materialKey } from "@/lib/admin-materials";
import type { CourseModule } from "@/lib/course-modules";
import type { CourseSlug } from "@/lib/material-paths";
import { callApi } from "./admin-api";
import { DropZone } from "./drop-zone";
import { ItemList, type ItemWithTitle } from "./item-list";

type Props = {
  course: CourseSlug;
  module: CourseModule;
  modules: CourseModule[];
  items: ItemWithTitle[];
  index: number;
  total: number;
  draggable: boolean;
  onDragStart: () => void;
  onDragOver: () => void;
  onDrop: () => void;
  onMove: (index: number) => void;
};

export function ModuleCard({ course, module, modules, items, index, total, draggable, onDragStart, onDragOver, onDrop, onMove }: Props) {
  const router = useRouter();
  const [expanded, setExpanded] = useState(true);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");

  async function run(action: () => Promise<{ ok: boolean; error?: string }>) {
    setBusy(true); setMessage("");
    const result = await action();
    setBusy(false);
    if (!result.ok) setMessage(result.error ?? "No fue posible completar la operación.");
    else router.refresh();
  }

  async function uploadFiles(files: FileList) {
    setBusy(true); setMessage("");
    const folder = `${module.title}-${module.id.slice(0, 8)}`;
    for (const file of Array.from(files)) {
      try {
        const pathname = materialKey(course, folder, file.name);
        await upload(pathname, file, { access: "public", handleUploadUrl: "/api/blob/upload", multipart: file.size > 100_000_000 });
        await callApi("/api/materials/modules/items", "POST", { course, itemPath: pathname.slice("materiales/".length), moduleId: module.id });
      } catch { setMessage("No fue posible subir uno o más archivos."); }
    }
    setBusy(false);
    router.refresh();
  }

  return <article
    className="module-card"
    draggable={draggable}
    onDragStart={onDragStart}
    onDragOver={(event) => { event.preventDefault(); onDragOver(); }}
    onDrop={(event) => { event.preventDefault(); onDrop(); }}
  >
    <header className="module-card__header">
      {draggable && <span className="drag-handle" aria-hidden="true">⠿</span>}
      <button type="button" className="module-card__toggle-expand" aria-expanded={expanded} onClick={() => setExpanded((value) => !value)}>{expanded ? "▾" : "▸"}</button>
      <h3><InlineEdit label={`Título del módulo ${module.title}`} value={module.title} onSave={(next) => run(() => callApi("/api/materials/modules", "PATCH", { course, moduleId: module.id, title: next }))} /></h3>
      <span className="module-card__count">{module.items.length} archivo{module.items.length === 1 ? "" : "s"}</span>
      <label className="module-card__publish">
        <input type="checkbox" checked={module.published} disabled={busy} onChange={(event) => void run(() => callApi("/api/materials/modules", "PATCH", { course, moduleId: module.id, published: event.target.checked }))} />
        Publicado
      </label>
      <button type="button" disabled={busy || index === 0} onClick={() => onMove(index - 1)} aria-label="Subir módulo">↑</button>
      <button type="button" disabled={busy || index === total - 1} onClick={() => onMove(index + 1)} aria-label="Bajar módulo">↓</button>
      <ConfirmButton label="Borrar módulo" confirmLabel="¿Eliminar este módulo? Los archivos quedan sin módulo." disabled={busy} onConfirm={() => run(() => callApi("/api/materials/modules", "DELETE", { course, moduleId: module.id }))} />
    </header>
    {message && <p role="status">{message}</p>}
    {expanded && <div className="module-card__body">
      <ItemList course={course} moduleId={module.id} items={items} modules={modules} />
      <DropZone label="Arrastra archivos aquí o haz clic para subir a este módulo" disabled={busy} onFiles={(files) => void uploadFiles(files)} />
    </div>}
  </article>;
}
