import assert from 'node:assert/strict';
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const outputDirectory = resolve('public/materiales/finanzas-corporativas/certamen-1');
const outputFile = resolve(outputDirectory, 'presentacion-certamen-1-finanzas-corporativas.html');

assert.ok(existsSync(outputFile), `Falta el artefacto: ${outputFile}`);

const html = readFileSync(outputFile, 'utf8');
assert.match(html, /<style(?:\s[^>]*)?>\s*\S/i, 'El artefacto debe incluir CSS inline.');
assert.match(html, /<script(?:\s[^>]*)?>\s*\S/i, 'El artefacto debe incluir JavaScript inline.');
assert.doesNotMatch(html, /<(?:script|link|img|source|video|audio|iframe)\b[^>]+(?:src|href)\s*=\s*["'](?:https?:)?\/\//i, 'El artefacto no puede depender de URLs externas.');
assert.doesNotMatch(html, /(?:src|href)\s*=\s*["']data:|url\(\s*["']?(?:data:|(?:https?:)?\/\/)/i, 'El artefacto no puede depender de fuentes, estilos o datos externos.');
assert.equal(
  readdirSync(outputDirectory, { recursive: true }).filter((file) => /\.(?:js|css)$/i.test(file)).length,
  0,
  'El directorio de salida no puede contener assets JavaScript o CSS separados.',
);

console.log(`Verificado: ${outputFile}`);
