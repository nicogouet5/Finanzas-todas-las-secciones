import assert from "node:assert/strict";
import test from "node:test";
import { addBuiltInCourseModules } from "./built-in-course-modules.ts";
import type { CourseModule } from "./course-modules.ts";
import type { MaterialItem } from "./materials.ts";

const certamenPath = "finanzas-corporativas/certamen-1/presentacion-certamen-1-finanzas-corporativas.html";

const module_ = (overrides: Partial<CourseModule> = {}): CourseModule => ({
  id: "m1",
  title: "Unidad 1",
  order: 0,
  published: true,
  items: [],
  ...overrides,
});

const item = (path: string): MaterialItem => ({
  path,
  name: path.split("/").at(-1) ?? path,
  url: `/materiales/${path}`,
  downloadUrl: `/materiales/${path}`,
  size: 1,
  contentType: "text/html",
  uploadedAt: null,
  source: "local",
});

test("agrega el módulo integrado de Certamen 1 para Finanzas Corporativas", () => {
  const modules = addBuiltInCourseModules("finanzas-corporativas", [module_()], [item(certamenPath)]);
  assert.equal(modules[0]?.id, "built-in-certamen-1");
  assert.equal(modules[0]?.title, "Certamen 1");
  assert.equal(modules[0]?.published, true);
  assert.deepEqual(modules[0]?.items, [{ path: certamenPath, title: "Repaso Certamen 1: riesgo, dos períodos y portafolios", order: 0 }]);
});

test("no agrega el módulo integrado si un módulo remoto ya referencia la presentación", () => {
  const modules = addBuiltInCourseModules("finanzas-corporativas", [module_({ published: false, items: [{ path: certamenPath, order: 0 }] })], [item(certamenPath)]);
  assert.equal(modules.length, 1);
  assert.equal(modules[0]?.id, "m1");
});

test("deja intactos otros cursos o si falta el material local", () => {
  assert.deepEqual(addBuiltInCourseModules("finanzas", [module_()], [item(certamenPath)]), [module_()]);
  assert.deepEqual(addBuiltInCourseModules("finanzas-corporativas", [module_()], [item("finanzas-corporativas/otro/material.html")]), [module_()]);
});
