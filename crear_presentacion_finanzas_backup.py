from pathlib import Path
from zipfile import ZipFile, ZIP_DEFLATED
from xml.sax.saxutils import escape


OUT = Path("Presentacion_Planificacion_Financiera_Ciclo_Caja_FER.pptx")


def content_types(slide_count: int) -> str:
    slide_overrides = "\n".join(
        f'<Override PartName="/ppt/slides/slide{i}.xml" '
        f'ContentType="application/vnd.openxmlformats-officedocument.presentationml.slide+xml"/>'
        for i in range(1, slide_count + 1)
    )
    return f'''<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
  <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
  <Default Extension="xml" ContentType="application/xml"/>
  <Override PartName="/ppt/presentation.xml" ContentType="application/vnd.openxmlformats-officedocument.presentationml.presentation.main+xml"/>
  <Override PartName="/ppt/slideMasters/slideMaster1.xml" ContentType="application/vnd.openxmlformats-officedocument.presentationml.slideMaster+xml"/>
  <Override PartName="/ppt/slideLayouts/slideLayout1.xml" ContentType="application/vnd.openxmlformats-officedocument.slideLayout+xml"/>
  <Override PartName="/ppt/theme/theme1.xml" ContentType="application/vnd.openxmlformats-officedocument.theme+xml"/>
  <Override PartName="/docProps/core.xml" ContentType="application/vnd.openxmlformats-package.core-properties+xml"/>
  <Override PartName="/docProps/app.xml" ContentType="application/vnd.openxmlformats-officedocument.extended-properties+xml"/>
  {slide_overrides}
</Types>'''


def rels_root() -> str:
    return '''<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="ppt/presentation.xml"/>
  <Relationship Id="rId2" Type="http://schemas.openxmlformats.org/package/2006/relationships/metadata/core-properties" Target="docProps/core.xml"/>
  <Relationship Id="rId3" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/extended-properties" Target="docProps/app.xml"/>
</Relationships>'''


def app_props(slide_count: int) -> str:
    return f'''<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Properties xmlns="http://schemas.openxmlformats.org/officeDocument/2006/extended-properties" xmlns:vt="http://schemas.openxmlformats.org/officeDocument/2006/docPropsVTypes">
  <Application>Codex</Application>
  <PresentationFormat>On-screen Show (16:9)</PresentationFormat>
  <Slides>{slide_count}</Slides>
</Properties>'''


def core_props() -> str:
    return '''<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<cp:coreProperties xmlns:cp="http://schemas.openxmlformats.org/package/2006/metadata/core-properties" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:dcterms="http://purl.org/dc/terms/" xmlns:dcmitype="http://purl.org/dc/dcmitype/" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
  <dc:title>Planificación financiera, ciclo de caja y FER</dc:title>
  <dc:creator>Nicolas Inostrosa Basualto</dc:creator>
  <cp:lastModifiedBy>Codex</cp:lastModifiedBy>
</cp:coreProperties>'''


def presentation(slide_count: int) -> str:
    slide_ids = "\n".join(
        f'<p:sldId id="{255 + i}" r:id="rId{i}"/>' for i in range(1, slide_count + 1)
    )
    return f'''<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<p:presentation xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" xmlns:p="http://schemas.openxmlformats.org/presentationml/2006/main">
  <p:sldMasterIdLst><p:sldMasterId id="2147483648" r:id="rId{slide_count + 1}"/></p:sldMasterIdLst>
  <p:sldIdLst>{slide_ids}</p:sldIdLst>
  <p:sldSz cx="12192000" cy="6858000" type="wide"/>
  <p:notesSz cx="6858000" cy="9144000"/>
</p:presentation>'''


def presentation_rels(slide_count: int) -> str:
    rels = "\n".join(
        f'<Relationship Id="rId{i}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/slide" Target="slides/slide{i}.xml"/>'
        for i in range(1, slide_count + 1)
    )
    return f'''<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  {rels}
  <Relationship Id="rId{slide_count + 1}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/slideMaster" Target="slideMasters/slideMaster1.xml"/>
  <Relationship Id="rId{slide_count + 2}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/theme" Target="theme/theme1.xml"/>
</Relationships>'''


def empty_rels() -> str:
    return '''<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"/>'''


