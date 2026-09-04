export const sourceMetadata = {
  sources: ['Formulario Certamen 1.docx', 'Ayudantía 3 Finanzas Corporativas.docx', 'Pauta 3.xlsx'],
  note: 'Los ejemplos de riesgo y dos períodos son ejercicios didácticos derivados de la hoja de fórmulas (formula sheet).',
};

export const studyModules = [
  {
    id: 'riesgo',
    title: 'Riesgo: no basta con contar completos',
    summary: 'El valor esperado ordena dinero; la utilidad esperada ordena decisiones cuando una pérdida pesa más que otra ganancia.',
    theorySlides: [
      { title: 'Valor esperado', body: 'Multiplica cada resultado por su probabilidad y suma. Es el promedio monetario de muchos intentos.' },
      { title: 'Utilidad esperada', body: 'Compara cómo se siente cada resultado para la persona. Con U=ln(W), cada peso extra importa un poco menos.' },
      { title: 'Seguro y equivalente cierto', body: 'La prima justa iguala la pérdida esperada; la máxima prima aceptable depende de la aversión al riesgo.' },
    ],
    comments: [
      {
        id: 'emv-racionalidad',
        statement: 'Un valor monetario esperado positivo significa que toda persona racional acepta.',
        verdict: 'falso',
        justification: 'Una persona racional también mira su utilidad y sus preferencias: una pérdida grande puede doler más que lo que compensa la ganancia esperada.',
        memoryHook: 'Un completo con premio esperado no sirve si la salsa te deja sin almuerzo.',
      },
      {
        id: 'seguro-cualquier-prima',
        statement: 'Una persona adversa al riesgo siempre compra seguro, sin importar la prima.',
        verdict: 'falso',
        justification: 'Su disposición máxima a pagar es finita. Sobre ese límite, el seguro reduce demasiado su bienestar.',
        memoryHook: 'El paraguas protege, pero no pagarías el sueldo por uno.',
      },
      {
        id: 'igual-riqueza',
        statement: 'Con igual riqueza esperada, el adverso prefiere certeza, el neutral es indiferente y el amante del riesgo prefiere la apuesta.',
        verdict: 'verdadero',
        justification: 'Es la implicancia directa de utilidad cóncava, lineal y convexa, respectivamente.',
        memoryHook: 'Mismo promedio, tres paladares distintos.',
      },
    ],
    exercises: [
      {
        id: 'seguro-logaritmico',
        title: 'Seguro: ¿cuánto vale dormir tranquilo?',
        context: 'Tienes riqueza de 90,000. Hay una pérdida de 25,000 con probabilidad 20% y U(W)=ln(W).',
        requests: ['Calcular utilidad esperada y equivalente cierto.', 'Comparar prima justa, prima máxima y una prima de 5,400.'],
        steps: [
          'Sin pérdida quedan 90,000; con pérdida quedan 65,000. EU=0.8·ln(90,000)+0.2·ln(65,000)=11.3425.',
          'El equivalente cierto es CE≈84,328.95. La prima justa es 20%·25,000=5,000.',
          'La prima máxima es 90,000−84,328.95≈5,671.05. Como 5,400 es menor, conviene comprar el seguro.',
        ],
        takeaway: 'La aversión al riesgo puede justificar pagar más que la pérdida esperada, pero no una prima infinita.',
      },
      {
        id: 'tres-utilidades',
        title: 'Mismo promedio, tres decisiones',
        context: 'Compara riqueza cierta 100 con una apuesta 50/50 que termina en 60 o 140, todo en miles.',
        requests: ['Comparar U=sqrt(W), U=W y U=W^2.', 'Clasificar cada perfil.'],
        steps: [
          'Con U=sqrt(W), la certeza entrega 10 y la apuesta entrega (sqrt(60)+sqrt(140))/2<10: perfil adverso.',
          'Con U=W, ambos caminos valen 100: perfil neutral.',
          'Con U=W^2, la apuesta vale (60^2+140^2)/2=11,600, mayor que 100^2=10,000: perfil amante del riesgo.',
        ],
        takeaway: 'No cambió la riqueza esperada; cambió la curvatura de la utilidad.',
      },
    ],
    recap: 'Pregunta final: ¿estás comparando pesos esperados o bienestar esperado? Esa diferencia decide el seguro.',
  },
  {
    id: 'dos-periodos',
    title: 'Dos períodos: prestarle a tu yo olvidadizo',
    summary: 'El mercado financiero mueve recursos entre hoy y mañana; el VAN muestra cuánto aumenta la riqueza presente.',
    theorySlides: [
      { title: 'Restricción intertemporal', body: 'W0=Y0+Y1/(1+r). El valor presente permite sumar ingresos que llegan en fechas distintas.' },
      { title: 'Ahorrar o pedir prestado', body: 'Si C0 es menor que Y0 ahorras; si es mayor, pides prestado y el ajuste aparece en C1.' },
      { title: 'Separación Fisher', body: 'Con mercados perfectos, acepta proyectos con VAN positivo y luego elige consumo según preferencias.' },
    ],
    comments: [
      {
        id: 'tasa-ahorro',
        statement: 'Una tasa de interés más alta siempre hace que todas las personas ahorren más.',
        verdict: 'incierto',
        justification: 'El efecto sustitución incentiva ahorrar, pero el efecto ingreso puede permitir consumir más hoy. Depende de la posición y preferencias.',
        memoryHook: 'Subir la tasa cambia el precio del mañana, no el gusto de todos por guardarlo.',
      },
      {
        id: 'van-riqueza',
        statement: 'Un proyecto con VAN positivo aumenta la riqueza presente bajo mercados de capitales perfectos.',
        verdict: 'verdadero',
        justification: 'El proyecto agrega exactamente su VAN a W0, sin obligar a consumir en una fecha específica.',
        memoryHook: 'Si el proyecto deja vuelto hoy, el presupuesto se agranda.',
      },
      {
        id: 'ingreso-nominal',
        statement: 'Dos personas con igual ingreso nominal de vida deben elegir el mismo plan de ahorro o endeudamiento.',
        verdict: 'falso',
        justification: 'Importan el momento de los ingresos y las preferencias: el mismo total no implica el mismo calendario deseado.',
        memoryHook: 'Dos completos cuestan igual; hambre hoy y hambre mañana no son lo mismo.',
      },
    ],
    exercises: [
      {
        id: 'presupuesto-personal',
        title: 'El préstamo a tu yo de mañana',
        context: 'Y0=1,200,000; Y1=1,800,000; r=10%.',
        requests: ['Calcular W0.', 'Si C0=1,500,000, identificar préstamo, pago y C1.'],
        steps: [
          'W0=1,200,000+1,800,000/1.10=2,836,363.64.',
          'Como C0 excede Y0 en 300,000, se pide prestado 300,000.',
          'El pago futuro es 330,000 y C1=1,800,000−330,000=1,470,000.',
        ],
        takeaway: 'Pedir prestado no crea riqueza: adelanta consumo y descuenta consumo futuro con intereses.',
      },
      {
        id: 'proyecto-van',
        title: 'Proyecto que agranda el presupuesto',
        context: 'Inversión inicial 400,000, flujo futuro 520,000 y r=10%.',
        requests: ['Calcular VAN.', 'Aplicarlo al caso base.'],
        steps: [
          'VAN=520,000/1.10−400,000=72,727.27.',
          'Como es positivo, se acepta el proyecto.',
          'En el caso base, W0*=2,836,363.64+72,727.27=2,909,090.91.',
        ],
        takeaway: 'Primero se crea valor con VAN; después se elige cuándo consumirlo.',
      },
    ],
    recap: 'Una tasa no decide por ti: traduce consumo futuro a consumo de hoy y deja visibles los intercambios.',
  },
  {
    id: 'portafolio',
    title: 'Portafolio: porotos, lentejas y riesgo útil',
    summary: 'Diversificar reduce riesgo específico; CAPM, Sharpe, Treynor y VaR responden preguntas distintas sobre retorno y riesgo.',
    theorySlides: [
      { title: 'Diversificación', body: 'La correlación menor que 1 puede reducir varianza, pero no borra todo riesgo ni asegura retorno.' },
      { title: 'CAPM y beta', body: 'Beta mide riesgo sistemático relativo al mercado, no el riesgo total. CAPM da el retorno requerido.' },
      { title: 'Indicadores', body: 'Sharpe usa volatilidad total; Treynor usa beta; VaR resume una pérdida de cola para un horizonte y confianza elegidos.' },
    ],
    comments: [
      {
        id: 'diversificacion-total',
        statement: 'La diversificación siempre elimina todo el riesgo.',
        verdict: 'falso',
        justification: 'Reduce riesgo idiosincrático cuando los activos no se mueven igual, pero el riesgo sistemático permanece.',
        memoryHook: 'Mezclar porotos no apaga la lluvia del mercado.',
      },
      {
        id: 'activo-volatilidad',
        statement: 'El activo de menor volatilidad siempre tiene el mejor Sharpe y Treynor.',
        verdict: 'falso',
        justification: 'Ambos ratios dependen también del exceso de retorno y, para Treynor, de beta.',
        memoryHook: 'El completo más chico no siempre da más energía por peso.',
      },
      {
        id: 'abc-capm',
        statement: 'La clasificación correcta es A=verdadero, B=falso y C=verdadero.',
        verdict: 'verdadero',
        justification: 'Cada subafirmación se evalúa por separado: A es verdadero, B es falso porque beta mide riesgo sistemático, y C es verdadero bajo los supuestos.',
        memoryHook: 'A mezcla; B no mide todo; C compara promesa con peaje.',
        subitems: [
          { id: 'a-correlacion', statement: 'Una correlación menor que 1 puede reducir riesgo.', verdict: 'verdadero' },
          { id: 'b-beta', statement: 'Beta mide riesgo total.', verdict: 'falso' },
          { id: 'c-capm', statement: 'Un retorno esperado mayor que CAPM implica subvaloración bajo los supuestos del ejercicio.', verdict: 'verdadero' },
        ],
      },
    ],
    exercises: [
      {
        id: 'legumbres',
        title: 'Poroto, Lenteja y Garbanzo',
        context: 'Inversión 10,000,000. Poroto: precio 400, σ 8%, retorno 14%; Lenteja: 150, σ 9%, retorno 12%; Garbanzo: 250, σ 12%, retorno 15%. Correlaciones P-L=.4, P-G=.1, L-G=.3. Mercado: retorno 15%, σ 8%; correlaciones con mercado .7, .5, .8; rf=4%.',
        requests: ['Calcular beta, Treynor y retorno CAPM.', 'Elegir la pareja, construir PMV y descomponer su riesgo.', 'Calcular VaR paramétrico a 10 días y 99%.'],
        steps: [
          'Betas: Poroto .7, Lenteja .5625, Garbanzo 1.2. Treynor: .142857, .142222, .091667; se eligen Poroto/Lenteja.',
          'PMV: pesos .597254/.402746; retorno .131945; varianza .004982334; sigma .070585651.',
          'Con correlación portafolio-mercado .5, beta .441160. Varianza sistemática .001245584 e idiosincrática .003736751: 25%/75%. Sus desviaciones estándar son .035293 y .061129; no deben sumarse, porque se suman las varianzas para reconstruir la varianza total .004982334.',
          'Con z=2.326, 252 días bursátiles, VaR 10 días al 99% ≈327,059.',
          'CAPM: Poroto .117, Lenteja .101875, Garbanzo .172. Poroto y Lenteja están subvalorados; Garbanzo, sobrevalorado.',
        ],
        takeaway: 'Diversificar no es escoger el menor sigma: se combinan correlación, retorno, beta y la pregunta que quieres responder.',
      },
      {
        id: 'objetivos-distintos',
        title: 'Mínimo riesgo no es máximo Sharpe',
        context: 'X1: retorno 15%, σ 10%; X2: retorno 25%, σ 14%; rho=.2; rf=6%.',
        requests: ['Encontrar la mezcla de mínima varianza.', 'Compararla con la mezcla de máximo Sharpe.'],
        steps: [
          'La mezcla de mínimo riesgo queda cerca de 70%/30% en X1/X2.',
          'La mezcla de máximo Sharpe queda cerca de 40%/60% en X1/X2.',
          'La segunda acepta más exposición a X2 porque premia su exceso de retorno.',
        ],
        takeaway: 'Antes de optimizar, decide si te importa minimizar volatilidad o maximizar retorno por unidad de riesgo.',
      },
    ],
    recap: 'Correlación baja ayuda, beta ordena el riesgo sistemático y el ratio correcto depende de la decisión.',
  },
];
