from __future__ import annotations

import json
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont


ROOT = Path(r"C:\Users\viker\Desktop\web-dismec")
SITE_ROOT = ROOT / "web-dismec" / "WEB DISMEK"
ASSETS = SITE_ROOT / "assets"
SERVICES_DIR = SITE_ROOT / "servicios"
SITE_URL = "https://vikernes11.github.io/dismec"
LASTMOD = "2026-04-20"


PAGES = [
    {
        "slug": "recipientes-presion-asme",
        "title": "Diseño de recipientes a presión ASME en Colombia",
        "menu": "Recipientes a presión ASME",
        "hero": "Diseño de recipientes a presión bajo ASME para proyectos industriales",
        "meta": "DISMEK desarrolla diseño de recipientes a presión ASME en Colombia: cálculos, boquillas, soportes, MDMT, MAWP, planos y Data Book técnico.",
        "summary": "Servicio de ingeniería para recipientes a presión con documentación lista para fabricación, revisión técnica y procesos de certificación.",
        "image": "recipiente_2.png",
        "highlights": [
            "Cálculo de espesores, tapas, boquillas y refuerzos.",
            "Análisis de MAWP, MDMT y condiciones de presión externa.",
            "Diseño de faldones, silletas, anillos rigidizadores y soportes.",
            "Planos de fabricación y Data Book técnico para inspección.",
        ],
        "deliverables": [
            "Memorias de cálculo.",
            "Planos generales y de detalle.",
            "Hojas de datos.",
            "Base documental para fabricación e inspección.",
        ],
        "norms": ["ASME BPVC Sección VIII", "ASME B31.3", "API", "WRC 107 / 537", "TEMA"],
    },
    {
        "slug": "energia-solar-fotovoltaica",
        "title": "Diseño de sistemas solares fotovoltaicos en Bucaramanga y Colombia",
        "menu": "Sistemas solares",
        "hero": "Ingeniería solar fotovoltaica para proyectos residenciales, comerciales e industriales",
        "meta": "DISMEK diseña sistemas solares fotovoltaicos On-Grid y Off-Grid en Bucaramanga y Colombia con planos, memorias, protecciones y soporte técnico.",
        "summary": "Ingeniería para estructurar proyectos solares con mejor soporte técnico, cumplimiento normativo y documentación para presentación y ejecución.",
        "image": "solar2.png",
        "highlights": [
            "Dimensionamiento On-Grid y Off-Grid.",
            "Selección de equipos, protecciones y cableado.",
            "Análisis de sombreado y simulación de producción.",
            "Documentación técnica para autogeneración y conexión.",
        ],
        "deliverables": [
            "Planos eléctricos unifilares y de instalación.",
            "Memorias de cálculo.",
            "Simulación energética.",
            "Soporte documental para trámite técnico.",
        ],
        "norms": ["Ley 1715", "Ley 2099", "RETIE", "NTC 2050", "NTC 5899", "IEC 61215", "IEC 61730"],
    },
    {
        "slug": "sistemas-hvac-y-mep",
        "title": "Diseño HVAC y coordinación MEP para edificaciones y hospitales",
        "menu": "HVAC y MEP",
        "hero": "Diseño HVAC, coordinación MEP y soporte técnico para edificaciones exigentes",
        "meta": "DISMEK diseña sistemas HVAC y coordina ingeniería MEP para edificios comerciales, hospitales e industria con cálculos, ductos, tuberías y BIM.",
        "summary": "Soluciones de climatización y coordinación técnica para proyectos comerciales, hospitalarios e industriales con criterios de eficiencia y compatibilidad entre disciplinas.",
        "image": "hvac.png",
        "highlights": [
            "Cálculo de cargas térmicas.",
            "Diseño de ductería, tuberías y selección de equipos.",
            "Coordinación BIM con arquitectura, estructura y redes.",
            "Apoyo técnico para proyectos hospitalarios y redes especiales.",
        ],
        "deliverables": [
            "Planos de climatización.",
            "Especificaciones técnicas.",
            "Memorias y criterios de diseño.",
            "Coordinación de interferencias entre disciplinas.",
        ],
        "norms": ["ASHRAE", "Buenas prácticas BIM", "Criterios de eficiencia energética"],
    },
    {
        "slug": "diseno-electrico-y-energia",
        "title": "Diseño eléctrico industrial y de potencia en Bucaramanga",
        "menu": "Diseño eléctrico",
        "hero": "Diseño eléctrico industrial, comercial y de potencia con documentación clara",
        "meta": "DISMEK desarrolla diseño eléctrico industrial y de potencia en Bucaramanga y Colombia: tableros, subestaciones, iluminación, protecciones y RETIE.",
        "summary": "Servicio orientado a proyectos que necesitan planos, cuadros de carga, rutas, protecciones y criterios normativos desde la ingeniería.",
        "image": "design_electrico.png",
        "highlights": [
            "Diagramas unifilares y cuadros de carga.",
            "Diseño de iluminación interior y exterior.",
            "Puestas a tierra, canalizaciones y protección contra rayos.",
            "Subestaciones, tableros y criterios de coordinación de protecciones.",
        ],
        "deliverables": [
            "Planos eléctricos.",
            "Memorias y criterios técnicos.",
            "Listados de carga y equipos.",
            "Soporte para ejecución y revisión técnica.",
        ],
        "norms": ["RETIE", "NTC 2050", "IEC", "Buenas prácticas de diseño eléctrico"],
    },
    {
        "slug": "estructuras-metalicas-y-diseno-estructural",
        "title": "Diseño de estructuras metálicas y estructurales en Colombia",
        "menu": "Estructuras",
        "hero": "Diseño de estructuras metálicas y estructurales para industria y edificaciones",
        "meta": "DISMEK desarrolla diseño de estructuras metálicas y estructurales en Colombia: modelado, análisis, conexiones, planos de taller y criterios NSR-10.",
        "summary": "Apoyo estructural para proyectos industriales, edificaciones y obras que requieren modelado, análisis, detallado y documentación ejecutable.",
        "image": "structures.png",
        "highlights": [
            "Modelado 3D y análisis estructural.",
            "Diseño de conexiones soldadas y apernadas.",
            "Planos de taller, montaje y listas de materiales.",
            "Diseño estructural con criterios sismorresistentes.",
        ],
        "deliverables": [
            "Planos estructurales y de taller.",
            "Memorias de cálculo.",
            "Listados de materiales y cortes.",
            "Criterios para montaje y fabricación.",
        ],
        "norms": ["NSR-10", "AISC", "AWS", "ACI 318"],
    },
]


