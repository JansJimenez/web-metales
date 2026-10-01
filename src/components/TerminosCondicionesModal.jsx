import { empresaConfig } from '../data/productos';

export default function TerminosCondicionesModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full overflow-hidden border border-slate-200 flex flex-col max-h-[90vh]">
        {/* Cabecera */}
        <div className="bg-slate-950 text-white p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 font-bold text-lg">
              📜
            </div>
            <div>
              <span className="text-[10px] bg-slate-800 text-slate-300 font-bold uppercase tracking-wider px-2 py-0.5 rounded border border-slate-700">
                Legislación Peruana • Código Civil & Ley N° 29571
              </span>
              <h3 className="font-black text-base sm:text-lg text-white tracking-tight mt-0.5">
                Términos y Condiciones Generales de Uso y Venta
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-2 rounded-lg hover:bg-slate-900 transition"
            aria-label="Cerrar términos y condiciones"
          >
            ✕
          </button>
        </div>

        {/* Contenido Legal */}
        <div className="p-6 overflow-y-auto space-y-4 text-xs text-slate-700 leading-relaxed flex-1">
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-600">
            <strong>Empresa Titular:</strong> {empresaConfig.razonSocial}<br />
            <strong>RUC:</strong> {empresaConfig.ruc} | <strong>Nombre Comercial:</strong> {empresaConfig.nombre}<br />
            <strong>Domicilio Legal:</strong> {empresaConfig.domicilioFiscal}
          </div>

          <section className="space-y-1.5">
            <h4 className="font-bold text-slate-900 text-sm">1. Ámbito de Aplicación</h4>
            <p>
              Los presentes Términos y Condiciones regulan el acceso, navegación y uso del sitio web de <strong>{empresaConfig.razonSocial}</strong>, así como las condiciones que rigen las cotizaciones, venta de coberturas y contratación de servicios de fabricación y montaje de estructuras metálicas bajo la actividad económica CIIU 2511 en el territorio de la República del Perú.
            </p>
          </section>

          <section className="space-y-1.5">
            <h4 className="font-bold text-slate-900 text-sm">2. Carácter Referencial de Precios y Cotizaciones</h4>
            <p className="bg-amber-50 p-2.5 rounded-lg border border-amber-200 text-amber-900">
              ⚠️ <strong>Cláusula de Transparencia Comercial:</strong> Todos los precios, metrajes y cálculos arrojados por la <em>Calculadora de Techo</em> o expuestos en el catálogo web son <strong>estrictamente estimativos y referenciales en planta</strong>. No constituyen una oferta contractual vinculante hasta la expedición de la proforma oficial formal emitida por nuestro personal técnico, la cual estará sujeta a disponibilidad de stock de bobinas, verificación de espesor y especificaciones definitivas de la obra.
            </p>
          </section>

          <section className="space-y-1.5">
            <h4 className="font-bold text-slate-900 text-sm">3. Fabricación al Corte Milimétrico y Políticas de Desistimiento</h4>
            <p>
              En virtud de que el <strong>Calaminón Aluzinc TR4</strong> y la <strong>Teja Metálica Prepintada</strong> son productos cortados y conformados a la longitud y especificaciones exactas solicitadas por el cliente:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-slate-600">
              <li>Una vez iniciado el proceso de rolado y corte en taller, <strong>no se admiten cancelaciones, modificaciones de metraje ni devoluciones de material cortado</strong>, salvo defecto de fabricación imputable a la empresa comprobado técnicamente.</li>
              <li>Es responsabilidad del comprador o maestro de obra verificar las medidas exactas de sus caídas antes de autorizar el corte en planta.</li>
            </ul>
          </section>

          <section className="space-y-1.5">
            <h4 className="font-bold text-slate-900 text-sm">4. Formalidad Tributaria y Comprobantes SUNAT</h4>
            <p>
              En estricto cumplimiento de la normativa de la <strong>Superintendencia Nacional de Aduanas y de Administración Tributaria (SUNAT)</strong>:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-slate-600">
              <li>{empresaConfig.razonSocial} cuenta con estado <strong>ACTIVO y HABIDO</strong> ante SUNAT con RUC <strong>{empresaConfig.ruc}</strong>.</li>
              <li>Se emite de manera obligatoria <strong>Factura Electrónica</strong> (para personas jurídicas y empresas con RUC) o <strong>Boleta de Venta Electrónica</strong> (para personas naturales con DNI).</li>
              <li>Los comprobantes electrónicos son remitidos digitalmente y constituyen el único sustento legal para crédito fiscal y garantía de compra.</li>
            </ul>
          </section>

          <section className="space-y-1.5">
            <h4 className="font-bold text-slate-900 text-sm">5. Garantías Técnicas y Estándares de Calidad</h4>
            <p>
              Nuestras coberturas están fabricadas a partir de bobinas de acero con aleación Aluzinc (55% Aluminio, 43.4% Zinc, 1.6% Silicio) con recubrimiento mínimo <strong>AZ-150</strong> conforme a la norma <strong>ASTM A792</strong>.
            </p>
            <p>
              La garantía cubre defectos de fabricación y corrosión prematura bajo condiciones climáticas estándar. Quedan expresamente excluidos de garantía los daños provocados por:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-slate-600">
              <li>Almacenamiento inadecuado a la intemperie en paquetes húmedos sin ventilar (*mancha blanca de zinc*).</li>
              <li>Corte en obra con amoladora de disco abrasivo que queme el recubrimiento de zinc (se exige corte con cizalla o punzonadora).</li>
              <li>Fijación con tornillos no galvanizados o sin arandela de neopreno EPDM.</li>
              <li>Exposición a sustancias químicas ácidas o corrosivas ajenas al uso de cubierta.</li>
            </ul>
          </section>

          <section className="space-y-1.5">
            <h4 className="font-bold text-slate-900 text-sm">6. Despacho, Transporte y Entrega en Obra</h4>
            <p>
              Las entregas pueden efectuarse mediante recojo directo en planta (Huayobamba, San Marcos) o mediante servicio de flete coordinado. En caso de despacho a obra, el cliente es responsable de garantizar accesibilidad para vehículos pesados y personal de apoyo para la descarga segura.
            </p>
          </section>

          <section className="space-y-1.5">
            <h4 className="font-bold text-slate-900 text-sm">7. Libro de Reclamaciones</h4>
            <p>
              En cumplimiento del Código de Protección y Defensa del Consumidor (Ley N° 29571), ponemos a disposición de todos nuestros clientes el <strong>Libro de Reclamaciones Virtual</strong> accesible en esta plataforma, garantizando respuesta en un plazo no mayor a quince (15) días hábiles improrrogables.
            </p>
          </section>

          <section className="space-y-1.5">
            <h4 className="font-bold text-slate-900 text-sm">8. Ley Aplicable y Fuero Jurisdiccional</h4>
            <p>
              Cualquier controversia o discrepancia derivada del uso de este sitio o de las transacciones comerciales se regirá e interpretará según las leyes de la República del Perú, sometiéndose las partes expresamente a la jurisdicción de los Jueces y Tribunales de la provincia de San Marcos y departamento de Cajamarca, renunciando a cualquier otro fuero territorial.
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
            Entendido y Conforme
          </button>
        </div>
      </div>
    </div>
  );
}
