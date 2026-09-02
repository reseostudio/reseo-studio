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
  Check,
  Package,
  Truck
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
  const [step, setStep] = useState<1 | 2 | 3>(1);

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

  // Pricing Calculation
  const calculateTotal = () => {
    let basePrice = 0;

    if (selectedPackType === 'mostrador') {
      basePrice = 59 + Math.max(0, numExpositores - 1) * 30;
      if (numTarjetas === 1) basePrice += 30;
      else if (numTarjetas === 2) basePrice += 55;
      else if (numTarjetas === 3) basePrice += 75;
      else if (numTarjetas >= 4 && numTarjetas < 10) basePrice += numTarjetas * 22;
      else if (numTarjetas >= 10) basePrice += numTarjetas * 19;
    } else if (selectedPackType === 'equipo') {
      basePrice = 99 + Math.max(0, numExpositores - 1) * 30;
      const extraCards = Math.max(0, numTarjetas - 2);
      if (extraCards === 1) basePrice += 25;
      else if (extraCards === 2) basePrice += 45;
      else if (extraCards === 3) basePrice += 60;
      else if (extraCards >= 4) basePrice += extraCards * 18;
    } else if (selectedPackType === 'gran-equipo') {
      basePrice = 159 + Math.max(0, numExpositores - 1) * 30;
      const extraCards = Math.max(0, numTarjetas - 5);
      if (extraCards > 0) basePrice += extraCards * 17;
    }

    if (designOption === 'custom') {
      basePrice += 39;
    }

    return basePrice;
  };

  const subtotal = calculateTotal();
  const discount = couponApplied ? Math.round((subtotal * couponDiscountPercent) / 100) : 0;
  const finalPrice = subtotal - discount;

  // Apply Coupon
  const handleApplyCoupon = () => {
    const code = couponCode.trim().toUpperCase();
    if (code.startsWith('FOODIE') || code.includes('20')) {
      setCouponApplied(true);
      setCouponDiscountPercent(5);
      alert('✅ Cupón aplicado: 5% de descuento');
    } else {
      alert('❌ Cupón no válido');
      setCouponApplied(false);
      setCouponDiscountPercent(0);
    }
  };

  // Handle Logo Upload
  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Submit Order
  const handleSubmitOrder = async (method: 'tarjeta' | 'bizum' | 'whatsapp') => {
    setIsSubmitting(true);

    // Save to localStorage
    const orderData = {
      id: Date.now().toString(),
      negocio: bizName,
      contacto: contactPerson,
      telefono: contactPhone,
      email: contactEmail,
      direccion: shippingAddress,
      status: 'nuevo',
      pack: `${selectedPackType} (${numExpositores} exp, ${numTarjetas} tarj)`,
      total: finalPrice,
      cupon: couponApplied ? couponCode : '',
      timestamp: new Date().toISOString(),
      demoSent: false,
      notes: notes
    };

    try {
      // Save to backend API
      await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData)
      });

      if (method === 'whatsapp') {
        const mensaje = `🎯 *Nuevo Pedido RESEO STUDIO*

📦 *Productos:*
• ${numExpositores} Expositor(es) NFC
• ${numTarjetas} Tarjeta(s) NFC
• Diseño: ${designOption === 'custom' ? 'Personalizado (+39€)' : 'Estándar con logo'}

🏢 *Negocio:*
${bizName}

📍 *Dirección de envío:*
${shippingAddress}

💰 *Total:* ${finalPrice}€${couponApplied ? ` (con cupón ${couponCode}: -${discount}€)` : ''}

👤 *Contacto:*
${contactPerson}
${contactPhone}
${contactEmail}

📝 *Notas:*
${notes || 'Sin notas adicionales'}

${bizMapsUrl ? `🗺️ *Google Maps:*\n${bizMapsUrl}` : ''}`;

        const whatsappUrl = `https://wa.me/34XXXXXXXXX?text=${encodeURIComponent(mensaje)}`;
        window.open(whatsappUrl, '_blank');
      }

      setIsSuccess(true);
    } catch (error) {
      console.error('Error al enviar pedido:', error);
      alert('Error al procesar el pedido. Inténtalo de nuevo.');
    }

    setIsSubmitting(false);
  };

  if (!isOpen) return null;

  if (isSuccess) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
        <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl p-8 text-center">
          <div className="w-16 h-16 bg-[#047857] rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="w-10 h-10 text-white" />
          </div>
          <h3 className="text-2xl font-black text-[#141311] mb-2">¡Pedido Recibido!</h3>
          <p className="text-[#57534E] mb-6">
            Hemos recibido tu configuración para <strong>{bizName}</strong> por un importe de <strong>{finalPrice}€</strong>.
          </p>
          <div className="bg-[#F3F1EC] rounded-2xl p-4 mb-6 text-sm text-[#57534E] space-y-2">
            <div className="flex justify-between"><span>Expositores:</span> <strong>{numExpositores}</strong></div>
            <div className="flex justify-between"><span>Tarjetas:</span> <strong>{numTarjetas}</strong></div>
            <div className="flex justify-between"><span>Diseño:</span> <strong>{designOption === 'custom' ? 'Personalizado' : 'Estándar'}</strong></div>
            {couponApplied && <div className="flex justify-between text-[#C27803]"><span>Descuento:</span> <strong>-{discount}€</strong></div>}
          </div>
          <button
            onClick={() => { setIsSuccess(false); onClose(); }}
            className="w-full py-3 bg-[#141311] hover:bg-[#2D2C28] text-white rounded-xl font-bold transition-colors"
          >
            Cerrar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-[#FAF9F6]">
      <div className="min-h-screen">
        {/* HEADER */}
        <div className="sticky top-0 z-10 bg-white border-b border-[#E7E4DC] px-4 sm:px-6 py-4">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#141311] text-white rounded-lg flex items-center justify-center font-black text-lg">
                RS
              </div>
              <div>
                <h2 className="text-lg font-black text-[#141311]">Configurar Pedido</h2>
                <p className="text-xs text-[#78716C]">Paso {step} de 3</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-10 h-10 rounded-full hover:bg-[#F3F1EC] flex items-center justify-center transition-colors"
            >
              <X className="w-5 h-5 text-[#57534E]" />
            </button>
          </div>
        </div>

        {/* MAIN CONTENT - Shopify Style 2 Columns */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

            {/* LEFT COLUMN - Form */}
            <div className="space-y-6">

              {/* STEP 1: Product Configuration */}
              {step === 1 && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-bold text-[#141311] mb-2">Elige tu pack</h3>
                    <p className="text-sm text-[#78716C]">Selecciona el pack que mejor se adapte a tu negocio</p>
                  </div>

                  {/* Pack Options */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <button
                      onClick={() => { setSelectedPackType('mostrador'); setNumExpositores(1); setNumTarjetas(0); }}
                      className={`p-4 rounded-xl border-2 text-left transition-all ${
                        selectedPackType === 'mostrador'
                          ? 'border-[#047857] bg-[#F0FDF4] shadow-lg'
                          : 'border-[#E7E4DC] bg-white hover:border-[#D6D3CD]'
                      }`}
                    >
                      <div className="text-2xl font-black text-[#141311] mb-1">59€</div>
                      <div className="text-xs font-bold text-[#57534E] mb-2">Pack Mostrador</div>
                      <div className="text-xs text-[#78716C]">1 Expositor NFC</div>
                    </button>

                    <button
                      onClick={() => { setSelectedPackType('equipo'); setNumExpositores(1); setNumTarjetas(2); }}
                      className={`p-4 rounded-xl border-2 text-left transition-all relative ${
                        selectedPackType === 'equipo'
                          ? 'border-[#047857] bg-[#F0FDF4] shadow-lg'
                          : 'border-[#E7E4DC] bg-white hover:border-[#D6D3CD]'
                      }`}
                    >
                      <div className="absolute -top-2 right-2 px-2 py-0.5 rounded-full bg-[#C27803] text-white text-[10px] font-bold">
                        MÁS POPULAR
                      </div>
                      <div className="text-2xl font-black text-[#141311] mb-1">99€</div>
                      <div className="text-xs font-bold text-[#57534E] mb-2">Pack Equipo</div>
                      <div className="text-xs text-[#78716C]">1 Expositor + 2 Tarjetas</div>
                    </button>

                    <button
                      onClick={() => { setSelectedPackType('gran-equipo'); setNumExpositores(1); setNumTarjetas(5); }}
                      className={`p-4 rounded-xl border-2 text-left transition-all ${
                        selectedPackType === 'gran-equipo'
                          ? 'border-[#047857] bg-[#F0FDF4] shadow-lg'
                          : 'border-[#E7E4DC] bg-white hover:border-[#D6D3CD]'
                      }`}
                    >
                      <div className="text-2xl font-black text-[#141311] mb-1">159€</div>
                      <div className="text-xs font-bold text-[#57534E] mb-2">Pack Gran Equipo</div>
                      <div className="text-xs text-[#78716C]">1 Expositor + 5 Tarjetas</div>
                    </button>
                  </div>

                  {/* Quantity Adjusters */}
                  <div className="bg-white rounded-xl border border-[#E7E4DC] p-6 space-y-4">
                    <div>
                      <label className="block text-sm font-bold text-[#141311] mb-2">Expositores</label>
                      <div className="flex items-center gap-4">
                        <button
                          onClick={() => setNumExpositores(Math.max(1, numExpositores - 1))}
                          className="w-10 h-10 rounded-lg border border-[#E7E4DC] hover:bg-[#F3F1EC] flex items-center justify-center transition-colors"
                        >
                          <Minus className="w-4 h-4 text-[#57534E]" />
                        </button>
                        <span className="text-2xl font-bold text-[#141311] w-12 text-center">{numExpositores}</span>
                        <button
                          onClick={() => setNumExpositores(numExpositores + 1)}
                          className="w-10 h-10 rounded-lg border border-[#E7E4DC] hover:bg-[#F3F1EC] flex items-center justify-center transition-colors"
                        >
                          <Plus className="w-4 h-4 text-[#57534E]" />
                        </button>
                        {numExpositores > 1 && (
                          <span className="text-xs text-[#78716C]">+{(numExpositores - 1) * 30}€</span>
                        )}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-[#141311] mb-2">Tarjetas NFC</label>
                      <div className="flex items-center gap-4">
                        <button
                          onClick={() => setNumTarjetas(Math.max(0, numTarjetas - 1))}
                          className="w-10 h-10 rounded-lg border border-[#E7E4DC] hover:bg-[#F3F1EC] flex items-center justify-center transition-colors"
                        >
                          <Minus className="w-4 h-4 text-[#57534E]" />
                        </button>
                        <span className="text-2xl font-bold text-[#141311] w-12 text-center">{numTarjetas}</span>
                        <button
                          onClick={() => setNumTarjetas(numTarjetas + 1)}
                          className="w-10 h-10 rounded-lg border border-[#E7E4DC] hover:bg-[#F3F1EC] flex items-center justify-center transition-colors"
                        >
                          <Plus className="w-4 h-4 text-[#57534E]" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Design Option */}
                  <div className="bg-white rounded-xl border border-[#E7E4DC] p-6">
                    <label className="block text-sm font-bold text-[#141311] mb-3">Diseño</label>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        onClick={() => setDesignOption('standard')}
                        className={`p-4 rounded-lg border-2 text-left transition-all ${
                          designOption === 'standard'
                            ? 'border-[#047857] bg-[#F0FDF4]'
                            : 'border-[#E7E4DC] hover:border-[#D6D3CD]'
                        }`}
                      >
                        <div className="text-sm font-bold text-[#141311]">Con tu logo</div>
                        <div className="text-xs text-[#78716C] mt-1">Gratis</div>
                      </button>
                      <button
                        onClick={() => setDesignOption('custom')}
                        className={`p-4 rounded-lg border-2 text-left transition-all ${
                          designOption === 'custom'
                            ? 'border-[#047857] bg-[#F0FDF4]'
                            : 'border-[#E7E4DC] hover:border-[#D6D3CD]'
                        }`}
                      >
                        <div className="text-sm font-bold text-[#141311]">Diseño a medida</div>
                        <div className="text-xs text-[#C27803] mt-1">+39€</div>
                      </button>
                    </div>
                  </div>

                  <button
                    onClick={() => setStep(2)}
                    className="w-full py-4 bg-[#047857] hover:bg-[#065F46] text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-colors shadow-sm"
                  >
                    <span>Continuar con tus datos</span>
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </div>
              )}

              {/* STEP 2: Business Info */}
              {step === 2 && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-bold text-[#141311] mb-2">Información de tu negocio</h3>
                    <p className="text-sm text-[#78716C]">Para configurar y enviar tu pedido</p>
                  </div>

                  <div className="bg-white rounded-xl border border-[#E7E4DC] p-6 space-y-4">
                    <div>
                      <label className="block text-sm font-bold text-[#141311] mb-2">Nombre del negocio *</label>
                      <input
                        type="text"
                        value={bizName}
                        onChange={(e) => setBizName(e.target.value)}
                        placeholder="Restaurante La Taberna"
                        className="w-full px-4 py-3 rounded-lg border border-[#E7E4DC] text-[#141311] placeholder-[#A8A29E] focus:outline-none focus:ring-2 focus:ring-[#047857] focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-[#141311] mb-2">URL de Google Maps *</label>
                      <input
                        type="url"
                        value={bizMapsUrl}
                        onChange={(e) => setBizMapsUrl(e.target.value)}
                        placeholder="https://maps.google.com/..."
                        className="w-full px-4 py-3 rounded-lg border border-[#E7E4DC] text-[#141311] placeholder-[#A8A29E] focus:outline-none focus:ring-2 focus:ring-[#047857] focus:border-transparent"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-bold text-[#141311] mb-2">Persona de contacto *</label>
                        <input
                          type="text"
                          value={contactPerson}
                          onChange={(e) => setContactPerson(e.target.value)}
                          placeholder="Juan Pérez"
                          className="w-full px-4 py-3 rounded-lg border border-[#E7E4DC] text-[#141311] placeholder-[#A8A29E] focus:outline-none focus:ring-2 focus:ring-[#047857] focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-[#141311] mb-2">WhatsApp / Teléfono *</label>
                        <input
                          type="tel"
                          value={contactPhone}
                          onChange={(e) => setContactPhone(e.target.value)}
                          placeholder="+34 600 000 000"
                          className="w-full px-4 py-3 rounded-lg border border-[#E7E4DC] text-[#141311] placeholder-[#A8A29E] focus:outline-none focus:ring-2 focus:ring-[#047857] focus:border-transparent"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-[#141311] mb-2">Email para factura *</label>
                      <input
                        type="email"
                        value={contactEmail}
                        onChange={(e) => setContactEmail(e.target.value)}
                        placeholder="contacto@tunegocio.com"
                        className="w-full px-4 py-3 rounded-lg border border-[#E7E4DC] text-[#141311] placeholder-[#A8A29E] focus:outline-none focus:ring-2 focus:ring-[#047857] focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-[#141311] mb-2">Dirección de entrega *</label>
                      <textarea
                        value={shippingAddress}
                        onChange={(e) => setShippingAddress(e.target.value)}
                        placeholder="Calle Principal 123, 28001 Madrid"
                        rows={2}
                        className="w-full px-4 py-3 rounded-lg border border-[#E7E4DC] text-[#141311] placeholder-[#A8A29E] focus:outline-none focus:ring-2 focus:ring-[#047857] focus:border-transparent resize-none"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-[#141311] mb-2">Tu logotipo (opcional)</label>
                      <div className="border-2 border-dashed border-[#E7E4DC] rounded-lg p-6 text-center">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleLogoChange}
                          className="hidden"
                          id="logo-upload"
                        />
                        <label htmlFor="logo-upload" className="cursor-pointer">
                          {logoPreview ? (
                            <img src={logoPreview} alt="Logo" className="max-h-24 mx-auto rounded" />
                          ) : (
                            <div>
                              <Upload className="w-8 h-8 text-[#A8A29E] mx-auto mb-2" />
                              <p className="text-sm text-[#78716C]">Sube tu logo (PNG, JPG)</p>
                            </div>
                          )}
                        </label>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={() => setStep(1)}
                      className="flex-1 py-4 bg-white border border-[#E7E4DC] hover:bg-[#F3F1EC] text-[#141311] rounded-xl font-bold transition-colors"
                    >
                      Volver
                    </button>
                    <button
                      onClick={() => setStep(3)}
                      disabled={!bizName || !contactPerson || !contactPhone || !contactEmail || !shippingAddress}
                      className="flex-1 py-4 bg-[#047857] hover:bg-[#065F46] text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <span>Revisar pedido</span>
                      <ArrowRight className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 3: Review & Payment */}
              {step === 3 && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-bold text-[#141311] mb-2">Confirmar y pagar</h3>
                    <p className="text-sm text-[#78716C]">Revisa tu pedido antes de finalizar</p>
                  </div>

                  {/* Order Summary */}
                  <div className="bg-white rounded-xl border border-[#E7E4DC] p-6 space-y-4">
                    <div className="flex items-start gap-4 pb-4 border-b border-[#E7E4DC]">
                      <Package className="w-6 h-6 text-[#047857] flex-shrink-0 mt-1" />
                      <div className="flex-1">
                        <div className="font-bold text-[#141311] mb-1">Productos</div>
                        <div className="text-sm text-[#57534E] space-y-1">
                          <div>• {numExpositores} Expositor(es) NFC</div>
                          <div>• {numTarjetas} Tarjeta(s) NFC</div>
                          <div>• Diseño {designOption === 'custom' ? 'personalizado' : 'estándar con logo'}</div>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-start gap-4 pb-4 border-b border-[#E7E4DC]">
                      <Building className="w-6 h-6 text-[#047857] flex-shrink-0 mt-1" />
                      <div className="flex-1">
                        <div className="font-bold text-[#141311] mb-1">{bizName}</div>
                        <div className="text-sm text-[#57534E] space-y-1">
                          <div>{contactPerson} • {contactPhone}</div>
                          <div>{contactEmail}</div>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <Truck className="w-6 h-6 text-[#047857] flex-shrink-0 mt-1" />
                      <div className="flex-1">
                        <div className="font-bold text-[#141311] mb-1">Envío gratis 24-48h</div>
                        <div className="text-sm text-[#57534E]">{shippingAddress}</div>
                      </div>
                    </div>
                  </div>

                  {/* Coupon */}
                  <div className="bg-white rounded-xl border border-[#E7E4DC] p-6">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Código de cupón"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                        className="flex-1 px-4 py-3 rounded-lg border border-[#E7E4DC] text-[#141311] placeholder-[#A8A29E] focus:outline-none focus:ring-2 focus:ring-[#047857] focus:border-transparent font-mono text-sm"
                      />
                      <button
                        onClick={handleApplyCoupon}
                        className="px-6 py-3 bg-[#C27803] hover:bg-[#A36403] text-white rounded-lg font-bold transition-colors whitespace-nowrap"
                      >
                        {couponApplied ? '✓ Aplicado' : 'Aplicar'}
                      </button>
                    </div>
                  </div>

                  {/* Payment Buttons */}
                  <div className="space-y-3">
                    <button
                      onClick={() => handleSubmitOrder('tarjeta')}
                      disabled={isSubmitting}
                      className="w-full py-4 bg-[#047857] hover:bg-[#065F46] text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-colors shadow-lg disabled:opacity-50"
                    >
                      <CreditCard className="w-5 h-5" />
                      <span className="hidden sm:inline">Confirmar y Pagar con Tarjeta / Bizum</span>
                      <span className="sm:hidden">Pagar {finalPrice}€</span>
                    </button>

                    <button
                      onClick={() => handleSubmitOrder('whatsapp')}
                      disabled={isSubmitting}
                      className="w-full py-4 bg-white border-2 border-[#E7E4DC] hover:bg-[#F3F1EC] text-[#141311] rounded-xl font-bold flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
                    >
                      <MessageCircle className="w-5 h-5 text-[#25D366]" />
                      <span>Enviar por WhatsApp</span>
                    </button>

                    <button
                      onClick={() => setStep(2)}
                      className="w-full py-3 text-[#57534E] hover:text-[#141311] font-bold transition-colors"
                    >
                      ← Volver
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* RIGHT COLUMN - Order Summary Sticky */}
            <div className="lg:sticky lg:top-24 lg:self-start">
              <div className="bg-[#F3F1EC] rounded-2xl border border-[#E7E4DC] p-6 sticky top-24">
                <h4 className="text-lg font-bold text-[#141311] mb-4">Resumen del pedido</h4>

                <div className="space-y-3 mb-6 pb-6 border-b border-[#E7E4DC]">
                  <div className="flex justify-between text-sm">
                    <span className="text-[#57534E]">Pack base</span>
                    <span className="font-bold text-[#141311]">
                      {selectedPackType === 'mostrador' ? '59€' : selectedPackType === 'equipo' ? '99€' : '159€'}
                    </span>
                  </div>

                  {numExpositores > 1 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-[#57534E]">Expositores extra ({numExpositores - 1})</span>
                      <span className="font-bold text-[#141311]">+{(numExpositores - 1) * 30}€</span>
                    </div>
                  )}

                  {selectedPackType === 'mostrador' && numTarjetas > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-[#57534E]">Tarjetas NFC ({numTarjetas})</span>
                      <span className="font-bold text-[#141311]">
                        +{numTarjetas === 1 ? 30 : numTarjetas === 2 ? 55 : numTarjetas === 3 ? 75 : numTarjetas >= 4 && numTarjetas < 10 ? numTarjetas * 22 : numTarjetas * 19}€
                      </span>
                    </div>
                  )}

                  {selectedPackType === 'equipo' && numTarjetas > 2 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-[#57534E]">Tarjetas extra ({numTarjetas - 2})</span>
                      <span className="font-bold text-[#141311]">
                        +{Math.max(0, numTarjetas - 2) >= 1 ? 25 : 0}€
                      </span>
                    </div>
                  )}

                  {designOption === 'custom' && (
                    <div className="flex justify-between text-sm">
                      <span className="text-[#57534E]">Diseño personalizado</span>
                      <span className="font-bold text-[#141311]">+39€</span>
                    </div>
                  )}

                  {couponApplied && (
                    <div className="flex justify-between text-sm text-[#C27803]">
                      <span className="font-bold">Descuento ({couponCode})</span>
                      <span className="font-bold">-{discount}€</span>
                    </div>
                  )}
                </div>

                <div className="flex justify-between items-center mb-6">
                  <span className="text-lg font-bold text-[#141311]">Total</span>
                  <span className="text-3xl font-black text-[#047857]">{finalPrice}€</span>
                </div>

                <div className="space-y-3 text-xs text-[#78716C]">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#047857]" />
                    <span>Envío gratis 24-48h</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#047857]" />
                    <span>Configuración incluida</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#047857]" />
                    <span>14 días garantía o devolución</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-[#047857]" />
                    <span>Pago 100% seguro</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};
