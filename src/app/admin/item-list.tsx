"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { CourseModule } from "@/lib/course-modules";
import type { CourseSlug } from "@/lib/material-paths";
import type { MaterialItem } from "@/lib/materials";
import { callApi } from "./admin-api";
import { ItemRow } from "./item-row";

export type ItemWithTitle = { item: MaterialItem; title?: string };

export function ItemList({ course, moduleId, items, modules }: { course: CourseSlug; moduleId: string | null; items: ItemWithTitle[]; modules: CourseModule[] }) {
  const router = useRouter();
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const paths = items.map((entry) => entry.item.path);

  async function reorder(from: number, to: number) {
    if (from === to) return;
    const next = [...paths];
    const [moved] = next.splice(from, 1);
    next.splice(to, 0, moved);
    await callApi("/api/materials/modules/items", "PUT", { course, moduleId, orderedPaths: next });
    router.refresh();
  }

  if (!items.length) return <p className="empty-state">Sin archivos.</p>;

  return <ul className="item-list">
    {items.map((entry, index) => <ItemRow
      key={entry.item.path}
      course={course}
      item={entry.item}
      title={entry.title}
      moduleId={moduleId}
      modules={modules}
      siblingPaths={paths}
      index={index}
      draggable={!!moduleId}
      onDragStart={() => setDraggedIndex(index)}
      onDrop={() => { if (draggedIndex !== null) void reorder(draggedIndex, index); setDraggedIndex(null); }}
    />)}
  </ul>;
}
