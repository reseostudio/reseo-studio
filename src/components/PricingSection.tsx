import React from 'react';
import { PlanOption } from '../types';
import { Check, Zap, ShieldCheck, Flame, MessageCircle, ArrowRight, Sparkles } from 'lucide-react';

export const PricingSection: React.FC = () => {
  const plans: PlanOption[] = [
    {
      id: 'pack-mostrador-pro',
      name: 'Pack Mostrador Pro',
      price: 59,
      description: 'Para negocios con atención en recepción fija o mostrador de cobro único.',
      included: [
        '1 Expositor NFC de Mostrador en acrílico prémium para caja/recepción',
        'Bono 1: Script de 10 segundos para el personal (valorado en 47€)',
        'Bono 2: Auditoría SEO de Ficha de Google de 12 puntos (valorado en 97€)',
        'Configuración vinculada a tu Google Maps',
        'Garantía de Uso Activo de 14 Días (mínimo 5 reseñas verificadas o reembolso 100%)',
      ],
      idealFor: 'Negocios con cobro exclusivo en mostrador',
      ctaText: 'Pedir Pack Mostrador Pro (59€)',
      whatsappMessage: 'Hola, quiero pedir el Pack Mostrador Pro (59€) de RESEO STUDIO para mi negocio.',
    },
    {
      id: 'pack-comercio-equipo',
      name: 'Pack Comercio + Equipo',
      price: 99,
      popular: true,
      description:
        'El kit integral para restaurantes, clínicas y comercios con empleados en sala. Ahorro de 20€.',
      included: [
        '1 Expositor NFC de Mostrador para recepción',
        '2 Tarjetas NFC de Bolsillo para el personal (sala / mesa)',
        'Bono 1: Scripts de 10s adaptados para personal de sala y mostrador (47€)',
        'Bono 2: Auditoría SEO Completa y optimización semántica de Ficha (97€)',
        'Garantía de Uso Activo de 14 Días (mínimo 5 reseñas verificadas o reembolso 100%)',
      ],
      idealFor: 'Restaurantes, clínicas, salones y negocios con atención personalizada',
      ctaText: 'Pedir Pack Comercio + Equipo (99€) →',
      whatsappMessage:
        'Hola, quiero pedir el Pack Comercio + Equipo (99€) de RESEO STUDIO para mi negocio.',
    },
    {
      id: 'pack-gran-equipo',
      name: 'Pack Gran Equipo',
      price: 159,
      description:
        'Para locales con varios salones, alta rotación de personal o plantillas amplias. Ahorro de 50€.',
      included: [
        '1 Expositor NFC de Mostrador',
        '5 Tarjetas NFC de Bolsillo para el personal',
        'Los 2 Bonos de Valor Incluidos (Scripts 10s + Auditoría SEO de Ficha · valor +144€)',
        'Soporte Prioritario y reposición preferente de material',
        'Garantía de Uso Activo de 14 Días (mínimo 5 reseñas verificadas o reembolso 100%)',
      ],
      idealFor: 'Locales con varios salones, plantillas amplias o franquicias',
      ctaText: 'Pedir Pack Gran Equipo (159€)',
      whatsappMessage: 'Hola, quiero pedir el Pack Gran Equipo (159€) de RESEO STUDIO para mi negocio.',
    },
  ];

  return (
    <section id="planes-inversion" className="py-20 bg-[#0B0F17] border-t border-slate-800 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-bold uppercase tracking-wider mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Sección 06 // Inversión y Paquetes</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight leading-tight mb-6">
            Elige el Ecosistema para tu Negocio
          </h2>
          <p className="text-base sm:text-lg text-slate-300 leading-relaxed">
            Pago único. <strong className="text-white">Sin cuotas mensuales recurrentes</strong>, sin
            software de suscripción y con chips NFC de grado industrial de por vida.
          </p>
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
                    ? 'bg-gradient-to-b from-[#131E35] to-[#0E1627] border-2 border-blue-500 shadow-2xl shadow-blue-950/50 scale-100 lg:-translate-y-2'
                    : 'bg-[#111827] border border-slate-800 hover:border-slate-700'
                }`}
              >
                {/* Popular Badge */}
                {isPopular && (
                  <div className="absolute -top-4 inset-x-0 flex justify-center">
                    <span className="bg-gradient-to-r from-blue-600 to-emerald-500 text-white text-xs font-black uppercase tracking-wider py-1.5 px-4 rounded-full shadow-lg flex items-center gap-1.5">
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

                {/* Bottom CTA & Target Audience */}
                <div className="space-y-4 pt-4 border-t border-slate-800">
                  <a
                    id={`btn-${plan.id}`}
                    href={link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`w-full py-4 px-4 rounded-xl font-extrabold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all duration-200 shadow-lg ${
                      isPopular
                        ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-950/60 hover:shadow-emerald-700/60 hover:-translate-y-0.5'
                        : 'bg-[#1F2937] hover:bg-slate-700 text-white border border-slate-700'
                    }`}
                  >
                    <MessageCircle className="w-4 h-4 fill-current" />
                    <span>{plan.ctaText}</span>
                  </a>

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
