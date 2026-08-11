import assert from "node:assert/strict";
import test from "node:test";
import { FOLDER_MARKER, materialKey, validateUpload } from "./admin-materials.ts";

test("construye clave Blob acotada a materiales", () => {
  assert.equal(materialKey("finanzas", "caja", "clase.pdf"), "materiales/finanzas/caja/clase.pdf");
  assert.throws(() => materialKey("finanzas", "../privado", "x.pdf"));
});

test("normaliza nombres académicos antes de cargar", () => {
  const path = materialKey("finanzas", "Administración de Caja", "Prueba Final.PDF");
  assert.equal(path, "materiales/finanzas/administracion-de-caja/prueba-final.pdf");
  assert.deepEqual(validateUpload(path, "application/pdf"), ["application/pdf", "application/octet-stream"]);
});

test("el marcador de carpeta nunca está vacío", () => {
  assert.ok(FOLDER_MARKER.length > 0);
});
