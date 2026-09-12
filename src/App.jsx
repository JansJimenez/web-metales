import { useState } from 'react';
import ChatGemini from './components/ChatGemini';

const productosData = [
  {
    id: 1,
    nombre: "Calamina Galvanizada Ondulada",
    categoria: "Coberturas y Calaminas",
    norma: "Norma Técnica ASTM A653",
    espesores: "0.20 mm / 0.25 mm / 0.30 mm",
    largos: "1.80 m / 2.40 m / 3.00 m / 3.60 m",
    imagen: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cb/Corrugated_iron_roof_texture.jpg/800px-Corrugated_iron_roof_texture.jpg",
    descripcion: "Plancha de acero con recubrimiento de zinc por inmersión en caliente. Óptima resistencia a la corrosión para techados residenciales y agrícolas.",
    precio_ref: "S/ 24.50"
  },
  {
    id: 2,
    nombre: "Calamina Trapezoidal Aluzinc TR4",
    categoria: "Coberturas y Calaminas",
    norma: "Recubrimiento AZ-150 / ASTM A792",
    espesores: "0.35 mm / 0.40 mm / 0.50 mm",
    largos: "Cortes comerciales y a medida (hasta 12 m)",
    imagen: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/07/Industrial_warehouse_roof_cladding.jpg/800px-Industrial_warehouse_roof_cladding.jpg",
    descripcion: "Plancha trapezoidal de alta rigidez estructural. Canales profundos que facilitan un drenaje pluvial rápido en naves industriales y almacenes.",
    precio_ref: "S/ 48.00"
  },
  {
    id: 3,
    nombre: "Plancha Termoacústica UPVC Multicapa",
    categoria: "Coberturas y Calaminas",
    norma: "ISO 9001 - Certificación Antifuego B1",
    espesores: "2.0 mm / 2.5 mm",
    largos: "1.80 m a 6.00 m",
    imagen: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/30/Corrugated_plastic_roofing_sheets.jpg/800px-Corrugated_plastic_roofing_sheets.jpg",
    descripcion: "Tecnología multicapa que reduce el impacto sonoro de las lluvias torrenciales hasta en un 70% y disminuye la transferencia térmica.",
    precio_ref: "S/ 85.00"
  },
  {
    id: 4,
    nombre: "Tubo Estructural LAC Cuadrado y Rectangular",
    categoria: "Perfiles y Tuberías",
    norma: "Norma ASTM A500 Grado B",
    espesores: "1.5 mm, 2.0 mm, 3.0 mm en barras de 6m",
    largos: "Dimensiones: 1x1, 2x2, 3x1.5, 4x2 pulg",
    imagen: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f6/Square_structural_steel_tubing_stacks.jpg/800px-Square_structural_steel_tubing_stacks.jpg",
    descripcion: "Tubería soldada conformada en frío de alta resistencia para carpintería metálica, tijerales, columnas y naves industriales.",
    precio_ref: "S/ 62.00"
  },
  {
    id: 5,
    nombre: "Perfil Canal U y Vigas H",
    categoria: "Perfiles y Tuberías",
    norma: "ASTM A36 / Estructural comercial",
    espesores: "Alas y alma según medida técnica",
    largos: "Barras de 6.00 m estándar",
    imagen: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7b/Steel_I-beams_and_channels_warehouse.jpg/800px-Steel_I-beams_and_channels_warehouse.jpg",
    descripcion: "Perfiles laminados en caliente para construcción civil pesada, soporte de coberturas, puentes grúa y tijerales de carga.",
    precio_ref: "S/ 74.00"
  },
  {
    id: 6,
    nombre: "Fierro Corrugado Grado 60 Sismorresistente",
    categoria: "Acero de Construcción",
    norma: "NTP 341.031 / ASTM A615",
    espesores: "Diámetros: 6mm, 8mm, 3/8\", 1/2\", 5/8\", 3/4\"",
    largos: "Barras rectas de 9.00 m",
    imagen: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/94/Reinforcing_steel_bars_rebar_pile.jpg/800px-Reinforcing_steel_bars_rebar_pile.jpg",
    descripcion: "Barras corrugadas para armaduras de concreto armado en cimientos, columnas, vigas y losas estructurales.",
    precio_ref: "S/ 33.50"
  }
];

