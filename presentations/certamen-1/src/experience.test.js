import assert from 'node:assert/strict';
import test from 'node:test';
import { buildModuleScreens, clampSlideIndex, maximumSharpeWeight, proximityLabel } from './experience.js';
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
