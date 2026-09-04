const EPSILON = 1e-9;

function finite(value, name) {
  if (!Number.isFinite(value)) throw new Error(`${name} debe ser un número finito.`);
}

function validRate(rate) {
  finite(rate, 'La tasa');
  if (rate <= -1) throw new Error('La tasa debe ser mayor que -1.');
}

function validProbabilities(values, probabilities) {
  if (!Array.isArray(values) || !Array.isArray(probabilities) || values.length === 0 || values.length !== probabilities.length) {
    throw new Error('Los valores y las probabilidades deben tener la misma longitud.');
  }
  const total = probabilities.reduce((sum, probability) => {
    finite(probability, 'La probabilidad');
    if (probability < 0) throw new Error('Las probabilidades no pueden ser negativas.');
    return sum + probability;
  }, 0);
  if (Math.abs(total - 1) > EPSILON) throw new Error('Las probabilidades deben sumar 1.');
}

function validWeights(weights, length) {
  if (!Array.isArray(weights) || weights.length !== length) throw new Error('Las ponderaciones no coinciden con los activos.');
  const total = weights.reduce((sum, weight) => {
    finite(weight, 'La ponderación');
    return sum + weight;
  }, 0);
  if (Math.abs(total - 1) > EPSILON) throw new Error('Las ponderaciones deben sumar 1.');
}

export function expectedValue(values, probabilities) {
  validProbabilities(values, probabilities);
  return values.reduce((sum, value, index) => {
    finite(value, 'El resultado');
    return sum + value * probabilities[index];
  }, 0);
}

export function expectedUtility(wealth, probabilities, utility) {
  validProbabilities(wealth, probabilities);
  if (typeof utility !== 'function') throw new Error('La utilidad debe ser una función.');
  return wealth.reduce((sum, value, index) => {
    finite(value, 'La riqueza');
    if (utility === Math.log && value <= 0) throw new Error('La riqueza debe ser positiva para utilidad logarítmica.');
    const result = utility(value);
    finite(result, 'La utilidad');
    return sum + result * probabilities[index];
  }, 0);
}

export function certaintyEquivalentLog(expectedLogUtility) {
  finite(expectedLogUtility, 'La utilidad esperada');
  return Math.exp(expectedLogUtility);
}

export function presentWealth(incomeToday, incomeFuture, rate) {
  finite(incomeToday, 'El ingreso presente');
  finite(incomeFuture, 'El ingreso futuro');
  validRate(rate);
  return incomeToday + incomeFuture / (1 + rate);
}

export function futureConsumption(incomeToday, incomeFuture, consumptionToday, rate) {
  finite(incomeToday, 'El ingreso presente');
  finite(incomeFuture, 'El ingreso futuro');
  finite(consumptionToday, 'El consumo presente');
  validRate(rate);
  return incomeFuture + (incomeToday - consumptionToday) * (1 + rate);
}

export function netPresentValue(initialInvestment, futureCashFlow, rate) {
  finite(initialInvestment, 'La inversión inicial');
  finite(futureCashFlow, 'El flujo futuro');
  validRate(rate);
  return futureCashFlow / (1 + rate) - initialInvestment;
}

export function portfolioReturn(weights, returns) {
  if (!Array.isArray(returns)) throw new Error('Los retornos deben ser una lista.');
  validWeights(weights, returns.length);
  return returns.reduce((sum, rate, index) => {
    finite(rate, 'El retorno');
    return sum + weights[index] * rate;
  }, 0);
}

export function portfolioVariance(weights, standardDeviations, correlations) {
  if (!Array.isArray(standardDeviations) || standardDeviations.length === 0) throw new Error('Las desviaciones estándar deben ser una lista.');
  validWeights(weights, standardDeviations.length);
  const count = standardDeviations.length;
  if (!Array.isArray(correlations) || correlations.length !== count) throw new Error('La matriz de correlaciones no coincide con los activos.');
  standardDeviations.forEach((deviation) => {
    finite(deviation, 'La desviación estándar');
    if (deviation < 0) throw new Error('La desviación estándar no puede ser negativa.');
  });

  let variance = 0;
  for (let row = 0; row < count; row += 1) {
    if (!Array.isArray(correlations[row]) || correlations[row].length !== count) throw new Error('La matriz de correlaciones debe ser cuadrada.');
    for (let column = 0; column < count; column += 1) {
      const correlation = correlations[row][column];
      finite(correlation, 'La correlación');
      if (correlation < -1 || correlation > 1 || Math.abs(correlation - correlations[column]?.[row]) > EPSILON) {
        throw new Error('La matriz de correlaciones genera una varianza inválida.');
      }
      variance += weights[row] * weights[column] * standardDeviations[row] * standardDeviations[column] * correlation;
    }
  }
  if (variance < -EPSILON) throw new Error('La varianza no puede ser negativa con datos válidos.');
  return Math.max(0, variance);
}