def slide_rels() -> str:
    return '''<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/slideLayout" Target="../slideLayouts/slideLayout1.xml"/>
</Relationships>'''


def theme() -> str:
    return '''<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<a:theme xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" name="Finanzas UDD">
  <a:themeElements>
    <a:clrScheme name="Finanzas">
      <a:dk1><a:srgbClr val="111827"/></a:dk1><a:lt1><a:srgbClr val="FFFFFF"/></a:lt1>
      <a:dk2><a:srgbClr val="1F2937"/></a:dk2><a:lt2><a:srgbClr val="F8FAFC"/></a:lt2>
      <a:accent1><a:srgbClr val="0F766E"/></a:accent1><a:accent2><a:srgbClr val="F59E0B"/></a:accent2>
      <a:accent3><a:srgbClr val="2563EB"/></a:accent3><a:accent4><a:srgbClr val="DC2626"/></a:accent4>
      <a:accent5><a:srgbClr val="475569"/></a:accent5><a:accent6><a:srgbClr val="16A34A"/></a:accent6>
      <a:hlink><a:srgbClr val="2563EB"/></a:hlink><a:folHlink><a:srgbClr val="7C3AED"/></a:folHlink>
    </a:clrScheme>
    <a:fontScheme name="Aptos"><a:majorFont><a:latin typeface="Aptos Display"/></a:majorFont><a:minorFont><a:latin typeface="Aptos"/></a:minorFont></a:fontScheme>
    <a:fmtScheme name="Office"><a:fillStyleLst/><a:lnStyleLst/><a:effectStyleLst/><a:bgFillStyleLst/></a:fmtScheme>
  </a:themeElements>
</a:theme>'''


def slide_master() -> str:
    return '''<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<p:sldMaster xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" xmlns:p="http://schemas.openxmlformats.org/presentationml/2006/main">
  <p:cSld><p:spTree><p:nvGrpSpPr><p:cNvPr id="1" name=""/><p:cNvGrpSpPr/><p:nvPr/></p:nvGrpSpPr><p:grpSpPr/></p:spTree></p:cSld>
  <p:sldLayoutIdLst><p:sldLayoutId id="2147483649" r:id="rId1"/></p:sldLayoutIdLst>
</p:sldMaster>'''


def slide_layout() -> str:
    return '''<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<p:sldLayout xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" xmlns:p="http://schemas.openxmlformats.org/presentationml/2006/main" type="blank">
  <p:cSld name="Blank"><p:spTree><p:nvGrpSpPr><p:cNvPr id="1" name=""/><p:cNvGrpSpPr/><p:nvPr/></p:nvGrpSpPr><p:grpSpPr/></p:spTree></p:cSld>
</p:sldLayout>'''


def sp_xml(shape_id, x, y, cx, cy, text, size=2600, color="111827", bold=False, fill=None, align="l"):
    paragraphs = []
    bold_attr = ' b="1"' if bold else ""
    for raw in str(text).split("\n"):
        if raw.strip().startswith("•"):
            level = 0
            line = raw.strip()[1:].strip()
            bullet = '<a:buChar char="•"/>'
            mar = ' marL="342900" indent="-171450"'
        else:
            level = 0
            line = raw
            bullet = "<a:buNone/>"
            mar = ""
        paragraphs.append(
            f'<a:p><a:pPr algn="{align}" lvl="{level}"{mar}>{bullet}</a:pPr>'
            f'<a:r><a:rPr lang="es-CL" sz="{size}" dirty="0"'
            f'{bold_attr}><a:solidFill><a:srgbClr val="{color}"/></a:solidFill></a:rPr>'
            f'<a:t>{escape(line)}</a:t></a:r><a:endParaRPr lang="es-CL" sz="{size}"/></a:p>'
        )
    fill_xml = (
        f'<a:solidFill><a:srgbClr val="{fill}"/></a:solidFill>'
        if fill
        else '<a:noFill/>'
    )
    return f'''<p:sp>
  <p:nvSpPr><p:cNvPr id="{shape_id}" name="TextBox {shape_id}"/><p:cNvSpPr txBox="1"/><p:nvPr/></p:nvSpPr>
  <p:spPr><a:xfrm><a:off x="{x}" y="{y}"/><a:ext cx="{cx}" cy="{cy}"/></a:xfrm><a:prstGeom prst="rect"><a:avLst/></a:prstGeom>{fill_xml}<a:ln><a:noFill/></a:ln></p:spPr>
  <p:txBody><a:bodyPr wrap="square" anchor="t"/><a:lstStyle/>{"".join(paragraphs)}</p:txBody>
</p:sp>'''


