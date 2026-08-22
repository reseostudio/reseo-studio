import React from 'react';

export type LegalTab = 'aviso-legal' | 'privacidad' | 'cookies' | 'terminos';

interface LegalModalProps {
  isOpen: boolean;
  activeTab: LegalTab;
  onClose: () => void;
  onTabChange: (tab: LegalTab) => void;
}

export const LegalModal: React.FC<LegalModalProps> = ({
  isOpen,
  activeTab,
  onClose,
  onTabChange,
}) => {
  if (!isOpen) return null;

  return (
    <div
      id="legal-modal-backdrop"
      className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 overflow-y-auto animate-fade-in font-['DM_Sans',sans-serif]"
      onClick={onClose}
    >
      <div
        id="legal-modal-content"
        className="bg-white border border-[#E7E4DC] w-full max-w-3xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-[#141311] text-white px-6 py-5 flex items-center justify-between border-b border-[#2A2826] shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#C27803] text-white flex items-center justify-center font-bold text-sm">
              ⚖️
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold font-['Outfit',sans-serif] tracking-[-0.03em]">
                Información Legal y Cumplimiento RGPD
              </h3>
              <p className="text-xs text-[#A8A29E]">
                RESEO STUDIO · Conforme al Reglamento (UE) 2016/679 y LOPDGDD 3/2018
              </p>
            </div>
          </div>
          <button
            id="close-legal-modal-btn"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors text-lg cursor-pointer"
            aria-label="Cerrar ventana legal"
          >
            ✕
          </button>
        </div>

        {/* Legal Navigation Tabs */}
        <div className="flex border-b border-[#E7E4DC] bg-[#FAF9F6] px-4 pt-2 overflow-x-auto gap-2 shrink-0">
          <button
            id="tab-aviso-legal"
            onClick={() => onTabChange('aviso-legal')}
            className={`px-4 py-2.5 text-xs sm:text-sm font-semibold rounded-t-lg transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === 'aviso-legal'
                ? 'bg-white text-[#C27803] border-t-2 border-[#C27803] border-x border-[#E7E4DC] shadow-xs'
                : 'text-[#78716C] hover:text-[#141311]'
            }`}
          >
            Aviso Legal
          </button>
          <button
            id="tab-privacidad"
            onClick={() => onTabChange('privacidad')}
            className={`px-4 py-2.5 text-xs sm:text-sm font-semibold rounded-t-lg transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === 'privacidad'
                ? 'bg-white text-[#C27803] border-t-2 border-[#C27803] border-x border-[#E7E4DC] shadow-xs'
                : 'text-[#78716C] hover:text-[#141311]'
            }`}
          >
            Política de Privacidad
          </button>
          <button
            id="tab-cookies"
            onClick={() => onTabChange('cookies')}
            className={`px-4 py-2.5 text-xs sm:text-sm font-semibold rounded-t-lg transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === 'cookies'
                ? 'bg-white text-[#C27803] border-t-2 border-[#C27803] border-x border-[#E7E4DC] shadow-xs'
                : 'text-[#78716C] hover:text-[#141311]'
            }`}
          >
            Política de Cookies
          </button>
          <button
            id="tab-terminos"
            onClick={() => onTabChange('terminos')}
            className={`px-4 py-2.5 text-xs sm:text-sm font-semibold rounded-t-lg transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === 'terminos'
                ? 'bg-white text-[#C27803] border-t-2 border-[#C27803] border-x border-[#E7E4DC] shadow-xs'
                : 'text-[#78716C] hover:text-[#141311]'
            }`}
          >
            Términos y Condiciones
          </button>
        </div>

        {/* Scrollable Content Body */}
        <div className="p-6 sm:p-8 overflow-y-auto text-xs sm:text-sm text-[#44403C] leading-relaxed space-y-6">
          {/* TAB 1: AVISO LEGAL */}
          {activeTab === 'aviso-legal' && (
            <div className="space-y-4 animate-fade-in">
              <h4 className="text-base sm:text-lg font-bold text-[#141311] font-['Syne',sans-serif]">
                1. Información General y Aviso Legal (LSSI-CE)
              </h4>
              <p>
                En cumplimiento del artículo 10 de la Ley 34/2002, de 11 de julio, de Servicios de la
                Sociedad de la Información y de Comercio Electrónico (LSSI-CE), se ponen a disposición
                del usuario los datos identificativos del titular del presente sitio web:
              </p>
              <div className="bg-[#FAF9F6] border border-[#E7E4DC] p-4 rounded-xl space-y-1.5 text-xs text-[#292524]">
                <p>
                  <strong>Denominación comercial:</strong> RESEO STUDIO
                </p>
                <p>
                  <strong>Actividad:</strong> Soluciones de hardware NFC y consultoría de reputación local y SEO en Google Maps.
                </p>
                <p>
                  <strong>Correo electrónico de contacto:</strong>{' '}
                  <a href="mailto:reseostudio@gmail.com" className="text-[#C27803] underline font-semibold">
                    reseostudio@gmail.com
                  </a>
                </p>
                <p>
                  <strong>WhatsApp de atención directa:</strong> +34 686 478 561
                </p>
                <p>
                  <strong>Ámbito territorial:</strong> España y Unión Europea.
                </p>
              </div>

              <h5 className="font-bold text-[#141311] pt-2">2. Propiedad Intelectual e Industrial</h5>
              <p>
                Todos los contenidos del sitio web (textos, fotografías, gráficos, tecnología, código fuente,
                logotipos, marcas y signos distintivos) son titularidad de RESEO STUDIO o de terceros que han
                autorizado su uso. Queda expresamente prohibida la reproducción, transformación, distribución o
                comunicación pública sin autorización previa por escrito.
              </p>

              <h5 className="font-bold text-[#141311] pt-2">3. Exención de Responsabilidad</h5>
              <p>
                Google™ y Google Maps™ son marcas registradas de Google LLC. RESEO STUDIO es un proveedor
                independiente de soluciones tecnológicas NFC y consultoría estratégica que programa hardware
                con enlaces oficiales provistos por Google Business Profile, sin mantener vinculación societaria
                directa con Google LLC.
              </p>
            </div>
          )}

          {/* TAB 2: POLÍTICA DE PRIVACIDAD */}
          {activeTab === 'privacidad' && (
            <div className="space-y-4 animate-fade-in">
              <h4 className="text-base sm:text-lg font-bold text-[#141311] font-['Syne',sans-serif]">
                Política de Privacidad y Protección de Datos (RGPD)
              </h4>
              <p>
                En RESEO STUDIO nos comprometemos a garantizar la seguridad y confidencialidad de tus datos
                personales conforme al Reglamento General de Protección de Datos (RGPD UE 2016/679) y a la Ley
                Orgánica 3/2018 (LOPDGDD).
              </p>

              {/* RGPD Summary Table */}
              <div className="bg-[#FAF9F6] border-2 border-[#E7E4DC] rounded-xl overflow-hidden text-xs">
                <div className="bg-[#F5F2EB] px-4 py-2.5 font-bold text-[#141311] border-b border-[#E7E4DC]">
                  📋 Resumen Básico de Información sobre Protección de Datos
                </div>
                <div className="p-4 space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-1 border-b border-[#E7E4DC] pb-2">
                    <span className="font-bold text-[#141311]">Responsable:</span>
                    <span className="sm:col-span-2">RESEO STUDIO (reseostudio@gmail.com)</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-1 border-b border-[#E7E4DC] pb-2">
                    <span className="font-bold text-[#141311]">Finalidad:</span>
                    <span className="sm:col-span-2">
                      Gestión y envío de la vídeo-demo personalizada de 60 segundos, propuesta comercial, soporte
                      técnico del hardware NFC y atención de consultas mediante el Asesor IA y WhatsApp.
                    </span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-1 border-b border-[#E7E4DC] pb-2">
                    <span className="font-bold text-[#141311]">Legitimación:</span>
                    <span className="sm:col-span-2">
                      Consentimiento expreso e informado del usuario al rellenar el formulario o interactuar en el chat.
                    </span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-1 border-b border-[#E7E4DC] pb-2">
                    <span className="font-bold text-[#141311]">Destinatarios:</span>
                    <span className="sm:col-span-2">
                      No se ceden datos a terceros ajenos salvo obligación legal expresa o proveedores estrictamente
                      necesarios para la prestación del servicio (mensajería para entrega de pedidos físicos).
                    </span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-1">
                    <span className="font-bold text-[#141311]">Derechos:</span>
                    <span className="sm:col-span-2">
                      Tienes derecho a acceder, rectificar, suprimir, limitar u oponerte al tratamiento de tus datos
                      escribiendo a <strong>reseostudio@gmail.com</strong> adjuntando copia de tu documento identificativo.
                    </span>
                  </div>
                </div>
              </div>

              <h5 className="font-bold text-[#141311] pt-2">Conservación de los Datos</h5>
              <p>
                Los datos personales proporcionados se conservarán durante el tiempo necesario para cumplir con la
                finalidad para la que se recabaron y para determinar las posibles responsabilidades que se pudieran derivar
                de dicha finalidad y del tratamiento de los datos.
              </p>
            </div>
          )}

          {/* TAB 3: POLÍTICA DE COOKIES */}
          {activeTab === 'cookies' && (
            <div className="space-y-4 animate-fade-in">
              <h4 className="text-base sm:text-lg font-bold text-[#141311] font-['Syne',sans-serif]">
                Política de Cookies
              </h4>
              <p>
                Este sitio web utiliza cookies propias y de terceros para optimizar la experiencia de navegación,
                recordar preferencias locales del usuario y analizar el rendimiento del simulador interactivo y del
                asesor comercial.
              </p>

              <h5 className="font-bold text-[#141311] pt-2">Tipos de Cookies Utilizadas</h5>
              <div className="space-y-3">
                <div className="bg-[#FAF9F6] p-3.5 rounded-xl border border-[#E7E4DC]">
                  <p className="font-bold text-[#141311]">1. Cookies Técnicas y Estrictamente Necesarias:</p>
                  <p className="text-xs text-[#57534E] mt-1">
                    Imprescindibles para el funcionamiento correcto de la web, la persistencia del estado de
                    solicitudes y la seguridad de las transacciones (sin ellas la web no puede funcionar).
                  </p>
                </div>
                <div className="bg-[#FAF9F6] p-3.5 rounded-xl border border-[#E7E4DC]">
                  <p className="font-bold text-[#141311]">2. Cookies de Personalización y Análisis:</p>
                  <p className="text-xs text-[#57534E] mt-1">
                    Permiten recordar las opciones elegidas en el simulador NFC y métricas de uso anónimas para
                    mejorar la calidad de nuestro servicio.
                  </p>
                </div>
              </div>

              <h5 className="font-bold text-[#141311] pt-2">Gestión y Desactivación de Cookies</h5>
              <p>
                Puedes permitir, bloquear o eliminar las cookies instaladas en tu equipo mediante la configuración
                de las opciones de tu navegador web (Chrome, Safari, Firefox, Edge). Si bloqueas las cookies técnicas,
                algunas funcionalidades pueden no estar disponibles.
              </p>
            </div>
          )}

          {/* TAB 4: TÉRMINOS Y CONDICIONES */}
          {activeTab === 'terminos' && (
            <div className="space-y-4 animate-fade-in">
              <h4 className="text-base sm:text-lg font-bold text-[#141311] font-['Syne',sans-serif]">
                Términos y Condiciones de Contratación y Garantía Oficial
              </h4>
              <p>
                Las siguientes condiciones rigen la adquisición de productos físicos NFC y servicios complementarios
                ofertados por RESEO STUDIO:
              </p>

              <div className="space-y-3">
                <div className="border-l-3 border-[#C27803] pl-4 py-1">
                  <h5 className="font-bold text-[#141311]">1. Precios y Modalidad de Pago</h5>
                  <p className="text-xs text-[#57534E] mt-1">
                    Todos los precios mostrados en los packs (59 €, 99 €, 159 €) corresponden a <strong>PAGO ÚNICO</strong> por
                    la adquisición del hardware en propiedad y servicios asociados, sin cuotas mensuales, suscripciones ni
                    cargos recurrentes.
                  </p>
                </div>

                <div className="border-l-3 border-[#C27803] pl-4 py-1">
                  <h5 className="font-bold text-[#141311]">2. Envío y Programación del Hardware NFC</h5>
                  <p className="text-xs text-[#57534E] mt-1">
                    Los expositores acrílicos y tarjetas NFC se envían completamente configurados, enlazados y testeados
                    con la ficha oficial de Google Maps indicada por el cliente, listos para su uso inmediato al sacarlos
                    del paquete. Envíos a toda España con número de seguimiento.
                  </p>
                </div>

                <div className="border-l-3 border-[#10B981] pl-4 py-1">
                  <h5 className="font-bold text-[#141311]">3. Garantía de Uso Activo de 14 Días (Riesgo Cero)</h5>
                  <p className="text-xs text-[#57534E] mt-1">
                    Instala el expositor en tu mostrador de cobro y aplica nuestro Script de 10 segundos con tus clientes. Si tras 14 días de uso activo en tu local no consigues al menos 5 reseñas reales verificadas en Google Maps, nos devuelves el material y te reembolsamos el 100% de tu dinero de inmediato. Tu inversión está 100% protegida.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="bg-[#FAF9F6] px-6 py-4 border-t border-[#E7E4DC] flex items-center justify-between shrink-0">
          <span className="text-[11px] text-[#78716C]">
            Contacto legal: <strong>reseostudio@gmail.com</strong>
          </span>
          <button
            onClick={onClose}
            className="bg-[#141311] hover:bg-[#2A2826] text-white font-bold text-xs sm:text-sm px-6 py-2.5 rounded-full transition-colors cursor-pointer"
          >
            Entendido y Aceptar
          </button>
        </div>
      </div>
    </div>
  );
};
