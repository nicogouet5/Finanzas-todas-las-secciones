# Hub de Finanzas — intro ASCII y movimiento

## Objetivo

Actualizar la portada del Hub de Finanzas con el logo blanco UDD aprobado, una intro dinámica de 5–6 segundos y señales visuales de navegación sin perjudicar el acceso al contenido académico.

## Alcance aprobado

- Sustituir el wordmark `UDD` por el logo blanco adjuntado por Nicolás, preservando texto alternativo accesible.
- Mostrar una intro de 5.5 segundos al entrar a `/`, inspirada en el efecto Sunset de 21st.dev y renderizada localmente con Canvas2D.
- Usar foto de referencia `ref-046.webp`, una cuadrícula de puntos, acento naranja/rojo, contraste 115, tint `#ff3b1f` al 32%, viñeta y bloom.
- Animación tipo pulso con intensidad 60 y velocidad 100, sin librería de animación.
- Incluir un botón visible para saltar la intro; ocultarla al terminar y recordar la elección solo durante la pestaña actual.
- Omitir la animación para `prefers-reduced-motion: reduce` y mostrar inmediatamente el contenido.
- Añadir iconos SVG de carpeta/documento a tarjetas de ramos, carpetas y materiales; no usar emoji ni dependencia nueva.
- Mantener la variante Matrix preparada en renderer, sin convertirla en efecto persistente de lectura.

## Arquitectura

- `AsciiIntro` será Client Component aislado, montado únicamente en portada.
- Carga la imagen empaquetada localmente y dibuja Canvas de baja resolución, escalado por CSS; no bloquea el primer contenido ni carga dependencias externas en runtime.
- El renderer calcula color/luminancia por celda y dibuja puntos. Efectos de viñeta/bloom se componen en el mismo canvas; `requestAnimationFrame` anima el pulso y cancela al desmontar.
- La fase de introducción usa una capa `fixed` con prioridad visual, botón de omisión con foco y transición corta de salida.
- Logo se guarda como `public/udd-logo-white.png`; la fuente será el archivo adjuntado por usuario o un recurso UDD verificable equivalente.

## Comportamiento

- Primera visita de pestaña: intro activa por 5.5 s.
- `sessionStorage` marcado al completar o saltar: futuras navegaciones de esa pestaña no repiten intro.
- `prefers-reduced-motion`: no monta canvas/animación y no escribe el marcador.
- Si la foto no carga, el canvas usa degradado de burdeos/negro y conserva intro funcional.
- Navegación, teclado, enlace de salto y panel admin permanecen disponibles fuera de la capa de intro.

## Seguridad y accesibilidad

- Imagen local y canvas decorativo con `aria-hidden`; no transmite datos a terceros.
- Botón "Saltar intro" tiene foco visible, etiqueta explícita y área táctil mínima de 44 px.
- Canvas limita resolución por `devicePixelRatio` para evitar carga excesiva en móvil.
- No se inserta HTML externo ni se ejecuta código de 21st.dev.

## Verificación

- Test de determinación de luminancia/cobertura y duración de intro.
- Build de producción correcto.
- Inspección móvil 390 px y escritorio 1440 px: canvas sin overflow, foco de salto, logo legible e iconos alineados.
- Prueba real: intro termina o se salta, ruta `/` queda interactiva, segunda navegación de la misma pestaña no repite y reduced-motion no anima.
- Despliegue `READY`, portada HTTP 200 y revisión visual en URL pública.

## Fuera de alcance

- Editor de efectos de 21st.dev.
- Implementación de todos los modos de renderizado del demo.
- Efecto Matrix permanente en cada página.
