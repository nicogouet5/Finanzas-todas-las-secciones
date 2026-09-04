import { portfolioReturn, portfolioVariance, sharpeRatio } from './finance.js';

const simulatorTitles = {
  riesgo: 'Laboratorio de seguro',
  'dos-periodos': 'Laboratorio de dos períodos',
  portafolio: 'Explorador de portafolio',
};

export const CERTAINTY_EQUIVALENT_FORMULA = 'CE = exp(E[ln(W)])';

const subitemFeedback = {
  'a-correlacion': {
    justification: 'Verdadero. Si la correlación es menor que 1, los activos no se mueven perfectamente juntos y la covarianza puede reducir la varianza del portafolio.',
    memoryHook: 'Movimientos menos sincronizados abren espacio para diversificar.',
  },
  'b-beta': {
    justification: 'Falso. Beta mide sensibilidad al riesgo sistemático del mercado; el riesgo total también incluye el componente idiosincrático.',
    memoryHook: 'Beta mira la lluvia del mercado, no cada gotera propia.',
  },
  'c-capm': {
    justification: 'Verdadero bajo los supuestos de CAPM. Si el retorno esperado supera el retorno requerido, el activo ofrece más retorno que su peaje de riesgo y se interpreta como subvalorado.',
    memoryHook: 'Promesa sobre el peaje CAPM indica precio bajo, bajo los supuestos.',
  },
};

export function buildCommentPrompts(comment) {
  if (!comment.subitems) return [comment];
  return comment.subitems.map((subitem) => ({
    ...subitem,
    ...subitemFeedback[subitem.id],
  }));
}

export function areCommentsReady(comments, choices) {
  return comments.every((comment) => buildCommentPrompts(comment).every((prompt) => Boolean(choices[prompt.id])));
}

export function buildLogUtilityChart(values) {
  if (!Array.isArray(values) || values.length === 0 || values.some((value) => !Number.isFinite(value) || value <= 0)) {
    throw new RangeError('Los valores del gráfico deben ser positivos y finitos.');
  }

  const bounds = { left: 48, right: 556, top: 50, bottom: 224 };
  const dataMin = Math.min(...values);
  const dataMax = Math.max(...values);
  const spread = Math.max(dataMax - dataMin, dataMax * 0.05, 1);
  const domainMin = Math.max(1, dataMin - spread * 0.08);
  const domainMax = dataMax + spread * 0.08;
  const logMin = Math.log(domainMin);
  const logRange = Math.log(domainMax) - logMin;

  const point = (value) => ({
    x: bounds.left + ((value - domainMin) / (domainMax - domainMin)) * (bounds.right - bounds.left),
    y: bounds.bottom - ((Math.log(value) - logMin) / logRange) * (bounds.bottom - bounds.top),
  });

  const curve = Array.from({ length: 41 }, (_, index) => {
    const value = domainMin + (index / 40) * (domainMax - domainMin);
    return point(value);
  });

  return { bounds, curve, markers: values.map(point) };
}

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
