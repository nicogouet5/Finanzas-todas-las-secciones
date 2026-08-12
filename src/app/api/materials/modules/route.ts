import { isAdmin } from "@/lib/admin-session";
import { isCourse } from "@/lib/admin-materials";
import { createModule, deleteModule, renameModule, reorderModules, setModulePublished } from "@/lib/course-modules";

const json = (error: string, status: number) => Response.json({ error }, { status });
async function body(request: Request): Promise<Record<string, unknown>> { const value: unknown = await request.json(); if (!value || typeof value !== "object") throw new Error("Solicitud inválida"); return value as Record<string, unknown>; }

export async function POST(request: Request) {
  if (!await isAdmin()) return json("No autorizado", 401);
  try {
    const data = await body(request);
    if (typeof data.course !== "string" || !isCourse(data.course) || typeof data.title !== "string" || !data.title.trim()) return json("Solicitud inválida", 400);
    const module = await createModule(data.course, data.title.trim());
    return Response.json({ ok: true, module });
  } catch { return json("No fue posible crear el módulo", 502); }
}

export async function PATCH(request: Request) {
  if (!await isAdmin()) return json("No autorizado", 401);
  try {
    const data = await body(request);
    if (typeof data.course !== "string" || !isCourse(data.course) || typeof data.moduleId !== "string") return json("Solicitud inválida", 400);
    if (typeof data.title === "string" && data.title.trim()) await renameModule(data.course, data.moduleId, data.title.trim());
    if (typeof data.published === "boolean") await setModulePublished(data.course, data.moduleId, data.published);
    return Response.json({ ok: true });
  } catch { return json("No fue posible actualizar el módulo", 502); }
}

export async function DELETE(request: Request) {
  if (!await isAdmin()) return json("No autorizado", 401);
  try {
    const data = await body(request);
    if (typeof data.course !== "string" || !isCourse(data.course) || typeof data.moduleId !== "string") return json("Solicitud inválida", 400);
    await deleteModule(data.course, data.moduleId);
    return Response.json({ ok: true });
  } catch { return json("No fue posible eliminar el módulo", 502); }
}

export async function PUT(request: Request) {
  if (!await isAdmin()) return json("No autorizado", 401);
  try {
    const data = await body(request);
    if (typeof data.course !== "string" || !isCourse(data.course) || !Array.isArray(data.orderedModuleIds) || !data.orderedModuleIds.every((id) => typeof id === "string")) return json("Solicitud inválida", 400);
    await reorderModules(data.course, data.orderedModuleIds);
    return Response.json({ ok: true });
  } catch { return json("No fue posible reordenar los módulos", 502); }
}
