import { findMaterial } from "@/lib/materials";

/**
 * Sirve un material para *previsualizarlo* dentro del visor.
 *
 * Existe porque Vercel Blob responde los `.html` con
 * `content-disposition: attachment` (no permite alojar HTML navegable en su
 * dominio), así que un iframe apuntando al blob se queda en blanco y el
 * navegador intenta descargar el archivo. Este handler recupera el blob y lo
 * reemite como `inline` desde nuestro propio origen.
 *
 * Servir HTML subido por el admin desde nuestro origen sería un XSS contra el
 * panel si no se aísla: bastaría un `<script>` en una presentación para leer la
 * cookie de sesión. La defensa principal es la directiva CSP `sandbox` sin
 * `allow-same-origin`, que fuerza un origen opaco: el documento se ejecuta sin
 * acceso a cookies, localStorage ni al DOM de la página que lo enmarca.
 */

// Tipos que el navegador ejecuta o interpreta y que por tanto deben ir aislados.
const PREVIEWABLE = new Set(["text/html", "image/svg+xml"]);

const SANDBOX_CSP = [
  // Sin `allow-same-origin`: origen opaco, sin acceso a cookies ni a nuestro DOM.
  "sandbox allow-scripts allow-forms allow-modals allow-downloads allow-popups",
  // Solo nuestro propio visor puede enmarcarlo.
  "frame-ancestors 'self'",
].join("; ");

export async function GET(_request: Request, { params }: { params: Promise<{ path: string[] }> }) {
  const { path } = await params;
  // findMaterial resuelve contra la lista real de blobs: una ruta inventada o
  // con traversal simplemente no encuentra nada.
  const material = await findMaterial(path.join("/"));
  if (!material) return new Response("No encontrado", { status: 404 });

  if (!PREVIEWABLE.has(material.contentType)) {
    // El resto de formatos ya se sirven bien directo desde Blob; no los proxeamos.
    return Response.redirect(material.url, 307);
  }

  const upstream = await fetch(material.url);
  if (!upstream.ok || !upstream.body) {
    return new Response("No fue posible cargar el material", { status: 502 });
  }

  return new Response(upstream.body, {
    headers: {
      "content-type": `${material.contentType}; charset=utf-8`,
      "content-disposition": "inline",
      "content-security-policy": SANDBOX_CSP,
      "x-content-type-options": "nosniff",
      "referrer-policy": "no-referrer",
      "cache-control": "public, max-age=300",
    },
  });
}