CSS = """
:root {
  --navy: #0a1628;
  --navy-light: #1a2d4a;
  --accent: #f97316;
  --blue: #3b82f6;
  --surface: #ffffff;
  --surface-alt: #f8fafc;
  --text: #1f2937;
  --muted: #64748b;
  --border: #e2e8f0;
  --radius: 18px;
}
* { box-sizing: border-box; }
html { scroll-behavior: smooth; }
body {
  margin: 0;
  font-family: "Segoe UI", Arial, sans-serif;
  color: var(--text);
  background: linear-gradient(180deg, #ffffff 0%, #f8fafc 100%);
  line-height: 1.65;
}
a { color: inherit; text-decoration: none; }
img { max-width: 100%; display: block; }
.shell { width: min(1120px, calc(100% - 32px)); margin: 0 auto; }
.topbar {
  position: sticky;
  top: 0;
  z-index: 50;
  background: rgba(10, 22, 40, 0.94);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid rgba(255,255,255,0.08);
}
.topbar-inner {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
  padding: 14px 0;
}
.brand {
  display: flex;
  align-items: center;
  gap: 14px;
  color: white;
  font-weight: 700;
}
.brand img { width: 46px; height: 46px; object-fit: contain; }
.topnav { display: flex; gap: 18px; flex-wrap: wrap; }
.topnav a { color: rgba(255,255,255,0.8); font-size: 14px; }
.topnav a:hover { color: white; }
.hero {
  padding: 74px 0 42px;
}
.hero-grid {
  display: grid;
  grid-template-columns: 1.2fr 0.8fr;
  gap: 28px;
  align-items: center;
}
.hero-copy {
  background: radial-gradient(circle at top right, rgba(249,115,22,0.18), transparent 32%), linear-gradient(135deg, var(--navy), var(--navy-light));
  color: white;
  border-radius: 28px;
  padding: 38px;
  box-shadow: 0 22px 60px rgba(10,22,40,0.18);
}
.eyebrow {
  display: inline-block;
  padding: 8px 14px;
  border-radius: 999px;
  background: rgba(249,115,22,0.18);
  color: #fdba74;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}
.hero h1 {
  font-size: clamp(2rem, 3.8vw, 3.4rem);
  line-height: 1.08;
  margin: 16px 0 14px;
}
.hero p { color: rgba(255,255,255,0.82); font-size: 1.04rem; }
.hero-actions {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  margin-top: 26px;
}
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 13px 20px;
  border-radius: 12px;
  font-weight: 700;
}
.btn-primary { background: var(--accent); color: white; }
.btn-secondary { background: rgba(255,255,255,0.14); color: white; border: 1px solid rgba(255,255,255,0.14); }
.hero-card {
  background: white;
  border-radius: 28px;
  overflow: hidden;
  border: 1px solid var(--border);
  box-shadow: 0 18px 50px rgba(15, 23, 42, 0.10);
}
.hero-card img { aspect-ratio: 4/4.1; object-fit: cover; width: 100%; }
section { padding: 20px 0 48px; }
.section-title {
  font-size: clamp(1.6rem, 2.8vw, 2.25rem);
  line-height: 1.15;
  margin: 0 0 12px;
  color: var(--navy);
}
.lead { color: var(--muted); max-width: 850px; }
.grid-2 {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
  margin-top: 26px;
}
.card {
  background: white;
  border: 1px solid var(--border);
  border-radius: 22px;
  padding: 24px;
  box-shadow: 0 12px 32px rgba(15, 23, 42, 0.05);
}
.card h2, .card h3 { margin-top: 0; color: var(--navy); }
.list {
  padding-left: 18px;
  margin: 0;
}
.list li { margin-bottom: 10px; }
.badge-row {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 18px;
}
.badge {
  background: #eff6ff;
  color: #1d4ed8;
  border: 1px solid #bfdbfe;
  padding: 8px 12px;
  border-radius: 999px;
  font-size: 13px;
  font-weight: 600;
}
.cta {
  background: linear-gradient(135deg, var(--navy), var(--navy-light));
  color: white;
  border-radius: 28px;
  padding: 30px;
  margin-top: 32px;
}
.cta p { color: rgba(255,255,255,0.8); }
.footer {
  padding: 28px 0 48px;
  color: var(--muted);
  font-size: 14px;
}
.service-links {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 12px;
  margin-top: 18px;
}
.service-link {
  background: white;
  border: 1px solid var(--border);
  border-radius: 14px;
  padding: 14px 16px;
  font-weight: 600;
}
.service-link:hover {
  border-color: #cbd5e1;
  box-shadow: 0 8px 18px rgba(15, 23, 42, 0.06);
}
@media (max-width: 840px) {
  .hero-grid, .grid-2 { grid-template-columns: 1fr; }
  .topbar-inner { align-items: flex-start; flex-direction: column; }
}
"""


