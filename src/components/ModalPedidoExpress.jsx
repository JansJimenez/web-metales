import { useState } from 'react';
import { empresaConfig } from '../data/productos';

export default function ModalPedidoExpress({ isOpen, onClose }) {
  const [producto, setProducto] = useState('Calaminón Aluzinc TR4 a medida');
  const [medidas, setMedidas] = useState('');
  const [cantidad, setCantidad] = useState('');
  const [cliente, setCliente] = useState('');
  const [celular, setCelular] = useState('');
  const [ubicacion, setUbicacion] = useState('');
  const [comprobante, setComprobante] = useState('Boleta');
  const [observacion, setObservacion] = useState('');
  const [aceptaDatos, setAceptaDatos] = useState(true);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const productosFrecuentes = [
    'Calaminón Aluzinc TR4 a medida',
    'Teja Metálica Prepintada',
    'Tijerales y Cerchas Estructurales',
    'Plancha Termoacústica UPVC',
    'Perfiles Costanera C y Tubos',
    'Cumbreras y Tornillos Autoperforantes'
  ];

  const handleEnviarPedidoWhatsApp = (e) => {
    e.preventDefault();
    setError('');

    if (!cliente.trim()) {
      setError('Por favor escribe tu nombre o de quién recibe la cotización.');
      return;
    }

    if (!aceptaDatos) {
      setError('Por favor acepta la política de protección de datos personales.');
      return;
    }

    let texto = `🏗️ *SOLICITUD DE PEDIDO EXPRESS - ${empresaConfig.nombre}*\n`;
    texto += `*Razón Social:* ${empresaConfig.razonSocial} (RUC: ${empresaConfig.ruc})\n`;
    texto += `------------------------------------\n`;
    texto += `👤 *Cliente:* ${cliente.trim()}\n`;
    if (celular.trim()) texto += `📱 *Teléfono:* ${celular.trim()}\n`;
    if (ubicacion.trim()) texto += `📍 *Lugar de Obra:* ${ubicacion.trim()}\n`;
    texto += `🧾 *Comprobante Solicitado:* ${comprobante}\n`;
    texto += `------------------------------------\n`;
    texto += `📦 *DETALLE DEL PEDIDO:*\n`;
    texto += `▪ *Material:* ${producto}\n`;
    if (medidas.trim()) texto += `▪ *Largo o Cortes:* ${medidas.trim()}\n`;
    if (cantidad.trim()) texto += `▪ *Cantidad estimada:* ${cantidad.trim()}\n`;
    if (observacion.trim()) texto += `▪ *Detalles adicionales:* ${observacion.trim()}\n`;
    texto += `------------------------------------\n`;
    texto += `Por favor indíquenme precio neto, disponibilidad de bobina y tiempo estimado de corte/entrega. ¡Muchas gracias!`;

    window.open(`https://wa.me/${empresaConfig.telefono}?text=${encodeURIComponent(texto)}`, '_blank');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fadeIn">
      <div 
        className="bg-white rounded-t-3xl sm:rounded-3xl w-full max-w-lg max-h-[92vh] flex flex-col shadow-2xl overflow-hidden border border-slate-200"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-pedido-express-titulo"
      >
        {/* Cabecera del Modal */}
        <div className="bg-slate-950 text-white p-4 sm:p-5 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center text-xl shrink-0">
              ⚡
            </div>
            <div>
              <h2 id="modal-pedido-express-titulo" className="text-base sm:text-lg font-black tracking-tight leading-tight">
                Pedido Rápido por Celular
              </h2>
              <span className="text-[11px] text-emerald-400 font-semibold block">
                Atención directa con ingenieros de planta
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center font-bold text-lg transition"
            aria-label="Cerrar ventana"
          >
            ✕
          </button>
        </div>

        {/* Cuerpo del formulario scrollable */}
        <form onSubmit={handleEnviarPedidoWhatsApp} className="p-4 sm:p-6 overflow-y-auto space-y-4 text-xs">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl font-medium animate-fadeIn">
              ⚠️ {error}
            </div>
          )}

          {/* Chips de Selección Rápida de Material */}
          <div>
            <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wide mb-1.5">
              1. ¿Qué material o servicio requieres?
            </label>
            <div className="flex flex-wrap gap-1.5 mb-2">
              {productosFrecuentes.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setProducto(item)}
                  className={`py-1.5 px-2.5 rounded-lg text-[11px] font-bold transition text-left ${
                    producto === item
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                  }`}
                >
                  {producto === item ? '✓ ' : ''}{item}
                </button>
              ))}
            </div>
          </div>

          {/* Medidas y Cantidad */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wide mb-1">
                2. Medida de Corte (Metros)
              </label>
              <input
                type="text"
                placeholder="Ej: 5.50m o cortes variados"
                value={medidas}
                onChange={(e) => setMedidas(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900"
              />
              <span className="text-[10px] text-slate-500 mt-0.5 block">Cortamos al centímetro exacto</span>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wide mb-1">
                3. Cantidad o Metraje
              </label>
              <input
                type="text"
                placeholder="Ej: 15 planchas, 80 m²..."
                value={cantidad}
                onChange={(e) => setCantidad(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900"
              />
              <span className="text-[10px] text-slate-500 mt-0.5 block">O medidas de tu techo</span>
            </div>
          </div>

          {/* Datos del Cliente y Ubicación */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wide mb-1">
                4. Tu Nombre o Empresa *
              </label>
              <input
                type="text"
                required
                placeholder="Ej: Juan Pérez / Constructora"
                value={cliente}
                onChange={(e) => setCliente(e.target.value)}
                autoComplete="name"
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wide mb-1">
                5. Destino de Entrega (Obra)
              </label>
              <input
                type="text"
                placeholder="Ej: San Marcos, Huayobamba, Cajamarca..."
                value={ubicacion}
                onChange={(e) => setUbicacion(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900"
              />
            </div>
          </div>

          {/* Celular y Comprobante */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wide mb-1">
                Celular / WhatsApp (Opcional)
              </label>
              <input
                type="tel"
                inputMode="tel"
                autoComplete="tel"
                placeholder="Ej: 921819166"
                value={celular}
                onChange={(e) => setCelular(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wide mb-1">
                Comprobante SUNAT
              </label>
              <select
                value={comprobante}
                onChange={(e) => setComprobante(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900"
              >
                <option value="Boleta de Venta">Boleta de Venta Electrónica</option>
                <option value="Factura con RUC">Factura Electrónica con RUC</option>
                <option value="Solo Proforma preliminar">Solo Proforma preliminar</option>
              </select>
            </div>
          </div>

          {/* Observaciones adicionales */}
          <div>
            <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wide mb-1">
              Indicaciones adicionales o consultas (Opcional)
            </label>
            <textarea
              rows={2}
              placeholder="Ej: ¿Incluyen tornillos autoperforantes? ¿Hacen flete hasta la obra?"
              value={observacion}
              onChange={(e) => setObservacion(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2 text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900"
            />
          </div>

          {/* Consentimiento Ley N° 29733 */}
          <label className="flex items-start gap-2 cursor-pointer text-[11px] text-slate-600 select-none pt-1">
            <input
              type="checkbox"
              checked={aceptaDatos}
              onChange={(e) => setAceptaDatos(e.target.checked)}
              className="mt-0.5 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 h-4 w-4 shrink-0"
              required
            />
            <span>
              Acepto el uso de mis datos para procesar este pedido conforme a la Ley N° 29733.
            </span>
          </label>

          {/* Botones de Acción para Celular */}
          <div className="pt-2 space-y-2">
            <button
              type="submit"
              className="w-full py-3.5 px-4 bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white font-black text-sm uppercase tracking-wide rounded-2xl transition shadow-lg flex items-center justify-center gap-2"
            >
              <span>📲 Enviar Pedido a WhatsApp de Planta</span>
            </button>

            <a
              href={`tel:${empresaConfig.telefonoLlamada}`}
              className="w-full py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl transition flex items-center justify-center gap-2 border border-slate-200 text-center"
            >
              <span>📞 ¿Prefieres hablar? Llamar a Planta ({empresaConfig.telefonoDisplay})</span>
            </a>
          </div>

          {/* Consejo de Obra */}
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-[11px] text-amber-900 flex items-start gap-2">
            <span className="text-base shrink-0">💡</span>
            <p>
              <strong>Tip para maestros y contratistas:</strong> Al abrir WhatsApp también puedes adjuntar una foto del plano de tu techo o una nota de voz para que nuestro equipo técnico te dé la modulación exacta.
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
