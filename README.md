# javierleon.dev

Sitio estático para marca personal de Javier León.

## Estructura

- `index.html`: landing principal (Servicios, Proyectos, Enfoque, Contacto)
- `assets/css/styles.css`: estilos base y componentes
- `assets/js/main.js`: comportamiento ligero (menú móvil, año dinámico)
- `assets/favicon.svg`: ícono del sitio
- `manifest.webmanifest`, `robots.txt`, `sitemap.xml`, `.nojekyll`

## Contenido a personalizar

- En `index.html`:
  - Título, descripción y metaetiquetas del `<head>`
  - Textos de cada sección (Servicios, Proyectos, Enfoque)
  - Email de contacto en la sección `Contacto` (buscar `mailto:`)
  - Enlace de agenda (ej: Calendly)
- En `sitemap.xml`: URL pública si usas dominio propio
- Opcional: agrega un `CNAME` con tu dominio si usas GitHub Pages con dominio personalizado
- Imagen OG/Twitter en `assets/img/og-image.svg` (recomendado reemplazar por PNG 1200×630 para mejor compatibilidad en redes)

## Publicar en GitHub Pages

1. Sube a GitHub los cambios en `main`.
2. En la configuración del repositorio (Settings → Pages):
   - "Build and deployment" → Source: selecciona `Deploy from a branch`
   - Branch: `main` y carpeta `/ (root)`
3. Guarda. GitHub generará la URL pública en unos minutos.

Si usas dominio propio (ej: `javierleon.dev`):

- Crea un archivo `CNAME` en la raíz con el dominio
- Configura un registro `A` o `CNAME` en tu DNS según la guía oficial de Pages

## Desarrollo local

Abre `index.html` directamente en tu navegador o sirve el directorio con cualquier servidor estático.

Ejemplos:

```bash
python3 -m http.server 3000
# o
npx serve . -l 3000 --single
```

## Licencia

Ver `LICENSE`.
