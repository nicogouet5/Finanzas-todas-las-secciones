import { useId, useMemo, useState } from 'react';
import {
  certaintyEquivalentLog,
  expectedUtility,
  futureConsumption,
  minimumVarianceWeight,
  netPresentValue,
  portfolioReturn,
  portfolioVariance,
  presentWealth,
  sharpeRatio,
} from '../finance.js';
import { maximumSharpeWeight, proximityLabel } from '../experience.js';
import { Formula } from './Formula.jsx';

const money = new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', maximumFractionDigits: 0 });
const decimal = new Intl.NumberFormat('es-CL', { maximumFractionDigits: 4 });
const percent = new Intl.NumberFormat('es-CL', { style: 'percent', maximumFractionDigits: 2 });

function RangeControl({ id, label, value, min, max, step, onChange, format = decimal.format }) {
  return <label className="range-control" htmlFor={id}>
    <span><strong>{label}</strong><output htmlFor={id}>{format(value)}</output></span>
    <input id={id} type="range" min={min} max={max} step={step} value={value} onChange={(event) => onChange(Number(event.target.value))} />
  </label>;
}

function Metric({ label, value, tone }) {
  return <div className={`metric${tone ? ` metric--${tone}` : ''}`}><span>{label}</span><strong>{value}</strong></div>;
}

export function RiskSimulator() {
  const uid = useId();
  const [inputs, setInputs] = useState({ wealth: 90_000, loss: 25_000, probability: 20 });
  const probability = inputs.probability / 100;
  const wealthAfterLoss = Math.max(1, inputs.wealth - inputs.loss);
  const utility = expectedUtility([inputs.wealth, wealthAfterLoss], [1 - probability, probability], Math.log);
  const equivalent = certaintyEquivalentLog(utility);
  const fairPremium = probability * inputs.loss;
  const maximumPremium = inputs.wealth - equivalent;
  const offeredPremium = 5_400;
  const shouldInsure = offeredPremium <= maximumPremium;
  const curve = Array.from({ length: 41 }, (_, index) => {
    const wealth = Math.max(1, inputs.wealth * (0.25 + index * 0.025));
    const x = 48 + index * 12.7;
    const minUtility = Math.log(inputs.wealth * 0.25);
    const maxUtility = Math.log(inputs.wealth * 1.25);
    const y = 224 - ((Math.log(wealth) - minUtility) / (maxUtility - minUtility)) * 174;
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  }).join(' ');
  const markerX = (value) => 48 + ((value / inputs.wealth - 0.25) / 1) * 508;
  const markerY = (value) => {
    const minUtility = Math.log(inputs.wealth * 0.25);
    const maxUtility = Math.log(inputs.wealth * 1.25);
    return 224 - ((Math.log(Math.max(1, value)) - minUtility) / (maxUtility - minUtility)) * 174;
  };

  function update(key, value) {
    setInputs((current) => {
      const next = { ...current, [key]: value };
      if (key === 'wealth') next.loss = Math.min(next.loss, value - 1_000);
      if (key === 'loss') next.loss = Math.min(value, current.wealth - 1_000);
      return next;
    });
  }

  return <section className="simulator-layout">
    <div className="control-panel">
      <p className="lead-copy">Mueve un dato a la vez y observa cuánto estás dispuesto a pagar por eliminar la incertidumbre.</p>
      <RangeControl id={`${uid}-wealth`} label="Riqueza inicial" value={inputs.wealth} min={40_000} max={180_000} step={5_000} onChange={(value) => update('wealth', value)} format={money.format} />
      <RangeControl id={`${uid}-loss`} label="Pérdida posible" value={inputs.loss} min={5_000} max={Math.max(5_000, inputs.wealth - 1_000)} step={1_000} onChange={(value) => update('loss', value)} format={money.format} />
      <RangeControl id={`${uid}-probability`} label="Probabilidad de pérdida" value={inputs.probability} min={1} max={80} step={1} onChange={(value) => update('probability', value)} format={(value) => `${value}%`} />
      <Formula label="Utilidad esperada logarítmica">EU = (1−p) ln(W) + p ln(W−L)</Formula>
    </div>
    <div className="simulator-output">
      <div className="metric-grid">
        <Metric label="Utilidad esperada" value={decimal.format(utility)} />
        <Metric label="Equivalente cierto" value={money.format(equivalent)} />
        <Metric label="Prima justa" value={money.format(fairPremium)} />
        <Metric label="Prima máxima" value={money.format(maximumPremium)} tone="accent" />
      </div>
      <p className={`decision ${shouldInsure ? 'decision--yes' : 'decision--no'}`} role="status"><strong>Prima ofrecida: {money.format(offeredPremium)}</strong>{shouldInsure ? 'Conviene comprar el seguro.' : 'La prima supera tu disposición máxima a pagar.'}</p>
      <svg className="chart" viewBox="0 0 610 270" role="img" aria-labelledby={`${uid}-title ${uid}-desc`}>
        <title id={`${uid}-title`}>Curva de utilidad logarítmica</title>
        <desc id={`${uid}-desc`}>Curva cóncava con marcadores para riqueza tras pérdida, equivalente cierto y riqueza inicial.</desc>
        <line x1="48" y1="224" x2="570" y2="224" />
        <line x1="48" y1="224" x2="48" y2="34" />
        <polyline className="chart__line" points={curve} />
        {[[wealthAfterLoss, 'Pérdida'], [equivalent, 'CE'], [inputs.wealth, 'W₀']].map(([value, label]) => <g key={label} transform={`translate(${markerX(value)},${markerY(value)})`}>
          <circle r="5" /><text x="8" y="-8">{label}</text>
        </g>)}
        <text className="chart__axis-label" x="555" y="248">Riqueza</text>
        <text className="chart__axis-label" x="14" y="30">U(W)</text>
      </svg>
    </div>
  </section>;
}

