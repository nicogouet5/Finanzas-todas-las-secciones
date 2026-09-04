import { useCallback, useEffect, useMemo, useState } from 'react';
import { studyModules } from './content.js';
import { buildModuleScreens, clampSlideIndex } from './experience.js';
import { FormulaSheet } from './components/FormulaSheet.jsx';
import { HomeIndex } from './components/HomeIndex.jsx';
import { CommentActivity, ExerciseActivity, RecapScreen, TheoryScreen } from './components/LearningScreens.jsx';
import { PresentationShell } from './components/PresentationShell.jsx';
import { ModuleSimulator } from './components/Simulators.jsx';

function Screen({ module, screen, onComplete, onGoHome }) {
  if (screen.kind === 'theory') {
    return <TheoryScreen moduleId={module.id} screenId={screen.id} slide={screen.data} />;
  }
  if (screen.kind === 'simulator') return <ModuleSimulator moduleId={module.id} />;
  if (screen.kind === 'comments') return <CommentActivity comments={screen.data} onComplete={onComplete} />;
  if (screen.kind === 'exercise') return <ExerciseActivity exercise={screen.data} onComplete={onComplete} />;
  return <RecapScreen recap={screen.data} onGoHome={onGoHome} />;
}

export default function App() {
  const screensByModule = useMemo(() => studyModules.map(buildModuleScreens), []);
  const globalTotal = screensByModule.reduce((total, screens) => total + screens.length, 0);
  const [view, setView] = useState('home');
  const [formulaReturn, setFormulaReturn] = useState('home');
  const [activeModuleIndex, setActiveModuleIndex] = useState(0);
  const [slideIndex, setSlideIndex] = useState(0);
  const [completed, setCompleted] = useState(() => new Set());
  const [resetVersion, setResetVersion] = useState(0);

  const module = studyModules[activeModuleIndex];
  const screens = screensByModule[activeModuleIndex];
  const current = screens[slideIndex];

  const markComplete = useCallback((moduleId, screenId) => {
    setCompleted((previous) => {
      const key = `${moduleId}:${screenId}`;
      if (previous.has(key)) return previous;
      const next = new Set(previous);
      next.add(key);
      return next;
    });
  }, []);

  useEffect(() => {
    if (view === 'module') markComplete(module.id, current.id);
  }, [current.id, markComplete, module.id, view]);

  const move = useCallback((delta) => {
    setSlideIndex((index) => clampSlideIndex(index, delta, screens.length));
  }, [screens.length]);

  function openModule(index) {
    setActiveModuleIndex(index);
    setSlideIndex(0);
    setView('module');
  }

  function openFormula() {
    setFormulaReturn(view);
    setView('formulas');
  }

  function resetSession() {
    setCompleted(new Set());
    setResetVersion((version) => version + 1);
  }

  if (view === 'home') {
    return <HomeIndex
      modules={studyModules}
      screensByModule={screensByModule}
      completed={completed}
      onOpenModule={openModule}
      onOpenFormula={openFormula}
      onReset={resetSession}
    />;
  }

  if (view === 'formulas') {
    return <FormulaSheet onClose={() => setView(formulaReturn)} />;
  }

  const priorScreens = screensByModule.slice(0, activeModuleIndex).reduce((total, list) => total + list.length, 0);

  return <PresentationShell
    module={module}
    screens={screens}
    currentIndex={slideIndex}
    completed={completed}
    globalPosition={priorScreens + slideIndex + 1}
    globalTotal={globalTotal}
    onGoHome={() => setView('home')}
    onOpenFormula={openFormula}
    onReset={resetSession}
    onGoTo={setSlideIndex}
    onMove={move}
  >
    <div key={`${module.id}:${current.id}:${resetVersion}`}>
      <Screen
        module={module}
        screen={current}
        onComplete={() => markComplete(module.id, current.id)}
        onGoHome={() => setView('home')}
      />
    </div>
  </PresentationShell>;
}
