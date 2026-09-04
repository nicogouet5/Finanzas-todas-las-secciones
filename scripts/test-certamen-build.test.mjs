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
  '<style>body { color: white; }</style><script>0</script><img srcset="/uno.png 1x, ../dos.png 2x">',
  '<style>body { color: white; }</style><script>0</script><source srcset="./uno.webp 1x, //cdn.example/dos.webp 2x">',
  '<style>body { color: white; }</style><script>0</script><object data="../documento.pdf"></object>',
  '<style>body { color: white; }</style><script>0</script><embed src="/documento.pdf">',
  '<style>body { color: white; }</style><script>0</script><video poster="./poster.jpg"></video>',
  '<style>body { color: white; }</style><script>0</script><video poster="./poster.jpg"><source src="/clip.mp4"></video>',
]) {
  test(`rechaza dependencia externa: ${html}`, () => {
    assert.throws(() => assertSelfContained(html), /depend/i);
  });
}
