import type { Proposal } from "./proposal-types";

export const MOCK_PROPOSALS: Proposal[] = [
  {
    id: "prop-001",
    status: "partially_signed",
    property: {
      title: "T3 Apartamento em Alfama",
      address: "Rua de São Miguel 45, 2º Esq., Alfama, Lisboa, 1100-544",
      type: "ARRENDAMENTO",
      value: 320000,
      monthlyRent: 1200,
    },
    owner: {
      name: "Maria Fernandes",
      email: "maria.fernandes@email.pt",
      phone: "+351 912 345 678",
      nif: "123 456 789",
      signed: true,
    },
    applicant: {
      name: "João Costa",
      email: "joao.costa@email.pt",
      phone: "+351 934 567 890",
      signed: false,
    },
    contract: {
      id: "contract-001",
      type: "arrendamento",
      signed: false,
    },
    events: [
      { id: "e1", type: "created", actor: "Sistema", timestamp: "2026-03-10T10:00:00Z" },
      { id: "e2", type: "signature_requested", actor: "Ana Silva (agente)", timestamp: "2026-03-10T10:05:00Z" },
      { id: "e3", type: "owner_signed", actor: "Maria Fernandes", timestamp: "2026-03-12T14:30:00Z" },
    ],
    createdAt: "2026-03-10T10:00:00Z",
  },
  {
    id: "prop-002",
    status: "signed",
    property: {
      title: "T2 Moradia no Chiado",
      address: "Rua Garrett 18, 1200-204, Chiado, Lisboa",
      type: "VENDA",
      value: 485000,
      monthlyRent: null,
    },
    owner: {
      name: "António Oliveira",
      email: "antonio.oliveira@email.pt",
      phone: "+351 961 234 567",
      nif: "987 654 321",
      signed: true,
    },
    applicant: {
      name: "Sophie Müller",
      email: "sophie.muller@email.de",
      phone: "+49 176 12345678",
      signed: true,
    },
    contract: {
      id: "contract-002",
      type: "venda",
      signed: true,
    },
    events: [
      { id: "e4", type: "created", actor: "Sistema", timestamp: "2026-03-01T09:00:00Z" },
      { id: "e5", type: "signature_requested", actor: "Ana Silva (agente)", timestamp: "2026-03-01T09:10:00Z" },
      { id: "e6", type: "owner_signed", actor: "António Oliveira", timestamp: "2026-03-02T11:00:00Z" },
      { id: "e7", type: "applicant_signed", actor: "Sophie Müller", timestamp: "2026-03-03T16:45:00Z" },
    ],
    createdAt: "2026-03-01T09:00:00Z",
  },
  {
    id: "prop-003",
    status: "pending",
    property: {
      title: "T4 Apartamento em Cascais",
      address: "Av. Marginal 120, 3º Dto., Cascais, 2750-642",
      type: "ARRENDAMENTO",
      value: 550000,
      monthlyRent: 2100,
    },
    owner: {
      name: "Carlos Mendes",
      email: "carlos.mendes@email.pt",
      phone: "+351 918 765 432",
      nif: "456 789 123",
      signed: false,
    },
    applicant: {
      name: "Pierre Dupont",
      email: "pierre.dupont@email.fr",
      phone: "+33 6 12 34 56 78",
      signed: false,
    },
    contract: {
      id: "contract-003",
      type: "arrendamento",
      signed: false,
    },
    events: [
      { id: "e8", type: "created", actor: "Sistema", timestamp: "2026-03-15T08:30:00Z" },
    ],
    createdAt: "2026-03-15T08:30:00Z",
  },
  {
    id: "prop-004",
    status: "expired",
    property: {
      title: "T1 Estúdio na Graça",
      address: "Rua da Graça 95, 1º, Lisboa, 1170-165",
      type: "ARRENDAMENTO",
      value: 180000,
      monthlyRent: 750,
    },
    owner: {
      name: "Isabel Santos",
      email: "isabel.santos@email.pt",
      phone: "+351 926 543 210",
      nif: "321 654 987",
      signed: true,
    },
    applicant: {
      name: "James Wilson",
      email: "james.wilson@email.co.uk",
      phone: "+44 7911 123456",
      signed: false,
    },
    contract: {
      id: "contract-004",
      type: "arrendamento",
      signed: false,
    },
    events: [
      { id: "e9", type: "created", actor: "Sistema", timestamp: "2026-02-01T10:00:00Z" },
      { id: "e10", type: "signature_requested", actor: "Ana Silva (agente)", timestamp: "2026-02-01T10:15:00Z" },
      { id: "e11", type: "owner_signed", actor: "Isabel Santos", timestamp: "2026-02-03T09:00:00Z" },
      { id: "e12", type: "expired", actor: "Sistema", timestamp: "2026-03-01T00:00:00Z" },
    ],
    createdAt: "2026-02-01T10:00:00Z",
  },
];
