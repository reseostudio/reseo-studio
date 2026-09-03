import React, { useState, useEffect, useRef } from 'react';
import { LegalModal, LegalTab } from './components/LegalModal';
import { CookieBanner } from './components/CookieBanner';
import { CrmDashboard } from './components/CrmDashboard';
import { LeadData, LeadStatus } from './types/crm';

interface ChatMessage {
  role: 'bot' | 'user';
  content: string;
  isHtml?: boolean;
}

export default function App() {
  // Modal State
  const [isDemoModalOpen, setIsDemoModalOpen] = useState(false);
  const [selectedPackForModal, setSelectedPackForModal] = useState('General');
  const [leadSubmitted, setLeadSubmitted] = useState(false);
  const [submittedLeadData, setSubmittedLeadData] = useState<LeadData | null>(null);

  // Legal Modal State (GDPR / RGPD & Compliance)
  const [isLegalModalOpen, setIsLegalModalOpen] = useState(false);
  const [legalModalTab, setLegalModalTab] = useState<LegalTab>('privacidad');

  const openLegalModal = (tab: LegalTab = 'privacidad') => {
    setLegalModalTab(tab);
    setIsLegalModalOpen(true);
  };

  const closeLegalModal = () => {
    setIsLegalModalOpen(false);
  };

  // CRM Admin Panel State
  const [isCrmOpen, setIsCrmOpen] = useState(false);
  const [crmLeads, setCrmLeads] = useState<LeadData[]>(() => {
    try {
      const saved = localStorage.getItem('reseostudio_leads');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [crmSearch, setCrmSearch] = useState('');
  const [isAdminAuthed, setIsAdminAuthed] = useState(false);

  // Demo Form State
  const [formBizName, setFormBizName] = useState('');
  const [formBizCity, setFormBizCity] = useState('');
  const [formUserName, setFormUserName] = useState('');
  const [formUserEmail, setFormUserEmail] = useState('');
  const [formUserPhone, setFormUserPhone] = useState('');
  const [formPrivacyAccepted, setFormPrivacyAccepted] = useState(false);

  // Simulator State
  const [simBizName, setSimBizName] = useState('Restaurante Asador Don Juan');
  const [simSector, setSimSector] = useState<'hosteleria' | 'salud' | 'talleres' | 'comercio'>('hosteleria');
  const [simStage, setSimStage] = useState<'idle' | 'detecting' | 'review' | 'submitted'>('idle');
  const [simRating, setSimRating] = useState(5);

  // Chatbot State
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      role: 'bot',
      content:
        '👋 ¡Hola! Soy tu <strong>Asesor Senior de RESEO STUDIO</strong>. Conozco a fondo el algoritmo de Google Maps, el factor GPS y nuestro sistema de captación NFC.<br><br>¿Qué tipo de negocio tienes o qué duda te gustaría resolver?',
      isHtml: true,
    },
  ]);
  const chatMessagesEndRef = useRef<HTMLDivElement>(null);

  // Custom hardware images state (with real product photography)
  const [expositorImg, setExpositorImg] = useState<string>(() => {
    try {
      const saved = typeof window !== 'undefined' ? localStorage.getItem('reseostudio_expositor_img') : null;
      if (!saved || saved.endsWith('.svg')) return '/images/expositor_cerca_mejorado.jpg';
      return saved;
    } catch {
      return '/images/expositor_cerca_mejorado.jpg';
    }
  });
  const [tarjetaImg, setTarjetaImg] = useState<string>(() => {
    try {
      const saved = typeof window !== 'undefined' ? localStorage.getItem('reseostudio_tarjeta_img') : null;
      if (!saved || saved.endsWith('.svg')) return '/images/imagen-tarjeta.jpg';
      return saved;
    } catch {
      return '/images/imagen-tarjeta.jpg';
    }
  });

  const expositorFileInputRef = useRef<HTMLInputElement>(null);
  const tarjetaFileInputRef = useRef<HTMLInputElement>(null);

  const handleExpositorUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64 = event.target?.result as string;
        if (base64) {
          setExpositorImg(base64);
          localStorage.setItem('reseostudio_expositor_img', base64);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleTarjetaUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64 = event.target?.result as string;
        if (base64) {
          setTarjetaImg(base64);
          localStorage.setItem('reseostudio_tarjeta_img', base64);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Sector Data for Simulator
  const sectorConfigs = {
    hosteleria: {
      category: 'Restaurante · 4.9 ★',
      chips: ['Comida excelente', 'Servicio rápido', 'Buen ambiente', 'Calidad 10/10'],
      text: '¡La comida espectacular y el trato del personal inmejorable! Totalmente recomendado.',
    },
    salud: {
      category: 'Clínica & Salud · 5.0 ★',
      chips: ['Trato muy profesional', 'Cero dolor', 'Instalaciones impecables', 'Muy amables'],
      text: 'Un equipo súper profesional y cercano. Da gusto venir a una clínica así.',
    },
    talleres: {
      category: 'Taller Mecánico · 4.8 ★',
      chips: ['Honestidad total', 'Rapidez en entrega', 'Buen precio', 'Gran trabajo'],
      text: 'Rapidez y honestidad. Me solucionaron la avería en el mismo día.',
    },
    comercio: {
      category: 'Comercio Local · 4.9 ★',
      chips: ['Atención personalizada', 'Gran variedad', 'Muy amables', 'Recomendado'],
      text: 'Atención de diez. Da gusto apoyar a los comercios que te cuidan así.',
    },
  };

  // Load Leads & listen for admin hash / shortcut
  useEffect(() => {
    try {
      const storedLeads = JSON.parse(localStorage.getItem('reseostudio_leads') || '[]');
      if (storedLeads.length === 0) {
        const initialSeeds: LeadData[] = [
          {
            id: 'seed-1',
            tipo: 'Solicitud Demo Video',
            negocio: 'Asador El Roble',
            ciudad: 'Madrid, Calle Alcalá',
            contacto: 'Javier Martínez (Gerente)',
            email: 'gerencia@asadorelroble.es',
            telefono: '+34 622 11 44 55',
            pack: 'Pack Comercio + Equipo (99€)',
            timestamp: new Date(Date.now() - 3600000 * 5).toISOString(),
            target_email: 'reseostudio@gmail.com',
            origen: 'Formulario Web',
            status: 'nuevo',
          },
          {
            id: 'seed-2',
            tipo: 'Solicitud Demo Video',
            negocio: 'Clínica Dental Rosales',
            ciudad: 'Valencia, Gran Vía',
            contacto: 'Dra. Carmen Rosales',
            email: 'carmen@dentalrosales.com',
            telefono: '+34 655 88 99 00',
            pack: 'Pack Mostrador Pro (59€)',
            timestamp: new Date(Date.now() - 3600000 * 24).toISOString(),
            target_email: 'reseostudio@gmail.com',
            origen: 'Chatbot IA Gemini',
            status: 'nuevo',
          },
        ];
        localStorage.setItem('reseostudio_leads', JSON.stringify(initialSeeds));
        setCrmLeads(initialSeeds);
      } else {
        setCrmLeads(storedLeads);
      }
    } catch (e) {
      console.error('Error loading CRM leads:', e);
    }

    if (window.location.hash === '#admin' || window.location.hash === '#crm') {
      setIsCrmOpen(true);
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'L' || e.key === 'l' || e.key === 'A' || e.key === 'a')) {
        e.preventDefault();
        setIsCrmOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Scroll chat to bottom
  useEffect(() => {
    if (isChatOpen && chatMessagesEndRef.current) {
      chatMessagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatMessages, isTyping, isChatOpen]);

  // Open Modal Handler
  const openDemoModal = (packName: string = 'General') => {
    setSelectedPackForModal(packName);
    setLeadSubmitted(false);
    setFormPrivacyAccepted(false);
    if (simBizName) {
      setFormBizName(simBizName);
    }
    setIsDemoModalOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeDemoModal = () => {
    setIsDemoModalOpen(false);
    document.body.style.overflow = 'auto';
  };

  // ---- Autenticación CRM ----
  const getToken = () => localStorage.getItem('reseostudio_admin_token');
  const authHeaders = () => {
    const t = getToken();
    return { 'Content-Type': 'application/json', ...(t ? { Authorization: `Bearer ${t}` } : {}) };
  };

  const fetchLeads = () => {
    const t = getToken();
    if (!t) return;
    fetch('/api/leads', { headers: { Authorization: `Bearer ${t}` } })
      .then((res) => (res.ok ? res.json() : Promise.reject()))
      .then((data) => {
        if (data.leads && Array.isArray(data.leads)) {
          setCrmLeads(data.leads);
          localStorage.setItem('reseostudio_leads', JSON.stringify(data.leads));
        }
      })
      .catch(() => {});
  };

  // Al cargar: validar token guardado
  useEffect(() => {
    const t = getToken();
    if (!t) return;
    fetch('/api/auth/check', { headers: { Authorization: `Bearer ${t}` } })
      .then((res) => {
        if (res.ok) {
          setIsAdminAuthed(true);
          fetchLeads();
        } else {
          localStorage.removeItem('reseostudio_admin_token');
          setIsAdminAuthed(false);
        }
      })
      .catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCrmLogin = async (password: string): Promise<string | null> => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();
      if (data?.token) {
        localStorage.setItem('reseostudio_admin_token', data.token);
        setIsAdminAuthed(true);
        fetchLeads();
        return null;
      }
      return data?.error || 'Contraseña incorrecta';
    } catch {
      return 'Error de conexión con el servidor';
    }
  };

  const handleCrmLogout = () => {
    localStorage.removeItem('reseostudio_admin_token');
    setIsAdminAuthed(false);
    setCrmLeads([]);
  };

  const handleAdvanceFollowUp = (lead: LeadData) => {
    fetch(`/api/leads/${lead.id}/activities`, {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify({ type: 'seguimiento', content: 'Seguimiento realizado', advance: true }),
    })
      .then((res) => (res.ok ? res.json() : Promise.reject()))
      .then((data) => {
        if (data?.lead) setCrmLeads((prev) => prev.map((l) => (l.id === lead.id ? data.lead : l)));
      })
      .catch(() => {});
  };

  const handleAddActivity = (lead: LeadData, type: string, content: string) => {
    fetch(`/api/leads/${lead.id}/activities`, {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify({ type, content }),
    })
      .then((res) => (res.ok ? res.json() : Promise.reject()))
      .then((data) => {
        if (data?.lead) setCrmLeads((prev) => prev.map((l) => (l.id === lead.id ? data.lead : l)));
      })
      .catch(() => {});
  };

  const handleImportRows = (rows: any[]): Promise<number> => {
    return fetch('/api/import', {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify({ rows }),
    })
      .then((res) => (res.ok ? res.json() : Promise.reject()))
      .then((data) => {
        fetchLeads();
        return data?.inserted || 0;
      })
      .catch(() => 0);
  };

  // Save Lead to Local Database & Server
  const saveLeadToDatabase = async (leadInput: Omit<LeadData, 'id' | 'timestamp' | 'target_email' | 'status'>) => {
    try {
      const existingLeads: LeadData[] = JSON.parse(
        localStorage.getItem('reseostudio_leads') || '[]'
      );
      const newLead: LeadData = {
        ...leadInput,
        id: 'lead-' + Date.now(),
        status: 'nuevo',
        demoSent: false,
        timestamp: new Date().toISOString(),
        target_email: 'reseostudio@gmail.com',
      };
      const updated = [newLead, ...existingLeads];
      localStorage.setItem('reseostudio_leads', JSON.stringify(updated));
      setCrmLeads(updated);

      // Async notification & persistence to server
      fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newLead),
      }).catch((err) => console.log('Lead notification sent to server:', err));

      return newLead;
    } catch (e) {
      console.error('Error guardando lead en base de datos:', e);
      return null;
    }
  };

  // Update existing Lead in CRM
  const handleUpdateLead = (updatedLead: LeadData) => {
    const updated = crmLeads.map((l) => (l.id === updatedLead.id ? updatedLead : l));
    setCrmLeads(updated);
    localStorage.setItem('reseostudio_leads', JSON.stringify(updated));

    fetch(`/api/leads/${updatedLead.id}`, {
      method: 'PATCH',
      headers: authHeaders(),
      body: JSON.stringify(updatedLead),
    }).catch((err) => console.error('Error updating lead on server:', err));
  };

  // Delete Lead
  const handleDeleteLead = (id: string) => {
    const updated = crmLeads.filter((l) => l.id !== id);
    setCrmLeads(updated);
    localStorage.setItem('reseostudio_leads', JSON.stringify(updated));

    fetch(`/api/leads/${id}`, {
      method: 'DELETE',
      headers: authHeaders(),
    }).catch((err) => console.error('Error deleting lead from server:', err));
  };

  // Add Manual Lead
  const handleAddLead = (newLead: LeadData) => {
    const updated = [newLead, ...crmLeads];
    setCrmLeads(updated);
    localStorage.setItem('reseostudio_leads', JSON.stringify(updated));

    fetch('/api/leads', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newLead),
    }).catch((err) => console.error('Error adding lead to server:', err));
  };

  // Export Leads to CSV / Excel
  const exportLeadsToCsv = () => {
    if (crmLeads.length === 0) {
      alert('No hay clientes en el CRM para exportar.');
      return;
    }

    const headers = [
      'ID',
      'Fecha Creación',
      'Negocio',
      'Ciudad',
      'Contacto',
      'Teléfono / WhatsApp',
      'Email',
      'Estado Pipeline',
      'Demo Enviada',
      'Fecha Envío Demo',
      'Pack Solicitado',
      'Origen',
      'Notas Comerciales',
    ];

    const rows = crmLeads.map((l) => [
      l.id,
      new Date(l.timestamp).toLocaleString('es-ES'),
      `"${(l.negocio || '').replace(/"/g, '""')}"`,
      `"${(l.ciudad || '').replace(/"/g, '""')}"`,
      `"${(l.contacto || '').replace(/"/g, '""')}"`,
      l.telefono,
      l.email,
      l.status || 'nuevo',
      l.demoSent ? 'SI' : 'NO',
      l.demoSentDate ? new Date(l.demoSentDate).toLocaleString('es-ES') : '-',
      `"${(l.pack || '').replace(/"/g, '""')}"`,
      l.origen || 'Web',
      `"${(l.notas || '').replace(/"/g, '""')}"`,
    ]);

    const csvContent =
      '\uFEFF' +
      [headers.join(';'), ...rows.map((e) => e.join(';'))].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `CRM_RESEOSTUDIO_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Handle Form Submit
  const handleDemoSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const saved = await saveLeadToDatabase({
      tipo: 'Solicitud Demo Video',
      negocio: formBizName,
      ciudad: formBizCity,
      contacto: formUserName,
      email: formUserEmail,
      telefono: formUserPhone,
      pack: selectedPackForModal,
      origen: 'Formulario Web',
    });

    if (saved) {
      setSubmittedLeadData(saved);
      setLeadSubmitted(true);
    }

    const message = encodeURIComponent(
      `Hola RESEO STUDIO, soy ${formUserName}. Me gustaría solicitar la vídeo-demo gratuita de 60 segundos con nuestro expositor NFC vinculado a la ficha de mi negocio: "${formBizName}" en ${formBizCity}. Interesado en: ${selectedPackForModal}. Mi Email es: ${formUserEmail} y teléfono: ${formUserPhone}.`
    );

    window.open(`https://wa.me/34686478561?text=${message}`, '_blank');
  };

  // Run Realistic NFC Simulator Demo
  const executeRealisticNfcDemo = () => {
    if (simStage === 'detecting') return;

    setSimStage('detecting');

    setTimeout(() => {
      setSimStage('review');
      setSimRating(5);
    }, 1200);
  };

  // Submit Review inside Simulator
  // Submit Review inside Simulator
  const handleSimSubmitReview = () => {
    setSimStage('submitted');
  };

  // SECURE BACKEND PROXY CHAT INTEGRATION - RESEO STUDIO Consultant
  async function responderConIA(mensajeUsuario: string): Promise<string> {
    try {
      const recentHistory = chatMessages.slice(-6).map((m) => ({
        role: m.role === 'user' ? 'user' : 'assistant',
        content: m.content,
      }));

      const backendRes = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: mensajeUsuario,
          history: recentHistory,
        }),
      });

      if (backendRes.ok) {
        const backendData = await backendRes.json();
        if (backendData?.reply) {
          return backendData.reply;
        }
      }
    } catch (err) {
      console.warn('Backend chat failed, using local expert rules:', err);
    }

    return buildSmartConversationalReply(mensajeUsuario);
  }

  // Chatbot Logic: Handle Message Submit with Typing State
  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || chatInput).trim();
    if (!text) return;

    if (!textToSend) setChatInput('');

    const newMessages: ChatMessage[] = [...chatMessages, { role: 'user', content: text }];
    setChatMessages(newMessages);
    setIsTyping(true);

    // Auto-detect email address for lead capture
    const emailRegex = /([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/g;
    const emailMatch = text.match(emailRegex);

    // Auto-detect phone number
    const phoneRegex = /(\+?[0-9\s-]{8,15})/g;
    const phoneMatch = text.match(phoneRegex);

    if (emailMatch && emailMatch.length > 0) {
      const detectedEmail = emailMatch[0];
      const detectedPhone = phoneMatch ? phoneMatch[0].trim() : 'Pendiente';

      saveLeadToDatabase({
        tipo: 'Lead Capturado por Chatbot IA',
        negocio: simBizName || 'Negocio Local vía Chat',
        ciudad: 'España',
        contacto: 'Visitante Chatbot',
        email: detectedEmail,
        telefono: detectedPhone,
        pack: 'Pack Comercio + Equipo (99€)',
        origen: 'Chatbot IA (Auto-Email)',
      });

      const leadConfirmation = `✅ <strong>¡Perfecto! Hemos anotado tu correo (<code>${detectedEmail}</code>).</strong><br><br>El equipo de <em>reseostudio@gmail.com</em> ya te está preparando la <strong>vídeo-demo personalizada de 60 segundos</strong> con tu ficha de Google Maps. Te llegará en menos de 24 horas.<br><br>¿De qué sector es tu negocio para afinar el ejemplo?`;
      setIsTyping(false);
      const updatedMessages: ChatMessage[] = [
        ...newMessages,
        { role: 'bot', content: leadConfirmation, isHtml: true },
      ];
      setChatMessages(updatedMessages);
      try {
        localStorage.setItem('reseostudio_last_chat', JSON.stringify(updatedMessages));
      } catch (err) {
        console.error(err);
      }
      return;
    }

    const reply = await responderConIA(text);

    setIsTyping(false);
    const updatedMessages: ChatMessage[] = [
      ...newMessages,
      { role: 'bot', content: reply, isHtml: true },
    ];
    setChatMessages(updatedMessages);

    try {
      localStorage.setItem('reseostudio_last_chat', JSON.stringify(updatedMessages));
    } catch (err) {
      console.error(err);
    }
  };

  const buildSmartConversationalReply = (q: string) => {
    const query = q.toLowerCase();

    // 1. Pregunta sobre tipo de negocio / inicio
    if (
      query.includes('tengo un') ||
      query.includes('mi negocio') ||
      query.includes('restaurante') ||
      query.includes('clínica') ||
      query.includes('clinica') ||
      query.includes('taller') ||
      query.includes('tienda') ||
      query.includes('peluquería') ||
      query.includes('peluqueria') ||
      query.includes('empresa') ||
      query.includes('empezar')
    ) {
      return (
        '👋 ¡Excelente! Cada sector tiene su momento clave: en <strong>hostelería</strong> se capta en mesa, en <strong>clínicas</strong> al salir del sillón y en <strong>comercios</strong> en caja.<br><br>' +
        'Con el soporte NFC, tus clientes publican 5★ en 3 segundos antes de salir de tu local.<br><br>' +
        '🎬 <strong>¿Quieres ver cómo quedaría con tu negocio?</strong> Escribe el nombre de tu local o tu WhatsApp y te preparamos una <strong>vídeo-demo gratuita de 60s</strong>.'
      );
    }

    // 2. Por qué no sirve WhatsApp / borrado de reseñas por señal GPS
    if (
      query.includes('whatsapp') ||
      query.includes('enviar') ||
      query.includes('distancia') ||
      query.includes('casa') ||
      query.includes('link') ||
      query.includes('enlace')
    ) {
      return (
        '📍 <strong>Por qué Google borra reseñas enviadas por WhatsApp:</strong><br>' +
        'Google exige señal GPS en tiempo real. Si el cliente opina desde casa, el algoritmo anti-spam detecta la distancia y <strong>elimina la reseña en 24-48h</strong>.<br><br>' +
        'Con nuestro soporte NFC el cliente opina presencialmente en tu local y queda 100% verificada.<br><br>' +
        '🎬 <strong>¿Te preparamos la vídeo-demo de 60s con tu ficha?</strong> Dime tu WhatsApp o nombre de empresa para enviártela hoy mismo.'
      );
    }

    // 3. Diferencia QR vs NFC
    if (
      query.includes('qr') ||
      query.includes('codigo') ||
      query.includes('código') ||
      query.includes('diferencia') ||
      query.includes('friccion') ||
      query.includes('fricción')
    ) {
      return (
        '⚡ <strong>Por qué el QR pierde el 85% de las opiniones:</strong><br>' +
        'El QR obliga a 4 pasos (abrir cámara, enfocar, luz, navegador). El <strong>NFC funciona con 1 toque en 3 segundos</strong> directamente en la app de Google Maps sin teclear nada.<br><br>' +
        '🎬 <strong>Comprueba la diferencia:</strong> Escribe tu WhatsApp o email y te mandamos una <strong>vídeo-demo personalizada de 60s</strong> con tu local.'
      );
    }

    // 4. Opiniones negativas y protección
    if (
      query.includes('negativa') ||
      query.includes('mala') ||
      query.includes('queja') ||
      query.includes('malo') ||
      query.includes('miedo') ||
      query.includes('frenar')
    ) {
      return (
        '💡 <strong>Cómo frenar y diluir reseñas negativas:</strong><br>' +
        'Los clientes insatisfechos siempre se quejan, pero los felices no opinan por pereza. Al poner NFC en tu local, canalizas al 90% de tus clientes satisfechos creando un <strong>muro continuo de 5 estrellas</strong>.<br><br>' +
        '🎬 <strong>¿Quieres proteger tu negocio?</strong> Indícanos tu WhatsApp o negocio y te preparamos la <strong>vídeo-demo gratuita de 60s</strong>.'
      );
    }

    // 5. Dudas sobre algoritmo / posicionamiento en Maps (SEO Local)
    if (
      query.includes('posicionar') ||
      query.includes('posicionamiento') ||
      query.includes('algoritmo') ||
      query.includes('maps') ||
      query.includes('top 3') ||
      query.includes('subir') ||
      query.includes('google')
    ) {
      return (
        '🚀 <strong>Cómo escalar al Top 3 de Google Maps:</strong><br>' +
        'El algoritmo premia la <strong>frecuencia diaria constante</strong> y la <strong>verificación GPS en el establecimiento</strong>. Recibir 2-5 reseñas diarias con NFC supera a competidores con opiniones viejas.<br><br>' +
        '🎬 <strong>¿Quieres una auditoría y vídeo-demo gratuita de 60s para tu local?</strong> Escribe aquí tu WhatsApp o nombre de negocio.'
      );
    }

    // 6. Precios y packs (solo si preguntan explícitamente)
    if (
      query.includes('precio') ||
      query.includes('cuesta') ||
      query.includes('pack') ||
      query.includes('tarifa') ||
      query.includes('cuanto') ||
      query.includes('vale') ||
      query.includes('planes')
    ) {
      return (
        '📦 <strong>Packs Oficiales (Pago Único · Sin Cuotas Mensuales):</strong><br>' +
        '• <strong>Pack Mostrador Pro (59 €):</strong> 1 Expositor acrílico para caja + 2 Bonos (144€ gratis).<br>' +
        '• <strong>Pack Comercio + Equipo (99 €) ⭐ [Más Vendido]:</strong> 1 Expositor + 2 Tarjetas NFC de personal + 2 Bonos.<br>' +
        '• <strong>Pack Gran Equipo (159 €):</strong> 1 Expositor + 5 Tarjetas NFC + 2 Bonos.<br><br>' +
        '🛡️ Con 14 días de Garantía de 5 reseñas o 100% de devolución.<br><br>' +
        '🎬 <strong>¿Quieres ver primero el vídeo de tu negocio?</strong> Escribe tu WhatsApp o email.'
      );
    }

    // Respuesta por defecto consultiva con CTA
    return (
      'En <strong>RESEO STUDIO</strong> ayudamos a negocios locales a conseguir reseñas de 5 estrellas en 3 segundos en el punto de cobro para liderar Google Maps.<br><br>' +
      '🎬 <strong>¿Quieres ver cómo funciona con tu propio local?</strong> Escribe tu WhatsApp o email y te enviamos hoy mismo una <strong>vídeo-demo personalizada de 60 segundos</strong>.'
    );
  };

  const currentSectorData = sectorConfigs[simSector];
  const firstLetter = (simBizName || 'M').charAt(0).toUpperCase();

  const filteredCrmLeads = crmLeads.filter(
    (l) =>
      l.negocio.toLowerCase().includes(crmSearch.toLowerCase()) ||
      l.ciudad.toLowerCase().includes(crmSearch.toLowerCase()) ||
      l.contacto.toLowerCase().includes(crmSearch.toLowerCase()) ||
      l.email.toLowerCase().includes(crmSearch.toLowerCase()) ||
      l.telefono.toLowerCase().includes(crmSearch.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#FAF9F6] text-[#141311] font-['DM_Sans',sans-serif]">
      {/* Top Navigation Header */}
      <nav className="sticky top-0 z-40 bg-[#FAF9F6]/90 backdrop-blur-md border-b border-[#E7E4DC] py-4">
        <div className="max-w-[1140px] mx-auto px-6 flex justify-between items-center">
          <div className="flex items-center gap-3 text-[#141311]">
            <div
              onDoubleClick={() => setIsCrmOpen(true)}
              title="RESEO STUDIO"
              className="w-8 h-8 bg-[#141311] text-white rounded-md flex items-center justify-center font-['Outfit',sans-serif] font-black text-base select-none cursor-pointer tracking-[-0.03em]"
            >
              R
            </div>
            <span className="font-['Outfit',sans-serif] font-extrabold text-xl tracking-[-0.03em]">
              RESEO STUDIO
            </span>
          </div>

          <div className="flex items-center gap-3 sm:gap-6">
            <a
              href="#algoritmo"
              className="hidden md:inline-block text-[#57534E] hover:text-[#141311] text-sm font-semibold transition-colors"
            >
              Algoritmo Google
            </a>
            <a
              href="#simulador"
              className="hidden md:inline-block text-[#57534E] hover:text-[#141311] text-sm font-semibold transition-colors"
            >
              Simulador NFC
            </a>
            <a
              href="#precios"
              className="hidden md:inline-block text-[#57534E] hover:text-[#141311] text-sm font-semibold transition-colors"
            >
              Tarifas Oficiales
            </a>

            <button
              onClick={() => openDemoModal()}
              className="bg-[#141311] hover:bg-[#2A2826] text-white px-4 sm:px-5 py-2.5 rounded-full text-xs sm:text-sm font-bold flex items-center gap-2 shadow-sm transition-all hover:-translate-y-0.5 cursor-pointer font-['Outfit',sans-serif] tracking-[-0.03em]"
            >
              <span>🎬 Solicitar Vídeo Demo</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Main Container */}
      <div className="max-w-[1140px] mx-auto px-6">
        {/* HERO SECTION: DIRECT-RESPONSE VALUE PROPOSITION */}
        <header className="pt-20 pb-14 text-center">
          <div className="inline-flex items-center gap-2 bg-[#FEF3C7] border border-[#C27803]/25 px-4 py-1.5 rounded-full mb-6">
            <span className="text-[#C27803] text-xs font-extrabold uppercase tracking-widest">
              ⚡ SISTEMA FÍSICO DE CAPTACIÓN INMEDIATA DE RESEÑAS
            </span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-['Outfit',sans-serif] font-extrabold text-[#141311] tracking-[-0.03em] leading-[1.08] max-w-4xl mx-auto mb-6">
            Consigue reseñas de 5★ en <span className="text-[#C27803]">menos de 3 segundos</span>,
            escala al Top 3 de Google Maps y atrae clientes listos para comprar.
          </h1>

          <p className="text-lg sm:text-xl text-[#57534E] max-w-3xl mx-auto mb-10 leading-relaxed font-normal">
            El 95% de tus clientes dicen que te dejarán una valoración pero se olvidan al cruzar la
            puerta. Con nuestro <strong>expositor de mostrador y tarjetas NFC de bolsillo</strong>,
            capturas la opinión de 5 estrellas en el momento exacto del cobro o en la mesa. Sin
            fricción, sin buscar nombres y verificado por la ubicación física de Google.
          </p>

          <div className="flex items-center justify-center gap-4 flex-wrap mb-12">
            <a
              href="#simulador"
              className="bg-[#C27803] hover:bg-[#A16207] text-white text-base font-bold px-8 py-4 rounded-full flex items-center gap-2 shadow-lg shadow-[#C27803]/25 transition-all hover:-translate-y-0.5"
            >
              <span>⚡ Probar Simulador NFC en Directo</span>
              <span>↓</span>
            </a>
            <button
              onClick={() => openDemoModal()}
              className="bg-white hover:bg-[#F3F1EC] text-[#141311] border border-[#E7E4DC] text-base font-semibold px-6 py-4 rounded-full transition-all flex items-center gap-2 cursor-pointer"
            >
              <span>🎬 Ver Vídeo Demo con Mi Ficha (Gratis)</span>
            </button>
          </div>

          {/* Proof Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-[1px] bg-[#E7E4DC] border border-[#E7E4DC] rounded-xl overflow-hidden text-left mt-10">
            <div className="bg-white p-6">
              <div className="font-['Outfit',sans-serif] text-3xl font-extrabold text-[#141311] mb-1 tracking-[-0.03em]">
                3 Seg.
              </div>
              <div className="text-xs font-semibold uppercase tracking-wider text-[#8C877E]">
                Captura en caja
              </div>
            </div>
            <div className="bg-white p-6">
              <div className="font-['Outfit',sans-serif] text-3xl font-extrabold text-[#141311] mb-1 tracking-[-0.03em]">
                Top 3
              </div>
              <div className="text-xs font-semibold uppercase tracking-wider text-[#8C877E]">
                En Google Maps
              </div>
            </div>
            <div className="bg-white p-6">
              <div className="font-['Outfit',sans-serif] text-3xl font-extrabold text-[#141311] mb-1 tracking-[-0.03em]">
                GPS Real
              </div>
              <div className="text-xs font-semibold uppercase tracking-wider text-[#8C877E]">
                100% Verificadas
              </div>
            </div>
            <div className="bg-white p-6">
              <div className="font-['Outfit',sans-serif] text-3xl font-extrabold text-[#141311] mb-1 tracking-[-0.03em]">
                100%
              </div>
              <div className="text-xs font-semibold uppercase tracking-wider text-[#8C877E]">
                Sin cuotas mensuales
              </div>
            </div>
          </div>
        </header>

        {/* SECCIÓN TÉCNICA: EL ALGORITMO DE GOOGLE MAPS 2026 AL DESCUBIERTO */}
        <section id="algoritmo" className="py-20 border-t border-[#E7E4DC]">
          <span className="font-mono text-xs text-[#C27803] font-bold tracking-widest uppercase block mb-3">
            01. Secretos del Algoritmo Local
          </span>
          <h2 className="text-3xl sm:text-4xl font-['Outfit',sans-serif] font-bold tracking-[-0.03em] mb-4">
            Por Qué Este Sistema Multiplica x5 tu Posicionamiento en Maps
          </h2>
          <p className="text-base sm:text-lg text-[#57534E] max-w-3xl leading-relaxed mb-10">
            Google ha cambiado las reglas: las reseñas antiguas ya no te mantienen arriba y
            enviarlas por WhatsApp o enlaces web perjudica tu perfil. Así premia el algoritmo la
            autenticidad física.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Card 1: Peligro de WhatsApp */}
            <div className="bg-[#FFFDFD] border border-[#E7E4DC] border-t-4 border-t-[#B91C1C] rounded-xl p-8 shadow-sm flex flex-col">
              <div className="font-mono text-xs font-extrabold tracking-wider text-[#B91C1C] uppercase mb-3">
                ⚠️ El Error Común
              </div>
              <h3 className="text-xl font-bold text-[#141311] mb-3 leading-snug">
                Por Qué Enviar Enlaces por WhatsApp No Funciona
              </h3>
              <p className="text-sm text-[#57534E] leading-relaxed">
                Cuando envías un enlace por WhatsApp, el cliente suele opinar desde su casa o a
                kilómetros de distancia.{' '}
                <strong className="text-[#141311]">
                  El algoritmo de Google cruza la geolocalización GPS del teléfono con la de tu local
                </strong>
                . Si detecta opiniones desde fuera del establecimiento o desde la misma IP/WiFi del
                local repetidamente, las clasifica como sospechosas y las elimina por filtros
                anti-spam.
              </p>
            </div>

            {/* Card 2: El Poder del NFC en el Local */}
            <div className="bg-[#FCFAF6] border border-[#E7E4DC] border-t-4 border-t-[#C27803] rounded-xl p-8 shadow-sm flex flex-col">
              <div className="font-mono text-xs font-extrabold tracking-wider text-[#C27803] uppercase mb-3">
                ✅ Máxima Confianza
              </div>
              <h3 className="text-xl font-bold text-[#141311] mb-3 leading-snug">
                Validación GPS en el Propio Establecimiento
              </h3>
              <p className="text-sm text-[#57534E] leading-relaxed">
                Al usar el expositor o la tarjeta NFC en caja o mesa,{' '}
                <strong className="text-[#141311]">
                  el móvil del cliente está físicamente dentro de tus coordenadas de Google Maps
                </strong>
                . Google certifica que se trata de un cliente real viviendo una experiencia
                presencial legítima. Esta señal de geolocalización es el factor #1 que dispara la
                autoridad y ranking de tu ficha.
              </p>
            </div>

            {/* Card 3: Velocidad y Flujo Continuo */}
            <div className="bg-[#F8FAFC] border border-[#E7E4DC] border-t-4 border-t-[#1A73E8] rounded-xl p-8 shadow-sm flex flex-col">
              <div className="font-mono text-xs font-extrabold tracking-wider text-[#1A73E8] uppercase mb-3">
                ⚡ Frescura Semanal
              </div>
              <h3 className="text-xl font-bold text-[#141311] mb-3 leading-snug">
                Las Reseñas del Pasado Ya No Sirven
              </h3>
              <p className="text-sm text-[#57534E] leading-relaxed">
                Tener 200 reseñas de hace 6 meses no sirve de nada hoy. El nuevo algoritmo premia la{' '}
                <strong className="text-[#141311]">
                  velocidad y frecuencia semanal de adquisición
                </strong>
                . Un negocio con 5 reseñas nuevas cada semana adelanta en visibilidad a competidores
                estancados con cientos de opiniones antiguas que sufren{' '}
                <em>dormancia algorítmica</em>.
              </p>
            </div>
          </div>

          {/* SECCIÓN VÍDEOS DEMOSTRATIVOS DE ALTA CONVERSIÓN (VÍDEO IZQUIERDA + EXPLICACIÓN DERECHA) */}
          <div className="mt-16 pt-16 border-t border-[#E7E4DC]">
            <div className="text-center max-w-3xl mx-auto mb-14">
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FEF3C7] border border-[#C27803]/30 text-[#C27803] text-xs font-black uppercase tracking-widest mb-3">
                🎬 Demostraciones Reales en Vídeo // Ver para Creer
              </span>
              <h3 className="text-3xl sm:text-4xl font-extrabold text-[#141311] font-['Outfit',sans-serif] tracking-[-0.03em] mb-4">
                Comprueba la Inmediatez del Sistema en Tu Local
              </h3>
              <p className="text-base text-[#57534E] leading-relaxed">
                Dos formatos físicos diseñados milimétricamente para adaptarse al flujo de cobro y atención de tu personal, eliminando el 100% de la fricción del cliente.
              </p>
            </div>

            <div className="space-y-16">
              {/* Bloque 1: Expositor Acrílico de Mostrador (Vídeo Reel Vertical Izquierda + Copy Derecha) */}
              <div className="bg-white border-2 border-[#E7E4DC] rounded-3xl p-6 sm:p-8 lg:p-10 shadow-xl hover:shadow-2xl transition-all duration-300 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
                {/* Columna Izquierda: Reproductor Reel Vertical 9:16 (Marco Smartphone de Lujo) */}
                <div className="lg:col-span-5 flex flex-col items-center justify-center">
                  <div className="relative w-full max-w-[270px] sm:max-w-[290px] aspect-[9/16] bg-black border-[7px] border-[#1C1A17] rounded-[36px] shadow-2xl overflow-hidden group">
                    {/* Top Speaker Notch */}
                    <div className="absolute top-2 inset-x-0 z-20 flex justify-center pointer-events-none">
                      <div className="w-16 h-1 bg-white/20 rounded-full" />
                    </div>

                    <video
                      src="/videos/expositor_demostracion.mp4"
                      controls
                      playsInline
                      preload="metadata"
                      className="w-full h-full object-cover"
                    >
                      Tu navegador no soporta la reproducción de este vídeo.
                    </video>

                    {/* Floating Status Badge */}
                    <div className="absolute bottom-3 inset-x-3 z-10 bg-[#141311]/90 backdrop-blur-md border border-[#C27803]/40 text-[#FBBF24] text-[10px] font-extrabold px-3 py-1.5 rounded-xl shadow flex items-center justify-between pointer-events-none">
                      <span className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                        <span>Punto de Cobro Fijo</span>
                      </span>
                      <span className="text-white font-mono text-[9px]">3s GPS</span>
                    </div>
                  </div>
                  <span className="text-[11px] text-[#8C877E] mt-3 font-semibold text-center">
                    📱 Formato Reel: Demostración en Mostrador
                  </span>
                </div>

                {/* Columna Derecha: Copywriting de Ventas & Explicación */}
                <div className="lg:col-span-7 flex flex-col justify-between space-y-4">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-[#FFFBEB] border border-[#C27803]/30 text-[#C27803] text-xs font-bold uppercase tracking-wider self-start">
                    <span>⚡ Formato 01: Punto de Cobro en Caja</span>
                  </div>

                  <h4 className="text-2xl sm:text-3xl font-extrabold text-[#141311] font-['Outfit',sans-serif] tracking-[-0.03em] leading-tight">
                    Captura en el Segundo Exacto del Cobro en Caja
                  </h4>

                  <p className="text-sm sm:text-base text-[#57534E] leading-relaxed">
                    Mientras el cliente espera su ticket, datáfono o factura, apoya su smartphone de manera natural sobre el expositor acrílico de alta visibilidad.
                  </p>

                  {/* 3 Value Pillars */}
                  <div className="space-y-2.5 pt-1">
                    <div className="flex items-start gap-3 bg-[#FAF9F6] p-3 rounded-xl border border-[#E7E4DC]">
                      <span className="text-emerald-600 font-bold text-base shrink-0">✓</span>
                      <p className="text-xs sm:text-sm text-[#141311]">
                        <strong>Apertura Instantánea en 3s:</strong> Despliega directamente las 5 estrellas en su app de Google Maps sin teclear el nombre de tu empresa.
                      </p>
                    </div>

                    <div className="flex items-start gap-3 bg-[#FAF9F6] p-3 rounded-xl border border-[#E7E4DC]">
                      <span className="text-emerald-600 font-bold text-base shrink-0">✓</span>
                      <p className="text-xs sm:text-sm text-[#141311]">
                        <strong>Verificación GPS en el Local:</strong> La opinión queda certificada físicamente en tus instalaciones, impidiendo que Google la borre.
                      </p>
                    </div>

                    <div className="flex items-start gap-3 bg-[#FAF9F6] p-3 rounded-xl border border-[#E7E4DC]">
                      <span className="text-emerald-600 font-bold text-base shrink-0">✓</span>
                      <p className="text-xs sm:text-sm text-[#141311]">
                        <strong>100% Autónomo:</strong> Sin cables, sin baterías y resistente a limpiezas y uso intensivo.
                      </p>
                    </div>
                  </div>

                  {/* Verbal Script Quote Box */}
                  <div className="bg-[#FAF9F6] p-3.5 rounded-xl border-l-4 border-l-[#C27803] border-y border-r border-[#E7E4DC] text-xs text-[#57534E] italic">
                    "Al entregar el ticket, el empleado solo dice: <em>'¿Nos dejas tu opinión rápida pasando el móvil por aquí?'</em>"
                  </div>

                  <div className="pt-2">
                    <button
                      onClick={() => openDemoModal('Pack Mostrador Pro (59€)')}
                      className="bg-[#141311] hover:bg-[#2A2826] text-white font-bold text-xs sm:text-sm py-3 px-6 rounded-full transition-all flex items-center gap-2 cursor-pointer shadow-md hover:-translate-y-0.5"
                    >
                      <span>🎬 Solicitar Vídeo Demo para Mi Mostrador</span>
                      <span>→</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Bloque 2: Tarjeta NFC para Personal (Vídeo Reel Vertical Izquierda + Copy Derecha) */}
              <div className="bg-white border-2 border-[#E7E4DC] rounded-3xl p-6 sm:p-8 lg:p-10 shadow-xl hover:shadow-2xl transition-all duration-300 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
                {/* Columna Izquierda: Reproductor Reel Vertical 9:16 (Marco Smartphone de Lujo) */}
                <div className="lg:col-span-5 flex flex-col items-center justify-center">
                  <div className="relative w-full max-w-[270px] sm:max-w-[290px] aspect-[9/16] bg-black border-[7px] border-[#1C1A17] rounded-[36px] shadow-2xl overflow-hidden group">
                    {/* Top Speaker Notch */}
                    <div className="absolute top-2 inset-x-0 z-20 flex justify-center pointer-events-none">
                      <div className="w-16 h-1 bg-white/20 rounded-full" />
                    </div>

                    <video
                      src="/videos/tarjeta_demostracion.mp4"
                      controls
                      playsInline
                      preload="metadata"
                      className="w-full h-full object-cover"
                    >
                      Tu navegador no soporta la reproducción de este vídeo.
                    </video>

                    {/* Floating Status Badge */}
                    <div className="absolute bottom-3 inset-x-3 z-10 bg-[#141311]/90 backdrop-blur-md border border-blue-500/40 text-blue-300 text-[10px] font-extrabold px-3 py-1.5 rounded-xl shadow flex items-center justify-between pointer-events-none">
                      <span className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-blue-400 animate-ping" />
                        <span>Tarjeta para Personal</span>
                      </span>
                      <span className="text-white font-mono text-[9px]">x3 Conversión</span>
                    </div>
                  </div>
                  <span className="text-[11px] text-[#8C877E] mt-3 font-semibold text-center">
                    📱 Formato Reel: Demostración con Personal en Sala
                  </span>
                </div>

                {/* Columna Derecha: Copywriting de Ventas & Explicación */}
                <div className="lg:col-span-7 flex flex-col justify-between space-y-4">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold uppercase tracking-wider self-start">
                    <span>🔥 Formato 02: Movilidad Total en Sala</span>
                  </div>

                  <h4 className="text-2xl sm:text-3xl font-extrabold text-[#141311] font-['Outfit',sans-serif] tracking-[-0.03em] leading-tight">
                    El Arma Secreta: Captación en el Clímax de Gratitud
                  </h4>

                  <p className="text-sm sm:text-base text-[#57534E] leading-relaxed">
                    Justo cuando el cliente pronuncia el elogio espontáneo:{' '}
                    <strong className="text-[#141311]">"¡Muchísimas gracias, me ha encantado!"</strong>,
                    el empleado saca la tarjeta del bolsillo con una sonrisa y canaliza esa emoción en caliente.
                  </p>

                  {/* 3 Value Pillars */}
                  <div className="space-y-2.5 pt-1">
                    <div className="flex items-start gap-3 bg-[#FAF9F6] p-3 rounded-xl border border-[#E7E4DC]">
                      <span className="text-blue-600 font-bold text-base shrink-0">★</span>
                      <p className="text-xs sm:text-sm text-[#141311]">
                        <strong>58% Tasa de Conversión:</strong> La cercanía del empleado en mesa o sillón clínico multiplica por 3 las valoraciones frente a esperar en caja.
                      </p>
                    </div>

                    <div className="flex items-start gap-3 bg-[#FAF9F6] p-3 rounded-xl border border-[#E7E4DC]">
                      <span className="text-blue-600 font-bold text-base shrink-0">★</span>
                      <p className="text-xs sm:text-sm text-[#141311]">
                        <strong>Opiniones que Mencionan al Empleado:</strong> Los clientes escriben comentarios más largos y emotivos citando el nombre del profesional.
                      </p>
                    </div>

                    <div className="flex items-start gap-3 bg-[#FAF9F6] p-3 rounded-xl border border-[#E7E4DC]">
                      <span className="text-blue-600 font-bold text-base shrink-0">★</span>
                      <p className="text-xs sm:text-sm text-[#141311]">
                        <strong>Ultrarresistente e Impermeable:</strong> Formato tarjeta de crédito en PVC reforzado con chip NFC industrial garantizado.
                      </p>
                    </div>
                  </div>

                  {/* Verbal Script Quote Box */}
                  <div className="bg-[#FAF9F6] p-3.5 rounded-xl border-l-4 border-l-blue-600 border-y border-r border-[#E7E4DC] text-xs text-[#57534E] italic">
                    "El empleado dice: <em>'Me alegro muchísimo. ¿Me apoyas 2 segundos tu móvil aquí para una reseña? Me ayuda directamente a mí y al equipo.'</em>"
                  </div>

                  <div className="pt-2">
                    <button
                      onClick={() => openDemoModal('Pack Comercio + Equipo (99€)')}
                      className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm py-3 px-6 rounded-full transition-all flex items-center gap-2 cursor-pointer shadow-md hover:-translate-y-0.5"
                    >
                      <span>🎬 Solicitar Vídeo Demo con Tarjetas</span>
                      <span>→</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* REALISTIC NFC SIMULATOR (TARJETA FÍSICA RESEO STUDIO + MODAL GOOGLE MAPS REAL) */}
        <section id="simulador" className="py-20 border-t border-[#E7E4DC]">
          <span className="font-mono text-xs text-[#C27803] font-bold tracking-widest uppercase block mb-3">
            02. Demostración en Directo
          </span>
          <h2 className="text-3xl sm:text-4xl font-['Outfit',sans-serif] font-bold tracking-[-0.03em] mb-4">
            Simula el Toque NFC con Nuestra Tarjeta
          </h2>
          <p className="text-base sm:text-lg text-[#57534E] max-w-3xl leading-relaxed mb-10">
            Introduce el nombre de tu negocio, elige tu categoría y pulsa el botón para ver cómo el
            smartphone toca físicamente nuestra tarjeta y despliega la valoración oficial de Google
            Maps.
          </p>

          <div className="bg-gradient-to-br from-[#1E1C1A] to-[#100F0E] text-[#FAF9F6] rounded-2xl p-6 sm:p-12 shadow-2xl border border-[#C27803]/25 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative overflow-hidden">
            {/* Controls Panel */}
            <div className="lg:col-span-6 space-y-4">
              <h3 className="text-2xl font-bold text-white">Simulador de Toque Contactless</h3>
              <p className="text-sm text-[#A8A29E] leading-relaxed">
                Mira cómo la tarjeta de bolsillo RESEO STUDIO detecta el teléfono por proximidad y
                abre la pantalla de 5 estrellas en menos de 2 segundos.
              </p>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-[#D6D3D1] uppercase tracking-wider">
                  Nombre de tu Negocio:
                </label>
                <input
                  type="text"
                  value={simBizName}
                  onChange={(e) => setSimBizName(e.target.value)}
                  className="w-full bg-[#262422] border border-[#3E3B38] focus:border-[#C27803] rounded-md px-4 py-3 text-white text-sm outline-none transition-all"
                  placeholder="Ej: Restaurante Asador Don Juan"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-[#D6D3D1] uppercase tracking-wider">
                  Sector / Categoría:
                </label>
                <select
                  value={simSector}
                  onChange={(e) =>
                    setSimSector(e.target.value as 'hosteleria' | 'salud' | 'talleres' | 'comercio')
                  }
                  className="w-full bg-[#262422] border border-[#3E3B38] focus:border-[#C27803] rounded-md px-4 py-3 text-white text-sm outline-none transition-all"
                >
                  <option value="hosteleria">Hostelería (Restaurante / Bar / Cafetería)</option>
                  <option value="salud">Salud & Belleza (Clínica / Dental / Estética)</option>
                  <option value="talleres">Servicios & Automoción (Taller / Reformas)</option>
                  <option value="comercio">Comercio Local & Tiendas</option>
                </select>
              </div>

              <button
                onClick={executeRealisticNfcDemo}
                className="w-full bg-gradient-to-r from-[#F59E0B] to-[#D97706] hover:from-[#D97706] hover:to-[#B45309] text-black font-extrabold text-base py-4 rounded-full flex items-center justify-center gap-3 shadow-lg shadow-amber-500/30 transition-all hover:-translate-y-0.5 cursor-pointer mt-4"
              >
                <span>
                  {simStage === 'detecting'
                    ? '⏳ Detectando Chip NFC...'
                    : '▶ Probar Toque NFC en Vivo'}
                </span>
              </button>

              <p className="text-xs text-[#A8A29E] pt-2">
                ¿Prefieres verlo grabado en vídeo real con tu negocio?{' '}
                <button
                  onClick={() => openDemoModal()}
                  className="text-[#F59E0B] font-bold underline hover:text-amber-400 bg-transparent border-none p-0 cursor-pointer"
                >
                  Pide tu vídeo demo aquí
                </button>
                .
              </p>
            </div>

            {/* Simulation Visual Arena */}
            <div className="lg:col-span-6 flex flex-col items-center justify-center min-h-[460px] relative">
              {/* Physical RESEO Pocket Card (3D Obsidian & Gold Edition) */}
              <div
                className={`w-[310px] h-[185px] bg-gradient-to-br from-[#1E1C1A] via-[#141312] to-[#0A0908] border-2 rounded-2xl p-5 absolute bottom-2 z-10 flex flex-col justify-between transition-all duration-500 shadow-2xl ${
                  simStage === 'detecting'
                    ? 'border-[#F59E0B] shadow-[0_0_45px_rgba(245,158,11,0.9)] scale-105 ring-4 ring-[#F59E0B]/40'
                    : 'border-[#D97706]/70 shadow-[0_20px_40px_rgba(0,0,0,0.6)] ring-1 ring-[#F59E0B]/20'
                }`}
              >
                {/* Gold Highlight Sheen */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-transparent via-white/5 to-transparent pointer-events-none" />

                <div className="relative z-10 flex justify-between items-center">
                  <span className="font-['Syne',sans-serif] font-black text-sm tracking-widest bg-gradient-to-r from-[#FDE68A] via-[#F59E0B] to-[#D97706] bg-clip-text text-transparent">
                    RESEO STUDIO
                  </span>
                  <div className="w-7 h-7 rounded-full bg-[#F59E0B]/20 border border-[#F59E0B]/60 flex items-center justify-center text-xs text-[#FDE68A] font-bold shadow-[0_0_10px_rgba(245,158,11,0.3)]">
                    <svg className="w-4 h-4 text-[#FDE68A]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M5 12.55a11 11 0 0 1 14.08 0" strokeLinecap="round" />
                      <path d="M8.53 16.11a6 6 0 0 1 6.95 0" strokeLinecap="round" />
                      <circle cx="12" cy="20" r="1.2" fill="currentColor" />
                    </svg>
                  </div>
                </div>

                <div className="relative z-10 text-center my-auto">
                  <div className="inline-flex items-center gap-1.5 bg-black/40 border border-white/10 px-3 py-1 rounded-full text-xs font-bold text-slate-200 shadow-sm">
                    <span className="text-[#4285F4] font-black text-sm">G</span> Google Reviews
                  </div>
                  <div className="text-[#FBBF24] text-lg tracking-[4px] mt-1 drop-shadow-[0_2px_6px_rgba(245,158,11,0.4)]">
                    ★★★★★
                  </div>
                </div>

                <div className="relative z-10 flex justify-between items-end text-[9px] font-bold tracking-wider text-[#A8A29E] uppercase">
                  <span className="text-[#FDE68A]">• ACERCA TU MÓVIL AQUÍ</span>
                  <span className="text-[#78716C]">PROXIMITY NFC 2026</span>
                </div>
              </div>

              {/* Smartphone Device Mockup */}
              <div
                className={`w-[300px] h-[430px] bg-black border-[7px] border-[#2C2825] rounded-[32px] p-2.5 shadow-2xl relative z-20 transition-all duration-500 ${
                  simStage === 'detecting'
                    ? 'translate-y-[80px] scale-[0.96]'
                    : simStage === 'review' || simStage === 'submitted'
                    ? '-translate-y-[20px] scale-100'
                    : '-translate-y-[15px]'
                }`}
              >
                <div className="w-16 h-1 bg-[#3A3530] rounded-full mx-auto mb-2" />

                <div className="bg-[#F8FAFC] text-[#1E293B] rounded-[20px] h-[calc(100%-12px)] overflow-hidden flex flex-col relative shadow-inner">
                  {/* State 1: Idle */}
                  {simStage === 'idle' && (
                    <div className="flex flex-col items-center justify-center h-full p-6 text-center">
                      <div className="w-16 h-16 bg-[#FEF3C7] text-[#C27803] border-2 border-dashed border-[#C27803] rounded-full flex items-center justify-center text-3xl mb-4 animate-[bouncePrompt_2s_infinite]">
                        📲
                      </div>
                      <h4 className="text-sm font-bold text-[#1E293B] mb-1">
                        Listo para Contactless
                      </h4>
                      <p className="text-xs text-[#64748B]">
                        Pulsa el botón de la izquierda para simular el toque en la tarjeta.
                      </p>
                    </div>
                  )}

                  {/* State 2: Detecting Wave */}
                  {simStage === 'detecting' && (
                    <div className="flex flex-col items-center justify-center h-full p-6 text-center bg-[#1E1C1A] text-white">
                      <div className="text-4xl animate-[pulseWave_1s_infinite]">📶</div>
                      <div className="text-xs font-extrabold text-[#F59E0B] mt-3 uppercase tracking-wider">
                        NFC Detectado (GPS Local)
                      </div>
                      <div className="text-[11px] text-[#A8A29E] mt-1">
                        Abriendo Google Maps en 1s...
                      </div>
                    </div>
                  )}

                  {/* State 3: Google Maps Review Form */}
                  {simStage === 'review' && (
                    <div className="flex flex-col h-full">
                      <div className="bg-white border-b border-[#E2E8F0] px-3 py-2 flex items-center justify-between">
                        <div className="flex items-center gap-1.5 text-xs font-bold text-[#475569]">
                          <span className="font-black text-[#4285F4] text-sm">G</span>
                          <span>Opiniones de Google</span>
                        </div>
                        <span className="text-[10px] text-[#64748B]">Paso 1 de 1</span>
                      </div>

                      <div className="p-3 overflow-y-auto flex-grow text-left space-y-2">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-[#E2E8F0] flex items-center justify-center font-bold text-[#475569] text-xs">
                            {firstLetter}
                          </div>
                          <div>
                            <div className="text-xs font-bold text-[#0F172A] leading-tight">
                              {simBizName || 'Mi Negocio Local'}
                            </div>
                            <div className="text-[10px] text-[#64748B]">
                              {currentSectorData.category}
                            </div>
                          </div>
                        </div>

                        <div className="text-center text-[11px] font-semibold text-[#475569] pt-1">
                          Toca las estrellas para calificar:
                        </div>

                        <div className="flex justify-center gap-1 my-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              key={star}
                              type="button"
                              onClick={() => setSimRating(star)}
                              className={`text-2xl transition-transform hover:scale-110 cursor-pointer bg-transparent border-none p-0 ${
                                star <= simRating ? 'text-[#FBBF24]' : 'text-[#CBD5E1]'
                              }`}
                            >
                              ★
                            </button>
                          ))}
                        </div>

                        <div className="flex flex-wrap gap-1">
                          {currentSectorData.chips.map((chip, idx) => (
                            <span
                              key={idx}
                              className="bg-[#E0F2FE] border border-[#38BDF8] text-[#0369A1] text-[10px] font-semibold px-2 py-0.5 rounded-full"
                            >
                              {chip}
                            </span>
                          ))}
                        </div>

                        <textarea
                          className="w-full h-12 bg-white border border-[#CBD5E1] rounded-md p-1.5 text-[11px] text-[#334155] resize-none outline-none"
                          defaultValue={currentSectorData.text}
                          readOnly
                        />

                        <button
                          onClick={handleSimSubmitReview}
                          className="w-full bg-[#1A73E8] hover:bg-[#1557B0] text-white font-bold py-2 rounded text-xs transition-colors cursor-pointer"
                        >
                          Publicar Reseña en Google
                        </button>
                      </div>
                    </div>
                  )}

                  {/* State 4: Review Published */}
                  {simStage === 'submitted' && (
                    <div className="flex flex-col items-center justify-center h-full p-4 text-center bg-white animate-fade-in">
                      <div className="text-4xl mb-2">🎉</div>
                      <div className="text-sm font-extrabold text-[#047857] mb-1">
                        ¡Reseña Publicada!
                      </div>
                      <div className="text-[#FBBF24] text-base mb-2">★★★★★</div>
                      <p className="text-[11px] text-[#64748B] mb-3 leading-relaxed">
                        Google ha registrado la valoración verificada por GPS para{' '}
                        <strong>{simBizName}</strong>.
                      </p>
                      <button
                        onClick={() => openDemoModal()}
                        className="bg-[#0F172A] text-white text-xs font-bold px-3 py-2 rounded-md hover:bg-slate-800 transition-colors cursor-pointer"
                      >
                        🎬 Quiero mi Vídeo Demo Gratis
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SCRIPT PERSUASIVO & STORYTELLING */}
        <section id="como-funciona" className="py-20 border-t border-[#E7E4DC]">
          <span className="font-mono text-xs text-[#C27803] font-bold tracking-widest uppercase block mb-3">
            03. La Fricción en el Punto de Venta
          </span>
          <h2 className="text-3xl sm:text-4xl font-['Outfit',sans-serif] font-bold tracking-[-0.03em] mb-4">
            El Momento Exacto de Máxima Gratitud
          </h2>
          <p className="text-base sm:text-lg text-[#57534E] max-w-3xl leading-relaxed mb-10">
            Tu trabajo es impecable, pero la fricción del proceso manual destruye tus reseñas.
            Descubre cómo aprovechar el instante en caliente.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            {/* Friction Card */}
            <div className="bg-white border border-[#E7E4DC] border-t-4 border-t-[#B91C1C] rounded-xl p-8 shadow-sm">
              <span className="font-mono text-xs font-bold text-[#B91C1C] uppercase tracking-wider block mb-3">
                El Problema Invisible
              </span>
              <h3 className="text-2xl font-bold text-[#141311] mb-4 leading-snug">
                "Luego te la dejo en casa..." (La promesa que nunca se cumple)
              </h3>
              <div className="text-sm text-[#57534E] space-y-3 leading-relaxed">
                <p>
                  El cliente paga la cuenta o termina su tratamiento con una gran sonrisa:{' '}
                  <em>"¡Muchas gracias, ha estado increíble!"</em>. Le pides una reseña y te responde
                  que te la dejará más tarde.
                </p>
                <p>
                  Pero al cruzar la puerta de tu local se monta al coche, recibe una llamada,
                  atiende a su familia o entra a una reunión.{' '}
                  <strong className="text-[#141311]">
                    El 95% de los clientes se olvida antes de 1 hora.
                  </strong>
                </p>
                <p>
                  Consecuencia: Negocios de tu alrededor con un servicio inferior tienen 3 veces más
                  opiniones y aparecen por encima de ti en Google Maps simplemente porque tienen un
                  sistema activo.
                </p>
              </div>
            </div>

            {/* Solution Card */}
            <div className="bg-[#FCFAF7] border border-[#E7E4DC] border-t-4 border-t-[#C27803] rounded-xl p-8 shadow-sm">
              <span className="font-mono text-xs font-bold text-[#C27803] uppercase tracking-wider block mb-3">
                La Solución RESEO STUDIO
              </span>
              <h3 className="text-2xl font-bold text-[#141311] mb-4 leading-snug">
                Captura en Caliente: En el Segundo del Cobro o la Mesa
              </h3>
              <div className="text-sm text-[#57534E] space-y-3 leading-relaxed">
                <p>
                  El único momento con 100% de efectividad para capturar una reseña es{' '}
                  <strong className="text-[#141311]">
                    mientras el cliente está pagando en caja
                  </strong>{' '}
                  o cuando felicita al personal en la mesa.
                </p>
                <p>
                  Con el expositor acrílico o la tarjeta de bolsillo de RESEO STUDIO, el empleado
                  solo dice:{' '}
                  <em>"¿Nos dejas tu opinión rápida pasando el móvil por aquí?"</em>.
                </p>
                <p>
                  En <strong className="text-[#141311]">menos de 3 segundos</strong> se abre
                  directamente la pantalla de 5 estrellas en su propio móvil. Sin teclear el nombre de
                  tu empresa, sin escanear QR y sin fricción.
                </p>
              </div>
            </div>
          </div>

          {/* COMPARATIVE TABLE: QR VS NFC */}
          <div className="bg-white border border-[#E7E4DC] rounded-xl p-8 shadow-sm">
            <h3 className="text-xl font-bold text-center text-[#141311] mb-2">
              La Razón por la que los Códigos QR Tradicionales Fallan
            </h3>
            <p className="text-center text-sm text-[#57534E] mb-6">
              Cada paso extra reduce la tasa de conversión en un 50%.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-[#FEF2F2] border border-[#FEE2E2] rounded-lg p-6">
                <div className="text-base font-extrabold text-[#B91C1C] flex items-center gap-2 mb-4">
                  <span>❌ Código QR Estático (4 Pasos)</span>
                </div>
                <ul className="space-y-3 text-xs sm:text-sm text-[#57534E]">
                  <li className="flex items-center gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-[#FCA5A5] text-[#B91C1C] flex items-center justify-center font-bold text-xs shrink-0">
                      1
                    </span>
                    <span>Desbloquear el móvil y abrir la app de cámara.</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-[#FCA5A5] text-[#B91C1C] flex items-center justify-center font-bold text-xs shrink-0">
                      2
                    </span>
                    <span>Enfocar el código a la distancia y luz adecuadas.</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-[#FCA5A5] text-[#B91C1C] flex items-center justify-center font-bold text-xs shrink-0">
                      3
                    </span>
                    <span>Esperar a que el navegador web cargue el enlace.</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-[#FCA5A5] text-[#B91C1C] flex items-center justify-center font-bold text-xs shrink-0">
                      4
                    </span>
                    <span>
                      <strong className="text-[#141311]">Resultado:</strong> El 85% de los clientes
                      abandona por pereza.
                    </span>
                  </li>
                </ul>
              </div>

              <div className="bg-[#FFFBEB] border border-[#FEF3C7] rounded-lg p-6">
                <div className="text-base font-extrabold text-[#C27803] flex items-center gap-2 mb-4">
                  <span>⚡ Soporte NFC RESEO STUDIO (1 Paso)</span>
                </div>
                <ul className="space-y-3 text-xs sm:text-sm text-[#57534E]">
                  <li className="flex items-center gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-[#FCD34D] text-[#92400E] flex items-center justify-center font-bold text-xs shrink-0">
                      1
                    </span>
                    <span>El cliente acerca su móvil al expositor o tarjeta.</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-[#FCD34D] text-[#92400E] flex items-center justify-center font-bold text-xs shrink-0">
                      2
                    </span>
                    <span>
                      <strong className="text-[#141311]">
                        Se abre la pantalla de 5 estrellas en 3 segundos.
                      </strong>
                    </span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-[#FCD34D] text-[#92400E] flex items-center justify-center font-bold text-xs shrink-0">
                      3
                    </span>
                    <span>Pulsa enviar y la reseña queda publicada.</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-[#FCD34D] text-[#92400E] flex items-center justify-center font-bold text-xs shrink-0">
                      4
                    </span>
                    <span>
                      <strong className="text-[#141311]">Resultado:</strong> Multiplicas por 3 tus
                      valoraciones semanales.
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* PRODUCT HARDWARE SHOWCASE */}
        <section className="py-20 border-t border-[#E7E4DC]">
          <span className="font-mono text-xs text-[#C27803] font-bold tracking-widest uppercase block mb-3">
            04. Infraestructura Física
          </span>
          <h2 className="text-3xl sm:text-4xl font-['Outfit',sans-serif] font-bold tracking-[-0.03em] mb-4">
            El Ecosistema Completo de Captación
          </h2>
          <p className="text-base sm:text-lg text-[#57534E] max-w-3xl leading-relaxed mb-10">
            Combinamos el soporte fijo de mostrador con la movilidad de las tarjetas de bolsillo para
            que no se escape ninguna oportunidad.
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
            {/* 1. EXPOSITOR ACRÍLICO DE MOSTRADOR */}
            <div className="bg-white border-2 border-[#E7E4DC] rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 flex flex-col group">
              {/* Product Image Stage */}
              <div 
                className="relative w-full h-[360px] sm:h-[400px] bg-gradient-to-b from-[#1C1A17] to-[#121110] p-4 sm:p-6 flex items-center justify-center border-b border-[#E7E4DC] overflow-hidden"
              >
                <img
                  src={expositorImg}
                  alt="1. Expositor Acrílico de Mostrador en recepción"
                  className="w-full h-full object-cover rounded-2xl shadow-2xl transition-transform duration-500 group-hover:scale-105"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-4 right-4 bg-[#141311]/90 border border-[#C27803]/40 text-[#FBBF24] text-[10px] font-extrabold px-3 py-1 rounded-full shadow">
                  FOTOGRAFÍA REAL
                </div>
              </div>

              {/* Card Content */}
              <div className="p-8 flex-grow flex flex-col justify-between">
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-[#FFFBEB] border border-[#C27803]/30 text-[#C27803] text-xs font-bold uppercase tracking-wider mb-3">
                    <span>📍 Soporte de Cobro</span>
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-bold text-[#141311] mb-3 font-['Outfit',sans-serif] tracking-[-0.03em]">
                    1. Expositor Acrílico de Mostrador
                  </h3>
                  <p className="text-base text-[#57534E] mb-6 leading-relaxed">
                    Diseñado en metacrilato blanco brillante de alta gama para situarse junto al TPV, datáfono o recepción principal.
                  </p>
                </div>

                <ul className="space-y-3.5 text-sm sm:text-base text-[#141311]">
                  <li className="flex items-center gap-3 pt-3.5 border-t border-[#E7E4DC]">
                    <span className="w-2 h-2 rounded-full bg-[#C27803] shrink-0" />
                    <span>Captura en el instante del pago en caja.</span>
                  </li>
                  <li className="flex items-center gap-3 pt-3.5 border-t border-[#E7E4DC]">
                    <span className="w-2 h-2 rounded-full bg-[#C27803] shrink-0" />
                    <span>Sin baterías, cables ni necesidad de recargas.</span>
                  </li>
                  <li className="flex items-center gap-3 pt-3.5 border-t border-[#E7E4DC]">
                    <span className="w-2 h-2 rounded-full bg-[#C27803] shrink-0" />
                    <span>Vinculado y programado con tu ficha oficial de Google.</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* 2. TARJETAS NFC PARA EL PERSONAL */}
            <div className="bg-white border-2 border-[#E7E4DC] rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 flex flex-col group">
              {/* Product Image Stage */}
              <div 
                className="relative w-full h-[360px] sm:h-[400px] bg-gradient-to-b from-[#1C1A17] to-[#121110] p-4 sm:p-6 flex items-center justify-center border-b border-[#E7E4DC] overflow-hidden"
              >
                <img
                  src={tarjetaImg}
                  alt="2. Tarjetas NFC para el Personal"
                  className="w-full h-full object-cover rounded-2xl shadow-2xl transition-transform duration-500 group-hover:scale-105"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-4 right-4 bg-[#141311]/90 border border-blue-500/40 text-blue-300 text-[10px] font-extrabold px-3 py-1 rounded-full shadow">
                  FOTOGRAFÍA REAL
                </div>
              </div>

              {/* Card Content */}
              <div className="p-8 flex-grow flex flex-col justify-between">
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold uppercase tracking-wider mb-3">
                    <span>💳 Tarjeta de Bolsillo</span>
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-bold text-[#141311] mb-3 font-['Outfit',sans-serif] tracking-[-0.03em]">
                    2. Tarjetas NFC para el Personal
                  </h3>
                  <p className="text-base text-[#57534E] mb-6 leading-relaxed">
                    Llevadas en el bolsillo o mandil por camareros, terapeutas, dependientes o técnicos en sala.
                  </p>
                </div>

                <ul className="space-y-3.5 text-sm sm:text-base text-[#141311]">
                  <li className="flex items-center gap-3 pt-3.5 border-t border-[#E7E4DC]">
                    <span className="w-2 h-2 rounded-full bg-blue-600 shrink-0" />
                    <span>Captación proactiva durante el servicio en mesa o sillón.</span>
                  </li>
                  <li className="flex items-center gap-3 pt-3.5 border-t border-[#E7E4DC]">
                    <span className="w-2 h-2 rounded-full bg-blue-600 shrink-0" />
                    <span>Aprovecha el halago espontáneo del cliente.</span>
                  </li>
                  <li className="flex items-center gap-3 pt-3.5 border-t border-[#E7E4DC]">
                    <span className="w-2 h-2 rounded-full bg-blue-600 shrink-0" />
                    <span>Resistente al agua, al roce y tamaño cartera.</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* DEDICATED VIDEO DEMO CONVERSION SECTION */}
        <div className="bg-gradient-to-br from-[#1C1917] to-[#0F0E0D] text-white rounded-2xl p-8 sm:p-12 my-10 shadow-2xl border border-[#C27803]/35 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 space-y-4">
            <span className="text-xs font-extrabold uppercase tracking-widest text-[#C27803] bg-[#C27803]/20 border border-[#C27803]/40 px-3.5 py-1 rounded-full inline-block">
              🎬 Demostración Real de 60 Segundos
            </span>
            <h3 className="text-2xl sm:text-3xl font-bold text-white">
              ¿Quieres ver cómo funciona con tu propio negocio?
            </h3>
            <p className="text-sm sm:text-base text-[#A8A29E] leading-relaxed">
              Te grabamos un <strong>vídeo personalizado</strong> con uno de nuestros expositores
              físicos vinculando la ficha de tu empresa en Google Maps. Comprueba el resultado en tu
              pantalla antes de tomar cualquier decisión.
            </p>
            <p className="text-xs text-[#8C877E]">
              ✓ 100% Gratuito y sin compromiso · ✓ Enviado directamente a tu WhatsApp y Email en 24h.
            </p>
          </div>

          <div className="lg:col-span-5 bg-white/5 border border-white/15 rounded-xl p-6 text-center space-y-4">
            <h4 className="text-lg font-bold text-white">Pide tu Vídeo Demo Gratis</h4>
            <p className="text-xs text-[#A8A29E]">
              Indícanos el nombre de tu local y te preparamos la grabación hoy mismo.
            </p>
            <button
              onClick={() => openDemoModal()}
              className="w-full bg-[#C27803] hover:bg-[#A16207] text-white font-extrabold text-sm py-4 px-6 rounded-full shadow-lg shadow-[#C27803]/40 transition-all hover:-translate-y-0.5 cursor-pointer"
            >
              Solicitar Mi Vídeo Demo →
            </button>
          </div>
        </div>
      </div>

      {/* PRICING SECTION */}
      <section id="precios" className="bg-[#F4F1EA] py-20 border-t border-b border-[#E7E4DC]">
        <div className="max-w-[1140px] mx-auto px-6">
          <span className="font-mono text-xs text-[#C27803] font-bold tracking-widest uppercase block mb-3">
            05. Inversión & Equipamiento
          </span>
          <h2 className="text-3xl sm:text-4xl font-['Outfit',sans-serif] font-bold tracking-[-0.03em] mb-4">
            Tarifas Oficiales y Packs de Implantación
          </h2>
          <p className="text-base sm:text-lg text-[#57534E] max-w-3xl leading-relaxed mb-10">
            Hardware de compra única en propiedad. Sin suscripciones obligatorias ni costes por
            reseña recibida. <strong>Incluye más de 144 € en bonos estratégicos sin coste adicional.</strong>
          </p>

          {/* NUEVA SECCIÓN: LOS 2 BONOS INCLUIDOS PARA GARANTIZAR EL TOP 3 */}
          <div className="bg-white border-2 border-[#C27803]/40 rounded-2xl p-6 sm:p-10 shadow-lg mb-14 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-48 h-48 bg-[#C27803]/5 rounded-full blur-3xl pointer-events-none" />
            
            {/* Header del bloque de bonos */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#E7E4DC] mb-8">
              <div>
                <span className="inline-flex items-center gap-1.5 bg-[#FFFBEB] text-[#C27803] border border-[#C27803]/30 text-xs font-black uppercase tracking-widest px-3 py-1 rounded-full mb-2">
                  🎁 MÁS DE 144 € EN REGALOS INCLUIDOS EN CADA PACK · HOY GRATIS
                </span>
                <h3 className="text-2xl sm:text-3xl font-bold font-['Outfit',sans-serif] text-[#141311] tracking-[-0.03em]">
                  Los 2 Bonos Incluidos en tu Pack para Garantizar el Top 3
                </h3>
              </div>
              <div className="bg-[#FAF9F6] border border-[#E7E4DC] rounded-xl px-4 py-2 text-center shrink-0">
                <span className="text-[10px] text-[#8C877E] uppercase tracking-wider block font-bold">Valor Total Bonos</span>
                <span className="text-xl font-extrabold text-[#C27803] font-['Outfit',sans-serif]">144 €</span>
                <span className="text-[10px] text-[#047857] font-black block uppercase">GRATIS</span>
              </div>
            </div>

            <p className="text-sm sm:text-base text-[#57534E] leading-relaxed mb-8 max-w-3xl">
              No nos limitamos a enviarte los dispositivos configurados. Te entregamos el sistema psicológico y la auditoría algorítmica necesarios para que tu equipo capture reseñas a diario y tu negocio escale a las primeras posiciones de Google Maps.
            </p>

            {/* Grid de los 2 Bonos */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 mb-8">
              {/* BONO #1 */}
              <div className="bg-[#FAF9F6] border border-[#E7E4DC] hover:border-[#C27803]/60 rounded-xl p-6 transition-all flex flex-col justify-between group">
                <div>
                  <div className="flex items-center justify-between gap-3 mb-4">
                    <span className="text-xs font-black bg-[#141311] text-white px-3 py-1 rounded-md tracking-wider uppercase">
                      BONO #1
                    </span>
                    <span className="text-xs font-bold text-[#C27803] bg-[#FFFBEB] border border-[#C27803]/30 px-2.5 py-0.5 rounded-full">
                      Valorado en 47 € · HOY GRATIS
                    </span>
                  </div>

                  <h4 className="text-lg sm:text-xl font-bold text-[#141311] font-['Outfit',sans-serif] tracking-[-0.02em] mb-3 group-hover:text-[#C27803] transition-colors">
                    "El Script Hipnótico de 10 Segundos para tu Personal"
                  </h4>

                  <p className="text-sm text-[#57534E] leading-relaxed mb-5">
                    <strong>La frase exacta de palabras psicológicas</strong> que dirá tu equipo en la caja o en la mesa. Elimina por completo la vergüenza de tus empleados a pedir opiniones y consigue que <strong>9 de cada 10 clientes acerquen el móvil encantados en caliente</strong>.
                  </p>
                </div>

                <div className="pt-4 border-t border-[#E7E4DC]/80 space-y-2 text-xs text-[#44403C]">
                  <div className="flex items-center gap-2">
                    <span className="text-[#047857] font-bold">✓</span>
                    <span>1 sola frase natural, sin presiones ni incomodidad para el empleado.</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[#047857] font-bold">✓</span>
                    <span>Convierte el halago espontáneo del cliente en reseña GPS instantánea.</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[#047857] font-bold">✓</span>
                    <span>Probado y perfeccionado en más de 200 mostradores comerciales.</span>
                  </div>
                </div>
              </div>

              {/* BONO #2 */}
              <div className="bg-[#FAF9F6] border border-[#E7E4DC] hover:border-[#C27803]/60 rounded-xl p-6 transition-all flex flex-col justify-between group">
                <div>
                  <div className="flex items-center justify-between gap-3 mb-4">
                    <span className="text-xs font-black bg-[#141311] text-white px-3 py-1 rounded-md tracking-wider uppercase">
                      BONO #2
                    </span>
                    <span className="text-xs font-bold text-[#C27803] bg-[#FFFBEB] border border-[#C27803]/30 px-2.5 py-0.5 rounded-full">
                      Valorado en 97 € · HOY GRATIS
                    </span>
                  </div>

                  <h4 className="text-lg sm:text-xl font-bold text-[#141311] font-['Outfit',sans-serif] tracking-[-0.02em] mb-3 group-hover:text-[#C27803] transition-colors">
                    "Auditoría SEO de Ficha & Diagnóstico de Escalada al Top 3"
                  </h4>

                  <p className="text-sm text-[#57534E] leading-relaxed mb-5">
                    <strong>Analizamos y corregimos los 12 puntos críticos</strong> de tu perfil en Google Maps (categorías secundarias, palabras clave de tu sector y penalizaciones invisibles). Nos aseguramos de que tu ficha esté limpia y optimizada para que el flujo constante de reseñas NFC <strong>te eleve a los puestos más altos de tu ciudad</strong>.
                  </p>
                </div>

                <div className="pt-4 border-t border-[#E7E4DC]/80 space-y-2 text-xs text-[#44403C]">
                  <div className="flex items-center gap-2">
                    <span className="text-[#047857] font-bold">✓</span>
                    <span>Chequeo técnico de 12 factores de Google Business Profile.</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[#047857] font-bold">✓</span>
                    <span>Desbloqueo de filtros algorítmicos que frenan tu visibilidad local.</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[#047857] font-bold">✓</span>
                    <span>Multiplica la fuerza de posicionamiento de cada nueva reseña recibida.</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Banner de resumen de regalo */}
            <div className="bg-[#FFFBEB] border border-[#C27803]/30 rounded-xl p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
              <div className="flex items-center gap-3">
                <span className="text-2xl shrink-0">🎁</span>
                <p className="text-xs sm:text-sm text-[#92400E] leading-relaxed">
                  <strong>Ambos bonos (valorados en 144 €) están incluidos al 100% de regalo</strong> en cualquiera de los 3 packs de equipamiento físico que elijas a continuación.
                </p>
              </div>
              <span className="text-xs font-black uppercase text-[#C27803] bg-white border border-[#C27803]/40 px-3 py-1.5 rounded-full shrink-0 shadow-sm">
                Ahorro Inmediato +144 €
              </span>
            </div>
          </div>

          {/* Packs Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch mb-12">
            {/* Pack 1: Mostrador Pro */}
            <div className="bg-white border border-[#E7E4DC] rounded-xl p-8 flex flex-col justify-between shadow-sm hover:shadow-md transition-all">
              <div>
                <div className="flex items-center justify-between gap-2 mb-1">
                  <div className="font-['Outfit',sans-serif] text-xl font-bold text-[#141311] tracking-[-0.03em]">
                    MOSTRADOR PRO
                  </div>
                  <span className="bg-[#FFFBEB] text-[#C27803] border border-[#C27803]/30 text-[10px] font-black px-2 py-0.5 rounded">
                    +144€ EN BONOS
                  </span>
                </div>
                <div className="text-xs text-[#57534E] min-h-[38px] mb-4">
                  Para negocios con atención en recepción fija o mostrador de cobro único.
                </div>

                <div className="flex items-baseline gap-1 pb-4 mb-6 border-b border-[#E7E4DC]">
                  <span className="text-4xl font-black font-['Outfit',sans-serif] text-[#141311] tracking-[-0.03em]">
                    59
                  </span>
                  <span className="text-xl font-bold text-[#141311]">€</span>
                  <span className="text-xs text-[#8C877E] ml-1">/ pago único</span>
                </div>

                <ul className="space-y-3.5 text-xs sm:text-sm text-[#44403C] mb-8 leading-snug">
                  <li className="flex items-start gap-2.5">
                    <span className="text-[#047857] font-black shrink-0 mt-0.5">✓</span>
                    <span>
                      <strong className="text-[#141311]">1 Expositor NFC de Mostrador</strong> en acrílico prémium para caja/recepción.
                    </span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="text-[#C27803] font-black shrink-0 mt-0.5">✓</span>
                    <span>
                      <strong className="text-[#141311]">[BONO 1] Script de 10s para personal:</strong> Guion antivergüenza para capturar el 90% de opiniones en caja <span className="text-[#C27803] font-bold">(Valor 47€ · GRATIS)</span>.
                    </span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="text-[#C27803] font-black shrink-0 mt-0.5">✓</span>
                    <span>
                      <strong className="text-[#141311]">[BONO 2] Auditoría SEO de Ficha:</strong> Diagnóstico de 12 puntos para desbloquear tu posición en Maps <span className="text-[#C27803] font-bold">(Valor 97€ · GRATIS)</span>.
                    </span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="text-[#047857] font-black shrink-0 mt-0.5">✓</span>
                    <span>
                      <strong className="text-[#141311]">Programación y vinculación directa</strong> con tu negocio incluida.
                    </span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="text-[#047857] font-black shrink-0 mt-0.5">✓</span>
                    <span>
                      <strong className="text-[#141311]">Garantía de Uso Activo de 14 Días</strong> (mínimo 5 reseñas verificadas o reembolso 100%).
                    </span>
                  </li>
                </ul>
              </div>

              <button
                onClick={() => openDemoModal('Pack Mostrador Pro (59€)')}
                className="w-full bg-[#F3F1EC] hover:bg-[#141311] text-[#141311] hover:text-white border border-[#E7E4DC] py-3.5 px-4 rounded-full font-bold text-xs sm:text-sm transition-all cursor-pointer"
              >
                Pedir Pack Mostrador Pro (59€)
              </button>
            </div>

            {/* Pack 2: Comercio + Equipo (Featured) */}
            <div className="bg-white border-2 border-[#C27803] rounded-xl p-8 flex flex-col justify-between shadow-xl relative scale-100 lg:-translate-y-2">
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-[#C27803] text-white text-[11px] font-black uppercase tracking-widest py-1 px-4 rounded-full shadow font-['Outfit',sans-serif] tracking-[-0.03em]">
                MÁS VENDIDO ⭐ RECOMENDADO
              </div>

              <div>
                <div className="font-['Outfit',sans-serif] text-xl font-bold text-[#C27803] mb-1 tracking-[-0.03em]">
                  COMERCIO + EQUIPO
                </div>
                <div className="text-xs text-[#57534E] min-h-[38px] mb-2">
                  El kit integral para restaurantes, clínicas y comercios con empleados en sala.
                </div>
                <div className="mb-3 flex flex-wrap gap-1.5">
                  <span className="bg-[#ECFDF5] text-[#047857] border border-[#047857]/25 text-[11px] font-black px-2 py-0.5 rounded">
                    AHORRO DE 20 €
                  </span>
                  <span className="bg-[#FFFBEB] text-[#C27803] border border-[#C27803]/30 text-[11px] font-black px-2 py-0.5 rounded">
                    +144€ EN BONOS GRATIS
                  </span>
                </div>

                <div className="flex items-baseline gap-1 pb-4 mb-6 border-b border-[#E7E4DC]">
                  <span className="text-4xl font-black font-['Outfit',sans-serif] text-[#C27803] tracking-[-0.03em]">
                    99
                  </span>
                  <span className="text-xl font-bold text-[#C27803]">€</span>
                  <span className="text-xs text-[#8C877E] ml-1">/ pago único</span>
                </div>

                <ul className="space-y-3.5 text-xs sm:text-sm text-[#44403C] mb-8 leading-snug">
                  <li className="flex items-start gap-2.5">
                    <span className="text-[#047857] font-black shrink-0 mt-0.5">✓</span>
                    <span>
                      <strong className="text-[#141311]">1 Expositor NFC de Mostrador</strong> para recepción o caja principal.
                    </span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="text-[#047857] font-black shrink-0 mt-0.5">✓</span>
                    <span>
                      <strong className="text-[#141311]">2 Tarjetas NFC de Bolsillo</strong> para que camareros o empleados en sala pidan reseñas en mesa/sillón.
                    </span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="text-[#C27803] font-black shrink-0 mt-0.5">✓</span>
                    <span>
                      <strong className="text-[#141311]">[BONO 1] Scripts de 10s adaptados</strong> para personal de sala y mostrador <span className="text-[#C27803] font-bold">(Valor 47€ · GRATIS)</span>.
                    </span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="text-[#C27803] font-black shrink-0 mt-0.5">✓</span>
                    <span>
                      <strong className="text-[#141311]">[BONO 2] Auditoría SEO Completa</strong> y optimización semántica de Ficha <span className="text-[#C27803] font-bold">(Valor 97€ · GRATIS)</span>.
                    </span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="text-[#047857] font-black shrink-0 mt-0.5">✓</span>
                    <span>
                      <strong className="text-[#141311]">Testeo y preconfiguración individualizada</strong> de cada dispositivo.
                    </span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="text-[#047857] font-black shrink-0 mt-0.5">✓</span>
                    <span>
                      <strong className="text-[#141311]">Garantía de Uso Activo de 14 Días</strong> (mínimo 5 reseñas verificadas o reembolso 100%).
                    </span>
                  </li>
                </ul>
              </div>

              <button
                onClick={() => openDemoModal('Pack Comercio + Equipo (99€)')}
                className="w-full bg-[#C27803] hover:bg-[#A16207] text-white py-3.5 px-4 rounded-full font-bold text-xs sm:text-sm shadow-md transition-all hover:-translate-y-0.5 cursor-pointer"
              >
                Pedir Pack Comercio + Equipo (99€) →
              </button>
            </div>

            {/* Pack 3: Gran Equipo */}
            <div className="bg-white border border-[#E7E4DC] rounded-xl p-8 flex flex-col justify-between shadow-sm hover:shadow-md transition-all">
              <div>
                <div className="font-['Outfit',sans-serif] text-xl font-bold text-[#141311] mb-1 tracking-[-0.03em]">
                  GRAN EQUIPO
                </div>
                <div className="text-xs text-[#57534E] min-h-[38px] mb-2">
                  Para locales con varios salones, alta rotación o plantillas amplias.
                </div>
                <div className="mb-3 flex flex-wrap gap-1.5">
                  <span className="bg-[#ECFDF5] text-[#047857] border border-[#047857]/25 text-[11px] font-black px-2 py-0.5 rounded">
                    AHORRO DE 50 €
                  </span>
                  <span className="bg-[#FFFBEB] text-[#C27803] border border-[#C27803]/30 text-[11px] font-black px-2 py-0.5 rounded">
                    +144€ EN BONOS
                  </span>
                </div>

                <div className="flex items-baseline gap-1 pb-4 mb-6 border-b border-[#E7E4DC]">
                  <span className="text-4xl font-black font-['Outfit',sans-serif] text-[#141311] tracking-[-0.03em]">
                    159
                  </span>
                  <span className="text-xl font-bold text-[#141311]">€</span>
                  <span className="text-xs text-[#8C877E] ml-1">/ pago único</span>
                </div>

                <ul className="space-y-3.5 text-xs sm:text-sm text-[#44403C] mb-8 leading-snug">
                  <li className="flex items-start gap-2.5">
                    <span className="text-[#047857] font-black shrink-0 mt-0.5">✓</span>
                    <span>
                      <strong className="text-[#141311]">1 Expositor NFC de Mostrador + 5 Tarjetas NFC de Bolsillo</strong> para dotar a todo tu equipo.
                    </span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="text-[#C27803] font-black shrink-0 mt-0.5">✓</span>
                    <span>
                      <strong className="text-[#141311]">Todos los Bonos de Valor Incluidos</strong> (Scripts 10s + Auditoría SEO de Ficha · <span className="text-[#C27803] font-bold">Valor +144€</span>).
                    </span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="text-[#047857] font-black shrink-0 mt-0.5">✓</span>
                    <span>
                      <strong className="text-[#141311]">Soporte Prioritario</strong> y reposición preferente de material.
                    </span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="text-[#047857] font-black shrink-0 mt-0.5">✓</span>
                    <span>
                      <strong className="text-[#141311]">Garantía de Uso Activo de 14 Días</strong> (mínimo 5 reseñas verificadas o reembolso 100%).
                    </span>
                  </li>
                </ul>
              </div>

              <button
                onClick={() => openDemoModal('Pack Gran Equipo (159€)')}
                className="w-full bg-[#F3F1EC] hover:bg-[#141311] text-[#141311] hover:text-white border border-[#E7E4DC] py-3.5 px-4 rounded-full font-bold text-xs sm:text-sm transition-all cursor-pointer"
              >
                Pedir Pack Gran Equipo (159€)
              </button>
            </div>
          </div>

          {/* ESCALA DE TARJETAS POR VOLUMEN */}
          <div className="bg-white border border-[#E7E4DC] rounded-xl p-8 shadow-sm mb-12">
            <div className="mb-6">
              <span className="font-mono text-xs text-[#C27803] font-bold tracking-wider uppercase block mb-1">
                Ampliación Individual de Plantilla
              </span>
              <h3 className="text-2xl font-bold text-[#141311]">
                Tarjetas de Bolsillo Sueltas por Volumen
              </h3>
              <p className="text-sm text-[#57534E]">
                ¿Deseas sumar unidades extra para nuevos empleados o colaboradores?
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-[#FAF9F6] border border-[#E7E4DC] rounded-lg p-5 text-center hover:border-[#C27803] transition-all">
                <div className="text-xs font-bold uppercase tracking-wider text-[#8C877E] mb-1">
                  1 Tarjeta
                </div>
                <div className="font-['Outfit',sans-serif] text-2xl font-extrabold text-[#141311] mb-1 tracking-[-0.03em]">
                  30 €
                </div>
                <div className="text-xs text-[#C27803] font-semibold">Unidad individual</div>
              </div>

              <div className="bg-[#FAF9F6] border border-[#E7E4DC] rounded-lg p-5 text-center hover:border-[#C27803] transition-all">
                <div className="text-xs font-bold uppercase tracking-wider text-[#8C877E] mb-1">
                  Pack 3 Tarjetas
                </div>
                <div className="font-['Outfit',sans-serif] text-2xl font-extrabold text-[#141311] mb-1 tracking-[-0.03em]">
                  75 €
                </div>
                <div className="text-xs text-[#C27803] font-semibold">25 € / unidad</div>
              </div>

              <div className="bg-[#FAF9F6] border border-[#E7E4DC] rounded-lg p-5 text-center hover:border-[#C27803] transition-all">
                <div className="text-xs font-bold uppercase tracking-wider text-[#8C877E] mb-1">
                  Pack 5 Tarjetas
                </div>
                <div className="font-['Outfit',sans-serif] text-2xl font-extrabold text-[#141311] mb-1 tracking-[-0.03em]">
                  110 €
                </div>
                <div className="text-xs text-[#C27803] font-semibold">22 € / unidad</div>
              </div>

              <div className="bg-[#FFFBEB] border-2 border-[#C27803] rounded-lg p-5 text-center">
                <div className="text-xs font-bold uppercase tracking-wider text-[#C27803] mb-1">
                  Pack 10+ Tarjetas
                </div>
                <div className="font-['Outfit',sans-serif] text-2xl font-extrabold text-[#C27803] mb-1 tracking-[-0.03em]">
                  190 €
                </div>
                <div className="text-xs text-[#C27803] font-black">
                  19 € / unidad (Máximo ahorro)
                </div>
              </div>
            </div>
          </div>

          {/* FRANQUICIAS */}
          <div className="bg-[#121211] text-white rounded-xl p-8 sm:p-12 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl mb-12">
            <div className="space-y-2 text-center md:text-left">
              <span className="text-xs font-bold text-[#C27803] uppercase tracking-wider block">
                Franquicias & Redes Multisede
              </span>
              <h3 className="text-2xl font-bold text-white">
                ¿Tienes una plantilla amplia o varias ubicaciones?
              </h3>
              <p className="text-sm text-[#A8A29E] max-w-xl">
                Diseñamos propuestas a medida con personalización de marca corporativa, envío directo
                a cada sucursal, facturación centralizada y condiciones exclusivas para grupos
                comerciales.
              </p>
            </div>
            <button
              onClick={() => openDemoModal('Presupuesto a Medida / Franquicia')}
              className="bg-[#C27803] hover:bg-[#A16207] text-white text-sm font-bold py-4 px-8 rounded-full whitespace-nowrap transition-colors cursor-pointer"
            >
              Solicitar Propuesta a Medida →
            </button>
          </div>

          {/* GARANTÍA DE USO ACTIVO */}
          <div className="bg-white border border-[#E7E4DC] rounded-xl p-8 flex flex-col sm:flex-row items-center gap-6 shadow-sm">
            <div className="w-16 h-16 rounded-full bg-[#ECFDF5] border border-[#047857]/20 flex items-center justify-center text-3xl shrink-0">
              🛡️
            </div>
            <div className="space-y-1.5 text-center sm:text-left">
              <h4 className="font-['Outfit',sans-serif] text-base font-bold text-[#141311] tracking-[-0.03em]">
                GARANTÍA DE USO ACTIVO DE 14 DÍAS (RIESGO CERO)
              </h4>
              <p className="text-sm text-[#57534E] leading-relaxed">
                Instala el expositor en tu mostrador de cobro y aplica nuestro Script de 10 segundos con tus clientes. Si tras 14 días de uso activo en tu local no consigues <strong className="text-[#141311]">al menos 5 reseñas reales verificadas en Google Maps</strong>, nos devuelves el material y te reembolsamos el 100% de tu dinero de inmediato. Tu inversión está 100% protegida.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FINAL CALL TO ACTION */}
      <div className="max-w-[1140px] mx-auto px-6 py-20">
        <div className="bg-[#121211] text-white rounded-2xl p-10 sm:p-16 text-center max-w-4xl mx-auto shadow-2xl space-y-6">
          <div className="inline-block bg-[#C27803]/15 text-[#FCD34D] border border-[#C27803]/40 text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full">
            ✦ Empieza a Dominar las Búsquedas en tu Ciudad
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-['Outfit',sans-serif] font-black text-white tracking-[-0.03em]">
            Pide tu vídeo demo gratuita o solicita tu pack
          </h2>

          <p className="text-base sm:text-lg text-[#A8A29E] max-w-xl mx-auto leading-relaxed">
            Indícanos el nombre de tu local. Te preparamos una demostración exclusiva vinculando tu
            ficha de Google Maps en menos de 24 horas.
          </p>

          <div>
            <button
              onClick={() => openDemoModal()}
              className="bg-[#C27803] hover:bg-[#A16207] text-white text-base font-extrabold px-10 py-4 rounded-full shadow-lg shadow-[#C27803]/30 transition-all hover:-translate-y-0.5 cursor-pointer inline-flex items-center gap-2"
            >
              <span>Solicitar Mi Vídeo Demo Gratis Ahora</span>
              <span>→</span>
            </button>
          </div>
        </div>
      </div>

      {/* PROFESSIONAL CRM & DEMO PIPELINE DASHBOARD */}
      <CrmDashboard
        isOpen={isCrmOpen}
        onClose={() => setIsCrmOpen(false)}
        leads={crmLeads}
        isAuthed={isAdminAuthed}
        onLogin={handleCrmLogin}
        onLogout={handleCrmLogout}
        onUpdateLead={handleUpdateLead}
        onDeleteLead={handleDeleteLead}
        onAddLead={handleAddLead}
        onExportCsv={exportLeadsToCsv}
        onAdvanceFollowUp={handleAdvanceFollowUp}
        onAddActivity={handleAddActivity}
        onImportRows={handleImportRows}
      />

      {/* MODAL / FORMULARIO SOLICITUD VÍDEO DEMO */}
      {isDemoModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-[#141311]/70 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={closeDemoModal}
        >
          <div
            className="bg-white border border-[#E7E4DC] rounded-2xl w-full max-w-lg p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={closeDemoModal}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-[#F3F1EC] text-[#57534E] hover:text-[#141311] flex items-center justify-center text-lg cursor-pointer"
            >
              ×
            </button>

            {!leadSubmitted ? (
              <>
                <span className="font-mono text-xs text-[#C27803] font-bold tracking-wider uppercase block mb-1">
                  Vídeo Demo en 60 Segundos
                </span>
                <h3 className="text-2xl font-bold text-[#141311] mb-2">
                  Demostración en tu Propio Negocio
                </h3>
                <p className="text-xs sm:text-sm text-[#57534E] mb-6 leading-relaxed">
                  Te enviaremos un vídeo exclusivo donde verás nuestro expositor vinculando la ficha
                  exacta de tu negocio antes de decidir nada.
                </p>

                <form onSubmit={handleDemoSubmit} className="space-y-4 text-left">
                  <div>
                    <label className="block text-xs font-bold text-[#141311] mb-1">
                      Nombre de tu Negocio en Google Maps *
                    </label>
                    <input
                      type="text"
                      required
                      value={formBizName}
                      onChange={(e) => setFormBizName(e.target.value)}
                      placeholder="Ej: Clínica Dental Rosales / Asador El Roble"
                      className="w-full px-4 py-3 bg-[#FAF9F6] border border-[#E7E4DC] focus:border-[#C27803] rounded-md text-sm outline-none transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#141311] mb-1">
                      Ciudad o Ubicación *
                    </label>
                    <input
                      type="text"
                      required
                      value={formBizCity}
                      onChange={(e) => setFormBizCity(e.target.value)}
                      placeholder="Ej: Madrid, Calle Goya / Valencia"
                      className="w-full px-4 py-3 bg-[#FAF9F6] border border-[#E7E4DC] focus:border-[#C27803] rounded-md text-sm outline-none transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#141311] mb-1">
                      Tu Nombre y Cargo *
                    </label>
                    <input
                      type="text"
                      required
                      value={formUserName}
                      onChange={(e) => setFormUserName(e.target.value)}
                      placeholder="Ej: Carlos Gómez (Propietario / Gerente)"
                      className="w-full px-4 py-3 bg-[#FAF9F6] border border-[#E7E4DC] focus:border-[#C27803] rounded-md text-sm outline-none transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#141311] mb-1">
                      Correo Electrónico *
                    </label>
                    <input
                      type="email"
                      required
                      value={formUserEmail}
                      onChange={(e) => setFormUserEmail(e.target.value)}
                      placeholder="Ej: info@tuempresa.com"
                      className="w-full px-4 py-3 bg-[#FAF9F6] border border-[#E7E4DC] focus:border-[#C27803] rounded-md text-sm outline-none transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#141311] mb-1">
                      Teléfono / WhatsApp donde recibir el vídeo *
                    </label>
                    <input
                      type="tel"
                      required
                      value={formUserPhone}
                      onChange={(e) => setFormUserPhone(e.target.value)}
                      placeholder="Ej: 612 34 56 78"
                      className="w-full px-4 py-3 bg-[#FAF9F6] border border-[#E7E4DC] focus:border-[#C27803] rounded-md text-sm outline-none transition-colors"
                    />
                  </div>

                  {/* RGPD Consent Checkbox */}
                  <div className="pt-2 pb-1">
                    <label className="flex items-start gap-2.5 cursor-pointer text-left">
                      <input
                        type="checkbox"
                        id="rgpd-consent-checkbox"
                        required
                        checked={formPrivacyAccepted}
                        onChange={(e) => setFormPrivacyAccepted(e.target.checked)}
                        className="mt-0.5 w-4 h-4 rounded border-[#E7E4DC] text-[#C27803] focus:ring-[#C27803] cursor-pointer accent-[#C27803] shrink-0"
                      />
                      <span className="text-[11px] text-[#44403C] leading-snug">
                        He leído y acepto la{' '}
                        <button
                          type="button"
                          onClick={() => openLegalModal('privacidad')}
                          className="text-[#C27803] underline font-semibold hover:text-[#A16207] cursor-pointer"
                        >
                          Política de Privacidad
                        </button>{' '}
                        y el tratamiento de mis datos para la gestión de la demo. *
                      </span>
                    </label>
                  </div>

                  {/* Ficha básica de protección de datos (RGPD) */}
                  <div className="bg-[#FAF9F6] border border-[#E7E4DC] p-3.5 rounded-xl text-[10px] text-[#57534E] space-y-1.5 text-left leading-tight">
                    <p className="font-bold text-[#141311] text-[11px] flex items-center gap-1.5">
                      <span>📋</span> Información básica de protección de datos (RGPD)
                    </p>
                    <p>
                      <strong>• Responsable:</strong> RESEO STUDIO (
                      <a href="mailto:reseostudio@gmail.com" className="text-[#C27803] underline">
                        reseostudio@gmail.com
                      </a>
                      ).
                    </p>
                    <p>
                      <strong>• Finalidad:</strong> Gestión de la solicitud de vídeo-demo, envío de propuestas y asesoramiento técnico.
                    </p>
                    <p>
                      <strong>• Legitimación:</strong> Consentimiento expreso del interesado.
                    </p>
                    <p>
                      <strong>• Destinatarios:</strong> No se cederán datos a terceros salvo obligación legal.
                    </p>
                    <p>
                      <strong>• Derechos:</strong> Acceso, rectificación, supresión y oposición en{' '}
                      <a href="mailto:reseostudio@gmail.com" className="text-[#C27803] underline">
                        reseostudio@gmail.com
                      </a>
                      .
                    </p>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-[#C27803] hover:bg-[#A16207] text-white font-bold py-4 rounded-full text-sm shadow-md transition-colors cursor-pointer mt-2 flex items-center justify-center gap-2"
                  >
                    <span>🎬 Generar Solicitud de Vídeo Demo</span>
                    <span>→</span>
                  </button>

                  <p className="text-[11px] text-[#8C877E] text-center mt-2">
                    🔒 Tus datos son 100% confidenciales y se guardan de forma segura para gestionar
                    tu vídeo y propuesta.
                  </p>
                </form>
              </>
            ) : (
              <div className="text-center py-6">
                <div className="text-5xl mb-4">🎬</div>
                <h3 className="text-2xl font-bold text-[#141311] mb-3">
                  ¡Solicitud de Vídeo Demo Registrada!
                </h3>
                <p className="text-sm text-[#57534E] leading-relaxed mb-4">
                  Hemos registrado la ficha de <strong>{submittedLeadData?.negocio}</strong> (
                  {submittedLeadData?.ciudad}). Estamos preparando tu vídeo personalizado de 60
                  segundos con el expositor físico y te lo enviaremos por WhatsApp y a{' '}
                  <strong>{submittedLeadData?.email}</strong> en menos de 24 horas.
                </p>
                <div className="bg-[#ECFDF5] border border-[#A7F3D0] p-3 rounded-lg text-xs text-[#065F46] font-semibold mb-6">
                  ✓ Registrado correctamente en el sistema de{' '}
                  <strong>reseostudio@gmail.com</strong>.
                </div>
                <button
                  onClick={closeDemoModal}
                  className="bg-[#141311] text-white font-bold text-sm px-6 py-3 rounded-full hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  Cerrar y Volver
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* AI SALES & SEO LOCAL EXPERT CONVERSATIONAL CHATBOT WIDGET */}
      <div className="fixed bottom-6 right-6 z-50 font-['DM_Sans',sans-serif]">
        {/* Floating Trigger Button: Compact Chat Bubble */}
        <button
          onClick={() => setIsChatOpen(!isChatOpen)}
          aria-label="Abrir Asesor IA"
          title="Chat Asesor IA"
          className="relative w-14 h-14 bg-[#141311] text-white border-2 border-[#C27803] rounded-full flex items-center justify-center shadow-2xl hover:scale-110 hover:bg-[#2A2826] transition-all duration-300 cursor-pointer group"
        >
          <span className="text-2xl group-hover:rotate-12 transition-transform">💬</span>
          {/* Green online indicator dot with pulse animation */}
          <span className="absolute top-0.5 right-0.5 flex h-3.5 w-3.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500 border-2 border-[#141311]"></span>
          </span>
        </button>

        {/* Chat Window Panel */}
        {isChatOpen && (
          <div className="absolute bottom-16 right-0 w-[380px] max-w-[calc(100vw-32px)] h-[520px] max-h-[calc(100vh-120px)] bg-white border border-[#E7E4DC] rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-fade-in">
            {/* Header */}
            <div className="bg-[#121211] text-white px-5 py-4 flex items-center justify-between border-b border-[#2A2826]">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-[#C27803] text-white flex items-center justify-center font-bold text-sm">
                  ⚡
                </div>
                <div>
                  <div className="text-xs font-bold leading-tight">Asesor RESEO STUDIO</div>
                  <div className="text-[10px] text-[#10B981] font-semibold">
                    ● Especialista en SEO Local y Ventas activo
                  </div>
                </div>
              </div>
              <button
                onClick={() => setIsChatOpen(false)}
                className="w-7 h-7 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-white/20 transition-colors text-sm cursor-pointer"
              >
                ×
              </button>
            </div>

            {/* RGPD Discreet Privacy Notice in Chat */}
            <div className="bg-[#F6F5F2] border-b border-[#E7E4DC] px-4 py-2 text-[10px] text-[#78716C] flex items-center justify-between">
              <span>
                🔒 Conversación protegida. Al comunicarte con el Asesor IA, aceptas nuestra{' '}
                <button
                  type="button"
                  onClick={() => openLegalModal('privacidad')}
                  className="text-[#C27803] underline font-semibold hover:text-[#A16207] cursor-pointer"
                >
                  Política de Privacidad
                </button>
                .
              </span>
            </div>

            {/* Messages Area */}
            <div className="flex-grow p-4 overflow-y-auto space-y-3 bg-[#FAF9F6] text-xs leading-relaxed">
              {chatMessages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`p-3.5 rounded-2xl max-w-[88%] ${
                    msg.role === 'bot'
                      ? 'bg-white text-[#1E293B] border border-[#E7E4DC] rounded-bl-xs self-start shadow-sm'
                      : 'bg-[#141311] text-white rounded-br-xs self-end ml-auto'
                  }`}
                >
                  {msg.isHtml ? (
                    <div dangerouslySetInnerHTML={{ __html: msg.content }} />
                  ) : (
                    <div>{msg.content}</div>
                  )}

                  {/* Suggestion Chips in first bot message */}
                  {idx === 0 && (
                    <div className="flex flex-col gap-1.5 mt-3">
                      <button
                        onClick={() =>
                          handleSendMessage('Tengo un negocio local y quiero saber cómo mejorar mis reseñas')
                        }
                        className="bg-[#F1F5F9] hover:bg-[#FEF3C7] hover:border-[#C27803] hover:text-[#C27803] border border-[#E2E8F0] text-[#0F172A] text-[11px] font-semibold px-3 py-1.5 rounded-full text-left transition-colors cursor-pointer"
                      >
                        🏢 Tengo un negocio local, ¿por dónde empezamos?
                      </button>
                      <button
                        onClick={() =>
                          handleSendMessage('¿Qué diferencia hay entre poner un código QR o un soporte NFC?')
                        }
                        className="bg-[#F1F5F9] hover:bg-[#FEF3C7] hover:border-[#C27803] hover:text-[#C27803] border border-[#E2E8F0] text-[#0F172A] text-[11px] font-semibold px-3 py-1.5 rounded-full text-left transition-colors cursor-pointer"
                      >
                        ⚡ ¿Por qué el código QR falla frente al soporte NFC?
                      </button>
                    </div>
                  )}
                </div>
              ))}

              {isTyping && (
                <div className="bg-white border border-[#E7E4DC] rounded-xl px-3 py-2 inline-flex items-center gap-1 self-start shadow-sm">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#C27803] animate-[typingBounce_1.4s_infinite_ease-in-out_-0.32s]" />
                  <span className="w-1.5 h-1.5 rounded-full bg-[#C27803] animate-[typingBounce_1.4s_infinite_ease-in-out_-0.16s]" />
                  <span className="w-1.5 h-1.5 rounded-full bg-[#C27803] animate-[typingBounce_1.4s_infinite_ease-in-out]" />
                </div>
              )}
              <div ref={chatMessagesEndRef} />
            </div>

            {/* Chat Footer */}
            <div className="p-3 bg-white border-t border-[#E7E4DC] flex items-center gap-2">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Pregúntame o escribe tu email para la demo..."
                className="flex-grow bg-white border border-[#E7E4DC] focus:border-[#C27803] rounded-full px-4 py-2 text-xs outline-none transition-colors"
              />
              <button
                onClick={() => handleSendMessage()}
                className="w-8 h-8 rounded-full bg-[#C27803] hover:bg-[#A16207] text-white flex items-center justify-center font-bold text-xs shrink-0 transition-colors cursor-pointer"
              >
                ➤
              </button>
            </div>
          </div>
        )}
      </div>

      {/* FOOTER */}
      <footer className="border-t border-[#E7E4DC] py-10 bg-[#FAF9F6] text-center text-xs text-[#8C877E] font-['DM_Sans',sans-serif]">
        <div className="max-w-[1140px] mx-auto px-6 flex flex-col gap-6">
          {/* Legal Links Row */}
          <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs font-semibold text-[#57534E]">
            <button
              id="footer-link-aviso-legal"
              onClick={() => openLegalModal('aviso-legal')}
              className="hover:text-[#C27803] transition-colors cursor-pointer"
            >
              Aviso Legal
            </button>
            <span className="text-[#D6D3CD]">·</span>
            <button
              id="footer-link-privacidad"
              onClick={() => openLegalModal('privacidad')}
              className="hover:text-[#C27803] transition-colors cursor-pointer"
            >
              Política de Privacidad
            </button>
            <span className="text-[#D6D3CD]">·</span>
            <button
              id="footer-link-cookies"
              onClick={() => openLegalModal('cookies')}
              className="hover:text-[#C27803] transition-colors cursor-pointer"
            >
              Política de Cookies
            </button>
            <span className="text-[#D6D3CD]">·</span>
            <button
              id="footer-link-terminos"
              onClick={() => openLegalModal('terminos')}
              className="hover:text-[#C27803] transition-colors cursor-pointer"
            >
              Términos y Condiciones
            </button>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-[#E7E4DC]/80">
            <p>© 2026 RESEO STUDIO. Innovación en reputación local y tecnología NFC de proximidad. Todos los derechos reservados.</p>
            <div className="flex items-center gap-4 text-[11px] text-[#8C877E]">
              <span className="text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full font-medium">
                🔒 Conexión Segura SSL
              </span>
            </div>
          </div>
        </div>
      </footer>

      {/* GDPR / RGPD LEGAL MODAL */}
      <LegalModal
        isOpen={isLegalModalOpen}
        activeTab={legalModalTab}
        onClose={closeLegalModal}
        onTabChange={(tab) => setLegalModalTab(tab)}
      />

      {/* DISCREET COOKIE CONSENT BANNER */}
      <CookieBanner onOpenCookiesPolicy={() => openLegalModal('cookies')} />
    </div>
  );
}
