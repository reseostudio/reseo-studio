import React, { useState } from 'react';
import { Calculator, TrendingUp, Sparkles, Check, ArrowRight, DollarSign } from 'lucide-react';

export const RoiVelocityCalculator: React.FC = () => {
  const [sector, setSector] = useState<'restaurante' | 'clinica' | 'peluqueria' | 'taller' | 'comercio'>('restaurante');
  const [clientesPorDia, setClientesPorDia] = useState<number>(35);
  const [ticketMedio, setTicketMedio] = useState<number>(28);

  const sectorConfigs = {
    restaurante: { name: 'Restaurante / Bar', defaultTicket: 28, defaultClients: 50, conversionFactor: 0.12 },
    clinica: { name: 'Clínica Dental / Estética / Salud', defaultTicket: 120, defaultClients: 18, conversionFactor: 0.22 },
    peluqueria: { name: 'Peluquería / Barbería / Salón', defaultTicket: 35, defaultClients: 22, conversionFactor: 0.25 },
    taller: { name: 'Taller Mecánico / Reformas', defaultTicket: 190, defaultClients: 8, conversionFactor: 0.30 },
    comercio: { name: 'Comercio Local / Tienda', defaultTicket: 22, defaultClients: 60, conversionFactor: 0.08 },
  };

  const handleSectorChange = (newSector: typeof sector) => {
    setSector(newSector);
    setTicketMedio(sectorConfigs[newSector].defaultTicket);
    setClientesPorDia(sectorConfigs[newSector].defaultClients);
  };

  // Calculations
  const clientesSemanales = clientesPorDia * 6; // 6 dias laborables
  const factor = sectorConfigs[sector].conversionFactor;
  const resenasSemanalesEstimadas = Math.max(3, Math.round(clientesSemanales * factor * 0.15));
  const resenasMensuales = resenasSemanalesEstimadas * 4;
  const nuevosClientesMapsMes = Math.round(resenasMensuales * 1.8);
  const facturacionExtraEstimada = nuevosClientesMapsMes * ticketMedio;

  return (
    <section className="py-20 bg-[#0E1422] border-t border-slate-800 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-bold uppercase tracking-wider mb-4">
            <Calculator className="w-3.5 h-3.5" />
            <span>Calculadora de Aceleración // Retorno de Inversión</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight leading-tight mb-4">
            Calcula la Velocidad de Captación de tu Negocio
          </h2>
          <p className="text-sm sm:text-base text-slate-300">
            Descubre cuántas reseñas semanales puede generar tu equipo con el ecosistema RESEO y el
            impacto directo en tu facturación mensual.
          </p>
        </div>

        {/* Calculator Body */}
        <div className="max-w-4xl mx-auto bg-[#111827] border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl">
          {/* Sector Buttons */}
          <div className="mb-8">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
              1. Selecciona el Sector de tu Negocio:
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
              {(Object.keys(sectorConfigs) as (keyof typeof sectorConfigs)[]).map((key) => (
                <button
                  key={key}
                  onClick={() => handleSectorChange(key)}
                  className={`p-3 rounded-xl text-xs font-bold text-center border transition-all ${
                    sector === key
                      ? 'bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-900/40'
                      : 'bg-[#0B0F17] border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
                  }`}
                >
                  {sectorConfigs[key].name.split('/')[0]}
                </button>
              ))}
            </div>
          </div>

          {/* Sliders */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8 pb-8 border-b border-slate-800">
            {/* Slider 1: Clientes al día */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <label className="text-xs font-bold text-slate-300 uppercase">
                  Clientes atendidos por día:
                </label>
                <span className="text-lg font-black text-blue-400 font-mono">
                  {clientesPorDia} clientes/día
                </span>
              </div>
              <input
                type="range"
                min={5}
                max={150}
                step={5}
                value={clientesPorDia}
                onChange={(e) => setClientesPorDia(Number(e.target.value))}
                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
              />
              <div className="flex justify-between text-[10px] text-slate-500">
                <span>5 / día</span>
                <span>75 / día</span>
                <span>150 / día</span>
              </div>
            </div>

            {/* Slider 2: Ticket Medio */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <label className="text-xs font-bold text-slate-300 uppercase">
                  Ticket Medio por Cliente:
                </label>
                <span className="text-lg font-black text-emerald-400 font-mono">
                  {ticketMedio} €
                </span>
              </div>
              <input
                type="range"
                min={10}
                max={400}
                step={5}
                value={ticketMedio}
                onChange={(e) => setTicketMedio(Number(e.target.value))}
                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
              />
              <div className="flex justify-between text-[10px] text-slate-500">
                <span>10 €</span>
                <span>200 €</span>
                <span>400 €</span>
              </div>
            </div>
          </div>

          {/* Result Output Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <div className="bg-[#0B0F17] p-5 rounded-2xl border border-slate-800 text-center">
              <span className="text-xs text-slate-400 uppercase font-bold">Reseñas Nuevas / Mes</span>
              <div className="text-3xl font-black text-blue-400 font-mono mt-1">
                +{resenasMensuales}
              </div>
              <span className="text-[11px] text-slate-500">~{resenasSemanalesEstimadas} por semana</span>
            </div>

            <div className="bg-[#0B0F17] p-5 rounded-2xl border border-slate-800 text-center">
              <span className="text-xs text-slate-400 uppercase font-bold">Nuevos Clientes Maps</span>
              <div className="text-3xl font-black text-amber-400 font-mono mt-1">
                +{nuevosClientesMapsMes} / mes
              </div>
              <span className="text-[11px] text-slate-500">Por posicionamiento Top 3</span>
            </div>

            <div className="bg-gradient-to-b from-emerald-950/60 to-[#0B0F17] p-5 rounded-2xl border border-emerald-500/40 text-center">
              <span className="text-xs text-emerald-300 uppercase font-bold">Facturación Extra Est.</span>
              <div className="text-3xl font-black text-emerald-400 font-mono mt-1">
                +{facturacionExtraEstimada.toLocaleString('es-ES')} €
              </div>
              <span className="text-[11px] text-emerald-400/80 font-medium">Estimación mensual</span>
            </div>
          </div>

          <p className="text-[11px] text-slate-400 text-center">
            *Estimación conservadora basada en un 15% de adopción del cliente en el momento del
            pago/atención. La inversión del Kit Pro (69 €) se amortiza habitualmente en los primeros 3
            días.
          </p>
        </div>
      </div>
    </section>
  );
};