def ensure_dirs() -> None:
    SERVICES_DIR.mkdir(parents=True, exist_ok=True)


def write_styles() -> None:
    (SERVICES_DIR / "styles.css").write_text(CSS.strip() + "\n", encoding="utf-8")


def service_nav(current_slug: str) -> str:
    links = []
    for page in PAGES:
        href = f"{page['slug']}.html"
        style = ' style="color:#fff;"' if page["slug"] == current_slug else ""
        links.append(f'<a href="{href}"{style}>{page["menu"]}</a>')
    return "\n          ".join(links)


def service_cards(current_slug: str) -> str:
    cards = []
    for page in PAGES:
        if page["slug"] == current_slug:
            continue
        cards.append(f'<a class="service-link" href="{page["slug"]}.html">{page["menu"]}</a>')
    return "\n          ".join(cards)


def build_page(page: dict) -> str:
    page_url = f"{SITE_URL}/servicios/{page['slug']}.html"
    image_url = f"{SITE_URL}/assets/{page['image']}"
    highlights = "\n".join(f"<li>{item}</li>" for item in page["highlights"])
    deliverables = "\n".join(f"<li>{item}</li>" for item in page["deliverables"])
    norms = "\n".join(f'<span class="badge">{item}</span>' for item in page["norms"])
    related = service_cards(page["slug"])

    ld_json = {
        "@context": "https://schema.org",
        "@type": "Service",
        "name": page["title"],
        "serviceType": page["menu"],
        "provider": {
            "@type": "ProfessionalService",
            "name": "DISMEK Ingeniería",
            "url": SITE_URL,
            "telephone": "+57 315 663 7925",
            "email": "contacto.dismec@gmail.com",
            "address": {
                "@type": "PostalAddress",
                "addressLocality": "Bucaramanga",
                "addressRegion": "Santander",
                "addressCountry": "CO",
            },
        },
        "areaServed": ["Bucaramanga", "Santander", "Colombia"],
        "description": page["meta"],
        "url": page_url,
        "image": image_url,
    }

    return f"""<!DOCTYPE html>
<html lang="es-CO">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>{page["title"]} | DISMEK Ingeniería</title>
  <meta name="description" content="{page["meta"]}">
  <meta name="robots" content="index,follow,max-snippet:-1,max-image-preview:large,max-video-preview:-1">
  <link rel="canonical" href="{page_url}">
  <link rel="icon" type="image/png" href="../favicon-32x32.png">
  <link rel="apple-touch-icon" href="../apple-touch-icon.png">
  <link rel="stylesheet" href="styles.css">
  <meta property="og:type" content="website">
  <meta property="og:locale" content="es_CO">
  <meta property="og:site_name" content="DISMEK Ingeniería">
  <meta property="og:title" content="{page["title"]}">
  <meta property="og:description" content="{page["meta"]}">
  <meta property="og:url" content="{page_url}">
  <meta property="og:image" content="{image_url}">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="{page["title"]}">
  <meta name="twitter:description" content="{page["meta"]}">
  <meta name="twitter:image" content="{image_url}">
  <script type="application/ld+json">{json.dumps(ld_json, ensure_ascii=False)}</script>
</head>
<body>
  <header class="topbar">
    <div class="shell topbar-inner">
      <a class="brand" href="../index.html">
        <img src="../assets/dismek-logo-badge.png" alt="Logo DISMEK Ingeniería">
        <span>DISMEK Ingeniería</span>
      </a>
      <nav class="topnav">
        <a href="../index.html">Inicio</a>
        {service_nav(page["slug"])}
      </nav>
    </div>
  </header>

  <main class="hero">
    <div class="shell hero-grid">
      <div class="hero-copy">
        <span class="eyebrow">Servicio especializado</span>
        <h1>{page["hero"]}</h1>
        <p>{page["summary"]}</p>
        <div class="hero-actions">
          <a class="btn btn-primary" href="https://wa.me/573156637925?text=Hola%20DISMEK%2C%20quiero%20cotizar%20{page["menu"].replace(" ", "%20")}">Cotizar por WhatsApp</a>
          <a class="btn btn-secondary" href="../index.html#contacto">Formulario de contacto</a>
        </div>
      </div>
      <div class="hero-card">
        <img src="../assets/{page["image"]}" alt="{page["menu"]} - DISMEK Ingeniería" loading="eager">
      </div>
    </div>
  </main>

  <section>
    <div class="shell">
      <h2 class="section-title">Qué incluye este servicio</h2>
      <p class="lead">DISMEK presta este servicio desde Bucaramanga para clientes en Santander, Colombia y proyectos con soporte remoto en otras regiones.</p>
      <div class="grid-2">
        <article class="card">
          <h3>Alcance destacado</h3>
          <ul class="list">
            {highlights}
          </ul>
        </article>
        <article class="card">
          <h3>Entregables frecuentes</h3>
          <ul class="list">
            {deliverables}
          </ul>
        </article>
      </div>
    </div>
  </section>

  <section>
    <div class="shell">
      <div class="grid-2">
        <article class="card">
          <h3>Enfoque técnico</h3>
          <p>El trabajo se orienta a producir ingeniería clara, documentada y utilizable para revisión, compra, fabricación, instalación o ejecución, según la necesidad del proyecto.</p>
          <div class="badge-row">
            {norms}
          </div>
        </article>
        <article class="card">
          <h3>También puede interesarte</h3>
          <p>Si tu proyecto combina varias disciplinas, revisa estos servicios relacionados para estructurar mejor el alcance.</p>
          <div class="service-links">
            {related}
          </div>
        </article>
      </div>
      <div class="cta">
        <h3>¿Quieres una propuesta técnica para este servicio?</h3>
        <p>DISMEK puede revisar tu alcance, ayudarte a aterrizar entregables y preparar una propuesta ajustada a tu proyecto.</p>
        <div class="hero-actions">
          <a class="btn btn-primary" href="mailto:contacto.dismec@gmail.com?subject=Cotización%20{page["menu"].replace(" ", "%20")}">Solicitar cotización</a>
          <a class="btn btn-secondary" href="https://www.instagram.com/dis_mec" target="_blank" rel="noopener">Ver Instagram</a>
        </div>
      </div>
    </div>
  </section>

  <footer class="footer">
    <div class="shell">
      DISMEK Ingeniería · Bucaramanga, Santander, Colombia · WhatsApp: +57 315 663 7925 · contacto.dismec@gmail.com
    </div>
  </footer>
</body>
</html>
"""