def rect_xml(shape_id, x, y, cx, cy, fill="0F766E"):
    return f'''<p:sp>
  <p:nvSpPr><p:cNvPr id="{shape_id}" name="Band {shape_id}"/><p:cNvSpPr/><p:nvPr/></p:nvSpPr>
  <p:spPr><a:xfrm><a:off x="{x}" y="{y}"/><a:ext cx="{cx}" cy="{cy}"/></a:xfrm><a:prstGeom prst="rect"><a:avLst/></a:prstGeom><a:solidFill><a:srgbClr val="{fill}"/></a:solidFill><a:ln><a:noFill/></a:ln></p:spPr>
</p:sp>'''


def slide(title, body="", subtitle="", footer="Ayudantía Finanzas UDD", accent="0F766E", boxes=None):
    shapes = [rect_xml(2, 0, 0, 12192000, 250000, accent)]
    shapes.append(sp_xml(3, 650000, 470000, 10800000, 900000, title, size=3400, bold=True, color="111827"))
    next_id = 4
    if subtitle:
        shapes.append(sp_xml(next_id, 660000, 1270000, 10800000, 500000, subtitle, size=1850, color="475569"))
        next_id += 1
    if body:
        shapes.append(sp_xml(next_id, 780000, 1880000, 10600000, 3800000, body, size=2100, color="1F2937"))
        next_id += 1
    if boxes:
        for box in boxes:
            shapes.append(sp_xml(next_id, *box["pos"], box["text"], size=box.get("size", 1700), color=box.get("color", "111827"), bold=box.get("bold", False), fill=box.get("fill")))
            next_id += 1
    shapes.append(sp_xml(100, 8800000, 6400000, 2700000, 220000, footer, size=950, color="64748B"))
    return f'''<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<p:sld xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" xmlns:p="http://schemas.openxmlformats.org/presentationml/2006/main">
  <p:cSld><p:spTree><p:nvGrpSpPr><p:cNvPr id="1" name=""/><p:cNvGrpSpPr/><p:nvPr/></p:nvGrpSpPr><p:grpSpPr/>{"".join(shapes)}</p:spTree></p:cSld>
  <p:clrMapOvr><a:masterClrMapping/></p:clrMapOvr>
</p:sld>'''


