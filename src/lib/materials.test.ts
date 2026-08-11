import assert from "node:assert/strict";
import test from "node:test";
import { buildMaterialFolders, buildMaterialTree } from "./materials.ts";

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

test("incluye carpetas con archivos y marcadores vacíos", () => {
  const items = [{ path: "finanzas/caja/clase.html", name: "clase.html", url: "/clase.html", downloadUrl: "/clase.html", size: 1, contentType: "text/html", source: "local" as const }];
  assert.deepEqual(buildMaterialFolders(items, ["finanzas/vacia"]), ["finanzas/caja", "finanzas/vacia"]);
});
