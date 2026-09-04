import { useState } from 'react';
import { Icon } from './Icon.jsx';

export function SolutionStepper({ steps, takeaway, onComplete }) {
  const [visibleSteps, setVisibleSteps] = useState(0);
  const complete = visibleSteps === steps.length;

  function revealNext() {
    setVisibleSteps((count) => {
      const next = Math.min(steps.length, count + 1);
      if (next === steps.length) onComplete();
      return next;
    });
  }

  return <div className="solution-panel">
    <div className="solution-panel__header">
      <h2>Solución progresiva</h2>
      <span>{visibleSteps}/{steps.length} pasos</span>
    </div>
    {visibleSteps === 0 && <p className="solution-empty">Haz el intento en papel. Cuando estés listo, revela el primer paso.</p>}
    <ol className="solution-steps">
      {steps.slice(0, visibleSteps).map((step, index) => <li key={step}><span>{index + 1}</span><p>{step}</p></li>)}
    </ol>
    {complete && <div className="takeaway" role="status"><strong>Idea para llevar</strong><p>{takeaway}</p></div>}
    <div className="activity-actions">
      <button className="button" type="button" disabled={complete} onClick={revealNext}>Ver siguiente paso <Icon name="right" /></button>
      <button className="button button--secondary" type="button" disabled={visibleSteps === 0} onClick={() => setVisibleSteps(0)}><Icon name="reset" /> Reiniciar</button>
    </div>
  </div>;
}
