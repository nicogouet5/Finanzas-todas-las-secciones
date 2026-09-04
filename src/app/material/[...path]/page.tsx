import { Breadcrumbs } from "@/components/breadcrumbs";
import { EmptyState } from "@/components/empty-state";
import { addBuiltInCourseModules } from "@/lib/built-in-course-modules";
import { listCourseModules } from "@/lib/course-modules";
import { courseLabel, type CourseSlug } from "@/lib/material-paths";
import { previewUrl } from "@/lib/material-preview";
import { listMaterials, type MaterialItem } from "@/lib/materials";
import { notFound } from "next/navigation";

const COURSE_SLUGS = new Set<string>(["finanzas", "finanzas-corporativas"]);

const courseLabelFor = (course: string) =>
  COURSE_SLUGS.has(course) ? courseLabel(course as CourseSlug) : course.replaceAll("-", " ");

const OFFICE_CONTENT_TYPES = new Set(["application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document", "application/vnd.ms-powerpoint", "application/vnd.openxmlformats-officedocument.presentationml.presentation"]);

function contentTypeLabel(contentType: string) {
  if (contentType === "text/html") return "HTML";
  if (contentType === "application/pdf") return "PDF";
  if (contentType.startsWith("image/")) return contentType.replace("image/", "").toUpperCase();
  if (contentType.startsWith("video/")) return contentType.replace("video/", "").toUpperCase();
  if (contentType.startsWith("audio/")) return contentType.replace("audio/", "").toUpperCase();
  if (OFFICE_CONTENT_TYPES.has(contentType)) return "OFFICE";
  return contentType || "ARCHIVO";
}

function ViewerContent({ contentType, name, url }: { contentType: string; name: string; url: string }) {
  // El sandbox del iframe se mantiene además de la CSP del proxy: defensa en profundidad.
  if (contentType === "text/html") return <iframe title={name} sandbox="allow-scripts allow-forms allow-modals allow-downloads" src={url} />;
  if (contentType === "application/pdf") return <iframe title={name} src={url} />;
  if (contentType.startsWith("image/")) return <img src={url} alt={name} />;
  if (contentType.startsWith("video/")) return <video controls src={url} />;
  if (contentType.startsWith("audio/")) return <audio controls src={url} />;
  if (OFFICE_CONTENT_TYPES.has(contentType)) return <iframe title={name} src={`https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(url)}`} />;
  return null;
}

function viewerSurface(contentType: string) {
  if (contentType.startsWith("image/") || contentType.startsWith("video/")) return "viewer-surface--dark";
  if (contentType.startsWith("audio/")) return "viewer-surface--audio";
  return "viewer-surface--light";
}

function Viewer({ contentType, name, url, downloadUrl }: { contentType: string; name: string; url: string; downloadUrl: string }) {
  const hasPreview = contentType === "text/html" || contentType === "application/pdf" || contentType.startsWith("image/") || contentType.startsWith("video/") || contentType.startsWith("audio/") || OFFICE_CONTENT_TYPES.has(contentType);

  if (!hasPreview) {
    return <EmptyState downloadUrl={downloadUrl} />;
  }

  return (
    <div className="viewer">
      <div className="viewer-bar">
        <p className="viewer-bar__name" title={name}>{name}</p>
        <span className="viewer-bar__type">{contentTypeLabel(contentType)}</span>
        <div className="viewer-bar__actions">
          <a className="viewer-bar__action" href={url} target="_blank" rel="noreferrer noopener">Abrir en pestaña nueva</a>
          <a className="viewer-bar__action" href={downloadUrl} download>Descargar</a>
        </div>
      </div>
      <div className={`viewer-surface ${viewerSurface(contentType)}`}>
        <ViewerContent contentType={contentType} name={name} url={url} />
      </div>
    </div>
  );
}

/** Título que el admin le puso al material en su módulo; si no hay, el nombre del archivo. */
async function displayTitle(material: MaterialItem, materials: MaterialItem[], course: string): Promise<string> {
  if (!COURSE_SLUGS.has(course)) return material.name;
  const { modules } = await listCourseModules(course as CourseSlug, materials);
  const publicModules = addBuiltInCourseModules(course as CourseSlug, modules, materials);
  for (const module of publicModules) {
    for (const item of module.items) {
      if (item.path === material.path && item.title) return item.title;
    }
  }
  return material.name;
}

export default async function MaterialPage({ params }: { params: Promise<{ path: string[] }> }) {
  const { path } = await params;
  const materials = await listMaterials();
  const material = materials.find((item) => item.path === path.join("/"));
  if (!material) notFound();
  const course = material.path.split("/")[0];
  const title = await displayTitle(material, materials, course);
  return (
    <main id="main" className="page viewer-page">
      <Breadcrumbs items={[{ href: "/", label: "Inicio" }, { href: `/ramos/${course}`, label: courseLabelFor(course) }, { label: title }]} />
      <h1>{title}</h1>
      <Viewer contentType={material.contentType} name={material.name} url={previewUrl(material)} downloadUrl={material.downloadUrl} />
    </main>
  );
}
