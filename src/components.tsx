import type { ReactNode } from "react";
import { CONFIG, type Producto } from "./data";

/* -----------------------------------------------------------
   Piezas visuales compartidas de la página (iconos y secciones)
   ----------------------------------------------------------- */

export function WaIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path
        fill="currentColor"
        d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2Zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1-.2.2-.6.8-.8 1-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.3-.4 0-.6.1-.8l.5-.6c.1-.2.2-.3.3-.5v-.5c0-.1-.5-1.3-.8-1.8-.2-.4-.4-.4-.6-.4h-.5c-.2 0-.5.1-.7.3-.2.3-.9.9-.9 2.2s.9 2.5 1.1 2.7a13 13 0 0 0 4.9 4.1c.7.3 1.2.5 1.6.6.7.2 1.3.2 1.8.1.5-.1 1.5-.6 1.8-1.2.2-.6.2-1.1.2-1.2l-.3-.2Z"
      />
    </svg>
  );
}

export function waEnlace(producto?: Producto): string {
  const base = `https://wa.me/${CONFIG.whatsapp}`;
  if (!producto) {
    return base + "?text=" + encodeURIComponent(
      `¡Hola! Vengo del catálogo de ${CONFIG.nombreTienda} y quiero saber más de sus productos 😄`
    );
  }
  const msg =
    `¡Hola! Me interesa este producto de ${CONFIG.nombreTienda}:\n\n` +
    `🛍️ *${producto.nombre}*\n💰 ${formatoCOP.format(producto.precio)}` +
    `\n📦 Ref: ${producto.id}\n\n¿Sigue disponible?`;
  return base + "?text=" + encodeURIComponent(msg);
}

export const formatoCOP = new Intl.NumberFormat("es-CO", {
  style: "currency",
  currency: "COP",
  maximumFractionDigits: 0,
});

const Dot = ({ color }: { color: "ciano" | "frambuesa" | "sol" | "limao" }) => (
  <span className={`dot dot-${color}`} aria-hidden="true" />
);

export function Eyebrow({ color, children }: { color: "ciano" | "frambuesa" | "sol" | "limao"; children: ReactNode }) {
  return (
    <p className="eyebrow">
      <Dot color={color} />
      {children}
    </p>
  );
}

/* ---------- Header ---------- */
export function Topbar() {
  return (
    <header className="topbar">
      <div className="wrap topbar-in">
        <a className="brand" href="#inicio" aria-label="LILO HOME, inicio">
          <span className="brand-badge" aria-hidden="true">L</span>
          <span className="brand-name">LILO HOME<em>.</em></span>
        </a>
        <nav className="nav" aria-label="Navegación principal">
          <a href="#catalogo">Catálogo</a>
          <a href="#beneficios">Beneficios</a>
          <a href="#como-comprar">Cómo comprar</a>
          <a href="#nosotros">Nosotros</a>
        </nav>
        <a href={waEnlace()} className="btn btn-whatsapp btn-small" aria-label="Escríbenos por WhatsApp">
          <WaIcon />
          Escríbenos
        </a>
      </div>
    </header>
  );
}

/* ---------- Hero ---------- */
export function Hero({ total }: { total: number }) {
  return (
    <section className="hero" id="inicio" aria-labelledby="hero-title">
      <div className="wrap hero-grid">
        <div className="hero-copy">
          <Eyebrow color="ciano">Catálogo nuevo · Pide por WhatsApp</Eyebrow>
          <h1 id="hero-title">
            Lo Viste, Te encantó, ¡Hazlo <span className="hl hl-frambuesa">TUYO</span>, Antes que <span className="hl hl-limao">VUELE!</span>
          </h1>
          <p className="hero-sub">
            Tecnología, hogar, belleza y juguetes con precios que dan gusto. Eliges en el catálogo,
            nos escribes por WhatsApp y lo tienes en tu casa.
          </p>
          <div className="hero-ctas">
            <a className="btn btn-ink" href="#catalogo">Ver catálogo <span aria-hidden="true">↓</span></a>
            <a className="btn btn-whatsapp" href={waEnlace()}>
              <WaIcon />
              Pedir por WhatsApp
            </a>
          </div>
          <ul className="hero-minis" aria-label="Resumen">
            <li><span className="mini-num">{total}</span> productos</li>
            <li><span className="mini-dot" aria-hidden="true" />Respuesta <strong>1 a 1</strong></li>
            <li><span className="mini-dot" aria-hidden="true" />Envíos a <strong>toda Colombia</strong></li>
          </ul>
        </div>

        <div className="hero-stickers" aria-hidden="true">
          <figure className="sticker sticker-a">
            <img src="img/img001.webp" alt="" width="700" height="700" fetchPriority="high" />
            <figcaption><strong>Parlante T&amp;G Mini</strong><span>$80.000</span></figcaption>
          </figure>
          <figure className="sticker sticker-b">
            <img src="img/img035.webp" alt="" width="700" height="700" fetchPriority="high" />
            <figcaption><strong>Audífonos RGB</strong><span>$120.000</span></figcaption>
            <span className="badge-rot badge-lima">NUEVO</span>
          </figure>
          <figure className="sticker sticker-c">
            <img src="img/img013.webp" alt="" width="700" height="700" fetchPriority="high" />
            <figcaption><strong>Batidora de pedestal</strong><span>$185.000</span></figcaption>
          </figure>
          <span className="star star-1" aria-hidden="true">✦</span>
          <span className="star star-2" aria-hidden="true">✧</span>
          <span className="speech speech-1">¡Apúrate, se van!</span>
        </div>
      </div>

      <div className="marquee" aria-hidden="true">
        <div className="marquee-track">
          <span>ENVÍOS A TODO COLOMBIA ✦ PIDE POR WHATSAPP ✦ NUEVOS PRODUCTOS CADA SEMANA ✦</span>
          <span>ENVÍOS A TODO COLOMBIA ✦ PIDE POR WHATSAPP ✦ NUEVOS PRODUCTOS CADA SEMANA ✦</span>
        </div>
      </div>
    </section>
  );
}

