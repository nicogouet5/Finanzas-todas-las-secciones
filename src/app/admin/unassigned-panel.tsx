"use client";

import { upload } from "@vercel/blob/client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { materialKey } from "@/lib/admin-materials";
import type { CourseModule } from "@/lib/course-modules";
import type { CourseSlug } from "@/lib/material-paths";
import type { MaterialItem } from "@/lib/materials";
import { DropZone } from "./drop-zone";
import { ItemList } from "./item-list";

export function UnassignedPanel({ course, items, modules }: { course: CourseSlug; items: MaterialItem[]; modules: CourseModule[] }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");

  async function uploadFiles(files: FileList) {
    setBusy(true); setMessage("");
    for (const file of Array.from(files)) {
      try {
        const pathname = materialKey(course, "sin-modulo", file.name);
        await upload(pathname, file, { access: "public", handleUploadUrl: "/api/blob/upload", multipart: file.size > 100_000_000 });
      } catch { setMessage("No fue posible subir uno o más archivos."); }
    }
    setBusy(false);
    router.refresh();
  }

  return <section className="unassigned-panel">
    <h2>Sin módulo</h2>
    <p className="empty-state">Archivos subidos que aún no pertenecen a ningún módulo. Los estudiantes no los ven hasta que los asignes.</p>
    {message && <p role="status">{message}</p>}
    <ItemList course={course} moduleId={null} items={items.map((item) => ({ item }))} modules={modules} />
    <DropZone label="Arrastra archivos aquí o haz clic para subir sin asignar" disabled={busy} onFiles={(files) => void uploadFiles(files)} />
  </section>;
}
