import assert from 'node:assert/strict';
import test from 'node:test';
import { sourceMetadata, studyModules } from './content.js';

test('declara exactamente los tres módulos de estudio completos', () => {
  assert.deepEqual(studyModules.map(({ id }) => id), ['riesgo', 'dos-periodos', 'portafolio']);

  for (const module of studyModules) {
    assert.ok(module.title && module.summary && module.recap);
    assert.ok(module.theorySlides.length > 0);
    assert.equal(module.comments.length, 3);
    assert.equal(module.exercises.length, 2);
    for (const comment of module.comments) {
      assert.ok(comment.id && comment.statement && comment.justification && comment.memoryHook);
      assert.ok(['verdadero', 'falso', 'incierto'].includes(comment.verdict));
    }
    for (const exercise of module.exercises) {
      assert.ok(exercise.id && exercise.title && exercise.context && exercise.takeaway);
      assert.ok(exercise.requests.length > 0 && exercise.steps.length > 0);
    }
  }
});

test('incluye comentarios y resultados obligatorios del módulo de riesgo', () => {
  const risk = studyModules[0];
  assert.deepEqual(risk.comments.map(({ verdict }) => verdict), ['falso', 'falso', 'verdadero']);
  const text = JSON.stringify(risk);
  for (const required of ['90,000', '25,000', '20%', '11.3425', '84,328.95', '5,000', '5,671.05', '5,400', '100', '60', '140', 'sqrt(W)', 'W^2']) {
    assert.ok(text.includes(required), `Falta ${required}`);
  }
});

test('incluye comentarios y resultados obligatorios del módulo dos períodos', () => {
  const module = studyModules[1];
  assert.deepEqual(module.comments.map(({ verdict }) => verdict), ['incierto', 'verdadero', 'falso']);
  const text = JSON.stringify(module);
  for (const required of ['1,200,000', '1,800,000', '10%', '2,836,363.64', '1,500,000', '300,000', '330,000', '1,470,000', '400,000', '520,000', '72,727.27', '2,909,090.91']) {
    assert.ok(text.includes(required), `Falta ${required}`);
  }
});

test('incluye el caso, decisiones y resultados obligatorios del módulo de portafolio', () => {
  const portfolio = studyModules[2];
  assert.deepEqual(portfolio.comments.map(({ verdict }) => verdict), ['falso', 'falso', 'verdadero']);
  const text = JSON.stringify(portfolio);
  for (const required of ['Poroto', 'Lenteja', 'Garbanzo', '.597254', '.402746', '.131945', '.004982334', '.070585651', '.441160', '.001245584', '.003736751', '.035293', '.061129', 'no deben sumarse', '25%', '75%', '327,059', '.7', '.5625', '1.2', '.142857', '.142222', '.091667', '.117', '.101875', '.172', 'X1', 'X2', '70%/30%', '40%/60%']) {
    assert.ok(text.includes(required), `Falta ${required}`);
  }
});

test('representa A/B/C como clasificaciones individuales, no como una afirmación mixta', () => {
  const abc = studyModules[2].comments.find(({ id }) => id === 'abc-capm');
  assert.equal(abc.statement, 'La clasificación correcta es A=verdadero, B=falso y C=verdadero.');
  assert.deepEqual(abc.subitems.map(({ verdict }) => verdict), ['verdadero', 'falso', 'verdadero']);
  assert.deepEqual(abc.subitems.map(({ id }) => id), ['a-correlacion', 'b-beta', 'c-capm']);
});

test('declara las fuentes y el origen didáctico de los ejercicios', () => {
  const text = JSON.stringify(sourceMetadata);
  for (const source of ['Formulario Certamen 1.docx', 'Ayudantía 3 Finanzas Corporativas.docx', 'Pauta 3.xlsx', 'didácticos', 'formula sheet']) {
    assert.ok(text.toLowerCase().includes(source.toLowerCase()), `Falta ${source}`);
  }
});
