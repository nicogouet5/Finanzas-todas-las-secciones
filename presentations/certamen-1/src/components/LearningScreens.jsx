import { useState } from 'react';
import { areCommentsReady, buildCommentPrompts } from '../experience.js';
import { Formula } from './Formula.jsx';
import { Icon } from './Icon.jsx';
import { SolutionStepper } from './SolutionStepper.jsx';

const theoryFormulas = {
  'riesgo:theory-0': ['E(X) = Σ pᵢ · xᵢ', 'Promedio monetario ponderado por probabilidades.'],
  'riesgo:theory-1': ['E[U(W)] = Σ pᵢ · U(Wᵢ)', 'Bienestar esperado, no pesos esperados.'],
  'riesgo:theory-2': ['πmáx = W₀ − CE', 'Mayor prima compatible con el bienestar sin seguro.'],
  'dos-periodos:theory-0': ['W₀ = Y₀ + Y₁ / (1 + r)', 'Riqueza medida en pesos de hoy.'],
  'dos-periodos:theory-1': ['C₁ = Y₁ + (Y₀ − C₀)(1 + r)', 'El ahorro positivo financia consumo futuro.'],
  'dos-periodos:theory-2': ['VAN = F₁ / (1 + r) − I₀', 'Aceptar si el VAN es positivo.'],
  'portafolio:theory-0': ['σₚ² = ΣᵢΣⱼ wᵢwⱼσᵢσⱼρᵢⱼ', 'La correlación entra en la varianza conjunta.'],
  'portafolio:theory-1': ['E(Rᵢ) = rƒ + βᵢ[E(Rₘ) − rƒ]', 'CAPM remunera riesgo sistemático.'],
  'portafolio:theory-2': ['Sharpe = [E(Rₚ) − rƒ] / σₚ', 'Exceso de retorno por riesgo total.'],
};

export function TheoryScreen({ moduleId, screenId, slide }) {
  const [formula, note] = theoryFormulas[`${moduleId}:${screenId}`];
  return <article className="theory-layout">
    <div className="theory-copy">
      <p className="lead-copy">{slide.body}</p>
      <div className="teaching-note"><strong>Lectura útil</strong><p>{note}</p></div>
    </div>
    <Formula label={`Fórmula central de ${slide.title}`}>{formula}</Formula>
  </article>;
}

const OPTIONS = [
  { value: 'verdadero', label: 'Verdadero' },
  { value: 'falso', label: 'Falso' },
  { value: 'incierto', label: 'Incierto' },
];

function CommentPrompt({ prompt, label, choice, submitted, onChoose }) {
  const correct = choice === prompt.verdict;
  return <div className="comment-prompt" role="group" aria-label={`Clasificar: ${prompt.statement}`}>
    {label && <p className="comment-prompt__statement"><strong>{label}.</strong> {prompt.statement}</p>}
    <div className="choice-row">
      {OPTIONS.map((option) => <label className={choice === option.value ? 'is-selected' : ''} key={option.value}>
        <input
          type="radio"
          name={prompt.id}
          value={option.value}
          checked={choice === option.value}
          disabled={submitted}
          aria-label={`${option.label}: ${prompt.statement}`}
          onChange={() => onChoose(option.value)}
        />
        <span>{option.label}</span>
      </label>)}
    </div>
    {submitted && <div className={`feedback ${correct ? 'feedback--correct' : 'feedback--wrong'}`} role="status">
      <strong>{correct ? 'Correcto' : `Ajusta tu criterio: era ${prompt.verdict}.`}</strong>
      <p>{prompt.justification}</p>
      <p className="memory-hook"><span>Gancho de memoria</span>{prompt.memoryHook}</p>
    </div>}
  </div>;
}

export function CommentActivity({ comments, onComplete }) {
  const [choices, setChoices] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const ready = areCommentsReady(comments, choices);

  function check() {
    if (!ready) return;
    setSubmitted(true);
    onComplete();
  }

  function reset() {
    setChoices({});
    setSubmitted(false);
  }

  return <section className="activity-stack" aria-describedby="comment-instructions">
    <p id="comment-instructions" className="lead-copy">Clasifica cada afirmación de las tres tarjetas. Tu selección no cuenta hasta que presiones <strong>Comprobar</strong>.</p>
    {comments.map((comment, index) => {
      const prompts = buildCommentPrompts(comment);
      return <fieldset className="comment-card" key={comment.id}>
        <legend><span>{String(index + 1).padStart(2, '0')}</span>{comment.statement}</legend>
        <div className={prompts.length > 1 ? 'subitem-prompts' : undefined}>
          {prompts.map((prompt, promptIndex) => <CommentPrompt
            key={prompt.id}
            prompt={prompt}
            label={prompts.length > 1 ? String.fromCharCode(65 + promptIndex) : undefined}
            choice={choices[prompt.id]}
            submitted={submitted}
            onChoose={(value) => setChoices((current) => ({ ...current, [prompt.id]: value }))}
          />)}
        </div>
      </fieldset>;
    })}
    <div className="activity-actions">
      <button className="button" type="button" disabled={!ready || submitted} onClick={check}>Comprobar</button>
      <button className="button button--secondary" type="button" disabled={!Object.keys(choices).length} onClick={reset}><Icon name="reset" /> Reintentar</button>
    </div>
  </section>;
}

export function ExerciseActivity({ exercise, onComplete }) {
  return <section className="exercise-layout">
    <div className="exercise-brief">
      <p className="lead-copy">{exercise.context}</p>
      <h2>Se pide:</h2>
      <ol>{exercise.requests.map((request) => <li key={request}>{request}</li>)}</ol>
    </div>
    <SolutionStepper steps={exercise.steps} takeaway={exercise.takeaway} onComplete={onComplete} />
  </section>;
}

export function RecapScreen({ recap, onGoHome }) {
  return <article className="recap-card">
    <span className="recap-card__mark">// FIN</span>
    <p>{recap}</p>
    <button className="button" type="button" onClick={onGoHome}><Icon name="home" /> Elegir otro módulo</button>
  </article>;
}
