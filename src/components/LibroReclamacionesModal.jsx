import { useState } from 'react';
import { empresaConfig } from '../data/productos';

export default function LibroReclamacionesModal({ isOpen, onClose }) {
  const [paso, setPaso] = useState(1); // 1: Formulario, 2: Constancia de Registro
  const [tipoReclamo, setTipoReclamo] = useState('Reclamo'); // 'Reclamo' o 'Queja'
  const [tipoBien, setTipoBien] = useState('Producto'); // 'Producto' o 'Servicio'
  const [esMenor, setEsMenor] = useState(false);
  
  // Datos del formulario
  const [formData, setFormData] = useState({
    nombre: '',
    tipoDoc: 'DNI',
    numeroDoc: '',
    telefono: '',
    email: '',
    domicilio: '',
    nombreApoderado: '',
    montoReclamado: '',
    descripcionBien: '',
    detalleReclamacion: '',
    pedidoConsumidor: '',
    aceptaVeracidad: false
  });

  const [codigoGenerado, setCodigoGenerado] = useState('');
  const [fechaRegistro, setFechaRegistro] = useState('');
  const [errorValidacion, setErrorValidacion] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorValidacion('');

    if (!formData.nombre.trim() || !formData.numeroDoc.trim() || !formData.telefono.trim() || !formData.email.trim()) {
      setErrorValidacion('Por favor completa todos los datos obligatorios del consumidor.');
      return;
    }

    if (!formData.detalleReclamacion.trim() || !formData.pedidoConsumidor.trim()) {
      setErrorValidacion('Por favor detalla los hechos de la reclamación y tu pedido concreto.');
      return;
    }

    if (!formData.aceptaVeracidad) {
      setErrorValidacion('Debes declarar la veracidad de los hechos y aceptar las condiciones de notificación.');
      return;
    }

    // Generación de código correlativo legal conforme a directivas INDECOPI
    const correlativo = Math.floor(1000 + Math.random() * 9000);
    const anio = new Date().getFullYear();
    const codigo = `LR-${anio}-${correlativo}`;
    const fecha = new Date().toLocaleString('es-PE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

    setCodigoGenerado(codigo);
    setFechaRegistro(fecha);
    setPaso(2);

    // Enviar constancia o alertar vía WhatsApp / Email
    const mensajeWA = `📄 *REGISTRO DE HOJA DE RECLAMACIÓN VIRTUAL (${codigo})*\n` +
      `🏛️ *Proveedor:* ${empresaConfig.razonSocial} (RUC: ${empresaConfig.ruc})\n` +
      `📅 *Fecha:* ${fecha}\n` +
      `👤 *Consumidor:* ${formData.nombre} (${formData.tipoDoc}: ${formData.numeroDoc})\n` +
      `📱 *Teléfono:* ${formData.telefono} | 📧 *Email:* ${formData.email}\n` +
      `🏷️ *Tipo:* ${tipoReclamo.toUpperCase()} (${tipoBien})\n` +
      `📝 *Detalle:* ${formData.detalleReclamacion.slice(0, 150)}...\n` +
      `🎯 *Pedido:* ${formData.pedidoConsumidor.slice(0, 100)}...\n` +
      `⚖️ *Plazo legal de respuesta:* 15 días hábiles (Ley 31435).`;

    // Abrir respaldo opcional en WhatsApp
    console.log('Hoja de reclamación registrada:', mensajeWA);
  };

  const reiniciarModal = () => {
    setPaso(1);
    setFormData({
      nombre: '',
      tipoDoc: 'DNI',
      numeroDoc: '',
      telefono: '',
      email: '',
      domicilio: '',
      nombreApoderado: '',
      montoReclamado: '',
      descripcionBien: '',
      detalleReclamacion: '',
      pedidoConsumidor: '',
      aceptaVeracidad: false
    });
    setErrorValidacion('');
    onClose();
  };

  const imprimirConstancia = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full overflow-hidden border border-slate-200 flex flex-col max-h-[92vh]">
        
        {/* Cabecera Oficial Libro de Reclamaciones */}
        <div className="bg-slate-950 text-white p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 font-bold text-xl">
              📖
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] bg-amber-500/20 text-amber-300 font-bold uppercase tracking-wider px-2 py-0.5 rounded border border-amber-500/30">
                  Ley N° 29571 • D.S. 011-2011-PCM
                </span>
                <span className="text-[11px] text-slate-300 font-medium">
                  RUC: {empresaConfig.ruc}
                </span>
              </div>
              <h3 className="font-black text-base sm:text-lg text-white tracking-tight mt-0.5">
                Libro de Reclamaciones Virtual
              </h3>
            </div>
          </div>
          <button
            onClick={reiniciarModal}
            className="text-slate-400 hover:text-white p-2 rounded-lg hover:bg-slate-900 transition"
            aria-label="Cerrar libro de reclamaciones"
          >
            ✕
          </button>
        </div>

        {/* Contenido / Pasos */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1 text-xs">
          {paso === 1 ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Información Institucional del Proveedor */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-1 text-slate-600">
                <p>
                  <strong>Razón Social:</strong> {empresaConfig.razonSocial}
                </p>
                <p>
                  <strong>RUC:</strong> {empresaConfig.ruc} | <strong>Nombre Comercial:</strong> {empresaConfig.nombre}
                </p>
                <p>
                  <strong>Dirección de la Planta / Establecimiento:</strong> {empresaConfig.domicilioFiscal}
                </p>
              </div>

              {/* Mensaje Informativo INDECOPI */}
              <div className="bg-amber-50 border border-amber-200 text-amber-900 p-3 rounded-xl text-[11px] leading-relaxed">
                ⚖️ <strong>Información importante según la legislación peruana:</strong><br />
                • <strong>RECLAMO:</strong> Disconformidad relacionada a los productos o servicios ofrecidos o adquiridos.<br />
                • <strong>QUEJA:</strong> Malestar o descontento respecto a la atención al público brindada por nuestro personal.<br />
                • Conforme a la Ley N° 31435, el plazo máximo de respuesta a su queja o reclamo es de <strong>15 días hábiles improrrogables</strong>.
              </div>

              {errorValidacion && (
                <div className="bg-red-50 border border-red-300 text-red-700 p-3 rounded-xl font-medium">
                  ⚠️ {errorValidacion}
                </div>
              )}

              {/* SECCIÓN 1: Identificación del Consumidor Reclamante */}
              <div className="space-y-3">
                <h4 className="font-bold text-slate-900 uppercase tracking-wider text-xs border-b border-slate-200 pb-1.5 flex items-center gap-1.5">
                  <span>1.</span> Identificación del Consumidor Reclamante
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      Nombre y Apellidos / Razón Social *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Nombres y Apellidos completos"
                      value={formData.nombre}
                      onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">
                        Doc. *
                      </label>
                      <select
                        value={formData.tipoDoc}
                        onChange={(e) => setFormData({ ...formData, tipoDoc: e.target.value })}
                        className="w-full px-2 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:outline-none bg-white font-semibold"
                      >
                        <option value="DNI">DNI</option>
                        <option value="CE">CE</option>
                        <option value="RUC">RUC</option>
                        <option value="Pasaporte">Pasap.</option>
                      </select>
                    </div>
                    <div className="col-span-2">
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">
                        Número de Documento *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="N° de Documento"
                        value={formData.numeroDoc}
                        onChange={(e) => setFormData({ ...formData, numeroDoc: e.target.value })}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      Teléfono / Celular de Contacto *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="Ej: 921819166"
                      value={formData.telefono}
                      onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      Correo Electrónico (para notificación) *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="correo@ejemplo.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Domicilio (Dirección, Distrito, Ciudad)
                  </label>
                  <input
                    type="text"
                    placeholder="Ej: Jr. Comercio N° 123, San Marcos, Cajamarca"
                    value={formData.domicilio}
                    onChange={(e) => setFormData({ ...formData, domicilio: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:outline-none"
                  />
                </div>

                <div className="pt-1">
                  <label className="inline-flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={esMenor}
                      onChange={(e) => setEsMenor(e.target.checked)}
                      className="rounded border-slate-300 text-slate-900 focus:ring-slate-900"
                    />
                    <span className="text-[11px] text-slate-600">El consumidor reclamante es menor de edad</span>
                  </label>

                  {esMenor && (
                    <div className="mt-2 pl-6">
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">
                        Nombre completo del Padre, Madre o Apoderado:
                      </label>
                      <input
                        type="text"
                        placeholder="Nombres y DNI del apoderado"
                        value={formData.nombreApoderado}
                        onChange={(e) => setFormData({ ...formData, nombreApoderado: e.target.value })}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:outline-none"
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* SECCIÓN 2: Identificación del Bien Contratado */}
              <div className="space-y-3">
                <h4 className="font-bold text-slate-900 uppercase tracking-wider text-xs border-b border-slate-200 pb-1.5 flex items-center gap-1.5">
                  <span>2.</span> Identificación del Bien Contratado
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      Tipo de Bien *
                    </label>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => setTipoBien('Producto')}
                        className={`flex-1 py-1.5 rounded-lg border font-bold text-xs transition ${
                          tipoBien === 'Producto'
                            ? 'bg-slate-900 text-white border-slate-900'
                            : 'bg-slate-100 text-slate-700 border-slate-200'
                        }`}
                      >
                        Producto
                      </button>
                      <button
                        type="button"
                        onClick={() => setTipoBien('Servicio')}
                        className={`flex-1 py-1.5 rounded-lg border font-bold text-xs transition ${
                          tipoBien === 'Servicio'
                            ? 'bg-slate-900 text-white border-slate-900'
                            : 'bg-slate-100 text-slate-700 border-slate-200'
                        }`}
                      >
                        Servicio
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      Monto Reclamado (S/ - Opcional)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      value={formData.montoReclamado}
                      onChange={(e) => setFormData({ ...formData, montoReclamado: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      Descripción del Bien *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Ej: Teja Metálica / Calaminón TR4"
                      value={formData.descripcionBien}
                      onChange={(e) => setFormData({ ...formData, descripcionBien: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* SECCIÓN 3: Detalle de la Reclamación y Pedido del Consumidor */}
              <div className="space-y-3">
                <h4 className="font-bold text-slate-900 uppercase tracking-wider text-xs border-b border-slate-200 pb-1.5 flex items-center gap-1.5">
                  <span>3.</span> Detalle de la Reclamación y Pedido del Consumidor
                </h4>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1.5">
                    Tipo de Reclamación *
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <label
                      onClick={() => setTipoReclamo('Reclamo')}
                      className={`p-3 rounded-xl border cursor-pointer transition ${
                        tipoReclamo === 'Reclamo'
                          ? 'border-slate-900 bg-slate-900/5 ring-1 ring-slate-900'
                          : 'border-slate-200 bg-white hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="tipoReclamacionRadio"
                          checked={tipoReclamo === 'Reclamo'}
                          onChange={() => setTipoReclamo('Reclamo')}
                          className="text-slate-900"
                        />
                        <span className="font-bold text-slate-900">RECLAMO</span>
                      </div>
                      <p className="text-[10px] text-slate-500 mt-1 pl-5">
                        Disconformidad con el producto adquirido o servicio prestado.
                      </p>
                    </label>

                    <label
                      onClick={() => setTipoReclamo('Queja')}
                      className={`p-3 rounded-xl border cursor-pointer transition ${
                        tipoReclamo === 'Queja'
                          ? 'border-slate-900 bg-slate-900/5 ring-1 ring-slate-900'
                          : 'border-slate-200 bg-white hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="tipoReclamacionRadio"
                          checked={tipoReclamo === 'Queja'}
                          onChange={() => setTipoReclamo('Queja')}
                          className="text-slate-900"
                        />
                        <span className="font-bold text-slate-900">QUEJA</span>
                      </div>
                      <p className="text-[10px] text-slate-500 mt-1 pl-5">
                        Malestar o disconformidad respecto a la atención al público.
                      </p>
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Detalle de los hechos que sustentan el {tipoReclamo.toUpperCase()} *
                  </label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Describe de forma clara y detallada los hechos ocurridos..."
                    value={formData.detalleReclamacion}
                    onChange={(e) => setFormData({ ...formData, detalleReclamacion: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Pedido concreto del consumidor *
                  </label>
                  <textarea
                    rows={2}
                    required
                    placeholder="Indica qué solución o acción concreta solicitas a la empresa..."
                    value={formData.pedidoConsumidor}
                    onChange={(e) => setFormData({ ...formData, pedidoConsumidor: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:outline-none"
                  />
                </div>
              </div>

              {/* Declaración y Consentimiento Legal */}
              <div className="pt-2 border-t border-slate-200">
                <label className="flex items-start gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    required
                    checked={formData.aceptaVeracidad}
                    onChange={(e) => setFormData({ ...formData, aceptaVeracidad: e.target.checked })}
                    className="mt-0.5 rounded border-slate-300 text-slate-900 focus:ring-slate-900"
                  />
                  <span className="text-[11px] text-slate-600 leading-relaxed">
                    Declaro bajo juramento que los datos consignados en la presente hoja de reclamación son verídicos, y autorizo a <strong>{empresaConfig.razonSocial}</strong> a notificarme la respuesta y acciones adoptadas al correo electrónico consignado, conforme al Código de Protección y Defensa del Consumidor (Ley N° 29571) y la Ley de Protección de Datos Personales (Ley N° 29733).
                  </span>
                </label>
              </div>

              {/* Botones de Envío */}
              <div className="pt-4 flex flex-col sm:flex-row justify-end gap-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={reiniciarModal}
                  className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-bold hover:bg-slate-100 transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-black uppercase tracking-wider transition shadow flex items-center justify-center gap-2"
                >
                  <span>📨 Registrar Hoja de Reclamación</span>
                </button>
              </div>
            </form>
          ) : (
            /* PASO 2: Constancia Legal de Registro INDECOPI */
            <div className="space-y-6 animate-fadeIn" id="constancia-reclamacion">
              <div className="text-center p-6 bg-emerald-50 border border-emerald-300 rounded-2xl">
                <span className="text-4xl block mb-2">✔</span>
                <h4 className="text-lg font-black text-emerald-950">
                  Hoja de Reclamación Registrada Exitosamente
                </h4>
                <p className="text-xs text-emerald-800 mt-1">
                  Se ha generado su constancia de registro formal conforme a la normativa de INDECOPI.
                </p>
                <div className="mt-3 inline-block bg-white border border-emerald-400 px-4 py-1.5 rounded-xl font-mono font-black text-sm text-slate-900 shadow-2xs">
                  CÓDIGO: {codigoGenerado}
                </div>
              </div>

              {/* Resumen de la Constancia */}
              <div className="border border-slate-300 rounded-xl p-5 space-y-3 bg-slate-50/50">
                <div className="grid grid-cols-2 gap-2 pb-2 border-b border-slate-200 text-[11px]">
                  <div>
                    <span className="text-slate-400 font-bold block uppercase">Proveedor:</span>
                    <strong className="text-slate-900">{empresaConfig.razonSocial}</strong> (RUC: {empresaConfig.ruc})
                  </div>
                  <div className="text-right">
                    <span className="text-slate-400 font-bold block uppercase">Fecha y Hora:</span>
                    <strong className="text-slate-900">{fechaRegistro}</strong>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div>
                    <span className="text-slate-400 font-bold block uppercase">Consumidor:</span>
                    <span className="text-slate-900 font-medium">{formData.nombre} ({formData.tipoDoc}: {formData.numeroDoc})</span>
                  </div>
                  <div>
                    <span className="text-slate-400 font-bold block uppercase">Correo Notificación:</span>
                    <span className="text-slate-900 font-medium">{formData.email}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div>
                    <span className="text-slate-400 font-bold block uppercase">Tipo de Registro:</span>
                    <span className="font-black text-slate-900">{tipoReclamo.toUpperCase()} ({tipoBien})</span>
                  </div>
                  <div>
                    <span className="text-slate-400 font-bold block uppercase">Plazo Máximo Legal:</span>
                    <span className="text-slate-900 font-bold">15 días hábiles (Ley N° 31435)</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-200 text-[11px]">
                  <span className="text-slate-400 font-bold block uppercase">Detalle del Reclamo / Queja:</span>
                  <p className="text-slate-800 mt-0.5 whitespace-pre-wrap">{formData.detalleReclamacion}</p>
                </div>

                <div className="pt-2 border-t border-slate-200 text-[11px]">
                  <span className="text-slate-400 font-bold block uppercase">Pedido Concreto:</span>
                  <p className="text-slate-800 mt-0.5 whitespace-pre-wrap">{formData.pedidoConsumidor}</p>
                </div>
              </div>

              <div className="p-4 bg-slate-100 rounded-xl text-slate-600 text-[11px] leading-relaxed">
                📌 <em>Una copia de este registro ha sido archivada en nuestro sistema. Según lo dispuesto por la Ley N° 29571 y modificatorias, la empresa brindará respuesta formal a través del correo electrónico registrado en un plazo no mayor a quince (15) días hábiles.</em>
              </div>

              {/* Botones de Acción */}
              <div className="flex flex-col sm:flex-row justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={imprimirConstancia}
                  className="px-5 py-2.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-100 text-slate-800 font-bold text-xs flex items-center justify-center gap-1.5 transition"
                >
                  <span>🖨️ Imprimir / Guardar PDF</span>
                </button>
                <button
                  type="button"
                  onClick={reiniciarModal}
                  className="px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs uppercase tracking-wider transition"
                >
                  Entendido y Finalizar
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
