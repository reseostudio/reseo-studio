import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  AlertTriangle,
  TrendingDown,
  TrendingUp,
  Star,
  CheckCircle2,
  XCircle,
  MapPin,
  Flame,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';

export const StaticReviewsTrap: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'comparativa' | 'simulador'>('comparativa');

  return (
    <section id="trampa-estatica" className="py-20 bg-[#0B0F17] border-t border-slate-800/80 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold uppercase tracking-wider mb-4">
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Sección 01 // Diagnóstico Algorítmico</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight leading-tight mb-6">
            La Trampa de las Estrellas Estáticas
          </h2>
          <p className="text-base sm:text-lg text-slate-300 leading-relaxed">
            Muchos dueños de negocio descansan pensando:{' '}
            <span className="italic text-slate-100 font-semibold">
              "Ya tengo 150 reseñas y 4.8 estrellas, soy el rey de mi zona"
            </span>
            . En 2026, esto es un error fatal. Para la IA de Google Maps, un negocio sin reseñas en
            los últimos 15 días es un negocio sospechoso de pérdida de calidad.
          </p>
        </div>

        {/* The Velocity Rule vs Static Stars */}
        <div className="bg-[#111827] border border-slate-800 rounded-3xl p-6 sm:p-8 mb-12 shadow-xl">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
            <div className="lg:col-span-2 space-y-4">
              <div className="inline-block bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-bold px-3 py-1 rounded-md uppercase">
                El Nuevo Factor Determinante: Velocidad Semanal
              </div>
              <h3 className="text-2xl font-bold text-white leading-snug">
                Google premia la aceleración y frescura, no el volumen fósil acumulado
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                Un competidor nuevo con solo <strong className="text-white">40 reseñas</strong> que recibe{' '}
                <strong className="text-emerald-400">4 reseñas cada semana</strong> superará
                sistemáticamente en el mapa a un local veterano con{' '}
                <strong className="text-slate-400">250 reseñas</strong> que lleva 2 meses sin recibir
                opiniones frescas. La IA interpreta la inactividad como abandono del estándar de
                servicio.
              </p>
            </div>

            <div className="bg-[#0B0F17] p-5 rounded-2xl border border-slate-800 text-center space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Fórmula Algorítmica 2026
              </span>
              <div className="text-xl font-extrabold text-blue-400 font-mono">
                Ranking = (Velocidad × Relevancia) + Frescura
              </div>
              <p className="text-[11px] text-slate-400">
                Las reseñas de más de 90 días pierden hasta un 70% de ponderación en las respuestas
                inmediatas de búsqueda local.
              </p>
            </div>
          </div>
        </div>

        {/* COMPARISON CARDS: El Negocio Estancado vs El Negocio con RESEO STUDIO */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Card 1: Negocio Estancado */}
          <div
            id="negocio-estancado-card"
            className="bg-[#111827]/70 border-2 border-red-900/40 rounded-3xl p-6 sm:p-8 relative overflow-hidden flex flex-col justify-between"
          >
            <div className="absolute top-0 right-0 bg-red-600 text-white text-[11px] font-black uppercase px-4 py-1.5 rounded-bl-2xl tracking-wider">
              En Peligro de Desaparición
            </div>

            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-400">
                  <TrendingDown className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-extrabold text-white">El Negocio Estancado</h3>
                  <p className="text-xs text-red-400 font-semibold">
                    Confianza pasiva en reseñas antiguas
                  </p>
                </div>
              </div>

              {/* Simulated Google Listing Card Stagnant */}
              <div className="bg-[#0B0F17] rounded-2xl p-4 border border-slate-800 mb-6 space-y-3 opacity-90">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-bold text-white text-sm">Tu Local Clásico</h4>
                    <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                      <span className="text-amber-400 font-bold">4.7</span>
                      <span className="text-amber-400">★★★★★</span>
                      <span>(185 reseñas)</span>
                    </p>
                  </div>
                  <span className="text-[10px] bg-red-950 text-red-400 px-2 py-0.5 rounded border border-red-800/40 font-bold">
                    Posición #14 (Página 2)
                  </span>
                </div>

                <div className="text-[11px] text-slate-400 bg-slate-900/60 p-2.5 rounded-lg border border-slate-800 flex items-center gap-2">
                  <span className="text-red-400 font-bold">⚠️ Última reseña:</span> Hace 4 semanas
                  ("Buena comida")
                </div>
              </div>

              {/* Symptom Checklist */}
              <ul className="space-y-3 text-sm text-slate-300">
                <li className="flex items-start gap-2.5">
                  <XCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                  <span>
                    <strong className="text-white">Dormancia Algorítmica:</strong> Al pasar 2
                    semanas sin entradas, la IA deja de indexarlo en 'Búsquedas de Alta Intención'.
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <XCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                  <span>
                    <strong className="text-white">Reseñas Vacías:</strong> Textos monosilábicos
                    ("Muy bien", "OK") que no alimentan a los robots semánticos de Google.
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <XCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                  <span>
                    <strong className="text-white">Pérdida Silenciosa:</strong> El 78% de clientes
                    en tu zona termina yendo a los 3 primeros locales que aparecen en Maps.
                  </span>
                </li>
              </ul>
            </div>

            <div className="mt-8 pt-4 border-t border-slate-800/80 text-xs text-red-400/90 font-medium">
              Resultado: Cada mes recibe menos llamadas, reservas y rutas hacia el local.
            </div>
          </div>

          {/* Card 2: Negocio con RESEO STUDIO */}
          <div
            id="negocio-reseo-card"
            className="bg-gradient-to-b from-[#111827] to-[#0D1527] border-2 border-emerald-500/50 rounded-3xl p-6 sm:p-8 relative overflow-hidden flex flex-col justify-between shadow-2xl shadow-emerald-950/20"
          >
            <div className="absolute top-0 right-0 bg-emerald-500 text-slate-950 text-[11px] font-black uppercase px-4 py-1.5 rounded-bl-2xl tracking-wider shadow-md">
              Líder Top 3 Local
            </div>

            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                  <TrendingUp className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-extrabold text-white">El Negocio con RESEO STUDIO</h3>
                  <p className="text-xs text-emerald-400 font-semibold">
                    Ecosistema NFC de flujo semanal constante
                  </p>
                </div>
              </div>

              {/* Simulated Google Listing Card Dominant */}
              <div className="bg-[#0B0F17] rounded-2xl p-4 border border-emerald-500/30 mb-6 space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h4 className="font-bold text-white text-sm">Tu Negocio Líder</h4>
                      <span className="bg-blue-600 text-white text-[9px] font-bold px-1.5 py-0.2 rounded">
                        Top 1
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 flex items-center gap-1 mt-0.5">
                      <span className="text-amber-400 font-bold">4.9</span>
                      <span className="text-amber-400">★★★★★</span>
                      <span className="text-emerald-400 font-semibold">(248 reseñas · +4 esta semana)</span>
                    </p>
                  </div>
                  <span className="text-[10px] bg-emerald-950 text-emerald-300 px-2 py-0.5 rounded border border-emerald-700/50 font-bold flex items-center gap-1">
                    <Flame className="w-3 h-3 text-amber-400 fill-amber-400" />
                    Top 3 Maps Pack
                  </span>
                </div>

                <div className="text-[11px] text-emerald-300 bg-emerald-950/40 p-2.5 rounded-lg border border-emerald-800/40 flex items-center gap-2">
                  <span className="text-amber-400 font-bold">★ Justificación Semántica:</span>
                  "Mencionado frecuentemente por clientes: servicio rápido, comida exquisita y trato de 10"
                </div>
              </div>

              {/* Advantage Checklist */}
              <ul className="space-y-3 text-sm text-slate-300">
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  <span>
                    <strong className="text-white">Velocidad Constante:</strong> 3 a 5 reseñas reales
                    cada semana captadas en el segundo exacto del halago.
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  <span>
                    <strong className="text-white">Justificaciones Semánticas:</strong> Opiniones
                    ricas en palabras clave que activan fragmentos destacados en Google Maps.
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  <span>
                    <strong className="text-white">Monopolio de Clientes:</strong> Absorbe el flujo
                    masivo de nuevos clientes que buscan "cerca de mí" en su móvil.
                  </span>
                </li>
              </ul>
            </div>

            <div className="mt-8 pt-4 border-t border-slate-800/80 text-xs text-emerald-400 font-semibold flex items-center justify-between">
              <span>Resultado: Visibilidad x3 y flujo continuo de nuevos clientes.</span>
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
