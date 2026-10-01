import { useState } from 'react';
import { empresaConfig } from '../data/productos';

export default function CalculadoraTecho({ isOpen, onClose, onAgregarACotizacion }) {
  const [ancho, setAncho] = useState(6);
  const [largo, setLargo] = useState(8);
  const [caidas, setCaidas] = useState(2); // 1 o 2 caídas
  const [tipoPlancha, setTipoPlancha] = useState('teja'); // 'teja', 'calaminon', 'ondulada', 'upvc'
  const [copiado, setCopiado] = useState(false);

  if (!isOpen) return null;

  const configPlanchas = {
    teja: {
      nombre: "Teja Metálica Prepintada Aluzinc",
      anchoUtil: 1.00,
      precio: 52.00,
      productoId: 1,
      tornillosPorPlancha: 6,
      norma: "AZ-150 / ASTM A792",
      pendienteRec: "Mín. 20% a 25%"
    },
    calaminon: {
      nombre: "Calaminón Aluzinc Trapezoidal TR4",
      anchoUtil: 1.00,
      precio: 46.00,
      productoId: 2,
      tornillosPorPlancha: 6,
      norma: "ASTM A792 / AZ-150",
      pendienteRec: "Mín. 10% a 15%"
    },
    ondulada: {
      nombre: "Calamina Galvanizada Ondulada Pesada",
      anchoUtil: 0.75,
      precio: 24.50,
      productoId: 3,
      tornillosPorPlancha: 6,
      norma: "ASTM A653",
      pendienteRec: "Mín. 15%"
    },
    upvc: {
      nombre: "Plancha Termoacústica UPVC Silenciosa",
      anchoUtil: 1.05,
      precio: 85.00,
      productoId: 4,
      tornillosPorPlancha: 5,
      norma: "ISO 9001 / Antifuego",
      pendienteRec: "Mín. 12%"
    }
  };

  const planchaSel = configPlanchas[tipoPlancha];
  const areaTotal = (ancho * largo).toFixed(1);

  // Planchas requeridas:
  const columnasPlanchas = Math.ceil(ancho / planchaSel.anchoUtil);
  const filasPorCaida = caidas === 2 ? 2 : 1;
  const totalPlanchas = Math.ceil(columnasPlanchas * filasPorCaida);
  const largoCorteSugerido = caidas === 2 ? (largo / 2).toFixed(2) : largo.toFixed(2);

  // Tornillos con arandela EPDM:
  const totalTornillos = totalPlanchas * planchaSel.tornillosPorPlancha;
  const cientosTornillos = Math.max(1, Math.ceil(totalTornillos / 100));

  // Cumbrera si es a 2 caídas:
  const piezasCumbrera2m = caidas === 2 ? Math.ceil(ancho / 1.80) : 0; // tramos de 2m con 20cm solape

  // Correas Perfil C:
  const lineasCorreas = Math.ceil(largo / 0.90) + 1;
  const metrosCorreas = (lineasCorreas * ancho * (caidas === 2 ? 2 : 1)).toFixed(0);
  const barrasCorreas6m = Math.ceil(metrosCorreas / 6);

  const costoPlanchas = totalPlanchas * planchaSel.precio;
  const costoTornillos = cientosTornillos * 28.00;
  const costoCumbreras = piezasCumbrera2m * 32.00;
  const costoEstimado = costoPlanchas + costoTornillos + costoCumbreras;

  const aplicarPreset = (w, l, c, t) => {
    setAncho(w);
    setLargo(l);
    setCaidas(c);
    if (t) setTipoPlancha(t);
  };

  const handleAgregarTodo = () => {
    // Agregar planchas / tejas
    onAgregarACotizacion({
      id: planchaSel.productoId,
      nombre: `${planchaSel.nombre} (Corte a medida ${largoCorteSugerido}m)`,
      espesores: "0.40 mm recomendada",
      precio_ref: `S/ ${planchaSel.precio.toFixed(2)}`,
      precio_num: planchaSel.precio,
      unidad: "plancha"
    }, totalPlanchas);

    // Agregar tornillos autoperforantes
    onAgregarACotizacion({
      id: 8,
      nombre: "Tornillos Autoperforantes con Arandela EPDM (Ciento)",
      espesores: "#12 x 2 pulg",
      precio_ref: "S/ 28.00",
      precio_num: 28.00,
      unidad: "ciento"
    }, cientosTornillos);

    // Agregar cumbrera si es a dos aguas
    if (piezasCumbrera2m > 0) {
      onAgregarACotizacion({
        id: 7,
        nombre: "Cumbrera / Caballete para Techo (Tramos de 2m)",
        espesores: "0.40 mm prepintado",
        precio_ref: "S/ 32.00",
        precio_num: 32.00,
        unidad: "tramo 2m"
      }, piezasCumbrera2m);
    }

    onClose();
  };

  const copiarResumen = () => {
    const texto = `📐 CUBICACIÓN TÉCNICA DE TECHO - FÁBRICA CALAMINÓN HUAYOBAMBA
----------------------------------------
- Dimensiones: ${ancho}m ancho x ${largo}m largo (~${areaTotal} m²)
- Tipo de Techo: ${caidas === 2 ? '2 Caídas (Dos aguas con cumbrera)' : '1 Caída (Monofacético)'}
- Material: ${planchaSel.nombre}
- Planchas necesarias: ${totalPlanchas} unid. (Corte sugerido: ${largoCorteSugerido} m)
- Tornillos EPDM: ${totalTornillos} unid. (~${cientosTornillos} cientos)
${piezasCumbrera2m > 0 ? `- Cumbreras (2m): ${piezasCumbrera2m} tramos\n` : ''}- Correas Perfil C estimadas: ~${barrasCorreas6m} barras de 6m
- Presupuesto estimado referencial: S/ ${costoEstimado.toFixed(2)}
----------------------------------------
Coordinar fabricación exacta en planta WhatsApp: 921 819 166`;

    navigator.clipboard.writeText(texto).then(() => {
      setCopiado(true);
      setTimeout(() => setCopiado(false), 2500);
    }).catch(() => {});
  };

  const enviarWhatsAppDirecto = () => {
    let mensaje = `📐 *CÁLCULO DE TECHO EN OBRA - ${empresaConfig.nombre}*\n`;
    mensaje += `*Razón Social:* ${empresaConfig.razonSocial} (RUC: ${empresaConfig.ruc})\n`;
    mensaje += `------------------------------------\n`;
    mensaje += `▪ *Área a Techar:* ${areaTotal} m² (${ancho}m de frente x ${largo}m de caída)\n`;
    mensaje += `▪ *Diseño de Techo:* ${caidas === 2 ? 'A 2 aguas (2 caídas)' : 'A 1 agua (caída continua)'}\n`;
    mensaje += `▪ *Material Seleccionado:* ${planchaSel.nombre}\n`;
    mensaje += `------------------------------------\n`;
    mensaje += `📦 *DESGLOSE DE MATERIALES REQUERIDOS:*\n`;
    mensaje += `1. *${totalPlanchas} planchas* con corte exacto a ${largoCorteSugerido} metros\n`;
    mensaje += `2. *~${totalTornillos} tornillos autoperforantes* con arandela EPDM (${cientosTornillos} cientos)\n`;
    if (caidas === 2) {
      mensaje += `3. *${piezasCumbrera2m} piezas* de cumbrera Aluzinc (2.00m)\n`;
    }
    mensaje += `4. *~${barrasCorreas6m} barras* de Perfil Costanera C (6 metros)\n`;
    mensaje += `------------------------------------\n`;
    mensaje += `💰 *Costo Referencial Estimado:* S/ ${costoEstimado.toFixed(2)}\n`;
    mensaje += `------------------------------------\n`;
    mensaje += `Hola, realicé este cálculo desde mi celular en obra. Por favor confírmenme presupuesto formal y fecha de entrega.`;

    window.open(`https://wa.me/${empresaConfig.telefono}?text=${encodeURIComponent(mensaje)}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden border border-slate-200 flex flex-col max-h-[92vh]">
        {/* Cabecera Técnica de Alta Precisión */}
        <div className="bg-slate-950 text-white p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-600 to-red-700 flex items-center justify-center text-white font-black text-lg shadow-inner">
              📐
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] bg-slate-800 text-slate-300 font-bold uppercase tracking-wider px-2 py-0.5 rounded border border-slate-700">
                  Herramienta de Ingeniería
                </span>
                <span className="text-[11px] text-emerald-400 font-medium flex items-center gap-1">
                  ● Cálculo sin desperdicio
                </span>
              </div>
              <h3 className="font-bold text-base sm:text-lg text-white tracking-tight mt-0.5">
                Cubicador Técnico de Techos Metálicos
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-2 rounded-lg hover:bg-slate-900 transition"
            aria-label="Cerrar modal"
          >
            ✕
          </button>
        </div>

        {/* Presets Rápidos */}
        <div className="bg-slate-50 border-b border-slate-200 px-5 py-2.5 flex items-center gap-2 overflow-x-auto text-xs no-scrollbar">
          <span className="text-slate-400 font-bold text-[11px] shrink-0 uppercase tracking-wider">
            Dimensiones frecuentes:
          </span>
          <button
            type="button"
            onClick={() => aplicarPreset(4, 6, 1, 'calaminon')}
            className="bg-white hover:bg-slate-100 border border-slate-200 px-2.5 py-1 rounded-md text-slate-700 font-medium shrink-0 transition"
          >
            Cochera 4x6m (1 caída)
          </button>
          <button
            type="button"
            onClick={() => aplicarPreset(6, 8, 2, 'teja')}
            className="bg-white hover:bg-slate-100 border border-slate-200 px-2.5 py-1 rounded-md text-slate-700 font-medium shrink-0 transition"
          >
            Vivienda 6x8m (2 aguas)
          </button>
          <button
            type="button"
            onClick={() => aplicarPreset(8, 12, 2, 'teja')}
            className="bg-white hover:bg-slate-100 border border-slate-200 px-2.5 py-1 rounded-md text-slate-700 font-medium shrink-0 transition"
          >
            Casa Campo 8x12m (2 aguas)
          </button>
          <button
            type="button"
            onClick={() => aplicarPreset(10, 16, 2, 'calaminon')}
            className="bg-white hover:bg-slate-100 border border-slate-200 px-2.5 py-1 rounded-md text-slate-700 font-medium shrink-0 transition"
          >
            Almacén 10x16m (TR4)
          </button>
        </div>

        {/* Contenido / Parámetros */}
        <div className="p-5 sm:p-6 space-y-5 overflow-y-auto flex-1">
          {/* Dimensiones y Caídas */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5">
                Ancho del Techo (frente)
              </label>
              <div className="relative">
                <input
                  type="number"
                  min="1"
                  max="60"
                  step="0.5"
                  value={ancho}
                  onChange={(e) => setAncho(Math.max(1, Number(e.target.value)))}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm font-bold text-slate-900 focus:ring-2 focus:ring-slate-900 focus:outline-none"
                />
                <span className="absolute right-3 top-2.5 text-xs text-slate-400 font-bold">metros</span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5">
                Largo / Fondo (caída)
              </label>
              <div className="relative">
                <input
                  type="number"
                  min="1"
                  max="60"
                  step="0.5"
                  value={largo}
                  onChange={(e) => setLargo(Math.max(1, Number(e.target.value)))}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm font-bold text-slate-900 focus:ring-2 focus:ring-slate-900 focus:outline-none"
                />
                <span className="absolute right-3 top-2.5 text-xs text-slate-400 font-bold">metros</span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5">
                Diseño de Caídas
              </label>
              <div className="grid grid-cols-2 gap-1.5">
                <button
                  type="button"
                  onClick={() => setCaidas(1)}
                  className={`py-2 px-1 text-xs font-bold rounded-lg border transition ${
                    caidas === 1
                      ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                      : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
                  }`}
                >
                  1 Caída
                </button>
                <button
                  type="button"
                  onClick={() => setCaidas(2)}
                  className={`py-2 px-1 text-xs font-bold rounded-lg border transition ${
                    caidas === 2
                      ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                      : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
                  }`}
                >
                  2 Aguas
                </button>
              </div>
            </div>
          </div>

          {/* Tipo de Cobertura */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-2">
              Tipo de Cobertura Siderúrgica
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {Object.entries(configPlanchas).map(([key, item]) => (
                <div
                  key={key}
                  onClick={() => setTipoPlancha(key)}
                  className={`p-3 rounded-xl border cursor-pointer transition-all ${
                    tipoPlancha === key
                      ? 'border-slate-900 bg-slate-900/5 ring-1 ring-slate-900'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-slate-900">{item.nombre}</span>
                    <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                      S/ {item.precio.toFixed(2)}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-500 mt-1 flex justify-between">
                    <span>Ancho útil: {item.anchoUtil}m</span>
                    <span>{item.norma}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Desglose de Resultados Técnicos */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 pb-2.5">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">
                  Superficie a Techado
                </span>
                <span className="text-lg font-black text-slate-900">{areaTotal} m²</span>
                <span className="text-xs text-slate-500 ml-2">
                  ({caidas === 2 ? `2 caídas de ~${largoCorteSugerido}m` : `1 caída directa de ${largo}m`})
                </span>
              </div>
              <div className="text-right">
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">
                  Corte Exacto de Fábrica
                </span>
                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
                  0% retazos ni empalmes innecesarios
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              <div className="bg-white p-3 rounded-lg border border-slate-200 shadow-2xs">
                <span className="text-[10px] text-slate-500 uppercase font-bold block">Planchas / Tejas</span>
                <span className="text-xl font-black text-red-600 block my-0.5">{totalPlanchas}</span>
                <span className="text-[11px] text-slate-500 font-medium">cortes de {largoCorteSugerido}m</span>
              </div>

              <div className="bg-white p-3 rounded-lg border border-slate-200 shadow-2xs">
                <span className="text-[10px] text-slate-500 uppercase font-bold block">Tornillos EPDM</span>
                <span className="text-xl font-black text-slate-800 block my-0.5">~{totalTornillos}</span>
                <span className="text-[11px] text-slate-500 font-medium">({cientosTornillos} cientos)</span>
              </div>

              <div className="bg-white p-3 rounded-lg border border-slate-200 shadow-2xs">
                <span className="text-[10px] text-slate-500 uppercase font-bold block">Cumbreras (2m)</span>
                <span className="text-xl font-black text-slate-800 block my-0.5">{piezasCumbrera2m}</span>
                <span className="text-[11px] text-slate-500 font-medium">{caidas === 2 ? 'tramos c/solape' : 'no aplica'}</span>
              </div>

              <div className="bg-white p-3 rounded-lg border border-slate-200 shadow-2xs">
                <span className="text-[10px] text-slate-500 uppercase font-bold block">Correas Perfil C</span>
                <span className="text-xl font-black text-slate-800 block my-0.5">~{barrasCorreas6m}</span>
                <span className="text-[11px] text-slate-500 font-medium">barras de 6 metros</span>
              </div>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-t border-slate-200/80">
              <div>
                <span className="text-xs text-slate-500 block">Total Estimado en Materiales (Ref.):</span>
                <span className="text-xl font-black text-slate-900">S/ {costoEstimado.toFixed(2)}</span>
              </div>
              <button
                type="button"
                onClick={copiarResumen}
                className="text-xs font-bold text-slate-700 hover:text-slate-900 bg-white hover:bg-slate-100 border border-slate-300 px-3 py-1.5 rounded-lg transition flex items-center gap-1.5"
              >
                <span>{copiado ? '✓ Copiado al portapapeles' : '📋 Copiar desglose técnico'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Acciones */}
        <div className="p-4 bg-slate-100 border-t border-slate-200 flex flex-col sm:flex-row justify-end gap-2.5">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 text-xs font-bold text-slate-600 hover:text-slate-900 hover:bg-slate-200 rounded-lg transition"
          >
            Cerrar
          </button>
          <button
            type="button"
            onClick={enviarWhatsAppDirecto}
            className="px-4 py-2.5 text-xs font-black bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white rounded-lg transition shadow flex items-center justify-center gap-1.5"
          >
            <span>📲 Enviar Cálculo por WhatsApp</span>
          </button>
          <button
            type="button"
            onClick={handleAgregarTodo}
            className="px-5 py-2.5 text-xs font-black bg-slate-900 hover:bg-slate-800 active:scale-95 text-white rounded-lg transition shadow flex items-center justify-center gap-2"
          >
            <span>+ Agregar Todo a mi Lista</span>
          </button>
        </div>
      </div>
    </div>
  );
}