export function TwoPeriodSimulator() {
  const uid = useId();
  const [inputs, setInputs] = useState({ incomeToday: 1_200_000, incomeFuture: 1_800_000, rate: 10, consumptionToday: 1_500_000 });
  const [withProject, setWithProject] = useState(false);
  const rate = inputs.rate / 100;
  const projectNpv = netPresentValue(400_000, 520_000, rate);
  const currentIncomeToday = inputs.incomeToday - (withProject ? 400_000 : 0);
  const currentIncomeFuture = inputs.incomeFuture + (withProject ? 520_000 : 0);
  const baseWealth = presentWealth(inputs.incomeToday, inputs.incomeFuture, rate);
  const currentWealth = presentWealth(currentIncomeToday, currentIncomeFuture, rate);
  const consumptionFuture = futureConsumption(currentIncomeToday, currentIncomeFuture, inputs.consumptionToday, rate);
  const saving = currentIncomeToday - inputs.consumptionToday;
  const maxWealth = Math.max(baseWealth, currentWealth) * 1.06;
  const maxFuture = Math.max(inputs.incomeFuture + inputs.incomeToday * (1 + rate), currentIncomeFuture + currentIncomeToday * (1 + rate)) * 1.06;
  const point = (x, y) => `${52 + (x / maxWealth) * 510},${228 - (y / maxFuture) * 186}`;
  const baseLine = `${point(0, inputs.incomeFuture + inputs.incomeToday * (1 + rate))} ${point(baseWealth, 0)}`;
  const projectLine = `${point(0, currentIncomeFuture + currentIncomeToday * (1 + rate))} ${point(currentWealth, 0)}`;
  const chosen = point(inputs.consumptionToday, consumptionFuture);

  return <section className="simulator-layout">
    <div className="control-panel">
      <p className="lead-copy">El presupuesto no crea recursos: cambia cuándo puedes consumirlos. Activa el proyecto para ver su VAN desplazar la recta.</p>
      <RangeControl id={`${uid}-y0`} label="Ingreso Y₀" value={inputs.incomeToday} min={800_000} max={2_000_000} step={50_000} onChange={(value) => setInputs((current) => ({ ...current, incomeToday: value }))} format={money.format} />
      <RangeControl id={`${uid}-y1`} label="Ingreso Y₁" value={inputs.incomeFuture} min={1_200_000} max={2_500_000} step={50_000} onChange={(value) => setInputs((current) => ({ ...current, incomeFuture: value }))} format={money.format} />
      <RangeControl id={`${uid}-rate`} label="Tasa r" value={inputs.rate} min={0} max={20} step={1} onChange={(value) => setInputs((current) => ({ ...current, rate: value }))} format={(value) => `${value}%`} />
      <RangeControl id={`${uid}-c0`} label="Consumo C₀" value={inputs.consumptionToday} min={600_000} max={1_750_000} step={50_000} onChange={(value) => setInputs((current) => ({ ...current, consumptionToday: value }))} format={money.format} />
      <button className={`project-toggle ${withProject ? 'is-active' : ''}`} type="button" aria-pressed={withProject} onClick={() => setWithProject((value) => !value)}>
        <span>Proyecto −{money.format(400_000)} / +{money.format(520_000)}</span><strong>{withProject ? 'Incluido' : 'Probar proyecto'}</strong>
      </button>
    </div>
    <div className="simulator-output">
      <div className="metric-grid">
        <Metric label="Riqueza presente" value={money.format(currentWealth)} tone="accent" />
        <Metric label={saving >= 0 ? 'Ahorro' : 'Préstamo'} value={money.format(Math.abs(saving))} />
        <Metric label="Consumo C₁" value={money.format(consumptionFuture)} />
        <Metric label="VAN del proyecto" value={money.format(projectNpv)} tone={projectNpv > 0 ? 'accent' : undefined} />
      </div>
      <p className="decision" role="status">{withProject ? `El proyecto ${projectNpv > 0 ? 'aumenta' : 'reduce'} la riqueza presente en ${money.format(Math.abs(projectNpv))}.` : 'Activa el proyecto para comparar ambas restricciones.'}</p>
      <svg className="chart" viewBox="0 0 610 270" role="img" aria-labelledby={`${uid}-title ${uid}-desc`}>
        <title id={`${uid}-title`}>Restricción presupuestaria de dos períodos</title>
        <desc id={`${uid}-desc`}>Recta base y, al activar el proyecto, nueva recta presupuestaria con el punto de consumo elegido.</desc>
        <line x1="52" y1="228" x2="570" y2="228" /><line x1="52" y1="228" x2="52" y2="34" />
        <polyline className="chart__line chart__line--muted" points={baseLine} />
        {withProject && <polyline className="chart__line" points={projectLine} />}
        <g transform={`translate(${chosen.split(',')[0]},${chosen.split(',')[1]})`}><circle r="6" /><text x="9" y="-9">Tu consumo</text></g>
        <text className="chart__axis-label" x="540" y="252">C₀</text><text className="chart__axis-label" x="18" y="30">C₁</text>
      </svg>
      <Formula label="Riqueza presente">W₀ = Y₀ + Y₁/(1+r)</Formula>
    </div>
  </section>;
}

