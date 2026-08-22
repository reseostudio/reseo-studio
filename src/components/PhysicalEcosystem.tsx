import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ProductVisualDisplay } from './ProductVisualDisplay';
import {
  Layers,
  Sparkles,
  Zap,
  CreditCard,
  Store,
  Users,
  CheckCircle2,
  TrendingUp,
  Award,
  ArrowRight,
  Flame,
  Palette,
  Image as ImageIcon,
  Check,
  Building,
} from 'lucide-react';

export const PhysicalEcosystem: React.FC = () => {
  const [selectedProduct, setSelectedProduct] = useState<'expositor' | 'tarjeta'>('tarjeta');
  const [activeCardView, setActiveCardView] = useState<'3d' | 'real'>('real');

  return (
    <section id="ecosistema-nfc" className="py-20 bg-[#0B0F17] border-t border-slate-800 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-4">
            <Layers className="w-3.5 h-3.5" />
            <span>Sección 05 // Hardware Físico de Captación</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight leading-tight mb-6">
            El Ecosistema Físico de RESEO STUDIO
          </h2>
          <p className="text-base sm:text-lg text-slate-300 leading-relaxed">
            Dos formatos complementarios diseñados para interceptar la emoción positiva del cliente
            en el momento exacto y canalizarla en 3 segundos a tu ficha de Google Maps.
          </p>
        </div>

        {/* Interactive Tab Selector for Products */}
        <div className="flex justify-center mb-12">
          <div className="bg-[#111827] p-1.5 rounded-2xl border border-slate-800 inline-flex gap-2 max-w-md w-full">
            <button
              id="tab-tarjeta-personal"
              onClick={() => setSelectedProduct('tarjeta')}
              className={`flex-1 py-3 px-4 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                selectedProduct === 'tarjeta'
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/40'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <CreditCard className="w-4 h-4" />
              <span>Tarjetas para Personal</span>
              <span className="hidden sm:inline-block bg-amber-400 text-slate-950 text-[10px] px-1.5 py-0.2 rounded font-black">
                x3 Conversión
              </span>
            </button>

            <button
              id="tab-expositor-mostrador"
              onClick={() => setSelectedProduct('expositor')}
              className={`flex-1 py-3 px-4 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                selectedProduct === 'expositor'
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/40'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Store className="w-4 h-4" />
              <span>Expositor Mostrador</span>
            </button>
          </div>
        </div>

        {/* Dynamic Product Showcase Card */}
        <div className="bg-[#111827] border-2 border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl relative overflow-hidden mb-16">
          <AnimatePresence mode="wait">
            {selectedProduct === 'tarjeta' ? (
              <motion.div
                key="tarjeta-content"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
                className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center"
              >
                {/* Left text & secret weapon explanation */}
                <div className="lg:col-span-7 space-y-6">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold uppercase tracking-wider">
                    <Flame className="w-4 h-4 fill-amber-400 text-amber-400" />
                    <span>El Arma Secreta de Máxima Conversión</span>
                  </div>

                  <h3 className="text-2xl sm:text-3xl font-black text-white leading-tight">
                    Tarjetas NFC de Bolsillo para el Personal: Captación en el Clímax de Satisfacción
                  </h3>

                  <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                    Los camareros en la mesa, dentistas e higienistas en el sillón clínico,
                    estilistas frente al espejo o mecánicos al entregar la llave llevan la tarjeta en
                    el bolsillo o acreditación. Justo cuando el cliente pronuncia el halago:{' '}
                    <strong className="text-white">
                      "¡Muchísimas gracias, me ha encantado!"
                    </strong>
                    , el empleado saca la tarjeta con una sonrisa y dice:
                  </p>

                  {/* Verbal Script Quote Box */}
                  <div className="bg-[#0B0F17] p-4 rounded-2xl border-l-4 border-l-amber-500 border-y border-r border-slate-800 text-slate-200 text-sm italic">
                    "Me alegro muchísimo. ¿Me harías el favor de apoyar 2 segundos tu móvil aquí para
                    dejarnos una reseña? Me ayuda directamente a mí y a todo el equipo."
                  </div>

                  {/* Multiplier stats */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                    <div className="bg-[#0B0F17] p-4 rounded-xl border border-slate-800">
                      <span className="text-2xl font-black text-emerald-400">58%</span>
                      <p className="text-xs text-slate-300 font-semibold mt-1">
                        Tasa de conversión en mesa / sillón
                      </p>
                      <p className="text-[11px] text-slate-500">Frente al 15% esperando en caja.</p>
                    </div>

                    <div className="bg-[#0B0F17] p-4 rounded-xl border border-slate-800">
                      <span className="text-2xl font-black text-blue-400">3x Más Reseñas</span>
                      <p className="text-xs text-slate-300 font-semibold mt-1">
                        Opiniones más largas y emotivas
                      </p>
                      <p className="text-[11px] text-slate-500">Mencionan el nombre del empleado.</p>
                    </div>
                  </div>

                  <ul className="space-y-2 text-xs sm:text-sm text-slate-300">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>Formato tarjeta de crédito ultrarresistente e impermeable.</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>Chip NFC NTAG industrial sin baterías con garantía de por vida.</span>
                    </li>
                  </ul>
                </div>

                {/* Right Visual Model with Real Photo Toggle */}
                <div className="lg:col-span-5 flex flex-col items-center justify-center space-y-4">
                  {/* View Selector Buttons */}
                  <div className="flex items-center gap-2 bg-[#0B0F17] p-1 rounded-xl border border-slate-800 text-xs font-bold">
                    <button
                      onClick={() => setActiveCardView('real')}
                      className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer ${
                        activeCardView === 'real'
                          ? 'bg-[#C27803] text-white shadow'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      <ImageIcon className="w-3.5 h-3.5" />
                      <span>Fotografía Real</span>
                    </button>
                    <button
                      onClick={() => setActiveCardView('3d')}
                      className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer ${
                        activeCardView === '3d'
                          ? 'bg-[#C27803] text-white shadow'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Simulador Interactivo</span>
                    </button>
                  </div>

                  {activeCardView === 'real' ? (
                    <div className="w-full max-w-sm rounded-2xl overflow-hidden border-2 border-slate-700 shadow-2xl group relative">
                      <img
                        src="/images/tarjeta_nfc_personal.jpg"
                        alt="Tarjeta NFC para Personal RESEO STUDIO"
                        className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent flex items-end p-4">
                        <div className="text-white text-xs font-bold flex items-center gap-2">
                          <Check className="w-4 h-4 text-emerald-400" />
                          <span>Acabado mate premium e impresión HD de alta durabilidad</span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <ProductVisualDisplay type="tarjeta" />
                  )}
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="expositor-content"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
                className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center"
              >
                {/* Left text & Stand features */}
                <div className="lg:col-span-7 space-y-6">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-bold uppercase tracking-wider">
                    <Store className="w-4 h-4 text-blue-400" />
                    <span>Punto Fijo de Pago y Mostrador</span>
                  </div>

                  <h3 className="text-2xl sm:text-3xl font-black text-white leading-tight">
                    Expositor Acrílico Inclinado de Alta Visibilidad para Caja y Recepción
                  </h3>

                  <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                    Diseñado en metacrilato blanco de alta pureza con acabado brillante. Se coloca
                    junto al datáfono de cobro o en el mostrador de bienvenida para que el cliente,
                    mientras espera su ticket o factura, apoye su smartphone de manera natural y sin
                    esfuerzo.
                  </p>

                  <div className="space-y-3">
                    <div className="bg-[#0B0F17] p-4 rounded-xl border border-slate-800 flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                      <div>
                        <h4 className="text-sm font-bold text-white">Diseño Visual Imán</h4>
                        <p className="text-xs text-slate-400 mt-0.5">
                          Gráficos optimizados psicológicamente con los colores oficiales de Google y
                          el distintivo de 5 estrellas para maximizar la curiosidad táctil.
                        </p>
                      </div>
                    </div>

                    <div className="bg-[#0B0F17] p-4 rounded-xl border border-slate-800 flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                      <div>
                        <h4 className="text-sm font-bold text-white">Inclinación Ergonómica</h4>
                        <p className="text-xs text-slate-400 mt-0.5">
                          Ángulo perfecto de 75 grados para lectura visual y acercamiento cómodo del
                          móvil desde cualquier altura de mostrador.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Visual Model */}
                <div className="lg:col-span-5 flex flex-col items-center justify-center">
                  <ProductVisualDisplay type="expositor" />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* NUEVA SECCIÓN DESTACADA: PERSONALIZACIÓN CORPORATIVA A MEDIDA */}
        <div className="bg-gradient-to-r from-slate-900 via-[#131B2E] to-slate-900 border-2 border-amber-500/30 rounded-3xl p-8 sm:p-12 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 -mt-12 -mr-12 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
            <div className="lg:col-span-7 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/10 border border-amber-400/30 text-amber-400 text-xs font-bold uppercase tracking-wider">
                <Palette className="w-4 h-4" />
                <span>100% Personalizado para Tu Marca</span>
              </div>

              <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight leading-tight">
                Expositores y Tarjetas Adaptados a la Identidad de Tu Negocio
              </h3>

              <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                No entregamos material genérico. Tanto el <strong className="text-white">expositor acrílico de mostrador</strong> como las <strong className="text-white">tarjetas NFC del personal</strong> se imprimen de forma totalmente personalizada con tu logotipo corporativo, tu tipografía y los colores distintivos de tu empresa.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="bg-[#0B0F17]/80 p-4 rounded-xl border border-slate-800 flex items-start gap-3">
                  <Building className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-bold text-white">Tu Logotipo en HD</h4>
                    <p className="text-xs text-slate-400 mt-1">Impresión UV de alta resolución resistente a rozaduras y limpieza diaria.</p>
                  </div>
                </div>

                <div className="bg-[#0B0F17]/80 p-4 rounded-xl border border-slate-800 flex items-start gap-3">
                  <Palette className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-bold text-white">Colores de Marca</h4>
                    <p className="text-xs text-slate-400 mt-1">Gama cromática adaptada fielmente a tu manual de identidad gráfica.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 bg-[#0B0F17] p-6 rounded-2xl border border-slate-800 space-y-4">
              <h4 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2 border-b border-slate-800 pb-3">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>¿Qué Incluye la Personalización?</span>
              </h4>
              <ul className="space-y-3 text-xs sm:text-sm text-slate-300">
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Logotipo y nombre de empresa impresos en el frontal.</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Mensaje de llamada a la acción adaptado a tu sector.</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Chip NFC precodificado con el enlace exacto a tu ficha de Google.</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Código QR de respaldo integrado en la parte posterior.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

