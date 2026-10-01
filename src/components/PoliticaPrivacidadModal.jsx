import { empresaConfig } from '../data/productos';

export default function PoliticaPrivacidadModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full overflow-hidden border border-slate-200 flex flex-col max-h-[90vh]">
        {/* Cabecera */}
        <div className="bg-slate-950 text-white p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/40 flex items-center justify-center text-blue-400 font-bold text-lg">
              🛡️
            </div>
            <div>
              <span className="text-[10px] bg-blue-500/20 text-blue-300 font-bold uppercase tracking-wider px-2 py-0.5 rounded border border-blue-500/30">
                Ley N° 29733 • D.S. 003-2013-JUS
              </span>
              <h3 className="font-black text-base sm:text-lg text-white tracking-tight mt-0.5">
                Política de Privacidad y Protección de Datos Personales
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-2 rounded-lg hover:bg-slate-900 transition"
            aria-label="Cerrar política de privacidad"
          >
            ✕
          </button>
        </div>

        {/* Contenido Legal Riguroso */}
        <div className="p-6 overflow-y-auto space-y-4 text-xs text-slate-700 leading-relaxed flex-1">
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-600">
            <strong>Titular del Banco de Datos:</strong> {empresaConfig.razonSocial}<br />
            <strong>RUC:</strong> {empresaConfig.ruc} | <strong>Nombre Comercial:</strong> {empresaConfig.nombre}<br />
            <strong>Domicilio Fiscal:</strong> {empresaConfig.domicilioFiscal}
          </div>

          <section className="space-y-1.5">
            <h4 className="font-bold text-slate-900 text-sm">1. Marco Normativo</h4>
            <p>
              La presente Política de Privacidad se rige estrictamente por la legislación de la República del Perú, en particular por la <strong>Ley N° 29733 (Ley de Protección de Datos Personales)</strong>, su Reglamento aprobado mediante <strong>Decreto Supremo N° 003-2013-JUS</strong> y las directivas emitidas por la Autoridad Nacional de Protección de Datos Personales (ANPDP) del Ministerio de Justicia y Derechos Humanos.
            </p>
          </section>

          <section className="space-y-1.5">
            <h4 className="font-bold text-slate-900 text-sm">2. Datos Personales Recopilados</h4>
            <p>
              A través de este sitio web recopilamos exclusivamente datos personales pertinentes y necesarios para la atención comercial y formalidad de pedidos:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-slate-600">
              <li><strong>Datos de contacto e identificación:</strong> Nombres y apellidos, número de teléfono/WhatsApp, correo electrónico, documento de identidad (DNI, RUC o Carné de Extranjería).</li>
              <li><strong>Datos de obra y logística:</strong> Ubicación geográfica de la obra (distrito, caserío o provincia) y especificaciones técnicas de metrajes de techado.</li>
              <li><strong>Datos de reclamaciones:</strong> Información declarada en el Libro de Reclamaciones Virtual en caso de queja o reclamo.</li>
            </ul>
          </section>

          <section className="space-y-1.5">
            <h4 className="font-bold text-slate-900 text-sm">3. Finalidades del Tratamiento de Datos</h4>
            <p>
              Los datos personales proporcionados libre y voluntariamente por el usuario son tratados para las siguientes finalidades explícitas y lícitas:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-slate-600">
              <li>Elaboración, dimensionamiento y envío de cotizaciones técnicas referenciales y presupuestos de materiales de techado.</li>
              <li>Coordinación de fabricación a la medida exacta de Calaminón Aluzinc TR4, Teja Metálica y perfiles estructurales.</li>
              <li>Coordinación logística de despacho, flete o entrega en planta física en Huayobamba, San Marcos.</li>
              <li>Emisión obligatoria de comprobantes de pago electrónicos (Factura Electrónica y Boleta Electrónica) ante la Superintendencia Nacional de Aduanas y de Administración Tributaria (SUNAT).</li>
              <li>Atención formal de quejas o reclamos en cumplimiento del Código de Protección y Defensa del Consumidor (Ley N° 29571).</li>
            </ul>
          </section>

          <section className="space-y-1.5">
            <h4 className="font-bold text-slate-900 text-sm">4. No Transferencia y Seguridad de la Información</h4>
            <p>
              <strong>{empresaConfig.razonSocial}</strong> garantiza que <strong>NO vende, NO arrienda y NO comercializa</strong> los datos personales de sus usuarios con terceros con fines de publicidad o lucro ajeno. Únicamente se utilizan plataformas tecnológicas seguras necesarias para la comunicación directa (WhatsApp Business API / Meta con cifrado de extremo a extremo) y proveedores de alojamiento con estándares de cifrado TLS.
            </p>
          </section>

          <section className="space-y-1.5">
            <h4 className="font-bold text-slate-900 text-sm">5. Plazo de Conservación de Datos</h4>
            <p>
              Los datos se conservarán durante el periodo que resulte necesario para cumplir con la cotización o relación contractual, y con posterioridad durante los plazos legalmente exigibles por la legislación tributaria peruana (mínimo 5 años para comprobantes de pago fiscalizados por SUNAT).
            </p>
          </section>

          <section className="space-y-1.5">
            <h4 className="font-bold text-slate-900 text-sm">6. Ejercicio de los Derechos ARCO</h4>
            <p>
              Conforme a la Ley N° 29733, usted como titular de sus datos personales tiene derecho en cualquier momento a ejercer sus derechos de <strong>Acceso, Rectificación, Cancelación y Oposición (ARCO)</strong>, así como a revocar su consentimiento.
            </p>
            <p>
              Para ejercer estos derechos, puede presentar una solicitud formal indicando su nombre completo y adjuntando copia de su documento de identidad a través de:
            </p>
            <div className="bg-slate-100 p-3 rounded-lg border border-slate-200 mt-2 space-y-1">
              <p>• <strong>Mesa de Partes / Planta:</strong> {empresaConfig.domicilioFiscal}</p>
              <p>• <strong>Canal Digital de Atención:</strong> WhatsApp {empresaConfig.telefonoDisplay}</p>
              <p>• <strong>Horario de Atención:</strong> {empresaConfig.atencion}</p>
            </div>
          </section>

          <section className="space-y-1.5">
            <h4 className="font-bold text-slate-900 text-sm">7. Modificaciones a la Política de Privacidad</h4>
            <p>
              La empresa se reserva el derecho de actualizar la presente política para adaptarla a futuras modificaciones legislativas o jurisprudenciales. Cualquier actualización sustancial será comunicada a través de esta misma plataforma.
            </p>
          </section>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-100 border-t border-slate-200 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs uppercase tracking-wider transition shadow"
          >
            Entendido y Aceptar
          </button>
        </div>
      </div>
    </div>
  );
}