export function PortfolioExplorer() {
  const uid = useId();
  const [firstWeightPercent, setFirstWeightPercent] = useState(70);
  const [correlation, setCorrelation] = useState(0.2);
  const firstWeight = firstWeightPercent / 100;
  const weights = [firstWeight, 1 - firstWeight];
  const returns = [0.15, 0.25];
  const deviations = [0.1, 0.14];
  const riskFreeRate = 0.06;
  const returnRate = portfolioReturn(weights, returns);
  const deviation = Math.sqrt(portfolioVariance(weights, deviations, [[1, correlation], [correlation, 1]]));
  const sharpe = deviation === 0 ? Infinity : sharpeRatio(returnRate, riskFreeRate, deviation);
  const minimumRisk = Math.max(0, Math.min(1, minimumVarianceWeight(deviations[0], deviations[1], correlation)));
  const maximumSharpe = useMemo(() => maximumSharpeWeight({ firstReturn: returns[0], secondReturn: returns[1], riskFreeRate, firstDeviation: deviations[0], secondDeviation: deviations[1], correlation }), [correlation]);
  const curve = Array.from({ length: 41 }, (_, index) => {
    const weight = index / 40;
    const r = portfolioReturn([weight, 1 - weight], returns);
    const sigma = Math.sqrt(portfolioVariance([weight, 1 - weight], deviations, [[1, correlation], [correlation, 1]]));
    const x = 48 + (sigma / 0.16) * 510;
    const y = 226 - ((r - 0.13) / 0.14) * 182;
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  }).join(' ');
  const chartPoint = (weight) => {
    const r = portfolioReturn([weight, 1 - weight], returns);
    const sigma = Math.sqrt(portfolioVariance([weight, 1 - weight], deviations, [[1, correlation], [correlation, 1]]));
    return { x: 48 + (sigma / 0.16) * 510, y: 226 - ((r - 0.13) / 0.14) * 182 };
  };
  const selectedPoint = chartPoint(firstWeight);
  const minimumPoint = chartPoint(minimumRisk);
  const sharpePoint = chartPoint(maximumSharpe);

  return <section className="simulator-layout">
    <div className="control-panel">
      <p className="lead-copy">X1 ofrece 15% con σ 10%; X2 ofrece 25% con σ 14%. Cambia la mezcla y la correlación para ver qué objetivo estás optimizando.</p>
      <RangeControl id={`${uid}-weight`} label="Peso en X1" value={firstWeightPercent} min={0} max={100} step={1} onChange={setFirstWeightPercent} format={(value) => `${value}%`} />
      <RangeControl id={`${uid}-rho`} label="Correlación ρ" value={correlation} min={-1} max={1} step={0.1} onChange={setCorrelation} format={(value) => decimal.format(value)} />
      <div className="reference-list">
        <p><span>Mínima varianza</span><strong>{percent.format(minimumRisk)} en X1</strong></p>
        <p><span>Máximo Sharpe</span><strong>{percent.format(maximumSharpe)} en X1</strong></p>
      </div>
      <Formula label="Varianza de dos activos">σₚ² = w₁²σ₁² + w₂²σ₂² + 2w₁w₂ρσ₁σ₂</Formula>
    </div>
    <div className="simulator-output">
      <div className="metric-grid">
        <Metric label="Retorno esperado" value={percent.format(returnRate)} />
        <Metric label="Riesgo σₚ" value={percent.format(deviation)} />
        <Metric label="Sharpe" value={Number.isFinite(sharpe) ? decimal.format(sharpe) : '∞'} tone="accent" />
        <Metric label="Peso X2" value={percent.format(1 - firstWeight)} />
      </div>
      <p className="decision" role="status"><strong>{proximityLabel(firstWeight, minimumRisk, maximumSharpe)}</strong> Las referencias cambian con ρ.</p>
      <svg className="chart" viewBox="0 0 610 270" role="img" aria-labelledby={`${uid}-title ${uid}-desc`}>
        <title id={`${uid}-title`}>Curva riesgo retorno del portafolio</title>
        <desc id={`${uid}-desc`}>Combinaciones de X1 y X2 con marcadores para la selección, mínima varianza y máximo Sharpe.</desc>
        <line x1="48" y1="226" x2="570" y2="226" /><line x1="48" y1="226" x2="48" y2="34" />
        <polyline className="chart__line" points={curve} />
        <g className="chart__reference" transform={`translate(${minimumPoint.x},${minimumPoint.y})`}><circle r="5" /><text x="8" y="14">MV</text></g>
        <g className="chart__reference chart__reference--pink" transform={`translate(${sharpePoint.x},${sharpePoint.y})`}><circle r="5" /><text x="8" y="-8">MS</text></g>
        <g transform={`translate(${selectedPoint.x},${selectedPoint.y})`}><circle r="7" /><text x="10" y="-10">Tu mezcla</text></g>
        <text className="chart__axis-label" x="530" y="250">Riesgo σ</text><text className="chart__axis-label" x="7" y="30">Retorno</text>
      </svg>
    </div>
  </section>;
}

export function ModuleSimulator({ moduleId }) {
  if (moduleId === 'riesgo') return <RiskSimulator />;
  if (moduleId === 'dos-periodos') return <TwoPeriodSimulator />;
  return <PortfolioExplorer />;
}
