import assert from "node:assert/strict";
import test from "node:test";
import { buildMaterialTree } from "./materials.ts";

test("separa ramos, carpetas y archivos", () => {
  const tree = buildMaterialTree([
    {
      path: "finanzas/caja/clase.html",
      name: "clase.html",
      url: "/clase.html",
      downloadUrl: "/clase.html",
      size: 1,
      contentType: "text/html",
      source: "local",
    },
  ]);
  assert.equal(tree.folders[0].folders[0].files[0].name, "clase.html");
});
