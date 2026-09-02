import React, { useState, useEffect } from 'react';
import {
  X,
  TrendingUp,
  DollarSign,
  Users,
  Copy,
  Check,
  Download,
  Share2,
  ExternalLink,
  BookOpen,
  Award,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Instagram,
  Utensils,
  CreditCard,
  MessageCircle
} from 'lucide-react';

interface AffiliatePortalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenConfigurator?: () => void;
}

interface AffiliateUser {
  name: string;
  instagram: string;
  email: string;
  code: string;
  balancePending: number;
  balancePaid: number;
  totalClicks: number;
  totalSales: number;
  conversionRate: string;
  commissionRate: number; // 20%
}

export const AffiliatePortal: React.FC<AffiliatePortalProps> = ({ isOpen, onClose, onOpenConfigurator }) => {
  const [isRegistered, setIsRegistered] = useState(true);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'guide' | 'assets' | 'payout'>('dashboard');
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const [payoutRequested, setPayoutRequested] = useState(false);
  const [payoutMethod, setPayoutMethod] = useState<'bizum' | 'transferencia' | 'paypal'>('bizum');
  const [payoutDetails, setPayoutDetails] = useState('');

  // Default affiliate profile for demo & immediate use
  const [affiliate, setAffiliate] = useState<AffiliateUser>(() => {
    try {
      const saved = localStorage.getItem('reseostudio_affiliate');
      return saved ? JSON.parse(saved) : {
        name: 'Carlos // Foodie Gastronómico',
        instagram: '@madrid_gourmet_food',
        email: 'carlos@foodiemadrid.com',
        code: 'FOODIE20',
        balancePending: 71.40, // e.g. 3 sales pending
        balancePaid: 124.80,
        totalClicks: 84,
        totalSales: 6,
        conversionRate: '7.1%',
        commissionRate: 20
      };
    } catch {
      return {
        name: 'Creador / Partner',
        instagram: '@tu_instagram',
        email: 'partner@reseostudio.es',
        code: 'PARTNER20',
        balancePending: 0,
        balancePaid: 0,
        totalClicks: 0,
        totalSales: 0,
        conversionRate: '0%',
        commissionRate: 20
      };
    }
  });

  // Registration Form
  const [regName, setRegName] = useState('');
  const [regInstagram, setRegInstagram] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regCustomCode, setRegCustomCode] = useState('');

  const referralUrl = typeof window !== 'undefined'
    ? `${window.location.origin}/?ref=${affiliate.code}`
    : `https://reseostudio.es/?ref=${affiliate.code}`;

  const copyToClipboard = (text: string, type: 'link' | 'code') => {
    navigator.clipboard.writeText(text);
    if (type === 'link') {
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    } else {
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    }
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!regName || !regEmail) return;
    const cleanCode = (regCustomCode || regInstagram.replace('@', '') || regName.split(' ')[0] + '20')
      .toUpperCase()
      .replace(/[^A-Z0-9]/g, '');
    const newAffiliate: AffiliateUser = {
      name: regName,
      instagram: regInstagram.startsWith('@') ? regInstagram : `@${regInstagram}`,
      email: regEmail,
      code: cleanCode || 'RESEO20',
      balancePending: 0,
      balancePaid: 0,
      totalClicks: 0,
      totalSales: 0,
      conversionRate: '0%',
      commissionRate: 20
    };
    setAffiliate(newAffiliate);
    localStorage.setItem('reseostudio_affiliate', JSON.stringify(newAffiliate));
    setIsRegistered(true);
  };

  const handlePayoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (affiliate.balancePending <= 0) return;
    setPayoutRequested(true);
    // Simulate payout request update
    const updated = {
      ...affiliate,
      balancePaid: affiliate.balancePaid + affiliate.balancePending,
      balancePending: 0
    };
    setAffiliate(updated);
    localStorage.setItem('reseostudio_affiliate', JSON.stringify(updated));
    setTimeout(() => {
      setPayoutRequested(false);
      setActiveTab('dashboard');
    }, 2500);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-[#0F172A] border border-slate-700/80 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* HEADER BAR */}
        <div className="px-6 py-5 bg-[#1E293B] border-b border-slate-700 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-500 flex items-center justify-center text-white font-black shadow-lg shadow-amber-950/40">
              <Utensils className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-black text-white">
                  Portal de Afiliados // Creadores & Foodies
                </h2>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 text-xs font-bold">
                  20% Comisión
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Monetiza tus visitas a bares y restaurantes recomendando la herramienta nº1 de Google Reviews.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* NAVIGATION TABS */}
        <div className="px-6 bg-[#131E32] border-b border-slate-800 flex items-center gap-2 overflow-x-auto py-2">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 shrink-0 ${
              activeTab === 'dashboard'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <TrendingUp className="w-4 h-4" />
            <span>Mi Panel & Métricas</span>
          </button>

          <button
            onClick={() => setActiveTab('guide')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 shrink-0 ${
              activeTab === 'guide'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Guía de Venta Rápida (30s)</span>
          </button>

          <button
            onClick={() => setActiveTab('assets')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 shrink-0 ${
              activeTab === 'assets'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Download className="w-4 h-4" />
            <span>Recursos & Creatividades</span>
          </button>

          <button
            onClick={() => setActiveTab('payout')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 shrink-0 ${
              activeTab === 'payout'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'text-emerald-400 hover:bg-emerald-950/30'
            }`}
          >
            <DollarSign className="w-4 h-4" />
            <span>Cobros ({affiliate.balancePending.toFixed(2)} €)</span>
          </button>
        </div>

        {/* TAB CONTENT */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">

          {/* 1. DASHBOARD TAB */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              
              {/* TOP STATS CARDS */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="bg-[#1E293B] border border-slate-800 rounded-2xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-slate-400 font-semibold">Saldo Disponible</span>
                    <DollarSign className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div className="text-2xl font-black text-emerald-400">
                    {affiliate.balancePending.toFixed(2)} €
                  </div>
                  <div className="text-[11px] text-slate-400 mt-1">Listo para transferir</div>
                </div>

                <div className="bg-[#1E293B] border border-slate-800 rounded-2xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-slate-400 font-semibold">Total Cobrado</span>
                    <Award className="w-4 h-4 text-blue-400" />
                  </div>
                  <div className="text-2xl font-black text-white">
                    {affiliate.balancePaid.toFixed(2)} €
                  </div>
                  <div className="text-[11px] text-slate-400 mt-1">Comisiones históricas</div>
                </div>

                <div className="bg-[#1E293B] border border-slate-800 rounded-2xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-slate-400 font-semibold">Ventas Cerradas</span>
                    <TrendingUp className="w-4 h-4 text-amber-400" />
                  </div>
                  <div className="text-2xl font-black text-white">
                    {affiliate.totalSales} locales
                  </div>
                  <div className="text-[11px] text-slate-400 mt-1">Conv: {affiliate.conversionRate}</div>
                </div>

                <div className="bg-[#1E293B] border border-slate-800 rounded-2xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-slate-400 font-semibold">Tu Comisión</span>
                    <Sparkles className="w-4 h-4 text-purple-400" />
                  </div>
                  <div className="text-2xl font-black text-purple-400">
                    {affiliate.commissionRate}%
                  </div>
                  <div className="text-[11px] text-slate-400 mt-1">Nivel: Creador Pro</div>
                </div>
              </div>

              {/* REFERRAL LINK & COUPON BOX */}
              <div className="bg-gradient-to-r from-blue-950/40 via-[#1E293B] to-blue-950/40 border-2 border-blue-500/40 rounded-3xl p-6 space-y-4">
                <div>
                  <h3 className="text-base font-black text-white flex items-center gap-2">
                    <Share2 className="w-4 h-4 text-blue-400" />
                    Tus Enlaces y Códigos de Descuento Exclusivos
                  </h3>
                  <p className="text-xs text-slate-300 mt-1">
                    Comparte este enlace o tu cupón con los dueños de restaurantes. Ellos se ahorran un <strong>5% directo</strong> y tú te llevas el <strong>20% neto</strong> de su pedido.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Link Box */}
                  <div className="bg-[#0F172A] border border-slate-700 rounded-xl p-3.5 flex flex-col justify-between">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      1. Enlace de Referido Directo
                    </span>
                    <div className="flex items-center gap-2 mt-2">
                      <input
                        type="text"
                        readOnly
                        value={referralUrl}
                        className="bg-slate-900 border border-slate-800 text-xs text-blue-300 font-mono rounded-lg px-3 py-2 flex-1 focus:outline-none"
                      />
                      <button
                        onClick={() => copyToClipboard(referralUrl, 'link')}
                        className="p-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors flex items-center gap-1 text-xs font-bold shrink-0"
                      >
                        {copiedLink ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
                        <span>{copiedLink ? 'Copiado' : 'Copiar'}</span>
                      </button>
                    </div>
                  </div>

                  {/* Coupon Box */}
                  <div className="bg-[#0F172A] border border-slate-700 rounded-xl p-3.5 flex flex-col justify-between">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      2. Cupón de Descuento (5% para el local)
                    </span>
                    <div className="flex items-center gap-2 mt-2">
                      <div className="bg-slate-900 border border-amber-500/40 text-amber-300 font-mono font-black text-sm rounded-lg px-4 py-2 flex-1 tracking-widest text-center">
                        {affiliate.code}
                      </div>
                      <button
                        onClick={() => copyToClipboard(affiliate.code, 'code')}
                        className="p-2 bg-amber-600 hover:bg-amber-500 text-white rounded-lg transition-colors flex items-center gap-1 text-xs font-bold shrink-0"
                      >
                        {copiedCode ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
                        <span>{copiedCode ? 'Copiado' : 'Copiar'}</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* RECENT COMMISSIONS LOG */}
              <div className="bg-[#1E293B] border border-slate-800 rounded-2xl p-5">
                <h4 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
                  <span>📜 Historial de Ventas y Comisiones</span>
                </h4>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-slate-800 text-slate-400">
                        <th className="pb-2">Negocio / Cliente</th>
                        <th className="pb-2">Pack Comprado</th>
                        <th className="pb-2">Importe Venta</th>
                        <th className="pb-2">Tu Comisión (20%)</th>
                        <th className="pb-2">Estado</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800 text-slate-300">
                      <tr>
                        <td className="py-2.5 font-bold text-white">Asador El Rincón</td>
                        <td className="py-2.5">Pack Comercio + Equipo</td>
                        <td className="py-2.5">99.00 €</td>
                        <td className="py-2.5 font-bold text-emerald-400">+19.80 €</td>
                        <td className="py-2.5"><span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-bold">Aprobada</span></td>
                      </tr>
                      <tr>
                        <td className="py-2.5 font-bold text-white">Taberna La Latina</td>
                        <td className="py-2.5">Pack Gran Equipo (1 Exp + 5 Tarjetas)</td>
                        <td className="py-2.5">159.00 €</td>
                        <td className="py-2.5 font-bold text-emerald-400">+31.80 €</td>
                        <td className="py-2.5"><span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-bold">Aprobada</span></td>
                      </tr>
                      <tr>
                        <td className="py-2.5 font-bold text-white">Café & Brunch Sol</td>
                        <td className="py-2.5">1 Expositor Mostrador Pro</td>
                        <td className="py-2.5">59.00 €</td>
                        <td className="py-2.5 font-bold text-emerald-400">+11.80 €</td>
                        <td className="py-2.5"><span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-bold">Aprobada</span></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* 2. GUIDE TAB */}
          {activeTab === 'guide' && (
            <div className="space-y-6">
              <div className="bg-[#1E293B] border border-slate-800 rounded-2xl p-6 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold">
                    1
                  </div>
                  <div>
                    <h4 className="text-sm font-black text-white">El Momento Mágico: Cómo sacarlo en tu visita</h4>
                    <p className="text-xs text-slate-400">Cuando acabes de grabar o al despedirte del dueño/gerente.</p>
                  </div>
                </div>

                <div className="bg-[#0F172A] border-l-4 border-blue-500 p-4 rounded-r-xl text-xs text-slate-200 leading-relaxed">
                  <p className="font-semibold text-blue-300 mb-1">💬 Guion de 30 segundos (Literal para copiar):</p>
                  <em>
                    "Oye Juan, con el vídeo que os voy a publicar os va a entrar mucha gente este finde. Poned este expositor de Reseo Studio en la barra: cuando la gente pague contenta, tocan con el móvil y os dejan 5 estrellas en 3 segundos. Así el tirón de mi vídeo os deja 50 reseñas nuevas para todo el año. Os paso mi cupón exclusivo con el que os descuentan un 5% directo."
                  </em>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-[#1E293B] border border-slate-800 rounded-2xl p-5">
                  <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-2">
                    Si te dicen: "Ya tengo código QR"
                  </h4>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    "El QR exige abrir cámara, enfocar y loguearse. Con el chip NFC es instantáneo como pagar con tarjeta: solo acercas el móvil y salta la reseña en 2 segundos. Pasa de un 2% de reseñas a más de un 30%."
                  </p>
                </div>

                <div className="bg-[#1E293B] border border-slate-800 rounded-2xl p-5">
                  <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-2">
                    Si te dicen: "¿Cuánto cuesta?"
                  </h4>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    "Es pago único, sin cuotas. Son solo 59 € por el expositor de mostrador (y con mi cupón te descuentan un 5%). Con que una sola mesa nueva vaya por Google al mes ya lo has pagado de sobra."
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* 3. ASSETS TAB */}
          {activeTab === 'assets' && (
            <div className="space-y-4">
              <p className="text-xs text-slate-300">
                Material listo para usar en tus historias de Instagram, reels o para enviar por WhatsApp al hostelero:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-[#1E293B] border border-slate-800 rounded-2xl p-4 flex flex-col justify-between">
                  <div>
                    <span className="text-xs font-bold text-white block mb-1">Vídeo Demo de 10s (NFC en Barra)</span>
                    <p className="text-[11px] text-slate-400">Vídeo vertical listo para subir a tus stories.</p>
                  </div>
                  <a
                    href="/plantilla_expositor_estandar.html"
                    target="_blank"
                    className="mt-4 px-3 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Ver / Descargar</span>
                  </a>
                </div>

                <div className="bg-[#1E293B] border border-slate-800 rounded-2xl p-4 flex flex-col justify-between">
                  <div>
                    <span className="text-xs font-bold text-white block mb-1">Plantilla Expositor 120x140mm</span>
                    <p className="text-[11px] text-slate-400">Diseño oficial para mostrarle al dueño cómo quedará con su logo.</p>
                  </div>
                  <a
                    href="/plantilla_expositor_estandar.html"
                    target="_blank"
                    className="mt-4 px-3 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>Abrir Plantilla HD</span>
                  </a>
                </div>

                <div className="bg-[#1E293B] border border-slate-800 rounded-2xl p-4 flex flex-col justify-between">
                  <div>
                    <span className="text-xs font-bold text-white block mb-1">Dossier PDF para Hostelería</span>
                    <p className="text-[11px] text-slate-400">Resumen en 1 página con precios y retorno para el bar.</p>
                  </div>
                  <button
                    onClick={() => alert("Dossier descargado: contacta con soporte para personalizaciones exclusivas.")}
                    className="mt-4 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Descargar Dossier</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* 4. PAYOUT TAB */}
          {activeTab === 'payout' && (
            <div className="max-w-lg mx-auto bg-[#1E293B] border border-slate-800 rounded-3xl p-6 space-y-5">
              <div className="text-center">
                <span className="text-xs text-emerald-400 font-bold uppercase tracking-wider">Saldo por Cobrar</span>
                <h3 className="text-3xl font-black text-white mt-1">{affiliate.balancePending.toFixed(2)} €</h3>
                <p className="text-xs text-slate-400 mt-1">Mínimo de retiro: 20 € (Pagos en 24h laborables)</p>
              </div>

              {payoutRequested ? (
                <div className="bg-emerald-950/50 border border-emerald-500/50 rounded-2xl p-6 text-center space-y-2">
                  <ShieldCheck className="w-10 h-10 text-emerald-400 mx-auto" />
                  <h4 className="text-sm font-bold text-white">¡Solicitud de Pago Recibida!</h4>
                  <p className="text-xs text-slate-300">
                    Estamos procesando tu transferencia. Te llegará el justificante a {affiliate.email}.
                  </p>
                </div>
              ) : (
                <form onSubmit={handlePayoutSubmit} className="space-y-4">
                  <div>
                    <label className="text-xs font-bold text-slate-300 block mb-2">Método de Cobro:</label>
                    <div className="grid grid-cols-3 gap-2">
                      <button
                        type="button"
                        onClick={() => setPayoutMethod('bizum')}
                        className={`p-2.5 rounded-xl border text-xs font-bold transition-all ${
                          payoutMethod === 'bizum'
                            ? 'bg-blue-600 border-blue-400 text-white'
                            : 'bg-slate-900 border-slate-700 text-slate-400'
                        }`}
                      >
                        📱 Bizum
                      </button>
                      <button
                        type="button"
                        onClick={() => setPayoutMethod('transferencia')}
                        className={`p-2.5 rounded-xl border text-xs font-bold transition-all ${
                          payoutMethod === 'transferencia'
                            ? 'bg-blue-600 border-blue-400 text-white'
                            : 'bg-slate-900 border-slate-700 text-slate-400'
                        }`}
                      >
                        🏦 Transferencia
                      </button>
                      <button
                        type="button"
                        onClick={() => setPayoutMethod('paypal')}
                        className={`p-2.5 rounded-xl border text-xs font-bold transition-all ${
                          payoutMethod === 'paypal'
                            ? 'bg-blue-600 border-blue-400 text-white'
                            : 'bg-slate-900 border-slate-700 text-slate-400'
                        }`}
                      >
                        💳 PayPal
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-300 block mb-1">
                      {payoutMethod === 'bizum'
                        ? 'Número de Teléfono Bizum'
                        : payoutMethod === 'transferencia'
                        ? 'IBAN Bancario'
                        : 'Email de PayPal'}
                    </label>
                    <input
                      type="text"
                      required
                      placeholder={
                        payoutMethod === 'bizum'
                          ? '600 000 000'
                          : payoutMethod === 'transferencia'
                          ? 'ES00 0000 0000 0000 0000 0000'
                          : 'tu-cuenta@paypal.com'
                      }
                      value={payoutDetails}
                      onChange={(e) => setPayoutDetails(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={affiliate.balancePending < 20}
                    className={`w-full py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all ${
                      affiliate.balancePending >= 20
                        ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-950/60'
                        : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                    }`}
                  >
                    <CreditCard className="w-4 h-4" />
                    <span>Solicitar Retirada ({affiliate.balancePending.toFixed(2)} €)</span>
                  </button>
                </form>
              )}
            </div>
          )}

        </div>

        {/* FOOTER */}
        <div className="px-6 py-4 bg-[#1E293B] border-t border-slate-700 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <Instagram className="w-4 h-4 text-pink-400" />
            <span>Conectado como <strong>{affiliate.instagram}</strong></span>
          </div>
          <div className="flex items-center gap-3">
            <a
              href="https://wa.me/34686478561?text=Hola,%20soy%20afiliado%20de%20RESEO%20STUDIO%20y%20tengo%20una%20duda"
              target="_blank"
              rel="noopener noreferrer"
              className="text-emerald-400 hover:underline flex items-center gap-1"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>Soporte Creadores WhatsApp</span>
            </a>
          </div>
        </div>

      </div>
    </div>
  );
};
