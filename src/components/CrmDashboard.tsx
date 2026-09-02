import React, { useState, useMemo } from 'react';
import { LeadData, LeadStatus, STATUS_CONFIG } from '../types/crm';
import {
  Users,
  Video,
  CheckCircle2,
  Clock,
  Send,
  MessageCircle,
  Plus,
  Search,
  Download,
  Trash2,
  Edit3,
  FileText,
  DollarSign,
  TrendingUp,
  X,
  ExternalLink,
  ChevronRight,
  Sparkles,
  PhoneCall,
  Mail,
  MapPin,
  Calendar
} from 'lucide-react';

interface CrmDashboardProps {
  isOpen: boolean;
  onClose: () => void;
  leads: LeadData[];
  onUpdateLead: (updatedLead: LeadData) => void;
  onDeleteLead: (leadId: string) => void;
  onAddLead: (newLead: LeadData) => void;
  onExportCsv: () => void;
}

export const CrmDashboard: React.FC<CrmDashboardProps> = ({
  isOpen,
  onClose,
  leads,
  onUpdateLead,
  onDeleteLead,
  onAddLead,
  onExportCsv,
}) => {
  const [activeTab, setActiveTab] = useState<'kanban' | 'tabla' | 'nuevo' | 'prospección'>('kanban');

  // Prospección B2B state
  const [prospeccionUrl, setProspeccionUrl] = useState('');
  const [prospeccionAnalisis, setProspeccionAnalisis] = useState<any>(null);
  const [prospeccionLoading, setProspeccionLoading] = useState(false);
  const [emailTemplate, setEmailTemplate] = useState('restaurante_pocas_resenas');
  const [emailPersonalizado, setEmailPersonalizado] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('todos');
  const [selectedLeadForNotes, setSelectedLeadForNotes] = useState<LeadData | null>(null);
  const [tempNotes, setTempNotes] = useState('');
  
  // WhatsApp Script Modal state
  const [scriptModalLead, setScriptModalLead] = useState<LeadData | null>(null);
  const [selectedScriptType, setSelectedScriptType] = useState<'demo' | 'seguimiento' | 'cierre'>('demo');

  // Manual Lead Form state
  const [manualNegocio, setManualNegocio] = useState('');
  const [manualCiudad, setManualCiudad] = useState('');
  const [manualContacto, setManualContacto] = useState('');
  const [manualTelefono, setManualTelefono] = useState('');
  const [manualEmail, setManualEmail] = useState('');
  const [manualPack, setManualPack] = useState('Pack Comercio + Equipo (99€)');
  const [manualOrigen, setManualOrigen] = useState('Prospección Directa Maps');
  const [manualNotas, setManualNotas] = useState('');

  if (!isOpen) return null;

  // Key Metrics
  const metrics = useMemo(() => {
    const total = leads.length;
    const pendientes = leads.filter(
      (l) => l.status === 'nuevo' || l.status === 'grabando_demo'
    ).length;
    const demosEnviadas = leads.filter(
      (l) => l.status === 'demo_enviada' || l.demoSent === true
    ).length;
    const enNegociacion = leads.filter((l) => l.status === 'en_negociacion').length;
    const ganados = leads.filter((l) => l.status === 'cerrado_ganado');
    const totalGanados = ganados.length;
    
    // Calculate estimated revenue
    const revenue = ganados.reduce((acc, lead) => {
      if (lead.pack?.includes('59')) return acc + 59;
      if (lead.pack?.includes('159')) return acc + 159;
      return acc + 99; // Default recommended pack
    }, 0);

    const conversionRate = total > 0 ? Math.round((totalGanados / total) * 100) : 0;

    return { total, pendientes, demosEnviadas, enNegociacion, totalGanados, revenue, conversionRate };
  }, [leads]);

  // Filtered Leads
  const filteredLeads = useMemo(() => {
    return leads.filter((lead) => {
      const q = searchQuery.toLowerCase();
      const matchesQuery =
        !q ||
        lead.negocio.toLowerCase().includes(q) ||
        lead.ciudad.toLowerCase().includes(q) ||
        lead.contacto.toLowerCase().includes(q) ||
        lead.telefono.toLowerCase().includes(q) ||
        lead.email.toLowerCase().includes(q);

      const matchesStatus = filterStatus === 'todos' || lead.status === filterStatus;
      return matchesQuery && matchesStatus;
    });
  }, [leads, searchQuery, filterStatus]);

  // Status Changer
  const handleStatusChange = (lead: LeadData, newStatus: LeadStatus) => {
    const isNowSent = newStatus === 'demo_enviada';
    const updated: LeadData = {
      ...lead,
      status: newStatus,
      demoSent: isNowSent ? true : lead.demoSent,
      demoSentDate: isNowSent && !lead.demoSentDate ? new Date().toISOString() : lead.demoSentDate,
    };
    onUpdateLead(updated);
  };

  // Toggle Demo Sent Shortcut
  const handleToggleDemoSent = (lead: LeadData) => {
    const nextSent = !lead.demoSent;
    const updated: LeadData = {
      ...lead,
      demoSent: nextSent,
      status: nextSent ? 'demo_enviada' : lead.status === 'demo_enviada' ? 'grabando_demo' : lead.status,
      demoSentDate: nextSent ? new Date().toISOString() : undefined,
    };
    onUpdateLead(updated);
  };

  // Open Notes Modal
  const openNotesModal = (lead: LeadData) => {
    setSelectedLeadForNotes(lead);
    setTempNotes(lead.notas || '');
  };

  const saveNotes = () => {
    if (!selectedLeadForNotes) return;
    onUpdateLead({
      ...selectedLeadForNotes,
      notas: tempNotes,
    });
    setSelectedLeadForNotes(null);
  };

  // Handle Manual Lead Submit
  const handleCreateManualLead = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualNegocio || !manualTelefono) return;

    const newLead: LeadData = {
      id: 'lead_' + Date.now(),
      tipo: 'manual',
      negocio: manualNegocio,
      ciudad: manualCiudad || 'España',
      contacto: manualContacto || 'Responsable',
      email: manualEmail || 'pendiente@cliente.com',
      telefono: manualTelefono,
      pack: manualPack,
      timestamp: new Date().toISOString(),
      target_email: 'reseostudio@gmail.com',
      origen: manualOrigen,
      status: 'nuevo',
      demoSent: false,
      notas: manualNotas,
    };

    onAddLead(newLead);
    // Reset form
    setManualNegocio('');
    setManualCiudad('');
    setManualContacto('');
    setManualTelefono('');
    setManualEmail('');
    setManualNotas('');
    setActiveTab('kanban');
  };

  // Helper: Obtener asunto del email según plantilla
  const getEmailSubject = (template: string, analisis: any) => {
    const negocio = analisis?.nombre || 'su negocio';

    switch(template) {
      case 'restaurante_pocas_resenas':
        return `${negocio} → Multiplicar reseñas en Google Maps en 3 segundos`;
      case 'hotel_rating_bajo':
        return `Cómo ${negocio} puede superar a la competencia en Google Maps`;
      case 'comercio_nuevo':
        return `${negocio} → Estrategia relámpago para generar reseñas desde día 1`;
      case 'followup_suave':
        return `${negocio} - Seguimiento de nuestra propuesta`;
      case 'followup_cierre':
        return `${negocio} - Última oportunidad esta semana`;
      default:
        return `Propuesta personalizada para ${negocio}`;
    }
  };

  // Helper: Generar email personalizado con IA
  const generarEmailPersonalizado = (analisis: any, template: string) => {
    const nombre = analisis?.contacto || 'Responsable';
    const negocio = analisis?.nombre || 'su negocio';
    const rating = analisis?.rating || 'N/A';
    const reviews = analisis?.reviews || 0;
    const ciudad = analisis?.ciudad || '';

    if (template === 'restaurante_pocas_resenas') {
      return `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #FAF9F6;">
          <div style="background-color: white; padding: 30px; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
            <div style="text-align: center; margin-bottom: 25px;">
              <div style="width: 48px; height: 48px; background-color: #141311; color: white; display: inline-flex; align-items: center; justify-content: center; border-radius: 8px; font-weight: 900; font-size: 20px;">RS</div>
              <h3 style="margin: 10px 0 0 0; color: #141311;">RESEO STUDIO</h3>
            </div>

            <p style="color: #141311; margin-bottom: 15px;">Hola ${nombre},</p>

            <p style="color: #57534E; line-height: 1.6;">
              He estado analizando la ficha de Google Maps de <strong>${negocio}</strong>${ciudad ? ` en ${ciudad}` : ''} y he visto que actualmente tienen <strong>${reviews} reseñas</strong> con un rating de <strong>${rating}⭐</strong>.
            </p>

            <p style="color: #57534E; line-height: 1.6;">
              La mayoría de tus competidores están en la misma situación, pero hay una oportunidad clara de <strong>destacar en el Top 3 de Google Maps</strong> usando algo que muy pocos restaurantes están aprovechando aún: <strong>la tecnología NFC física</strong>.
            </p>

            <div style="background-color: #FFFBEB; padding: 20px; border-radius: 12px; border-left: 4px solid #C27803; margin: 20px 0;">
              <p style="margin: 0; color: #141311; font-weight: 600;">
                💡 ¿El problema del QR tradicional?
              </p>
              <p style="margin: 10px 0 0 0; color: #57534E; font-size: 14px;">
                Que el cliente debe: sacar móvil → abrir cámara → enfocar → esperar carga → clickar link. <strong>Demasiada fricción = 0 reseñas.</strong>
              </p>
            </div>

            <p style="color: #57534E; line-height: 1.6;">
              Con nuestro sistema de <strong>expositor NFC + tarjetas de bolsillo</strong>, el cliente solo tiene que <strong>apoyar el móvil durante 3 segundos</strong> y se abre directamente la pantalla de 5 estrellas de Google Maps → verificada por GPS en tu local.
            </p>

            <div style="background-color: #F3F1EC; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <p style="margin: 0; color: #141311; font-size: 14px; font-weight: 600;">📦 Pack recomendado para ${negocio}:</p>
              <p style="margin: 10px 0 0 0; color: #57534E; font-size: 14px;">
                <strong>Pack Comercio + Equipo (99€)</strong><br/>
                • 1 Expositor acrílico con tu logo<br/>
                • 2 Tarjetas NFC de bolsillo<br/>
                • Configuración completa incluida<br/>
                • Envío gratis 24-48h<br/>
                • 14 días garantía o devolución 100%
              </p>
            </div>

            <p style="color: #57534E; line-height: 1.6;">
              Te puedo preparar una <strong>vídeo-demo gratuita de 60 segundos</strong> con la ficha de ${negocio} para que veas exactamente cómo funciona.
            </p>

            <p style="color: #57534E; line-height: 1.6;">
              ¿Te interesa que te la envíe por WhatsApp o prefieres que hablemos directamente?
            </p>

            <div style="margin: 30px 0 20px 0; text-align: center;">
              <a href="https://reseostudio.com" style="background-color: #047857; color: white; padding: 14px 28px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: 600;">Ver más información</a>
            </div>

            <p style="color: #141311; margin: 25px 0 5px 0;">Un saludo,</p>
            <p style="color: #141311; margin: 0; font-weight: 600;">Equipo RESEO STUDIO</p>
            <p style="color: #78716C; margin: 5px 0 0 0; font-size: 13px;">📱 WhatsApp: +34 XXX XXX XXX</p>
            <p style="color: #78716C; margin: 5px 0 0 0; font-size: 13px;">🌐 reseostudio.com</p>

            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #E7E4DC; text-align: center;">
              <p style="color: #A8A29E; font-size: 11px; margin: 0;">
                Este email es una propuesta comercial personalizada basada en el análisis de tu perfil público de Google Maps.
              </p>
            </div>
          </div>
        </div>
      `;
    }

    if (template === 'comercio_nuevo') {
      return `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #FAF9F6;">
          <div style="background-color: white; padding: 30px; border-radius: 12px;">
            <h3 style="color: #141311;">Hola ${nombre},</h3>
            <p style="color: #57534E;">
              He visto que <strong>${negocio}</strong> ${reviews === 0 ? 'aún no tiene reseñas' : 'está empezando'} en Google Maps.
            </p>
            <p style="color: #57534E;">
              Los primeros 90 días son críticos para posicionarte. Con nuestro sistema NFC puedes conseguir <strong>5-10 reseñas verificadas la primera semana</strong>.
            </p>
            <p style="color: #57534E;">
              ¿Te interesa una demo gratuita de 60s?
            </p>
            <p style="color: #141311; font-weight: 600;">Saludos,<br/>RESEO STUDIO</p>
          </div>
        </div>
      `;
    }

    if (template === 'followup_suave') {
      return `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <p>Hola ${nombre},</p>
          <p>Espero que estés teniendo un buen día. Te escribo para saber si pudiste ver la propuesta que te envié sobre el sistema NFC para ${negocio}.</p>
          <p>Entiendo que estás ocupado, solo quería saber si tienes alguna pregunta o necesitas más información.</p>
          <p>Quedo atento,<br/>RESEO STUDIO</p>
        </div>
      `;
    }

    // Template por defecto
    return `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <p>Hola ${nombre},</p>
        <p>Te escribo sobre una propuesta para mejorar la visibilidad de ${negocio} en Google Maps.</p>
        <p>¿Tienes 5 minutos para una llamada rápida?</p>
        <p>Saludos,<br/>RESEO STUDIO</p>
      </div>
    `;
  };

  // WhatsApp Pre-filled Scripts Generator
  const getWhatsAppScriptText = (lead: LeadData, type: 'demo' | 'seguimiento' | 'cierre') => {
    const nombre = lead.contacto || 'Responsable';
    const negocio = lead.negocio || 'tu negocio';
    const ciudad = lead.ciudad || '';
    const pack = lead.pack || 'Pack Comercio + Equipo (99€)';

    if (type === 'demo') {
      return `¡Hola ${nombre}! 👋 Soy de RESEO STUDIO.

Te paso la vídeo-demo personalizada de 60 segundos que te preparamos para ${negocio}${ciudad ? ` (${ciudad})` : ''}. 🎬

Como puedes ver, en solo 3 segundos el cliente abre directamente la pantalla de 5 estrellas al apoyar su smartphone en el expositor físico, verificado por GPS en tu local.

Para tu negocio te recomendamos el ${pack}, que incluye los bonos de regalo valorados en 144€ y 14 días de Garantía de 5 reseñas o 100% de devolución.

¿Qué te ha parecido el vídeo? ¿Te reservamos la promoción de esta semana?`;
    }

    if (type === 'seguimiento') {
      return `¡Hola ${nombre}! 👋 Espero que estés teniendo un buen día.

Te escribía para saber si pudiste ver la vídeo-demo de 60s que te enviamos para ${negocio}.

Varios negocios de tu sector están consiguiendo entre 15 y 30 reseñas nuevas al mes con el expositor en caja. ¿Tienes alguna duda sobre la instalación o los bonos incluidos?`;
    }

    return `¡Genial ${nombre}! 🎉

Te dejamos por aquí los detalles para confirmar el ${pack} para ${negocio}:
• 1 Expositor Acrílico NFC para mostrador/caja.
• 2 Tarjetas NFC de bolsillo para el personal.
• BONO 1: Script verbal antivergüenza de 10s (Gratis).
• BONO 2: Auditoría SEO Maps de 12 puntos (Gratis).
• 14 Días de Garantía de Uso Activo.

👉 Enlace de pago seguro: https://buy.stripe.com/demo_reseo_studio (o Bizum de empresa)

En cuanto lo completes, te solicitamos tu logotipo en buena calidad para fabricar el material y enviártelo en 24/48h.`;
  };

  const openWhatsAppWithScript = (lead: LeadData, type: 'demo' | 'seguimiento' | 'cierre') => {
    const cleanPhone = lead.telefono.replace(/[^0-9]/g, '');
    const message = getWhatsAppScriptText(lead, type);
    const url = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');

    // If sending demo, automatically mark demoSent
    if (type === 'demo' && !lead.demoSent) {
      handleToggleDemoSent(lead);
    }
  };

  const openScriptModal = (lead: LeadData, type: 'demo' | 'seguimiento' | 'cierre' = 'demo') => {
    setScriptModalLead(lead);
    setSelectedScriptType(type);
  };

  // Status Column List for Kanban
  const pipelineStatuses: LeadStatus[] = [
    'nuevo',
    'grabando_demo',
    'demo_enviada',
    'en_negociacion',
    'cerrado_ganado',
    'descartado',
  ];

  return (
    <div
      className="fixed inset-0 z-50 bg-[#141311]/80 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 font-['DM_Sans',sans-serif]"
      onClick={onClose}
    >
      <div
        className="bg-[#FAF9F6] border border-[#E7E4DC] rounded-3xl w-full max-w-7xl h-[92vh] shadow-2xl flex flex-col overflow-hidden text-[#141311]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* TOP HEADER */}
        <div className="bg-white border-b border-[#E7E4DC] px-6 py-4 flex flex-col md:flex-row md:items-center justify-between gap-4 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-[#141311] text-[#FBBF24] flex items-center justify-center text-xl shadow-md">
              📊
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold font-['Outfit',sans-serif] text-[#141311] tracking-[-0.02em]">
                  Centro de Control & CRM Comercial
                </h2>
                <span className="bg-[#FEF3C7] text-[#C27803] border border-[#C27803]/30 text-xs font-black px-2.5 py-0.5 rounded-full">
                  Admin Pro
                </span>
              </div>
              <p className="text-xs text-[#57534E]">
                Pipeline de ventas, control de grabación y envío de demos en WhatsApp
              </p>
            </div>
          </div>

          {/* Tab navigation */}
          <div className="flex items-center gap-2 bg-[#F3F1EC] p-1.5 rounded-2xl border border-[#E7E4DC]">
            <button
              onClick={() => setActiveTab('kanban')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'kanban'
                  ? 'bg-white text-[#141311] shadow-sm'
                  : 'text-[#57534E] hover:text-[#141311]'
              }`}
            >
              <span>📋 Pipeline Kanban</span>
            </button>
            <button
              onClick={() => setActiveTab('tabla')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'tabla'
                  ? 'bg-white text-[#141311] shadow-sm'
                  : 'text-[#57534E] hover:text-[#141311]'
              }`}
            >
              <span>📑 Lista & Filtros ({filteredLeads.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('prospección')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'prospección'
                  ? 'bg-[#047857] text-white shadow-sm'
                  : 'text-[#047857] hover:bg-[#D1FAE5]'
              }`}
            >
              <Mail className="w-3.5 h-3.5" />
              <span>🎯 Prospección B2B</span>
            </button>
            <button
              onClick={() => setActiveTab('nuevo')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'nuevo'
                  ? 'bg-[#C27803] text-white shadow-sm'
                  : 'text-[#C27803] hover:bg-[#FFFBEB]'
              }`}
            >
              <Plus className="w-3.5 h-3.5" />
              <span>+ Nuevo Prospecto</span>
            </button>
          </div>

          {/* Quick Actions & Close */}
          <div className="flex items-center gap-2">
            <button
              onClick={onExportCsv}
              title="Descargar base de datos en CSV / Excel"
              className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-3.5 py-2.5 rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Exportar Excel</span>
            </button>
            <button
              onClick={onClose}
              className="w-10 h-10 rounded-xl bg-[#F3F1EC] hover:bg-[#E7E4DC] text-[#57534E] hover:text-[#141311] flex items-center justify-center font-bold text-lg transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* METRICS BAR */}
        <div className="bg-[#FAF9F6] border-b border-[#E7E4DC] px-6 py-3 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 shrink-0">
          <div className="bg-white p-3 rounded-2xl border border-[#E7E4DC] shadow-xs flex items-center justify-between">
            <div>
              <div className="text-[10px] text-[#8C877E] uppercase font-bold tracking-wider">Total Leads</div>
              <div className="text-xl font-extrabold text-[#141311]">{metrics.total}</div>
            </div>
            <Users className="w-5 h-5 text-[#8C877E]" />
          </div>

          <div className="bg-white p-3 rounded-2xl border border-amber-200 bg-amber-50/40 shadow-xs flex items-center justify-between">
            <div>
              <div className="text-[10px] text-amber-700 uppercase font-bold tracking-wider">Por Grabar</div>
              <div className="text-xl font-extrabold text-amber-800">{metrics.pendientes}</div>
            </div>
            <Video className="w-5 h-5 text-amber-600 animate-pulse" />
          </div>

          <div className="bg-white p-3 rounded-2xl border border-purple-200 bg-purple-50/40 shadow-xs flex items-center justify-between">
            <div>
              <div className="text-[10px] text-purple-700 uppercase font-bold tracking-wider">Demos Enviadas</div>
              <div className="text-xl font-extrabold text-purple-800">{metrics.demosEnviadas}</div>
            </div>
            <Send className="w-5 h-5 text-purple-600" />
          </div>

          <div className="bg-white p-3 rounded-2xl border border-indigo-200 bg-indigo-50/40 shadow-xs flex items-center justify-between">
            <div>
              <div className="text-[10px] text-indigo-700 uppercase font-bold tracking-wider">En Negociación</div>
              <div className="text-xl font-extrabold text-indigo-800">{metrics.enNegociacion}</div>
            </div>
            <MessageCircle className="w-5 h-5 text-indigo-600" />
          </div>

          <div className="bg-white p-3 rounded-2xl border border-emerald-200 bg-emerald-50/50 shadow-xs flex items-center justify-between">
            <div>
              <div className="text-[10px] text-emerald-700 uppercase font-bold tracking-wider">Ventas Ganadas</div>
              <div className="text-xl font-extrabold text-emerald-800">{metrics.totalGanados} ({metrics.conversionRate}%)</div>
            </div>
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
          </div>

          <div className="bg-[#141311] p-3 rounded-2xl border border-[#2A2826] text-white shadow-xs flex items-center justify-between">
            <div>
              <div className="text-[10px] text-amber-400 uppercase font-bold tracking-wider">Facturación</div>
              <div className="text-xl font-extrabold text-amber-300">{metrics.revenue} €</div>
            </div>
            <DollarSign className="w-5 h-5 text-amber-400" />
          </div>
        </div>

        {/* MAIN BODY AREA */}
        <div className="flex-grow overflow-hidden p-6 flex flex-col">
          {/* TAB 1: KANBAN PIPELINE */}
          {activeTab === 'kanban' && (
            <div className="flex-grow flex gap-4 overflow-x-auto pb-4">
              {pipelineStatuses.map((statusKey) => {
                const conf = STATUS_CONFIG[statusKey];
                const columnLeads = leads.filter((l) => l.status === statusKey);

                return (
                  <div
                    key={statusKey}
                    className="w-80 min-w-[300px] max-w-[320px] bg-[#F4F1EA] rounded-3xl border border-[#E7E4DC] flex flex-col overflow-hidden shadow-xs shrink-0"
                  >
                    {/* Column Header */}
                    <div className="p-4 bg-white border-b border-[#E7E4DC] flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span>{conf.icon}</span>
                        <h3 className="font-bold text-xs uppercase tracking-wider text-[#141311]">
                          {conf.label}
                        </h3>
                      </div>
                      <span className="w-6 h-6 rounded-full bg-[#F3F1EC] text-xs font-black flex items-center justify-center text-[#57534E]">
                        {columnLeads.length}
                      </span>
                    </div>

                    {/* Column Cards */}
                    <div className="flex-grow overflow-y-auto p-3 space-y-3">
                      {columnLeads.length === 0 ? (
                        <div className="text-center py-8 text-xs text-[#8C877E] italic">
                          Sin prospectos en esta fase
                        </div>
                      ) : (
                        columnLeads.map((lead) => (
                          <div
                            key={lead.id}
                            className="bg-white rounded-2xl p-4 border border-[#E7E4DC] shadow-sm hover:shadow-md transition-all space-y-3 group"
                          >
                            {/* Card Top: Biz & City */}
                            <div className="flex items-start justify-between gap-2">
                              <div>
                                <h4 className="font-bold text-sm text-[#141311] leading-snug">
                                  {lead.negocio}
                                </h4>
                                <div className="text-xs text-[#8C877E] flex items-center gap-1 mt-0.5">
                                  <MapPin className="w-3 h-3 text-[#C27803]" />
                                  <span>{lead.ciudad}</span>
                                </div>
                              </div>

                              {/* Quick Demo Sent Toggle */}
                              <button
                                onClick={() => handleToggleDemoSent(lead)}
                                title={lead.demoSent ? 'Demo Enviada (clic para desmarcar)' : 'Marcar Demo como Enviada'}
                                className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full border transition-all cursor-pointer flex items-center gap-1 ${
                                  lead.demoSent
                                    ? 'bg-purple-100 text-purple-800 border-purple-300'
                                    : 'bg-slate-100 text-slate-500 border-slate-200 hover:border-purple-300'
                                }`}
                              >
                                <span>{lead.demoSent ? '✓ Demo Enviada' : '⏳ Pendiente'}</span>
                              </button>
                            </div>

                            {/* Contact Details */}
                            <div className="text-xs space-y-1 bg-[#FAF9F6] p-2.5 rounded-xl border border-[#E7E4DC]/80">
                              <div className="font-medium text-[#141311]">
                                👤 {lead.contacto}
                              </div>
                              <div className="text-[#57534E] flex items-center justify-between font-mono text-[11px]">
                                <span>📞 {lead.telefono}</span>
                                <span className="text-[10px] bg-[#FEF3C7] text-[#C27803] px-1.5 py-0.2 rounded font-bold">
                                  {lead.pack?.includes('59') ? '59€' : lead.pack?.includes('159') ? '159€' : '99€'}
                                </span>
                              </div>
                            </div>

                            {/* Notes snippet if exists */}
                            {lead.notas && (
                              <div className="text-[11px] text-[#57534E] bg-amber-50/60 border border-amber-200/60 p-2 rounded-lg italic">
                                💬 "{lead.notas}"
                              </div>
                            )}

                            {/* WhatsApp Action Buttons */}
                            <div className="grid grid-cols-3 gap-1.5 pt-1">
                              <button
                                onClick={() => openWhatsAppWithScript(lead, 'demo')}
                                title="Enviar Vídeo Demo por WhatsApp"
                                className="bg-emerald-500 hover:bg-emerald-600 text-white text-[10px] font-extrabold py-1.5 rounded-lg flex items-center justify-center gap-1 transition-colors cursor-pointer"
                              >
                                <Video className="w-3 h-3" />
                                <span>Demo</span>
                              </button>

                              <button
                                onClick={() => openWhatsAppWithScript(lead, 'seguimiento')}
                                title="Hacer Seguimiento por WhatsApp"
                                className="bg-blue-500 hover:bg-blue-600 text-white text-[10px] font-extrabold py-1.5 rounded-lg flex items-center justify-center gap-1 transition-colors cursor-pointer"
                              >
                                <Clock className="w-3 h-3" />
                                <span>Seguim.</span>
                              </button>

                              <button
                                onClick={() => openWhatsAppWithScript(lead, 'cierre')}
                                title="Enviar Enlace de Pago / Cierre"
                                className="bg-[#141311] hover:bg-[#2A2826] text-[#FBBF24] text-[10px] font-extrabold py-1.5 rounded-lg flex items-center justify-center gap-1 transition-colors cursor-pointer"
                              >
                                <DollarSign className="w-3 h-3" />
                                <span>Cierre</span>
                              </button>
                            </div>

                            {/* Footer card: Status change & Notes */}
                            <div className="flex items-center justify-between pt-2 border-t border-[#E7E4DC] text-[10px]">
                              {/* Status Selector Dropdown */}
                              <select
                                value={lead.status}
                                onChange={(e) => handleStatusChange(lead, e.target.value as LeadStatus)}
                                className="bg-[#F3F1EC] text-[#141311] font-bold py-1 px-2 rounded-lg border border-[#E7E4DC] outline-none text-[10px] cursor-pointer"
                              >
                                {pipelineStatuses.map((st) => (
                                  <option key={st} value={st}>
                                    {STATUS_CONFIG[st].icon} {STATUS_CONFIG[st].label}
                                  </option>
                                ))}
                              </select>

                              <div className="flex items-center gap-1">
                                <button
                                  onClick={() => openNotesModal(lead)}
                                  title="Añadir o editar notas"
                                  className="p-1 hover:bg-[#F3F1EC] rounded text-[#57534E] hover:text-[#141311] cursor-pointer"
                                >
                                  <FileText className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => openScriptModal(lead)}
                                  title="Ver guión completo de WhatsApp"
                                  className="p-1 hover:bg-[#F3F1EC] rounded text-[#C27803] cursor-pointer"
                                >
                                  <Sparkles className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => onDeleteLead(lead.id)}
                                  title="Eliminar lead"
                                  className="p-1 hover:bg-red-50 rounded text-red-400 hover:text-red-600 cursor-pointer"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* TAB 2: ADVANCED TABLE & SEARCH */}
          {activeTab === 'tabla' && (
            <div className="flex-grow flex flex-col space-y-4 overflow-hidden">
              {/* Search and Filters bar */}
              <div className="flex flex-col sm:flex-row gap-3 items-center justify-between shrink-0">
                <div className="relative w-full sm:w-96">
                  <Search className="w-4 h-4 text-[#8C877E] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Buscar por negocio, ciudad, contacto, teléfono..."
                    className="w-full pl-10 pr-4 py-2.5 bg-white border border-[#E7E4DC] focus:border-[#C27803] rounded-xl text-xs outline-none shadow-xs"
                  />
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="bg-white border border-[#E7E4DC] px-3 py-2.5 rounded-xl text-xs font-bold outline-none cursor-pointer"
                  >
                    <option value="todos">Todos los Estados ({leads.length})</option>
                    {pipelineStatuses.map((st) => (
                      <option key={st} value={st}>
                        {STATUS_CONFIG[st].icon} {STATUS_CONFIG[st].label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Table Container */}
              <div className="flex-grow overflow-auto bg-white rounded-2xl border border-[#E7E4DC] shadow-xs">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#F4F1EA] text-[#57534E] font-bold uppercase tracking-wider text-[10px] sticky top-0 z-10 border-b border-[#E7E4DC]">
                    <tr>
                      <th className="p-3.5">Fecha</th>
                      <th className="p-3.5">Negocio & Ciudad</th>
                      <th className="p-3.5">Contacto</th>
                      <th className="p-3.5">Teléfono & WhatsApp</th>
                      <th className="p-3.5">Estado en Pipeline</th>
                      <th className="p-3.5">Demo Enviada</th>
                      <th className="p-3.5">Pack Solicitado</th>
                      <th className="p-3.5">Notas</th>
                      <th className="p-3.5 text-right">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E7E4DC]">
                    {filteredLeads.length === 0 ? (
                      <tr>
                        <td colSpan={9} className="p-10 text-center text-sm text-[#8C877E]">
                          No se encontraron clientes con los filtros aplicados.
                        </td>
                      </tr>
                    ) : (
                      filteredLeads.map((lead) => {
                        const conf = STATUS_CONFIG[lead.status] || STATUS_CONFIG['nuevo'];

                        return (
                          <tr key={lead.id} className="hover:bg-[#FAF9F6] transition-colors">
                            <td className="p-3.5 whitespace-nowrap text-[#8C877E] font-mono text-[11px]">
                              {new Date(lead.timestamp).toLocaleDateString('es-ES', {
                                day: '2-digit',
                                month: '2-digit',
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </td>

                            <td className="p-3.5">
                              <div className="font-bold text-[#141311] text-sm">{lead.negocio}</div>
                              <div className="text-[11px] text-[#8C877E] flex items-center gap-1">
                                <MapPin className="w-3 h-3 text-[#C27803]" />
                                {lead.ciudad}
                              </div>
                            </td>

                            <td className="p-3.5 text-[#141311] font-medium">
                              {lead.contacto}
                            </td>

                            <td className="p-3.5">
                              <div className="font-mono text-xs text-[#141311] font-bold">{lead.telefono}</div>
                              <div className="text-[11px] text-[#8C877E]">{lead.email}</div>
                            </td>

                            <td className="p-3.5">
                              <select
                                value={lead.status}
                                onChange={(e) => handleStatusChange(lead, e.target.value as LeadStatus)}
                                className={`text-[11px] font-bold py-1 px-2.5 rounded-lg border outline-none cursor-pointer ${conf.bg} ${conf.text} ${conf.border}`}
                              >
                                {pipelineStatuses.map((st) => (
                                  <option key={st} value={st}>
                                    {STATUS_CONFIG[st].icon} {STATUS_CONFIG[st].label}
                                  </option>
                                ))}
                              </select>
                            </td>

                            <td className="p-3.5">
                              <button
                                onClick={() => handleToggleDemoSent(lead)}
                                className={`text-[10px] font-extrabold px-2.5 py-1 rounded-full border transition-all cursor-pointer ${
                                  lead.demoSent
                                    ? 'bg-purple-100 text-purple-800 border-purple-300'
                                    : 'bg-slate-100 text-slate-500 border-slate-200 hover:border-purple-300'
                                }`}
                              >
                                {lead.demoSent ? '✓ Sí (Enviada)' : '⏳ No'}
                              </button>
                            </td>

                            <td className="p-3.5">
                              <span className="bg-[#FEF3C7] text-[#C27803] text-[10px] font-bold px-2 py-0.5 rounded border border-[#C27803]/30">
                                {lead.pack}
                              </span>
                            </td>

                            <td className="p-3.5 max-w-xs truncate text-[11px] text-[#57534E]">
                              {lead.notas || (
                                <button
                                  onClick={() => openNotesModal(lead)}
                                  className="text-[#8C877E] hover:text-[#C27803] italic underline cursor-pointer"
                                >
                                  + Añadir nota
                                </button>
                              )}
                            </td>

                            <td className="p-3.5 text-right whitespace-nowrap space-x-1.5">
                              <button
                                onClick={() => openWhatsAppWithScript(lead, 'demo')}
                                title="Enviar Vídeo Demo"
                                className="bg-emerald-500 hover:bg-emerald-600 text-white p-1.5 rounded-lg inline-flex items-center justify-center cursor-pointer"
                              >
                                <Video className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => openNotesModal(lead)}
                                title="Editar Notas"
                                className="bg-[#F3F1EC] hover:bg-[#E7E4DC] text-[#141311] p-1.5 rounded-lg inline-flex items-center justify-center cursor-pointer"
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => onDeleteLead(lead.id)}
                                title="Eliminar"
                                className="bg-red-50 hover:bg-red-100 text-red-600 p-1.5 rounded-lg inline-flex items-center justify-center cursor-pointer"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 3: PROSPECCIÓN B2B CON EMAILS MANUALES */}
          {activeTab === 'prospección' && (
            <div className="max-w-4xl mx-auto w-full bg-white p-8 rounded-3xl border border-[#E7E4DC] shadow-sm flex-grow overflow-y-auto">
              <div className="flex items-center gap-2 mb-6 pb-4 border-b border-[#E7E4DC]">
                <Mail className="w-6 h-6 text-[#047857]" />
                <div>
                  <h3 className="text-xl font-bold text-[#141311]">
                    🎯 Prospección B2B - Sistema de Emails Manuales
                  </h3>
                  <p className="text-sm text-[#57534E] mt-1">
                    Analiza negocios de Google Maps y genera emails personalizados con IA
                  </p>
                </div>
              </div>

              {/* URL Input y Análisis */}
              <div className="mb-6">
                <label className="block text-sm font-bold text-[#141311] mb-2">
                  🔗 URL de Google Maps del Negocio
                </label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    value={prospeccionUrl}
                    onChange={(e) => setProspeccionUrl(e.target.value)}
                    placeholder="https://maps.google.com/..."
                    className="flex-1 px-4 py-3 rounded-xl border border-[#E7E4DC] text-sm focus:outline-none focus:ring-2 focus:ring-[#047857]"
                  />
                  <button
                    onClick={async () => {
                      if (!prospeccionUrl) {
                        alert('Por favor introduce una URL de Google Maps');
                        return;
                      }
                      setProspeccionLoading(true);
                      try {
                        const response = await fetch('/api/analyze-google-maps', {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({ url: prospeccionUrl })
                        });
                        const data = await response.json();
                        setProspeccionAnalisis(data);

                        // Genera email automáticamente
                        const emailHtml = generarEmailPersonalizado(data, emailTemplate);
                        setEmailPersonalizado(emailHtml);
                      } catch (error) {
                        alert('Error al analizar. Intenta de nuevo.');
                        console.error(error);
                      }
                      setProspeccionLoading(false);
                    }}
                    disabled={prospeccionLoading}
                    className="px-6 py-3 bg-[#047857] hover:bg-[#065F46] text-white rounded-xl text-sm font-bold flex items-center gap-2 transition-colors disabled:opacity-50 cursor-pointer"
                  >
                    {prospeccionLoading ? (
                      <>
                        <span className="animate-spin">⏳</span>
                        Analizando...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4" />
                        Analizar con IA
                      </>
                    )}
                  </button>
                </div>
                <p className="text-xs text-[#78716C] mt-2">
                  💡 Pega la URL completa del negocio en Google Maps y la IA analizará su ficha
                </p>
              </div>

              {/* Resultados del Análisis */}
              {prospeccionAnalisis && (
                <div className="mb-6 p-6 bg-[#F3F1EC] rounded-2xl border border-[#E7E4DC]">
                  <h4 className="font-bold text-[#141311] mb-4 flex items-center gap-2">
                    <span>📊</span>
                    Análisis del Negocio
                  </h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div className="bg-white p-4 rounded-xl">
                      <div className="text-2xl font-bold text-[#141311]">{prospeccionAnalisis.rating || 'N/A'}</div>
                      <div className="text-xs text-[#57534E]">Rating</div>
                    </div>
                    <div className="bg-white p-4 rounded-xl">
                      <div className="text-2xl font-bold text-[#141311]">{prospeccionAnalisis.reviews || 0}</div>
                      <div className="text-xs text-[#57534E]">Reseñas</div>
                    </div>
                    <div className="bg-white p-4 rounded-xl">
                      <div className="text-2xl font-bold text-[#047857]">{prospeccionAnalisis.potencial || 'Alto'}</div>
                      <div className="text-xs text-[#57534E]">Potencial</div>
                    </div>
                    <div className="bg-white p-4 rounded-xl">
                      <div className="text-2xl font-bold text-[#C27803]">{prospeccionAnalisis.urgencia || 'Media'}</div>
                      <div className="text-xs text-[#57534E]">Urgencia</div>
                    </div>
                  </div>
                  <div className="bg-white p-4 rounded-xl">
                    <p className="text-sm text-[#57534E] font-bold mb-2">🤖 Análisis IA:</p>
                    <p className="text-sm text-[#141311]">{prospeccionAnalisis.analisis || 'Cargando análisis...'}</p>
                  </div>
                </div>
              )}

              {/* Selector de Plantilla */}
              <div className="mb-6">
                <label className="block text-sm font-bold text-[#141311] mb-2">
                  📧 Plantilla de Email
                </label>
                <select
                  value={emailTemplate}
                  onChange={(e) => {
                    setEmailTemplate(e.target.value);
                    if (prospeccionAnalisis) {
                      const emailHtml = generarEmailPersonalizado(prospeccionAnalisis, e.target.value);
                      setEmailPersonalizado(emailHtml);
                    }
                  }}
                  className="w-full px-4 py-3 rounded-xl border border-[#E7E4DC] text-sm focus:outline-none focus:ring-2 focus:ring-[#047857]"
                >
                  <option value="restaurante_pocas_resenas">🍽️ Restaurante - Pocas Reseñas</option>
                  <option value="hotel_rating_bajo">🏨 Hotel - Rating Bajo</option>
                  <option value="comercio_nuevo">🛍️ Comercio - Nuevo/Sin reseñas</option>
                  <option value="followup_suave">📬 Follow-up Suave (3 días)</option>
                  <option value="followup_cierre">🎯 Follow-up Cierre (7 días)</option>
                </select>
              </div>

              {/* Vista Previa del Email */}
              {emailPersonalizado && (
                <div className="mb-6">
                  <label className="block text-sm font-bold text-[#141311] mb-2">
                    👁️ Vista Previa del Email
                  </label>
                  <div className="border border-[#E7E4DC] rounded-2xl overflow-hidden">
                    <div className="bg-[#F3F1EC] px-4 py-3 border-b border-[#E7E4DC]">
                      <div className="text-xs text-[#57534E] mb-1">Para: {prospeccionAnalisis?.email || 'cliente@ejemplo.com'}</div>
                      <div className="text-sm font-bold text-[#141311]">Asunto: {getEmailSubject(emailTemplate, prospeccionAnalisis)}</div>
                    </div>
                    <div
                      className="p-6 bg-white text-sm"
                      dangerouslySetInnerHTML={{ __html: emailPersonalizado }}
                    />
                  </div>
                </div>
              )}

              {/* Botones de Acción */}
              {emailPersonalizado && (
                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      // Copiar al portapapeles
                      const tempDiv = document.createElement('div');
                      tempDiv.innerHTML = emailPersonalizado;
                      const texto = tempDiv.textContent || tempDiv.innerText;
                      navigator.clipboard.writeText(texto);
                      alert('✅ Email copiado al portapapeles');
                    }}
                    className="flex-1 px-6 py-4 bg-[#F3F1EC] hover:bg-[#E7E4DC] text-[#141311] rounded-xl font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer"
                  >
                    <FileText className="w-4 h-4" />
                    Copiar Texto
                  </button>

                  <button
                    onClick={() => {
                      const email = prospeccionAnalisis?.email || '';
                      const subject = encodeURIComponent(getEmailSubject(emailTemplate, prospeccionAnalisis));
                      const tempDiv = document.createElement('div');
                      tempDiv.innerHTML = emailPersonalizado;
                      const body = encodeURIComponent(tempDiv.textContent || '');

                      window.open(`https://mail.google.com/mail/?view=cm&to=${email}&su=${subject}&body=${body}`, '_blank');

                      // Registrar en CRM como enviado
                      if (prospeccionAnalisis) {
                        const nuevoLead: LeadData = {
                          id: Date.now().toString(),
                          negocio: prospeccionAnalisis.nombre || 'Negocio Prospectado',
                          ciudad: prospeccionAnalisis.ciudad || '',
                          contacto: '',
                          telefono: prospeccionAnalisis.telefono || '',
                          email: prospeccionAnalisis.email || '',
                          status: 'nuevo',
                          origen: 'Prospección B2B Maps',
                          timestamp: new Date().toISOString(),
                          pack: '',
                          demoSent: false,
                          notes: `Email enviado con plantilla: ${emailTemplate}\nAnálisis: ${prospeccionAnalisis.analisis}`
                        };
                        onAddLead(nuevoLead);
                        alert('✅ Email abierto en Gmail y lead guardado en CRM');
                      }
                    }}
                    className="flex-1 px-6 py-4 bg-[#047857] hover:bg-[#065F46] text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer"
                  >
                    <Mail className="w-4 h-4" />
                    Abrir en Gmail
                  </button>

                  <button
                    onClick={() => {
                      const telefono = prospeccionAnalisis?.telefono?.replace(/[^\d]/g, '') || '';
                      const tempDiv = document.createElement('div');
                      tempDiv.innerHTML = emailPersonalizado;
                      const mensaje = encodeURIComponent(tempDiv.textContent || '');

                      window.open(`https://wa.me/${telefono}?text=${mensaje}`, '_blank');
                    }}
                    className="flex-1 px-6 py-4 bg-[#25D366] hover:bg-[#1DA851] text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer"
                  >
                    <MessageCircle className="w-4 h-4" />
                    WhatsApp Web
                  </button>
                </div>
              )}

              {/* Estadísticas de Prospección */}
              <div className="mt-8 pt-6 border-t border-[#E7E4DC]">
                <h4 className="text-sm font-bold text-[#141311] mb-4">📊 Estadísticas de Hoy</h4>
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-[#F3F1EC] rounded-xl">
                    <div className="text-2xl font-bold text-[#047857]">0</div>
                    <div className="text-xs text-[#57534E]">Emails Enviados</div>
                  </div>
                  <div className="text-center p-4 bg-[#F3F1EC] rounded-xl">
                    <div className="text-2xl font-bold text-[#C27803]">0</div>
                    <div className="text-xs text-[#57534E]">WhatsApps Enviados</div>
                  </div>
                  <div className="text-center p-4 bg-[#F3F1EC] rounded-xl">
                    <div className="text-2xl font-bold text-[#141311]">30</div>
                    <div className="text-xs text-[#57534E]">Meta Diaria</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: MANUAL LEAD REGISTRATION */}
          {activeTab === 'nuevo' && (
            <div className="max-w-2xl mx-auto w-full bg-white p-8 rounded-3xl border border-[#E7E4DC] shadow-sm flex-grow overflow-y-auto">
              <div className="flex items-center gap-2 mb-6 pb-4 border-b border-[#E7E4DC]">
                <Plus className="w-6 h-6 text-[#C27803]" />
                <div>
                  <h3 className="text-xl font-bold text-[#141311]">
                    Registrar Nuevo Prospecto / Cliente Manual
                  </h3>
                  <p className="text-xs text-[#57534E]">
                    Para clientes captados en prospección de Google Maps, visitas o llamadas
                  </p>
                </div>
              </div>

              <form onSubmit={handleCreateManualLead} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[#141311] mb-1">
                      Nombre del Negocio en Google Maps *
                    </label>
                    <input
                      type="text"
                      required
                      value={manualNegocio}
                      onChange={(e) => setManualNegocio(e.target.value)}
                      placeholder="Ej: Mesón El Rincón / Clínica Dental Sur"
                      className="w-full px-3.5 py-2.5 bg-[#FAF9F6] border border-[#E7E4DC] focus:border-[#C27803] rounded-xl text-xs outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#141311] mb-1">
                      Ciudad o Zona
                    </label>
                    <input
                      type="text"
                      value={manualCiudad}
                      onChange={(e) => setManualCiudad(e.target.value)}
                      placeholder="Ej: Madrid / Valencia / Sevilla"
                      className="w-full px-3.5 py-2.5 bg-[#FAF9F6] border border-[#E7E4DC] focus:border-[#C27803] rounded-xl text-xs outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[#141311] mb-1">
                      Persona de Contacto
                    </label>
                    <input
                      type="text"
                      value={manualContacto}
                      onChange={(e) => setManualContacto(e.target.value)}
                      placeholder="Ej: Carlos (Propietario)"
                      className="w-full px-3.5 py-2.5 bg-[#FAF9F6] border border-[#E7E4DC] focus:border-[#C27803] rounded-xl text-xs outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#141311] mb-1">
                      Teléfono / WhatsApp *
                    </label>
                    <input
                      type="tel"
                      required
                      value={manualTelefono}
                      onChange={(e) => setManualTelefono(e.target.value)}
                      placeholder="Ej: 612 345 678"
                      className="w-full px-3.5 py-2.5 bg-[#FAF9F6] border border-[#E7E4DC] focus:border-[#C27803] rounded-xl text-xs outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#141311] mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      value={manualEmail}
                      onChange={(e) => setManualEmail(e.target.value)}
                      placeholder="contacto@negocio.com"
                      className="w-full px-3.5 py-2.5 bg-[#FAF9F6] border border-[#E7E4DC] focus:border-[#C27803] rounded-xl text-xs outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[#141311] mb-1">
                      Pack de Interés
                    </label>
                    <select
                      value={manualPack}
                      onChange={(e) => setManualPack(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-[#FAF9F6] border border-[#E7E4DC] focus:border-[#C27803] rounded-xl text-xs outline-none font-bold cursor-pointer"
                    >
                      <option value="Pack Mostrador Pro (59€)">Pack Mostrador Pro (59€)</option>
                      <option value="Pack Comercio + Equipo (99€)">Pack Comercio + Equipo (99€) ⭐ Más Vendido</option>
                      <option value="Pack Gran Equipo (159€)">Pack Gran Equipo (159€)</option>
                      <option value="Presupuesto a Medida">Presupuesto a Medida</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#141311] mb-1">
                      Canal de Captación / Origen
                    </label>
                    <select
                      value={manualOrigen}
                      onChange={(e) => setManualOrigen(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-[#FAF9F6] border border-[#E7E4DC] focus:border-[#C27803] rounded-xl text-xs outline-none font-bold cursor-pointer"
                    >
                      <option value="Prospección Directa Maps">Prospección en Google Maps</option>
                      <option value="Llamada Telefónica">Llamada en Frío / Teléfono</option>
                      <option value="Visita Presencial">Visita Presencial en Local</option>
                      <option value="Instagram / Redes">Instagram / Redes Sociales</option>
                      <option value="Recomendación">Recomendación de Cliente</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#141311] mb-1">
                    Notas Comerciales Iniciales
                  </label>
                  <textarea
                    rows={3}
                    value={manualNotas}
                    onChange={(e) => setManualNotas(e.target.value)}
                    placeholder="Ej: Interesado en 2 tarjetas extra para terraza, llamarle el jueves por la mañana tras enviarle el vídeo."
                    className="w-full px-3.5 py-2.5 bg-[#FAF9F6] border border-[#E7E4DC] focus:border-[#C27803] rounded-xl text-xs outline-none"
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#E7E4DC]">
                  <button
                    type="button"
                    onClick={() => setActiveTab('kanban')}
                    className="px-5 py-2.5 rounded-xl border border-[#E7E4DC] text-xs font-bold text-[#57534E] hover:bg-[#F3F1EC] cursor-pointer"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl bg-[#C27803] hover:bg-[#A16207] text-white text-xs font-bold transition-all shadow-md cursor-pointer flex items-center gap-1.5"
                  >
                    <span>Guardar Prospecto en CRM</span>
                    <span>→</span>
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>

        {/* MODAL: EDIT NOTES */}
        {selectedLeadForNotes && (
          <div
            className="fixed inset-0 z-60 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4"
            onClick={() => setSelectedLeadForNotes(null)}
          >
            <div
              className="bg-white rounded-3xl p-6 max-w-lg w-full shadow-2xl border border-[#E7E4DC] space-y-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between pb-3 border-b border-[#E7E4DC]">
                <div>
                  <h3 className="text-base font-bold text-[#141311]">
                    Notas de {selectedLeadForNotes.negocio}
                  </h3>
                  <p className="text-xs text-[#57534E]">
                    Contacto: {selectedLeadForNotes.contacto} ({selectedLeadForNotes.telefono})
                  </p>
                </div>
                <button
                  onClick={() => setSelectedLeadForNotes(null)}
                  className="w-7 h-7 rounded-full bg-[#F3F1EC] text-xs flex items-center justify-center cursor-pointer"
                >
                  ×
                </button>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#141311] mb-1">
                  Observaciones Comerciales & Acuerdos:
                </label>
                <textarea
                  rows={5}
                  value={tempNotes}
                  onChange={(e) => setTempNotes(e.target.value)}
                  placeholder="Escribe detalles de la conversación, objeciones, fecha acordada para el cobro o requerimientos de logotipo..."
                  className="w-full p-3 bg-[#FAF9F6] border border-[#E7E4DC] focus:border-[#C27803] rounded-xl text-xs outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  onClick={() => setSelectedLeadForNotes(null)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-[#57534E] hover:bg-[#F3F1EC] cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  onClick={saveNotes}
                  className="px-5 py-2 rounded-xl bg-[#141311] text-white text-xs font-bold hover:bg-[#2A2826] cursor-pointer shadow-sm"
                >
                  Guardar Notas
                </button>
              </div>
            </div>
          </div>
        )}

        {/* MODAL: WHATSAPP SCRIPT VIEWER & SENDER */}
        {scriptModalLead && (
          <div
            className="fixed inset-0 z-60 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4"
            onClick={() => setScriptModalLead(null)}
          >
            <div
              className="bg-white rounded-3xl p-6 sm:p-8 max-w-xl w-full shadow-2xl border border-[#E7E4DC] space-y-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between pb-3 border-b border-[#E7E4DC]">
                <div className="flex items-center gap-2">
                  <span className="text-xl">📲</span>
                  <div>
                    <h3 className="text-base font-bold text-[#141311]">
                      Guiones de WhatsApp para {scriptModalLead.negocio}
                    </h3>
                    <p className="text-xs text-[#57534E]">
                      Destinatario: {scriptModalLead.contacto} ({scriptModalLead.telefono})
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setScriptModalLead(null)}
                  className="w-7 h-7 rounded-full bg-[#F3F1EC] text-xs flex items-center justify-center cursor-pointer"
                >
                  ×
                </button>
              </div>

              {/* Script selector tabs */}
              <div className="grid grid-cols-3 gap-2 bg-[#F3F1EC] p-1 rounded-xl">
                <button
                  onClick={() => setSelectedScriptType('demo')}
                  className={`py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                    selectedScriptType === 'demo'
                      ? 'bg-white text-emerald-700 shadow-xs'
                      : 'text-[#57534E]'
                  }`}
                >
                  🎬 1. Entrega de Demo
                </button>
                <button
                  onClick={() => setSelectedScriptType('seguimiento')}
                  className={`py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                    selectedScriptType === 'seguimiento'
                      ? 'bg-white text-blue-700 shadow-xs'
                      : 'text-[#57534E]'
                  }`}
                >
                  ⏰ 2. Seguimiento 48h
                </button>
                <button
                  onClick={() => setSelectedScriptType('cierre')}
                  className={`py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                    selectedScriptType === 'cierre'
                      ? 'bg-white text-[#C27803] shadow-xs'
                      : 'text-[#57534E]'
                  }`}
                >
                  💳 3. Oferta & Pago
                </button>
              </div>

              {/* Script Preview Box */}
              <div className="bg-[#F8FAFC] border border-slate-200 rounded-2xl p-4 text-xs font-sans text-[#1E293B] whitespace-pre-line leading-relaxed max-h-60 overflow-y-auto">
                {getWhatsAppScriptText(scriptModalLead, selectedScriptType)}
              </div>

              <div className="flex items-center justify-between pt-2">
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(getWhatsAppScriptText(scriptModalLead, selectedScriptType));
                    alert('¡Texto copiado al portapapeles!');
                  }}
                  className="text-xs font-bold text-[#57534E] hover:text-[#141311] underline cursor-pointer"
                >
                  📋 Copiar Texto
                </button>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setScriptModalLead(null)}
                    className="px-4 py-2 rounded-xl text-xs font-bold text-[#57534E] hover:bg-[#F3F1EC] cursor-pointer"
                  >
                    Cerrar
                  </button>
                  <button
                    onClick={() => {
                      openWhatsAppWithScript(scriptModalLead, selectedScriptType);
                      setScriptModalLead(null);
                    }}
                    className="px-5 py-2 rounded-xl bg-[#25D366] hover:bg-[#1EBE5D] text-white text-xs font-bold transition-all shadow-md cursor-pointer flex items-center gap-1.5"
                  >
                    <span>Abrir WhatsApp Web / App</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
