import assert from "node:assert/strict";
import test from "node:test";
import { computeHubStats, formatShortDateEs } from "./hub-stats.ts";
import type { CourseModule } from "./course-modules.ts";

const module_ = (overrides: Partial<CourseModule> = {}): CourseModule => ({
  id: "m1",
  title: "Unidad 1",
  order: 0,
  published: true,
  items: [],
  ...overrides,
});

test("sin datos devuelve ceros y fecha de respaldo", () => {
  const stats = computeHubStats([], new Map());
  assert.deepEqual(stats, { courseCount: 0, moduleCount: 0, fileCount: 0, latestLabel: "—" });
});

test("excluye módulos despublicados del conteo", () => {
  const courseModules = [
    {
      course: "finanzas",
      modules: [
        module_({ id: "a", published: true, items: [{ path: "finanzas/caja/guia.pdf", order: 0 }] }),
        module_({ id: "b", published: false, items: [{ path: "finanzas/caja/oculto.pdf", order: 0 }] }),
      ],
    },
  ];
  const stats = computeHubStats(courseModules, new Map());
  assert.equal(stats.moduleCount, 1);
  assert.equal(stats.fileCount, 1);
  assert.equal(stats.courseCount, 1);
});

test("un ramo sin módulos publicados con ítems no cuenta como activo", () => {
  const courseModules = [
    { course: "finanzas", modules: [module_({ id: "a", published: true, items: [] })] },
  ];
  const stats = computeHubStats(courseModules, new Map());
  assert.equal(stats.courseCount, 0);
  assert.equal(stats.moduleCount, 1);
});

test("calcula la fecha más reciente entre los archivos publicados", () => {
  const courseModules = [
    {
      course: "finanzas",
      modules: [
        module_({
          id: "a",
          items: [
            { path: "finanzas/caja/vieja.pdf", order: 0 },
            { path: "finanzas/caja/nueva.pdf", order: 1 },
          ],
        }),
      ],
    },
  ];
  const uploadedAtByPath = new Map([
    ["finanzas/caja/vieja.pdf", "2026-01-01T00:00:00.000Z"],
    ["finanzas/caja/nueva.pdf", "2026-08-11T00:00:00.000Z"],
  ]);
  const stats = computeHubStats(courseModules, uploadedAtByPath);
  assert.equal(stats.latestLabel, formatShortDateEs(new Date("2026-08-11T00:00:00.000Z")));
});

test("ignora fechas inválidas o ausentes", () => {
  const courseModules = [
    {
      course: "finanzas",
      modules: [module_({ id: "a", items: [{ path: "finanzas/caja/sin-fecha.pdf", order: 0 }] })],
    },
  ];
  const stats = computeHubStats(courseModules, new Map([["finanzas/caja/sin-fecha.pdf", "no-es-fecha"]]));
  assert.equal(stats.latestLabel, "—");
});
