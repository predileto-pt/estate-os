export type IntentLevel = "hot" | "warm" | "cold";

export interface BuyerScore {
  id: string;
  name: string;
  intentLevel: IntentLevel;
  score: number; // 0-100
  lastActivity: string;
  interactions: number;
  budget: { min: number; max: number };
  matchReasons: string[];
}

export interface PropertyIntelligence {
  dealProbability: number; // 0-100
  estimatedDaysToClose: number;
  priceAnalysis: {
    marketAverage: number;
    suggestedRange: { min: number; max: number };
    pricePosition: "below" | "at" | "above";
  };
  topBuyers: BuyerScore[];
  alerts: PropertyAlert[];
  suggestedActions: SuggestedAction[];
}

export interface PropertyAlert {
  type: "warning" | "info" | "success";
  title: string;
  description: string;
}

export interface SuggestedAction {
  priority: "high" | "medium" | "low";
  action: string;
  reason: string;
}

export const MOCK_INTELLIGENCE: PropertyIntelligence = {
  dealProbability: 72,
  estimatedDaysToClose: 45,
  priceAnalysis: {
    marketAverage: 465000,
    suggestedRange: { min: 460000, max: 510000 },
    pricePosition: "at",
  },
  topBuyers: [
    {
      id: "buyer-001",
      name: "João Ferreira",
      intentLevel: "hot",
      score: 92,
      lastActivity: "2026-03-19T16:30:00Z",
      interactions: 8,
      budget: { min: 400000, max: 550000 },
      matchReasons: ["Orçamento compatível", "Preferência de localização", "Visitou 3x"],
    },
    {
      id: "buyer-002",
      name: "Sarah Mitchell",
      intentLevel: "hot",
      score: 85,
      lastActivity: "2026-03-18T11:00:00Z",
      interactions: 5,
      budget: { min: 450000, max: 600000 },
      matchReasons: ["Orçamento compatível", "Relocalização expat", "Financiamento aprovado"],
    },
    {
      id: "buyer-003",
      name: "Carlos Mendes",
      intentLevel: "warm",
      score: 68,
      lastActivity: "2026-03-15T09:20:00Z",
      interactions: 3,
      budget: { min: 350000, max: 500000 },
      matchReasons: ["Orçamento compatível", "Tipo de imóvel compatível"],
    },
    {
      id: "buyer-004",
      name: "Ana Rodrigues",
      intentLevel: "cold",
      score: 42,
      lastActivity: "2026-03-10T14:45:00Z",
      interactions: 1,
      budget: { min: 300000, max: 480000 },
      matchReasons: ["Preferência de localização"],
    },
  ],
  alerts: [
    {
      type: "success",
      title: "Imóvel com alta procura",
      description: "Este imóvel tem 3x mais visualizações que a média para apartamentos T3 em Cascais.",
    },
    {
      type: "info",
      title: "Preço alinhado com o mercado",
      description: "O preço de listagem está dentro de 4% dos imóveis comparáveis na zona.",
    },
    {
      type: "warning",
      title: "Sem visitas agendadas esta semana",
      description: "Considere contactar os leads quentes para manter o ritmo.",
    },
  ],
  suggestedActions: [
    {
      priority: "high",
      action: "Ligar a João Ferreira",
      reason: "Visitou 3 vezes, última atividade ontem. Alta probabilidade de proposta.",
    },
    {
      priority: "high",
      action: "Enviar detalhes de financiamento a Sarah Mitchell",
      reason: "Compradora expat com financiamento aprovado. Precisa de orientação documental.",
    },
    {
      priority: "medium",
      action: "Agendar open house",
      reason: "3 leads mornos ainda não visitaram. Visita em grupo pode acelerar o pipeline.",
    },
  ],
};