def write_pages() -> None:
    for page in PAGES:
        html = build_page(page)
        (SERVICES_DIR / f"{page['slug']}.html").write_text(html, encoding="utf-8")

    index_links = "\n".join(
        f'<a class="service-link" href="{page["slug"]}.html">{page["menu"]}</a>' for page in PAGES
    )
    services_index = f"""<!DOCTYPE html>
<html lang="es-CO">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Servicios de ingeniería | DISMEK Ingeniería</title>
  <meta name="description" content="Páginas de servicios de DISMEK Ingeniería: recipientes a presión ASME, solar fotovoltaica, HVAC, diseño eléctrico y estructuras.">
  <meta name="robots" content="index,follow">
  <link rel="canonical" href="{SITE_URL}/servicios/">
  <link rel="stylesheet" href="styles.css">
</head>
<body>
  <header class="topbar">
    <div class="shell topbar-inner">
      <a class="brand" href="../index.html">
        <img src="../assets/dismek-logo-badge.png" alt="Logo DISMEK Ingeniería">
        <span>DISMEK Ingeniería</span>
      </a>
      <nav class="topnav"><a href="../index.html">Inicio</a></nav>
    </div>
  </header>
  <main class="hero">
    <div class="shell">
      <div class="hero-copy">
        <span class="eyebrow">Servicios indexables</span>
        <h1>Servicios clave para búsquedas en Google</h1>
        <p>Estas páginas están diseñadas para que Google entienda mejor la oferta técnica de DISMEK y para que los usuarios lleguen a servicios concretos.</p>
        <div class="service-links">{index_links}</div>
      </div>
    </div>
  </main>
</body>
</html>
"""
    (SERVICES_DIR / "index.html").write_text(services_index, encoding="utf-8")


