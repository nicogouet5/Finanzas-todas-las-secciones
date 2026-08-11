import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { isAdmin } from "@/lib/admin-session";
import { validateUpload } from "@/lib/admin-materials";

export async function POST(request: Request) { if (!await isAdmin()) return Response.json({ error: "No autorizado" }, { status: 401 }); let body: HandleUploadBody; try { body = await request.json(); } catch { return Response.json({ error: "Solicitud inválida" }, { status: 400 }); } let invalid = false; try { const response = await handleUpload({ body, request, onBeforeGenerateToken: async (pathname) => { try { return { allowedContentTypes: validateUpload(pathname, "application/octet-stream"), addRandomSuffix: false, allowOverwrite: false }; } catch { invalid = true; throw new Error("invalid upload path"); } } }); return Response.json(response); } catch { return Response.json({ error: invalid ? "Archivo o ruta no permitidos" : "Servicio de carga no disponible" }, { status: invalid ? 400 : 503 }); } }
