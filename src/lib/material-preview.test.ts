import assert from "node:assert/strict";
import test from "node:test";
import { previewUrl } from "./material-preview.ts";

test("previewUrl deja el HTML local en su URL pública", () => {
  assert.equal(previewUrl({
    path: "finanzas-corporativas/certamen-1/presentacion-certamen-1-finanzas-corporativas.html",
    url: "/materiales/finanzas-corporativas/certamen-1/presentacion-certamen-1-finanzas-corporativas.html",
    contentType: "text/html",
    source: "local",
  }), "/materiales/finanzas-corporativas/certamen-1/presentacion-certamen-1-finanzas-corporativas.html");
});

test("previewUrl mantiene HTML y SVG remotos detrás del proxy aislado", () => {
  assert.equal(previewUrl({
    path: "finanzas-corporativas/certamen-1/presentacion-certamen-1-finanzas-corporativas.html",
    url: "https://blob.example/html",
    contentType: "text/html",
    source: "blob",
  }), "/api/material/view/finanzas-corporativas/certamen-1/presentacion-certamen-1-finanzas-corporativas.html");

  assert.equal(previewUrl({
    path: "finanzas/logo.svg",
    url: "https://blob.example/logo.svg",
    contentType: "image/svg+xml",
    source: "blob",
  }), "/api/material/view/finanzas/logo.svg");
});

test("previewUrl conserva la URL original para otros formatos", () => {
  assert.equal(previewUrl({
    path: "finanzas/apuntes/guia.pdf",
    url: "https://blob.example/guia.pdf",
    contentType: "application/pdf",
    source: "blob",
  }), "https://blob.example/guia.pdf");
});
