import assert from 'node:assert/strict';
import test from 'node:test';
import {
  betaFromCorrelation,
  capmReturn,
  certaintyEquivalentLog,
  expectedUtility,
  expectedValue,
  futureConsumption,
  minimumVarianceWeight,
  netPresentValue,
  parametricVar,
  portfolioReturn,
  portfolioVariance,
  presentWealth,
  riskDecomposition,
  sharpeRatio,
  treynorRatio,
} from './finance.js';

const closeTo = (actual, expected, tolerance = 1e-6) =>
  assert.ok(Math.abs(actual - expected) <= tolerance, `expected ${expected}, received ${actual}`);

test('calcula valor y utilidad esperados con probabilidades válidas', () => {
  closeTo(expectedValue([90_000, 65_000], [0.8, 0.2]), 85_000);
  closeTo(expectedUtility([90_000, 65_000], [0.8, 0.2], Math.log), 11.3425, 0.0001);
  closeTo(certaintyEquivalentLog(11.342480469225478), 84_328.95, 0.01);
});

test('rechaza probabilidades inválidas y riqueza no positiva para logaritmos', () => {
  assert.throws(() => expectedValue([1, 2], [0.4, 0.4]), /probabilidades/i);
  assert.throws(() => expectedUtility([0, 2], [0.5, 0.5], Math.log), /riqueza.*positiva/i);
});

test('calcula riqueza presente, consumo futuro y VAN del módulo dos períodos', () => {
  closeTo(presentWealth(1_200_000, 1_800_000, 0.1), 2_836_363.64, 0.01);
  closeTo(futureConsumption(1_200_000, 1_800_000, 1_500_000, 0.1), 1_470_000);
  closeTo(netPresentValue(400_000, 520_000, 0.1), 72_727.27, 0.01);
  closeTo(presentWealth(1_200_000, 1_800_000, 0.1) + netPresentValue(400_000, 520_000, 0.1), 2_909_090.91, 0.01);
  assert.throws(() => presentWealth(1, 1, -1), /tasa/i);
});

test('calcula retornos, varianza y ponderación de mínima varianza', () => {
  const weights = [0.597254, 0.402746];
  closeTo(portfolioReturn(weights, [0.14, 0.12]), 0.131945, 0.000001);
  closeTo(portfolioVariance(weights, [0.08, 0.09], [[1, 0.4], [0.4, 1]]), 0.004982334, 0.00000001);
  closeTo(minimumVarianceWeight(0.08, 0.09, 0.4), 0.597254, 0.000001);
  closeTo(minimumVarianceWeight(0.1, 0.14, 0.2), 0.7);
});

test('rechaza ponderaciones o varianzas inválidas', () => {
  assert.throws(() => portfolioReturn([0.4, 0.4], [0.1, 0.2]), /ponderaciones/i);
  assert.throws(() => portfolioVariance([0.5, 0.5], [0.1, 0.1], [[1, 2], [2, 1]]), /varianza/i);
});

test('calcula beta, CAPM, Sharpe y Treynor de los activos del caso', () => {
  closeTo(betaFromCorrelation(0.7, 0.08, 0.08), 0.7);
  closeTo(betaFromCorrelation(0.5, 0.09, 0.08), 0.5625);
  closeTo(betaFromCorrelation(0.8, 0.12, 0.08), 1.2);
  closeTo(capmReturn(0.04, 0.7, 0.15), 0.117);
  closeTo(capmReturn(0.04, 0.5625, 0.15), 0.101875);
  closeTo(capmReturn(0.04, 1.2, 0.15), 0.172);
  closeTo(sharpeRatio(0.14, 0.04, 0.08), 1.25);
  closeTo(treynorRatio(0.14, 0.04, 0.7), 0.142857, 0.000001);
  closeTo(treynorRatio(0.12, 0.04, 0.5625), 0.142222, 0.000001);
  closeTo(treynorRatio(0.15, 0.04, 1.2), 0.091667, 0.000001);
});

test('calcula VaR y descompone el riesgo del portafolio', () => {
  closeTo(parametricVar(10_000_000, 0.070585651, 10, 2.326, 252), 327_059, 1);
  const risk = riskDecomposition(0.004982334, 0.44116, 0.08 ** 2);
  closeTo(risk.systematicVariance, 0.001245584, 0.00000001);
  closeTo(risk.idiosyncraticVariance, 0.003736751, 0.00000001);
  closeTo(risk.systematicShare, 0.25, 0.00001);
  closeTo(risk.idiosyncraticShare, 0.75, 0.00001);
});
