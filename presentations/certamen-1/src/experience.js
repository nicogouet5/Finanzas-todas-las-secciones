import { portfolioReturn, portfolioVariance, sharpeRatio } from './finance.js';

const simulatorTitles = {
  riesgo: 'Laboratorio de seguro',
  'dos-periodos': 'Laboratorio de dos períodos',
  portafolio: 'Explorador de portafolio',
};

export function buildModuleScreens(module) {
  return [
    ...module.theorySlides.map((slide, index) => ({ id: `theory-${index}`, kind: 'theory', title: slide.title, data: slide })),
    { id: 'simulator', kind: 'simulator', title: simulatorTitles[module.id], data: module.id },
    { id: 'comments', kind: 'comments', title: 'Pausa de criterio', data: module.comments },
    ...module.exercises.map((exercise, index) => ({ id: `exercise-${index}`, kind: 'exercise', title: exercise.title, data: exercise })),
    { id: 'recap', kind: 'recap', title: 'Cierre del módulo', data: module.recap },
  ];
}

export function clampSlideIndex(index, delta, total) {
  if (total <= 0) return 0;
  return Math.max(0, Math.min(total - 1, index + delta));
}

export function maximumSharpeWeight({ firstReturn, secondReturn, riskFreeRate, firstDeviation, secondDeviation, correlation }) {
  let bestWeight = 0;
  let bestSharpe = -Infinity;
  for (let step = 0; step <= 1000; step += 1) {
    const firstWeight = step / 1000;
    const weights = [firstWeight, 1 - firstWeight];
    const returnRate = portfolioReturn(weights, [firstReturn, secondReturn]);
    const deviation = Math.sqrt(portfolioVariance(weights, [firstDeviation, secondDeviation], [[1, correlation], [correlation, 1]]));
    const sharpe = deviation > 0 ? sharpeRatio(returnRate, riskFreeRate, deviation) : -Infinity;
    if (sharpe > bestSharpe) {
      bestSharpe = sharpe;
      bestWeight = firstWeight;
    }
  }
  return bestWeight;
}

export function proximityLabel(weight, minimumRiskWeight, maximumSharpeReference, tolerance = 0.05) {
  const minimumRiskDistance = Math.abs(weight - minimumRiskWeight);
  const maximumSharpeDistance = Math.abs(weight - maximumSharpeReference);
  if (Math.min(minimumRiskDistance, maximumSharpeDistance) > tolerance) return 'Lejos de ambas referencias';
  return minimumRiskDistance <= maximumSharpeDistance
    ? 'Cerca del portafolio de mínima varianza'
    : 'Cerca del portafolio de máximo Sharpe';
}
