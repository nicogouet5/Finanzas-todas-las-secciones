import assert from "node:assert/strict";
import test from "node:test";
import { kindForContentType, matchMaterials, normalizeQuery } from "./search.ts";

const item = (title: string, moduleTitle: string, path = title) => ({
  path,
  title,
  moduleTitle,
  contentType: "application/pdf",
});

test("normalizeQuery quita tildes y pasa a minúsculas", () => {
  assert.equal(normalizeQuery("Bonós"), "bonos");
  assert.equal(normalizeQuery("  VALORACIÓN  "), "valoracion");
});

test("encuentra coincidencias ignorando tildes", () => {
  const items = [item("Valoración de Bonós", "Renta fija")];
  const result = matchMaterials(items, "bonos");
  assert.equal(result.length, 1);
  assert.equal(result[0].title, "Valoración de Bonós");
});

test("ignora mayúsculas/minúsculas", () => {
  const items = [item("Flujo de Caja", "Administración")];
  assert.equal(matchMaterials(items, "FLUJO").length, 1);
});

test("coincidencia parcial por subcadena", () => {
  const items = [item("Estados Financieros Consolidados", "Contabilidad")];
  assert.equal(matchMaterials(items, "financ").length, 1);
});

test("coincidencia en título pesa más que en módulo", () => {
  const items = [
    item("Introducción", "Bonos y Renta Fija"),
    item("Bonos corporativos", "Introducción"),
  ];
  const result = matchMaterials(items, "bonos");
  assert.equal(result[0].title, "Bonos corporativos");
});

test("coincidencia de prefijo pesa más que de subcadena", () => {
  const items = [
    item("Sub Bonos intermedios", "Modulo"),
    item("Bonos básicos", "Modulo"),
  ];
  const result = matchMaterials(items, "bonos");
  assert.equal(result[0].title, "Bonos básicos");
});

test("query vacía devuelve todo sin reordenar", () => {
  const items = [item("B", "M"), item("A", "M")];
  const result = matchMaterials(items, "");
  assert.deepEqual(result.map((i) => i.title), ["B", "A"]);
});

test("sin resultados cuando nada coincide", () => {
  const items = [item("Flujo de caja", "Administración")];
  assert.deepEqual(matchMaterials(items, "inexistente"), []);
});

test("kindForContentType clasifica tipos comunes", () => {
  assert.equal(kindForContentType("application/pdf"), "pdf");
  assert.equal(kindForContentType("application/vnd.openxmlformats-officedocument.presentationml.presentation"), "slides");
  assert.equal(kindForContentType("application/msword"), "doc");
  assert.equal(kindForContentType("video/mp4"), "video");
  assert.equal(kindForContentType("text/html"), "other");
});
