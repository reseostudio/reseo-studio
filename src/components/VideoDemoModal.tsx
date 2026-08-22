import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Smartphone,
  CheckCircle,
  Zap,
  Star,
  MessageCircle,
  Play,
  RotateCcw,
  Sparkles,
} from 'lucide-react';

interface VideoDemoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const VideoDemoModal: React.FC<VideoDemoModalProps> = ({ isOpen, onClose }) => {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);

  if (!isOpen) return null;

  const whatsappUrl =
    'https://wa.me/34686478561?text=Hola,%20he%20visto%20la%20demostración%20de%20RESEO%20STUDIO%20y%20quiero%20información%20para%20mi%20negocio';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        className="bg-[#111827] border-2 border-blue-500/50 rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl relative text-white overflow-hidden"
      >
        {/* Close Button */}
        <button
          id="close-video-modal-btn"
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors z-20"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="mb-6">
          <div className="inline-flex items-center gap-2 text-xs font-bold text-blue-400 uppercase tracking-wider mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Demostración de Captación en 3 Segundos</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-white">
            Cómo Funciona el Ecosistema en tu Negocio
          </h3>
        </div>

        {/* Video / Interactive Simulation Screen */}
        <div className="bg-[#0B0F17] rounded-2xl border border-slate-800 p-6 relative min-h-[280px] flex flex-col items-center justify-center text-center overflow-hidden mb-6">
          {/* Step 1: Halago del cliente */}
          {currentStep === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-4 max-w-md"
            >
              <div className="w-16 h-16 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 mx-auto text-2xl">
                💬
              </div>
              <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
                Paso 1 // Momento Clave del Halago
              </span>
              <h4 className="text-lg font-bold text-white">
                "¡Todo delicioso, muchas gracias por la atención!"
              </h4>
              <p className="text-xs text-slate-300">
                El cliente expresa satisfacción genuina al pedir la cuenta, levantarse del sillón o
                recoger su servicio.
              </p>
            </motion.div>
          )}

          {/* Step 2: Toque NFC en 3 segundos */}
          {currentStep === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-4 max-w-md"
            >
              <div className="w-16 h-16 rounded-full bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400 mx-auto animate-pulse">
                <Smartphone className="w-8 h-8" />
              </div>
              <span className="text-xs font-bold uppercase tracking-wider text-blue-400">
                Paso 2 // Toque Físico Inmediato (0.8s)
              </span>
              <h4 className="text-lg font-bold text-white">
                El empleado acerca la tarjeta o señala el expositor
              </h4>
              <p className="text-xs text-slate-300">
                El cliente apoya su móvil durante 1 segundo. El chip NFC emite la señal oficial y su
                teléfono abre Google Maps al instante.
              </p>
            </motion.div>
          )}

          {/* Step 3: Reseña 5 Estrellas Publicada */}
          {currentStep === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-4 max-w-md"
            >
              <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mx-auto text-2xl">
                <CheckCircle className="w-8 h-8 text-emerald-400" />
              </div>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                Paso 3 // Publicación Semántica & Señal a Google
              </span>
              <div className="flex items-center justify-center gap-1 text-amber-400 text-lg">
                <span>★</span>
                <span>★</span>
                <span>★</span>
                <span>★</span>
                <span>★</span>
              </div>
              <h4 className="text-base font-bold text-white">
                "Servicio impecable y rápido. Volveré seguro."
              </h4>
              <p className="text-xs text-emerald-400 font-semibold">
                Google detecta la nueva reseña fresca y eleva la posición de tu negocio.
              </p>
            </motion.div>
          )}
        </div>

        {/* Step Progress Controllers */}
        <div className="flex items-center justify-between gap-4 mb-6">
          <div className="flex gap-2">
            {[1, 2, 3].map((step) => (
              <button
                key={step}
                onClick={() => setCurrentStep(step)}
                className={`h-2.5 rounded-full transition-all ${
                  currentStep === step ? 'w-8 bg-blue-500' : 'w-2.5 bg-slate-700 hover:bg-slate-600'
                }`}
              />
            ))}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentStep(currentStep === 3 ? 1 : currentStep + 1)}
              className="text-xs text-slate-300 hover:text-white flex items-center gap-1 font-bold bg-slate-800 px-3 py-1.5 rounded-lg"
            >
              <span>{currentStep === 3 ? 'Reiniciar' : 'Siguiente Paso'}</span>
              <RotateCcw className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Direct Action WhatsApp in Modal */}
        <div className="pt-2">
          <a
            id="modal-whatsapp-cta-btn"
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-4 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/50"
          >
            <MessageCircle className="w-4 h-4 fill-white" />
            <span>Pedir Video de Demostración Propio por WhatsApp (+34 686 47 85 61)</span>
          </a>
        </div>
      </motion.div>
    </div>
  );
};
