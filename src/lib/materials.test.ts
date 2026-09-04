import assert from "node:assert/strict";
import test from "node:test";
import { buildMaterialFolders, buildMaterialTree, listMaterials, mergeMaterials } from "./materials.ts";

const item = (path: string, source: "local" | "blob" = "blob", overrides: Partial<Awaited<ReturnType<typeof listMaterials>>[number]> = {}) => ({
  path,
  name: path.split("/").at(-1) ?? path,
  url: `/materiales/${path}`,
  downloadUrl: `/materiales/${path}`,
  size: 1,
  contentType: "text/html",
  uploadedAt: null,
  source,
  ...overrides,
});

test("separa ramos, carpetas y archivos", () => {
  const tree = buildMaterialTree([
    {
      path: "finanzas/caja/clase.html",
      name: "clase.html",
      url: "/clase.html",
      downloadUrl: "/clase.html",
      size: 1,
      contentType: "text/html",
      uploadedAt: null,
      source: "local",
    },
  ]);
  assert.equal(tree.folders[0].folders[0].files[0].name, "clase.html");
});

test("incluye carpetas con archivos y marcadores vacíos", () => {
  const items = [{ path: "finanzas/caja/clase.html", name: "clase.html", url: "/clase.html", downloadUrl: "/clase.html", size: 1, contentType: "text/html", uploadedAt: null, source: "local" as const }];
  assert.deepEqual(buildMaterialFolders(items, ["finanzas/vacia"]), ["finanzas/caja", "finanzas/vacia"]);
});

test("mergeMaterials prioriza materiales locales y ordena por ruta", () => {
  const merged = mergeMaterials(
    [
      item("finanzas-corporativas/certamen-1/presentacion-certamen-1-finanzas-corporativas.html", "blob", { name: "Duplicado remoto", source: "blob" }),
      item("finanzas/apuntes/guia.pdf", "blob", { contentType: "application/pdf" }),
    ],
    [
      item("finanzas-corporativas/certamen-1/presentacion-certamen-1-finanzas-corporativas.html", "local", { name: "Repaso Certamen 1: riesgo, dos períodos y portafolios" }),
    ],
  );

  assert.deepEqual(merged.map((entry) => entry.path), [
    "finanzas-corporativas/certamen-1/presentacion-certamen-1-finanzas-corporativas.html",
    "finanzas/apuntes/guia.pdf",
  ]);
  const certamen = merged.find((entry) => entry.path === "finanzas-corporativas/certamen-1/presentacion-certamen-1-finanzas-corporativas.html");
  assert.equal(certamen?.source, "local");
  assert.equal(certamen?.name, "Repaso Certamen 1: riesgo, dos períodos y portafolios");
});

test("listMaterials devuelve materiales locales cuando Blob no está configurado", async () => {
  const materials = await listMaterials(async () => [item("finanzas/blob/solo-remoto.pdf", "blob")], false);
  assert.ok(materials.some((entry) => entry.path === "finanzas-corporativas/certamen-1/presentacion-certamen-1-finanzas-corporativas.html"));
  assert.ok(materials.every((entry) => entry.source === "local"));
});

test("listMaterials mezcla Blob y locales cuando Blob está configurado", async () => {
  const materials = await listMaterials(async () => [
    item("finanzas/blob/solo-remoto.pdf", "blob", { contentType: "application/pdf" }),
    item("finanzas-corporativas/certamen-1/presentacion-certamen-1-finanzas-corporativas.html", "blob", { name: "Duplicado remoto" }),
  ], true);

  assert.deepEqual(materials.map((entry) => entry.path), [
    "finanzas-corporativas/certamen-1/presentacion-certamen-1-finanzas-corporativas.html",
    "finanzas/administracion-de-caja/index.html",
    "finanzas/administracion-de-caja/presentacion_administracion_caja.html",
    "finanzas/blob/solo-remoto.pdf",
    "finanzas/certamen-2/presentacion_certamen_2_finanzas.html",
  ]);
  assert.equal(materials[0]?.source, "local");
});
