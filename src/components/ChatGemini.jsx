import { useState, useRef, useEffect } from 'react';
import { empresaConfig, productosData } from '../data/productos';

function FormateadorTexto({ texto }) {
  const parrafos = texto.split(/\n\s*\n/);

  return (
    <div className="space-y-2.5 leading-relaxed text-[13px] text-slate-800 tracking-normal font-normal">
      {parrafos.map((parrafo, idx) => {
        const lineas = parrafo.split('\n');

        return (
          <div key={idx} className="space-y-1">
            {lineas.map((linea, lIdx) => {
              const lineaLimpia = linea.trim();
              const esEncabezado = /^#{1,4}\s+/.test(lineaLimpia);
              const esItemLista = /^(\*|-|\d+\.)\s+/.test(lineaLimpia);

              const textoSinPrefijo = lineaLimpia
                .replace(/^#{1,4}\s+/, '')
                .replace(/^(\*|-|\d+\.)\s+/, '');

              const partes = textoSinPrefijo.split(/(\*\*.*?\*\*)/g);

              const contenido = partes.map((parte, pIdx) => {
                if (parte.startsWith('**') && parte.endsWith('**')) {
                  return (
                    <strong key={pIdx} className="font-bold text-slate-950">
                      {parte.slice(2, -2)}
                    </strong>
                  );
                }
                return parte;
              });

              if (esEncabezado) {
                return (
                  <div key={lIdx} className="font-bold text-xs uppercase tracking-wider text-red-600 pt-1 pb-0.5 border-b border-slate-200">
                    {contenido}
                  </div>
                );
              }

              if (esItemLista) {
                return (
                  <div key={lIdx} className="flex items-start gap-2 pl-1">
                    <span className="text-red-600 font-black text-sm leading-none mt-0.5">•</span>
                    <span className="flex-1">{contenido}</span>
                  </div>
                );
              }

              return (
                <p key={lIdx} className="m-0">
                  {contenido}
                </p>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}

const PREGUNTAS_RAPIDAS = [
  "¿Cuántas planchas de Teja Metálica necesito?",
  "Cortes a medida en Calaminón Aluzinc TR4",
  "¿Hacen entregas en Huayobamba y San Marcos?",
  "Tornillos y cumbreras para techo a 2 aguas"
];

const MODELOS_DISPONIBLES = ['gemini-3-flash-preview', 'gemini-3.1-flash-lite-preview'];

// Límite de seguridad: máximo de mensajes por sesión en cliente para evitar consumo indebido
const MAX_MENSAJES_SESION = 15;

export default function ChatGemini() {
  const [abierto, setAbierto] = useState(false);
  const [mensaje, setMensaje] = useState('');
  const [contadorPeticiones, setContadorPeticiones] = useState(0);
  const [historial, setHistorial] = useState([
    {
      remitente: 'bot',
      texto: `¡Hola! 👋 Te saluda el asesor técnico siderúrgico de **${empresaConfig.nombre}** en Huayobamba - San Marcos.\n\nFabricamos **Teja Metálica Prepintada** y **Calaminón Aluzinc TR4 al corte exacto** de tu obra.\n\n¿Qué dimensiones tiene tu techo o qué material deseas cotizar hoy?`
    }
  ]);
  const [cargando, setCargando] = useState(false);
  const scrollRef = useRef(null);
  const ultimaPeticionRef = useRef(0);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [historial, cargando, abierto]);

  const llamarGeminiConFallback = async (contentsPayload, systemInstructionText) => {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    if (!apiKey) {
      return `Estimado cliente, para coordinar cotizaciones oficiales y fabricación a medida, por favor comunícate directamente con nuestra planta al WhatsApp: **${empresaConfig.telefonoDisplay}** (Atención directa en Huayobamba - San Marcos).`;
    }

    for (const model of MODELOS_DISPONIBLES) {
      try {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
        const res = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: contentsPayload,
            systemInstruction: {
              parts: [{ text: systemInstructionText }]
            }
          })
        });

        if (res.status === 429) {
          throw new Error('Límite de cuota excedido (Rate limit).');
        }

        const data = await res.json();
        if (data.error) {
          console.warn(`Modelo ${model} retornó advertencia:`, data.error);
          continue;
        }

        const texto = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (texto) {
          return texto;
        }
      } catch (err) {
        console.warn(`Error llamando a ${model}:`, err);
      }
    }

    // Fallback defensivo si los modelos no responden o se agota la cuota
    return `⚠️ Nuestro canal de IA está en mantenimiento o con alta concurrencia. Por favor escríbenos directamente a nuestro WhatsApp oficial: **${empresaConfig.telefonoDisplay}** donde te atenderemos al instante con precios de fábrica.`;
  };

  const procesarPregunta = async (textoConsulta, timestamp = 0) => {
    if (!textoConsulta.trim() || cargando) return;

    // Regla de seguridad: Rate limiting por tiempo mínimo (anti-spam 2.5s)
    if (timestamp > 0 && timestamp - ultimaPeticionRef.current < 2500) {
      return;
    }
    if (timestamp > 0) {
      ultimaPeticionRef.current = timestamp;
    }

    // Regla de seguridad: Límite de mensajes por sesión
    if (contadorPeticiones >= MAX_MENSAJES_SESION) {
      setHistorial(prev => [
        ...prev,
        {
          remitente: 'bot',
          texto: `Has alcanzado el límite de consultas de esta sesión técnica. Para formalizar tu pedido o realizar más cálculos detallados, por favor contáctanos vía WhatsApp al **${empresaConfig.telefonoDisplay}**.`
        }
      ]);
      return;
    }

    // Sanitización y truncado de entrada para evitar prompt injection y consumo excesivo
    const consulta = textoConsulta.trim().slice(0, 350).replace(/[<>]/g, '');
    setMensaje('');
    setContadorPeticiones(prev => prev + 1);

    const nuevoHistorial = [...historial, { remitente: 'user', texto: consulta }];
    setHistorial(nuevoHistorial);
    setCargando(true);

    try {
      // Limitar el historial enviado a las últimas 6 interacciones para ahorrar tokens y latencia
      const ultimosMensajes = nuevoHistorial.slice(-6);
      const contentsPayload = ultimosMensajes
        .filter((_, idx) => idx > 0)
        .map(item => ({
          role: item.remitente === 'user' ? 'user' : 'model',
          parts: [{ text: item.texto }]
        }));

      const resumenCatalogo = productosData.map(p => 
        `- ${p.nombre}: Norma ${p.norma}, Espesores: ${p.espesores}, Precio Ref: ${p.precio_ref} por ${p.unidad || 'unidad'}. Ancho útil: ${p.anchoUtil || 'estándar'}`
      ).join('\n');

      const systemPrompt = `Eres el asesor técnico siderúrgico de "${empresaConfig.nombre}" (TECHOS METÁLICOS - HUAYOBAMBA - SAN MARCOS).
Lema: "${empresaConfig.lema}".
Ubicación: ${empresaConfig.direccion}. WhatsApp oficial: ${empresaConfig.telefonoDisplay}.
Atención: ${empresaConfig.atencion}.

PRODUCTOS PRINCIPALES DE NUESTRA PLANTA:
1. Teja Metálica Prepintada Aluzinc (Rojo terracota, verde, chocolate). Ancho útil 1.00m. Resistente a heladas y granizo.
2. Calaminón Aluzinc TR4 rolado a la medida exacta del cliente (cero uniones y cero desperdicio). Ancho útil 1.00m.
3. Cumbreras y Caballetes para Teja y TR4 en tramos de 2m y 3m.
4. Perfiles Costanera C para correas de techo y Tubos estructurales LAC para tijerales.
5. Tornillos autoperforantes con arandela de neopreno EPDM.

CATÁLOGO COMPLETO Y PRECIOS REFERENCIALES:
${resumenCatalogo}

NORMAS DE ATENCIÓN:
1. Sé conciso, profesional, amable y de confianza.
2. Para cálculos: Ancho útil = 1.00m tanto en Teja Metálica como en Calaminón TR4. Tornillos: ~6 por plancha. En techos a 2 aguas incluir cumbreras.
3. Recuerda siempre que se realizan cortes al milímetro para evitar empalmes en obra.
4. Invita al cliente a contactar al WhatsApp ${empresaConfig.telefonoDisplay} para coordinar despacho o recojo en planta.`;

      const respuesta = await llamarGeminiConFallback(contentsPayload, systemPrompt);
      setHistorial(prev => [...prev, { remitente: 'bot', texto: respuesta }]);
    } catch (error) {
      console.error('Error en asistente IA:', error);
      setHistorial(prev => [
        ...prev,
        {
          remitente: 'bot',
          texto: `Por favor contáctate directamente a nuestro WhatsApp oficial **${empresaConfig.telefonoDisplay}** para darte la cotización exacta en fábrica.`
        }
      ]);
    } finally {
      setCargando(false);
    }
  };

  const enviarPregunta = (e) => {
    e.preventDefault();
    procesarPregunta(mensaje, e.timeStamp || 1);
  };

  const reiniciarChat = () => {
    setContadorPeticiones(0);
    setHistorial([
      {
        remitente: 'bot',
        texto: `¡Conversación reiniciada! 👋 Te saluda el asesor técnico de **${empresaConfig.nombre}** en Huayobamba - San Marcos.\n\n¿En qué podemos asesorarte hoy sobre tu techo o estructura?`
      }
    ]);
  };

  return (
    <div className="fixed bottom-20 sm:bottom-5 right-3 sm:right-5 z-40 font-sans">
      {!abierto && (
        <button
          onClick={() => setAbierto(true)}
          className="group relative bg-slate-900 hover:bg-slate-800 text-white font-bold p-3 sm:pl-4 sm:pr-5 sm:py-3 rounded-full shadow-2xl border border-slate-700/80 flex items-center gap-2 sm:gap-3 text-xs uppercase tracking-wider transition-all duration-300 hover:scale-105"
          aria-label="Abrir asesor técnico siderúrgico"
          title="Consultas técnicas con Asesor IA"
        >
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
          </span>
          <span className="text-xl">👷‍♂️</span>
          <div className="text-left hidden sm:block">
            <span className="block text-[10px] text-slate-400 leading-none font-bold">Asesor Técnico Siderúrgico</span>
            <span className="text-xs font-black tracking-tight text-white">Consultas & Cubicación</span>
          </div>
        </button>
      )}

      {abierto && (
        <div className="bg-white border border-slate-300 rounded-2xl shadow-2xl w-[94vw] sm:w-[440px] flex flex-col h-[560px] max-h-[85vh] overflow-hidden transition-all animate-fadeIn">
          {/* Header */}
          <div className="bg-slate-950 text-white px-4 py-3 flex justify-between items-center border-b border-slate-800">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-red-600 text-white flex items-center justify-center font-black text-xs shadow">
                ▲
              </div>
              <div>
                <div className="font-bold text-xs sm:text-sm tracking-tight text-white flex items-center gap-1.5">
                  Asesor Técnico IA • Huayobamba
                </div>
                <div className="text-[10px] text-slate-400 font-medium flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  Planta San Marcos en línea
                </div>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={reiniciarChat}
                title="Reiniciar conversación"
                className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-900 transition text-xs"
              >
                🔄
              </button>
              <button
                onClick={() => setAbierto(false)}
                className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-900 transition text-sm font-bold"
                aria-label="Cerrar"
              >
                ✕
              </button>
            </div>
          </div>

          {/* Área de Mensajes */}
          <div ref={scrollRef} className="flex-1 p-3.5 overflow-y-auto space-y-3.5 bg-slate-50">
            {historial.map((h, i) => (
              <div
                key={i}
                className={`max-w-[88%] p-3.5 rounded-2xl shadow-2xs ${
                  h.remitente === 'user'
                    ? 'bg-slate-900 text-white ml-auto rounded-tr-none text-xs leading-relaxed font-medium'
                    : 'bg-white text-slate-800 border border-slate-200 rounded-tl-none'
                }`}
              >
                {h.remitente === 'user' ? (
                  <p className="m-0">{h.texto}</p>
                ) : (
                  <FormateadorTexto texto={h.texto} />
                )}
              </div>
            ))}

            {/* Chips de Preguntas Rápidas */}
            {historial.length === 1 && !cargando && (
              <div className="pt-2 space-y-1.5">
                <span className="text-[10px] uppercase font-bold text-slate-400 block px-1 tracking-wider">
                  Consultas frecuentes:
                </span>
                <div className="flex flex-col gap-1.5">
                  {PREGUNTAS_RAPIDAS.map((p, idx) => (
                    <button
                      key={idx}
                      onClick={(e) => procesarPregunta(p, e.timeStamp || 1)}
                      className="text-left text-xs bg-white hover:bg-slate-100 border border-slate-200 p-2 rounded-lg text-slate-700 hover:text-slate-900 font-medium transition duration-150 flex items-center justify-between group shadow-2xs"
                    >
                      <span>{p}</span>
                      <span className="text-slate-400 group-hover:text-red-600 font-bold ml-1">→</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {cargando && (
              <div className="bg-white border border-slate-200 text-slate-600 text-xs px-3.5 py-2.5 rounded-2xl rounded-tl-none inline-flex items-center gap-2 shadow-2xs">
                <span className="w-2 h-2 rounded-full bg-red-600 animate-ping"></span>
                <span>Calculando especificaciones y cortes de fábrica...</span>
              </div>
            )}
          </div>

          {/* WhatsApp Directo */}
          <div className="bg-slate-100 px-3.5 py-2 border-t border-slate-200 flex justify-between items-center text-[11px] text-slate-600">
            <span>¿Requieres cotización formal?</span>
            <a
              href={`https://wa.me/${empresaConfig.telefono}?text=Hola,%20quisiera%20cotizar%20planchas%20de%20techo%20en%20planta`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-emerald-700 hover:text-emerald-800 font-bold flex items-center gap-1"
            >
              <span>WhatsApp Planta {empresaConfig.telefonoDisplay}</span> 📲
            </a>
          </div>

          {/* Formulario */}
          <form onSubmit={enviarPregunta} className="p-2.5 bg-white border-t border-slate-200 flex items-center gap-2">
            <input
              type="text"
              placeholder="Consulta tu medida (ej: techo 7x9m en teja...)"
              value={mensaje}
              onChange={(e) => setMensaje(e.target.value)}
              maxLength={350}
              className="flex-1 text-xs border border-slate-300 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-slate-900 bg-slate-50 focus:bg-white"
            />
            <button
              type="submit"
              disabled={cargando || !mensaje.trim()}
              className="bg-slate-900 hover:bg-slate-800 disabled:bg-slate-200 disabled:text-slate-400 text-white font-bold px-3.5 py-2.5 rounded-xl text-xs uppercase tracking-wider transition shrink-0 shadow-2xs"
            >
              Enviar
            </button>
          </form>
        </div>
      )}
    </div>
  );
}