slides = [
    slide(
        "Planificación financiera, ciclo de caja y FER",
        "Objetivo de la ayudantía: entender la lógica antes de memorizar fórmulas.\n\n• 10 min: conceptos clave\n• 10 min: ciclo de caja\n• 15 min: Financiamiento Externo Requerido\n• 10 min: comentes, cierre y soluciones",
        "Nivel básico | 45 minutos | con ejercicios y soluciones",
    ),
    slide(
        "Idea central de la planificación financiera",
        "La planificación financiera traduce decisiones operacionales en necesidades de caja.\n\n• Si las ventas crecen, normalmente crecen activos operacionales: inventario, cuentas por cobrar y caja mínima.\n• Parte del crecimiento se financia solo: proveedores, impuestos y otras cuentas por pagar.\n• La diferencia se cubre con utilidades retenidas o financiamiento externo.\n• El foco no es solo vender más, sino financiar bien el crecimiento.",
    ),
    slide(
        "Capital de trabajo: dónde queda atrapada la caja",
        "Capital de trabajo operativo = activos corrientes operacionales - pasivos corrientes operacionales.\n\n• Activos operacionales: inventario + cuentas por cobrar.\n• Pasivos espontáneos: cuentas por pagar y gastos acumulados.\n• Más inventario o más plazo a clientes aumenta la caja necesaria.\n• Más plazo de proveedores reduce la caja necesaria, pero puede tensionar relaciones comerciales.",
    ),
    slide(
        "Ciclo de caja",
        "Fórmula base:\n\nCiclo de caja = Días de inventario + Días de cuentas por cobrar - Días de cuentas por pagar\n\nLectura práctica:\n• Mide cuántos días debe financiar la empresa desde que paga o compromete recursos hasta que cobra la venta.\n• Mientras más largo el ciclo, mayor necesidad de financiamiento operativo.\n• Mejorar cobranza o rotación de inventario libera caja.",
    ),
    slide(
        "FER: Financiamiento Externo Requerido",
        "El FER estima cuánto financiamiento adicional necesita una empresa para sostener el crecimiento proyectado.\n\nFórmula 1, lógica económica:\nFER = aumento de activos requeridos - aumento de pasivos espontáneos - utilidades retenidas\n\nFórmula 2, porcentaje de ventas:\nFER = (A*/V0) × ΔV - (P*/V0) × ΔV - m × V1 × (1 - d)\n\nDonde A* son activos que crecen con ventas, P* pasivos espontáneos, m margen neto y d payout.",
    ),
    slide(
        "Mini ejemplo guiado",
        "Ventas actuales: $1.000 | crecimiento esperado: 20% | ventas proyectadas: $1.200\nActivos ligados a ventas: 70% | pasivos espontáneos: 20%\nMargen neto: 8% | payout: 25% | retención: 75%\n\nAumento de activos = 0,70 × 200 = 140\nAumento de pasivos espontáneos = 0,20 × 200 = 40\nUtilidades retenidas = 0,08 × 1.200 × 0,75 = 72\nFER = 140 - 40 - 72 = 28",
    ),
    slide(
        "Comentes",
        "Indica si cada afirmación es verdadera, falsa o depende. Justifica en 3 a 5 líneas.\n\n1. Si una empresa vende más, siempre necesitará más financiamiento externo.\n\n2. Dos empresas con las mismas ventas pueden tener necesidades de caja muy distintas si operan en industrias diferentes.\n\n3. Aumentar el plazo de pago a proveedores mejora el ciclo de caja, por lo tanto nunca tiene costos relevantes.",
    ),
    slide(
        "Comente con subítems",
        "4. Una empresa quiere crecer 30% el próximo año. Evalúa:\n\nA. ¿Por qué el crecimiento puede aumentar activos operacionales?\nB. ¿Qué rol cumplen los pasivos espontáneos?\nC. ¿Por qué un mayor margen neto puede reducir el FER?\n\nClave esperada: conectar ventas, activos, proveedores, utilidades retenidas y necesidad de financiamiento.",
    ),
    slide(
        "Ejercicio 1: ciclo de caja",
        "Comercial Andina vende productos de consumo masivo. Usa año comercial de 360 días.\n\nDatos anuales:\nVentas = $360.000\nCosto de ventas = $252.000\nInventario promedio = $42.000\nCuentas por cobrar promedio = $35.000\nCuentas por pagar promedio = $28.000\n\nSe pide:\nA. Calcular días de inventario, cobro y pago.\nB. Calcular el ciclo de caja.\nC. Interpretar qué pasa si la cobranza baja en 10 días.",
    ),
    slide(
        "Ejercicio 2: FER simple",
        "Tecnologías Sur proyecta crecer el próximo año.\n\nVentas actuales = $1.000\nCrecimiento esperado = 20%\nActivos que crecen con ventas = 70% de ventas\nPasivos espontáneos = 20% de ventas\nMargen neto esperado = 8%\nPayout de dividendos = 25%\n\nSe pide:\nA. Calcular el FER usando la fórmula de porcentaje de ventas.\nB. Explicar qué significa el resultado.\nC. ¿Qué pasaría si la empresa retuviera el 100% de sus utilidades?",
    ),
    slide(
        "Caso práctico integrador",
        "Retail Los Lagos quiere abrir nuevos puntos de venta. La gerencia espera subir ventas desde $2.000 a $2.600.\n\nSupuestos:\nActivos ligados a ventas = 65% de ventas\nPasivos espontáneos = 18% de ventas\nMargen neto = 6%\nPayout = 40%\nCiclo de caja actual = 58 días\nMeta de mejora: reducir cobranza en 8 días\nCosto diario operativo estimado = $3,5\n\nSe pide:\nA. Calcular el FER inicial.\nB. Estimar caja liberada por mejorar cobranza.\nC. Proponer dos decisiones para reducir el financiamiento requerido.",
    ),
    slide(
        "Soluciones: comentes",
        "1. Falso. Crecer puede requerir más activos, pero el aumento puede financiarse con proveedores, utilidades retenidas o mejoras de eficiencia.\n\n2. Verdadero. Un supermercado, una minera y una consultora tienen inventarios, cobranza y proveedores muy distintos.\n\n3. Falso. Pagar más tarde ayuda al ciclo de caja, pero puede traer descuentos perdidos, deterioro comercial o riesgo de suministro.\n\n4. A: crecimiento aumenta inventarios/cobranza. B: proveedores financian parte del crecimiento. C: más margen genera más utilidad retenida y reduce FER.",
    ),
    slide(
        "Solución: ejercicio 1",
        "Días de inventario = Inventario / (Costo ventas / 360)\n= 42.000 / 700 = 60 días\n\nDías de cobro = CxC / (Ventas / 360)\n= 35.000 / 1.000 = 35 días\n\nDías de pago = CxP / (Costo ventas / 360)\n= 28.000 / 700 = 40 días\n\nCiclo de caja = 60 + 35 - 40 = 55 días\nSi cobranza baja 10 días: nuevo ciclo = 45 días. Caja liberada aproximada = 10 × 700 = $7.000.",
    ),
    slide(
        "Solución: ejercicio 2",
        "Ventas proyectadas = 1.000 × 1,20 = 1.200\nΔV = 200\n\nAumento activos = 0,70 × 200 = 140\nAumento pasivos espontáneos = 0,20 × 200 = 40\nUtilidades retenidas = 0,08 × 1.200 × 0,75 = 72\n\nFER = 140 - 40 - 72 = 28\n\nInterpretación: la empresa debe conseguir $28 de financiamiento externo. Si retiene 100%, retención = 96, entonces FER = 140 - 40 - 96 = 4.",
    ),
    slide(
        "Solución: caso práctico",
        "Ventas actuales = 2.000 | ventas proyectadas = 2.600 | ΔV = 600\n\nAumento activos = 0,65 × 600 = 390\nAumento pasivos espontáneos = 0,18 × 600 = 108\nUtilidades retenidas = 0,06 × 2.600 × 0,60 = 93,6\n\nFER inicial = 390 - 108 - 93,6 = 188,4\nCaja liberada por cobranza = 8 × 3,5 = 28\nFER ajustado aproximado = 188,4 - 28 = 160,4\n\nDecisiones: mejorar cobranza, rotar inventario, negociar proveedores, reducir payout o aumentar margen.",
    ),
    slide(
        "Cierre",
        "Tres ideas para que se queden:\n\n• Crecer no solo exige vender: exige financiar activos operacionales.\n• El ciclo de caja muestra cuántos días la empresa debe financiar su operación.\n• El FER separa tres fuentes: activos requeridos, financiamiento espontáneo y utilidades retenidas.\n\nPregunta final para clase: ¿qué variable atacarías primero si el FER sale demasiado alto?",
    ),
]


