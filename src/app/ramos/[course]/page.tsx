import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { MaterialSearch, type ExplorerModule, type SearchIndexItem } from "@/components/material-search";
import { addBuiltInCourseModules } from "@/lib/built-in-course-modules";
import { isCourse } from "@/lib/admin-materials";
import { listCourseModules } from "@/lib/course-modules";
import { courseLabel, type CourseSlug } from "@/lib/material-paths";
import { listMaterials } from "@/lib/materials";

export default async function CoursePage({ params }: { params: Promise<{ course: string }> }) {
  const { course } = await params;
  if (!isCourse(course)) notFound();
  const items = await listMaterials();
  const { modules } = await listCourseModules(course as CourseSlug, items);
  const published = addBuiltInCourseModules(course as CourseSlug, modules, items).filter((module) => module.published);
  const crumbs = [{ href: "/", label: "Inicio" }, { label: courseLabel(course as CourseSlug) }];
  const byPath = new Map(items.map((item) => [item.path, item]));

  const explorerModules: ExplorerModule[] = published.map((module) => ({
    id: module.id,
    title: module.title,
    items: module.items
      .map((entry) => ({ entry, item: byPath.get(entry.path) }))
      .filter((row): row is { entry: typeof module.items[number]; item: NonNullable<typeof row.item> } => !!row.item)
      .map(({ entry, item }) => ({ path: item.path, title: entry.title ?? item.name, item })),
  }));

  const searchIndex: SearchIndexItem[] = explorerModules.flatMap((module) => module.items.map((entry) => ({
    path: entry.path,
    title: entry.title,
    moduleTitle: module.title,
    contentType: entry.item.contentType,
    moduleId: module.id,
  })));

  return <main id="main" className="page">
    <Breadcrumbs items={crumbs} />
    <span className="eyebrow">// FINANZAS_01</span>
    <h1>{courseLabel(course as CourseSlug)}</h1>
    {!published.length
      ? <p className="empty-state">Aún no hay materiales publicados en este ramo.</p>
      : <MaterialSearch index={searchIndex} modules={explorerModules} />}
  </main>;
}
