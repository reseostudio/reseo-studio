import React, { useState, useEffect } from 'react';
import {
  X,
  Calculator,
  Building,
  MapPin,
  User,
  Phone,
  Mail,
  Upload,
  CreditCard,
  MessageCircle,
  CheckCircle2,
  Sparkles,
  ShieldCheck,
  Tag,
  ArrowRight,
  Plus,
  Minus,
  Check
} from 'lucide-react';

interface QuoteConfiguratorModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialPack?: string;
}

export const QuoteConfiguratorModal: React.FC<QuoteConfiguratorModalProps> = ({
  isOpen,
  onClose,
  initialPack = 'pack-mostrador'
}) => {
  // Step State
  const [step, setStep] = useState<1 | 2 | 3>(1); // 1: Config, 2: Info & Logo, 3: Summary & Pay

  // Product Configuration
  const [selectedPackType, setSelectedPackType] = useState<'mostrador' | 'equipo' | 'gran-equipo' | 'personalizado'>('mostrador');
  const [numExpositores, setNumExpositores] = useState<number>(1);
  const [numTarjetas, setNumTarjetas] = useState<number>(0);
  const [designOption, setDesignOption] = useState<'standard' | 'custom'>('standard');

  // Business and Contact Details
  const [bizName, setBizName] = useState('');
  const [bizMapsUrl, setBizMapsUrl] = useState('');
  const [contactPerson, setContactPerson] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [shippingAddress, setShippingAddress] = useState('');
  const [notes, setNotes] = useState('');

  // Logo file
  const [logoPreview, setLogoPreview] = useState<string | null>(null);

  // Coupon
  const [couponCode, setCouponCode] = useState('');
  const [couponApplied, setCouponApplied] = useState(false);
  const [couponDiscountPercent, setCouponDiscountPercent] = useState(0);

  // Submission / Success
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Set initial pack configuration
  useEffect(() => {
    if (initialPack?.includes('equipo') || initialPack?.includes('99')) {
      setSelectedPackType('equipo');
      setNumExpositores(1);
      setNumTarjetas(2);
    } else if (initialPack?.includes('gran') || initialPack?.includes('159')) {
      setSelectedPackType('gran-equipo');
      setNumExpositores(1);
      setNumTarjetas(5);
    } else {
      setSelectedPackType('mostrador');
      setNumExpositores(1);
      setNumTarjetas(0);
    }
  }, [initialPack]);

  // Pricing Calculation Rules
  // 1 Expositor = 59€
  // Cada expositor extra = +30€
  // Tarjetas: 1x = 30€, 3x = 75€, 5x = 110€, 10x = 190€
  const calculateTotal = () => {
    let basePrice = 0;

    if (selectedPackType === 'mostrador') {
      basePrice = 59 + Math.max(0, numExpositores - 1) * 30;
      // Extra cards
      if (numTarjetas === 1) basePrice += 30;
      else if (numTarjetas === 2) basePrice += 55;
      else if (numTarjetas === 3) basePrice += 75;
      else if (numTarjetas >= 4 && numTarjetas < 10) basePrice += numTarjetas * 22;
      else if (numTarjetas >= 10) basePrice += numTarjetas * 19;
    } else if (selectedPackType === 'equipo') {
      // Pack 99€ includes 1 exp + 2 cards
      basePrice = 99 + Math.max(0, numExpositores - 1) * 30;
      const extraCards = Math.max(0, numTarjetas - 2);
      if (extraCards === 1) basePrice += 25;
      else if (extraCards > 1) basePrice += extraCards * 20;
    } else if (selectedPackType === 'gran-equipo') {
      // Pack 159€ includes 1 exp + 5 cards
      basePrice = 159 + Math.max(0, numExpositores - 1) * 30;
      const extraCards = Math.max(0, numTarjetas - 5);
      if (extraCards > 0) basePrice += extraCards * 19;
    } else {
      // Custom
      basePrice = numExpositores > 0 ? 59 + (numExpositores - 1) * 30 : 0;
      if (numTarjetas === 1) basePrice += 30;
      else if (numTarjetas === 2) basePrice += 55;
      else if (numTarjetas === 3) basePrice += 75;
      else if (numTarjetas >= 4) basePrice += numTarjetas * 20;
    }

    if (designOption === 'custom') {
      basePrice += 39;
    }

    const discount = couponApplied ? basePrice * (couponDiscountPercent / 100) : 0;
    const finalPrice = Math.max(0, basePrice - discount);

    return {
      basePrice,
      discount,
      finalPrice
    };
  };

  const { basePrice, discount, finalPrice } = calculateTotal();

  const handleApplyCoupon = () => {
    const clean = couponCode.trim().toUpperCase();
    if (clean.length >= 3) {
      setCouponApplied(true);
      setCouponDiscountPercent(5); // 5% discount for customers using affiliate coupons
    }
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setLogoPreview(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmitOrder = async (method: 'tarjeta' | 'bizum' | 'whatsapp') => {
    setIsSubmitting(true);

    const orderData = {
      id: 'ORD-' + Date.now().toString().slice(-6),
      fecha: new Date().toISOString(),
      negocio: bizName || 'Negocio sin especificar',
      contacto: contactPerson,
      telefono: contactPhone,
      email: contactEmail,
      direccion: shippingAddress,
      mapsUrl: bizMapsUrl,
      pack: selectedPackType,
      expositores: numExpositores,
      tarjetas: numTarjetas,
      diseno: designOption === 'standard' ? 'Estándar con Logo (Incluido)' : 'Custom a Medida (+39€)',
      cupon: couponApplied ? couponCode : null,
      total: finalPrice.toFixed(2),
      metodoPago: method,
      notas: notes
    };

    try {
      // Save lead/order to server CRM
      await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...orderData,
          tipo: 'Presupuesto Directo / Pedido Online',
          origen: `Configurador Web ${couponApplied ? `(Afiliado: ${couponCode})` : ''}`
        })
      });
    } catch (e) {
      console.warn('Local save backup:', e);
    }

    if (method === 'whatsapp') {
      const msg = `*NUEVO PEDIDO // PRESUPUESTO RESEO STUDIO*\n\n` +
        `🏢 *Negocio:* ${bizName}\n` +
        `👤 *Contacto:* ${contactPerson} (${contactPhone})\n` +
        `📍 *Google Maps:* ${bizMapsUrl || 'A indicar'}\n` +
        `📦 *Pack:* ${selectedPackType.toUpperCase()} (${numExpositores} Expositor(es) + ${numTarjetas} Tarjetas)\n` +
        `🎨 *Diseño:* ${designOption === 'standard' ? 'Estándar con mi Logo' : 'Custom'}\n` +
        `🏷️ *Cupón:* ${couponApplied ? couponCode : 'Ninguno'}\n` +
        `💰 *TOTAL:* ${finalPrice.toFixed(2)} € (Envío incluido)\n\n` +
        `Por favor confírmenme para enviar datos de facturación y muestra de diseño.`;

      window.open(`https://wa.me/34686478561?text=${encodeURIComponent(msg)}`, '_blank');
    }

    setIsSubmitting(false);
    setIsSuccess(true);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-[#0F172A] border border-slate-700/80 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* HEADER */}
        <div className="px-6 py-4 bg-[#1E293B] border-b border-slate-700 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-emerald-500 flex items-center justify-center text-white font-black shadow-lg">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
                Configurador de Pedido & Presupuesto
              </h2>
              <p className="text-xs text-slate-400">
                100% Personalizado con tu Logo y Ficha de Google • Listo en 24/48h
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

        {/* PROGRESS STEPS BAR */}
        {!isSuccess && (
          <div className="px-6 py-3 bg-[#131E32] border-b border-slate-800 flex items-center justify-between text-xs font-bold">
            <button
              onClick={() => setStep(1)}
              className={`flex items-center gap-1.5 ${step >= 1 ? 'text-blue-400' : 'text-slate-500'}`}
            >
              <span className="w-5 h-5 rounded-full bg-blue-500/20 flex items-center justify-center border border-blue-500/40">1</span>
              <span>1. Configurar Pack</span>
            </button>
            <div className="w-8 h-0.5 bg-slate-700"></div>
            <button
              onClick={() => setStep(2)}
              className={`flex items-center gap-1.5 ${step >= 2 ? 'text-blue-400' : 'text-slate-500'}`}
            >
              <span className="w-5 h-5 rounded-full bg-blue-500/20 flex items-center justify-center border border-blue-500/40">2</span>
              <span>2. Datos & Logo</span>
            </button>
            <div className="w-8 h-0.5 bg-slate-700"></div>
            <button
              onClick={() => setStep(3)}
              className={`flex items-center gap-1.5 ${step >= 3 ? 'text-emerald-400' : 'text-slate-500'}`}
            >
              <span className="w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center border border-emerald-500/40">3</span>
              <span>3. Resumen & Pago</span>
            </button>
          </div>
        )}

        {/* BODY CONTENT */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">

          {isSuccess ? (
            /* SUCCESS CONFIRMATION SCREEN */
            <div className="text-center py-8 space-y-4 max-w-md mx-auto">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 border-2 border-emerald-500 text-emerald-400 flex items-center justify-center mx-auto shadow-xl">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h3 className="text-2xl font-black text-white">¡Presupuesto / Pedido Registrado!</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Hemos recibido tu configuración para <strong>{bizName || 'tu negocio'}</strong> por un importe de <strong>{finalPrice.toFixed(2)} €</strong>.
              </p>
              <div className="bg-[#1E293B] border border-slate-700 rounded-2xl p-4 text-xs text-left text-slate-300 space-y-2">
                <div className="flex justify-between"><span>Expositores:</span> <strong className="text-white">{numExpositores} ud(s)</strong></div>
                <div className="flex justify-between"><span>Tarjetas de Personal:</span> <strong className="text-white">{numTarjetas} ud(s)</strong></div>
                <div className="flex justify-between"><span>Diseño:</span> <strong className="text-white">{designOption === 'standard' ? 'Estándar con Logo' : 'Custom'}</strong></div>
                <div className="flex justify-between border-t border-slate-700 pt-2 font-bold text-sm text-emerald-400">
                  <span>Total Final:</span> <span>{finalPrice.toFixed(2)} €</span>
                </div>
              </div>

              <div className="pt-2 flex flex-col gap-2">
                <a
                  href={`https://wa.me/34686478561?text=Hola,%20acabo%20de%20completar%20el%20presupuesto%20para%20${encodeURIComponent(bizName)}%20(${finalPrice.toFixed(2)}€).%20Quiero%20iniciar%20producción.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Contactar por WhatsApp para Enviar Logo HD</span>
                </a>

                <button
                  onClick={onClose}
                  className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold"
                >
                  Cerrar Ventana
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* STEP 1: CONFIGURATION */}
              {step === 1 && (
                <div className="space-y-6">
                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-3">
                      1. Selecciona tu Formato Principal:
                    </label>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {/* Pack 1 */}
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedPackType('mostrador');
                          setNumExpositores(1);
                          setNumTarjetas(0);
                        }}
                        className={`p-4 rounded-2xl border text-left transition-all ${
                          selectedPackType === 'mostrador'
                            ? 'bg-blue-600/20 border-blue-500 shadow-lg shadow-blue-950/50'
                            : 'bg-[#1E293B] border-slate-800 hover:border-slate-700'
                        }`}
                      >
                        <div className="flex justify-between items-start mb-2">
                          <span className="text-xs font-bold text-white">Mostrador Pro</span>
                          <span className="text-base font-black text-blue-400">59 €</span>
                        </div>
                        <p className="text-[11px] text-slate-400">1 Expositor NFC para barra o mostrador principal.</p>
                      </button>

                      {/* Pack 2 */}
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedPackType('equipo');
                          setNumExpositores(1);
                          setNumTarjetas(2);
                        }}
                        className={`p-4 rounded-2xl border text-left transition-all relative ${
                          selectedPackType === 'equipo'
                            ? 'bg-emerald-600/20 border-emerald-500 shadow-lg shadow-emerald-950/50'
                            : 'bg-[#1E293B] border-slate-800 hover:border-slate-700'
                        }`}
                      >
                        <div className="absolute -top-2.5 right-3 px-2 py-0.5 rounded-full bg-emerald-500 text-[10px] font-black text-white uppercase">
                          Más Vendido
                        </div>
                        <div className="flex justify-between items-start mb-2">
                          <span className="text-xs font-bold text-white">Comercio + Equipo</span>
                          <span className="text-base font-black text-emerald-400">99 €</span>
                        </div>
                        <p className="text-[11px] text-slate-400">1 Expositor + 2 Tarjetas de bolsillo para personal.</p>
                      </button>

                      {/* Pack 3 */}
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedPackType('gran-equipo');
                          setNumExpositores(1);
                          setNumTarjetas(5);
                        }}
                        className={`p-4 rounded-2xl border text-left transition-all ${
                          selectedPackType === 'gran-equipo'
                            ? 'bg-purple-600/20 border-purple-500 shadow-lg shadow-purple-950/50'
                            : 'bg-[#1E293B] border-slate-800 hover:border-slate-700'
                        }`}
                      >
                        <div className="flex justify-between items-start mb-2">
                          <span className="text-xs font-bold text-white">Gran Equipo</span>
                          <span className="text-base font-black text-purple-400">159 €</span>
                        </div>
                        <p className="text-[11px] text-slate-400">1 Expositor + 5 Tarjetas para plantillas amplias.</p>
                      </button>
                    </div>
                  </div>

                  {/* UNITS CUSTOMIZER */}
                  <div className="bg-[#1E293B] border border-slate-800 rounded-2xl p-4 space-y-4">
                    <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center justify-between">
                      <span>2. Ajustar Unidades Físicas:</span>
                      <span className="text-emerald-400 text-[11px]">+30 € por Expositor Extra</span>
                    </h4>

                    {/* Expositores Counter */}
                    <div className="flex items-center justify-between py-2 border-b border-slate-800">
                      <div>
                        <span className="text-xs font-bold text-white block">Expositores de Mostrador (120x140mm)</span>
                        <span className="text-[11px] text-slate-400">Base 59€ / Extras a solo 30€/ud</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() => setNumExpositores(Math.max(1, numExpositores - 1))}
                          className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-white flex items-center justify-center font-bold"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="text-sm font-black text-white w-6 text-center">{numExpositores}</span>
                        <button
                          type="button"
                          onClick={() => setNumExpositores(numExpositores + 1)}
                          className="w-8 h-8 rounded-lg bg-blue-600 hover:bg-blue-500 text-white flex items-center justify-center font-bold"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Tarjetas Counter */}
                    <div className="flex items-center justify-between py-2">
                      <div>
                        <span className="text-xs font-bold text-white block">Tarjetas de Bolsillo para Empleados</span>
                        <span className="text-[11px] text-slate-400">Ideal camareros, sala y recepción</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() => setNumTarjetas(Math.max(0, numTarjetas - 1))}
                          className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-white flex items-center justify-center font-bold"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="text-sm font-black text-white w-6 text-center">{numTarjetas}</span>
                        <button
                          type="button"
                          onClick={() => setNumTarjetas(numTarjetas + 1)}
                          className="w-8 h-8 rounded-lg bg-blue-600 hover:bg-blue-500 text-white flex items-center justify-center font-bold"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* DESIGN OPTIONS */}
                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-2">
                      3. Modalidad de Diseño:
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => setDesignOption('standard')}
                        className={`p-3.5 rounded-xl border text-left transition-all ${
                          designOption === 'standard'
                            ? 'bg-blue-600/20 border-blue-500 text-white'
                            : 'bg-[#1E293B] border-slate-800 text-slate-400'
                        }`}
                      >
                        <div className="flex justify-between items-center mb-1">
                          <strong className="text-xs text-white">⭐ Estándar Oficial con tu Logo</strong>
                          <span className="text-xs font-bold text-emerald-400">0 € (Gratis)</span>
                        </div>
                        <p className="text-[10px] text-slate-400">
                          Diseño Google Reviews de alta conversión con tu logotipo integrado en la base.
                        </p>
                      </button>

                      <button
                        type="button"
                        onClick={() => setDesignOption('custom')}
                        className={`p-3.5 rounded-xl border text-left transition-all ${
                          designOption === 'custom'
                            ? 'bg-blue-600/20 border-blue-500 text-white'
                            : 'bg-[#1E293B] border-slate-800 text-slate-400'
                        }`}
                      >
                        <div className="flex justify-between items-center mb-1">
                          <strong className="text-xs text-white">🎨 Diseño 100% a Medida</strong>
                          <span className="text-xs font-bold text-amber-400">+39 €</span>
                        </div>
                        <p className="text-[10px] text-slate-400">
                          Colores, tipografías e identidad gráfica completamente personalizados.
                        </p>
                      </button>
                    </div>
                  </div>

                  {/* NEXT BUTTON */}
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg transition-all"
                  >
                    <span>Continuar a Datos del Negocio & Logo ({finalPrice.toFixed(2)} €)</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              )}

              {/* STEP 2: BUSINESS INFO & LOGO */}
              {step === 2 && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold text-slate-300 block mb-1">Nombre Comercial del Negocio *</label>
                      <input
                        type="text"
                        required
                        placeholder="Ej. Restaurante Asador Don Juan"
                        value={bizName}
                        onChange={(e) => setBizName(e.target.value)}
                        className="w-full bg-[#1E293B] border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-300 block mb-1">Enlace a Ficha Google Maps *</label>
                      <input
                        type="text"
                        required
                        placeholder="https://maps.app.goo.gl/... o dirección exacta"
                        value={bizMapsUrl}
                        onChange={(e) => setBizMapsUrl(e.target.value)}
                        className="w-full bg-[#1E293B] border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-300 block mb-1">Persona de Contacto / Cargo *</label>
                      <input
                        type="text"
                        required
                        placeholder="Ej. Juan Pérez (Gerente)"
                        value={contactPerson}
                        onChange={(e) => setContactPerson(e.target.value)}
                        className="w-full bg-[#1E293B] border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-300 block mb-1">WhatsApp / Teléfono Móvil *</label>
                      <input
                        type="tel"
                        required
                        placeholder="600 000 000"
                        value={contactPhone}
                        onChange={(e) => setContactPhone(e.target.value)}
                        className="w-full bg-[#1E293B] border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="text-xs font-bold text-slate-300 block mb-1">Email para Factura y Envío *</label>
                      <input
                        type="email"
                        required
                        placeholder="contacto@turestaurante.com"
                        value={contactEmail}
                        onChange={(e) => setContactEmail(e.target.value)}
                        className="w-full bg-[#1E293B] border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="text-xs font-bold text-slate-300 block mb-1">Dirección de Entrega Express</label>
                      <input
                        type="text"
                        placeholder="Calle, Número, Código Postal, Ciudad"
                        value={shippingAddress}
                        onChange={(e) => setShippingAddress(e.target.value)}
                        className="w-full bg-[#1E293B] border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                      />
                    </div>
                  </div>

                  {/* LOGO UPLOAD AREA */}
                  <div>
                    <label className="text-xs font-bold text-slate-300 block mb-1">Logotipo del Local (PNG/SVG/JPG)</label>
                    <div className="border-2 border-dashed border-slate-700 hover:border-blue-500 rounded-2xl p-4 bg-[#1E293B]/50 flex items-center justify-between cursor-pointer">
                      <input
                        type="file"
                        id="formLogoUpload"
                        accept="image/*"
                        onChange={handleLogoUpload}
                        className="hidden"
                      />
                      <label htmlFor="formLogoUpload" className="flex items-center gap-3 cursor-pointer flex-1">
                        <div className="w-10 h-10 rounded-xl bg-blue-600/20 text-blue-400 flex items-center justify-center font-bold">
                          <Upload className="w-5 h-5" />
                        </div>
                        <div>
                          <strong className="text-xs text-white block">
                            {logoPreview ? '✅ Logotipo Cargado con Éxito' : 'Haz clic para adjuntar tu Logotipo'}
                          </strong>
                          <span className="text-[11px] text-slate-400">
                            Lo adaptaremos a la plantilla oficial de 120x140mm
                          </span>
                        </div>
                      </label>
                      {logoPreview && (
                        <img src={logoPreview} alt="Preview" className="h-10 max-w-[80px] object-contain rounded bg-white/10 p-1" />
                      )}
                    </div>
                  </div>

                  <div className="flex gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="w-1/3 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl font-bold text-xs"
                    >
                      Atrás
                    </button>
                    <button
                      type="button"
                      onClick={() => setStep(3)}
                      className="w-2/3 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-black text-xs uppercase tracking-wider shadow-lg"
                    >
                      Ver Resumen y Finalizar
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 3: SUMMARY, COUPONS & CHECKOUT */}
              {step === 3 && (
                <div className="space-y-5">
                  {/* ORDER BREAKDOWN CARD */}
                  <div className="bg-[#1E293B] border border-slate-800 rounded-2xl p-5 space-y-3">
                    <h4 className="text-xs font-black uppercase tracking-wider text-slate-400 border-b border-slate-800 pb-2">
                      Resumen del Presupuesto
                    </h4>

                    <div className="space-y-2 text-xs text-slate-300">
                      <div className="flex justify-between">
                        <span>Expositor(es) NFC Mostrador ({numExpositores} ud):</span>
                        <span className="font-bold text-white">
                          {(59 + Math.max(0, numExpositores - 1) * 30).toFixed(2)} €
                        </span>
                      </div>

                      {numTarjetas > 0 && (
                        <div className="flex justify-between">
                          <span>Tarjetas NFC para Personal ({numTarjetas} ud):</span>
                          <span className="font-bold text-white">
                            {(basePrice - (59 + Math.max(0, numExpositores - 1) * 30) - (designOption === 'custom' ? 39 : 0)).toFixed(2)} €
                          </span>
                        </div>
                      )}

                      <div className="flex justify-between">
                        <span>Adaptación de Diseño:</span>
                        <span className="font-bold text-white">
                          {designOption === 'standard' ? '0.00 € (Incluido)' : '39.00 €'}
                        </span>
                      </div>

                      <div className="flex justify-between">
                        <span>Envío Express 24/48h Nacional:</span>
                        <span className="font-bold text-emerald-400">GRATIS (0.00 €)</span>
                      </div>

                      {couponApplied && (
                        <div className="flex justify-between text-amber-300 font-bold border-t border-slate-800 pt-2">
                          <span>Descuento Cupón ({couponCode}):</span>
                          <span>-{discount.toFixed(2)} €</span>
                        </div>
                      )}

                      <div className="flex justify-between text-base font-black text-white border-t border-slate-700 pt-3">
                        <span>TOTAL FINAL (IVA Incluido):</span>
                        <span className="text-emerald-400 font-mono text-xl">{finalPrice.toFixed(2)} €</span>
                      </div>
                    </div>
                  </div>

                  {/* COUPON INPUT */}
                  <div className="bg-[#131E32] border border-slate-800 rounded-xl p-3 flex items-center gap-2">
                    <Tag className="w-4 h-4 text-amber-400 shrink-0" />
                    <input
                      type="text"
                      placeholder="¿Tienes cupón de creador/afiliado? (Ej. FOODIE20)"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      className="bg-transparent text-xs text-white placeholder-slate-500 focus:outline-none flex-1 font-mono uppercase"
                    />
                    <button
                      type="button"
                      onClick={handleApplyCoupon}
                      className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs rounded-lg transition-colors"
                    >
                      {couponApplied ? 'Aplicado ✓' : 'Aplicar'}
                    </button>
                  </div>

                  {/* PAYMENT ACTIONS */}
                  <div className="space-y-3 pt-2">
                    <button
                      type="button"
                      disabled={isSubmitting}
                      onClick={() => handleSubmitOrder('tarjeta')}
                      className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-xl shadow-emerald-950/50 transition-all"
                    >
                      <CreditCard className="w-4 h-4" />
                      <span>Confirmar Pedido y Pagar con Tarjeta / Bizum ({finalPrice.toFixed(2)} €)</span>
                    </button>

                    <button
                      type="button"
                      disabled={isSubmitting}
                      onClick={() => handleSubmitOrder('whatsapp')}
                      className="w-full py-3 bg-[#1F2937] hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-colors"
                    >
                      <MessageCircle className="w-4 h-4 fill-emerald-500 text-emerald-500" />
                      <span>Enviar Presupuesto por WhatsApp</span>
                    </button>
                  </div>
                </div>
              )}
            </>
          )}

        </div>

      </div>
    </div>
  );
};
