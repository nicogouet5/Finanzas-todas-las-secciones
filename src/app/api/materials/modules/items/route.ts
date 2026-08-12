import { isAdmin } from "@/lib/admin-session";
import { isCourse } from "@/lib/admin-materials";
import { assignItemToModule, renameModuleItem, reorderModuleItems, unassignItem } from "@/lib/course-modules";

const json = (error: string, status: number) => Response.json({ error }, { status });
async function body(request: Request): Promise<Record<string, unknown>> { const value: unknown = await request.json(); if (!value || typeof value !== "object") throw new Error("Solicitud inválida"); return value as Record<string, unknown>; }

export async function POST(request: Request) {
  if (!await isAdmin()) return json("No autorizado", 401);
  try {
    const data = await body(request);
    if (typeof data.course !== "string" || !isCourse(data.course) || typeof data.itemPath !== "string" || typeof data.moduleId !== "string") return json("Solicitud inválida", 400);
    await assignItemToModule(data.course, data.itemPath, data.moduleId, typeof data.title === "string" ? data.title : undefined);
    return Response.json({ ok: true });
  } catch { return json("No fue posible asignar el archivo", 502); }
}

export async function DELETE(request: Request) {
  if (!await isAdmin()) return json("No autorizado", 401);
  try {
    const data = await body(request);
    if (typeof data.course !== "string" || !isCourse(data.course) || typeof data.itemPath !== "string") return json("Solicitud inválida", 400);
    await unassignItem(data.course, data.itemPath);
    return Response.json({ ok: true });
  } catch { return json("No fue posible desasignar el archivo", 502); }
}

export async function PATCH(request: Request) {
  if (!await isAdmin()) return json("No autorizado", 401);
  try {
    const data = await body(request);
    if (typeof data.course !== "string" || !isCourse(data.course) || typeof data.itemPath !== "string") return json("Solicitud inválida", 400);
    await renameModuleItem(data.course, data.itemPath, typeof data.title === "string" && data.title.trim() ? data.title.trim() : undefined);
    return Response.json({ ok: true });
  } catch { return json("No fue posible renombrar el archivo", 502); }
}

export async function PUT(request: Request) {
  if (!await isAdmin()) return json("No autorizado", 401);
  try {
    const data = await body(request);
    if (typeof data.course !== "string" || !isCourse(data.course) || typeof data.moduleId !== "string" || !Array.isArray(data.orderedPaths) || !data.orderedPaths.every((path) => typeof path === "string")) return json("Solicitud inválida", 400);
    await reorderModuleItems(data.course, data.moduleId, data.orderedPaths);
    return Response.json({ ok: true });
  } catch { return json("No fue posible reordenar los archivos", 502); }
}
