import { BlobPreconditionFailedError, copy, del, list, put } from "@vercel/blob";
import { isAdmin } from "@/lib/admin-session";
import { isCourse, validateMaterialPath } from "@/lib/admin-materials";
import { normalizeMaterialPath } from "@/lib/material-paths";

const json = (error: string, status: number) => Response.json({ error }, { status });
async function body(request: Request): Promise<Record<string, unknown>> { const value: unknown = await request.json(); if (!value || typeof value !== "object") throw new Error("Solicitud inválida"); return value as Record<string, unknown>; }
async function blobs(path: string, kind: "file" | "folder") { const target = validateMaterialPath(path); const prefix = kind === "file" ? target : `${target.replace(/\/$/, "")}/`; const found = []; let cursor: string | undefined; do { const page = await list({ prefix, cursor }); found.push(...page.blobs.filter((blob) => kind === "folder" || blob.pathname === target)); cursor = page.cursor; if (!page.hasMore) break; } while (cursor); return found; }

export async function POST(request: Request) {
  if (!await isAdmin()) return json("No autorizado", 401);
  let pathname: string;
  try { const data = await body(request); if (typeof data.course !== "string" || typeof data.folder !== "string" || !isCourse(data.course)) return json("Solicitud inválida", 400); pathname = `materiales/${data.course}/${normalizeMaterialPath(data.folder)}/.folder`; } catch { return json("Solicitud inválida", 400); }
  try { await put(pathname, "", { access: "public", addRandomSuffix: false, allowOverwrite: false }); return Response.json({ ok: true }); }
  catch (error) { return error instanceof BlobPreconditionFailedError ? json("Ya existe", 409) : json("Servicio de archivos no disponible", 503); }
}

export async function DELETE(request: Request) {
  if (!await isAdmin()) return json("No autorizado", 401);
  try { const data = await body(request); if (typeof data.path !== "string" || (data.kind !== "file" && data.kind !== "folder")) return json("Solicitud inválida", 400); const found = await blobs(data.path, data.kind); if (!found.length) return json("No encontrado", 404); await del(found.map((blob) => blob.url)); return Response.json({ ok: true }); }
  catch { return json("No fue posible eliminar el material", 502); }
}

export async function PATCH(request: Request) {
  if (!await isAdmin()) return json("No autorizado", 401);
  try {
    const data = await body(request);
    if (typeof data.source !== "string" || typeof data.destination !== "string" || (data.kind !== "file" && data.kind !== "folder")) return json("Solicitud inválida", 400);
    const source = validateMaterialPath(data.source); const destination = validateMaterialPath(data.destination); const found = await blobs(source, data.kind);
    if (!found.length) return json("No encontrado", 404);
    const destinations = found.map((blob) => data.kind === "file" ? destination : `${destination}/${blob.pathname.slice(`${source.replace(/\/$/, "")}/`.length)}`);
    for (const item of destinations) if ((await blobs(item, "file")).length) return json("El destino ya existe", 409);
    const created: string[] = [];
    try { for (let index = 0; index < found.length; index++) { const result = await copy(found[index].url, destinations[index], { access: "public", addRandomSuffix: false, allowOverwrite: false, ifMatch: found[index].etag }); created.push(result.url); } }
    catch { if (created.length) await del(created); return json("No fue posible mover el material", 502); }
    await del(found.map((blob) => blob.url)); return Response.json({ ok: true });
  } catch { return json("Solicitud inválida o servicio no disponible", 400); }
}
