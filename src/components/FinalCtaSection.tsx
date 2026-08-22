import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ReseoLogo } from './ReseoLogo';
import {
  MessageCircle,
  Play,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  ShieldCheck,
  Zap,
  Phone,
  Mail,
  MapPin,
  ExternalLink,
  CheckCircle2,
} from 'lucide-react';

interface FinalCtaProps {
  onOpenVideoModal: () => void;
}

export const FinalCtaSection: React.FC<FinalCtaProps> = ({ onOpenVideoModal }) => {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const whatsappUrl =
    'https://wa.me/34686478561?text=Hola,%20he%20visto%20el%20informe%20de%20RESEO%20STUDIO%20y%20quiero%20información%20para%20mi%20negocio';

  const faqs = [
    {
      q: '¿Funciona con cualquier teléfono móvil (iPhone y Android)?',
      a: 'Sí, es 100% compatible. Todos los iPhone a partir de iPhone Xs/11/12/13/14/15/16 tienen NFC activo por defecto sin pulsar nada. En Android, más del 95% de los teléfonos modernos lo leen al instante con solo acercarlo.',
    },
    {
      q: '¿Mis clientes necesitan descargar alguna aplicación o registrarse?',
      a: 'Absolutamente no. El chip NFC envía una orden nativa al sistema operativo del cliente para abrir directamente la app de Google Maps con la ficha de tu negocio y la ventana de 5 estrellas lista. Cero registros, cero descargas.',
    },
    {
      q: '¿Cómo se configura para mi ficha de negocio?',
      a: 'Nosotros nos encargamos de todo antes de enviártelo. Solo nos facilitas el nombre de tu empresa en Google Maps y nosotros grabamos y bloqueamos el chip NFC con tu enlace directo oficial anti-spam. Cuando te llegue a la puerta, solo tienes que sacarlo de la caja y colocarlo en el mostrador.',
    },
    {
      q: '¿Hay alguna cuota mensual o coste recurrente?',
      a: 'No. Es un pago único de por vida. No hay suscripciones, ni software de pago, ni renovaciones. El hardware es tuyo para siempre.',
    },
    {
      q: '¿Qué ocurre con la Garantía de 14 días si no consigo reseñas?',
      a: 'Nuestra garantía es 100% incondicional. Si durante las dos primeras semanas no consigues al menos 7 reseñas reales nuevas, nos escribes un WhatsApp y te reembolsamos el total de tu pedido de forma inmediata.',
    },
  ];

  return (
    <section className="py-20 bg-[#0E1422] border-t border-slate-800 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* BIG GIANT CTA BOX */}
        <div
          id="cta-final-box"
          className="bg-gradient-to-b from-[#152238] to-[#0D1525] border-2 border-blue-500/60 rounded-3xl p-8 sm:p-14 shadow-2xl relative overflow-hidden text-center max-w-4xl mx-auto mb-20"
        >
          {/* Ambient Glows */}
          <div className="absolute -top-24 -left-24 w-72 h-72 bg-blue-600/30 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold uppercase tracking-wider">
              <Zap className="w-4 h-4" />
              <span>Paso Inmediato // Atención Directa</span>
            </div>

            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight leading-tight max-w-2xl mx-auto">
              Comprueba el Sistema en Vivo y Activa el Algoritmo de tu Negocio
            </h2>

            <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
              Escríbenos directamente por WhatsApp para ver una demostración en video personalizada
              o encargar tus kits listos para funcionar esta misma semana.
            </p>

            {/* Giant WhatsApp Button */}
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                id="final-whatsapp-button-giant"
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-base uppercase tracking-wider transition-all duration-300 shadow-2xl shadow-emerald-950/80 hover:shadow-emerald-600/50 hover:scale-105"
              >
                <MessageCircle className="w-6 h-6 fill-white" />
                <span>Hablar por WhatsApp (+34 686 47 85 61)</span>
              </a>

              <button
                id="btn-ver-demo-video"
                onClick={onOpenVideoModal}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-5 rounded-2xl bg-[#1E293B] hover:bg-slate-700 text-white font-bold text-sm border border-slate-700 transition-colors"
              >
                <Play className="w-4 h-4 text-blue-400 fill-blue-400" />
                <span>Ver Video Demostración</span>
              </button>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-slate-400 pt-3">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Respuesta en menos de 15 min
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Envío rápido a toda España
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Asesoramiento incluido
              </span>
            </div>
          </div>
        </div>

        {/* FAQ ACCORDION SECTION */}
        <div className="max-w-3xl mx-auto mb-20">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800 text-slate-300 text-xs font-bold uppercase tracking-wider mb-2">
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Dudas Frecuentes</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
              Preguntas Técnicas Respondidas
            </h3>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => {
              const isOpen = openFaq === index;
              return (
                <div
                  key={index}
                  className="bg-[#111827] border border-slate-800 rounded-2xl overflow-hidden transition-colors"
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : index)}
                    className="w-full p-5 text-left flex items-center justify-between gap-4 text-white font-bold text-sm sm:text-base hover:text-blue-400 transition-colors"
                  >
                    <span>{faq.q}</span>
                    {isOpen ? (
                      <ChevronUp className="w-5 h-5 text-blue-400 shrink-0" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-slate-400 shrink-0" />
                    )}
                  </button>
                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-slate-300 leading-relaxed border-t border-slate-800/60">
                          {faq.a}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>

        {/* FOOTER */}
        <footer className="pt-10 border-t border-slate-800/80 flex flex-col md:flex-row items-center justify-between gap-6 text-xs text-slate-400">
          <div className="flex items-center gap-3">
            <ReseoLogo size="sm" />
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6">
            <span>Soporte Oficial: +34 686 47 85 61</span>
            <span>Algoritmo Google Maps 2026</span>
            <span>Garantía de Satisfacción 100%</span>
          </div>

          <p className="text-slate-500 text-[11px]">
            © {new Date().getFullYear()} RESEO STUDIO. Todos los derechos reservados.
          </p>
        </footer>
      </div>
    </section>
  );
};
