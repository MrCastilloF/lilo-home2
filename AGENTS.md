# AGENTS.md · LILO HOME

## Project background

LILO HOME (formerly "Zumbay") is a youth-oriented digital marketing page (in
Spanish) for a small Colombian reseller that sells tech gadgets, kitchen
appliances, beauty tools, and toys. Target users are Spanish-speaking shoppers
who browse on their phone and buy by chatting with the seller. There is no
cart, no checkout, and no payment gateway: the only conversion channel is a
WhatsApp deep link (+57 315 298 5298) with a prefilled message that names the
product.

The page was built from a folder of 68 product photos (all in Colombian
pesos, prices embedded in the images). The hero headline set by the owner is
"Lo Viste, Te encantó, ¡Hazlo TUYO, Antes que VUELE!". Goal for visitors is to
scroll the catalog, filter, and tap "Pedir por WhatsApp" with zero friction.

## Product shape

- Category: static Page (all behavior runs in the browser).
- Single page, sections: hero, benefits chips, catalog (search + category
  filters: Tecnología / Hogar / Juguetes / Belleza), "Cómo comprar" (3 steps),
  "Sobre nosotros", footer, floating WhatsApp button.
- Catalog: 68 products in `src/data.ts`, each with id (`imgNNN`), Spanish
  name, COP price, category, image path `img/...webp` (files in `public/img/`),
  and a `disponible` baseline. Product cards are photo-first and large: 2
  columns on desktop (~550px photos), 1 full-width column on phones; bigger
  names/prices/CTA and larger badges to match. Owner explicitly asked for
  maximum photo size — do not shrink the grid back to dense multi-column
  layouts.
- Stock ("Disponible" green badge / "Agotado" red badge + disabled CTA):
  layered resolution — (1) baseline `disponible` in `src/data.ts`, (2) optional
  `public/productos.json` snapshot fetched at runtime, (3) device-local
  overrides in LocalStorage (`lilohome_stock_v1`). A hash-route stock panel
  (opened only by typing `#panel` in the URL; deliberately no visible link in
  the page so visitors can't discover it) toggles availability, persists to
  LocalStorage, and downloads a fresh `productos.json` for the owner to
  republish at the site root.
- Stock "Agotado": photo desaturated, WhatsApp CTA disabled.
- WhatsApp links: `https://wa.me/573152985298?text=<mensaje>` with the store
  message including product name, formatted price, and reference.
- Design: "sticker pop" neo-brutalist direction — paper background, ink
  borders, hard offset shadows, slightly rotated cards, diagonal marquee;
  Bricolage Grotesque display + Outfit body + Space Mono (prices/eyebrows);
  palette frambuesa/lima/ciano/sol. Responsive down to 320px, reduced-motion
  support, SEO metadata in Spanish, descriptive alt text, keyboard focus.
- Rendering: static React build via Vite (`npm run build` → `dist/`).
  Reference: `qw-pages-code` static template contract (keep Vite, keep
  typecheck/tests passing).