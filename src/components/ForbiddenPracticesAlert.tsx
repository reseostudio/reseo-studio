import React from 'react';
import { ShieldX, AlertOctagon, Tablet, Gift, Users, CheckCircle2, ShieldCheck } from 'lucide-react';

export const ForbiddenPracticesAlert: React.FC = () => {
  return (
    <section className="py-20 bg-[#0B0F17] border-t border-slate-800 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header with Alert styling */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-950/80 border border-red-800/80 text-red-400 text-xs font-bold uppercase tracking-wider mb-4 shadow-lg shadow-red-950/40">
            <AlertOctagon className="w-4 h-4 text-red-400" />
            <span>Sección 03 // Alerta de Penalizaciones Oficiales</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight leading-tight mb-6">
            Prácticas Prohibidas que Destruyen tu Ficha de Google
          </h2>
          <p className="text-base sm:text-lg text-slate-300 leading-relaxed">
            Muchos consultores improvisados recomiendan atajos que activan los algoritmos de
            detección de spam de Google. Estas 3 tácticas pueden borrar todas tus opiniones o
            suspender tu ficha para siempre:
          </p>
        </div>

        {/* The 3 Forbidden Practices Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 mb-14">
          {/* Practice 1: Tablets en mostrador */}
          <div
            id="practica-tablets"
            className="bg-[#111827] border-2 border-red-900/40 rounded-3xl p-6 sm:p-8 relative flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-500 mb-6 font-bold text-xl">
                <Tablet className="w-6 h-6" />
              </div>
              <div className="inline-block bg-red-950 text-red-400 text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-md mb-2 border border-red-800/40">
                ❌ Alto Riesgo de Borrado
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Tablets en el Mostrador</h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                Poner una tablet o iPad en caja para que los clientes dejen la reseña es un error
                grave. Al provenir todas las opiniones de la{' '}
                <strong className="text-red-400">misma dirección IP y huella de dispositivo</strong>,
                Google detecta fraude y borra automáticamente las reseñas en masa cada semana.
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-800 text-xs text-red-400/90 font-semibold">
              Riesgo: Filtrado y supresión algorítmica masiva.
            </div>
          </div>

          {/* Practice 2: Guiones Forzados y Coacción */}
          <div
            id="practica-guiones"
            className="bg-[#111827] border-2 border-red-900/40 rounded-3xl p-6 sm:p-8 relative flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-500 mb-6 font-bold text-xl">
                <Users className="w-6 h-6" />
              </div>
              <div className="inline-block bg-red-950 text-red-400 text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-md mb-2 border border-red-800/40">
                ❌ Pérdida de Reputación
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Guiones Forzados en Mostrador</h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                Obligar al personal de caja a insistir al cliente con preguntas incómodas genera
                tensión en el momento del pago. El cliente dice que sí por compromiso, pero luego no
                la escribe, o peor: deja una opinión fría o una calificación baja por sentirse
                presionado.
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-800 text-xs text-red-400/90 font-semibold">
              Riesgo: Fricción comercial en el momento del cobro.
            </div>
          </div>

          {/* Practice 3: Review Gating e Incentivos Prohibidos */}
          <div
            id="practica-gating"
            className="bg-[#111827] border-2 border-red-900/40 rounded-3xl p-6 sm:p-8 relative flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-500 mb-6 font-bold text-xl">
                <Gift className="w-6 h-6" />
              </div>
              <div className="inline-block bg-red-950 text-red-400 text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-md mb-2 border border-red-800/40">
                ❌ Infracción Directa de Directrices
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Review Gating o Descuentos</h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                Filtrar previamente ("si estás contento danos 5 estrellas, si no escribe aquí") o
                regalar chupitos, postres o descuentos a cambio de una reseña viola explícitamente los
                términos de servicio de Google y la normativa europea de protección al consumidor.
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-800 text-xs text-red-400/90 font-semibold">
              Riesgo: Cierre o suspensión definitiva de la ficha.
            </div>
          </div>
        </div>

        {/* The RESEO Safe Standard Banner */}
        <div className="bg-gradient-to-r from-emerald-950/40 via-[#111827] to-blue-950/40 border-2 border-emerald-500/40 rounded-3xl p-6 sm:p-8 shadow-xl">
          <div className="flex flex-col md:flex-row items-center gap-6 justify-between">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
                <ShieldCheck className="w-8 h-8" />
              </div>
              <div>
                <h4 className="text-xl font-bold text-white">
                  La Solución 100% Blindada y Ética de RESEO STUDIO
                </h4>
                <p className="text-sm text-slate-300 mt-1 max-w-2xl">
                  Cada reseña se emite desde el propio smartphone del cliente, con su cuenta de Google
                  y su conexión de datos/WiFi habitual. Cumple al 100% las normativas y garantiza la
                  máxima permanencia de cada reseña.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 bg-emerald-500/20 text-emerald-300 px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap border border-emerald-500/30">
              <CheckCircle2 className="w-4 h-4" />
              <span>Cero Riesgo de Penalización</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
