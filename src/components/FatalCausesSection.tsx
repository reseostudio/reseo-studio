import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  Skull,
  Activity,
  FileText,
  Cpu,
  HelpCircle,
  CheckCircle,
  AlertCircle,
  MessageSquare,
  Sparkles,
  ArrowRight,
} from 'lucide-react';

export const FatalCausesSection: React.FC = () => {
  const [selectedExample, setSelectedExample] = useState<'restaurante' | 'clinica' | 'peluqueria'>('restaurante');

  const examples = {
    restaurante: {
      sector: 'Restaurante / Cafetería',
      emptyReview: '5 estrellas, buena comida y camareros simpáticos.',
      emptyImpact: 'Impacto SEO: Cero. No asocia platos, palabras clave de alta intención ni experiencia específica.',
      richReview: '¡La mejor paella de marisco de la zona! Arroz al punto exacto, raciones abundantes y nos atendieron en terraza rapidísimo. Muy recomendable.',
      richImpact: 'Impacto SEO: Posiciona en "mejor paella", "arroz al punto", "terraza rápida" y activa Justificación Semántica en Google Maps.',
      keywordBadge: 'Paella de marisco · Terraza rápida · Raciones abundantes',
    },
    clinica: {
      sector: 'Clínica Dental / Salud',
      emptyReview: 'Muy amables todos, 5 estrellas.',
      emptyImpact: 'Impacto SEO: Mínimo. Google no detecta especialidad, tratamiento ni seguridad para futuros pacientes.',
      richReview: 'Me hice una limpieza y colocación de implante sin nada de dolor. La doctora explicó cada paso con mucha calma y el precio fue muy transparente. Mi clínica de confianza.',
      richImpact: 'Impacto SEO: Indexa en "implante sin dolor", "doctora con calma", "precio transparente" y eleva la tasa de conversión un 40%.',
      keywordBadge: 'Implante sin dolor · Precio transparente · Limpieza dental',
    },
    peluqueria: {
      sector: 'Estética / Peluquería / Taller',
      emptyReview: 'Buen corte de pelo, volveré.',
      emptyImpact: 'Impacto SEO: Genérico. No destaca técnicas modernas ni servicios de ticket alto.',
      richReview: 'Me hicieron un balayage y tratamiento de hidratación que me dejó el pelo brillante y súper natural. El estilista escuchó exactamente lo que quería.',
      richImpact: 'Impacto SEO: Domina las búsquedas de "balayage natural", "tratamiento hidratación" y capta clientes de alto valor.',
      keywordBadge: 'Balayage natural · Tratamiento hidratación · Estilista profesional',
    },
  };

  return (
    <section id="causas-caida" className="py-20 bg-[#0E1422] border-t border-slate-800 relative overflow-hidden">
      {/* Background accents */}
      <div className="absolute top-1/2 right-0 w-96 h-96 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Title */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-bold uppercase tracking-wider mb-4">
            <Skull className="w-3.5 h-3.5" />
            <span>Sección 02 // Auditoría de Vulnerabilidades</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight leading-tight mb-6">
            Las 3 Causas Mortales de la Caída en Maps
          </h2>
          <p className="text-base sm:text-lg text-slate-300 leading-relaxed">
            La mayoría de negocios locales pierden entre un 40% y un 70% de clientes potenciales sin
            saber que están siendo penalizados por estos tres factores invisibles:
          </p>
        </div>

        {/* The 3 Fatal Causes Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 mb-16">
          {/* Causa 1: Dormancia Algorítmica */}
          <div
            id="causa-dormancia-card"
            className="bg-[#111827] border border-slate-800 hover:border-red-500/50 rounded-3xl p-6 sm:p-8 relative flex flex-col justify-between transition-all duration-300 group hover:-translate-y-1 shadow-xl"
          >
            <div>
              <div className="w-14 h-14 rounded-2xl bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-400 mb-6 group-hover:scale-110 transition-transform">
                <Activity className="w-7 h-7" />
              </div>
              <span className="text-xs font-mono font-bold text-red-400 uppercase tracking-wider">
                Causa 01 // Estado Inactivo
              </span>
              <h3 className="text-xl font-bold text-white mt-1 mb-3">
                Dormancia Algorítmica
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                Si un negocio pasa más de <strong className="text-white">14 días sin recibir una opinión nueva</strong>,
                el algoritmo de Google asume que el local ha bajado su volumen de clientes, ha
                cerrado o está perdiendo calidad. Silenciosamente, tu ficha cae a la segunda o
                tercera página.
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-800 text-xs font-semibold text-slate-400 flex items-center gap-1.5">
              <span className="text-red-400">●</span> Consecuencia: Caída del 65% en llamadas y rutas.
            </div>
          </div>

          {/* Causa 2: Reseñas Vacías vs Justificaciones Semánticas */}
          <div
            id="causa-semantica-card"
            className="bg-[#111827] border border-slate-800 hover:border-amber-500/50 rounded-3xl p-6 sm:p-8 relative flex flex-col justify-between transition-all duration-300 group hover:-translate-y-1 shadow-xl"
          >
            <div>
              <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 mb-6 group-hover:scale-110 transition-transform">
                <FileText className="w-7 h-7" />
              </div>
              <span className="text-xs font-mono font-bold text-amber-400 uppercase tracking-wider">
                Causa 02 // Contenido Pobre
              </span>
              <h3 className="text-xl font-bold text-white mt-1 mb-3">
                Reseñas Vacías vs Justificaciones Semánticas
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                Una reseña de solo estrellas con texto como <strong className="text-slate-400">"Todo bien"</strong>{' '}
                no alimenta el motor semántico. Google necesita que el cliente mencione servicios,
                platos o sensaciones concretas para activar las <strong className="text-amber-300">Justificaciones en el Mapa</strong>.
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-800 text-xs font-semibold text-slate-400 flex items-center gap-1.5">
              <span className="text-amber-400">●</span> Consecuencia: Cero visibilidad en búsquedas descriptivas.
            </div>
          </div>

          {/* Causa 3: Búsquedas Conversacionales con IA (Entity Triangulation) */}
          <div
            id="causa-ia-card"
            className="bg-[#111827] border border-slate-800 hover:border-blue-500/50 rounded-3xl p-6 sm:p-8 relative flex flex-col justify-between transition-all duration-300 group hover:-translate-y-1 shadow-xl"
          >
            <div>
              <div className="w-14 h-14 rounded-2xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400 mb-6 group-hover:scale-110 transition-transform">
                <Cpu className="w-7 h-7" />
              </div>
              <span className="text-xs font-mono font-bold text-blue-400 uppercase tracking-wider">
                Causa 03 // Algoritmo 2026
              </span>
              <h3 className="text-xl font-bold text-white mt-1 mb-3">
                Búsquedas con IA & Entity Triangulation
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                Los usuarios ya no buscan palabras sueltas; le preguntan a Gemini / Ask Maps frases
                como: <em className="text-blue-300">"¿Dónde puedo comer buen arroz con terraza tranquila?"</em>.{' '}
                La IA lee el cuerpo textual de las opiniones recientes para responder. Si nadie lo
                menciona, no existes.
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-800 text-xs font-semibold text-slate-400 flex items-center gap-1.5">
              <span className="text-blue-400">●</span> Consecuencia: La IA recomienda a tu competidor directo.
            </div>
          </div>
        </div>

        {/* INTERACTIVE SEMANTIC REVIEW LAB */}
        <div className="bg-[#111827] border-2 border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl relative">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div>
              <div className="flex items-center gap-2 text-blue-400 font-bold text-xs uppercase tracking-wider mb-1">
                <Sparkles className="w-4 h-4" />
                <span>Laboratorio Interactivo // Algoritmo de Lectura Semántica</span>
              </div>
              <h3 className="text-2xl font-black text-white">
                Mira cómo Google interpreta dos tipos de reseña
              </h3>
            </div>

            {/* Sector Selector Tabs */}
            <div className="flex items-center gap-2 bg-[#0B0F17] p-1.5 rounded-xl border border-slate-800 self-start sm:self-auto">
              {(['restaurante', 'clinica', 'peluqueria'] as const).map((key) => (
                <button
                  key={key}
                  onClick={() => setSelectedExample(key)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    selectedExample === key
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {examples[key].sector.split('/')[0]}
                </button>
              ))}
            </div>
          </div>

          {/* Side by side comparison of review text & google AI interpretation */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Shallow Review */}
            <div className="bg-[#0B0F17] rounded-2xl p-5 border border-red-900/40 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-red-400 uppercase tracking-wider flex items-center gap-1.5">
                  <AlertCircle className="w-4 h-4 text-red-500" />
                  Reseña Genérica Tradicional
                </span>
                <span className="text-xs text-slate-500">Valor SEO: 10%</span>
              </div>

              <div className="bg-slate-900/90 rounded-xl p-3.5 border border-slate-800 text-slate-300 text-sm italic">
                "{examples[selectedExample].emptyReview}"
              </div>

              <div className="text-xs text-red-400/90 bg-red-950/30 p-3 rounded-lg border border-red-900/30">
                {examples[selectedExample].emptyImpact}
              </div>
            </div>

            {/* Semantic Rich Review induced by RESEO STUDIO questions */}
            <div className="bg-[#0B0F17] rounded-2xl p-5 border border-emerald-500/40 space-y-4 relative">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4 text-emerald-400" />
                  Reseña Inducida con Sistema RESEO
                </span>
                <span className="text-xs text-emerald-400 font-bold bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800/40">
                  Valor SEO: 100%
                </span>
              </div>

              <div className="bg-emerald-950/20 rounded-xl p-3.5 border border-emerald-800/40 text-emerald-100 text-sm font-medium italic">
                "{examples[selectedExample].richReview}"
              </div>

              <div className="text-xs text-emerald-300 bg-emerald-950/40 p-3 rounded-lg border border-emerald-800/40">
                {examples[selectedExample].richImpact}
              </div>

              <div className="pt-1 flex items-center gap-2 text-[11px] text-slate-400">
                <span className="font-bold text-amber-400">Palabras clave detectadas por la IA:</span>
                <span className="text-slate-300 font-semibold">{examples[selectedExample].keywordBadge}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
