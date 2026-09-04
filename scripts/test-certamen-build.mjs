import assert from 'node:assert/strict';
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { resolve } from 'node:path';

const resourceTags = /<(script|link|style|img|source|video|audio|iframe|object|embed|track|use)\b[^>]*>/gi;
const resourceAttribute = /\b(src|href)\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+))/gi;
const runtimeLoaders = [
  /\bfetch\s*\(\s*(["'])(.*?)\1/gi,
  /\bimport\s*\(\s*(["'])(.*?)\1/gi,
  /\bnew\s+(?:Worker|SharedWorker|EventSource|WebSocket)\s*\(\s*(["'])(.*?)\1/gi,
  /\.open\s*\(\s*["'][A-Z]+["']\s*,\s*(["'])(.*?)\1/gi,
  /\bsendBeacon\s*\(\s*(["'])(.*?)\1/gi,
];

function assertNoExternalReference(reference, context, allowFragment = false) {
  assert.ok(allowFragment && reference.startsWith('#'), `Dependencia externa detectada en ${context}: ${reference}`);
}

export function assertSelfContained(html) {
  for (const tag of html.matchAll(resourceTags)) {
    const [, name] = tag;
    for (const attribute of tag[0].matchAll(resourceAttribute)) {
      const [, attributeName, doubleQuoted, singleQuoted, bare] = attribute;
      const reference = doubleQuoted ?? singleQuoted ?? bare ?? '';
      assertNoExternalReference(reference, `<${name}> ${attributeName}`, name.toLowerCase() === 'use' && attributeName.toLowerCase() === 'href');
    }
  }

  for (const importRule of html.matchAll(/@import\s+(?:url\(\s*)?(?:"([^"]*)"|'([^']*)'|([^\s;)]+))/gi)) {
    assertNoExternalReference(importRule[1] ?? importRule[2] ?? importRule[3] ?? '', '@import');
  }

  for (const url of html.matchAll(/url\(\s*(?:"([^"]*)"|'([^']*)'|([^\s)]+))\s*\)/gi)) {
    assertNoExternalReference(url[1] ?? url[2] ?? url[3] ?? '', 'url()', true);
  }

  for (const loader of runtimeLoaders) {
    for (const match of html.matchAll(loader)) assertNoExternalReference(match[2], 'carga de datos en tiempo de ejecución');
  }

  assert.match(html, /<style(?:\s[^>]*)?>\s*\S/i, 'El artefacto debe incluir CSS inline.');
  assert.match(html, /<script(?![^>]*\bsrc\s*=)(?:\s[^>]*)?>\s*\S/i, 'El artefacto debe incluir JavaScript inline.');
}

export function verifyBuild() {
  const outputDirectory = resolve('public/materiales/finanzas-corporativas/certamen-1');
  const outputFile = resolve(outputDirectory, 'presentacion-certamen-1-finanzas-corporativas.html');

  assert.ok(existsSync(outputFile), `Falta el artefacto: ${outputFile}`);
  assertSelfContained(readFileSync(outputFile, 'utf8'));
  assert.equal(
    readdirSync(outputDirectory, { recursive: true }).filter((file) => /\.(?:js|css)$/i.test(file)).length,
    0,
    'El directorio de salida no puede contener assets JavaScript o CSS separados.',
  );
  console.log(`Verificado: ${outputFile}`);
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) verifyBuild();
