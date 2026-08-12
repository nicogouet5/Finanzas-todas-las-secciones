"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { CourseModule } from "@/lib/course-modules";
import type { CourseSlug } from "@/lib/material-paths";
import type { MaterialItem } from "@/lib/materials";
import { callApi } from "./admin-api";
import { ModuleCard } from "./module-card";

export function ModuleList({ course, modules, allItems }: { course: CourseSlug; modules: CourseModule[]; allItems: MaterialItem[] }) {
  const router = useRouter();
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const byPath = new Map(allItems.map((item) => [item.path, item]));
  const ids = modules.map((module) => module.id);

  async function persistOrder(orderedModuleIds: string[]) {
    await callApi("/api/materials/modules", "PUT", { course, orderedModuleIds });
    router.refresh();
  }

  async function move(from: number, to: number) {
    if (from === to || to < 0 || to >= ids.length) return;
    const next = [...ids];
    const [moved] = next.splice(from, 1);
    next.splice(to, 0, moved);
    await persistOrder(next);
  }

  if (!modules.length) return <p className="empty-state">Aún no hay módulos en este ramo. Crea uno para empezar a organizar los materiales.</p>;

  return <div className="module-list">
    {modules.map((module, index) => <ModuleCard
      key={module.id}
      course={course}
      module={module}
      modules={modules}
      items={module.items.flatMap((entry) => { const item = byPath.get(entry.path); return item ? [{ item, title: entry.title }] : []; })}
      index={index}
      total={modules.length}
      draggable
      onDragStart={() => setDraggedIndex(index)}
      onDragOver={() => {}}
      onDrop={() => { if (draggedIndex !== null) void move(draggedIndex, index); setDraggedIndex(null); }}
      onMove={(target) => void move(index, target)}
    />)}
  </div>;
}