def make_square_logo() -> Image.Image:
    source = Image.open(ASSETS / "dismec_logo 1.png").convert("RGBA")
    canvas = Image.new("RGBA", (512, 512), "#0a1628")
    scale = min(360 / source.size[0], 360 / source.size[1])
    resized = source.resize((int(source.size[0] * scale), int(source.size[1] * scale)))
    x = (512 - resized.size[0]) // 2
    y = (512 - resized.size[1]) // 2
    canvas.alpha_composite(resized, (x, y))

    try:
        font = ImageFont.truetype(r"C:\Windows\Fonts\bahnschrift.ttf", 40)
    except Exception:
        font = ImageFont.load_default()
    draw = ImageDraw.Draw(canvas)
    draw.text((105, 432), "DISMEK", font=font, fill="#ffffff")
    return canvas


def write_icons_and_manifest() -> None:
    logo = make_square_logo()
    for size, filename in [
        (16, "favicon-16x16.png"),
        (32, "favicon-32x32.png"),
        (180, "apple-touch-icon.png"),
        (192, "android-chrome-192x192.png"),
        (512, "android-chrome-512x512.png"),
    ]:
        logo.resize((size, size)).save(SITE_ROOT / filename)
    logo.resize((64, 64)).save(SITE_ROOT / "favicon.ico")

    manifest = {
        "name": "DISMEK Ingeniería",
        "short_name": "DISMEK",
        "start_url": "/dismec/",
        "display": "standalone",
        "background_color": "#0a1628",
        "theme_color": "#0a1628",
        "icons": [
            {"src": "/dismec/android-chrome-192x192.png", "sizes": "192x192", "type": "image/png"},
            {"src": "/dismec/android-chrome-512x512.png", "sizes": "512x512", "type": "image/png"},
        ],
    }
    (SITE_ROOT / "site.webmanifest").write_text(json.dumps(manifest, ensure_ascii=False, indent=2), encoding="utf-8")


def write_robots_and_sitemap() -> None:
    robots = f"""User-agent: *
Allow: /

Sitemap: {SITE_URL}/sitemap.xml
"""
    (SITE_ROOT / "robots.txt").write_text(robots, encoding="utf-8")

    urls = [f"{SITE_URL}/", f"{SITE_URL}/servicios/"] + [
        f"{SITE_URL}/servicios/{page['slug']}.html" for page in PAGES
    ]
    body = "\n".join(
        f"""  <url>
    <loc>{url}</loc>
    <lastmod>{LASTMOD}</lastmod>
  </url>"""
        for url in urls
    )
    sitemap = f"""<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
{body}
</urlset>
"""
    (SITE_ROOT / "sitemap.xml").write_text(sitemap, encoding="utf-8")


def main() -> None:
    ensure_dirs()
    write_styles()
    write_pages()
    write_icons_and_manifest()
    write_robots_and_sitemap()


if __name__ == "__main__":
    main()
