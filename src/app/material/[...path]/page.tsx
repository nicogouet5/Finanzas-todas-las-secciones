import { Breadcrumbs } from "@/components/breadcrumbs";
import { findMaterial } from "@/lib/materials";
import { notFound } from "next/navigation";

const OFFICE_CONTENT_TYPES = new Set(["application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document", "application/vnd.ms-powerpoint", "application/vnd.openxmlformats-officedocument.presentationml.presentation"]);

function Viewer({ contentType, name, url }: { contentType: string; name: string; url: string }) {
  if (contentType === "text/html") return <iframe title={name} sandbox="allow-scripts allow-forms allow-modals allow-downloads" src={url} />;
  if (contentType === "application/pdf") return <iframe title={name} src={url} />;
  if (contentType.startsWith("image/")) return <img src={url} alt={name} />;
  if (contentType.startsWith("video/")) return <video controls src={url} />;
  if (contentType.startsWith("audio/")) return <audio controls src={url} />;
  if (OFFICE_CONTENT_TYPES.has(contentType)) return <iframe title={name} src={`https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(url)}`} />;
  return <p>Este formato no tiene vista previa.</p>;
}

export default async function MaterialPage({ params }: { params: Promise<{ path: string[] }> }) {
  const { path } = await params;
  const material = await findMaterial(path.join("/"));
  if (!material) notFound();
  const course = material.path.split("/")[0];
  return <main id="main" className="page viewer-page"><Breadcrumbs items={[{ href: "/", label: "Inicio" }, { href: `/ramos/${course}`, label: course.replaceAll("-", " ") }, { label: material.name }]} /><h1>{material.name}</h1><div className="viewer"><Viewer contentType={material.contentType} name={material.name} url={material.url} /></div><a className="button" href={material.downloadUrl} download>Descargar material</a></main>;
}
