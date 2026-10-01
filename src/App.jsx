import { useState, useMemo } from 'react';
import ChatGemini from './components/ChatGemini';
import CalculadoraTecho from './components/CalculadoraTecho';
import ModalFichaTecnica from './components/ModalFichaTecnica';
import ModalPedidoExpress from './components/ModalPedidoExpress';
import LibroReclamacionesModal from './components/LibroReclamacionesModal';
import PoliticaPrivacidadModal from './components/PoliticaPrivacidadModal';
import TerminosCondicionesModal from './components/TerminosCondicionesModal';
import AvisoCookies from './components/AvisoCookies';
import {
  empresaConfig,
  categoriasProductos,
  serviciosEstructurales,
  galeriaProyectos,
  productosData
} from './data/productos';

export default function App() {
  // Estados de navegación y catálogo
  const [menuMovilAbierto, setMenuMovilAbierto] = useState(false);
  const [categoriaActiva, setCategoriaActiva] = useState('Todos');
  const [busqueda, setBusqueda] = useState('');
  const [orden, setOrden] = useState('defecto');
  const [cotizacion, setCotizacion] = useState([]);
  
  // Modales y Paneles
  const [calculadoraAbierta, setCalculadoraAbierta] = useState(false);
  const [productoFicha, setProductoFicha] = useState(null);
  const [pedidoExpressAbierto, setPedidoExpressAbierto] = useState(false);
  const [drawerCarritoAbierto, setDrawerCarritoAbierto] = useState(false);
  const [cotizacionCopiada, setCotizacionCopiada] = useState(false);
  const [drawerCliente, setDrawerCliente] = useState('');
  const [drawerUbicacion, setDrawerUbicacion] = useState('');

  // Modales de Cumplimiento Legal (Perú: INDECOPI / Ley 29571 / Ley 29733)
  const [libroReclamacionesAbierto, setLibroReclamacionesAbierto] = useState(false);
  const [politicaPrivacidadAbierta, setPoliticaPrivacidadAbierta] = useState(false);
  const [terminosCondicionesAbierto, setTerminosCondicionesAbierto] = useState(false);
  const [aceptaPrivacidadForm, setAceptaPrivacidadForm] = useState(false);

  // Formulario Web de Cotización Asíncrono (RF-09, RF-10)
  const [formObra, setFormObra] = useState({
    nombre: '',
    telefono: '',
    ubicacion: '',
    productoServicio: 'Calaminón Aluzinc TR4 a medida',
    detalle: ''
  });
  const [formEnviando, setFormEnviando] = useState(false);
  const [formExito, setFormExito] = useState(false);
  const [formError, setFormError] = useState('');

  // Filtrado y Ordenamiento del Catálogo
  const productosFiltrados = useMemo(() => {
    let prods = productosData.filter(p => {
      const coincideCat = categoriaActiva === 'Todos' || p.categoria === categoriaActiva;
      const busqLimpia = busqueda.toLowerCase().trim();
      const coincideTxt = !busqLimpia ||
        p.nombre.toLowerCase().includes(busqLimpia) ||
        p.descripcion.toLowerCase().includes(busqLimpia) ||
        p.norma.toLowerCase().includes(busqLimpia) ||
        (p.usos && p.usos.some(u => u.toLowerCase().includes(busqLimpia)));
      return coincideCat && coincideTxt;
    });

    if (orden === 'precio-asc') {
      prods = [...prods].sort((a, b) => a.precio_num - b.precio_num);
    } else if (orden === 'precio-desc') {
      prods = [...prods].sort((a, b) => b.precio_num - a.precio_num);
    } else if (orden === 'nombre') {
      prods = [...prods].sort((a, b) => a.nombre.localeCompare(b.nombre));
    }

    return prods;
  }, [categoriaActiva, busqueda, orden]);

  // Manejo de Lista de Cotización
  const agregarACotizacion = (item, cantidadExtra = 1) => {
    const existe = cotizacion.find(c => c.id === item.id);
    if (existe) {
      setCotizacion(cotizacion.map(c => 
        c.id === item.id ? { ...c, cantidad: c.cantidad + cantidadExtra } : c
      ));
    } else {
      setCotizacion([...cotizacion, { ...item, cantidad: cantidadExtra }]);
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

  const eliminarDeCotizacion = (id) => {
    setCotizacion(cotizacion.filter(c => c.id !== id));
  };

  const vaciarCotizacion = () => {
    if (window.confirm('¿Deseas vaciar los materiales de tu cotización?')) {
      setCotizacion([]);
    }
  };

  const totalCantidadItems = cotizacion.reduce((acc, c) => acc + c.cantidad, 0);
  const totalMontoEstimado = cotizacion.reduce((acc, c) => acc + (c.precio_num * c.cantidad), 0);

  // Generador de Mensaje Contextual para WhatsApp (RF-02, RF-14)
  const generarEnlaceWhatsApp = (mensajePersonalizado) => {
    const texto = encodeURIComponent(mensajePersonalizado);
    return `https://wa.me/${empresaConfig.telefono}?text=${texto}`;
  };

  const generarTextoCotizacionLista = () => {
    let mensaje = `🏗️ *SOLICITUD DE COTIZACIÓN FORMAL - ${empresaConfig.nombre}*\n`;
    mensaje += `🏢 *Razón Social:* ${empresaConfig.razonSocial}\n`;
    mensaje += `📄 *RUC:* ${empresaConfig.ruc} (${empresaConfig.condicionSunat})\n`;
    mensaje += `📍 *Planta:* ${empresaConfig.domicilioFiscal}\n`;
    if (drawerCliente.trim()) mensaje += `👤 *Cliente / Empresa:* ${drawerCliente.trim()}\n`;
    if (drawerUbicacion.trim()) mensaje += `📍 *Lugar de Obra:* ${drawerUbicacion.trim()}\n`;
    mensaje += `------------------------------------\n`;
    mensaje += `*LISTA DE MATERIALES:* \n\n`;
    
    cotizacion.forEach((item, index) => {
      const subtotalItem = (item.precio_num * item.cantidad).toFixed(2);
      mensaje += `${index + 1}. ▪ *${item.cantidad} ${item.unidad || 'un.'}* | ${item.nombre}\n`;
      mensaje += `   Espesor/Medida: ${item.espesores}\n`;
      mensaje += `   Precio Ref.: ${item.precio_ref} (Subtotal: S/ ${subtotalItem})\n\n`;
    });
    
    mensaje += `------------------------------------\n`;
    mensaje += `💰 *TOTAL ESTIMADO REFERENCIAL:* S/ ${totalMontoEstimado.toFixed(2)}\n`;
    mensaje += `------------------------------------\n`;
    mensaje += `Solicito confirmación de plazo de entrega y emisión de Factura/Boleta Electrónica. Gracias.`;
    return mensaje;
  };

  const enviarCotizacionWhatsApp = () => {
    if (cotizacion.length === 0) return;
    const mensaje = generarTextoCotizacionLista();
    window.open(`https://wa.me/${empresaConfig.telefono}?text=${encodeURIComponent(mensaje)}`, '_blank');
  };

  const copiarCotizacionAlPortapapeles = () => {
    if (cotizacion.length === 0) return;
    const texto = generarTextoCotizacionLista();
    navigator.clipboard.writeText(texto).then(() => {
      setCotizacionCopiada(true);
      setTimeout(() => setCotizacionCopiada(false), 2500);
    }).catch(() => {});
  };

  // Manejo del Formulario Web Asíncrono de Obra (RF-09, RF-10)
  const handleFormularioObraSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    // Validación regex de teléfono peruano (9 dígitos, inicia en 9)
    const regexTel = /^9\d{8}$/;
    const telLimpio = formObra.telefono.trim().replace(/\s+/g, '');
    if (!regexTel.test(telLimpio)) {
      setFormError('Por favor ingresa un número de celular/WhatsApp válido de 9 dígitos (ej: 921819166).');
      return;
    }

    if (!formObra.nombre.trim()) {
      setFormError('Por favor ingresa tu nombre o razón social.');
      return;
    }

    // Validación legal obligatoria: Consentimiento Ley N° 29733
    if (!aceptaPrivacidadForm) {
      setFormError('Debe aceptar la Política de Privacidad y el tratamiento de sus datos personales conforme a la Ley N° 29733 para enviar su solicitud.');
      return;
    }

    setFormEnviando(true);

    try {
      // Simulación de envío asíncrono con fetch() (o integración con servicio de correo)
      await new Promise((resolve) => setTimeout(resolve, 800));

      // Construcción del mensaje para respaldo en WhatsApp
      const mensajeWA = `📋 *NUEVA SOLICITUD WEB DE COTIZACIÓN (OBRA)*\n` +
        `👤 *Cliente / Empresa:* ${formObra.nombre}\n` +
        `📱 *Teléfono:* ${formObra.telefono}\n` +
        `📍 *Lugar de Obra:* ${formObra.ubicacion || 'San Marcos / Cajamarca'}\n` +
        `📦 *Material / Servicio:* ${formObra.productoServicio}\n` +
        `📝 *Detalle del Pedido:* ${formObra.detalle || 'Solicito cotización con corte a medida'}\n` +
        `🏛️ *Atención:* ${empresaConfig.razonSocial} (RUC: ${empresaConfig.ruc})`;

      // Disparar WhatsApp para asegurar entrega inmediata
      window.open(`https://wa.me/${empresaConfig.telefono}?text=${encodeURIComponent(mensajeWA)}`, '_blank');

      // Limpieza de campos y confirmación en pantalla sin recarga (RF-10)
      setFormObra({
        nombre: '',
        telefono: '',
        ubicacion: '',
        productoServicio: 'Calaminón Aluzinc TR4 a medida',
        detalle: ''
      });
      setFormExito(true);
      setTimeout(() => setFormExito(false), 6000);
    } catch {
      setFormError('Hubo un inconveniente al procesar el formulario. Por favor contáctanos directamente a nuestro WhatsApp.');
    } finally {
      setFormEnviando(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800 font-sans antialiased selection:bg-slate-900 selection:text-white pb-20 lg:pb-0">
      
      {/* ========================================================
          1. TOP BAR INSTITUCIONAL & RESPALDO TRIBUTARIO (RF-07, RF-08, RF-15)
         ======================================================== */}
      <div className="bg-slate-950 text-slate-300 text-[11px] sm:text-xs py-2 px-4 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-between items-center gap-2">
          {/* Datos Fiscales SUNAT Visibles */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-4">
            <span className="flex items-center gap-1.5 font-bold text-white">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>{empresaConfig.nombre}</span>
            </span>
            <span className="text-slate-400 hidden sm:inline">|</span>
            <span className="text-slate-300 font-medium">
              RUC: <strong className="text-white">{empresaConfig.ruc}</strong>
            </span>
            <span className="hidden md:inline bg-emerald-950 text-emerald-300 border border-emerald-800/80 px-2 py-0.2 rounded text-[10px] font-bold">
              {empresaConfig.condicionSunat}
            </span>
            <span className="hidden lg:inline text-slate-400">
              CIIU {empresaConfig.ciiu}: Fabricación de estructuras metálicas
            </span>
          </div>

          {/* Contacto Directo y Horario de Planta */}
          <div className="flex items-center gap-3">
            <span className="hidden sm:inline text-slate-400">
              🕒 {empresaConfig.atencion}
            </span>
            {/* Marcación Telefónica Directa (RF-03) */}
            <a
              href={`tel:${empresaConfig.telefonoLlamada}`}
              className="text-white hover:text-emerald-400 font-bold flex items-center gap-1 transition"
              title="Llamada telefónica directa a planta"
            >
              <span>📞</span>
              <span>{empresaConfig.telefonoDisplay}</span>
            </a>
          </div>
        </div>
      </div>

      {/* ========================================================
          2. CABECERA PERSISTENTE STICKY & MENÚ RESPONSIVO (RF-01)
         ======================================================== */}
      <header className="glass-surface border-b border-slate-200 sticky top-0 z-40 transition-all shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 py-2.5 flex justify-between items-center gap-3">
          {/* Logo Oficial y Denominación */}
          <a href="#inicio" className="flex items-center gap-3 group">
            <img
              src={empresaConfig.logo}
              alt="Techos Metálicos Huayobamba - Techos Metálicos y Estructuras Victoria S.R.L."
              className="h-11 sm:h-13 w-auto object-contain rounded-md drop-shadow-2xs group-hover:scale-102 transition-transform duration-200"
            />
            <div className="border-l border-slate-200 pl-3">
              <span className="block text-[11px] sm:text-xs font-black text-slate-900 uppercase tracking-wider">
                {empresaConfig.nombre}
              </span>
              <span className="block text-[10px] sm:text-[11px] font-semibold text-slate-600">
                {empresaConfig.razonSocial}
              </span>
            </div>
          </a>

          {/* Menú de Navegación de Escritorio con Scroll Suave (RF-01) */}
          <nav className="hidden lg:flex items-center gap-5 text-xs font-bold text-slate-700">
            <a href="#inicio" className="hover:text-slate-950 transition py-1">Inicio</a>
            <a href="#productos" className="hover:text-slate-950 transition py-1">Productos & Medidas</a>
            <a href="#estructuras" className="hover:text-slate-950 transition py-1">Estructuras CIIU 2511</a>
            <a href="#garantia" className="hover:text-slate-950 transition py-1">Formalidad SUNAT</a>
            <a href="#galeria" className="hover:text-slate-950 transition py-1">Proyectos en Obra</a>
            <a href="#cotizacion" className="hover:text-slate-950 transition py-1">Cotizar Obra</a>
            <a href="#ubicacion" className="hover:text-slate-950 transition py-1">Ubicación Planta</a>
          </nav>

          {/* Acciones Rápidas: Calculadora, Carrito y Menú Móvil */}
          <div className="flex items-center gap-2">
            {/* Botón Calculadora */}
            <button
              onClick={() => setCalculadoraAbierta(true)}
              className="bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs py-2 px-3 sm:px-3.5 rounded-xl transition flex items-center gap-1.5 shadow-2xs"
              title="Calcular planchas para tu techo"
            >
              <span>📐</span>
              <span className="hidden sm:inline">Calculadora</span>
            </button>

            {/* Marcación Telefónica Directa (RF-03) */}
            <a
              href={`tel:${empresaConfig.telefonoLlamada}`}
              className="hidden sm:flex bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-800 font-bold text-xs py-2 px-3 rounded-xl transition items-center gap-1.5"
              title="Llamar directamente a planta"
            >
              <span>📞</span>
              <span>Llamar</span>
            </a>

            {/* Carrito Cotizador */}
            {totalCantidadItems > 0 && (
              <button
                onClick={() => setDrawerCarritoAbierto(true)}
                className="relative bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs py-2 px-3 rounded-xl transition flex items-center gap-1.5 shadow-2xs"
                title="Ver lista de cotización"
              >
                <span>📋</span>
                <span className="bg-white text-emerald-800 font-black px-1.5 py-0.2 rounded-full text-[10px]">
                  {totalCantidadItems}
                </span>
              </button>
            )}

            {/* Botón Menú Hamburguesa en Móvil (RF-01, RNF-05 área >= 48px) */}
            <button
              onClick={() => setMenuMovilAbierto(!menuMovilAbierto)}
              className="lg:hidden p-2.5 rounded-xl text-slate-700 hover:text-slate-950 hover:bg-slate-100 transition min-w-[48px] min-h-[48px] flex items-center justify-center"
              aria-label="Abrir menú de navegación"
            >
              <span className="text-xl">{menuMovilAbierto ? '✕' : '☰'}</span>
            </button>
          </div>
        </div>

        {/* Desplegable del Menú Móvil (RF-01) */}
        {menuMovilAbierto && (
          <div className="lg:hidden bg-white border-t border-slate-200 px-4 py-3 space-y-2 text-xs font-bold text-slate-700 shadow-xl animate-fadeIn">
            <a
              href="#inicio"
              onClick={() => setMenuMovilAbierto(false)}
              className="block py-2 px-3 rounded-lg hover:bg-slate-100 transition"
            >
              🏠 Inicio
            </a>
            <a
              href="#productos"
              onClick={() => setMenuMovilAbierto(false)}
              className="block py-2 px-3 rounded-lg hover:bg-slate-100 transition"
            >
              📦 Catálogo de Coberturas (Calaminón y Teja)
            </a>
            <a
              href="#estructuras"
              onClick={() => setMenuMovilAbierto(false)}
              className="block py-2 px-3 rounded-lg hover:bg-slate-100 transition"
            >
              🏗️ Servicios Estructurales CIIU 2511
            </a>
            <a
              href="#garantia"
              onClick={() => setMenuMovilAbierto(false)}
              className="block py-2 px-3 rounded-lg hover:bg-slate-100 transition"
            >
              🏛️ Formalidad SUNAT (RUC 20612894451)
            </a>
            <a
              href="#galeria"
              onClick={() => setMenuMovilAbierto(false)}
              className="block py-2 px-3 rounded-lg hover:bg-slate-100 transition"
            >
              📸 Proyectos en Obra y Taller
            </a>
            <a
              href="#cotizacion"
              onClick={() => setMenuMovilAbierto(false)}
              className="block py-2 px-3 rounded-lg hover:bg-slate-100 transition"
            >
              📝 Formulario Web de Cotización
            </a>
            <a
              href="#ubicacion"
              onClick={() => setMenuMovilAbierto(false)}
              className="block py-2 px-3 rounded-lg hover:bg-slate-100 transition"
            >
              📍 Ubicación de Planta & GPS
            </a>

            {/* Accesos Legales e INDECOPI en Móvil */}
            <div className="pt-2 border-t border-slate-100 space-y-1.5">
              <button
                type="button"
                onClick={() => {
                  setMenuMovilAbierto(false);
                  setLibroReclamacionesAbierto(true);
                }}
                className="w-full text-left py-2 px-3 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-950 font-bold flex items-center justify-between text-xs"
              >
                <span>📖 Libro de Reclamaciones</span>
                <span className="text-[10px] bg-amber-200 text-amber-900 px-1.5 py-0.5 rounded font-black">INDECOPI</span>
              </button>
              <div className="flex gap-2 text-[11px] text-slate-500 px-1">
                <button
                  type="button"
                  onClick={() => {
                    setMenuMovilAbierto(false);
                    setPoliticaPrivacidadAbierta(true);
                  }}
                  className="hover:text-slate-900 underline"
                >
                  🛡️ Privacidad (Ley 29733)
                </button>
                <span>•</span>
                <button
                  type="button"
                  onClick={() => {
                    setMenuMovilAbierto(false);
                    setTerminosCondicionesAbierto(true);
                  }}
                  className="hover:text-slate-900 underline"
                >
                  ⚖️ Términos
                </button>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 flex gap-2">
              <a
                href={`tel:${empresaConfig.telefonoLlamada}`}
                className="flex-1 py-2.5 bg-slate-900 text-white rounded-lg text-center font-bold text-xs"
              >
                📞 Llamar a Planta
              </a>
              <a
                href={generarEnlaceWhatsApp("Hola, me comunico desde la web para cotizar coberturas")}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-2.5 bg-emerald-600 text-white rounded-lg text-center font-bold text-xs"
              >
                📲 WhatsApp
              </a>
            </div>
          </div>
        )}
      </header>

      {/* ========================================================
          3. HERO PRINCIPAL: IDENTIDAD & PROPUESTA DE VALOR (#inicio)
         ======================================================== */}
      <section id="inicio" className="relative overflow-hidden bg-slate-950 text-white py-12 sm:py-18 px-4 bg-grid-slate-dark border-b border-slate-800">
        <div className="max-w-7xl mx-auto relative flex flex-col lg:flex-row justify-between items-center gap-10">
          {/* Mensaje de Autoridad y Conversión */}
          <div className="max-w-2xl text-left">
            <div className="inline-flex flex-wrap items-center gap-2 bg-slate-900 text-slate-200 text-[11px] font-bold uppercase px-3 py-1 rounded-full tracking-wider mb-4 border border-slate-800 shadow-sm">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>VENTA DIRECTA DE FÁBRICA • HUAYOBAMBA, SAN MARCOS</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
              {empresaConfig.nombre}
            </h1>
            <p className="text-red-400 font-bold text-xs sm:text-sm mt-1 uppercase tracking-wider">
              {empresaConfig.razonSocial} • RUC {empresaConfig.ruc}
            </p>

            <p className="text-slate-300 text-sm sm:text-base mt-4 leading-relaxed font-normal">
              Especialistas en <strong>Teja Metálica Prepintada Aluzinc</strong> y <strong>Calaminón Trapezoidal TR4</strong> rolado a la medida exacta de tu obra con recubrimiento <strong>AZ-150</strong>. Eliminamos sobrecostos de intermediarios y garantizamos <strong>formalidad tributaria</strong> con emisión de Facturas y Boletas Electrónicas autorizadas ante SUNAT.
            </p>

            {/* Botones de Conversión Inmediata (RF-02, RF-03, RF-09) */}
            <div className="mt-8 flex flex-wrap gap-2.5 sm:gap-3">
              <a
                href="#cotizacion"
                className="bg-red-600 hover:bg-red-500 text-white font-bold text-xs sm:text-sm py-3 px-4.5 rounded-xl shadow-lg transition duration-200 flex items-center gap-2 transform hover:-translate-y-0.5"
              >
                <span>📝 Cotizar Pedido para Obra</span>
              </a>
              <button
                type="button"
                onClick={() => setPedidoExpressAbierto(true)}
                className="bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs sm:text-sm py-3 px-4.5 rounded-xl transition duration-200 flex items-center gap-1.5 shadow-lg transform hover:-translate-y-0.5"
                title="Hacer pedido directo por WhatsApp en 3 pasos"
              >
                <span>⚡ Pedido Rápido por Celular</span>
              </button>
              <button
                type="button"
                onClick={() => setCalculadoraAbierta(true)}
                className="bg-slate-900 hover:bg-slate-800 border border-slate-700 text-white font-bold text-xs sm:text-sm py-3 px-4 rounded-xl transition duration-200 flex items-center gap-1.5"
              >
                <span>📐 Calculadora</span>
              </button>
              <a
                href={`tel:${empresaConfig.telefonoLlamada}`}
                className="bg-slate-800 hover:bg-slate-700 border border-slate-600 text-white font-bold text-xs sm:text-sm py-3 px-3.5 rounded-xl transition duration-200 flex items-center gap-1.5"
              >
                <span>📞 Llamar</span>
              </a>
            </div>
          </div>

          {/* Matriz de Respaldo Técnico e Institucional */}
          <div className="grid grid-cols-2 gap-3.5 w-full lg:w-96 shrink-0">
            <div className="bg-slate-900/80 backdrop-blur border border-slate-800 p-4 rounded-xl shadow-2xs hover:border-slate-700 transition">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Norma de Acero</span>
              <span className="text-xl sm:text-2xl font-black text-white block mt-0.5">Aluzinc AZ-150</span>
              <span className="text-xs text-slate-400 mt-1 block">55% Al / 43.4% Zn (ASTM A792)</span>
            </div>

            <div className="bg-slate-900/80 backdrop-blur border border-slate-800 p-4 rounded-xl shadow-2xs hover:border-slate-700 transition">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Corte Milimétrico</span>
              <span className="text-xl sm:text-2xl font-black text-white block mt-0.5">0% Desperdicio</span>
              <span className="text-xs text-slate-400 mt-1 block">Longitud continua hasta 12m</span>
            </div>

            <div className="bg-slate-900/80 backdrop-blur border border-slate-800 p-4 rounded-xl shadow-2xs hover:border-slate-700 transition">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Respaldo Legal</span>
              <span className="text-xl sm:text-2xl font-black text-emerald-400 block mt-0.5">ACTIVO / HABIDO</span>
              <span className="text-xs text-slate-400 mt-1 block">Facturas & Boletas SUNAT</span>
            </div>

            <div className="bg-slate-900/80 backdrop-blur border border-slate-800 p-4 rounded-xl shadow-2xs hover:border-slate-700 transition">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Actividad Siderúrgica</span>
              <span className="text-xl sm:text-2xl font-black text-white block mt-0.5">CIIU 2511</span>
              <span className="text-xs text-slate-400 mt-1 block">Tijerales y estructuras de acero</span>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          4. MÓDULO DE PRODUCTOS & CATÁLOGO TÉCNICO (#productos, RF-04, RF-05, RF-14)
         ======================================================== */}
      <section id="productos" className="max-w-7xl mx-auto px-4 py-12 scroll-mt-20">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-6 pb-3 border-b border-slate-200">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-6 bg-red-600 rounded-xs"></span>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                Catálogo Directo de Coberturas Metálicas
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Fabricación en planta con cortes de longitud a medida para eliminar uniones y filtraciones en techos andinos.
            </p>
          </div>

          {/* Buscador y Ordenador */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 text-xs w-full sm:w-auto">
            <div className="relative flex-1 sm:w-64">
              <input
                type="text"
                placeholder="Buscar teja, TR4, perfil, norma..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                className="w-full pl-8 pr-7 py-2 border border-slate-300 rounded-xl text-xs font-medium bg-white focus:outline-none focus:ring-2 focus:ring-slate-900"
              />
              <span className="absolute left-2.5 top-2.5 text-slate-400 text-xs">🔍</span>
              {busqueda && (
                <button
                  onClick={() => setBusqueda('')}
                  className="absolute right-2 top-2 text-slate-400 hover:text-slate-700 text-xs p-0.5"
                  aria-label="Limpiar búsqueda"
                >
                  ✕
                </button>
              )}
            </div>

            <div className="flex items-center gap-2">
              <span className="text-slate-500 font-medium shrink-0">Ordenar:</span>
              <select
                value={orden}
                onChange={(e) => setOrden(e.target.value)}
                className="px-2.5 py-2 border border-slate-300 rounded-xl text-xs font-semibold bg-white focus:outline-none focus:ring-2 focus:ring-slate-900"
              >
                <option value="defecto">Recomendados de Planta</option>
                <option value="precio-asc">Precio: Menor a Mayor</option>
                <option value="precio-desc">Precio: Mayor a Menor</option>
                <option value="nombre">Nombre (A-Z)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Selector de Categorías */}
        <div className="flex overflow-x-auto gap-2 pb-4 mb-6 no-scrollbar">
          {categoriasProductos.map(cat => (
            <button
              key={cat}
              onClick={() => setCategoriaActiva(cat)}
              className={`py-2 px-3.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                categoriaActiva === cat
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Cuadrícula de Productos */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {productosFiltrados.map(prod => (
            <article
              key={prod.id}
              className="group bg-white border border-slate-200 hover:border-slate-400 rounded-2xl overflow-hidden shadow-2xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                {/* Imagen con categoría */}
                <div className="h-50 overflow-hidden bg-slate-100 relative">
                  <img
                    src={prod.imagen}
                    alt={prod.nombre}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-104 transition-transform duration-500 ease-out"
                    onError={(e) => {
                      e.target.src = 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=600&q=80';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-60"></div>
                  
                  <span className="absolute bottom-2.5 left-2.5 bg-slate-950/85 backdrop-blur text-white text-[10px] font-bold px-2 py-0.5 rounded tracking-wide border border-slate-700">
                    {prod.categoria}
                  </span>

                  {prod.destacado && (
                    <span className="absolute top-2.5 right-2.5 bg-red-600 text-white text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider shadow">
                      ★ Fabricación Principal
                    </span>
                  )}
                </div>

                {/* Datos Técnicos del Producto */}
                <div className="p-5">
                  <h3 className="font-bold text-slate-900 text-base leading-snug mb-1 group-hover:text-red-600 transition-colors">
                    {prod.nombre}
                  </h3>
                  <p className="text-[11px] font-semibold text-slate-500 mb-2 flex items-center gap-1">
                    <span>⚙️</span> {prod.norma}
                  </p>
                  <p className="text-xs text-slate-600 line-clamp-2 mb-3.5 leading-relaxed">
                    {prod.descripcion}
                  </p>

                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-700 space-y-1.5 mb-3">
                    <div className="flex justify-between">
                      <span className="text-slate-500 font-semibold">Espesores:</span>
                      <span className="text-slate-900 font-bold">{prod.espesores}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500 font-semibold">Cortes:</span>
                      <span className="text-slate-900 font-bold truncate max-w-[170px]" title={prod.largos}>
                        {prod.largos}
                      </span>
                    </div>
                    {prod.anchoUtil && (
                      <div className="flex justify-between">
                        <span className="text-slate-500 font-semibold">Ancho Útil:</span>
                        <span className="text-slate-900 font-bold">{prod.anchoUtil}</span>
                      </div>
                    )}
                  </div>

                  {/* Botón Ver Ficha Técnica */}
                  <button
                    onClick={() => setProductoFicha(prod)}
                    className="text-slate-700 hover:text-slate-950 font-bold text-xs flex items-center gap-1.5 transition"
                  >
                    <span>📄 Ficha técnica y usos recomendados</span>
                    <span className="text-slate-400 group-hover:translate-x-0.5 transition-transform">→</span>
                  </button>
                </div>
              </div>

              {/* Botones de Conversión: Cotizar en WhatsApp (RF-14) o Añadir a Lista */}
              <div className="p-5 pt-0 border-t border-slate-100 flex flex-col gap-2 mt-auto">
                <div className="flex items-center justify-between pt-3">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block leading-tight">
                      Precio Ref. por {prod.unidad || 'unidad'}
                    </span>
                    <span className="text-xl font-black text-slate-900">{prod.precio_ref}</span>
                  </div>
                  <button
                    onClick={() => agregarACotizacion(prod)}
                    className="bg-slate-100 hover:bg-slate-200 text-slate-900 font-bold text-xs py-2 px-3 rounded-lg transition border border-slate-300"
                  >
                    + Lista
                  </button>
                </div>

                {/* Enrutamiento Contextual WhatsApp (RF-14) */}
                <a
                  href={generarEnlaceWhatsApp(`Hola, solicito cotización directa de fábrica para: ${prod.nombre} (Norma: ${prod.norma}). Requiero información de cortes y plazos de entrega.`)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl text-center transition flex items-center justify-center gap-1.5 shadow-2xs"
                >
                  <span>📲 Cotizar este material por WhatsApp</span>
                </a>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* ========================================================
          5. MÓDULO DE ESTRUCTURAS METÁLICAS CIIU 2511 (#estructuras, RF-06)
         ======================================================== */}
      <section id="estructuras" className="bg-slate-900 text-white py-14 px-4 scroll-mt-20 border-y border-slate-800">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="text-red-400 font-bold text-xs uppercase tracking-wider block mb-1">
              ACTIVIDAD PRINCIPAL SUNAT: CIIU 2511
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight">
              Diseño, Fabricación y Montaje de Estructuras de Acero
            </h2>
            <p className="text-slate-300 text-xs sm:text-sm mt-3 leading-relaxed">
              En <strong>{empresaConfig.razonSocial}</strong> contamos con taller metalmecánico propio en Huayobamba para la habilitación de tijerales, arcos parabólicos, cerchas reticulares y naves de acero calculadas para cargas andinas de granizo y vientos.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {serviciosEstructurales.map(srv => (
              <div
                key={srv.id}
                className="bg-slate-800/80 border border-slate-700 rounded-2xl p-6 flex flex-col justify-between hover:border-slate-500 transition shadow-sm"
              >
                <div>
                  <div className="h-44 rounded-xl overflow-hidden mb-4 border border-slate-700">
                    <img
                      src={srv.imagen}
                      alt={srv.titulo}
                      loading="lazy"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950/80 border border-emerald-800/80 px-2 py-0.5 rounded">
                    {srv.norma}
                  </span>
                  <h3 className="font-bold text-base text-white mt-2 mb-2 leading-snug">
                    {srv.titulo}
                  </h3>
                  <p className="text-xs text-slate-300 leading-relaxed mb-4">
                    {srv.descripcion}
                  </p>

                  <div className="space-y-1.5 mb-6">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                      Aplicaciones:
                    </span>
                    {srv.aplicaciones.map((app, i) => (
                      <div key={i} className="text-xs text-slate-300 flex items-center gap-1.5">
                        <span className="text-emerald-400 font-bold">✔</span>
                        <span>{app}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <a
                  href={generarEnlaceWhatsApp(`Hola, quisiera cotizar el servicio estructural de: ${srv.titulo} (Actividad CIIU 2511). Tengo planos o medidas de obra para evaluar.`)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2.5 bg-red-600 hover:bg-red-500 text-white rounded-xl text-center font-bold text-xs uppercase tracking-wider transition shadow flex items-center justify-center gap-1.5"
                >
                  <span>📲 {srv.ctaTexto}</span>
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================
          6. PANEL DE FORMALIDAD TRIBUTARIA & RESPALDO SUNAT (#garantia, RF-07, RF-08)
         ======================================================== */}
      <section id="garantia" className="max-w-7xl mx-auto px-4 py-14 scroll-mt-20">
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-10 shadow-sm">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-6 border-b border-slate-200">
            <div>
              <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-700 border border-emerald-200 px-3 py-1 rounded-full text-xs font-bold mb-2">
                <span>🏛️</span>
                <span>EMPRESA FORMAL REGISTRADA ANTE SUNAT</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                Ficha Técnica Institucional y Respaldo Legal
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Garantía y solvencia contable para contratistas, ingenieros residentes y personas naturales en todo Cajamarca.
              </p>
            </div>

            {/* Insignia de Facturación Electrónica (RF-08) */}
            <div className="bg-slate-950 text-white p-4 rounded-2xl border border-slate-800 text-right">
              <span className="text-[10px] text-emerald-400 font-bold block uppercase tracking-wider">
                COMPROBANTES AUTORIZADOS
              </span>
              <span className="text-base font-black text-white block mt-0.5">
                Factura & Boleta Electrónica
              </span>
              <span className="text-[11px] text-slate-400 block mt-0.5">
                100% Válido para Crédito Fiscal
              </span>
            </div>
          </div>

          {/* Tabla Formal de Datos SUNAT (RF-07) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-6 text-xs">
            <div className="space-y-3">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80">
                <span className="font-bold text-slate-400 uppercase text-[10px] block">Razón Social Oficial</span>
                <span className="font-black text-slate-900 text-sm">{empresaConfig.razonSocial}</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80">
                <span className="font-bold text-slate-400 uppercase text-[10px] block">Registro Único de Contribuyente (RUC)</span>
                <span className="font-black text-slate-900 text-sm tracking-wider">{empresaConfig.ruc}</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80">
                <span className="font-bold text-slate-400 uppercase text-[10px] block">Nombre Comercial</span>
                <span className="font-black text-slate-900 text-sm">{empresaConfig.nombreComercial}</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80">
                <span className="font-bold text-slate-400 uppercase text-[10px] block">Tipo Societario</span>
                <span className="font-medium text-slate-800">{empresaConfig.tipoSocietario}</span>
              </div>
            </div>

            <div className="space-y-3">
              <div className="p-3 bg-emerald-50/60 rounded-xl border border-emerald-200">
                <span className="font-bold text-emerald-700 uppercase text-[10px] block">Condición y Estado SUNAT</span>
                <span className="font-black text-emerald-900 text-sm">{empresaConfig.condicionSunat}</span>
                <span className="text-[11px] text-emerald-700 block mt-0.5">
                  Inscripción: {empresaConfig.inscripcionSunat} | Inicio: {empresaConfig.inicioActividades}
                </span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80">
                <span className="font-bold text-slate-400 uppercase text-[10px] block">Domicilio Fiscal / Planta Siderúrgica</span>
                <span className="font-medium text-slate-900">{empresaConfig.domicilioFiscal}</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80">
                <span className="font-bold text-slate-400 uppercase text-[10px] block">Actividad Económica Principal</span>
                <span className="font-medium text-slate-800">{empresaConfig.actividadPrincipal}</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80">
                <span className="font-bold text-slate-400 uppercase text-[10px] block">Atención & Despachos</span>
                <span className="font-medium text-slate-800">{empresaConfig.atencion} • {empresaConfig.telefonoDisplay}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          7. GALERÍA DE PROYECTOS EN OBRA & TALLER (#galeria, RF-13)
         ======================================================== */}
      <section id="galeria" className="max-w-7xl mx-auto px-4 py-12 scroll-mt-20">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-red-600 font-bold text-xs uppercase tracking-wider block mb-1">
            EVIDENCIA DE TRABAJO REAL
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Galería de Proyectos en Obra y Procesos de Taller
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-2">
            Supervisión directa en soldadura, habilitación de cerchas, rolado continuo de coberturas y entregas en campo.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {galeriaProyectos.map(item => (
            <div
              key={item.id}
              className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-2xs hover:shadow-lg transition duration-200"
            >
              <div className="h-52 overflow-hidden bg-slate-100 relative">
                <img
                  src={item.imagen}
                  alt={item.titulo}
                  loading="lazy"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute bottom-2.5 left-2.5 bg-slate-950/80 backdrop-blur text-white text-[10px] font-bold px-2 py-0.5 rounded">
                  {item.etiqueta}
                </span>
              </div>
              <div className="p-4">
                <span className="text-[10px] font-bold text-red-600 uppercase tracking-wide block">
                  📍 {item.ubicacion}
                </span>
                <h3 className="font-bold text-slate-900 text-sm mt-1 mb-1">
                  {item.titulo}
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  {item.descripcion}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ========================================================
          8. FORMULARIO ASÍNCRONO DE COTIZACIÓN DE OBRA (#cotizacion, RF-09, RF-10)
         ======================================================== */}
      <section id="cotizacion" className="bg-slate-900 text-white py-16 px-4 scroll-mt-20 border-t border-slate-800">
        <div className="max-w-4xl mx-auto bg-slate-950 border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl">
          <div className="text-center max-w-xl mx-auto mb-8">
            <span className="text-emerald-400 font-bold text-xs uppercase tracking-wider block mb-1">
              CANAL DE ATENCIÓN DIRECTO
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Solicitud de Cotización de Materiales y Obra
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-2">
              Ingresa los datos de tu techo o estructura. Te responderemos en breve con la cubicación exacta y presupuesto de fábrica.
            </p>
          </div>

          {formExito && (
            <div className="bg-emerald-950/90 border border-emerald-500 text-emerald-200 p-4 rounded-xl text-xs text-center mb-6 animate-fadeIn">
              ✔ <strong>¡Solicitud enviada con éxito!</strong> Nos comunicaremos a tu WhatsApp para coordinar medidas exactas y plazo de entrega.
            </div>
          )}

          {formError && (
            <div className="bg-red-950/90 border border-red-500 text-red-200 p-3.5 rounded-xl text-xs text-center mb-6">
              ⚠️ {formError}
            </div>
          )}

          <form onSubmit={handleFormularioObraSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wide mb-1.5">
                  Nombre Completo / Empresa *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ej: Juan Pérez / Constructora San Marcos"
                  value={formObra.nombre}
                  onChange={(e) => setFormObra({ ...formObra, nombre: e.target.value })}
                  className="w-full text-xs sm:text-sm bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wide mb-1.5">
                  Teléfono / WhatsApp (9 dígitos) *
                </label>
                <input
                  type="tel"
                  required
                  maxLength={9}
                  placeholder="Ej: 921819166"
                  value={formObra.telefono}
                  onChange={(e) => setFormObra({ ...formObra, telefono: e.target.value })}
                  className="w-full text-xs sm:text-sm bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wide mb-1.5">
                  Ubicación de Obra (Distrito / Caserío)
                </label>
                <input
                  type="text"
                  placeholder="Ej: Huayobamba, Pedro Gálvez, San Marcos"
                  value={formObra.ubicacion}
                  onChange={(e) => setFormObra({ ...formObra, ubicacion: e.target.value })}
                  className="w-full text-xs sm:text-sm bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wide mb-1.5">
                  Material o Servicio Requerido
                </label>
                <select
                  value={formObra.productoServicio}
                  onChange={(e) => setFormObra({ ...formObra, productoServicio: e.target.value })}
                  className="w-full text-xs sm:text-sm bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  <option value="Calaminón Aluzinc TR4 a medida">Calaminón Aluzinc TR4 a medida</option>
                  <option value="Teja Metálica Prepintada Aluzinc">Teja Metálica Prepintada Aluzinc</option>
                  <option value="Tijerales y Cerchas Metálicas (CIIU 2511)">Tijerales y Cerchas Metálicas (CIIU 2511)</option>
                  <option value="Plancha Termoacústica UPVC">Plancha Termoacústica UPVC</option>
                  <option value="Perfil Costanera C y Tubos LAC">Perfil Costanera C y Tubos LAC</option>
                  <option value="Calamina Galvanizada Ondulada">Calamina Galvanizada Ondulada</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wide mb-1.5">
                Detalle del Pedido / Metrajes Aproximados (Opcional)
              </label>
              <textarea
                rows={3}
                placeholder="Indica medidas de techo (ej: 8x10m a 2 aguas), cantidad de planchas o si requieres factura con RUC."
                value={formObra.detalle}
                onChange={(e) => setFormObra({ ...formObra, detalle: e.target.value })}
                className="w-full text-xs sm:text-sm bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>

            {/* Cláusula Legal y Consentimiento de Datos Personales (Ley N° 29733) */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 space-y-3">
              <div className="text-[11px] text-slate-400 leading-relaxed border-b border-slate-800 pb-2">
                <span className="font-bold text-slate-300">⚖️ Aviso Legal de Precios:</span> Los cálculos y valores mostrados en esta plataforma web son estimaciones técnicas referenciales sujetas a confirmación en obra y verificación de stock de bobinas Aluzinc. La cotización formal y vinculante se formaliza únicamente mediante proforma electrónica emitida por <strong>TECHOS METALICOS Y ESTRUCTURAS VICTORIA S.R.L.</strong> (RUC: {empresaConfig.ruc}).
              </div>

              <label className="flex items-start gap-2.5 cursor-pointer text-xs text-slate-300 select-none">
                <input
                  type="checkbox"
                  checked={aceptaPrivacidadForm}
                  onChange={(e) => setAceptaPrivacidadForm(e.target.checked)}
                  className="mt-0.5 rounded border-slate-700 bg-slate-800 text-red-600 focus:ring-red-500 h-4 w-4 shrink-0"
                  required
                />
                <span>
                  He leído y acepto el tratamiento de mis datos personales conforme a la{' '}
                  <button
                    type="button"
                    onClick={() => setPoliticaPrivacidadAbierta(true)}
                    className="text-red-400 hover:text-red-300 underline font-semibold focus:outline-none"
                  >
                    Política de Privacidad (Ley N° 29733)
                  </button>{' '}
                  y los{' '}
                  <button
                    type="button"
                    onClick={() => setTerminosCondicionesAbierto(true)}
                    className="text-red-400 hover:text-red-300 underline font-semibold focus:outline-none"
                  >
                    Términos y Condiciones
                  </button>.
                </span>
              </label>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row gap-3">
              <button
                type="submit"
                disabled={formEnviando}
                className="flex-1 py-3 bg-red-600 hover:bg-red-500 disabled:bg-slate-700 text-white font-black text-xs sm:text-sm uppercase tracking-wider rounded-xl transition shadow-lg flex items-center justify-center gap-2"
              >
                <span>{formEnviando ? 'Enviando solicitud...' : '📨 Enviar Solicitud a Planta'}</span>
              </button>
              <a
                href={generarEnlaceWhatsApp(`Hola, deseo cotizar directamente para obra en San Marcos`)}
                target="_blank"
                rel="noopener noreferrer"
                className="py-3 px-5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm rounded-xl transition text-center flex items-center justify-center gap-1.5"
              >
                <span>📲 WhatsApp Inmediato</span>
              </a>
            </div>
          </form>
        </div>
      </section>

      {/* ========================================================
          9. GEOLOCALIZACIÓN SATELITAL & RUTA GPS (#ubicacion, RF-11, RF-12)
         ======================================================== */}
      <section id="ubicacion" className="max-w-7xl mx-auto px-4 py-14 scroll-mt-20">
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-10 shadow-sm grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
          <div className="space-y-4">
            <span className="text-red-600 font-bold text-xs uppercase tracking-wider block">
              PLANTA INDUSTRIAL & TALLER
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Ubicación de Fábrica en Huayobamba
            </h2>
            <div className="text-xs sm:text-sm text-slate-600 space-y-2">
              <p>
                📍 <strong>Dirección Fiscal:</strong> {empresaConfig.domicilioFiscal}.
              </p>
              <p>
                🌉 <strong>Referencia:</strong> {empresaConfig.referencia}.
              </p>
              <p>
                🕒 <strong>Horario de Atención:</strong> {empresaConfig.atencion}.
              </p>
              <p>
                🚚 <strong>Despachos:</strong> Salidas directas a obras en San Marcos, Cajamarca, Celendín, Cajabamba y provincias.
              </p>
            </div>

            {/* Botón Trazabilidad de Ruta GPS (RF-12) */}
            <div className="pt-2 flex flex-wrap gap-2">
              <a
                href={empresaConfig.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold py-3 px-5 rounded-xl transition shadow"
              >
                <span>🗺️ Cómo Llegar (Navegación GPS)</span>
              </a>
              <a
                href={`tel:${empresaConfig.telefonoLlamada}`}
                className="inline-flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold py-3 px-4 rounded-xl border border-slate-300 transition"
              >
                <span>📞 Llamar a Planta</span>
              </a>
            </div>
          </div>

          {/* Iframe Interactivo de Google Maps (RF-11, RNF-11 loading lazy) */}
          <div className="lg:col-span-2 h-72 sm:h-96 rounded-2xl overflow-hidden border border-slate-300 shadow-inner bg-slate-100 relative">
            <iframe
              title="Ubicación Techos Metálicos Huayobamba"
              src={empresaConfig.mapsEmbed}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="w-full h-full"
            />
          </div>
        </div>
      </section>

      {/* ========================================================
          10. FOOTER INSTITUCIONAL SIDERÚRGICO (RF-07, RF-08, RF-15)
         ======================================================== */}
      <footer className="bg-slate-950 text-slate-400 text-xs pt-14 pb-10 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Columna 1: Identidad Corporativa y Tributaria */}
          <div>
            <img
              src={empresaConfig.logo}
              alt="Logo Techos Metálicos Huayobamba"
              className="h-12 w-auto object-contain mb-3 bg-white p-1 rounded"
            />
            <p className="text-slate-200 font-black text-xs mb-1">
              {empresaConfig.nombre}
            </p>
            <p className="text-slate-400 leading-relaxed text-[11px] mb-3">
              {empresaConfig.razonSocial}<br />
              <strong>RUC:</strong> <span className="text-slate-200 font-mono">{empresaConfig.ruc}</span> ({empresaConfig.condicionSunat})<br />
              <strong>Actividad:</strong> CIIU {empresaConfig.ciiu} - Fabricación de productos metálicos para uso estructural.
            </p>
            <span className="inline-block bg-slate-900 border border-slate-800 px-2.5 py-1 rounded text-slate-300 font-bold text-[10px]">
              {empresaConfig.lema}
            </span>
          </div>

          {/* Columna 2: Líneas Siderúrgicas y Estándar Técnico */}
          <div>
            <h4 className="text-white font-bold text-sm mb-3 uppercase tracking-wider border-l-2 border-red-600 pl-2">
              Líneas Siderúrgicas
            </h4>
            <ul className="space-y-1.5 text-[11px]">
              <li className="hover:text-white transition">✓ Calaminón Aluzinc TR4 (ASTM A792 AZ-150)</li>
              <li className="hover:text-white transition">✓ Teja Metálica Prepintada Gravillada / Lisa</li>
              <li className="hover:text-white transition">✓ Tijerales y Cerchas Estructurales (CIIU 2511)</li>
              <li className="hover:text-white transition">✓ Planchas Termoacústicas UPVC 3 capas</li>
              <li className="hover:text-white transition">✓ Perfiles Costanera C, Tubos LAC y Cumbreras</li>
              <li className="hover:text-white transition">✓ Corte a medida exacta sin mermas</li>
            </ul>
          </div>

          {/* Columna 3: Planta de Producción y Atención */}
          <div>
            <h4 className="text-white font-bold text-sm mb-3 uppercase tracking-wider border-l-2 border-red-600 pl-2">
              Planta & Despachos
            </h4>
            <div className="text-slate-400 leading-relaxed text-[11px] space-y-2">
              <p>
                📍 <strong>Fábrica:</strong> {empresaConfig.domicilioFiscal}.
              </p>
              <p>
                🕒 <strong>Horarios:</strong> {empresaConfig.atencion}.
              </p>
              <p>
                📞 <strong>Teléfono / Pedidos:</strong> {empresaConfig.telefonoDisplay}
              </p>
              <p>
                🚚 <strong>Cobertura:</strong> Despachos a obras en San Marcos, Cajamarca, Cajabamba, Celendín, Bolívar y provincias aledañas.
              </p>
            </div>
          </div>

          {/* Columna 4: Protección al Consumidor INDECOPI & Marco Legal */}
          <div className="space-y-3">
            <h4 className="text-white font-bold text-sm mb-3 uppercase tracking-wider border-l-2 border-red-600 pl-2">
              Protección al Consumidor
            </h4>

            {/* Botón Oficial Libro de Reclamaciones Virtual */}
            <button
              type="button"
              onClick={() => setLibroReclamacionesAbierto(true)}
              className="w-full bg-slate-900 hover:bg-slate-800 border-2 border-amber-500/80 p-3 rounded-2xl text-left transition flex items-center gap-3 shadow group focus:outline-none focus:ring-2 focus:ring-amber-500"
              title="Abrir Libro de Reclamaciones Virtual INDECOPI"
            >
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center text-xl shrink-0 border border-amber-500/40 group-hover:scale-105 transition-transform">
                📖
              </div>
              <div className="min-w-0">
                <span className="block text-white font-black text-xs leading-tight">
                  Libro de Reclamaciones
                </span>
                <span className="block text-[10px] text-amber-400 font-semibold">
                  Conforme a Ley N° 29571 / D.S. 011-2011-PCM
                </span>
                <span className="block text-[9px] text-slate-400">
                  Respuesta en máx. 15 días hábiles (Ley 31435)
                </span>
              </div>
            </button>

            <div className="flex flex-col gap-1.5 pt-1 text-[11px]">
              <button
                type="button"
                onClick={() => setPoliticaPrivacidadAbierta(true)}
                className="text-left text-slate-400 hover:text-white transition flex items-center gap-1.5"
              >
                <span>🛡️</span>
                <span className="underline">Política de Privacidad (Ley N° 29733)</span>
              </button>
              <button
                type="button"
                onClick={() => setTerminosCondicionesAbierto(true)}
                className="text-left text-slate-400 hover:text-white transition flex items-center gap-1.5"
              >
                <span>⚖️</span>
                <span className="underline">Términos y Condiciones de Fabricación</span>
              </button>
            </div>

            <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-2.5 text-[10px] text-slate-400">
              <span className="font-bold text-slate-300 block mb-0.5">🏛️ Formalidad SUNAT:</span>
              Emisión obligatoria de Facturas y Boletas Electrónicas autorizadas con crédito fiscal válido.
            </div>
          </div>
        </div>

        {/* Barra Inferior de Enlaces y Declaración Legal para el Perú */}
        <div className="max-w-7xl mx-auto px-4 pt-8 border-t border-slate-800 text-center space-y-3">
          <div className="flex flex-wrap justify-center items-center gap-x-4 gap-y-2 text-[11px] font-semibold text-slate-400">
            <a href="#inicio" className="hover:text-white transition">Inicio</a>
            <span>•</span>
            <a href="#productos" className="hover:text-white transition">Productos</a>
            <span>•</span>
            <a href="#estructuras" className="hover:text-white transition">Estructuras CIIU 2511</a>
            <span>•</span>
            <button
              type="button"
              onClick={() => setLibroReclamacionesAbierto(true)}
              className="text-amber-400 hover:text-amber-300 underline font-bold"
            >
              Libro de Reclamaciones Virtual
            </button>
            <span>•</span>
            <button
              type="button"
              onClick={() => setPoliticaPrivacidadAbierta(true)}
              className="hover:text-white underline"
            >
              Política de Privacidad
            </button>
            <span>•</span>
            <button
              type="button"
              onClick={() => setTerminosCondicionesAbierto(true)}
              className="hover:text-white underline"
            >
              Términos de Servicio
            </button>
            <span>•</span>
            <a
              href="https://e-consultaruc.sunat.gob.pe/cl-ti-itmrconsruc/jcrS00Alias"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition"
            >
              Consulta RUC SUNAT (20612894451)
            </a>
          </div>

          <p className="text-slate-500 text-[10px] max-w-4xl mx-auto leading-relaxed">
            © {new Date().getFullYear()} {empresaConfig.nombre} · {empresaConfig.razonSocial} · RUC {empresaConfig.ruc}. Todos los derechos reservados.
            <br />
            Este portal cumple estrictamente con el <strong>Código de Protección y Defensa del Consumidor (Ley N° 29571)</strong>, el <strong>D.S. N° 011-2011-PCM</strong>, la <strong>Ley N° 31435</strong> y la <strong>Ley de Protección de Datos Personales (Ley N° 29733)</strong> y su reglamento (D.S. 003-2013-JUS). Las cotizaciones y montos generados en línea tienen carácter de estimación técnica preliminar y no constituyen contrato de compraventa hasta la emisión de la proforma oficial con orden de fabricación.
          </p>
        </div>
      </footer>

      {/* ========================================================
          11. DOCK DE ACCIÓN RÁPIDA PARA CELULARES (MOBILE DOCK)
         ======================================================== */}
      {/* Botón flotante solo para pantallas de escritorio (RF-02) */}
      <a
        href={generarEnlaceWhatsApp(`Hola ${empresaConfig.nombre}, me contacto desde su sitio web oficial para solicitar cotización directa de fábrica.`)}
        target="_blank"
        rel="noopener noreferrer"
        className="hidden lg:flex fixed bottom-6 left-6 z-40 bg-emerald-600 hover:bg-emerald-500 text-white p-3.5 rounded-full shadow-2xl transition-all duration-300 hover:scale-110 items-center justify-center border-2 border-white min-w-[52px] min-h-[52px]"
        aria-label="Contactar a WhatsApp de Planta"
        title="WhatsApp Directo con Fábrica"
      >
        <span className="text-2xl">📲</span>
      </a>

      {/* Barra de Cotización Flotante Superior en Móvil (solo si hay materiales seleccionados) */}
      {cotizacion.length > 0 && (
        <div className="lg:hidden fixed bottom-[68px] left-3 right-3 z-40 bg-slate-950/95 backdrop-blur-md text-white p-2.5 rounded-2xl border border-emerald-500/50 flex items-center justify-between shadow-2xl animate-fadeIn">
          <div className="flex items-center gap-2 pl-1">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <div>
              <span className="text-[10px] text-slate-400 block font-semibold leading-tight">
                {totalCantidadItems} materiales en lista
              </span>
              <span className="text-sm font-black text-white leading-tight">
                S/ {totalMontoEstimado.toFixed(2)}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setDrawerCarritoAbierto(true)}
              className="bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs px-2.5 py-1.5 rounded-lg border border-slate-700"
            >
              Ver Lista
            </button>
            <button
              onClick={enviarCotizacionWhatsApp}
              className="bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white font-bold text-xs px-3 py-1.5 rounded-lg flex items-center gap-1 shadow"
            >
              <span>📲 Cotizar</span>
            </button>
          </div>
        </div>
      )}

      {/* Dock Permanente de Pedidos en Móviles (Ergonomía de Pulgar para Celular) */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-slate-950/95 backdrop-blur-md border-t border-slate-800 text-white pb-safe shadow-2xl">
        <div className="grid grid-cols-4 items-center h-16 px-1">
          {/* 1. Llamar a Planta Directo */}
          <a
            href={`tel:${empresaConfig.telefonoLlamada}`}
            className="flex flex-col items-center justify-center py-1 text-slate-400 hover:text-white transition active:scale-95"
            title="Llamada telefónica a planta"
          >
            <span className="text-xl">📞</span>
            <span className="text-[10px] font-bold mt-0.5">Llamar</span>
          </a>

          {/* 2. Pedido Rápido Express */}
          <button
            type="button"
            onClick={() => setPedidoExpressAbierto(true)}
            className="flex flex-col items-center justify-center py-1 text-emerald-400 hover:text-emerald-300 transition active:scale-95"
            title="Hacer pedido rápido por WhatsApp"
          >
            <span className="text-xl">⚡</span>
            <span className="text-[10px] font-black mt-0.5">Pedido Rápido</span>
          </button>

          {/* 3. Cubicador de Techo */}
          <button
            type="button"
            onClick={() => setCalculadoraAbierta(true)}
            className="flex flex-col items-center justify-center py-1 text-slate-400 hover:text-white transition active:scale-95"
            title="Calcular medidas de techo"
          >
            <span className="text-xl">🧮</span>
            <span className="text-[10px] font-bold mt-0.5">Cubicador</span>
          </button>

          {/* 4. Mi Carrito / Lista */}
          <button
            type="button"
            onClick={() => {
              if (cotizacion.length > 0) {
                setDrawerCarritoAbierto(true);
              } else {
                setPedidoExpressAbierto(true);
              }
            }}
            className="relative flex flex-col items-center justify-center py-1 text-slate-400 hover:text-white transition active:scale-95"
            title="Ver lista de cotización"
          >
            <div className="relative">
              <span className="text-xl">📋</span>
              {totalCantidadItems > 0 && (
                <span className="absolute -top-1 -right-2 bg-emerald-500 text-slate-950 font-black text-[9px] w-4 h-4 rounded-full flex items-center justify-center">
                  {totalCantidadItems}
                </span>
              )}
            </div>
            <span className="text-[10px] font-bold mt-0.5">
              {totalCantidadItems > 0 ? `S/ ${totalMontoEstimado.toFixed(0)}` : 'Mi Pedido'}
            </span>
          </button>
        </div>
      </nav>

      {/* Drawer Móvil y Panel de Cotización */}
      {drawerCarritoAbierto && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex flex-col justify-end animate-fadeIn">
          <div className="bg-white rounded-t-3xl p-5 max-h-[88vh] overflow-y-auto space-y-4 max-w-lg mx-auto w-full border-t border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div>
                <h3 className="text-base font-bold text-slate-900">Mi Solicitud de Cotización</h3>
                <span className="text-[11px] text-slate-500">Fabricación y corte directo en Huayobamba</span>
              </div>
              <button
                onClick={() => setDrawerCarritoAbierto(false)}
                className="text-slate-400 hover:text-slate-900 font-bold text-lg p-1 w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center transition"
                aria-label="Cerrar panel de cotización"
              >
                ✕
              </button>
            </div>

            <div className="divide-y divide-slate-100 max-h-52 overflow-y-auto">
              {cotizacion.map(item => (
                <div key={item.id} className="py-2.5 flex items-center justify-between text-xs">
                  <div>
                    <div className="font-bold text-slate-900">{item.nombre}</div>
                    <div className="text-[10px] text-slate-500">
                      {item.precio_ref} c/u • S/ {(item.precio_num * item.cantidad).toFixed(2)}
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <div className="flex items-center gap-1 bg-slate-100 px-2 py-1 rounded-lg">
                      <button onClick={() => actualizarCantidad(item.id, -1)} className="font-bold px-1 text-slate-600 hover:text-red-600">-</button>
                      <span className="font-bold w-4 text-center">{item.cantidad}</span>
                      <button onClick={() => actualizarCantidad(item.id, 1)} className="font-bold px-1 text-slate-600 hover:text-slate-900">+</button>
                    </div>
                    <button
                      onClick={() => eliminarDeCotizacion(item.id)}
                      className="text-slate-400 hover:text-red-600 p-1 text-xs"
                      title="Eliminar material"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-end">
              <button
                onClick={vaciarCotizacion}
                className="text-[11px] text-slate-400 hover:text-red-600 underline transition"
              >
                Vaciar lista
              </button>
            </div>

            {/* Campos rápidos para personalizar la proforma antes de enviar */}
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-2">
              <span className="text-[11px] font-bold text-slate-700 block">
                Tus datos para la proforma (Opcional):
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                <input
                  type="text"
                  placeholder="Tu Nombre / Empresa"
                  value={drawerCliente}
                  onChange={(e) => setDrawerCliente(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-slate-800 focus:outline-none focus:ring-1 focus:ring-slate-900"
                />
                <input
                  type="text"
                  placeholder="Destino de Obra (Distrito)"
                  value={drawerUbicacion}
                  onChange={(e) => setDrawerUbicacion(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-slate-800 focus:outline-none focus:ring-1 focus:ring-slate-900"
                />
              </div>
            </div>

            <div className="bg-slate-100 p-3 rounded-xl flex justify-between items-center text-xs font-bold">
              <span>Total Estimado Referencial:</span>
              <span className="text-base text-slate-900">S/ {totalMontoEstimado.toFixed(2)}</span>
            </div>

            <div className="space-y-2 pt-1">
              <button
                onClick={() => {
                  setDrawerCarritoAbierto(false);
                  enviarCotizacionWhatsApp();
                }}
                className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white font-black text-xs uppercase tracking-wider rounded-xl transition shadow flex items-center justify-center gap-2"
              >
                <span>📲 Enviar Pedido a WhatsApp de Planta</span>
              </button>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={copiarCotizacionAlPortapapeles}
                  className="py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition text-center"
                >
                  {cotizacionCopiada ? '✓ Copiado' : '📋 Copiar Resumen'}
                </button>
                <a
                  href={`tel:${empresaConfig.telefonoLlamada}`}
                  className="py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg transition text-center flex items-center justify-center gap-1"
                >
                  <span>📞 Llamar</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modales Complementarios */}
      <ModalFichaTecnica
        producto={productoFicha}
        isOpen={!!productoFicha}
        onClose={() => setProductoFicha(null)}
        onCotizar={(p) => agregarACotizacion(p, 1)}
      />

      <ModalPedidoExpress
        isOpen={pedidoExpressAbierto}
        onClose={() => setPedidoExpressAbierto(false)}
      />

      <CalculadoraTecho
        isOpen={calculadoraAbierta}
        onClose={() => setCalculadoraAbierta(false)}
        onAgregarACotizacion={(item, cant) => agregarACotizacion(item, cant)}
      />

      {/* Modales Legales y Protección al Consumidor (Perú) */}
      <LibroReclamacionesModal
        isOpen={libroReclamacionesAbierto}
        onClose={() => setLibroReclamacionesAbierto(false)}
      />

      <PoliticaPrivacidadModal
        isOpen={politicaPrivacidadAbierta}
        onClose={() => setPoliticaPrivacidadAbierta(false)}
      />

      <TerminosCondicionesModal
        isOpen={terminosCondicionesAbierto}
        onClose={() => setTerminosCondicionesAbierto(false)}
      />

      {/* Banner Informativo de Cookies Técnicas */}
      <AvisoCookies
        onAbrirPrivacidad={() => setPoliticaPrivacidadAbierta(true)}
      />

      {/* Asesor IA Siderúrgico Flotante */}
      <ChatGemini />
    </div>
  );
}