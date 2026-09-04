import assert from "node:assert/strict";
import test from "node:test";
import { mergeUnassigned, readCourseMeta, reorderBy } from "./course-modules.ts";
import type { MaterialItem } from "./materials.ts";

const item = (path: string): MaterialItem => ({ path, name: path.split("/").at(-1) ?? path, url: path, downloadUrl: path, size: 1, contentType: "text/html", uploadedAt: null, source: "local" });

test("calcula archivos sin módulo a partir de referencias existentes", () => {
  const items = [item("finanzas/caja/clase.html"), item("finanzas/caja/guia.pdf")];
  const meta = { version: 1 as const, updatedAt: "", modules: [{ id: "m1", title: "Unidad 1", order: 0, published: true, items: [{ path: "finanzas/caja/clase.html", order: 0 }] }] };
  const { unassigned } = mergeUnassigned(meta, items, "finanzas");
  assert.deepEqual(unassigned.map((entry) => entry.path), ["finanzas/caja/guia.pdf"]);
});

test("descarta referencias a archivos eliminados", () => {
  const items = [item("finanzas/caja/clase.html")];
  const meta = { version: 1 as const, updatedAt: "", modules: [{ id: "m1", title: "Unidad 1", order: 0, published: true, items: [{ path: "finanzas/caja/clase.html", order: 0 }, { path: "finanzas/caja/borrado.pdf", order: 1 }] }] };
  const { modules } = mergeUnassigned(meta, items, "finanzas");
  assert.deepEqual(modules[0].items.map((entry) => entry.path), ["finanzas/caja/clase.html"]);
});

test("no mezcla archivos de otro curso en los sin módulo", () => {
  const items = [item("finanzas/caja/clase.html"), item("finanzas-corporativas/caja/otro.html")];
  const { unassigned } = mergeUnassigned({ version: 1, updatedAt: "", modules: [] }, items, "finanzas");
  assert.deepEqual(unassigned.map((entry) => entry.path), ["finanzas/caja/clase.html"]);
});

test("reordena módulos preservando ids y agregando faltantes al final", () => {
  const modules = [{ id: "a", order: 0 }, { id: "b", order: 1 }, { id: "c", order: 2 }];
  const reordered = reorderBy(modules, ["c", "a"], (entry) => entry.id);
  assert.deepEqual(reordered.map((entry) => entry.id), ["c", "a", "b"]);
  assert.deepEqual(reordered.map((entry) => entry.order), [0, 1, 2]);
});

test("reordena ítems dentro de un módulo por ruta", () => {
  const items = [{ path: "a", order: 0 }, { path: "b", order: 1 }];
  const reordered = reorderBy(items, ["b", "a"], (entry) => entry.path);
  assert.deepEqual(reordered.map((entry) => entry.path), ["b", "a"]);
});

test("sin Blob configurado devuelve metadatos vacíos", async () => {
  const meta = await readCourseMeta("finanzas", async () => {
    throw new Error("no debería consultar Blob");
  }, false);
  assert.deepEqual(meta, { version: 1, updatedAt: new Date(0).toISOString(), modules: [] });
});
