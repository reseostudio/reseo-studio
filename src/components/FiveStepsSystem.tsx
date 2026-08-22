import React from 'react';
import { motion } from 'motion/react';
import {
  Sparkles,
  Zap,
  Repeat,
  Smartphone,
  HelpCircle,
  MessageSquareReply,
  Compass,
  ArrowRight,
} from 'lucide-react';

export const FiveStepsSystem: React.FC = () => {
  const steps = [
    {
      number: '01',
      title: 'Flujo Constante de 2 a 5 Reseñas Semanales',
      description:
        'Elimina la dormancia algorítmica. No necesitas 50 opiniones en un solo día (lo cual parece sospechoso a Google), sino un goteo natural y continuado que señale actividad diaria vibrante.',
      badge: 'Velocidad Óptima',
      icon: Repeat,
      color: 'from-blue-500/20 to-blue-600/5',
      borderColor: 'border-blue-500/30',
      textColor: 'text-blue-400',
    },
    {
      number: '02',
      title: 'Dispositivo Propio del Cliente mediante Toque NFC',
      description:
        'Fricción cero absoluta: el cliente acerca su móvil durante 3 segundos. Sin teclear URLs, sin abrir cámaras para leer QR torcidos y sin introducir contraseñas. Directo a las 5 estrellas.',
      badge: 'Fricción Cero',
      icon: Smartphone,
      color: 'from-emerald-500/20 to-emerald-600/5',
      borderColor: 'border-emerald-500/30',
      textColor: 'text-emerald-400',
    },
    {
      number: '03',
      title: 'Preguntas Abiertas Inductoras',
      description:
        'La guía de RESEO enseña a tu personal la pregunta exacta ("¿Qué plato te ha sorprendido más hoy?" o "¿Cómo sientes el cambio en tu sonrisa?") para que el cliente redacte una reseña semántica rica en palabras clave.',
      badge: 'SEO Semántico',
      icon: HelpCircle,
      color: 'from-amber-500/20 to-amber-600/5',
      borderColor: 'border-amber-500/30',
      textColor: 'text-amber-400',
    },
    {
      number: '04',
      title: 'Respuestas Estratégicas en Menos de 48 Horas',
      description:
        'Responder a cada opinión en menos de 2 días incluyendo palabras clave de servicio refuerza el perfil de tu entidad comercial para los robots de búsqueda de Google.',
      badge: 'Refuerzo de Entidad',
      icon: MessageSquareReply,
      color: 'from-purple-500/20 to-purple-600/5',
      borderColor: 'border-purple-500/30',
      textColor: 'text-purple-400',
    },
    {
      number: '05',
      title: 'Auditoría Trimestral de Velocidad Competitiva',
      description:
        'Monitorea la tasa de adquisición de tus 3 competidores más cercanos y ajusta los puntos de contacto en tu local para mantener el liderazgo indiscutible en el Top 3 Local Pack.',
      badge: 'Liderazgo Sostenible',
      icon: Compass,
      color: 'from-red-500/20 to-red-600/5',
      borderColor: 'border-red-500/30',
      textColor: 'text-red-400',
    },
  ];

  return (
    <section id="sistema-5-pasos" className="py-20 bg-[#0E1422] border-t border-slate-800 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-bold uppercase tracking-wider mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Sección 04 // Metodología Probada</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight leading-tight mb-6">
            El Sistema de 5 Pasos para Dominar Google Maps
          </h2>
          <p className="text-base sm:text-lg text-slate-300 leading-relaxed">
            Un protocolo de ingeniería local diseñado para convertir la experiencia física en tu
            establecimiento en la máxima posición orgánica en los mapas de Google.
          </p>
        </div>

        {/* Steps Timeline Grid */}
        <div className="space-y-6 max-w-4xl mx-auto">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div
                key={step.number}
                id={`paso-${step.number}`}
                className={`bg-gradient-to-r ${step.color} bg-[#111827] border ${step.borderColor} rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center gap-6 shadow-xl transition-all duration-300 hover:scale-[1.01]`}
              >
                {/* Step number badge & icon */}
                <div className="flex items-center gap-4 shrink-0">
                  <span className={`text-4xl sm:text-5xl font-black font-mono ${step.textColor}`}>
                    {step.number}
                  </span>
                  <div
                    className={`w-12 h-12 rounded-2xl bg-[#0B0F17] border ${step.borderColor} flex items-center justify-center ${step.textColor}`}
                  >
                    <Icon className="w-6 h-6" />
                  </div>
                </div>

                {/* Step content */}
                <div className="flex-1 space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-xl font-bold text-white leading-snug">{step.title}</h3>
                    <span
                      className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-[#0B0F17] border ${step.borderColor} ${step.textColor}`}
                    >
                      {step.badge}
                    </span>
                  </div>
                  <p className="text-sm text-slate-300 leading-relaxed">{step.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
