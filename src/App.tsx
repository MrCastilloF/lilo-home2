import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { CAT_LABELS, PRODUCTS, type Producto } from "./data";
import {
  Beneficios,
  ComoComprar,
  Fab,
  Footer,
  Hero,
  Nosotros,
  Topbar,
  WaIcon,
  waEnlace,
  formatoCOP,
} from "./components";

const LS_KEY = "lilohome_stock_v1";

/* ============ Utilidades de stock ============ */

function cargarOverrides(): Record<string, boolean> {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) return {};
    const obj = JSON.parse(raw);
    return obj && typeof obj === "object" ? (obj as Record<string, boolean>) : {};
  } catch {
    return {};
  }
}

const normalizar = (t: string) => t.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

/* ============ Tarjeta de producto ============ */

function ProductoCard({ p, disponible, delay = 0 }: { p: Producto; disponible: boolean; delay?: number }) {
  const estado = disponible
    ? <span className="estado-badge estado-disponible">Disponible</span>
    : <span className="estado-badge estado-agotado">Agotado</span>;
  const cta = disponible
    ? (
        <a
          className="producto-cta"
          href={waEnlace(p)}
          target="_blank"
          rel="noopener"
          aria-label={`Pedir ${p.nombre} por WhatsApp`}
        >
          <WaIcon /> Pedir por WhatsApp
        </a>
      )
    : (
        <button className="producto-cta" disabled aria-disabled="true">
          ✕ Agotado · pregúntanos por restock
        </button>
      );
  return (
    <article className={`producto${disponible ? "" : " agotado"}`} style={{ animationDelay: `${delay}ms` }}>
      <div className="producto-media">
        {estado}
        <span className="cat-tag">{CAT_LABELS[p.cat]}</span>
        <img
          src={p.img}
          alt={`${p.nombre}${disponible ? ", disponible" : ", agotado temporalmente"}`}
          width="700"
          height="700"
          loading="lazy"
          decoding="async"
        />
      </div>
      <div className="producto-cuerpo">
        <h3 className="producto-nombre">{p.nombre}</h3>
        <p className="producto-precio">{formatoCOP.format(p.precio)}</p>
        {cta}
      </div>
    </article>
  );
}

/* ============ Catálogo ============ */

const CATEGORIAS: { key: "todos" | Producto["cat"]; label: string }[] = [
  { key: "todos", label: "Todos" },
  { key: "tecnologia", label: "Tecnología" },
  { key: "hogar", label: "Hogar" },
  { key: "juguetes", label: "Juguetes" },
  { key: "cuidado", label: "Belleza" },
];

