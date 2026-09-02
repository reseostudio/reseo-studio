import React from 'react';
import { PlanOption } from '../types';
import { Check, Zap, ShieldCheck, Flame, MessageCircle, ArrowRight, Sparkles, Calculator, Tag } from 'lucide-react';

interface PricingSectionProps {
  onOpenConfigurator?: (packId: string) => void;
}

export const PricingSection: React.FC<PricingSectionProps> = ({ onOpenConfigurator }) => {
  const plans: PlanOption[] = [
    {
      id: 'mostrador',
      name: 'Pack Mostrador Pro',
      price: 59,
      description: 'Ideal para pequeños locales con punto de cobro único en barra, mostrador o recepción.',
      included: [
        '1 Expositor Acrílico Inclinado NFC (120x140mm)',
        'Tu Logotipo incluido en la base del expositor',
        'Programación directa a tu Ficha de Google Maps',
        'Bono 1: Script de 10 seg. para pedir reseñas',
        'Bono 2: Auditoría Rápida de Ficha de Google',
        'Opción: Expositores extra a solo +30 €/ud'
      ],
      idealFor: 'Bares, cafeterías, consultas y comercios con cobro centralizado',
      ctaText: 'Pedir Mostrador Pro (59 €)',
      whatsappMessage: 'Hola, quiero pedir el Pack Mostrador Pro (59€) de RESEO STUDIO con mi logotipo para mi negocio.',
    },
    {
      id: 'equipo',
      name: 'Pack Comercio + Equipo',
      price: 99,
      originalPrice: 119,
      popular: true,
      description:
        'El combo de máxima aceleración: 1 expositor en barra + 2 tarjetas de bolsillo para el personal.',
      included: [
        '1 Expositor Acrílico Inclinado NFC con tu Logo',
        '2 Tarjetas NFC de Bolsillo para Camareros/Equipo',
        'Programación vinculada a tu Google Maps',
        'Bono 1 y Bono 2 Incluidos',
        'Envío Express 24/48h Nacional Gratis',
        'Ahorro directo de 20 € respecto a compra suelta'
      ],
      idealFor: 'Restaurantes, gastrobares, salones de estética y clínicas con camareros/personal',
      ctaText: 'Pedir Pack Comercio + Equipo (99 €)',
      whatsappMessage:
        'Hola, quiero pedir el Pack Comercio + Equipo (99€ con Expositor + 2 Tarjetas) de RESEO STUDIO para mi negocio.',
    },
    {
      id: 'gran-equipo',
      name: 'Pack Gran Equipo',
      price: 159,
      originalPrice: 209,
      description:
        'Máxima cobertura: 1 expositor de mostrador + 5 tarjetas NFC para turnos amplios de personal.',
      included: [
        '1 Expositor Acrílico Inclinado NFC con tu Logo',
        '5 Tarjetas NFC de Bolsillo de Alta Durabilidad',
        'Auditoría y Optimización de tu Ficha de Google',
        'Soporte Prioritario y Reemplazo Preferente',
        'Bono 1, Bono 2 y Guía Semántica Anti-Filtro',
        'Ahorro directo de 50 € en el pack'
      ],
      idealFor: 'Restaurantes con amplia sala, terrazas, franquicias y hoteles',
      ctaText: 'Pedir Gran Equipo (159 €)',
      whatsappMessage:
        'Hola, quiero pedir el Pack Gran Equipo (159€ con Expositor + 5 Tarjetas) de RESEO STUDIO para mi negocio.',
    },
  ];

  return (
    <section id="planes-inversion" className="py-20 bg-[#0B0F17] border-t border-slate-800 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-bold uppercase tracking-wider mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Sección 06 // Inversión y Paquetes</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight leading-tight mb-4">
            Elige el Ecosistema para tu Negocio
          </h2>
          <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl mx-auto">
            Pago único. <strong className="text-white">Sin cuotas mensuales recurrentes</strong>, sin
            software de suscripción y con chips NFC de grado industrial de por vida.
          </p>

          {/* Quick configurator banner */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={() => onOpenConfigurator && onOpenConfigurator('mostrador')}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-blue-600/20 border border-blue-500/50 hover:bg-blue-600/30 text-blue-300 font-bold text-xs transition-all shadow-md"
            >
              <Calculator className="w-4 h-4 text-blue-400" />
              <span>Abrir Configurador Interactivo de Presupuestos Online</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <div className="text-xs text-amber-400 font-semibold flex items-center gap-1.5 px-3 py-1 bg-amber-500/10 rounded-full border border-amber-500/30">
              <Tag className="w-3.5 h-3.5" />
              <span>Expositores extras por solo +30 €/ud</span>
            </div>
          </div>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch mb-16">
          {plans.map((plan) => {
            const isPopular = plan.popular;
            const link = `https://wa.me/34686478561?text=${encodeURIComponent(plan.whatsappMessage)}`;

            return (
              <div
                key={plan.id}
                id={`plan-${plan.id}`}
                className={`relative rounded-3xl p-6 sm:p-8 flex flex-col justify-between transition-all duration-300 ${
                  isPopular
                    ? 'bg-gradient-to-b from-[#131E35] to-[#0E1627] border-2 border-emerald-500 shadow-2xl shadow-emerald-950/50 scale-100 lg:-translate-y-2'
                    : 'bg-[#111827] border border-slate-800 hover:border-slate-700'
                }`}
              >
                {/* Popular Badge */}
                {isPopular && (
                  <div className="absolute -top-4 inset-x-0 flex justify-center">
                    <span className="bg-gradient-to-r from-emerald-600 to-teal-500 text-white text-xs font-black uppercase tracking-wider py-1.5 px-4 rounded-full shadow-lg flex items-center gap-1.5">
                      <Flame className="w-3.5 h-3.5 fill-white" />
                      MÁS VENDIDO // x3 CONVERSIÓN
                    </span>
                  </div>
                )}

                <div>
                  <div className="mb-4">
                    <h3 className="text-xl font-bold text-white mb-1">{plan.name}</h3>
                    <p className="text-xs text-slate-400 min-h-[36px]">{plan.description}</p>
                  </div>

                  {/* Price display */}
                  <div className="flex items-baseline gap-2 mb-6 pb-6 border-b border-slate-800">
                    <span className="text-4xl sm:text-5xl font-black text-white font-mono tracking-tight">
                      {plan.price} €
                    </span>
                    {plan.originalPrice && (
                      <span className="text-base text-slate-500 line-through font-mono">
                        {plan.originalPrice} €
                      </span>
                    )}
                    <span className="text-xs text-slate-400 font-semibold ml-1">
                      / pago único (sin cuotas)
                    </span>
                  </div>

                  {/* Features List */}
                  <div className="space-y-3 mb-8">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                      Qué incluye:
                    </span>
                    {plan.included.map((item, idx) => (
                      <div key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-200">
                        <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Bottom Actions */}
                <div className="space-y-3 pt-4 border-t border-slate-800">
                  {onOpenConfigurator ? (
                    <button
                      type="button"
                      onClick={() => onOpenConfigurator(plan.id)}
                      className={`w-full py-3.5 px-4 rounded-xl font-extrabold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all duration-200 shadow-lg ${
                        isPopular
                          ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-950/60 hover:shadow-emerald-700/60 hover:-translate-y-0.5'
                          : 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-950/50'
                      }`}
                    >
                      <Calculator className="w-4 h-4" />
                      <span>Configurar y Pedir Online</span>
                    </button>
                  ) : (
                    <a
                      id={`btn-${plan.id}`}
                      href={link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-3.5 px-4 rounded-xl font-extrabold text-xs uppercase tracking-wider flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white"
                    >
                      <MessageCircle className="w-4 h-4 fill-current" />
                      <span>{plan.ctaText}</span>
                    </a>
                  )}

                  <p className="text-[10px] text-slate-400 text-center font-medium">
                    Ideal para: {plan.idealFor}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* 14 DAYS UNCONDITIONAL MONEY BACK GUARANTEE */}
        <div
          id="garantia-14-dias"
          className="max-w-4xl mx-auto bg-gradient-to-r from-emerald-950/50 via-[#111827] to-emerald-950/50 border-2 border-emerald-500/50 rounded-3xl p-6 sm:p-10 shadow-2xl relative overflow-hidden"
        >
          <div className="flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left">
            <div className="w-20 h-20 rounded-full bg-emerald-500/10 border-2 border-emerald-500/40 flex items-center justify-center text-emerald-400 shrink-0 shadow-lg shadow-emerald-950/60">
              <ShieldCheck className="w-10 h-10" />
            </div>

            <div className="space-y-2 flex-1">
              <div className="inline-block text-xs font-black uppercase tracking-wider text-emerald-400 bg-emerald-950 px-2.5 py-0.5 rounded border border-emerald-800/50">
                100% Sin Riesgo // Garantía Blindada
              </div>
              <h3 className="text-2xl font-black text-white">Garantía Incondicional de 14 Días</h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                Prueba el sistema en tu mostrador y con tu equipo durante dos semanas. Si en 14 días
                no consigues <strong className="text-white">al menos 7 reseñas reales nuevas</strong> en
                tu perfil de Google Maps, te devolvemos el 100% de tu dinero inmediatamente y sin
                hacerte preguntas.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
