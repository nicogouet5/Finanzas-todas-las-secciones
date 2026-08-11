import { BlobPreconditionFailedError, put } from "@vercel/blob";
import { readFile } from "node:fs/promises";

const files = [
  ["public/materiales/finanzas/administracion-de-caja/index.html", "materiales/finanzas/administracion-de-caja/index.html"],
  ["public/materiales/finanzas/administracion-de-caja/presentacion_administracion_caja.html", "materiales/finanzas/administracion-de-caja/presentacion_administracion_caja.html"],
  ["public/materiales/finanzas/certamen-2/presentacion_certamen_2_finanzas.html", "materiales/finanzas/certamen-2/presentacion_certamen_2_finanzas.html"],
];

for (const [source, pathname] of files) {
  try { await put(pathname, await readFile(source), { access: "public", addRandomSuffix: false, allowOverwrite: false }); console.log(`uploaded ${pathname}`); }
  catch (error) { if (error instanceof BlobPreconditionFailedError) console.log(`skipped existing ${pathname}`); else throw error; }
}
