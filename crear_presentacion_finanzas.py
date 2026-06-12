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
      <a:dk1><a:srgbClr val="090D16"/></a:dk1><a:lt1><a:srgbClr val="F8FAFC"/></a:lt1>
      <a:dk2><a:srgbClr val="1E293B"/></a:dk2><a:lt2><a:srgbClr val="00D8F6"/></a:lt2>
      <a:accent1><a:srgbClr val="3B82F6"/></a:accent1><a:accent2><a:srgbClr val="10B981"/></a:accent2>
      <a:accent3><a:srgbClr val="F59E0B"/></a:accent3><a:accent4><a:srgbClr val="EF4444"/></a:accent4>
      <a:accent5><a:srgbClr val="475569"/></a:accent5><a:accent6><a:srgbClr val="16A34A"/></a:accent6>
      <a:hlink><a:srgbClr val="00D8F6"/></a:hlink><a:folHlink><a:srgbClr val="3B82F6"/></a:folHlink>
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


def sp_xml(shape_id, x, y, cx, cy, text, size=1800, color="CBD5E1", bold=False, fill=None, align="l"):
    paragraphs = []
    bold_attr = ' b="1"' if bold else ""
    for raw in str(text).split("\n"):
        if raw.strip().startswith("•"):
            lvl = 0
            line = raw.strip()[1:].strip()
            bullet = '<a:buChar char="•"/>'
            mar = ' marL="342900" indent="-171450"'
        else:
            lvl = 0
            line = raw
            bullet = "<a:buNone/>"
            mar = ""
        paragraphs.append(
            f'<a:p><a:pPr algn="{align}" lvl="{lvl}"{mar}>{bullet}</a:pPr>'
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


def rect_xml(shape_id, x, y, cx, cy, fill="00D8F6"):
    return f'''<p:sp>
  <p:nvSpPr><p:cNvPr id="{shape_id}" name="Rect {shape_id}"/><p:cNvSpPr/><p:nvPr/></p:nvSpPr>
  <p:spPr><a:xfrm><a:off x="{x}" y="{y}"/><a:ext cx="{cx}" cy="{cy}"/></a:xfrm><a:prstGeom prst="rect"><a:avLst/></a:prstGeom><a:solidFill><a:srgbClr val="{fill}"/></a:solidFill><a:ln><a:noFill/></a:ln></p:spPr>
</p:sp>'''


def card_xml(shape_id, x, y, cx, cy, text, title="", size=1400, title_size=1600, color="CBD5E1", title_color="FFFFFF", fill="151E2E", border_color=None, align="l", round_corners=True):
    paragraphs = []
    
    # Title paragraph
    if title:
        paragraphs.append(
            f'<a:p><a:pPr algn="{align}"/>'
            f'<a:r><a:rPr lang="es-CL" sz="{title_size}" b="1">'
            f'<a:solidFill><a:srgbClr val="{title_color}"/></a:solidFill>'
            f'</a:rPr><a:t>{escape(title)}</a:t></a:r><a:endParaRPr lang="es-CL" sz="{title_size}"/></a:p>'
        )
    
    # Spacer paragraph if there's a title and text
    if title and text:
        paragraphs.append(
            f'<a:p><a:pPr algn="{align}"/>'
            f'<a:r><a:rPr lang="es-CL" sz="600"><a:solidFill><a:srgbClr val="{color}"/></a:solidFill></a:rPr>'
            f'<a:t></a:t></a:r><a:endParaRPr lang="es-CL" sz="600"/></a:p>'
        )

    # Body paragraphs
    if text:
        for raw in str(text).split("\n"):
            if raw.strip().startswith("•"):
                lvl = 0
                line = raw.strip()[1:].strip()
                bullet = '<a:buChar char="•"/>'
                mar = ' marL="342900" indent="-171450"'
            else:
                lvl = 0
                line = raw
                bullet = "<a:buNone/>"
                mar = ""
            paragraphs.append(
                f'<a:p><a:pPr algn="{align}" lvl="{lvl}"{mar}>{bullet}</a:pPr>'
                f'<a:r><a:rPr lang="es-CL" sz="{size}"><a:solidFill><a:srgbClr val="{color}"/></a:solidFill></a:rPr>'
                f'<a:t>{escape(line)}</a:t></a:r><a:endParaRPr lang="es-CL" sz="{size}"/></a:p>'
            )

    fill_xml = f'<a:solidFill><a:srgbClr val="{fill}"/></a:solidFill>' if fill else '<a:noFill/>'
    ln_xml = f'<a:ln w="15000"><a:solidFill><a:srgbClr val="{border_color}"/></a:solidFill></a:ln>' if border_color else '<a:ln><a:noFill/></a:ln>'
    
    prst = "roundRect" if round_corners else "rect"
    av_lst = '<a:avLst><a:gd name="adj" fmla="val 8000"/></a:avLst>' if (round_corners and prst == "roundRect") else '<a:avLst/>'
    
    body_pr = '<a:bodyPr wrap="square" anchor="t" lIns="182880" tIns="182880" rIns="182880" bIns="182880"/>'
    
    return f'''<p:sp>
  <p:nvSpPr><p:cNvPr id="{shape_id}" name="Card {shape_id}"/><p:cNvSpPr txBox="1"/><p:nvPr/></p:nvSpPr>
  <p:spPr>
    <a:xfrm><a:off x="{x}" y="{y}"/><a:ext cx="{cx}" cy="{cy}"/></a:xfrm>
    <a:prstGeom prst="{prst}">{av_lst}</a:prstGeom>
    {fill_xml}
    {ln_xml}
  </p:spPr>
  <p:txBody>{body_pr}<a:lstStyle/>{"".join(paragraphs)}</p:txBody>
</p:sp>'''


def create_slide(title, category="FINANZAS UDD", content_shapes=[]):
    shapes = []
    # 2: Background dark fill
    shapes.append(rect_xml(2, 0, 0, 12192000, 6858000, "090D16"))
    # 3: Top cyan accent line
    shapes.append(rect_xml(3, 0, 0, 12192000, 80000, "00D8F6"))
    # 4: Category tracker
    shapes.append(sp_xml(4, 650000, 250000, 10800000, 250000, category.upper(), size=900, color="00D8F6", bold=True))
    # 5: Slide Title
    shapes.append(sp_xml(5, 650000, 450000, 10800000, 700000, title, size=2800, color="FFFFFF", bold=True))
    # 6: Footer
    shapes.append(sp_xml(6, 650000, 6400000, 10890000, 250000, "Ayudantía Finanzas UDD | Nicolas Inostrosa", size=900, color="475569", align="r"))
    
    current_id = 7
    for shape_gen in content_shapes:
        shapes.append(shape_gen(current_id))
        current_id += 1
        
    return f'''<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<p:sld xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" xmlns:p="http://schemas.openxmlformats.org/presentationml/2006/main">
  <p:cSld><p:spTree><p:nvGrpSpPr><p:cNvPr id="1" name=""/><p:cNvGrpSpPr/><p:nvPr/></p:nvGrpSpPr><p:grpSpPr/>{"".join(shapes)}</p:spTree></p:cSld>
  <p:clrMapOvr><a:masterClrMapping/></p:clrMapOvr>
</p:sld>'''


def create_cover_slide(title, subtitle, course, teacher, assistant):
    shapes = []
    # Background
    shapes.append(rect_xml(2, 0, 0, 12192000, 6858000, "090D16"))
    # Left accent bar (Cyan)
    shapes.append(rect_xml(3, 0, 0, 250000, 6858000, "00D8F6"))
    # Left border of bar (Blue accent)
    shapes.append(rect_xml(4, 250000, 0, 50000, 6858000, "3B82F6"))
    
    # Title
    shapes.append(sp_xml(5, 800000, 1600000, 10500000, 2000000, title, size=3800, color="FFFFFF", bold=True))
    # Subtitle
    shapes.append(sp_xml(6, 800000, 3700000, 10500000, 800000, subtitle, size=1800, color="CBD5E1"))
    
    # Info card
    info_text = f"Curso: {course}\nProfesor: {teacher}\nAyudante: {assistant}"
    shapes.append(card_xml(7, 800000, 4800000, 5500000, 1400000, info_text, title="INFORMACIÓN GENERAL", size=1300, title_size=1200, fill="151E2E", border_color="3B82F6"))
    
    return f'''<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<p:sld xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" xmlns:p="http://schemas.openxmlformats.org/presentationml/2006/main">
  <p:cSld><p:spTree><p:nvGrpSpPr><p:cNvPr id="1" name=""/><p:cNvGrpSpPr/><p:nvPr/></p:nvGrpSpPr><p:grpSpPr/>{"".join(shapes)}</p:spTree></p:cSld>
  <p:clrMapOvr><a:masterClrMapping/></p:clrMapOvr>
</p:sld>'''


# Transition slide (large section divider)
def create_section_slide(title, subtitle=""):
    shapes = []
    shapes.append(rect_xml(2, 0, 0, 12192000, 6858000, "090D16"))
    shapes.append(rect_xml(3, 0, 2800000, 12192000, 1200000, "151E2E"))
    shapes.append(rect_xml(4, 0, 2800000, 12192000, 60000, "00D8F6"))
    shapes.append(rect_xml(5, 0, 3940000, 12192000, 60000, "00D8F6"))
    
    shapes.append(sp_xml(6, 650000, 3000000, 10890000, 800000, title, size=3200, color="FFFFFF", bold=True, align="center"))
    if subtitle:
        shapes.append(sp_xml(7, 650000, 4200000, 10890000, 500000, subtitle, size=1800, color="00D8F6", align="center"))
        
    shapes.append(sp_xml(8, 650000, 6400000, 10890000, 250000, "Ayudantía Finanzas UDD | Nicolas Inostrosa", size=900, color="475569", align="r"))
    
    return f'''<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<p:sld xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" xmlns:p="http://schemas.openxmlformats.org/presentationml/2006/main">
  <p:cSld><p:spTree><p:nvGrpSpPr><p:cNvPr id="1" name=""/><p:cNvGrpSpPr/><p:nvPr/></p:nvGrpSpPr><p:grpSpPr/>{"".join(shapes)}</p:spTree></p:cSld>
  <p:clrMapOvr><a:masterClrMapping/></p:clrMapOvr>
</p:sld>'''


# Define all presentation slides
slide_deck_xml = [
    # 1. Cover
    create_cover_slide(
        "Planificación Financiera, Ciclo de Caja y FER",
        "Estructura conceptual y guía de resolución de ejercicios tipo certamen",
        "Finanzas (UDD)",
        "Francisco Labarca Trucios",
        "Nicolas Inostrosa Basualto"
    ),
    # 2. Agenda
    create_slide(
        "Hoja de ruta para hoy",
        "Introducción",
        [
            lambda sid: card_xml(sid, 650000, 1800000, 2573000, 4200000, "Repaso de las principales fórmulas y conceptos: Capital de Trabajo, Ciclo de Caja, EOQ, Baumol, Miller-Orr y FER.", title="01. CONCEPTOS BASE", fill="151E2E", border_color="3B82F6"),
            lambda sid: card_xml(sid, 3423000, 1800000, 2573000, 4200000, "Discusión conceptual de 3 ejercicios comentes tipo certamen para afinar la intuición económica.", title="02. COMENTES", fill="151E2E", border_color="00D8F6"),
            lambda sid: card_xml(sid, 6196000, 1800000, 2573000, 4200000, "Resolución paso a paso de problemas prácticos sobre FER, EOQ y modelos de administración de caja.", title="03. EJERCICIOS", fill="151E2E", border_color="3B82F6"),
            lambda sid: card_xml(sid, 8969000, 1800000, 2573000, 4200000, "Recomendaciones estratégicas sobre calce de plazos, optimización de cuentas por cobrar y financiamiento.", title="04. CONCLUSIONES", fill="151E2E", border_color="10B981")
        ]
    ),
    # 3. Concept: Capital de Trabajo
    create_slide(
        "Capital de Trabajo Neto Operativo (CTNO)",
        "Concepto",
        [
            lambda sid: card_xml(sid, 650000, 1600000, 5200000, 4400000, 
                                 "• El capital de trabajo mide los recursos que la empresa mantiene atados para financiar su operación diaria.\n\n• Activos Operativos (Atrapan Caja):\n  Inventarios (stock en bodega) y Cuentas por Cobrar (crédito a clientes).\n\n• Pasivos Espontáneos (Liberan Caja):\n  Cuentas por Pagar (financiamiento automático de proveedores) e Impuestos/Sueldos devengados.\n\n• Fórmula:\n  CTNO = Activos Operacionales - Pasivos Espontáneos", 
                                 title="ADMINISTRACIÓN DE TRABAJO", fill="151E2E", border_color="EF4444"),
            lambda sid: card_xml(sid, 6200000, 1600000, 5200000, 4400000, 
                                 "• Acelerar ventas sin financiamiento:\n  Si las ventas crecen, los Activos Operativos aumentan de inmediato (más CxC y stock).\n\n• Rol de los proveedores:\n  Si los proveedores no aumentan su financiamiento proporcionalmente, se genera un déficit de efectivo.\n\n✓ Regla de Oro:\n  El crecimiento comercial genera presión de liquidez que debe planificarse con anticipación.", 
                                 title="IMPACTO EN LA LIQUIDEZ", fill="151E2E", border_color="00D8F6")
        ]
    ),
    # 4. Concept: Ciclo de Caja
    create_slide(
        "Lógica temporal: El Ciclo de Caja",
        "Concepto",
        [
            lambda sid: card_xml(sid, 650000, 1600000, 10890000, 900000, 
                                 "Ciclo de Caja = Período Promedio Inventario (PPI) + Período Promedio Cobro (PPC) - Período Promedio Pago (PPP)", 
                                 title="FÓRMULA DEL CICLO DE CAJA", fill="151E2E", border_color="00D8F6", align="center"),
            lambda sid: card_xml(sid, 650000, 2700000, 3400000, 3300000, 
                                 "• Período Promedio de Inventario (PPI):\n  Días que el stock pasa en bodega.\n  Fórmula:\n  Inventario / (Costo Ventas / 360)\n\n• A menor rotación, mayor es la caja atrapada en stock.", 
                                 title="1. Inventario (PPI)", fill="151E2E", border_color="3B82F6"),
            lambda sid: card_xml(sid, 4395000, 2700000, 3400000, 3300000, 
                                 "• Período Promedio de Cobro (PPC):\n  Días en que los clientes pagan.\n  Fórmula:\n  CxC / (Ventas / 360)\n\n• Plazos más amplios aumentan las necesidades de caja.", 
                                 title="2. Cuentas por Cobrar (PPC)", fill="151E2E", border_color="3B82F6"),
            lambda sid: card_xml(sid, 8140000, 2700000, 3400000, 3300000, 
                                 "• Período Promedio de Pago (PPP):\n  Plazo que nos otorgan proveedores.\n  Fórmula:\n  CxP / (Costo Ventas / 360)\n\n• Actúa como financiamiento directo y reduce el ciclo de caja.", 
                                 title="3. Cuentas por Pagar (PPP)", fill="151E2E", border_color="10B981")
        ]
    ),
    # 5. Concept: FER
    create_slide(
        "Financiamiento Externo Requerido (FER)",
        "Concepto",
        [
            lambda sid: card_xml(sid, 650000, 1600000, 10890000, 900000, 
                                 "FER = (A*/V0) × ΔV  -  (P*/V0) × ΔV  -  [ m × V1 × (1 - d) ]", 
                                 title="FÓRMULA PORCENTAJE DE VENTAS", fill="151E2E", border_color="00D8F6", align="center"),
            lambda sid: card_xml(sid, 650000, 2700000, 3400000, 3300000, 
                                 "• (A*/V0) × ΔV\n\n• A*: Activos que crecen de forma proporcional con las ventas (Caja, CxC, Inventarios).\n\n• Mide la inversión adicional requerida para soportar el nuevo nivel de actividad comercial.", 
                                 title="1. Activos Requeridos", fill="151E2E", border_color="EF4444"),
            lambda sid: card_xml(sid, 4395000, 2700000, 3400000, 3300000, 
                                 "• (P*/V0) × ΔV\n\n• P*: Pasivos espontáneos operacionales (proveedores, provisiones).\n\n• Mide la cantidad de crédito gratuito que nos conceden de forma automática nuestros proveedores.", 
                                 title="2. Financiamiento Espontáneo", fill="151E2E", border_color="10B981"),
            lambda sid: card_xml(sid, 8140000, 2700000, 3400000, 3300000, 
                                 "• m × V1 × (1 - d)\n\n• m: Margen neto.\n• V1: Ventas del próximo año.\n• (1 - d): Tasa de retención de utilidades.\n\n• Mide las utilidades que no se reparten como dividendo y financian internamente.", 
                                 title="3. Utilidades Retenidas", fill="151E2E", border_color="3B82F6")
        ]
    ),
    # 6. Concept: Inventarios y Modelos de Caja
    create_slide(
        "Administración de Inventarios y Modelos de Caja",
        "Concepto",
        [
            lambda sid: card_xml(sid, 650000, 1600000, 5200000, 4400000, 
                                 "• Lote Económico de Compra (EOQ):\n  Determina el volumen óptimo de compra (Q*) que minimiza la suma de costos de ordenar y mantener stock.\n  Fórmula:\n  Q* = sqrt( (2 * D * S) / H )\n  (D: Demanda, S: Costo pedir, H: Costo mantener)\n\n• Punto de Reorden (ROP):\n  Nivel de inventario en el que se debe emitir un nuevo pedido para evitar quiebres de stock.\n  ROP = Demanda Diaria × Tiempo de Entrega (Lead Time)", 
                                 title="GESTIÓN DE STOCK: EOQ", fill="151E2E", border_color="3B82F6"),
            lambda sid: card_xml(sid, 6200000, 1600000, 5200000, 4400000, 
                                 "• Modelo de Baumol:\n  Asume flujos de caja deterministas y predecibles.\n  C* = sqrt( (2 * T * F) / i )\n  Optimiza el saldo óptimo a liquidar de activos líquidos.\n\n• Modelo de Miller-Orr:\n  Para flujos aleatorios e impredecibles.\n  Calcula un límite inferior (mínimo operativo), un nivel de retorno óptimo (Z*) y un límite superior (H*).\n  Z* = ( (3 * F * σ^2) / (4 * r) )^(1/3) + L", 
                                 title="ADMINISTRACIÓN DE CAJA (BAUMOL & MILLER-ORR)", fill="151E2E", border_color="00D8F6")
        ]
    ),
    # 7. Concept: Sartoris-Hill
    create_slide(
        "Política de Crédito Comercial: Sartoris-Hill",
        "Concepto",
        [
            lambda sid: card_xml(sid, 650000, 1600000, 5200000, 4400000, 
                                 "• El otorgamiento de crédito directo es una decisión de inversión que busca incrementar ventas, pero tiene costos asociados.\n\n• Modelo Sartoris-Hill:\n  Evalúa el impacto financiero total mediante el Valor Presente Neto (VPN) de los flujos de caja operacionales.\n\n• Ventajas del Crédito Directo:\n  - Capturar ventas de clientes sin acceso a crédito bancario.\n  - Flexibilidad y fidelización.\n  - Ventajas de información o transacción sobre bancos.", 
                                 title="MODELO DE CRÉDITO DIRECTO", fill="151E2E", border_color="3B82F6"),
            lambda sid: card_xml(sid, 6200000, 1600000, 5200000, 4400000, 
                                 "• Variables críticas del modelo:\n  1. Crecimiento de Ventas (volumen incremental)\n  2. Margen de ganancia o Costo variable\n  3. Período de cobro (días de financiamiento)\n  4. Incobrabilidad (pérdidas de crédito)\n  5. Descuento por pronto pago y su tasa de aceptación\n  6. Tasa de interés diaria (costo de oportunidad)\n\n✓ Regla:\n  Aceptar la nueva política si el VPN_nueva > VPN_actual.", 
                                 title="EVALUACIÓN MEDIANTE VPN", fill="151E2E", border_color="10B981")
        ]
    ),
    # 8. Section 1 Divider: Comentes
    create_section_slide(
        "SECCIÓN 1: COMENTES CONCEPTUALES",
        "Discusión y pautas de preguntas conceptuales tipo certamen"
    ),
    # 9. Comente 1 Pregunta
    create_slide(
        "Comente 1: Ciclo de caja",
        "Comentes",
        [
            lambda sid: card_xml(sid, 1500000, 2000000, 9192000, 3000000, 
                                 "Defina el ciclo de caja y explique cómo afecta la gestión del capital de trabajo.\n\n¿Qué efecto tendría una reducción en el plazo promedio de cuentas por pagar?", 
                                 title="PREGUNTA 1", fill="151E2E", border_color="00D8F6", align="center")
        ]
    ),
    # 10. Comente 1 Solución
    create_slide(
        "Comente 1: Pauta y Justificación",
        "Soluciones Comentes",
        [
            lambda sid: card_xml(sid, 650000, 1600000, 5200000, 4400000, 
                                 "• Definición del Ciclo de Caja:\n  Es el tiempo promedio que transcurre desde que la empresa paga por adquirir materias primas/inventarios hasta que recauda el efectivo de las ventas.\n  Ciclo de Caja = PPI + PPC - PPP\n\n• Impacto en Capital de Trabajo:\n  - Un ciclo de caja más largo incrementa el capital de trabajo neto requerido (atrapa liquidez).\n  - Un ciclo más corto disminuye esta necesidad de fondos, mejorando la liquidez inmediata.", 
                                 title="DEFINICIÓN E IMPACTO", fill="151E2E", border_color="10B981"),
            lambda sid: card_xml(sid, 6200000, 1600000, 5200000, 4400000, 
                                 "• Reducción del plazo de Cuentas por Pagar (PPP baja):\n  - Significa pagar antes a los proveedores.\n  - Al restar un término menor, el Ciclo de Caja TOTAL aumenta.\n\n• Consecuencias:\n  - Exige a la empresa contar con más recursos propios o externos en el corto plazo.\n  - Puede generar tensiones de caja (presión financiera) si no es compensada con mejoras en los días de inventario o cobranza.", 
                                 title="REDUCCIÓN PLAZO PROVEEDORES", fill="1E293B", border_color="EF4444")
        ]
    ),
    # 11. Comente 2 Pregunta
    create_slide(
        "Comente 2: Política de crédito comercial",
        "Comentes",
        [
            lambda sid: card_xml(sid, 1500000, 2000000, 9192000, 3000000, 
                                 "Mencione tres factores que una empresa debe considerar al definir su política de crédito.\n\n¿Por qué algunas empresas prefieren otorgar crédito directamente en lugar de derivar al cliente a una institución financiera?", 
                                 title="PREGUNTA 2", fill="151E2E", border_color="00D8F6", align="center")
        ]
    ),
    # 12. Comente 2 Solución
    create_slide(
        "Comente 2: Pauta y Justificación",
        "Soluciones Comentes",
        [
            lambda sid: card_xml(sid, 650000, 1600000, 5200000, 4400000, 
                                 "• 1. Capacidad de pago del cliente:\n  Evaluación y scoring de riesgo del deudor para evitar un nivel desmedido de incobrabilidad.\n\n• 2. Condiciones comerciales ofrecidas:\n  Determinación de plazos (ej. 30, 60 días), tasas de interés implícitas y descuentos por pronto pago.\n\n• 3. Costos de administración y cobro:\n  Gastos operativos de la oficina de cobranza, comisiones y costos de recuperación judicial.", 
                                 title="FACTORES DE LA POLÍTICA DE CRÉDITO", fill="151E2E", border_color="10B981"),
            lambda sid: card_xml(sid, 6200000, 1600000, 5200000, 4400000, 
                                 "• Incremento de ventas y fidelización:\n  Permite capturar clientes que no tienen acceso a financiamiento bancario formal.\n\n• Flexibilidad comercial:\n  La empresa puede negociar de forma directa condiciones específicas y fechas clave.\n\n• Ventaja en mercados imperfectos:\n  La empresa suele tener menores costos de transacción y mejor información sobre la conducta del cliente que el propio banco comercial.", 
                                 title="RAZONES DEL CRÉDITO DIRECTO", fill="1E293B", border_color="00D8F6")
        ]
    ),
    # 13. Comente 3 Pregunta
    create_slide(
        "Comente 3: Plazos de activos y pasivos",
        "Comentes",
        [
            lambda sid: card_xml(sid, 1500000, 2000000, 9192000, 3000000, 
                                 "\"Siempre será recomendable financiar activos de largo plazo, con pasivos de corto plazo.\"\n\nIndique si la afirmación es Verdadera, Falsa o Depende y justifique.", 
                                 title="PREGUNTA 3", fill="151E2E", border_color="00D8F6", align="center")
        ]
    ),
    # 14. Comente 3 Solución
    create_slide(
        "Comente 3: Pauta y Justificación",
        "Soluciones Comentes",
        [
            lambda sid: card_xml(sid, 1500000, 1800000, 9192000, 3800000, 
                                 "• Calce de Temporalidad:\n  Las empresas deben adecuar el vencimiento de sus fuentes de financiamiento al plazo de maduración de sus inversiones.\n\n• Riesgo del Descalce Financiero:\n  Financiar activos de largo plazo (maquinarias, infraestructura) con deudas de corto plazo expone a la empresa a riesgos de refinanciamiento (renovar deudas a tasas más altas) y asfixia por iliquidez.\n\n✓ Conclusión:\n  Los activos fijos deben estructurarse con financiamiento de largo plazo (deuda a largo plazo o patrimonio), permitiendo que la inversión genere sus retornos antes de que expire la obligación.", 
                                 title="FALSO - PRINCIPIO DE CONFORMIDAD FINANCIERA", fill="151E2E", border_color="EF4444")
        ]
    ),
    # 15. Section 2 Divider: Ejercicios
    create_section_slide(
        "SECCIÓN 2: EJERCICIOS PRÁCTICOS",
        "Resolución matemática y de análisis de casos reales"
    ),
    # 16. Ejercicio 1 Enunciado
    create_slide(
        "Ejercicio 1: FER (TrendGo S.A.)",
        "Ejercicios FER",
        [
            lambda sid: card_xml(sid, 650000, 1600000, 5200000, 4400000, 
                                 "TrendGo S.A. es un e-commerce especializado en ropa de diseñadores independientes.\n\nDATOS OPERATIVOS AÑO 2024:\n• Ventas anuales (V0): $180.000.000\n• Período promedio de cobranza: 40 días\n• Margen neto (m): 6% | Payout (d): 60%\n\nÍTEMS VARIABLES CON LAS VENTAS:\n• Efectivo: 3% | Inventarios: 20%\n• Proveedores (CxP): 6% | Pasivos espontáneos: 3%\n• Cuentas por Cobrar base (CxC): 10%\n\nPLAN DE EXPANSIÓN 2025:\n• Ventas aumentan 20% (ΔV = $36.000.000).\n• El crecimiento se concentra en productos de verano importados, que exigen plazos de cobranza de 60 días.", 
                                 title="TRENDGO S.A. (E-COMMERCE)", fill="151E2E", border_color="3B82F6"),
            lambda sid: card_xml(sid, 6200000, 1600000, 5200000, 4400000, 
                                 "A. Calcule el Financiamiento Externo Requerido (FER) para 2025 asociado al crecimiento proyectado.\n  (Considere año comercial de 360 días).\n\nB. Suponga que toda la cartera de clientes pasa a tener un plazo de cobranza de 60 días (incluyendo las ventas actuales del año base). Calcule el nuevo FER incremental asociado a esta decisión de crédito.", 
                                 title="SE PIDE:", fill="1E293B", border_color="00D8F6")
        ]
    ),
    # 17. Ejercicio 1 Solución
    create_slide(
        "Solución Ejercicio 1: FER (TrendGo S.A.)",
        "Soluciones FER",
        [
            lambda sid: card_xml(sid, 650000, 1600000, 5200000, 4400000, 
                                 "• Ventas Nuevas (ΔV) = $36.000.000\n• Ventas Proyectadas (V1) = $216.000.000\n• CxC Nuevas a 60 días:\n  Rotación = 360/60 = 6 veces al año.\n  CxC Nuevas = $36.000.000 / 6 = $6.000.000.\n  % CxC nuevas sobre ΔV = $6.000.000 / $36.000.000 = 16,66%\n\n• Activos Requeridos Nuevos (A*/V0):\n  Efectivo (3%) + Inventarios (20%) + CxC nuevas (16,66%) = 39,66%\n• Pasivos Espontáneos Nuevos (P*/V0):\n  CxP (6%) + Pasivos espontáneos (3%) = 9,0%\n\n• Utilidades Retenidas Proyectadas:\n  $216.000.000 (V1) × 6% (m) × (1 - 0,60) = $5.184.000\n\n• FER = (39,66% × $36M) - (9,0% × $36M) - $5.184.000\n  = $14.277.600 - $3.240.000 - $5.184.000 = $5.853.600", 
                                 title="PARTE A: CÁLCULO DEL FER 2025", fill="151E2E", border_color="10B981"),
            lambda sid: card_xml(sid, 6200000, 1600000, 5200000, 4400000, 
                                 "• Inversión en CxC con plazo de 40 días:\n  $180.000.000 × (40/360) = $20.000.000\n\n• Inversión en CxC con plazo de 60 días:\n  $180.000.000 × (60/360) = $30.000.000\n\n• Incremento Neto en Activos (atrapa caja):\n  $30.000.000 - $20.000.000 = $10.000.000\n\n✓ FER Adicional = $10.000.000\n\n• Conclusión:\n  Aumentar el plazo de crédito a toda la cartera inmoviliza $10M adicionales de capital de trabajo, los cuales deben financiarse directamente por vía externa, sumándose al FER calculado en A.", 
                                 title="PARTE B: ANÁLISIS DE LA CARTERA TOTAL", fill="1E293B", border_color="00D8F6")
        ]
    ),
    # 18. Ejercicio 2 Enunciado
    create_slide(
        "Ejercicio 2: Inventario (FerreMax Ltda.)",
        "Ejercicios Inventario",
        [
            lambda sid: card_xml(sid, 650000, 1600000, 5200000, 4400000, 
                                 "FerreMax Ltda. comercializa taladros eléctricos importados.\n\nDATOS OPERACIONALES:\n• Demanda mensual promedio: 40 unidades.\n• Precio de venta unitario: $250.000.\n• Margen de ganancia: 40% sobre el precio de venta.\n  (Costo de adquisición = 60% de PV = $150.000).\n\nCOSTOS LOGÍSTICOS:\n• Costo de emisión de pedido (S): $2.000 por orden.\n• Costo anual de mantener inventario (H):\n  5% del valor de adquisición del producto.\n• Tiempo de entrega (Lead Time): 10 días.\n• Calendario comercial: 360 días al año.", 
                                 title="FERREMAX LTDA.", fill="151E2E", border_color="3B82F6"),
            lambda sid: card_xml(sid, 6200000, 1600000, 5200000, 4400000, 
                                 "A. Calcule la Cantidad Económica de Pedido (EOQ - Q*) y determine cuántas órdenes se deben realizar al año.\n\nB. Calcule el Punto de Reorden (ROP) que evite quiebres de inventario.\n\nC. Explique de forma conceptual el impacto de ordenar antes o después del punto de reorden en los costos logísticos y en la rentabilidad del negocio.", 
                                 title="SE PIDE:", fill="1E293B", border_color="00D8F6")
        ]
    ),
    # 19. Ejercicio 2 Solución
    create_slide(
        "Solución Ejercicio 2: Inventario (FerreMax)",
        "Soluciones Inventario",
        [
            lambda sid: card_xml(sid, 650000, 1600000, 5200000, 4400000, 
                                 "• Demanda Anual (D) = 40 × 12 = 480 unidades.\n• Costo de adquisición unitario = $150.000.\n• Costo unitario de mantenimiento (H):\n  5% × $150.000 = $7.500 por unidad/año.\n• Costo de ordenar (S) = $2.000.\n\n• Q* = sqrt( (2 × D × S) / H )\n  Q* = sqrt( (2 × 480 × $2.000) / $7.500 )\n  Q* = sqrt( 1.920.000 / 7.500 ) = sqrt(256)\n  Q* = 16 unidades por pedido.\n\n• Número de pedidos al año:\n  N = D / Q* = 480 / 16 = 30 pedidos al año.", 
                                 title="A. LOTE ECONÓMICO Y NÚMERO DE PEDIDOS", fill="151E2E", border_color="10B981"),
            lambda sid: card_xml(sid, 6200000, 1600000, 5200000, 4400000, 
                                 "• Demanda Diaria (d):\n  480 unidades / 360 días = 1,33 unidades/día.\n• Lead Time (L) = 10 días.\n\n• Punto de Reorden (ROP):\n  ROP = 1,33 unidades/día × 10 días = 13,3 unidades.\n  ✓ ROP ≈ 13 unidades en stock.\n\n• Análisis conceptual:\n  - Pedir antes (con más de 13 unidades): Genera sobrestock innecesario, aumentando el costo de mantenimiento de inventario (H).\n  - Pedir después (con menos de 13 unidades): Provoca quiebre de stock, impidiendo realizar ventas y afectando la rentabilidad y fidelización.", 
                                 title="B Y C. PUNTO DE REORDEN Y ANÁLISIS", fill="1E293B", border_color="00D8F6")
        ]
    ),
    # 20. Ejercicio 3 Enunciado
    create_slide(
        "Ejercicio 3: Política de Crédito (Sartoris-Hill)",
        "Ejercicios Crédito",
        [
            lambda sid: card_xml(sid, 650000, 1600000, 5200000, 4400000, 
                                 "Una empresa vende $120.000.000 anuales a un costo total de $108.000.000 (margen del 10%). Ventas actuales 100% en efectivo.\nSe evalúa otorgar crédito directo, analizando dos consultores:\n\n• CONSULTOR 1:\n  - Ventas aumentan en 300% ($480M total).\n  - 80% crédito a 30 días, 20% al contado.\n  - Estimación de incobrabilidad: 13% sobre ventas a crédito.\n\n• CONSULTOR 2:\n  - Ventas aumentan en 200% ($360M total).\n  - 80% pagará a 30 días, con incobrabilidad del 4%.\n  - 20% pagará a 15 días con 5% de descuento por pronto pago (sin incobrabilidad).\n\n✓ Tasa de interés diaria: 0,09%. Margen: 10%.", 
                                 title="SARTORIS - HILL", fill="151E2E", border_color="3B82F6"),
            lambda sid: card_xml(sid, 6200000, 1600000, 5200000, 4400000, 
                                 "A. Calcule el VPN del escenario actual (base) sin otorgar crédito directo.\n\nB. Calcule el VPN asociado al escenario del Consultor 1.\n\nC. Calcule el VPN asociado al escenario del Consultor 2.\n\nD. Determine cuál política es la mejor opción para la empresa y explique los riesgos clave de la decisión.", 
                                 title="SE PIDE:", fill="1E293B", border_color="00D8F6")
        ]
    ),
    # 21. Ejercicio 3 Solución
    create_slide(
        "Solución Ejercicio 3: Sartoris-Hill",
        "Soluciones Crédito",
        [
            lambda sid: card_xml(sid, 650000, 1600000, 5200000, 4400000, 
                                 "• Escenario Base (100% Contado):\n  V = $120.000.000 | Costos = $108.000.000\n  VPN = $120M - $108M = $12.000.000\n\n• Consultor 1 (Ventas $480M, Costos $432M):\n  - Ventas Contado (20%): $96.000.000\n  - Ventas Crédito (80%): $384.000.000\n  - Incobrabilidad (13%): $49.920.000 (Neto = $334.080.000)\n  - VP Crédito (30 días, k = 0,09%):\n    $334.080.000 / (1,0009)^30 = $325.183.932\n  - VPN = $96M + $325.183.932 - $432M = -$10.816.068", 
                                 title="BASE Y ESCENARIO 1", fill="151E2E", border_color="EF4444"),
            lambda sid: card_xml(sid, 6200000, 1600000, 5200000, 4400000, 
                                 "• Consultor 2 (Ventas $360M, Costos $324M):\n  - Crédito 30 días (80%): $288.000.000 (Incobrable 4%)\n    VP = [ $288M × (1 - 0,04) ] / (1,0009)^30 = $269.117.778\n  - Descuento 15 días (20%): $72.000.000 (Descuento 5%)\n    VP = [ $72M × (1 - 0,05) ] / (1,0009)^15 = $67.482.999\n  - VPN = $269.117.778 + $67.482.999 - $324M = $12.600.777\n\n✓ Decisión y Análisis:\n  - Si interpretamos crecimiento 'sobre el base':\n    El Consultor 2 es el mejor (VPN de $12.600.777 > $12.000.000).\n  - Si interpretamos crecimiento 'absoluto' (Ventas a $360M y $240M):\n    El mejor es el Escenario Base ($12M), pues el Consultor 2 da $8,40M. ¡Dar crédito no siempre conviene!", 
                                 title="ESCENARIO 2 Y COMPARACIÓN", fill="1E293B", border_color="10B981")
        ]
    ),
    # 22. Ejercicio 4 Enunciado
    create_slide(
        "Ejercicio 4: Planificación de Caja",
        "Ejercicios Caja",
        [
            lambda sid: card_xml(sid, 650000, 1600000, 5200000, 4400000, 
                                 "Distribuciones Pacífico Ltda. abastece a minoristas y requiere programar su caja para el año.\n\nDATOS OPERACIONALES:\n• Necesidad de efectivo anual (T): $180.000.000.\n• Costo de transacción de activos (F): $20.000 por orden.\n• Saldo mínimo de efectivo (L): $5.000.000.\n• Volatilidad diaria (desviación estándar σ): $3.100.000.\n• Tasa de interés anual (i): 5,5% (para Baumol).\n• Tasa de interés diaria (r): 0,015% (para Miller-Orr).", 
                                 title="DISTRIBUCIONES PACÍFICO LTDA.", fill="151E2E", border_color="3B82F6"),
            lambda sid: card_xml(sid, 6200000, 1600000, 5200000, 4400000, 
                                 "A. Utilizando el Modelo de Baumol, determine el saldo óptimo de efectivo (C*) y calcule el costo anual de mantenimiento e intermediación.\n\nB. Utilizando el Modelo de Miller-Orr, determine el saldo óptimo de efectivo o nivel de retorno (Z*), el límite superior de efectivo (H*) y elabore el esquema de control.\n\nC. Explique las diferencias en supuestos de ambos modelos.", 
                                 title="SE PIDE:", fill="1E293B", border_color="00D8F6")
        ]
    ),
    # 23. Ejercicio 4 Solución Baumol
    create_slide(
        "Solución Ejercicio 4: Modelo de Baumol",
        "Soluciones Caja",
        [
            lambda sid: card_xml(sid, 650000, 1600000, 5200000, 4400000, 
                                 "• Supuesto clave:\n  Flujos de efectivo predecibles y constantes.\n\n• Saldo Óptimo de Efectivo (C*):\n  C* = sqrt( (2 × T × F) / i )\n  C* = sqrt( (2 × $180M × $20.000) / 0,055 )\n  C* = sqrt( 7.200.000.000.000 / 0,055 )\n  C* = sqrt( 130.909.090.909.091 )\n  ✓ C* = $11.441.551", 
                                 title="CÁLCULO DEL SALDO ÓPTIMO", fill="151E2E", border_color="10B981"),
            lambda sid: card_xml(sid, 6200000, 1600000, 5200000, 4400000, 
                                 "• Costo Anual de Mantener Efectivo:\n  Costo_Mantener = (C* / 2) × i\n  = ($11.441.551 / 2) × 0,055 = $314.643\n\n• Costo Anual de Transacción:\n  Costo_Transacción = (T / C*) × F\n  = ($180.000.000 / $11.441.551) × $20.000 = $314.643\n\n✓ Costo Total Anual = $629.286\n\n(La igualdad de ambos costos confirma que la solución es el mínimo de la curva de costos).", 
                                 title="ANÁLISIS DE COSTOS ANUALES", fill="1E293B", border_color="00D8F6")
        ]
    ),
    # 24. Ejercicio 4 Solución Miller-Orr
    create_slide(
        "Solución Ejercicio 4: Modelo de Miller-Orr",
        "Soluciones Caja",
        [
            lambda sid: card_xml(sid, 650000, 1600000, 5200000, 4400000, 
                                 "• Saldo Óptimo / Retorno (Z*):\n  Z* = [ (3 × F × σ^2) / (4 × r) ]^(1/3) + L\n\n• σ^2 = ($3.100.000)^2 = 9.610.000.000.000\n• 3 × F × σ^2 = 3 × $20.000 × 9,61×10^12 = 5,766×10^17\n• 4 × r = 4 × 0,00015 = 0,0006\n• Z* - L = [ 5,766×10^17 / 0,0006 ]^(1/3) = 9.868.272\n  Z* = 9.868.272 + 5.000.000 = $14.868.272\n\n• Límite Superior de Efectivo (H*):\n  H* = 3 × Z* - 2 × L\n  H* = 3 × (Z* - L) + L\n  H* = 3 × 9.868.272 + 5.000.000 = $34.604.817", 
                                 title="CÁLCULO DE NIVELES (Z* Y H*)", fill="151E2E", border_color="10B981"),
            lambda sid: card_xml(sid, 6200000, 1600000, 5200000, 4400000, 
                                 "• Límite Inferior (L) = $5.000.000\n• Punto de Retorno (Z*) = $14.868.272\n• Límite Superior (H*) = $34.604.817\n\n• Reglas de Decisión:\n  - Si la caja sube a H* ($34.60M), se compra stock de corto plazo por valor H* - Z* = $19.736.545, regresando a Z*.\n  - Si la caja baja a L ($5M), se vende stock por valor Z* - L = $9.868.272, regresando a Z*.\n\n• Contraste Baumol vs Miller-Orr:\n  Baumol asume egresos fijos y predecibles (caja como inventario). Miller-Orr asume que el efectivo sigue un camino aleatorio diario.", 
                                 title="DINÁMICA DE CONTROL", fill="1E293B", border_color="00D8F6")
        ]
    ),
    # 25. Cierre
    create_slide(
        "Conclusiones clave para el Certamen",
        "Cierre",
        [
            lambda sid: card_xml(sid, 650000, 1800000, 3400000, 2900000, 
                                 "No basta con estimar las necesidades de financiamiento. Es vital calzar los vencimientos de la deuda con los plazos de realización de los activos.", 
                                 title="1. CALCE DE PLAZOS", fill="151E2E", border_color="EF4444"),
            lambda sid: card_xml(sid, 4395000, 1800000, 3400000, 2900000, 
                                 "Las cuentas por cobrar son inversiones comerciales. Dar crédito impulsa ventas, pero inmoviliza caja y genera costos de incobrabilidad.", 
                                 title="2. EVALUACIÓN DE CRÉDITO", fill="151E2E", border_color="10B981"),
            lambda sid: card_xml(sid, 8140000, 1800000, 3400000, 2900000, 
                                 "Modelos como Baumol y Miller-Orr nos permiten sistematizar las decisiones de tesorería y minimizar el costo total de la caja.", 
                                 title="3. OPTIMIZACIÓN DE CAJA", fill="151E2E", border_color="3B82F6"),
            lambda sid: card_xml(sid, 650000, 4900000, 10890000, 1100000, 
                                 "¿Cuál de las variables del FER (Margen Neto, Crecimiento o Política de Dividendos) es más fácil de gestionar en la práctica para un directivo?", 
                                 title="PREGUNTA DE REFLEXIÓN FINAL", fill="1E293B", border_color="00D8F6", align="center")
        ]
    )
]


with ZipFile(OUT, "w", ZIP_DEFLATED) as z:
    z.writestr("[Content_Types].xml", content_types(len(slide_deck_xml)))
    z.writestr("_rels/.rels", rels_root())
    z.writestr("docProps/app.xml", app_props(len(slide_deck_xml)))
    z.writestr("docProps/core.xml", core_props())
    z.writestr("ppt/presentation.xml", presentation(len(slide_deck_xml)))
    z.writestr("ppt/_rels/presentation.xml.rels", presentation_rels(len(slide_deck_xml)))
    z.writestr("ppt/theme/theme1.xml", theme())
    z.writestr("ppt/slideMasters/slideMaster1.xml", slide_master())
    z.writestr("ppt/slideMasters/_rels/slideMaster1.xml.rels", '''<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/slideLayout" Target="../slideLayouts/slideLayout1.xml"/><Relationship Id="rId2" Type="http://schemas.openxmlformats.org/officeDocument/2006/theme" Target="../theme/theme1.xml"/></Relationships>''')
    z.writestr("ppt/slideLayouts/slideLayout1.xml", slide_layout())
    z.writestr("ppt/slideLayouts/_rels/slideLayout1.xml.rels", '''<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/slideMaster" Target="../slideMasters/slideMaster1.xml"/></Relationships>''')
    for idx, xml in enumerate(slide_deck_xml, 1):
        z.writestr(f"ppt/slides/slide{idx}.xml", xml)
        z.writestr(f"ppt/slides/_rels/slide{idx}.xml.rels", slide_rels())

print(f"Presentation successfully written to: {OUT.resolve()}")
