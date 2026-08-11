import assert from "node:assert/strict";
import test from "node:test";
import { materialKey } from "./admin-materials.ts";

test("construye clave Blob acotada a materiales", () => {
  assert.equal(materialKey("finanzas", "caja", "clase.pdf"), "materiales/finanzas/caja/clase.pdf");
  assert.throws(() => materialKey("finanzas", "../privado", "x.pdf"));
});
