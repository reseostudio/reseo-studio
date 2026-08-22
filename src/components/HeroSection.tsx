import React from 'react';
import { motion } from 'motion/react';
import { ProductVisualDisplay } from './ProductVisualDisplay';
import {
  ShieldAlert,
  Clock,
  TrendingUp,
  Zap,
  CheckCircle,
  MessageCircle,
  Play,
  ArrowDown,
  Sparkles,
  MapPin,
} from 'lucide-react';

interface HeroSectionProps {
  onOpenVideoModal?: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onOpenVideoModal }) => {
  const whatsappUrl =
    'https://wa.me/34686478561?text=Hola,%20he%20visto%20el%20informe%20de%20RESEO%20STUDIO%20y%20quiero%20información%20para%20mi%20negocio';

  return (
    <section className="relative pt-28 pb-20 md:pt-36 md:pb-28 overflow-hidden">
      {/* Ambient background glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-blue-600/15 via-emerald-500/10 to-amber-500/10 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-10 left-10 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* Grid line subtle backdrop */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f293715_1px,transparent_1px),linear-gradient(to_bottom,#1f293715_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Confidential Tag */}
        <div className="flex justify-center mb-6">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-950/60 border border-red-800/60 text-red-400 text-xs md:text-sm font-bold tracking-wide shadow-lg shadow-red-950/50"
          >
            <ShieldAlert className="w-4 h-4 text-red-400 shrink-0 animate-pulse" />
            <span>⚠️ INFORME TÉCNICO CONFIDENCIAL // ALGORITMO GOOGLE MAPS 2026</span>
          </motion.div>
        </div>

        {/* Main Title & Subtitle Grid */}
        <div className="text-center max-w-5xl mx-auto mb-12 md:mb-16">
          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.12] mb-6"
          >
            Por qué las 200 reseñas acumuladas del pasado están{' '}
            <span className="relative inline-block text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-rose-400 to-amber-400">
              MATANDO
            </span>{' '}
            la visibilidad de tu negocio local{' '}
            <span className="text-slate-300 font-extrabold text-2xl sm:text-3xl md:text-4xl block mt-2">
              (y cómo el nuevo Algoritmo de IA de Google favorece a tu competencia)
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg md:text-xl text-slate-300 font-normal leading-relaxed max-w-3xl mx-auto"
          >
            El análisis definitivo sobre la{' '}
            <span className="text-white font-semibold underline decoration-blue-500 decoration-2 underline-offset-4">
              'Caducidad de la Confianza'
            </span>
            , la{' '}
            <span className="text-white font-semibold underline decoration-red-500 decoration-2 underline-offset-4">
              Dormancia Algorítmica
            </span>{' '}
            y el ecosistema físico de captación de{' '}
            <span className="text-emerald-400 font-bold">3 segundos</span> en mostrador y sala.
          </motion.p>
        </div>

        {/* High Impact Metrics Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-14"
        >
          {/* Metric 1 */}
          <div
            id="metric-90dias"
            className="group relative bg-[#111827]/80 hover:bg-[#151e33] border border-slate-800 hover:border-blue-500/50 rounded-2xl p-6 transition-all duration-300 shadow-xl"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-3xl sm:text-4xl font-black text-blue-400 font-mono tracking-tight">
                90 Días
              </span>
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                <Clock className="w-5 h-5" />
              </div>
            </div>
            <h4 className="text-sm font-bold text-white mb-1">Caducidad de Confianza</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Google degrada opiniones antiguas en sus motores de IA si no hay flujo reciente.
            </p>
          </div>

          {/* Metric 2 */}
          <div
            id="metric-34porciento"
            className="group relative bg-[#111827]/80 hover:bg-[#151e33] border border-slate-800 hover:border-amber-500/50 rounded-2xl p-6 transition-all duration-300 shadow-xl"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-3xl sm:text-4xl font-black text-amber-400 font-mono tracking-tight">
                34%
              </span>
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                <TrendingUp className="w-5 h-5" />
              </div>
            </div>
            <h4 className="text-sm font-bold text-white mb-1">Peso en Motores de IA</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Ponderación directa en las respuestas de Ask Maps y AI Overviews en tiempo real.
            </p>
          </div>

          {/* Metric 3 */}
          <div
            id="metric-3segundos"
            className="group relative bg-[#111827]/80 hover:bg-[#151e33] border border-slate-800 hover:border-emerald-500/50 rounded-2xl p-6 transition-all duration-300 shadow-xl"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-3xl sm:text-4xl font-black text-emerald-400 font-mono tracking-tight">
                3 Segundos
              </span>
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                <Zap className="w-5 h-5" />
              </div>
            </div>
            <h4 className="text-sm font-bold text-white mb-1">Captación NFC sin Fricción</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Sin abrir cámaras, sin descargar aplicaciones ni escanear códigos complejos.
            </p>
          </div>

          {/* Metric 4 */}
          <div
            id="metric-100porciento"
            className="group relative bg-[#111827]/80 hover:bg-[#151e33] border border-slate-800 hover:border-emerald-500/50 rounded-2xl p-6 transition-all duration-300 shadow-xl"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-3xl sm:text-4xl font-black text-emerald-400 font-mono tracking-tight">
                100%
              </span>
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                <CheckCircle className="w-5 h-5" />
              </div>
            </div>
            <h4 className="text-sm font-bold text-white mb-1">Cumplimiento Google</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Dispositivo propio del cliente. Cero riesgo de penalización o borrado de filtros.
            </p>
          </div>
        </motion.div>

        {/* Hero Interactive Showcase & Dual CTAs */}
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12 bg-gradient-to-b from-[#111827] to-[#0D131F] border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl relative overflow-hidden">
          {/* Subtle badge top */}
          <div className="absolute top-4 left-6 flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
            <span className="w-2 h-2 rounded-full bg-blue-500"></span>
            <span>Ecosistema de Captación Física RESEO STUDIO</span>
          </div>

          <div className="flex-1 space-y-6 pt-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Tecnología NFC de Grado Comercial</span>
            </div>

            <h3 className="text-2xl sm:text-3xl font-extrabold text-white leading-tight">
              Transforma la satisfacción inmediata de tus clientes en el combustible que Google
              necesita para ponerte en el Top 3.
            </h3>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              El cliente solo apoya la parte trasera de su móvil contra el expositor de mostrador o
              la tarjeta del personal y se le abre directamente la pantalla de 5 estrellas en Google
              Maps. <strong className="text-white">Sin pasos intermedios.</strong>
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
              <a
                id="hero-whatsapp-cta"
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-3 px-6 py-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-sm uppercase tracking-wider transition-all duration-200 shadow-xl shadow-emerald-950/50 hover:shadow-emerald-700/50 hover:-translate-y-0.5"
              >
                <MessageCircle className="w-5 h-5 fill-white" />
                <span>Solicitar Kits por WhatsApp</span>
              </a>

              <button
                id="hero-demo-video-btn"
                onClick={onOpenVideoModal}
                className="inline-flex items-center justify-center gap-2.5 px-6 py-4 rounded-xl bg-[#1E293B] hover:bg-slate-700 text-white font-bold text-sm border border-slate-700 transition-colors"
              >
                <Play className="w-4 h-4 text-blue-400 fill-blue-400" />
                <span>Ver Demostración en Video</span>
              </button>
            </div>

            <div className="flex items-center gap-4 text-xs text-slate-400 pt-1">
              <span className="flex items-center gap-1 text-slate-300">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-400" /> Sin cuotas mensuales
              </span>
              <span className="flex items-center gap-1 text-slate-300">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-400" /> Configurado en 2 minutos
              </span>
              <span className="flex items-center gap-1 text-slate-300">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-400" /> Garantía 14 días
              </span>
            </div>
          </div>

          {/* Right Column: Physical Visual Model with Interactive Tap */}
          <div className="w-full lg:w-auto flex-shrink-0 flex justify-center pt-4 lg:pt-0">
            <ProductVisualDisplay type="expositor" />
          </div>
        </div>

        {/* Scroll anchor hint */}
        <div className="flex justify-center mt-12">
          <a
            href="#trampa-estatica"
            className="inline-flex flex-col items-center text-xs font-semibold text-slate-500 hover:text-slate-300 transition-colors gap-2"
          >
            <span>Descubre la anatomía del nuevo algoritmo</span>
            <ArrowDown className="w-4 h-4 animate-bounce text-blue-400" />
          </a>
        </div>
      </div>
    </section>
  );
};
