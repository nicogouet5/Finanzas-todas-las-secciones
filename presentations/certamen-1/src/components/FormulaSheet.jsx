import { Formula } from './Formula.jsx';
import { Icon } from './Icon.jsx';
import { CERTAINTY_EQUIVALENT_FORMULA } from '../experience.js';

const groups = [
  {
    title: 'Riesgo y utilidad',
    formulas: [
      ['E(X) = Σ pᵢxᵢ', 'pᵢ: probabilidad; xᵢ: resultado monetario.'],
      ['E[U(W)] = Σ pᵢU(Wᵢ)', 'Wᵢ: riqueza en cada estado; U: función de utilidad.'],
      [CERTAINTY_EQUIVALENT_FORMULA, 'CE: equivalente cierto bajo utilidad logarítmica.'],
      ['πjusta = pL  ·  πmáx = W₀ − CE', 'L: pérdida; π: prima de seguro.'],
    ],
  },
  {
    title: 'Dos períodos',
    formulas: [
      ['W₀ = Y₀ + Y₁/(1+r)', 'Y₀, Y₁: ingresos; r: tasa; W₀: riqueza presente.'],
      ['C₁ = Y₁ + (Y₀−C₀)(1+r)', 'C₀, C₁: consumo presente y futuro.'],
      ['VAN = F₁/(1+r) − I₀', 'I₀: inversión inicial; F₁: flujo futuro.'],
    ],
  },
  {
    title: 'Portafolios y desempeño',
    formulas: [
      ['E(Rₚ) = Σ wᵢE(Rᵢ)', 'wᵢ: peso; Rᵢ: retorno del activo.'],
      ['σₚ² = ΣᵢΣⱼ wᵢwⱼσᵢσⱼρᵢⱼ', 'σ: volatilidad; ρ: correlación.'],
      ['w₁,MV = (σ₂²−ρσ₁σ₂)/(σ₁²+σ₂²−2ρσ₁σ₂)', 'w₁,MV: peso de mínima varianza en el activo 1.'],
      ['βᵢ = ρᵢₘσᵢ/σₘ', 'β: riesgo sistemático relativo al mercado.'],
      ['CAPM = rƒ + β[E(Rₘ)−rƒ]', 'rƒ: tasa libre de riesgo; Rₘ: retorno de mercado.'],
      ['Sharpe = [E(Rₚ)−rƒ]/σₚ  ·  Treynor = [E(Rₚ)−rƒ]/βₚ', 'Sharpe usa riesgo total; Treynor, riesgo sistemático.'],
      ['VaR = V·σ·z·√(d/252)', 'V: posición; z: confianza; d: horizonte en días.'],
      ['σₚ² = βₚ²σₘ² + σ²ε', 'Las varianzas sistemática e idiosincrática se suman.'],
    ],
  },
];

export function FormulaSheet({ onClose }) {
  return <main className="formula-sheet">
    <header className="formula-sheet__header">
      <div>
        <p className="terminal-kicker">FORMULARIO / CERTAMEN 1</p>
        <h1>Una hoja, tres decisiones</h1>
        <p>Ubica primero la pregunta; recién después elige la fórmula.</p>
      </div>
      <button className="button button--secondary" type="button" onClick={onClose}><Icon name="left" /> Volver</button>
    </header>
    <div className="formula-groups">
      {groups.map((group, index) => <section className="formula-group" key={group.title}>
        <header><span>0{index + 1}</span><h2>{group.title}</h2></header>
        <div className="formula-group__list">
          {group.formulas.map(([formula, explanation]) => <div className="formula-entry" key={formula}>
            <Formula label={`Fórmula: ${formula}`}>{formula}</Formula>
            <p>{explanation}</p>
          </div>)}
        </div>
      </section>)}
    </div>
  </main>;
}
