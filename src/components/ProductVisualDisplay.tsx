import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Smartphone, Sparkles, CheckCircle2, ShieldCheck, Zap, Star, MessageSquare, ExternalLink } from 'lucide-react';

interface ProductVisualProps {
  type: 'expositor' | 'tarjeta';
  onSimulateTap?: () => void;
}

export const ProductVisualDisplay: React.FC<ProductVisualProps> = ({
  type,
  onSimulateTap,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isTapped, setIsTapped] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);

  const handleTapSimulation = () => {
    setIsTapped(true);
    if (onSimulateTap) onSimulateTap();
    setTimeout(() => {
      setShowReviewModal(true);
      setIsTapped(false);
    }, 600);
  };

  return (
    <div className="relative flex flex-col items-center justify-center w-full max-w-md mx-auto">
      {/* 3D Realistic Stand / Card Container */}
      <div
        id={type === 'expositor' ? 'expositor-visual-card' : 'tarjeta-visual-card'}
        className="relative w-full aspect-[3/4] max-w-[340px] perspective-1000 cursor-pointer group select-none"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={handleTapSimulation}
      >
        {/* Glow halo in Google colors behind the product */}
        <div className="absolute -inset-4 rounded-3xl bg-gradient-to-tr from-blue-600/20 via-emerald-500/10 to-amber-500/20 blur-2xl opacity-60 group-hover:opacity-90 transition-opacity duration-500" />

        {/* The Physical Acrylic Stand or Card */}
        <motion.div
          animate={{
            rotateY: isHovered ? (type === 'expositor' ? -8 : 6) : 0,
            rotateX: isHovered ? (type === 'expositor' ? 4 : -4) : 0,
            scale: isTapped ? 0.96 : isHovered ? 1.02 : 1,
          }}
          transition={{ type: 'spring', stiffness: 280, damping: 20 }}
          className={`relative w-full h-full bg-white rounded-2xl p-5 md:p-6 shadow-2xl flex flex-col items-center justify-between text-slate-900 border border-slate-200 overflow-hidden ${
            type === 'expositor'
              ? 'border-b-8 border-b-slate-200 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.65)]'
              : 'border-2 border-slate-100 shadow-[0_20px_40px_-10px_rgba(0,0,0,0.5)]'
          }`}
        >
          {/* Acrylic Gloss / Specular Reflection Line */}
          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/40 to-transparent -translate-x-full group-hover:translate-x-full duration-1000 transition-transform pointer-events-none" />

          {/* Stand Backfoot shadow if expositor */}
          {type === 'expositor' && (
            <div className="absolute bottom-0 inset-x-8 h-3 bg-slate-300/60 rounded-full blur-[2px] -mb-1 pointer-events-none" />
          )}

          {/* TOP HEADER: "TU EXPERIENCIA NOS HACE MEJORES" */}
          <div className="w-full text-center relative z-10">
            <div className="flex items-center justify-center gap-1.5 text-amber-500 text-xs font-bold uppercase tracking-wider mb-0.5">
              <span>✦</span>
              <span>TU EXPERIENCIA</span>
              <span>✦</span>
            </div>
            <h4 className="text-2xl md:text-[26px] font-black text-slate-900 leading-none tracking-tight">
              NOS HACE
            </h4>
            <h4 className="text-3xl md:text-[32px] font-black text-[#EF4444] leading-none tracking-tight mt-0.5">
              MEJORES
            </h4>
          </div>

          {/* CENTER GRAPHICS & GOOGLE LOGO */}
          <div className="relative flex flex-col items-center justify-center my-auto w-full py-2">
            {/* Playful Doodles around the G */}
            <div className="absolute top-1 left-4 text-emerald-500 font-bold text-lg select-none rotate-12">
              彡
            </div>
            <div className="absolute top-6 left-2 text-[#EF4444] text-xl select-none">
              ♥
            </div>
            <div className="absolute bottom-6 left-5 text-amber-500 font-bold text-sm select-none">
              ＝
            </div>
            <div className="absolute top-2 right-4 text-amber-400 text-lg select-none rotate-45">
              ★
            </div>
            <div className="absolute top-8 right-3 text-blue-500 font-bold text-sm select-none">
              彡
            </div>
            <div className="absolute bottom-6 right-4 text-[#EF4444] font-bold text-sm select-none">
              •
            </div>

            {/* NFC Waves Signal */}
            <div className="flex flex-col items-center mb-1">
              <svg className="w-8 h-5 text-slate-800" viewBox="0 0 32 16" fill="currentColor">
                <path d="M16 14a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z" />
                <path d="M11.5 8.5a6.5 6.5 0 0 1 9 0 .8.8 0 0 0 1.1-1.1 8 8 0 0 0-11.2 0 .8.8 0 1 0 1.1 1.1Z" />
                <path d="M8 5a11.5 11.5 0 0 1 16 0 .8.8 0 0 0 1.1-1.1 13 13 0 0 0-18.2 0 .8.8 0 0 0 1.1 1.1Z" />
              </svg>
            </div>

            {/* Authentic Google Multi-color G Icon */}
            <div className="relative w-20 h-20 md:w-24 md:h-24 my-1 flex items-center justify-center">
              <svg className="w-full h-full drop-shadow-md" viewBox="0 0 48 48">
                <path
                  fill="#EA4335"
                  d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
                />
                <path
                  fill="#4285F4"
                  d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
                />
                <path
                  fill="#FBBC05"
                  d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
                />
                <path
                  fill="#34A853"
                  d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
                />
              </svg>
            </div>

            {/* Dark Blue NFC CTA Pill Button */}
            <div className="bg-[#1E293B] text-white px-3.5 py-1.5 rounded-full flex items-center gap-1.5 text-[11px] font-bold shadow-md border border-slate-700 mt-1">
              <span className="text-sky-400 text-xs">📶</span>
              <span className="tracking-tight uppercase">ACERCA TU MÓVIL Y DÉJANOS TU RESEÑA</span>
            </div>
          </div>

          {/* BOTTOM SECTION: 5 STARS & GOOGLE LOGO */}
          <div className="w-full text-center relative z-10 pt-1 border-t border-slate-100">
            {/* 5 Golden Stars */}
            <div className="flex items-center justify-center gap-1 text-[#F59E0B] text-lg mb-1">
              <span>★</span>
              <span>★</span>
              <span>★</span>
              <span>★</span>
              <span>★</span>
            </div>

            {/* DÉJANOS TU RESEÑA EN Google */}
            <p className="text-[11px] font-bold text-slate-700 tracking-wider uppercase mb-0.5">
              DÉJANOS TU RESEÑA EN
            </p>

            <div className="flex items-center justify-center gap-0.5 font-bold text-2xl tracking-tight leading-none">
              <span className="text-[#4285F4]">G</span>
              <span className="text-[#EA4335]">o</span>
              <span className="text-[#FBBC05]">o</span>
              <span className="text-[#4285F4]">g</span>
              <span className="text-[#34A853]">l</span>
              <span className="text-[#EA4335]">e</span>
            </div>

            <p className="text-[9px] font-semibold text-slate-500 mt-1.5 flex items-center justify-center gap-1">
              <span>♡</span> ¡GRACIAS POR ELEGIRNOS!
            </p>
          </div>

          {/* Badge label inside physical item */}
          <div className="absolute top-2 right-2 bg-slate-900/80 text-white text-[9px] font-bold px-2 py-0.5 rounded-md backdrop-blur-sm shadow">
            NFC CHIP 2026
          </div>
        </motion.div>

        {/* Tap gesture tooltip trigger */}
        <div className="absolute -bottom-10 inset-x-0 flex items-center justify-center gap-2 text-xs font-semibold text-blue-400 bg-blue-950/60 border border-blue-800/50 py-1.5 px-3 rounded-full backdrop-blur-md">
          <Smartphone className="w-3.5 h-3.5 animate-bounce text-blue-400" />
          <span>Haz clic para simular toque NFC (3 seg)</span>
        </div>
      </div>

      {/* MODAL / SIMULATION OVERLAY FOR TAP */}
      <AnimatePresence>
        {showReviewModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.8, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 20 }}
              className="bg-[#111827] border border-slate-700 rounded-2xl max-w-md w-full p-6 shadow-2xl relative text-white"
            >
              {/* Close Button */}
              <button
                id="close-sim-modal-btn"
                onClick={() => setShowReviewModal(false)}
                className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg bg-slate-800/80 transition-colors"
              >
                ✕
              </button>

              {/* NFC Success Header */}
              <div className="flex items-center gap-3 mb-4 pb-4 border-b border-slate-800">
                <div className="w-10 h-10 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                  <Zap className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                      Toque NFC Detectado
                    </span>
                    <span className="bg-emerald-500/20 text-emerald-300 text-[10px] px-1.5 py-0.2 rounded font-semibold">
                      0.8 segundos
                    </span>
                  </div>
                  <h4 className="text-base font-bold text-white">
                    Ficha de Google Maps Abierta Directamente
                  </h4>
                </div>
              </div>

              {/* Simulated Google Review Dialog */}
              <div className="bg-[#1F2937] rounded-xl p-4 border border-slate-700 mb-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center font-bold text-xs text-white">
                      CL
                    </div>
                    <div>
                      <p className="text-xs font-bold text-white">Cliente Satisfecho (Tu Negocio)</p>
                      <p className="text-[10px] text-slate-400">Publicando en Google Maps</p>
                    </div>
                  </div>
                  <span className="text-xs bg-blue-500/20 text-blue-300 font-bold px-2 py-0.5 rounded">
                    5.0 ★★★★★
                  </span>
                </div>

                <div className="bg-[#111827] rounded-lg p-3 border border-slate-800 text-xs text-slate-300 italic">
                  "El servicio de hoy ha sido espectacular. Trato impecable, puntualidad y un resultado de 10. ¡Sin duda mi local de referencia en la ciudad!"
                </div>

                <div className="flex items-center gap-2 text-[11px] text-emerald-400 font-semibold bg-emerald-950/40 p-2 rounded border border-emerald-800/40">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>Sin logins, sin descargar apps, directo desde la cuenta de Google del cliente.</span>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <a
                  href="https://wa.me/34686478561?text=Hola,%20he%20visto%20el%20informe%20de%20RESEO%20STUDIO%20y%20quiero%20información%20para%20mi%20negocio"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm rounded-xl flex items-center justify-center gap-2 transition-colors shadow-lg shadow-emerald-900/30"
                >
                  <span>Pedir Kits NFC para mi Negocio</span>
                  <ExternalLink className="w-4 h-4" />
                </a>
                <button
                  onClick={() => setShowReviewModal(false)}
                  className="w-full py-2 text-xs text-slate-400 hover:text-slate-200 transition-colors"
                >
                  Cerrar simulación
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
