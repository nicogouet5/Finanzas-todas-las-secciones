import assert from 'node:assert/strict';
import test from 'node:test';
import {
  areCommentsReady,
  buildCommentPrompts,
  buildLogUtilityChart,
  buildModuleScreens,
  CERTAINTY_EQUIVALENT_FORMULA,
  clampSlideIndex,
  maximumSharpeWeight,
  proximityLabel,
} from './experience.js';
import { studyModules } from './content.js';

test('convierte cada módulo en ocho pantallas navegables en el orden didáctico', () => {
  for (const module of studyModules) {
    assert.deepEqual(buildModuleScreens(module).map(({ id }) => id), [
      'theory-0', 'theory-1', 'theory-2', 'simulator', 'comments', 'exercise-0', 'exercise-1', 'recap',
    ]);
  }
});

test('acota la navegación secuencial al inicio y final del módulo', () => {
  assert.equal(clampSlideIndex(0, -1, 8), 0);
  assert.equal(clampSlideIndex(3, 1, 8), 4);
  assert.equal(clampSlideIndex(7, 1, 8), 7);
});

test('encuentra la referencia de máximo Sharpe sin ventas cortas', () => {
  const weight = maximumSharpeWeight({ firstReturn: 0.15, secondReturn: 0.25, riskFreeRate: 0.06, firstDeviation: 0.1, secondDeviation: 0.14, correlation: 0.2 });
  assert.ok(Math.abs(weight - 0.428) <= 0.002, `ponderación recibida: ${weight}`);
});

test('describe cercanía a las asignaciones de referencia', () => {
  assert.equal(proximityLabel(0.69, 0.7, 0.428), 'Cerca del portafolio de mínima varianza');
  assert.equal(proximityLabel(0.43, 0.7, 0.428), 'Cerca del portafolio de máximo Sharpe');
  assert.equal(proximityLabel(0.1, 0.7, 0.428), 'Lejos de ambas referencias');
});

test('mantiene tres tarjetas y exige A, B y C por separado en el comentario compuesto', () => {
  const portfolio = studyModules.find((module) => module.id === 'portafolio');
  assert.equal(portfolio.comments.length, 3);
  assert.deepEqual(portfolio.comments.map((comment) => buildCommentPrompts(comment).length), [1, 1, 3]);

  const compositePrompts = buildCommentPrompts(portfolio.comments[2]);
  assert.deepEqual(compositePrompts.map(({ id }) => id), ['a-correlacion', 'b-beta', 'c-capm']);
  assert.equal(new Set(compositePrompts.map(({ justification }) => justification)).size, 3);
  assert.ok(compositePrompts.every(({ justification, memoryHook }) => justification && memoryHook));

  const incomplete = { 'diversificacion-total': 'falso', 'activo-volatilidad': 'falso', 'a-correlacion': 'verdadero', 'b-beta': 'falso' };
  assert.equal(areCommentsReady(portfolio.comments, incomplete), false);
  assert.equal(areCommentsReady(portfolio.comments, { ...incomplete, 'c-capm': 'verdadero' }), true);
});

test('mantiene marcadores de utilidad dentro del SVG para valores válidos extremos', () => {
  for (const values of [[1_000, 2_090, 40_000], [175_000, 177_000, 180_000], [65_000, 84_329, 90_000]]) {
    const chart = buildLogUtilityChart(values);
    assert.equal(chart.curve.length, 41);
    for (const point of [...chart.curve, ...chart.markers]) {
      assert.ok(point.x >= 48 && point.x <= 556, `x fuera del SVG: ${point.x}`);
      assert.ok(point.y >= 50 && point.y <= 224, `y fuera del SVG: ${point.y}`);
    }
  }
});

test('usa notación inequívoca para el equivalente cierto logarítmico', () => {
  assert.equal(CERTAINTY_EQUIVALENT_FORMULA, 'CE = exp(E[ln(W)])');
});
