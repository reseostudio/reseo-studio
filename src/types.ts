export interface PlanOption {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  popular?: boolean;
  description: string;
  included: string[];
  idealFor: string;
  ctaText: string;
  whatsappMessage: string;
}

export interface BusinessMetric {
  label: string;
  value: string;
  description: string;
  highlightColor: 'blue' | 'green' | 'red' | 'amber';
}

export interface FaqItem {
  question: string;
  answer: string;
  category: 'tecnico' | 'algoritmo' | 'pedidos';
}

export interface SectorSimulation {
  name: string;
  ticketMedio: number;
  promedioClientesDia: number;
  tasaCaptacionNFC: number; // porcentaje estimado de clientes satisfechos que tocan (15-30%)
  incrementoTraficoMaps: number;
}
