import React from 'react';
import { MessageCircle } from 'lucide-react';

export const FloatingWhatsApp: React.FC = () => {
  const whatsappUrl =
    'https://wa.me/34686478561?text=Hola,%20he%20visto%20el%20informe%20de%20RESEO%20STUDIO%20y%20quiero%20información%20para%20mi%20negocio';

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center group">
      {/* Tooltip on Hover */}
      <div className="hidden sm:flex items-center mr-3 px-3.5 py-2 rounded-xl bg-[#111827] text-white text-xs font-bold border border-slate-700 shadow-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap">
        <span>¿Tienes dudas? Escríbenos por WhatsApp</span>
      </div>

      {/* Floating Button */}
      <a
        id="floating-whatsapp-btn"
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Contactar por WhatsApp"
        className="relative w-14 h-14 rounded-full bg-emerald-500 hover:bg-emerald-400 text-white flex items-center justify-center shadow-[0_10px_25px_-5px_rgba(16,185,129,0.6)] hover:scale-110 transition-all duration-300"
      >
        {/* Pulsing ring */}
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-40"></span>
        <MessageCircle className="w-7 h-7 fill-white relative z-10" />
      </a>
    </div>
  );
};
