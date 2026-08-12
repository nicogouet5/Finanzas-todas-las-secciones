import Link from "next/link";
import { AsciiBackground } from "@/components/ascii-intro";
import { ContentIcon } from "@/components/content-icon";
import { RecentMaterials } from "@/components/recent-materials";
import { listCourseModules } from "@/lib/course-modules";
import { computeHubStats } from "@/lib/hub-stats";
import type { CourseSlug } from "@/lib/material-paths";
import { listMaterials, type MaterialItem } from "@/lib/materials";

const COURSES: CourseSlug[] = ["finanzas", "finanzas-corporativas"];

/** `listMaterials()` ya trae `uploadedAt` de cada blob: no hace falta un segundo listado. */
function uploadedAtIndex(materials: MaterialItem[]): Map<string, string> {
  const index = new Map<string, string>();
  for (const material of materials) if (material.uploadedAt) index.set(material.path, material.uploadedAt);
  return index;
}

export default async function Home() {
  const materials = await listMaterials();
  const courseModules = await Promise.all(
    COURSES.map(async (course) => ({ course, modules: (await listCourseModules(course, materials)).modules })),
  );
  const uploadedAtByPath = uploadedAtIndex(materials);
  const stats = computeHubStats(courseModules, uploadedAtByPath);

  return <><AsciiBackground /><main id="main" className="page home"><section className="home-hero" aria-labelledby="hub-title"><p className="eyebrow">// HUB_01 <span>Universidad del Desarrollo</span></p><h1 id="hub-title">Hub de Finanzas</h1><p className="lede">Materiales de estudio, visores y descargas para tus ramos.</p></section><dl className="hub-stats" aria-label="Estado del Hub"><div><dt>{stats.courseCount.toString().padStart(2, "0")}</dt><dd>ramos activos</dd></div><div><dt>{stats.moduleCount}</dt><dd>módulos</dd></div><div><dt>{stats.fileCount}</dt><dd>archivos</dd></div><div><dt>{stats.latestLabel}</dt><dd>última subida</dd></div></dl><RecentMaterials courseModules={courseModules} materials={materials} uploadedAtByPath={uploadedAtByPath} /><section className="course-directory" aria-labelledby="course-index-title"><header><p className="section-kicker">// DIRECTORY_01</p><h2 id="course-index-title">Elige tu ramo.</h2><p>Accede a las carpetas, guías y presentaciones disponibles.</p></header><div className="course-grid" aria-label="Ramos"><Link className="course-card course-card--directory" href="/ramos/finanzas"><span className="course-card__number">01</span><div><p className="course-card__label">Ramo activo</p><h3 className="course-card__title"><ContentIcon kind="course" />Finanzas</h3><p>Administración de caja y certámenes.</p></div><strong className="course-card__cta">Explorar <span aria-hidden="true">↗</span></strong></Link><Link className="course-card course-card--directory" href="/ramos/finanzas-corporativas"><span className="course-card__number">02</span><div><p className="course-card__label">Próximamente</p><h3 className="course-card__title"><ContentIcon kind="course" />Finanzas Corporativas</h3><p>Espacio listo para próximos materiales.</p></div><strong className="course-card__cta">Ver ramo <span aria-hidden="true">↗</span></strong></Link></div></section></main></>;
}
