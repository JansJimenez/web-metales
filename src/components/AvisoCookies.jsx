import { useState } from 'react';

export default function AvisoCookies({ onAbrirPrivacidad }) {
  const [visible, setVisible] = useState(() => {
    try {
      return !localStorage.getItem('terminos_cookies_aceptadas');
    } catch {
      return false;
    }
  });

  const aceptarCookies = () => {
    localStorage.setItem('terminos_cookies_aceptadas', 'true');
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-45 p-3 sm:p-4 bg-slate-950/95 backdrop-blur-md border-t border-slate-800 text-white text-xs shadow-2xl animate-fadeIn">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <span className="text-xl">🍪</span>
          <p className="text-slate-300 leading-snug">
            Utilizamos almacenamiento local y cookies técnicas esenciales para guardar sus materiales de cotización y garantizar la navegación segura conforme a la <strong>Ley N° 29733 (Protección de Datos Personales del Perú)</strong>.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={onAbrirPrivacidad}
            className="text-slate-400 hover:text-white underline text-[11px] transition px-2 py-1"
          >
            Leer Política
          </button>
          <button
            onClick={aceptarCookies}
            className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-4 py-2 rounded-lg transition shadow"
          >
            Aceptar y Continuar
          </button>
        </div>
      </div>
    </div>
  );
}
