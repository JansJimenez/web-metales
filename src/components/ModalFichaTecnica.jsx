import { empresaConfig } from '../data/productos';

export default function ModalFichaTecnica({ producto, isOpen, onClose, onCotizar }) {
  if (!isOpen || !producto) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden border border-slate-200 flex flex-col max-h-[90vh]">
        {/* Cabecera Técnica */}
        <div className="bg-slate-950 text-white p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-red-500 font-bold text-lg">
              📄
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                  Ficha Técnica Homologada
                </span>
                <span className="text-[10px] bg-red-600/20 text-red-400 border border-red-500/30 px-2 py-0.2 rounded font-bold">
                  {producto.categoria}
                </span>
              </div>
              <h3 className="font-bold text-base sm:text-lg text-white tracking-tight mt-0.5">
                {producto.nombre}
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-2 rounded-lg hover:bg-slate-900 transition"
            aria-label="Cerrar ficha técnica"
          >
            ✕
          </button>
        </div>

        {/* Contenido */}
        <div className="p-5 sm:p-6 space-y-5 overflow-y-auto flex-1">
          {/* Imagen y Resumen */}
          <div className="flex flex-col sm:flex-row gap-5 items-center sm:items-start">
            <div className="w-full sm:w-48 h-36 rounded-xl overflow-hidden bg-slate-100 shrink-0 border border-slate-200 shadow-2xs relative">
              <img
                src={producto.imagen}
                alt={producto.nombre}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.src = 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=600&q=80';
                }}
              />
              <span className="absolute bottom-2 left-2 bg-slate-950/80 text-[10px] text-slate-200 font-bold px-2 py-0.5 rounded backdrop-blur">
                Planta Huayobamba
              </span>
            </div>
            <div className="space-y-2 flex-1">
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {producto.descripcion}
              </p>
              <div className="pt-2 flex flex-wrap items-baseline gap-2 border-t border-slate-100">
                <span className="text-xs text-slate-400 uppercase font-semibold">Precio de Planta:</span>
                <span className="text-2xl font-black text-slate-900">{producto.precio_ref}</span>
                <span className="text-xs text-slate-500">/ {producto.unidad || 'unidad'}</span>
              </div>
            </div>
          </div>

          {/* Tabla de Especificaciones Técnicas */}
          <div className="border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
            <div className="bg-slate-100 px-4 py-2 text-xs font-bold text-slate-800 uppercase tracking-wider border-b border-slate-200 flex justify-between items-center">
              <span>Parámetros Físicos & Normativa Siderúrgica</span>
              <span className="text-[10px] font-normal text-slate-500">Control de Calidad</span>
            </div>
            <div className="divide-y divide-slate-100 text-xs">
              <div className="grid grid-cols-3 px-4 py-2.5">
                <span className="font-semibold text-slate-500">Norma Estándar:</span>
                <span className="col-span-2 text-slate-900 font-bold">{producto.norma}</span>
              </div>
              <div className="grid grid-cols-3 px-4 py-2.5 bg-slate-50/60">
                <span className="font-semibold text-slate-500">Espesores de Fábrica:</span>
                <span className="col-span-2 text-slate-900 font-bold">{producto.espesores}</span>
              </div>
              <div className="grid grid-cols-3 px-4 py-2.5">
                <span className="font-semibold text-slate-500">Largos / Cortes:</span>
                <span className="col-span-2 text-slate-900 font-bold">{producto.largos}</span>
              </div>
              {producto.anchoUtil && (
                <div className="grid grid-cols-3 px-4 py-2.5 bg-slate-50/60">
                  <span className="font-semibold text-slate-500">Ancho Útil de Cobertura:</span>
                  <span className="col-span-2 text-slate-900 font-bold">{producto.anchoUtil}</span>
                </div>
              )}
            </div>
          </div>

          {/* Aplicaciones Recomendadas */}
          {producto.usos && (
            <div>
              <h5 className="text-xs font-bold text-slate-800 uppercase tracking-wide mb-2.5 flex items-center gap-1.5">
                <span>🔨</span> Aplicaciones y Destinos Óptimos
              </h5>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {producto.usos.map((uso, i) => (
                  <div key={i} className="bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs text-slate-700 flex items-start gap-2">
                    <span className="text-emerald-600 font-black">✔</span>
                    <span>{uso}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Garantía y Despacho */}
          <div className="bg-slate-900 text-white rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
            <div>
              <span className="text-red-400 font-bold block uppercase tracking-wider text-[10px]">
                Garantía de Fábrica • {empresaConfig.lema}
              </span>
              <span className="text-slate-300">
                Cortes personalizados y despacho rápido a todo San Marcos, Cajamarca y provincias.
              </span>
            </div>
            <a
              href={`https://wa.me/${empresaConfig.telefono}?text=Hola,%20quisiera%20consultar%20disponibilidad%20de%20${encodeURIComponent(producto.nombre)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-3 py-1.5 rounded-lg text-xs shrink-0 transition"
            >
              Consultar Stock WhatsApp
            </a>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-100 border-t border-slate-200 flex justify-end gap-2.5">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-900 hover:bg-slate-200 rounded-lg transition"
          >
            Cerrar
          </button>
          <button
            type="button"
            onClick={() => {
              onCotizar(producto);
              onClose();
            }}
            className="px-5 py-2 text-xs font-black bg-slate-900 hover:bg-slate-800 active:scale-95 text-white rounded-lg transition shadow flex items-center gap-1.5"
          >
            <span>+ Añadir a mi Cotización</span>
          </button>
        </div>
      </div>
    </div>
  );
}
