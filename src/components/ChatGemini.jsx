import { useState, useRef, useEffect } from 'react';

function FormateadorTexto({ texto }) {
  const parrafos = texto.split(/\n\s*\n/);

  return (
    <div className="space-y-3 leading-relaxed text-[13px] text-neutral-800 tracking-normal font-normal">
      {parrafos.map((parrafo, idx) => {
        const lineas = parrafo.split('\n');

        return (
          <div key={idx} className="space-y-1.5">
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
                    <strong key={pIdx} className="font-bold text-neutral-950">
                      {parte.slice(2, -2)}
                    </strong>
                  );
                }
                return parte;
              });

              if (esEncabezado) {
                return (
                  <div key={lIdx} className="font-bold text-sm text-blue-950 pt-1 pb-0.5 border-b border-neutral-200">
                    {contenido}
                  </div>
                );
              }

              if (esItemLista) {
                return (
                  <div key={lIdx} className="flex items-start gap-2 pl-2">
                    <span className="text-amber-500 font-black text-sm leading-none mt-1">•</span>
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

export default function ChatGemini() {
  const [abierto, setAbierto] = useState(false);
  const [mensaje, setMensaje] = useState('');
  const [historial, setHistorial] = useState([
    {
      remitente: 'bot',
      texto: '¡Hola! 👋 Soy el asesor técnico de **Hubani Metales & Calaminas S.A.C.**\n\n¿Qué medidas o material necesitas para tu obra?'
    }
  ]);
  const [cargando, setCargando] = useState(false);
  const scrollRef = useRef(null);

  // Auto-scroll al recibir o enviar mensajes
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [historial, cargando]);

  const enviarPregunta = async (e) => {
    e.preventDefault();
    if (!mensaje.trim() || cargando) return;

    const consulta = mensaje.trim();
    setMensaje('');

    // Agregamos la nueva pregunta al historial local
    const nuevoHistorial = [...historial, { remitente: 'user', texto: consulta }];
    setHistorial(nuevoHistorial);
    setCargando(true);

    try {
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
      if (!apiKey) {
        throw new Error('Falta la clave VITE_GEMINI_API_KEY en .env.local');
      }

      // Estructuramos todos los turnos anteriores para que Gemini recuerde el contexto
      const contentsPayload = nuevoHistorial
        .filter((_, idx) => idx > 0) // ignorar el saludo inicial estático
        .map(item => ({
          role: item.remitente === 'user' ? 'user' : 'model',
          parts: [{ text: item.texto }]
        }));

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: contentsPayload,
            systemInstruction: {
              parts: [{
                text: `Eres el asesor técnico siderúrgico de "Hubani Metales & Calaminas S.A.C.".
Mantén una conversación fluida recordando lo que el cliente te dijo previamente.
Reglas:
1. Sé breve, profesional y directo.
2. NO vuelvas a saludar con "¡Hola! Te saluda el equipo..." si la conversación ya empezó. Ve directo al cálculo o respuesta.
3. Para cálculos de techos: asume ancho útil de plancha TR4 (~1.00 m), calcula planchas necesarias, solapes recomendados y correas.
4. Usa párrafos cortos y viñetas bien formateadas.`
              }]
            }
          })
        }
      );

      const data = await response.json();

      if (data.error) {
        setHistorial(prev => [...prev, { remitente: 'bot', texto: `Aviso: ${data.error.message}` }]);
        return;
      }

      const respuestaTexto = data.candidates?.[0]?.content?.parts?.[0]?.text || 'No se obtuvo respuesta técnica.';
      setHistorial(prev => [...prev, { remitente: 'bot', texto: respuestaTexto }]);
    } catch (error) {
      console.error(error);
      setHistorial(prev => [
        ...prev,
        { remitente: 'bot', texto: 'No se pudo conectar con el servicio. Revisa tu conexión.' }
      ]);
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 font-sans">
      {!abierto && (
        <button
          onClick={() => setAbierto(true)}
          className="bg-blue-900 hover:bg-blue-950 text-white font-bold px-5 py-3.5 rounded-full shadow-2xl border-2 border-amber-400 flex items-center gap-3 text-xs uppercase tracking-wider transition-all duration-200 hover:scale-105"
        >
          <span className="text-base">👷‍♂️</span>
          <span>Asesor Técnico IA</span>
        </button>
      )}

      {abierto && (
        <div className="bg-white border border-neutral-300 rounded-2xl shadow-2xl w-[92vw] sm:w-[440px] flex flex-col h-[560px] overflow-hidden transition-all">
          <div className="bg-neutral-900 text-white px-4 py-3.5 flex justify-between items-center border-b-2 border-amber-500">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-amber-500 text-neutral-950 flex items-center justify-center font-bold text-sm">
                ⚙️
              </div>
              <div>
                <div className="font-bold text-sm tracking-wide text-white">Asesor Siderúrgico</div>
                <div className="text-[11px] text-emerald-400 font-medium flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  Hubani SAC en vivo
                </div>
              </div>
            </div>
            <button
              onClick={() => setAbierto(false)}
              className="text-neutral-400 hover:text-white p-1 rounded transition text-lg font-bold"
              aria-label="Cerrar"
            >
              ✕
            </button>
          </div>

          <div ref={scrollRef} className="flex-1 p-4 overflow-y-auto space-y-4 bg-neutral-100/70">
            {historial.map((h, i) => (
              <div
                key={i}
                className={`max-w-[88%] p-3.5 rounded-2xl shadow-sm ${
                  h.remitente === 'user'
                    ? 'bg-blue-900 text-white ml-auto rounded-tr-none text-xs leading-relaxed font-medium'
                    : 'bg-white text-neutral-800 border border-neutral-200/80 rounded-tl-none shadow-sm'
                }`}
              >
                {h.remitente === 'user' ? (
                  <p className="m-0">{h.texto}</p>
                ) : (
                  <FormateadorTexto texto={h.texto} />
                )}
              </div>
            ))}

            {cargando && (
              <div className="bg-white border border-neutral-200 text-neutral-500 text-xs px-3.5 py-2.5 rounded-2xl rounded-tl-none inline-flex items-center gap-2 shadow-sm">
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping"></span>
                <span>Calculando especificaciones técnicas...</span>
              </div>
            )}
          </div>

          <form onSubmit={enviarPregunta} className="p-3 bg-white border-t border-neutral-200 flex items-center gap-2">
            <input
              type="text"
              placeholder="Escribe tu consulta o medida..."
              value={mensaje}
              onChange={(e) => setMensaje(e.target.value)}
              className="flex-1 text-xs sm:text-sm border border-neutral-300 rounded-xl px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-900 bg-neutral-50"
            />
            <button
              type="submit"
              disabled={cargando}
              className="bg-amber-500 hover:bg-amber-600 disabled:bg-neutral-300 text-neutral-950 font-black px-4 py-2.5 rounded-xl text-xs uppercase tracking-wider transition shrink-0"
            >
              Enviar
            </button>
          </form>
        </div>
      )}
    </div>
  );
}