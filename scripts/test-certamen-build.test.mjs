import assert from 'node:assert/strict';
import test from 'node:test';
import { assertSelfContained } from './test-certamen-build.mjs';

const inlineHtml = '<div data-state="activo"><a href="#inicio">Inicio</a></div><style>.icon { mask: url(#mask); }</style><script>const section = "#inicio";</script>';

test('acepta código inline y fragmentos internos', () => {
  assert.doesNotThrow(() => assertSelfContained(inlineHtml));
});

for (const html of [
  '<style>body { color: white; }</style><script src="/shared/app.js"></script>',
  '<style>body { color: white; }</style><link rel="stylesheet" href="../theme.css"><script>0</script>',
  '<style>@import "./theme.css";</style><script>0</script>',
  '<style>@font-face { src: url("../font.woff2"); }</style><script>0</script>',
  '<style>body { color: white; }</style><script>fetch("/data.json")</script>',
  '<style>body { color: white; }</style><script>fetch("#fragmento")</script>',
  '<style>body { color: white; }</style><script>fetch("https://example.com/data.json")</script>',
  '<style>body { color: white; }</style><script>new Worker("//example.com/worker.js")</script>',
  '<style>body { color: white; }</style><script>import("./module.js")</script>',
  '<style>body { color: white; }</style><script src="data:text/javascript,0"></script>',
]) {
  test(`rechaza dependencia externa: ${html}`, () => {
    assert.throws(() => assertSelfContained(html), /depend/i);
  });
}