with ZipFile(OUT, "w", ZIP_DEFLATED) as z:
    z.writestr("[Content_Types].xml", content_types(len(slides)))
    z.writestr("_rels/.rels", rels_root())
    z.writestr("docProps/app.xml", app_props(len(slides)))
    z.writestr("docProps/core.xml", core_props())
    z.writestr("ppt/presentation.xml", presentation(len(slides)))
    z.writestr("ppt/_rels/presentation.xml.rels", presentation_rels(len(slides)))
    z.writestr("ppt/theme/theme1.xml", theme())
    z.writestr("ppt/slideMasters/slideMaster1.xml", slide_master())
    z.writestr("ppt/slideMasters/_rels/slideMaster1.xml.rels", '''<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/slideLayout" Target="../slideLayouts/slideLayout1.xml"/><Relationship Id="rId2" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/theme" Target="../theme/theme1.xml"/></Relationships>''')
    z.writestr("ppt/slideLayouts/slideLayout1.xml", slide_layout())
    z.writestr("ppt/slideLayouts/_rels/slideLayout1.xml.rels", '''<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/slideMaster" Target="../slideMasters/slideMaster1.xml"/></Relationships>''')
    for idx, xml in enumerate(slides, 1):
        z.writestr(f"ppt/slides/slide{idx}.xml", xml)
        z.writestr(f"ppt/slides/_rels/slide{idx}.xml.rels", slide_rels())

print(OUT.resolve())