export function minimumVarianceWeight(firstDeviation, secondDeviation, correlation) {
  finite(firstDeviation, 'La primera desviación estándar');
  finite(secondDeviation, 'La segunda desviación estándar');
  finite(correlation, 'La correlación');
  if (firstDeviation < 0 || secondDeviation < 0 || correlation < -1 || correlation > 1) throw new Error('Los datos de riesgo son inválidos.');
  const denominator = firstDeviation ** 2 + secondDeviation ** 2 - 2 * correlation * firstDeviation * secondDeviation;
  if (Math.abs(denominator) < EPSILON) throw new Error('No existe una ponderación única de mínima varianza.');
  return (secondDeviation ** 2 - correlation * firstDeviation * secondDeviation) / denominator;
}

export function betaFromCorrelation(correlation, assetDeviation, marketDeviation) {
  finite(correlation, 'La correlación');
  finite(assetDeviation, 'La desviación estándar del activo');
  finite(marketDeviation, 'La desviación estándar del mercado');
  if (correlation < -1 || correlation > 1 || assetDeviation < 0 || marketDeviation <= 0) throw new Error('Los datos para beta son inválidos.');
  return correlation * assetDeviation / marketDeviation;
}

export function capmReturn(riskFreeRate, beta, marketReturn) {
  finite(riskFreeRate, 'La tasa libre de riesgo');
  finite(beta, 'Beta');
  finite(marketReturn, 'El retorno de mercado');
  return riskFreeRate + beta * (marketReturn - riskFreeRate);
}

export function sharpeRatio(returnRate, riskFreeRate, deviation) {
  finite(returnRate, 'El retorno');
  finite(riskFreeRate, 'La tasa libre de riesgo');
  finite(deviation, 'La desviación estándar');
  if (deviation <= 0) throw new Error('La desviación estándar debe ser positiva.');
  return (returnRate - riskFreeRate) / deviation;
}

export function treynorRatio(returnRate, riskFreeRate, beta) {
  finite(returnRate, 'El retorno');
  finite(riskFreeRate, 'La tasa libre de riesgo');
  finite(beta, 'Beta');
  if (Math.abs(beta) < EPSILON) throw new Error('Beta no puede ser cero.');
  return (returnRate - riskFreeRate) / beta;
}

export function parametricVar(positionValue, deviation, days, zScore, tradingDays = 252) {
  finite(positionValue, 'El valor de la posición');
  finite(deviation, 'La desviación estándar');
  finite(days, 'Los días');
  finite(zScore, 'El puntaje z');
  finite(tradingDays, 'Los días bursátiles');
  if (positionValue < 0 || deviation < 0 || days <= 0 || zScore < 0 || tradingDays <= 0) throw new Error('Los datos para VaR son inválidos.');
  return positionValue * deviation * zScore * Math.sqrt(days / tradingDays);
}

export function riskDecomposition(totalVariance, beta, marketVariance) {
  finite(totalVariance, 'La varianza total');
  finite(beta, 'Beta');
  finite(marketVariance, 'La varianza de mercado');
  if (totalVariance < 0 || marketVariance < 0) throw new Error('La varianza no puede ser negativa.');
  const systematicVariance = beta ** 2 * marketVariance;
  const idiosyncraticVariance = totalVariance - systematicVariance;
  if (idiosyncraticVariance < -EPSILON) throw new Error('La varianza residual no puede ser negativa con datos válidos.');
  const idiosyncratic = Math.max(0, idiosyncraticVariance);
  return {
    systematicVariance,
    idiosyncraticVariance: idiosyncratic,
    systematicShare: totalVariance === 0 ? 0 : systematicVariance / totalVariance,
    idiosyncraticShare: totalVariance === 0 ? 0 : idiosyncratic / totalVariance,
  };
}
