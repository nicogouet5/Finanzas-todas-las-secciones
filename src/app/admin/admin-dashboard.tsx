"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { CourseModule } from "@/lib/course-modules";
import type { CourseSlug } from "@/lib/material-paths";
import type { MaterialItem } from "@/lib/materials";
import { CreateModuleForm } from "./create-module-form";
import { ModuleList } from "./module-list";
import { UnassignedPanel } from "./unassigned-panel";

export type CourseModulesData = { modules: CourseModule[]; unassigned: MaterialItem[]; allItems: MaterialItem[] };

const COURSES: { value: CourseSlug; label: string }[] = [
  { value: "finanzas", label: "Finanzas" },
  { value: "finanzas-corporativas", label: "Finanzas Corporativas" },
];

export function AdminDashboard({ coursesData, configured }: { coursesData: Record<CourseSlug, CourseModulesData>; configured: boolean }) {
  const router = useRouter();
  const [course, setCourse] = useState<CourseSlug>("finanzas");
  const [busy, setBusy] = useState(false);
  const current = coursesData[course];

  async function logout() { setBusy(true); await fetch("/api/session/logout", { method: "POST" }); setBusy(false); router.refresh(); }

  return <section className="admin-dashboard">
    <div className="admin-toolbar">
      <label>Ramo
        <select value={course} onChange={(event) => setCourse(event.target.value as CourseSlug)}>
          {COURSES.map((entry) => <option key={entry.value} value={entry.value}>{entry.label}</option>)}
        </select>
      </label>
      <button disabled={busy} onClick={() => void logout()}>Cerrar sesión</button>
    </div>
    {!configured ? <p className="empty-state">Configura BLOB_READ_WRITE_TOKEN en Vercel para habilitar cambios. El catálogo empaquetado sigue disponible.</p> : <>
      <CreateModuleForm course={course} />
      <ModuleList course={course} modules={current.modules} allItems={current.allItems} />
      <UnassignedPanel course={course} items={current.unassigned} modules={current.modules} />
    </>}
  </section>;
}
