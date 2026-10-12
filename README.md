# LILO HOME — Catálogo con pedidos por WhatsApp

Página de catálogo (español, responsive) para tecnología, hogar, belleza y
juguetes. Sin carrito ni pagos: el único canal es WhatsApp
(+57 315 298 5298) con mensaje prellenado por producto.

En vivo en: **https://serkt526.qwenwork.page/**

## Requisitos

Node.js 22 o superior (https://nodejs.org).

## Comandos

```bash
npm install        # dependencias (una vez)
npm run dev        # desarrollo → http://localhost:5173
npm run build      # compila la web a dist/
npm test           # build + verificación del artefacto
npm run preview    # ver el build final (dist/) en local
```

La carpeta `dist/` resultante se puede subir a cualquier hosting estático
(Netlify, Vercel, GitHub Pages, cPanel): es solo HTML, CSS, JS e imágenes.

## Cómo está organizado

| Ruta | Qué contiene |
|---|---|
| `src/data.ts` | Los 68 productos (id, nombre, precio COP, categoría, foto, disponible) |
| `public/img/` | Fotos de producto en formato WebP |
| `public/productos.json` | ⭐ Estado de stock publicado (este archivo manda, sin recompilar) |
| `src/components.tsx` | Hero, beneficios, pasos, nosotros, footer |
| `src/App.tsx` | Catálogo, buscador, filtros y panel de stock |
| `src/styles.css` | Diseño responsive completo |

## Cambiar el stock (Disponible / Agotado)

### Para verlo solo en tu teléfono o PC (inmediato, privado)

1. Abre `https://serkt526.qwenwork.page/#panel` (el panel no tiene enlace visible a propósito)
2. Cambia los interruptores

### Para que lo vean tus clientes (todo el mundo)

1. En el `#panel` ajusta y pulsa **"Descargar productos.json actualizado"**
2. Sube ese archivo a `public/productos.json` en esta repo (reemplázalo), haz commit y publica (o pídele al agente que lo publique)

*Explicación técnica:* la resolución del stock es por capas: valor base de
`src/data.ts` → `public/productos.json` (si existe al servir la web, lo que
se sirve) → LocalStorage del dispositivo. republicación.

## Bonus: hosting automático en GitHub Pages

Este repo ya incluye el workflow `.github/workflows/deploy.yml`:

1. En tu repo, ve a **Settings → Pages → Source: GitHub Actions** y guarda
2. A partir de ahí, **cada `git push` a `main`** compila y publica solo
3. La URL queda en `https://TU-USUARIO.github.io/lilo-home/`

El build usa `base: "./"` a propósito: el mismo `dist/` funciona igual en la
raíz de un dominio (tu página principal) o dentro de la ruta de GitHub Pages.

El panel de stock, fotos y WhatsApp funcionan también en esa URL espejo.
Tu página principal sigue siendo **https://serkt526.qwenwork.page/** —
GitHub Pages es tu respaldo automático y gratis.

## Cambiar textos, precios o agregar productos

1. Productos nuevos: coloca la foto cuadrada en `public/img/` y añade el
   objeto a la lista en `src/data.ts` (mismo formato) y también a
   `public/productos.json` con `disponible: true`
2. Nombres de tienda / WhatsApp: bloque `CONFIG` al inicio de `src/data.ts`
3. Titulares y textos: `index.html`, `src/components.tsx` y `src/App.tsx`

## Ver el historial de cambios del proyecto

```bash
git config --local core.ignoredFile .git/info/exclude  # activar en tu clon
git log --oneline --stat
```

## Notas

- Las fotos WebP miden 700px de lado (óptimas para web)
- El diseño respeta `prefers-reduced-motion` (personas con mareo por animaciones)
- El panel de stock no pide PIN; al no tener enlace visible, solo abre con `#panel`.
  Si algún día necesitas candado real, pide una página dinámica con acceso restringido
