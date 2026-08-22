import React, { useState, useEffect } from 'react';

interface CookieBannerProps {
  onOpenCookiesPolicy: () => void;
}

export const CookieBanner: React.FC<CookieBannerProps> = ({ onOpenCookiesPolicy }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [allowAnalytics, setAllowAnalytics] = useState(true);

  useEffect(() => {
    try {
      const consent = localStorage.getItem('reseostudio_cookie_consent');
      if (!consent) {
        // Show after a small delay for smooth entrance
        const timer = setTimeout(() => setIsVisible(true), 800);
        return () => clearTimeout(timer);
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  const handleAcceptAll = () => {
    try {
      localStorage.setItem(
        'reseostudio_cookie_consent',
        JSON.stringify({ necessary: true, analytics: true, timestamp: new Date().toISOString() })
      );
    } catch (e) {
      console.error(e);
    }
    setIsVisible(false);
  };

  const handleSaveConfig = () => {
    try {
      localStorage.setItem(
        'reseostudio_cookie_consent',
        JSON.stringify({ necessary: true, analytics: allowAnalytics, timestamp: new Date().toISOString() })
      );
    } catch (e) {
      console.error(e);
    }
    setShowConfigModal(false);
    setIsVisible(false);
  };

  if (!isVisible && !showConfigModal) return null;

  return (
    <>
      {/* Floating Bottom Cookie Banner */}
      {isVisible && !showConfigModal && (
        <div
          id="cookie-consent-banner"
          className="fixed bottom-4 left-4 right-4 sm:left-6 sm:right-auto sm:max-w-md z-40 bg-[#141311]/95 backdrop-blur-md border border-[#2A2826] text-white p-5 rounded-2xl shadow-2xl animate-fade-in font-['DM_Sans',sans-serif]"
        >
          <div className="flex items-start gap-3 mb-3">
            <span className="text-xl">🍪</span>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-white font-['Outfit',sans-serif] tracking-[-0.03em]">
                Privacidad y Cookies en RESEO STUDIO
              </h4>
              <p className="text-[11px] text-[#A8A29E] leading-relaxed mt-1">
                Utilizamos cookies técnicas necesarias para el correcto funcionamiento del simulador y la
                atención en directo conforme al RGPD.{' '}
                <button
                  onClick={onOpenCookiesPolicy}
                  className="text-[#C27803] hover:underline font-semibold cursor-pointer"
                >
                  Ver Política de Cookies
                </button>
                .
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 pt-1">
            <button
              id="accept-all-cookies-btn"
              onClick={handleAcceptAll}
              className="flex-1 bg-[#C27803] hover:bg-[#A16207] text-white font-bold text-xs py-2.5 px-3 rounded-full transition-colors cursor-pointer text-center"
            >
              Aceptar todas
            </button>
            <button
              id="config-cookies-btn"
              onClick={() => setShowConfigModal(true)}
              className="bg-white/10 hover:bg-white/20 text-white font-semibold text-xs py-2.5 px-4 rounded-full transition-colors cursor-pointer"
            >
              Configurar
            </button>
          </div>
        </div>
      )}

      {/* Cookie Config Modal */}
      {showConfigModal && (
        <div
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setShowConfigModal(false)}
        >
          <div
            className="bg-white border border-[#E7E4DC] w-full max-w-md rounded-2xl shadow-2xl p-6 overflow-hidden animate-fade-in font-['DM_Sans',sans-serif]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-[#E7E4DC] mb-4">
              <h4 className="text-base font-bold text-[#141311] font-['Outfit',sans-serif] tracking-[-0.03em]">
                ⚙️ Configuración de Cookies
              </h4>
              <button
                onClick={() => setShowConfigModal(false)}
                className="text-[#78716C] hover:text-[#141311] text-lg font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 text-xs text-[#57534E] mb-6">
              <div className="flex items-start justify-between gap-3 p-3 bg-[#FAF9F6] border border-[#E7E4DC] rounded-xl">
                <div>
                  <p className="font-bold text-[#141311]">Cookies Técnicas (Obligatorias)</p>
                  <p className="text-[11px] text-[#78716C] mt-0.5">
                    Garantizan el funcionamiento del carrito, formulario de demo y seguridad web.
                  </p>
                </div>
                <input type="checkbox" checked disabled className="mt-1 cursor-not-allowed accent-[#C27803]" />
              </div>

              <div className="flex items-start justify-between gap-3 p-3 bg-[#FAF9F6] border border-[#E7E4DC] rounded-xl">
                <div>
                  <p className="font-bold text-[#141311]">Cookies Analíticas y Preferencias</p>
                  <p className="text-[11px] text-[#78716C] mt-0.5">
                    Permiten recordar tu configuración en el simulador NFC de forma anónima.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={allowAnalytics}
                  onChange={(e) => setAllowAnalytics(e.target.checked)}
                  className="mt-1 w-4 h-4 cursor-pointer accent-[#C27803]"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2">
              <button
                onClick={() => setShowConfigModal(false)}
                className="px-4 py-2 text-xs font-bold text-[#78716C] hover:text-[#141311] cursor-pointer"
              >
                Cancelar
              </button>
              <button
                onClick={handleSaveConfig}
                className="bg-[#C27803] hover:bg-[#A16207] text-white font-bold text-xs px-5 py-2.5 rounded-full transition-colors cursor-pointer"
              >
                Guardar preferencias
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
