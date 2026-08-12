import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { MaterialCard } from "@/components/material-card";
import { isCourse } from "@/lib/admin-materials";
import { listCourseModules } from "@/lib/course-modules";
import { courseLabel, type CourseSlug } from "@/lib/material-paths";
import { listMaterials } from "@/lib/materials";

export default async function CoursePage({ params }: { params: Promise<{ course: string }> }) {
  const { course } = await params;
  if (!isCourse(course)) notFound();
  const items = await listMaterials();
  const { modules } = await listCourseModules(course as CourseSlug, items);
  const published = modules.filter((module) => module.published);
  const crumbs = [{ href: "/", label: "Inicio" }, { label: courseLabel(course as CourseSlug) }];
  const byPath = new Map(items.map((item) => [item.path, item]));

  return <main id="main" className="page">
    <Breadcrumbs items={crumbs} />
    <h1>{courseLabel(course as CourseSlug)}</h1>
    {!published.length ? <p className="empty-state">Aún no hay materiales publicados en este ramo.</p> : <div className="module-sections">
      {published.map((module) => {
        const files = module.items.map((entry) => ({ entry, item: byPath.get(entry.path) })).filter((row): row is { entry: typeof module.items[number]; item: NonNullable<typeof row.item> } => !!row.item);
        return <section className="module-section" key={module.id} aria-label={module.title}>
          <h2>{module.title}</h2>
          {!files.length ? <p className="empty-state">Aún no hay archivos en este módulo.</p> : <div className="material-grid">
            {files.map(({ entry, item }) => <MaterialCard item={item} title={entry.title} key={item.path} />)}
          </div>}
        </section>;
      })}
    </div>}
  </main>;
}
