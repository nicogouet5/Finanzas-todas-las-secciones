import assert from "node:assert/strict";
import test from "node:test";
import { normalizeMaterialPath, normalizeSegment } from "./material-paths.ts";

test("normaliza nombres académicos", () => {
  assert.equal(normalizeSegment(" Administración de Caja "), "administracion-de-caja");
});

test("rechaza traversal y rutas absolutas", () => {
  assert.throws(() => normalizeMaterialPath("../secreto"));
  assert.throws(() => normalizeMaterialPath("/etc/passwd"));
});
