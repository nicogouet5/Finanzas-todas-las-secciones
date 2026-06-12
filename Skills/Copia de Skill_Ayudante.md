---
name: guia-finanzas
description: >
  Skill para crear guías de ejercicios tipo certamen para ayudantías de Finanzas (curso UDD, profesor Francisco Labarca). Úsala SIEMPRE que Nico pida crear, preparar, generar o armar una guía de ejercicios, guía de certamen, guía de ayudantía, material de repaso, o preguntas de práctica para el curso de finanzas. También activar cuando el usuario mencione "comentes", "ejercicios de bonos", "razones financieras", "análisis financiero", "valor del dinero", "renta fija", "planificación financiera", "certamen 1", "certamen 2", o cualquier unidad del syllabus del curso. No esperes que se diga explícitamente "usa la skill" — si hay una guía de finanzas involucrada, usa esta skill.
---

# Skill: Guías de Ejercicios — Finanzas UDD

## Propósito

Generar guías de ejercicios tipo certamen para las ayudantías de Finanzas de Nico. Cada guía debe tener el formato establecido por el curso y cubrir los contenidos del syllabus que se indiquen.

## Paso 1 — Leer los archivos de referencia

Antes de generar cualquier guía, lee AMBOS archivos:

```
/mnt/skills/user/guia-finanzas/references/syllabus.md   → contenidos por unidad y semana
/mnt/skills/user/guia-finanzas/references/formato.md    → estructura, secciones y criterios de calidad
```

Esto es obligatorio. No generes nada sin haber leído ambos.

## Paso 2 — Entender el pedido

Si el usuario no especifica qué temas cubrir, pregunta:
- ¿Para qué certamen o control es la guía? (Certamen 1, Certamen 2, Control 1, etc.)
- ¿Qué unidades o temas específicos incluir?
- ¿Cuántos ejercicios aproximadamente?
- ¿Hay algún énfasis en particular (ej. "más ejercicios de bonos", "énfasis en DuPont")?

Si el usuario ya da suficiente contexto, procede directamente.

## Paso 3 — Planificar la guía

Antes de generar, define mentalmente:
1. **Comentes (Sección 1):** 3–5 afirmaciones. Incluye al menos:
   - 1 afirmación con palabra absoluta ("siempre", "nunca") que sea falsa
   - 1 comparación entre sectores/industrias
   - 1 con sub-ítems A/B/C para explorar múltiples dimensiones
2. **Ejercicios (Sección 2):** 2–3 ejercicios. Incluye al menos:
   - 1 ejercicio con tabla a completar (ratios financieros O tabla de amortización)
   - 1 ejercicio de interpretación/análisis cualitativo
   - 1 ejercicio didáctico si el tiempo lo permite

## Paso 4 — Generar el documento Word (.docx)

Usa la skill de DOCX para crear el archivo. Lee `/mnt/skills/public/docx/SKILL.md` para los detalles técnicos.

### Estructura del documento Word

```
[Encabezado]
Guía preparación Certamen N
Profesor Francisco Labarca Trucios
Ayudante Nicolas Inostrosa Basualto

[Sección 1: Comentes]
1. [Afirmación provocadora...]
2. [Afirmación...]
   ...

[Sección 2: Ejercicios]
[Contexto narrativo empresa ficticia]

Ejercicio 1: [Título]
[Tabla con datos]
Se pide:
A) ...
B) ...
...

Ejercicio 2: [Título]
...
```

### Nombre del archivo de salida

Usar formato: `Guia_Ayudantia_[Tema]_Finanzas.docx`
Ejemplo: `Guia_Ayudantia_Renta_Fija_Finanzas.docx`

Guardar en `/mnt/user-data/outputs/`

## Paso 5 — Verificar la guía

Antes de entregar, revisa mentalmente:
- [ ] ¿Los números en las tablas cuadran matemáticamente?
- [ ] ¿Los comentes tienen una trampa conceptual real (no son trivialmente falsos)?
- [ ] ¿El contexto de la empresa ficticia es coherente a lo largo del ejercicio?
- [ ] ¿Las preguntas están claramente formuladas y se sabe qué se espera?
- [ ] ¿Todos los temas corresponden al syllabus pedido?

## Reglas de contenido por unidad

### Unidad 1 — Gestión Financiera / Matemáticas Financieras
- Ejercicios de VPN, VF, tasas equivalentes, anualidades, perpetuidades, gradientes
- Comentes sobre el rol del administrador financiero, separación propiedad-administración
- Ejercicios de conversión de tasas (nominal → efectiva, distintas temporalidades)

### Unidad 2 — Renta Fija
- Tablas de amortización (bono bullet, bono francés, cero cupón)
- Cálculo de Duración de Macaulay y Duración Modificada
- Comentes sobre relación precio-tasa, riesgo de interés, tipos de bonos
- Preguntas sobre curva de rendimiento y estructura temporal de tasas

### Unidad 3 — Análisis Financiero
- Tablas de ratios (liquidez, solvencia, eficiencia, rentabilidad)
- Análisis DuPont y descomposición del ROE
- Análisis vertical y horizontal
- Comentes sobre benchmarks de industria, interpretación de ratios
- Ejercicios de apalancamiento operacional y financiero

### Unidad 4 — Planificación Financiera
- Presupuesto de caja con proyección de flujos
- Fuentes de financiamiento y administración de capital de trabajo
- Modelo de crecimiento sustentable de Higgins
- Ejercicios de política de crédito e inventario

## Criterios de calidad irrompibles

1. **Los comentes deben ser intelectualmente honestos:** ni demasiado obvios ni imposibles de analizar
2. **Las tablas deben tener datos consistentes:** los cálculos deben dar los números correctos
3. **Empresas ficticias creíbles:** nombres plausibles, sectores reales (retail, tecnología, utilities, minería, banca en contexto chileno/latinoamericano)
4. **Gradualidad:** de conceptual a cuantitativo a interpretativo dentro de cada sección
5. **Siempre incluir "Se pide:"** antes de las instrucciones de cada ejercicio

## Referencia rápida de fórmulas clave

### Valor del dinero en el tiempo
- `VF = VP × (1 + r)^n`
- `VP = VF / (1 + r)^n`
- Anualidad VP: `VP = C × [1 - (1+r)^-n] / r`
- Perpetuidad: `VP = C / r`
- Perpetuidad con crecimiento: `VP = C / (r - g)`

### Bonos
- Precio bono: `P = Σ [Cupón/(1+YTM)^t] + [VN/(1+YTM)^n]`
- Duración Macaulay: `D = Σ [t × VP(FC_t)] / Precio`
- Duración Modificada: `D_mod = D_Macaulay / (1 + YTM)`
- Variación precio: `ΔP/P ≈ -D_mod × ΔYTM`

### Ratios financieros
- Razón Corriente: AC / PC
- Deuda/Patrimonio: Pasivo Total / Patrimonio
- Rotación Activos: Ventas / Activos Totales
- Margen Neto: Utilidad Neta / Ventas
- ROE: Utilidad Neta / Patrimonio
- ROA: Utilidad Neta / Activos Totales
- DuPont: ROE = Margen Neto × Rotación Activos × Multiplicador Apalancamiento

### Planificación
- Tasa crecimiento sustentable: `g* = ROE × b` (donde b = tasa de retención)
- Punto de equilibrio: `Q = CF / (PV - CVu)`
