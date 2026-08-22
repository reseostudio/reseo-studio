export type LeadStatus =
  | 'nuevo'
  | 'grabando_demo'
  | 'demo_enviada'
  | 'en_negociacion'
  | 'cerrado_ganado'
  | 'descartado';

export interface LeadData {
  id: string;
  tipo: string;
  negocio: string;
  ciudad: string;
  contacto: string;
  email: string;
  telefono: string;
  pack: string;
  timestamp: string;
  target_email: string;
  origen: string;
  status: LeadStatus;
  demoSent?: boolean;
  demoSentDate?: string;
  notas?: string;
  valorEstimado?: number;
}

export const STATUS_CONFIG: Record<
  LeadStatus,
  { label: string; bg: string; text: string; border: string; icon: string; description: string }
> = {
  nuevo: {
    label: 'Nuevo Lead',
    bg: 'bg-blue-50',
    text: 'text-blue-700',
    border: 'border-blue-200',
    icon: '🔵',
    description: 'Solicitud recién recibida',
  },
  grabando_demo: {
    label: 'Grabando Demo',
    bg: 'bg-amber-50',
    text: 'text-amber-700',
    border: 'border-amber-200',
    icon: '🟡',
    description: 'Preparando vídeo de 60s con su ficha',
  },
  demo_enviada: {
    label: 'Demo Enviada',
    bg: 'bg-purple-50',
    text: 'text-purple-700',
    border: 'border-purple-200',
    icon: '🟣',
    description: 'Vídeo enviado por WhatsApp',
  },
  en_negociacion: {
    label: 'En Negociación',
    bg: 'bg-indigo-50',
    text: 'text-indigo-700',
    border: 'border-indigo-200',
    icon: '🟢',
    description: 'Hablando por WhatsApp / Dudas de pack',
  },
  cerrado_ganado: {
    label: 'Vendido / Pagado',
    bg: 'bg-emerald-50',
    text: 'text-emerald-700',
    border: 'border-emerald-200',
    icon: '🏆',
    description: 'Pago confirmado · Listo para enviar',
  },
  descartado: {
    label: 'Descartado / Pausa',
    bg: 'bg-slate-50',
    text: 'text-slate-600',
    border: 'border-slate-200',
    icon: '⚪',
    description: 'No interesado / Sin respuesta',
  },
};