function Catalogo({
  productos,
  disponible,
  total,
}: {
  productos: Producto[];
  disponible: (p: Producto) => boolean;
  total: number;
}) {
  const [cat, setCat] = useState<"todos" | Producto["cat"]>("todos");
  const [texto, setTexto] = useState("");

  const lista = useMemo(() => {
    const t = normalizar(texto.trim());
    return productos.filter((p) => {
      const okCat = cat === "todos" || p.cat === cat;
      const okTxt =
        !t ||
        normalizar(p.nombre).includes(t) ||
        normalizar(CAT_LABELS[p.cat]).includes(t);
      return okCat && okTxt;
    });
  }, [productos, cat, texto]);

  return (
    <section className="catalogo" id="catalogo" aria-labelledby="catalogo-title">
      <div className="wrap">
        <header className="seccion-head">
          <div>
            <p className="eyebrow"><span className="dot dot-frambuesa" aria-hidden="true" /> Catálogo</p>
            <h2 id="catalogo-title">Elige tu <span className="hl hl-limao">favorito</span></h2>
          </div>
          <p className="seccion-sub" role="status">
            {lista.length === total
              ? `Mostrando los ${total} productos`
              : `Mostrando ${lista.length} de ${total} productos`}
          </p>
        </header>

        <div className="filtros">
          <label className="buscador" htmlFor="buscarProductos">
            <span className="sr-only">Buscar producto</span>
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path
                fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round"
                d="M11 19a8 8 0 1 1 0-16 8 8 0 0 1 0 16Zm10 2-4.6-4.6"
              />
            </svg>
            <input
              id="buscarProductos"
              type="search"
              placeholder="Busca: parlante, waflera, maquillaje…"
              value={texto}
              onChange={(e) => setTexto(e.target.value)}
            />
          </label>
          <div className="chips" role="group" aria-label="Filtrar por categoría">
            {CATEGORIAS.map((c) => (
              <button
                key={c.key}
                className={`chip-btn${cat === c.key ? " is-active" : ""}`}
                aria-pressed={cat === c.key}
                onClick={() => setCat(c.key)}
              >
                {c.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid" id="gridProductos" aria-live="polite">
          {lista.map((p, i) => (
            <ProductoCard key={p.id} p={p} disponible={disponible(p)} delay={Math.min(i, 12) * 45} />
          ))}
        </div>

        {lista.length === 0 && (
          <p className="sin-resultados" role="status">
            No encontramos nada con ese nombre 🤔 Prueba con otra palabra o mira el catálogo completo.
          </p>
        )}
      </div>
    </section>
  );
}

/* ============ Panel de stock (admin) ============ */

function PanelStock({
  productos,
  disponible,
  toggle,
  restaurar,
  abierto,
  cerrar,
}: {
  productos: Producto[];
  disponible: (p: Producto) => boolean;
  toggle: (id: string) => void;
  restaurar: () => void;
  abierto: boolean;
  cerrar: () => void;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const [busqueda, setBusqueda] = useState("");

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (abierto && !dialog.open) dialog.showModal();
    if (!abierto && dialog.open) dialog.close();
  }, [abierto]);

  const lista = useMemo(() => {
    const t = normalizar(busqueda.trim());
    return productos.filter((p) => !t || normalizar(p.nombre).includes(t));
  }, [productos, busqueda]);

  const disponibles = productos.filter(disponible).length;
  const agotados = productos.length - disponibles;

  const exportar = () => {
    const datos = productos.map((p) => ({
      id: p.id,
      nombre: p.nombre,
      precio: p.precio,
      cat: p.cat,
      img: p.img,
      disponible: disponible(p),
    }));
    const blob = new Blob([JSON.stringify(datos, null, 1)], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "productos.json";
    a.click();
    URL.revokeObjectURL(a.href);
  };

  return (
    <dialog
      className="panel"
      id="panelStock"
      ref={ref}
      aria-labelledby="panel-titulo"
      onClose={cerrar}
      onClick={(e) => { if (e.target === ref.current) cerrar(); }}
    >
      <div className="panel-head">
        <div>
          <p className="eyebrow eyebrow-dark"><span className="dot dot-limao" aria-hidden="true" /> Solo para ti</p>
          <h2 id="panel-titulo">Panel de stock</h2>
        </div>
        <button className="panel-cerrar" onClick={cerrar} aria-label="Cerrar panel">✕</button>
      </div>
      <p className="panel-intro">
        Cambia la disponibilidad con un clic. Para que el cambio lo vean todos tus visitantes,
        descarga <code>productos.json</code> y publícalo en la raíz de la página.
      </p>
      <div className="panel-datos">
        <p><strong>{disponibles}</strong> disponibles · <strong>{agotados}</strong> agotados</p>
        <label className="buscador buscador-panel" htmlFor="buscarPanel">
          <span className="sr-only">Buscar en el panel</span>
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path
              fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round"
              d="M11 19a8 8 0 1 1 0-16 8 8 0 0 1 0 16Zm10 2-4.6-4.6"
            />
          </svg>
          <input
            id="buscarPanel"
            type="search"
            placeholder="Buscar producto…"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
        </label>
      </div>
      <ul className="panel-lista">
        {lista.map((p) => {
          const disp = disponible(p);
          return (
            <li className={`panel-item${disp ? "" : " agotado"}`} key={p.id}>
              <span className="panel-item-info">
                <img src={p.img} alt="" width="46" height="46" loading="lazy" />
                <span>
                  <span className="panel-item-nombre">{p.nombre}</span><br />
                  <span className="panel-item-precio">{formatoCOP.format(p.precio)} · {p.id}</span>
                </span>
              </span>
              <label
                className="switch"
                title={disp ? "Disponible — clic para marcar agotado" : "Agotado — clic para marcar disponible"}
              >
                <input
                  type="checkbox"
                  checked={disp}
                  onChange={() => toggle(p.id)}
                  aria-label={`Disponibilidad de ${p.nombre}`}
                />
                <span className="switch-track" aria-hidden="true" />
              </label>
            </li>
          );
        })}
      </ul>
      <div className="panel-acciones">
        <button className="btn btn-ink btn-small" onClick={exportar}>
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path
              fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"
              d="M12 3v12m0 0 4-4m-4 4-4-4M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2"
            />
          </svg>
          Descargar productos.json actualizado
        </button>
        <button className="btn btn-ghost btn-small" onClick={restaurar}>
          Restablecer al archivo original
        </button>
      </div>
    </dialog>
  );
}

/* ============ App ============ */

export function App() {
  const [stock, setStock] = useState<Record<string, boolean>>(cargarOverrides);
  const [snapshot, setSnapshot] = useState<Record<string, boolean> | null>(null);
  const [panelAbierto, setPanelAbierto] = useState(false);
  const [toast, setToast] = useState<{ id: number; texto: string } | null>(null);
  const cargado = useRef(false);

  /* Lectura opcional de productos.json publicado junto a la página */
  useEffect(() => {
    if (cargado.current) return;
    cargado.current = true;
    fetch("productos.json", { cache: "no-cache" })
      .then((r) => (r.ok ? r.json() : null))
      .then((datos) => {
        if (!Array.isArray(datos) || datos.length === 0) return;
        const mapa: Record<string, boolean> = {};
        for (const d of datos) {
          if (d && typeof d.id === "string" && typeof d.disponible === "boolean") {
            if (PRODUCTS.some((p) => p.id === d.id)) mapa[d.id] = d.disponible;
          }
        }
        setSnapshot(mapa);
      })
      .catch(() => { /* sin productos.json: se usa el catálogo base */ });
  }, []);

  const disponible = useCallback(
    (p: Producto) => {
      if (p.id in stock) return stock[p.id];
      if (snapshot && p.id in snapshot) return snapshot[p.id];
      return p.disponible;
    },
    [stock, snapshot],
  );

  const toggle = (id: string) => {
    setStock((anterior) => {
      const actual = id in anterior ? anterior[id] : true;
      const nuevo = { ...anterior, [id]: !actual };
      localStorage.setItem(LS_KEY, JSON.stringify(nuevo));
      return nuevo;
    });
  };

  const restaurar = () => {
    setStock({});
    setSnapshot(null);
    try { localStorage.removeItem(LS_KEY); } catch { /* nada */ }
    avisar("↺ Stock restablecido al catálogo base");
  };

  const avisar = (texto: string) => setToast({ id: Date.now(), texto });
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 2600);
    return () => clearTimeout(t);
  }, [toast]);

  /* Apertura por hash #panel */
  useEffect(() => {
    const sincronizar = () => setPanelAbierto(location.hash === "#panel");
    sincronizar();
    window.addEventListener("hashchange", sincronizar);
    return () => window.removeEventListener("hashchange", sincronizar);
  }, []);

  const cerrarPanel = () => {
    setPanelAbierto(false);
    if (location.hash === "#panel") history.replaceState(null, "", location.pathname + location.search);
  };

  return (
    <>
      <a className="skip-link" href="#catalogo">Saltar al catálogo</a>
      <Topbar />
      <main id="inicio">
        <Hero total={PRODUCTS.length} />
        <Beneficios />
        <Catalogo productos={PRODUCTS} disponible={disponible} total={PRODUCTS.length} />
        <ComoComprar />
        <Nosotros />
      </main>
      <Footer />
      <Fab />
      <PanelStock
        productos={PRODUCTS}
        disponible={disponible}
        toggle={toggle}
        restaurar={restaurar}
        abierto={panelAbierto}
        cerrar={cerrarPanel}
      />
      {toast && (
        <div className="toast" key={toast.id} role="status" aria-live="polite">
          {toast.texto}
        </div>
      )}
    </>
  );
}