import { sourceMetadata } from '../content.js';
import { Icon } from './Icon.jsx';

const moduleIcons = { riesgo: 'shield', 'dos-periodos': 'clock', portafolio: 'chart' };
const moduleLabels = { riesgo: 'UTILIDAD', 'dos-periodos': 'TIEMPO', portafolio: 'RIESGO + RETORNO' };

export function HomeIndex({ modules, screensByModule, completed, onOpenModule, onOpenFormula, onReset }) {
  const total = screensByModule.reduce((sum, screens) => sum + screens.length, 0);
  const completedTotal = [...completed].filter((key) => key.includes(':')).length;

  return <main className="study-home">
    <header className="study-hero">
      <div>
        <p className="terminal-kicker">UDD / FINANZAS CORPORATIVAS</p>
        <h1>Repaso<br /><span>Certamen 1</span></h1>
        <p className="study-lede">Tres rutas para convertir fórmulas en decisiones: riesgo, consumo entre períodos y portafolios.</p>
      </div>
      <div className="hero-status" aria-label={`${completedTotal} de ${total} pantallas visitadas`}>
        <span className="hero-status__value">{String(completedTotal).padStart(2, '0')}</span>
        <span className="hero-status__label">/ {String(total).padStart(2, '0')} vistas</span>
      </div>
    </header>

    <section className="how-to" aria-labelledby="how-to-title">
      <span className="how-to__number">01</span>
      <div>
        <h2 id="how-to-title">Cómo usar esta ayudantía</h2>
        <p>Elige cualquier módulo. Avanza con los botones o con las flechas del teclado, prueba antes de revelar y vuelve al índice cuando quieras.</p>
      </div>
      <button className="button button--secondary" type="button" onClick={onOpenFormula}><Icon name="formula" /> Ver formulario</button>
    </section>

    <section className="module-grid grid gap-4 lg:grid-cols-3" aria-label="Módulos de estudio">
      {modules.map((module, index) => {
        const screens = screensByModule[index];
        const done = screens.filter((screen) => completed.has(`${module.id}:${screen.id}`)).length;
        const percent = Math.round((done / screens.length) * 100);
        return <button className="module-card" type="button" key={module.id} onClick={() => onOpenModule(index)}>
          <span className="module-card__topline">
            <span className="module-card__icon"><Icon name={moduleIcons[module.id]} size={24} /></span>
            <span className="module-card__index">0{index + 1}</span>
          </span>
          <span className="terminal-kicker">{moduleLabels[module.id]}</span>
          <strong>{module.title}</strong>
          <span className="module-card__summary">{module.summary}</span>
          <span className="module-card__progress">
            <span><span style={{ width: `${percent}%` }} /></span>
            <small>{done}/{screens.length} vistas</small>
          </span>
          <span className="module-card__cta">Abrir módulo <Icon name="right" /></span>
        </button>;
      })}
    </section>

    <footer className="study-home__footer">
      <p><strong>Fuentes académicas:</strong> {sourceMetadata.sources.join(' · ')}.</p>
      <p>{sourceMetadata.note}</p>
      <button className="text-action" type="button" onClick={onReset}><Icon name="reset" /> Reiniciar progreso de la sesión</button>
    </footer>
  </main>;
}
