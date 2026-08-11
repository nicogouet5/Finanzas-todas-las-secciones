import Link from "next/link";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { ContentIcon } from "@/components/content-icon";
import { MaterialCard } from "@/components/material-card";
import { courseLabel, type CourseSlug } from "@/lib/material-paths";
import { buildMaterialTree, listMaterials, type FolderNode } from "@/lib/materials";
import { notFound } from "next/navigation";

const isCourse = (value: string): value is CourseSlug => value === "finanzas" || value === "finanzas-corporativas";

function findFolder(node: FolderNode, parts: string[]): FolderNode | null {
  let current = node;
  for (const part of parts) {
    const next = current.folders.find((folder) => folder.name === part);
    if (!next) return null;
    current = next;
  }
  return current;
}

export default async function CoursePage({ params }: { params: Promise<{ course: string; folder?: string[] }> }) {
  const { course, folder = [] } = await params;
  if (!isCourse(course)) notFound();
  const tree = buildMaterialTree(await listMaterials());
  const courseNode = tree.folders.find((item) => item.name === course) ?? { name: course, path: course, folders: [], files: [] };
  const current = findFolder(courseNode, folder);
  if (!current) notFound();
  const crumbs = [{ href: "/", label: "Inicio" }, { href: `/ramos/${course}`, label: courseLabel(course) }, ...folder.map((part, index) => ({ href: index === folder.length - 1 ? undefined : `/ramos/${course}/${folder.slice(0, index + 1).join("/")}`, label: part.replaceAll("-", " ") }))];

  return <main id="main" className="page"><Breadcrumbs items={crumbs} /><h1>{folder.at(-1)?.replaceAll("-", " ") ?? courseLabel(course)}</h1>{!current.folders.length && !current.files.length ? <p className="empty-state">Aún no hay materiales en este ramo.</p> : <><section className="folder-grid" aria-label="Carpetas">{current.folders.map((item) => <Link className="folder-card" key={item.path} href={`/ramos/${course}/${item.path.split("/").slice(1).join("/")}`}><span>Carpeta</span><h2 className="course-card__title"><ContentIcon kind="folder" />{item.name.replaceAll("-", " ")}</h2></Link>)}</section><section className="material-grid" aria-label="Materiales">{current.files.map((item) => <MaterialCard item={item} key={item.path} />)}</section></>}</main>;
}
