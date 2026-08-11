"use client";

import { upload } from "@vercel/blob/client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { materialKey } from "@/lib/admin-materials";
import type { MaterialItem } from "@/lib/materials";

type Course = "finanzas" | "finanzas-corporativas";
type UploadState = { id: string; name: string; progress: number; result: string };

export function AdminDashboard({ items, folders, configured }: { items: MaterialItem[]; folders: string[]; configured: boolean }) {
  const router = useRouter();
  const [course, setCourse] = useState<Course>("finanzas");
  const [folder, setFolder] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const [uploads, setUploads] = useState<UploadState[]>([]);

  const updateUpload = (id: string, patch: Partial<UploadState>) => setUploads((current) => current.map((item) => item.id === id ? { ...item, ...patch } : item));

  async function call(method: "POST" | "DELETE" | "PATCH", data: object) {
    setBusy(true); setMessage("");
    const response = await fetch("/api/materials", { method, headers: { "content-type": "application/json" }, body: JSON.stringify(data) });
    const result = await response.json().catch(() => ({}));
    setBusy(false); setMessage(response.ok ? "Operación completada." : (typeof result.error === "string" ? result.error : "No fue posible completar la operación."));
    if (response.ok) router.refresh();
    return response.ok;
  }

  async function create(formData: FormData) { await call("POST", { course, folder: formData.get("folder") }); }

  async function send(files: FileList | null) {
    if (!files || !folder) return setMessage("Indica una carpeta destino.");
    setBusy(true);
    for (const [index, file] of Array.from(files).entries()) {
      const id = `${file.name}-${index}`;
      setUploads((current) => [...current, { id, name: file.name, progress: 0, result: "Cargando" }]);
      try {
        const pathname = materialKey(course, folder, file.name);
        await upload(pathname, file, { access: "public", handleUploadUrl: "/api/blob/upload", multipart: file.size > 100_000_000, onUploadProgress: ({ percentage }) => updateUpload(id, { progress: percentage }) });
        updateUpload(id, { progress: 100, result: "Cargado" });
      } catch { updateUpload(id, { result: "No fue posible cargar" }); }
    }
    setBusy(false); router.refresh();
  }

  async function move(path: string, kind: "file" | "folder") {
    const source = `materiales/${path}`;
    const destination = window.prompt("Nueva ruta dentro de materiales", source);
    if (destination && destination !== source) await call("PATCH", { source, destination, kind });
  }

  async function remove(path: string, kind: "file" | "folder") {
    if (window.confirm(`Eliminar ${path}?`)) await call("DELETE", { path: `materiales/${path}`, kind });
  }

  async function logout() { setBusy(true); await fetch("/api/session/logout", { method: "POST" }); setBusy(false); router.refresh(); }

  return <section className="admin-dashboard">
    <div className="admin-toolbar"><p>Administra materiales Blob públicos.</p><button disabled={busy} onClick={() => void logout()}>Cerrar sesión</button></div>
    {!configured ? <p className="empty-state">Configura BLOB_READ_WRITE_TOKEN en Vercel para habilitar cambios. El catálogo empaquetado sigue disponible.</p> : <>
    <form className="admin-form" action={create}>
      <label>Ramo<select value={course} onChange={(event) => setCourse(event.target.value as Course)}><option value="finanzas">Finanzas</option><option value="finanzas-corporativas">Finanzas Corporativas</option></select></label>
      <label>Carpeta<input name="folder" value={folder} onChange={(event) => setFolder(event.target.value)} placeholder="administracion-de-caja" required /></label>
      <button className="button" disabled={busy}>Crear carpeta</button>
    </form>
    <label className="upload-input">Subir archivos<input type="file" multiple disabled={busy} onChange={(event) => void send(event.target.files)} /></label>
    {message && <p role="status">{message}</p>}
    {uploads.map((item) => <div className="upload-progress" key={item.id}><span>{item.name}: {item.result}</span><progress value={item.progress} max="100">{item.progress}%</progress></div>)}
    <h2>Carpetas</h2><div className="material-grid">{folders.map((path) => <article className="material-card" key={path}><h3>{path.split("/").at(-1)?.replaceAll("-", " ")}</h3><p>{path}</p><button disabled={busy} onClick={() => void move(path, "folder")}>Renombrar / mover</button><button disabled={busy} className="danger" onClick={() => void remove(path, "folder")}>Borrar</button></article>)}</div>
    <h2>Archivos</h2><div className="material-grid">{items.map((item) => <article className="material-card" key={item.path}><h3>{item.name}</h3><p>{item.path}</p><button disabled={busy} onClick={() => void move(item.path, "file")}>Renombrar / mover</button><button disabled={busy} className="danger" onClick={() => void remove(item.path, "file")}>Borrar</button></article>)}</div>
    </>}
  </section>;
}