/* ---------- Beneficios ---------- */
export function Beneficios() {
  return (
    <section className="beneficios wrap" id="beneficios" aria-label="Beneficios">
      <div className="chips-chips">
        <div className="chip chip-lima"><span>🚚</span> Envío a toda Colombia</div>
        <div className="chip chip-cian"><span>💬</span> Atención 1 a 1 por WhatsApp</div>
        <div className="chip chip-sol"><span>💸</span> Precios que enamoran</div>
        <div className="chip chip-frambuesa"><span>✨</span> Novedades cada semana</div>
      </div>
    </section>
  );
}

/* ---------- Cómo comprar ---------- */
export function ComoComprar() {
  const pasos = [
    {
      titulo: "Elige tu producto",
      texto: "Revisa el catálogo y busca lo que te enamore. Mira bien si tiene la etiqueta Disponible.",
    },
    {
      titulo: "Escríbenos por WhatsApp",
      texto: "Un clic en el botón y tu mensaje ya va armado, con el producto incluido. Te respondemos rapidísimo.",
    },
    {
      titulo: "Recibe tu pedido",
      texto: "Coordina pago y envío en el chat. Hacemos envíos a toda Colombia y tu pedido llega bien empacado.",
    },
  ];
  return (
    <section className="como-comprar" id="como-comprar" aria-labelledby="como-title">
      <div className="wrap">
        <Eyebrow color="sol">Así de fácil</Eyebrow>
        <h2 id="como-title">Comprar toma <span className="hl hl-cian">3 pasos</span></h2>
        <ol className="pasos">
          {pasos.map((p, i) => (
            <li className="paso" key={p.titulo}>
              <span className="paso-num">{i + 1}</span>
              <div><h3>{p.titulo}</h3><p>{p.texto}</p></div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

/* ---------- Sobre nosotros ---------- */
export function Nosotros() {
  return (
    <section className="nosotros wrap" id="nosotros" aria-labelledby="nosotros-title">
      <div className="nosotros-col">
        <Eyebrow color="limao">Sobre nosotros</Eyebrow>
        <h2 id="nosotros-title">Somos tu tienda de confianza <span className="hl hl-frambuesa">sin vueltas</span></h2>
        <p>
          En LILO HOME conseguimos productos útiles, divertidos y de buena calidad para que compres sin complicarte.
          Nada de formularios ni filas: eliges, escribes y listo.
        </p>
        <ul className="checklist">
          <li>Productos probados y seleccionados con amor</li>
          <li>Precios claros, sin letra pequeña</li>
          <li>Empaque cuidadoso y envío seguro</li>
          <li>Te respondemos de verdad, persona a persona</li>
        </ul>
        <a className="btn btn-whatsapp" href={waEnlace()}>
          <WaIcon />
          ¡Hablemos!
        </a>
      </div>
      <div className="nosotros-fotos" aria-hidden="true">
        <img src="img/img057.webp" alt="" width="700" height="700" loading="lazy" decoding="async" />
        <img src="img/img051.webp" alt="" width="700" height="700" loading="lazy" decoding="async" />
        <img src="img/img065.webp" alt="" width="700" height="700" loading="lazy" decoding="async" />
      </div>
    </section>
  );
}

/* ---------- Footer ---------- */
export function Footer() {
  return (
    <footer className="footer">
      <div className="wrap footer-in">
        <div>
          <p className="brand"><span className="brand-badge" aria-hidden="true">L</span> LILO HOME<em>.</em></p>
          <p className="footer-tag">Novedades que llegan primero a tu WhatsApp.</p>
        </div>
        <dl className="footer-datos">
          <div><dt>WhatsApp</dt><dd><a href={waEnlace()}>+57 315 298 5298</a></dd></div>
          <div><dt>Horario</dt><dd>Lun – Sáb · 9 am – 7 pm</dd></div>
          <div><dt>Envíos</dt><dd>Toda Colombia</dd></div>
        </dl>
      </div>
      <p className="footer-copy">© {new Date().getFullYear()} LILO HOME · Hecho con 💛 para comprar fácil.</p>
    </footer>
  );
}

/* ---------- Botón flotante WhatsApp ---------- */
export function Fab() {
  return (
    <a className="fab" href={waEnlace()} aria-label="Escríbenos por WhatsApp">
      <WaIcon />
      <span className="fab-tip">¿Listo para pedir?</span>
    </a>
  );
}