export default function App() {
  const [categoriaActiva, setCategoriaActiva] = useState('Todos');
  const [busqueda, setBusqueda] = useState('');
  const [cotizacion, setCotizacion] = useState([]);

  const configEmpresa = {
    nombre: "HUBANI METALES & CALAMINAS S.A.C.",
    ruc: "20608941231",
    telefono: "51987654321",
    atencion: "Lun - Sáb: 7:30 AM - 6:00 PM",
    direccion: "Av. Industrial 450 - Parque Industrial",
    cobertura: "Despacho a obra en todo el norte y envíos a provincia"
  };

  const categorias = ['Todos', 'Coberturas y Calaminas', 'Perfiles y Tuberías', 'Acero de Construcción'];

  const productosFiltrados = productosData.filter(p => {
    const coincideCat = categoriaActiva === 'Todos' || p.categoria === categoriaActiva;
    const coincideTxt = p.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
                        p.descripcion.toLowerCase().includes(busqueda.toLowerCase()) ||
                        p.norma.toLowerCase().includes(busqueda.toLowerCase());
    return coincideCat && coincideTxt;
  });

  const agregarACotizacion = (item) => {
    const existe = cotizacion.find(c => c.id === item.id);
    if (existe) {
      setCotizacion(cotizacion.map(c => c.id === item.id ? { ...c, cantidad: c.cantidad + 1 } : c));
    } else {
      setCotizacion([...cotizacion, { ...item, cantidad: 1 }]);
    }
  };

  const actualizarCantidad = (id, delta) => {
    setCotizacion(cotizacion.map(c => {
      if (c.id === id) {
        const nueva = c.cantidad + delta;
        return nueva > 0 ? { ...c, cantidad: nueva } : null;
      }
      return c;
    }).filter(Boolean));
  };

  const enviarCotizacionWhatsApp = () => {
    if (cotizacion.length === 0) return;
    let mensaje = `*SOLICITUD DE COTIZACIÓN FORMAL*\n`;
    mensaje += `*Empresa:* ${configEmpresa.nombre}\n`;
    mensaje += `------------------------------------\n`;
    cotizacion.forEach(item => {
      mensaje += `▪ *${item.cantidad} un.* | ${item.nombre}\n`;
      mensaje += `   Medida/Espesor: ${item.espesores}\n`;
    });
    mensaje += `------------------------------------\n`;
    mensaje += `Por favor cotizar puesto en obra / recojo en almacén. Gracias.`;
    window.open(`https://wa.me/${configEmpresa.telefono}?text=${encodeURIComponent(mensaje)}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800 font-sans antialiased selection:bg-red-500 selection:text-white">
      {/* Top Header Corporativo */}
      <div className="bg-slate-950 text-slate-300 text-xs py-2.5 px-4 border-b border-slate-800 tracking-tight">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-between items-center gap-2">
          <div className="flex items-center gap-4">
            <span><strong className="text-white">RUC:</strong> {configEmpresa.ruc}</span>
            <span className="hidden sm:inline">📍 {configEmpresa.direccion}</span>
          </div>
          <div className="flex items-center gap-4">
            <span>🕒 {configEmpresa.atencion}</span>
            <span className="text-red-400 font-semibold flex items-center gap-1">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
              </span>
              🚚 {configEmpresa.cobertura}
            </span>
          </div>
        </div>
      </div>

      {/* Cabecera Principal con Navegación Sticky */}
      <header className="bg-white/95 backdrop-blur-md border-b border-slate-200 sticky top-0 z-40 shadow-sm transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 py-3.5 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-blue-900 hover:bg-blue-950 text-white font-black text-2xl px-3.5 py-1.5 rounded tracking-tighter border-l-4 border-red-600 shadow-md transition-all duration-200 transform hover:scale-[1.02]">
              HUBANI
            </div>
            <div>
              <h1 className="text-xl font-black text-slate-900 leading-tight tracking-tight">
                METALES & CALAMINAS <span className="text-red-600 text-xs font-bold px-1.5 py-0.5 rounded bg-red-50 border border-red-200 ml-1">SAC</span>
              </h1>
              <p className="text-xs text-slate-500 font-medium">Líderes en distribución siderúrgica y coberturas metálicas</p>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="relative w-full md:w-80">
              <input
                type="text"
                placeholder="Buscar plancha, aluzinc, fierro..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                className="w-full pl-9 pr-3.5 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-800 focus:border-blue-900 bg-slate-50 focus:bg-white transition-all duration-200 shadow-inner"
              />
              <span className="absolute left-3 top-2.5 text-slate-400 text-sm">🔍</span>
            </div>
            <a
              href={`https://wa.me/${configEmpresa.telefono}?text=Hola,%20deseo%20asesoria%20tecnica%20de%20materiales`}
              target="_blank"
              rel="noreferrer"
              className="bg-red-600 hover:bg-red-700 active:scale-95 text-white font-bold text-xs py-2.5 px-4 rounded-lg transition-all duration-200 shrink-0 flex items-center gap-1.5 shadow-sm hover:shadow"
            >
              <span>Atención Técnica</span>
            </a>
          </div>
        </div>

        {/* Barra de Pestañas Animadas */}
        <nav className="bg-slate-50 border-t border-slate-200">
          <div className="max-w-7xl mx-auto px-4 flex overflow-x-auto gap-2 py-1.5 no-scrollbar">
            {categorias.map(cat => (
              <button
                key={cat}
                onClick={() => setCategoriaActiva(cat)}
                className={`relative py-2.5 px-4 rounded-md text-xs font-bold uppercase tracking-wider transition-all duration-200 whitespace-nowrap ${
                  categoriaActiva === cat
                    ? 'bg-blue-950 text-white shadow-sm ring-1 ring-blue-900'
                    : 'text-slate-600 hover:text-blue-950 hover:bg-slate-200/60'
                }`}
              >
                {cat}
                {categoriaActiva === cat && (
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-6 h-0.5 bg-red-500 rounded-full animate-pulse"></span>
                )}
              </button>
            ))}
          </div>
        </nav>
      </header>

      {/* Hero Banner Corporativo Industrial */}
      <section className="relative overflow-hidden bg-gradient-to-r from-slate-950 via-blue-950 to-slate-900 text-white py-14 px-4 border-b-4 border-red-600">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none"></div>
        <div className="max-w-7xl mx-auto relative flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-1.5 bg-red-600 text-white text-[11px] font-black uppercase px-2.5 py-1 rounded tracking-wider shadow-sm mb-2">
              <span className="h-1.5 w-1.5 rounded-full bg-white animate-pulse"></span>
              Venta Mayorista y Minorista
            </span>
            <h2 className="text-3xl sm:text-4xl font-black mt-2 leading-tight tracking-tight">
              Suministro Integral de Acero, Coberturas y Calaminas
            </h2>
            <p className="text-slate-300 text-sm mt-3 leading-relaxed">
              Materiales certificados con norma técnica ASTM y NTP. Stock continuo para contratistas, talleres de estructuras metálicas y proyectos de ingeniería civil.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 w-full md:w-auto">
            <div className="bg-slate-900/80 hover:bg-slate-900 backdrop-blur border border-blue-900/50 hover:border-red-500/50 p-4 rounded-lg text-center transition-all duration-300 transform hover:-translate-y-1 shadow">
              <span className="text-2xl font-black text-red-500 block tracking-tight">+15 Años</span>
              <span className="text-xs text-slate-300 font-medium">En el mercado</span>
            </div>
            <div className="bg-slate-900/80 hover:bg-slate-900 backdrop-blur border border-blue-900/50 hover:border-red-500/50 p-4 rounded-lg text-center transition-all duration-300 transform hover:-translate-y-1 shadow">
              <span className="text-2xl font-black text-red-500 block tracking-tight">Corte</span>
              <span className="text-xs text-slate-300 font-medium">A medida exacta</span>
            </div>
            <div className="bg-slate-900/80 hover:bg-slate-900 backdrop-blur border border-blue-900/50 hover:border-red-500/50 p-4 rounded-lg text-center transition-all duration-300 transform hover:-translate-y-1 shadow">
              <span className="text-2xl font-black text-red-500 block tracking-tight">Certificado</span>
              <span className="text-xs text-slate-300 font-medium">Calidad de origen</span>
            </div>
            <div className="bg-slate-900/80 hover:bg-slate-900 backdrop-blur border border-blue-900/50 hover:border-red-500/50 p-4 rounded-lg text-center transition-all duration-300 transform hover:-translate-y-1 shadow">
              <span className="text-2xl font-black text-red-500 block tracking-tight">Flota Propia</span>
              <span className="text-xs text-slate-300 font-medium">Despacho en obra</span>
            </div>
          </div>
        </div>
      </section>

      {/* Contenedor Principal: Catálogo + Panel de Cotización */}
      <main className="max-w-7xl mx-auto px-4 py-10 grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Catálogo de Productos */}
        <div className="lg:col-span-3">
          <div className="flex justify-between items-center mb-6 pb-2 border-b border-slate-200">
            <h3 className="text-lg font-black text-slate-900 uppercase tracking-wide flex items-center gap-2">
              <span className="w-2 h-4 bg-red-600 rounded-sm"></span>
              {categoriaActiva === 'Todos' ? 'Catálogo General de Materiales' : categoriaActiva}
            </h3>
            <span className="text-xs font-semibold text-slate-600 bg-slate-200 px-3 py-1 rounded-full">
              {productosFiltrados.length} productos
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {productosFiltrados.map(prod => (
              <div
                key={prod.id}
                className="group bg-white border border-slate-200 hover:border-blue-700 rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1.5 flex flex-col justify-between"
              >
                <div>
                  <div className="h-44 overflow-hidden bg-slate-100 relative">
                    <img
                      src={prod.imagen}
                      alt={prod.nombre}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent opacity-60"></div>
                    <span className="absolute bottom-2 left-2 bg-slate-950/90 text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider border-l-2 border-red-600">
                      {prod.categoria}
                    </span>
                  </div>

                  <div className="p-4">
                    <h4 className="font-bold text-slate-900 text-base leading-snug mb-1 group-hover:text-blue-900 transition-colors">
                      {prod.nombre}
                    </h4>
                    <p className="text-[11px] font-semibold text-blue-900 mb-2 flex items-center gap-1">
                      <span>⚙️</span> {prod.norma}
                    </p>
                    <p className="text-xs text-slate-600 line-clamp-2 mb-3 leading-relaxed">
                      {prod.descripcion}
                    </p>

                    <div className="bg-slate-50 border border-slate-100 rounded-lg p-2.5 text-xs text-slate-700 space-y-1 mb-3">
                      <div><strong className="text-slate-900">Espesores:</strong> {prod.espesores}</div>
                      <div><strong className="text-slate-900">Medidas:</strong> {prod.largos}</div>
                    </div>
                  </div>
                </div>

                <div className="p-4 pt-0 border-t border-slate-100 flex items-center justify-between mt-auto">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Referencial</span>
                    <span className="text-lg font-black text-slate-900">{prod.precio_ref}</span>
                  </div>
                  <button
                    onClick={() => agregarACotizacion(prod)}
                    className="bg-blue-900 hover:bg-red-600 active:scale-95 text-white font-bold text-xs py-2 px-3.5 rounded-lg transition-all duration-200 shadow hover:shadow-md"
                  >
                    + Cotizar
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Panel Lateral Sticky: Cotización */}
        <aside className="lg:col-span-1">
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow sticky top-28">
            <h4 className="text-base font-black text-slate-900 pb-3 border-b border-slate-200 flex items-center justify-between">
              <span>Mi Solicitud</span>
              <span className="bg-blue-50 text-blue-900 border border-blue-200 text-xs px-2.5 py-0.5 rounded-full font-bold">
                {cotizacion.reduce((acc, c) => acc + c.cantidad, 0)} ítems
              </span>
            </h4>

            {cotizacion.length === 0 ? (
              <div className="py-8 text-center text-xs text-slate-400 space-y-2">
                <div className="text-2xl">📋</div>
                <p>Selecciona productos con <strong>"+ Cotizar"</strong> para añadirlos a tu lista.</p>
              </div>
            ) : (
              <div className="divide-y divide-slate-100 my-3 max-h-72 overflow-y-auto pr-1">
                {cotizacion.map(item => (
                  <div key={item.id} className="py-2.5 flex items-center justify-between text-xs animate-fadeIn">
                    <div className="max-w-[140px]">
                      <div className="font-bold text-slate-900 truncate">{item.nombre}</div>
                      <div className="text-[10px] text-slate-500">{item.precio_ref} c/u</div>
                    </div>
                    <div className="flex items-center gap-1.5 bg-slate-100 px-2 py-1 rounded-lg border border-slate-200">
                      <button
                        onClick={() => actualizarCantidad(item.id, -1)}
                        className="font-black text-slate-500 hover:text-red-600 active:scale-90 px-1 transition"
                      >
                        -
                      </button>
                      <span className="font-bold w-4 text-center">{item.cantidad}</span>
                      <button
                        onClick={() => actualizarCantidad(item.id, 1)}
                        className="font-black text-slate-500 hover:text-blue-900 active:scale-90 px-1 transition"
                      >
                        +
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <button
              onClick={enviarCotizacionWhatsApp}
              disabled={cotizacion.length === 0}
              className={`w-full py-2.5 rounded-lg font-bold text-xs uppercase tracking-wider transition-all duration-200 shadow-sm active:scale-95 ${
                cotizacion.length > 0
                  ? 'bg-red-600 hover:bg-red-700 hover:shadow text-white cursor-pointer'
                  : 'bg-slate-200 text-slate-400 cursor-not-allowed'
              }`}
            >
              Pedir Cotización Oficial
            </button>

            <p className="text-[11px] text-slate-400 text-center mt-3">
              Recibirás confirmación de inventario y plazos de entrega a obra.
            </p>
          </div>
        </aside>
      </main>

      {/* Footer Institucional */}
      <footer className="bg-slate-950 text-slate-400 text-xs mt-16 pt-12 pb-8 border-t-2 border-red-600">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 mb-10">
          <div>
            <h5 className="text-white font-bold text-sm mb-3 uppercase tracking-wider border-l-2 border-red-600 pl-2">
              Sobre Nosotros
            </h5>
            <p className="text-slate-400 leading-relaxed text-[11px]">
              Empresa comercializadora de aceros laminados, perfiles estructurales y coberturas de aluzinc y fibrocemento para proyectos de edificación, minería e infraestructura.
            </p>
          </div>
          <div>
            <h5 className="text-white font-bold text-sm mb-3 uppercase tracking-wider border-l-2 border-red-600 pl-2">
              Líneas de Producto
            </h5>
            <ul className="space-y-1.5 text-[11px]">
              <li className="hover:text-white transition">Calaminas Trapezoidales y Onduladas</li>
              <li className="hover:text-white transition">Perfiles Tubulares LAC y ASTM A500</li>
              <li className="hover:text-white transition">Planchas Galvanizadas y Aluzinc</li>
              <li className="hover:text-white transition">Fierro Sismorresistente Grado 60</li>
            </ul>
          </div>
          <div>
            <h5 className="text-white font-bold text-sm mb-3 uppercase tracking-wider border-l-2 border-red-600 pl-2">
              Planta & Almacén
            </h5>
            <p className="text-slate-400 leading-relaxed text-[11px]">
              {configEmpresa.direccion}<br />
              Atención directa en patio de maniobras para carga de camiones plataforma.
            </p>
          </div>
          <div>
            <h5 className="text-white font-bold text-sm mb-3 uppercase tracking-wider border-l-2 border-red-600 pl-2">
              Medios de Pago
            </h5>
            <p className="text-slate-400 leading-relaxed text-[11px] mb-2">
              Aceptamos transferencias BCP, BBVA, Interbank, cheques y pagos en ventanilla de almacén.
            </p>
            <span className="inline-block bg-slate-900 border border-slate-800 px-2.5 py-1 rounded text-red-400 font-mono text-[10px]">
              Emisión de Facturas y Guías de Remisión
            </span>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 pt-6 border-t border-slate-800 text-center text-slate-500 text-[11px]">
          © 2026 {configEmpresa.nombre} - RUC: {configEmpresa.ruc}. Todos los derechos reservados. Proyecto de Prácticas Preprofesionales.
        </div>
      </footer>
      <ChatGemini />
    </div>
  );
}