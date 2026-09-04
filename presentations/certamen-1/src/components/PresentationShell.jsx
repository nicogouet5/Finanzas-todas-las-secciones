import { useEffect } from 'react';
import { Icon } from './Icon.jsx';

function focusIsInControl(target) {
  return target instanceof Element && Boolean(target.closest('button, a, input, select, textarea, [contenteditable="true"], [role="button"], [role="slider"]'));
}

export function PresentationShell({ module, screens, currentIndex, completed, globalPosition, globalTotal, onGoHome, onOpenFormula, onReset, onGoTo, onMove, children }) {
  const current = screens[currentIndex];

  useEffect(() => {
    const onKeyDown = (event) => {
      if (focusIsInControl(event.target)) return;
      if (event.key === 'ArrowLeft' || event.key === 'PageUp') {
        event.preventDefault();
        onMove(-1);
      }
      if (event.key === 'ArrowRight' || event.key === 'PageDown') {
        event.preventDefault();
        onMove(1);
      }
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [onMove]);

  return <div className="presentation-shell">
    <header className="presentation-bar">
      <button className="icon-action" type="button" onClick={onGoHome}><Icon name="home" /><span>Índice</span></button>
      <div className="presentation-bar__center">
        <span className="terminal-kicker">{module.title}</span>
        <span className="global-counter">{String(globalPosition).padStart(2, '0')} / {String(globalTotal).padStart(2, '0')}</span>
      </div>
      <div className="presentation-bar__actions">
        <button className="icon-action" type="button" onClick={onOpenFormula}><Icon name="formula" /><span>Formulario</span></button>
        <button className="icon-action icon-action--compact" type="button" onClick={onReset} aria-label="Reiniciar progreso"><Icon name="reset" /></button>
      </div>
    </header>

    <nav className="slide-dots" aria-label="Pantallas del módulo">
      {screens.map((screen, index) => <button
        key={screen.id}
        type="button"
        className={`${index === currentIndex ? 'is-active ' : ''}${completed.has(`${module.id}:${screen.id}`) ? 'is-complete' : ''}`.trim()}
        aria-label={`Ir a ${screen.title}, pantalla ${index + 1}`}
        aria-current={index === currentIndex ? 'step' : undefined}
        onClick={() => onGoTo(index)}
      ><span>{index + 1}</span></button>)}
    </nav>

    <main className="slide-stage" id="main-content">
      <header className="slide-heading">
        <p className="terminal-kicker">{current.kind.toUpperCase()} / {String(currentIndex + 1).padStart(2, '0')}</p>
        <h1>{current.title}</h1>
      </header>
      <div className="slide-content" key={`${module.id}:${current.id}`}>{children}</div>
    </main>

    <footer className="slide-controls">
      <button className="button button--secondary" type="button" disabled={currentIndex === 0} onClick={() => onMove(-1)}><Icon name="left" /> Anterior</button>
      <span>{currentIndex + 1} de {screens.length}</span>
      <button className="button" type="button" disabled={currentIndex === screens.length - 1} onClick={() => onMove(1)}>Siguiente <Icon name="right" /></button>
    </footer>

    <p className="sr-only" aria-live="polite" aria-atomic="true">Pantalla {currentIndex + 1} de {screens.length}: {current.title}</p>
  </div>;
}
