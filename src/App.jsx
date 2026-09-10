import { useState } from 'react';

const productosData = [
  {
    id: 1,
    nombre: "Calamina Galvanizada Ondulada",
    categoria: "Coberturas y Calaminas",
    norma: "Norma Técnica ASTM A653",
    espesores: "0.20 mm / 0.25 mm / 0.30 mm",
    largos: "1.80 m / 2.40 m / 3.00 m / 3.60 m",
    imagen: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=600&q=80",
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
    imagen: "https://images.unsplash.com/photo-1541888946425-d0fbb186c5f8?auto=format&fit=crop&w=600&q=80",
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
    imagen: "https://images.unsplash.com/photo-1504307651554-6691fc9d090f?auto=format&fit=crop&w=600&q=80",
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
    imagen: "https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?auto=format&fit=crop&w=600&q=80",
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
    imagen: "https://images.unsplash.com/photo-1535813547-99c456a41d4a?auto=format&fit=crop&w=600&q=80",
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
    imagen: "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&w=600&q=80",
    descripcion: "Barras corrugadas para armaduras de concreto armado en cimientos, columnas, vigas y losas estructurales.",
    precio_ref: "S/ 33.50"
  }
];

export default function App() {
  const [categoriaActiva, setCategoriaActiva] = useState('Todos');
  const [busqueda, setBusqueda] = useState('');
  const [cotizacion, setCotizacion] = useState([]);

  // Configuración comercial de la empresa
  const configEmpresa = {
    nombre: "HUBANI METALES & CALAMINAS S.A.C.",
    ruc: "20608941231",
    telefono: "51987654321", // Reemplazar con el número real de atención
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
    <div className="min-h-screen bg-neutral-100 text-neutral-800 font-sans">
      {/* Top Header Corporativo */}
      <div className="bg-neutral-900 text-neutral-300 text-xs py-2 px-4 border-b border-neutral-800">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-between items-center gap-2">
          <div className="flex items-center gap-4">
            <span><strong>RUC:</strong> {configEmpresa.ruc}</span>
            <span>📍 {configEmpresa.direccion}</span>
          </div>
          <div className="flex items-center gap-4">
            <span>🕒 {configEmpresa.atencion}</span>
            <span className="text-amber-400 font-semibold">🚚 {configEmpresa.cobertura}</span>
          </div>
        </div>
      </div>

      {/* Cabecera Principal con Navegación */}
      <header className="bg-white border-b border-neutral-200 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-blue-900 text-white font-black text-2xl px-3 py-1.5 rounded tracking-tighter">
              HUBANI
            </div>
            <div>
              <h1 className="text-xl font-black text-neutral-900 leading-tight">
                METALES & CALAMINAS <span className="text-blue-900 text-sm font-semibold block sm:inline">SAC</span>
              </h1>
              <p className="text-xs text-neutral-500 font-medium">Líderes en distribución siderúrgica y coberturas metálicas</p>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <input
              type="text"
              placeholder="Buscar plancha, aluzinc, fierro, perfil..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="w-full md:w-80 px-3.5 py-2 text-sm border border-neutral-300 rounded focus:outline-none focus:border-blue-900 bg-white"
            />
            <a
              href={`https://wa.me/${configEmpresa.telefono}?text=Hola,%20deseo%20asesoria%20tecnica%20de%20materiales`}
              target="_blank"
              rel="noreferrer"
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-2.5 px-4 rounded transition shrink-0 flex items-center gap-1.5"
            >
              <span>Atención Técnica</span>
            </a>
          </div>
        </div>

        {/* Barra de Categorías */}
        <nav className="bg-neutral-50 border-t border-neutral-200">
          <div className="max-w-7xl mx-auto px-4 flex overflow-x-auto">
            {categorias.map(cat => (
              <button
                key={cat}
                onClick={() => setCategoriaActiva(cat)}
                className={`py-3 px-5 text-sm font-bold tracking-wide uppercase transition border-b-2 whitespace-nowrap ${
                  categoriaActiva === cat
                    ? 'border-blue-900 text-blue-900 bg-white'
                    : 'border-transparent text-neutral-600 hover:text-neutral-900'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </nav>
      </header>

      {/* Hero Banner Corporativo Industrial */}
      <section className="bg-gradient-to-r from-neutral-900 via-blue-950 to-neutral-900 text-white py-12 px-4 border-b-4 border-amber-500">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="max-w-2xl">
            <span className="bg-amber-500 text-neutral-950 text-xs font-black uppercase px-2 py-1 rounded tracking-wider">
              Venta Mayorista y Minorista
            </span>
            <h2 className="text-3xl sm:text-4xl font-black mt-3 leading-tight">
              Suministro Integral de Acero, Coberturas y Calaminas
            </h2>
            <p className="text-neutral-300 text-sm mt-2 leading-relaxed">
              Materiales certificados con norma técnica ASTM y NTP. Stock continuo para contratistas, talleres de estructuras metálicas y proyectos de ingeniería.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 w-full md:w-auto">
            <div className="bg-neutral-800/80 p-3.5 rounded border border-neutral-700 text-center">
              <span className="text-2xl font-black text-amber-400 block">+15 Años</span>
              <span className="text-xs text-neutral-300">En el mercado</span>
            </div>
            <div className="bg-neutral-800/80 p-3.5 rounded border border-neutral-700 text-center">
              <span className="text-2xl font-black text-amber-400 block">Corte</span>
              <span className="text-xs text-neutral-300">A medida exacta</span>
            </div>
            <div className="bg-neutral-800/80 p-3.5 rounded border border-neutral-700 text-center">
              <span className="text-2xl font-black text-amber-400 block">Certificado</span>
              <span className="text-xs text-neutral-300">Calidad de origen</span>
            </div>
            <div className="bg-neutral-800/80 p-3.5 rounded border border-neutral-700 text-center">
              <span className="text-2xl font-black text-amber-400 block">Flota Propia</span>
              <span className="text-xs text-neutral-300">Despacho en obra</span>
            </div>
          </div>
        </div>
      </section>

      {/* Contenedor Principal: Catálogo + Resumen de Cotización */}
      <main className="max-w-7xl mx-auto px-4 py-10 grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Catálogo de Productos (3 Columnas en Desktop) */}
        <div className="lg:col-span-3">
          <div className="flex justify-between items-center mb-6 pb-2 border-b border-neutral-200">
            <h3 className="text-xl font-bold text-neutral-900 uppercase tracking-wide">
              {categoriaActiva === 'Todos' ? 'Catálogo General de Materiales' : categoriaActiva}
            </h3>
            <span className="text-xs font-semibold text-neutral-500 bg-neutral-200 px-2.5 py-1 rounded">
              {productosFiltrados.length} productos disponibles
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {productosFiltrados.map(prod => (
              <div
                key={prod.id}
                className="bg-white border border-neutral-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition flex flex-col justify-between"
              >
                <div>
                  <div className="h-44 overflow-hidden bg-neutral-200 relative">
                    <img
                      src={prod.imagen}
                      alt={prod.nombre}
                      className="w-full h-full object-cover hover:scale-105 transition duration-300"
                    />
                    <span className="absolute bottom-2 left-2 bg-neutral-900/90 text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">
                      {prod.categoria}
                    </span>
                  </div>

                  <div className="p-4">
                    <h4 className="font-bold text-neutral-900 text-base leading-snug mb-1">
                      {prod.nombre}
                    </h4>
                    <p className="text-[11px] font-semibold text-blue-900 mb-2">
                      {prod.norma}
                    </p>
                    <p className="text-xs text-neutral-600 line-clamp-2 mb-3">
                      {prod.descripcion}
                    </p>

                    <div className="bg-neutral-50 border border-neutral-100 rounded p-2.5 text-xs text-neutral-700 space-y-1 mb-3">
                      <div><strong className="text-neutral-900">Espesores:</strong> {prod.espesores}</div>
                      <div><strong className="text-neutral-900">Medidas:</strong> {prod.largos}</div>
                    </div>
                  </div>
                </div>

                <div className="p-4 pt-0 border-t border-neutral-100 flex items-center justify-between mt-auto">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-neutral-400 block">Referencial</span>
                    <span className="text-lg font-black text-neutral-900">{prod.precio_ref}</span>
                  </div>
                  <button
                    onClick={() => agregarACotizacion(prod)}
                    className="bg-blue-900 hover:bg-amber-500 hover:text-neutral-950 text-white font-bold text-xs py-2 px-3 rounded transition"
                  >
                    + Cotizar
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Panel Lateral: Lista de Cotización Multipropósito */}
        <aside className="lg:col-span-1">
          <div className="bg-white border border-neutral-300 rounded-lg p-5 shadow-sm sticky top-28">
            <h4 className="text-base font-black text-neutral-900 pb-2 border-b border-neutral-200 flex items-center justify-between">
              <span>Mi Solicitud</span>
              <span className="bg-blue-100 text-blue-900 text-xs px-2 py-0.5 rounded-full font-bold">
                {cotizacion.reduce((acc, c) => acc + c.cantidad, 0)} ítems
              </span>
            </h4>

            {cotizacion.length === 0 ? (
              <div className="py-8 text-center text-xs text-neutral-400">
                Selecciona productos del catálogo con el botón <strong>"+ Cotizar"</strong> para añadirlos a tu lista consolidada.
              </div>
            ) : (
              <div className="divide-y divide-neutral-100 my-3 max-h-72 overflow-y-auto pr-1">
                {cotizacion.map(item => (
                  <div key={item.id} className="py-2.5 flex items-center justify-between text-xs">
                    <div className="max-w-[150px]">
                      <div className="font-bold text-neutral-900 truncate">{item.nombre}</div>
                      <div className="text-[10px] text-neutral-500">{item.precio_ref} c/u</div>
                    </div>
                    <div className="flex items-center gap-1.5 bg-neutral-100 px-2 py-1 rounded">
                      <button
                        onClick={() => actualizarCantidad(item.id, -1)}
                        className="font-bold text-neutral-600 hover:text-red-600 px-1"
                      >
                        -
                      </button>
                      <span className="font-bold">{item.cantidad}</span>
                      <button
                        onClick={() => actualizarCantidad(item.id, 1)}
                        className="font-bold text-neutral-600 hover:text-blue-900 px-1"
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
              className={`w-full py-2.5 rounded font-bold text-xs uppercase tracking-wider transition ${
                cotizacion.length > 0
                  ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow'
                  : 'bg-neutral-200 text-neutral-400 cursor-not-allowed'
              }`}
            >
              Pedir Cotización Oficial
            </button>

            <p className="text-[11px] text-neutral-400 text-center mt-3">
              Recibirás un documento detallado con disponibilidad de stock, descuentos por volumen y costos de envío.
            </p>
          </div>
        </aside>
      </main>

      {/* Footer Institucional Estilo Empresa Distribuidora */}
      <footer className="bg-neutral-900 text-neutral-400 text-xs mt-16 pt-12 pb-8 border-t border-neutral-800">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 mb-10">
          <div>
            <h5 className="text-white font-bold text-sm mb-3 uppercase tracking-wider">Sobre Nosotros</h5>
            <p className="text-neutral-400 leading-relaxed text-[11px]">
              Empresa comercializadora de aceros laminados, perfiles estructurales y coberturas de aluzinc y fibrocemento para proyectos de edificación, minería e infraestructura.
            </p>
          </div>
          <div>
            <h5 className="text-white font-bold text-sm mb-3 uppercase tracking-wider">Líneas de Producto</h5>
            <ul className="space-y-1.5 text-[11px]">
              <li>Calaminas Trapezoidales y Onduladas</li>
              <li>Perfiles Tubulares LAC y ASTM A500</li>
              <li>Planchas Galvanizadas y Aluzinc</li>
              <li>Fierro Sismorresistente Grado 60</li>
            </ul>
          </div>
          <div>
            <h5 className="text-white font-bold text-sm mb-3 uppercase tracking-wider">Planta & Almacén</h5>
            <p className="text-neutral-400 leading-relaxed text-[11px]">
              {configEmpresa.direccion}<br />
              Atención directa en patio de maniobras para carga de camiones plataforma.
            </p>
          </div>
          <div>
            <h5 className="text-white font-bold text-sm mb-3 uppercase tracking-wider">Medios de Pago</h5>
            <p className="text-neutral-400 leading-relaxed text-[11px] mb-2">
              Aceptamos transferencias BCP, BBVA, Interbank, cheques y pagos en ventanilla de almacén.
            </p>
            <span className="inline-block bg-neutral-800 px-2 py-1 rounded text-amber-400 font-mono text-[10px]">
              Emisión de Facturas y Guías de Remisión
            </span>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 pt-6 border-t border-neutral-800 text-center text-neutral-500 text-[11px]">
          © 2026 {configEmpresa.nombre} - RUC: {configEmpresa.ruc}. Todos los derechos reservados. Proyecto de Prácticas Preprofesionales.
        </div>
      </footer>
    </div>
  );
}