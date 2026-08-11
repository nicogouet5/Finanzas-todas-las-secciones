import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { isAdmin } from "@/lib/admin-session";
import { validateUpload } from "@/lib/admin-materials";

export async function POST(request: Request) { if (!await isAdmin()) return Response.json({ error: "No autorizado" }, { status: 401 }); let body: HandleUploadBody; try { body = await request.json(); } catch { return Response.json({ error: "Solicitud inválida" }, { status: 400 }); } try { const response = await handleUpload({ body, request, onBeforeGenerateToken: async (pathname) => ({ allowedContentTypes: validateUpload(pathname, "application/octet-stream"), addRandomSuffix: false, allowOverwrite: false }) }); return Response.json(response); } catch (error) { return Response.json({ error: error instanceof Error ? error.message : "Carga no disponible" }, { status: 503 }); } }
