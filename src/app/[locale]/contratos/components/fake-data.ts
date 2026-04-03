import type { Contract, ContractModel, ReductoParseResult } from "@/lib/db-types";
import type { components } from "@/lib/types/contract-intelligence-service-api";
import parseResultJson from "@/../data/reducto_parse_result_output.json";

// ---------------------------------------------------------------------------
// Type aliases from auto-generated API types
// ---------------------------------------------------------------------------
type SourceDocumentListItem = components["schemas"]["SourceDocumentListItem"];
type SourceDocumentRead = components["schemas"]["SourceDocumentRead"];
type SourceDocumentDetail = components["schemas"]["SourceDocumentDetail"];
type SourceSectionRead = components["schemas"]["SourceSectionRead"];
type FieldEvidenceRead = components["schemas"]["FieldEvidenceRead"];
type SourceReviewBundleRead = components["schemas"]["SourceReviewBundleRead"];
type TemplateVersionRead = components["schemas"]["TemplateVersionRead"];
type GeneratedContractRead = components["schemas"]["GeneratedContractRead"];
type RenderGeneratedContractResponse =
  components["schemas"]["RenderGeneratedContractResponse"];

// ---------------------------------------------------------------------------
// @todo Remove these inline types once the OpenAPI spec includes section
// analysis endpoints and the frontend types are regenerated.
// Backend source: estate-os-service/src/contract_intelligence/application/dtos/section_analysis.py
// ---------------------------------------------------------------------------
export interface SourceSectionAnalysisReferenceRead {
  id: string;
  reference_type: "field" | "condition";
  reference_key: string;
  display_label: string | null;
  confidence: string | null;
  created_at: string;
}

export interface SourceSectionAnalysisRead {
  id: string;
  source_section_analysis_run_id: string;
  source_section_id: string;
  section_type: "static" | "parameterized" | "conditional" | "generative";
  reasoning: string;
  risk_level: "low" | "medium" | "high";
  recommended_strategy:
    | "literal"
    | "template"
    | "template_variant"
    | "ai_draft";
  review_status: string;
  review_notes: string | null;
  corrected_section_type:
    | "static"
    | "parameterized"
    | "conditional"
    | "generative"
    | null;
  corrected_risk_level: "low" | "medium" | "high" | null;
  corrected_strategy:
    | "literal"
    | "template"
    | "template_variant"
    | "ai_draft"
    | null;
  created_at: string;
  updated_at: string;
  references: SourceSectionAnalysisReferenceRead[];
}

export interface SourceSectionAnalysisRunRead {
  id: string;
  source_document_id: string;
  provider: string;
  model_name: string;
  prompt_version: string;
  status: "pending" | "running" | "succeeded" | "failed";
  created_at: string;
  completed_at: string | null;
}

export interface SourceSectionAnalysisBundleRead {
  analysis_run: SourceSectionAnalysisRunRead;
  analyses: SourceSectionAnalysisRead[];
}

// ---------------------------------------------------------------------------
// Shared UUIDs for cross-referencing across mock data
// ---------------------------------------------------------------------------
const DOC_ID = "a1e2f3d4-5b6c-7d8e-9f0a-1b2c3d4e5f6a";
const DOC_ID_2 = "b2f3a4d5-6c7d-8e9f-0a1b-2c3d4e5f6a7b";
const DOC_ID_3 = "c3a4b5d6-7d8e-9f0a-1b2c-3d4e5f6a7b8c";
const ORG_ID = "d4b5c6a7-8e9f-0a1b-2c3d-4e5f6a7b8c9d";
const TEMPLATE_ID = "e5c6d7b8-9f0a-1b2c-3d4e-5f6a7b8c9d0e";
const VERSION_ID = "f6d7e8c9-0a1b-2c3d-4e5f-6a7b8c9d0e1f";
const GEN_CONTRACT_ID = "a7e8f9d0-1b2c-3d4e-5f6a-7b8c9d0e1f2a";
const ARTIFACT_ID = "b8f9a0e1-2c3d-4e5f-6a7b-8c9d0e1f2a3b";
const ANALYSIS_RUN_ID = "c9a0b1f2-3d4e-5f6a-7b8c-9d0e1f2a3b4c";

const SECTION_IDS = {
  preambulo: "s1a1b1c1-1111-1111-1111-111111111111",
  partes: "s2a2b2c2-2222-2222-2222-222222222222",
  objeto: "s3a3b3c3-3333-3333-3333-333333333333",
  prazo: "s4a4b4c4-4444-4444-4444-444444444444",
  renda: "s5a5b5c5-5555-5555-5555-555555555555",
  caucao: "s6a6b6c6-6666-6666-6666-666666666666",
  obrigSenhorio: "s7a7b7c7-7777-7777-7777-777777777777",
  obrigArrendatario: "s8a8b8c8-8888-8888-8888-888888888888",
  resolucao: "s9a9b9c9-9999-9999-9999-999999999999",
  disposicoes: "s0a0b0c0-0000-0000-0000-000000000000",
} as const;

// ---------------------------------------------------------------------------
// Existing mock data
// ---------------------------------------------------------------------------

export const FAKE_CONTRACT_MODELS: ContractModel[] = [
  {
    uuid: "model-1",
    url: "/contrato_arrendamento_exemplo.pdf",
    tenant_id: "tenant-1",
    created_at: "2025-11-15T10:30:00Z",
    template_version: {
      version: 3,
      status: "approved",
      render_engine: "handlebars",
      schema_json: {
        landlord_name: { type: "string" },
        tenant_name: { type: "string" },
        property_address: { type: "string" },
        monthly_rent: { type: "number" },
        start_date: { type: "string" },
        duration_months: { type: "number" },
      },
      created_at: "2025-11-10T08:00:00Z",
      approved_at: "2025-11-14T16:00:00Z",
      review_notes: "Clause 7 updated per legal review.",
    },
    source_document: {
      filename: "contrato-arrendamento-modelo-v1.pdf",
      page_count: 12,
      language: "pt",
      upload_status: "completed",
      sha256_hash:
        "a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2",
    },
    parse_result: parseResultJson as unknown as ReductoParseResult,
  },
  {
    uuid: "model-2",
    url: "/contrato_arrendamento_exemplo.pdf",
    tenant_id: "tenant-1",
    created_at: "2025-12-02T14:20:00Z",
    template_version: {
      version: 1,
      status: "review",
      render_engine: "mustache",
      schema_json: {
        seller_name: { type: "string" },
        buyer_name: { type: "string" },
        property_address: { type: "string" },
        sale_price: { type: "number" },
        notary_date: { type: "string" },
      },
      created_at: "2025-12-01T10:00:00Z",
      approved_at: null,
      review_notes: null,
    },
    source_document: {
      filename: "contrato-venda-modelo-v1.pdf",
      page_count: 8,
      language: "pt",
      upload_status: "completed",
      sha256_hash:
        "b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3",
    },
  },
];

export const FAKE_CONTRACTS: Contract[] = [
  {
    uuid: "contract-1",
    url: "https://storage.example.com/contrato-arrendamento-001.pdf",
    tenant_id: "tenant-1",
    created_at: "2026-01-10T09:00:00Z",
    is_signed: true,
    type: "arrendamento",
    property: {
      property_title: "Apartamento T2 em Cedofeita",
      property_address: "Rua de Cedofeita 45 3E, 4050-180 Porto",
      property_value: 185000,
      monthly_rent: 850,
    },
    landlord: {
      full_name: "Maria Santos Silva",
      address: "Rua de Santa Catarina 245, 4000-450 Porto",
      nif: "123456789",
      date_of_birth: "1985-03-15",
      document_id: "CC 12345678",
      document_type: "Cartão de Cidadão",
      email: "maria.santos@exemplo.pt",
      phone_number: "+351912345678",
      tenant_id: "tenant-1",
    },
    tenant: {
      full_name: "Pedro Miguel Alves",
      address: "Rua do Almada 200, 4050-032 Porto",
      nif: "234567890",
      date_of_birth: "1990-05-20",
      document_id: "CC 23456789",
      document_type: "Cartão de Cidadão",
      email: "pedro.alves@exemplo.pt",
      phone_number: "+351945678901",
      tenant_id: "tenant-1",
    },
  },
  {
    uuid: "contract-2",
    url: "https://storage.example.com/contrato-venda-001.pdf",
    tenant_id: "tenant-1",
    created_at: "2026-02-05T15:30:00Z",
    is_signed: false,
    type: "venda",
    property: {
      property_title: "Moradia T4 em Cascais",
      property_address: "Rua Frederico Arouca 12, 2750-342 Cascais",
      property_value: 650000,
      monthly_rent: null,
    },
    seller: {
      full_name: "João Manuel Ferreira",
      address: "Av. da Liberdade 110, 1250-146 Lisboa",
      nif: "987654321",
      date_of_birth: "1978-11-22",
      document_id: "CC 87654321",
      document_type: "Cartão de Cidadão",
      email: "joao.ferreira@exemplo.pt",
      phone_number: "+351923456789",
      tenant_id: "tenant-1",
    },
    buyer: {
      full_name: "Sofia Rodrigues",
      address: "Rua Augusta 50, 1100-053 Lisboa",
      nif: "345678901",
      date_of_birth: "1988-09-12",
      document_id: "CC 34567890",
      document_type: "Cartão de Cidadão",
      email: "sofia.rodrigues@exemplo.pt",
      phone_number: "+351956789012",
      tenant_id: "tenant-1",
    },
  },
  {
    uuid: "contract-3",
    url: "https://storage.example.com/contrato-arrendamento-002.pdf",
    tenant_id: "tenant-1",
    created_at: "2026-03-01T11:00:00Z",
    is_signed: true,
    type: "arrendamento",
    property: {
      property_title: "Apartamento T3 na Foz do Douro",
      property_address: "Av. Brasil 156, 4150-153 Porto",
      property_value: 475000,
      monthly_rent: 1400,
    },
    landlord: {
      full_name: "Ana Beatriz Costa",
      address: "Rua de Sá da Bandeira 88, 4000-432 Porto",
      nif: "456789123",
      date_of_birth: "1992-07-08",
      document_id: "CC 45678912",
      document_type: "Cartão de Cidadão",
      email: "ana.costa@exemplo.pt",
      phone_number: "+351934567890",
      tenant_id: "tenant-1",
    },
    tenant: {
      full_name: "Ricardo Mendes",
      address: "Rua de Passos Manuel 120, 4000-382 Porto",
      nif: "567890234",
      date_of_birth: "1995-01-30",
      document_id: "CC 56789023",
      document_type: "Cartão de Cidadão",
      email: "ricardo.mendes@exemplo.pt",
      phone_number: "+351967890123",
      tenant_id: "tenant-1",
    },
  },
];

// ---------------------------------------------------------------------------
// Source documents — list view (3 documents at different pipeline stages)
// ---------------------------------------------------------------------------

export const FAKE_SOURCE_DOCUMENT_LIST_ITEMS: SourceDocumentListItem[] = [
  {
    id: DOC_ID,
    filename: "contrato-arrendamento-habitacional-modelo-2026.pdf",
    contract_name: "Contrato de Arrendamento Habitacional",
    file_url: `https://s3.eu-west-1.amazonaws.com/predileto-contracts/${DOC_ID}/contrato-arrendamento-habitacional-modelo-2026.pdf`,
    page_count: 14,
    sections_count: 10,
    upload_status: "extracted",
    created_at: "2026-03-10T09:15:00Z",
  },
  {
    id: DOC_ID_2,
    filename: "contrato-compra-venda-imovel-v3.pdf",
    contract_name: "Contrato de Compra e Venda de Imóvel",
    file_url: `https://s3.eu-west-1.amazonaws.com/predileto-contracts/${DOC_ID_2}/contrato-compra-venda-imovel-v3.pdf`,
    page_count: 10,
    sections_count: 8,
    upload_status: "parsed",
    created_at: "2026-03-15T14:30:00Z",
  },
  {
    id: DOC_ID_3,
    filename: "contrato-subarrendamento-comercial.pdf",
    contract_name: null,
    file_url: `https://s3.eu-west-1.amazonaws.com/predileto-contracts/${DOC_ID_3}/contrato-subarrendamento-comercial.pdf`,
    page_count: null,
    sections_count: 0,
    upload_status: "uploaded",
    created_at: "2026-03-20T11:00:00Z",
  },
];

// ---------------------------------------------------------------------------
// Source document — full metadata (primary rental contract)
// ---------------------------------------------------------------------------

export const FAKE_SOURCE_DOCUMENT_READ: SourceDocumentRead = {
  id: DOC_ID,
  organization_id: ORG_ID,
  filename: "contrato-arrendamento-habitacional-modelo-2026.pdf",
  storage_url: `s3://predileto-contracts/${DOC_ID}/contrato-arrendamento-habitacional-modelo-2026.pdf`,
  mime_type: "application/pdf",
  page_count: 14,
  language_code: "pt",
  document_hash:
    "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
  upload_status: "extracted",
  created_at: "2026-03-10T09:15:00Z",
};

// ---------------------------------------------------------------------------
// Source document — detail view with parse data
// ---------------------------------------------------------------------------

export const FAKE_SOURCE_DOCUMENT_DETAIL: SourceDocumentDetail = {
  id: DOC_ID,
  filename: "contrato-arrendamento-habitacional-modelo-2026.pdf",
  contract_name: "Contrato de Arrendamento Habitacional",
  file_url: `https://s3.eu-west-1.amazonaws.com/predileto-contracts/${DOC_ID}/contrato-arrendamento-habitacional-modelo-2026.pdf`,
  page_count: 14,
  upload_status: "extracted",
  created_at: "2026-03-10T09:15:00Z",
  parse_response_json: parseResultJson as Record<string, unknown>,
};

// ---------------------------------------------------------------------------
// Source sections — parsed sections of the rental contract
// ---------------------------------------------------------------------------

export const FAKE_SOURCE_SECTIONS: SourceSectionRead[] = [
  {
    id: SECTION_IDS.preambulo,
    section_key: "preambulo",
    title: "Preâmbulo",
    page_start: 1,
    page_end: 1,
    sort_order: 1,
    extracted_text:
      "Entre as partes abaixo identificadas é celebrado o presente contrato de arrendamento para habitação, que se rege pelas cláusulas seguintes e, subsidiariamente, pelas disposições legais aplicáveis, nomeadamente o Novo Regime do Arrendamento Urbano (NRAU), aprovado pela Lei n.º 6/2006, de 27 de fevereiro, com as alterações subsequentes.",
    normalized_text: null,
    classification_confidence: "0.96",
    review_status: "accepted",
  },
  {
    id: SECTION_IDS.partes,
    section_key: "identificacao_partes",
    title: "Identificação das Partes",
    page_start: 1,
    page_end: 2,
    sort_order: 2,
    extracted_text:
      "PRIMEIRO OUTORGANTE (Senhorio): Maria Santos Silva, portadora do Cartão de Cidadão n.º 12345678, contribuinte fiscal n.º 123 456 789, residente na Rua de Santa Catarina 245, 4000-450 Porto. SEGUNDO OUTORGANTE (Arrendatário): Pedro Miguel Alves, portador do Cartão de Cidadão n.º 23456789, contribuinte fiscal n.º 234 567 890, residente na Rua do Almada 200, 4050-032 Porto.",
    normalized_text: null,
    classification_confidence: "0.98",
    review_status: "accepted",
  },
  {
    id: SECTION_IDS.objeto,
    section_key: "objeto_contrato",
    title: "Objeto do Contrato",
    page_start: 2,
    page_end: 3,
    sort_order: 3,
    extracted_text:
      "O Primeiro Outorgante dá de arrendamento ao Segundo Outorgante, que aceita, a fração autónoma designada pela letra E, correspondente ao terceiro andar esquerdo do prédio urbano sito na Rua de Cedofeita 45, 4050-180 Porto, inscrito na matriz predial urbana sob o artigo 1234 da freguesia de Cedofeita, descrito na Conservatória do Registo Predial do Porto sob o n.º 5678/20100101.",
    normalized_text: null,
    classification_confidence: "0.94",
    review_status: "accepted",
  },
  {
    id: SECTION_IDS.prazo,
    section_key: "prazo_duracao",
    title: "Prazo e Duração",
    page_start: 3,
    page_end: 4,
    sort_order: 4,
    extracted_text:
      "O presente contrato é celebrado pelo prazo de 12 (doze) meses, com início em 1 de Abril de 2026 e termo em 31 de Março de 2027, renovando-se automaticamente por iguais e sucessivos períodos de 12 meses, salvo denúncia de qualquer das partes nos termos legais.",
    normalized_text:
      "O presente contrato é celebrado pelo prazo de 12 (doze) meses, com início em 1 de abril de 2026 e termo em 31 de março de 2027, renovando-se automaticamente por iguais e sucessivos períodos de 12 meses, salvo denúncia de qualquer das partes nos termos legais aplicáveis.",
    classification_confidence: "0.91",
    review_status: "corrected",
  },
  {
    id: SECTION_IDS.renda,
    section_key: "renda_pagamento",
    title: "Renda e Forma de Pagamento",
    page_start: 4,
    page_end: 5,
    sort_order: 5,
    extracted_text:
      "A renda mensal é fixada em 850,00€ (oitocentos e cinquenta euros), devida até ao primeiro dia útil do mês a que respeita, por transferência bancária para o IBAN PT50 0035 0000 1234 5678 9012 3, titulado pelo Senhorio. A renda será atualizada anualmente, de acordo com os coeficientes legais de atualização de rendas.",
    normalized_text: null,
    classification_confidence: "0.97",
    review_status: "accepted",
  },
  {
    id: SECTION_IDS.caucao,
    section_key: "caucao",
    title: "Caução",
    page_start: 5,
    page_end: 5,
    sort_order: 6,
    extracted_text:
      "A título de caução, o Arrendatário entrega ao Senhorio, na data da assinatura do presente contrato, a quantia de 1.700,00€ (mil e setecentos euros), correspondente a duas rendas mensais, destinada a garantir o cumprimento das obrigações contratuais. A caução será devolvida no prazo de 30 dias após a cessação do contrato, deduzidas as importâncias eventualmente devidas.",
    normalized_text: null,
    classification_confidence: "0.89",
    review_status: "pending",
  },
  {
    id: SECTION_IDS.obrigSenhorio,
    section_key: "obrigacoes_senhorio",
    title: "Obrigações do Senhorio",
    page_start: 6,
    page_end: 7,
    sort_order: 7,
    extracted_text:
      "O Senhorio obriga-se a: a) Entregar o locado em bom estado de conservação e habitabilidade; b) Assegurar o gozo pacífico do locado para os fins a que se destina; c) Realizar as obras de conservação ordinária e extraordinária necessárias à manutenção das condições de habitabilidade, nos termos do artigo 1074.º do Código Civil.",
    normalized_text: null,
    classification_confidence: "0.95",
    review_status: "accepted",
  },
  {
    id: SECTION_IDS.obrigArrendatario,
    section_key: "obrigacoes_arrendatario",
    title: "Obrigações do Arrendatário",
    page_start: 7,
    page_end: 9,
    sort_order: 8,
    extracted_text:
      "O Arrendatário obriga-se a: a) Pagar pontualmente a renda; b) Utilizar o locado exclusivamente para fins habitacionais; c) Não realizar obras sem autorização prévia e escrita do Senhorio; d) Manter o locado em bom estado de conservação; e) Restituir o locado findo o contrato, no estado em que o recebeu, ressalvado o desgaste normal.",
    normalized_text: null,
    classification_confidence: "0.93",
    review_status: "pending",
  },
  {
    id: SECTION_IDS.resolucao,
    section_key: "resolucao_contrato",
    title: "Resolução do Contrato",
    page_start: 9,
    page_end: 11,
    sort_order: 9,
    extracted_text:
      "Constituem fundamento de resolução do contrato pelo Senhorio: a) A mora superior a três meses no pagamento da renda; b) A utilização do locado para fim diverso daquele a que se destina; c) O incumprimento reiterado das regras de higiene, sossego e boa vizinhança. O Arrendatário pode resolver o contrato com antecedência mínima de 90 dias.",
    normalized_text: null,
    classification_confidence: "0.87",
    review_status: "rejected",
  },
  {
    id: SECTION_IDS.disposicoes,
    section_key: "disposicoes_finais",
    title: "Disposições Finais",
    page_start: 11,
    page_end: 14,
    sort_order: 10,
    extracted_text:
      "O presente contrato é celebrado em duplicado, ficando cada uma das partes com um exemplar. Para qualquer litígio emergente do presente contrato é competente o foro da comarca do Porto. O presente contrato entra em vigor na data da sua assinatura por ambas as partes. Porto, 1 de abril de 2026.",
    normalized_text: null,
    classification_confidence: "0.92",
    review_status: "accepted",
  },
];

// ---------------------------------------------------------------------------
// Field evidence — extracted fields with provenance
// ---------------------------------------------------------------------------

export const FAKE_FIELD_EVIDENCE: FieldEvidenceRead[] = [
  {
    id: "fe01a1b1-1111-1111-1111-111111111111",
    source_section_id: SECTION_IDS.partes,
    field_key: "landlord_name",
    field_value_json: "Maria Santos Silva",
    source_text:
      "PRIMEIRO OUTORGANTE (Senhorio): Maria Santos Silva, portadora do Cartão de Cidadão",
    page_number: 1,
    confidence: "0.97",
    review_status: "accepted",
    corrected_value_json: null,
  },
  {
    id: "fe02a2b2-2222-2222-2222-222222222222",
    source_section_id: SECTION_IDS.partes,
    field_key: "landlord_nif",
    field_value_json: "123456789",
    source_text: "contribuinte fiscal n.º 123 456 789",
    page_number: 1,
    confidence: "0.99",
    review_status: "accepted",
    corrected_value_json: null,
  },
  {
    id: "fe03a3b3-3333-3333-3333-333333333333",
    source_section_id: SECTION_IDS.partes,
    field_key: "tenant_name",
    field_value_json: "Pedro Miguel Alves",
    source_text:
      "SEGUNDO OUTORGANTE (Arrendatário): Pedro Miguel Alves, portador do Cartão de Cidadão",
    page_number: 2,
    confidence: "0.95",
    review_status: "accepted",
    corrected_value_json: null,
  },
  {
    id: "fe04a4b4-4444-4444-4444-444444444444",
    source_section_id: SECTION_IDS.partes,
    field_key: "tenant_nif",
    field_value_json: "234567890",
    source_text: "contribuinte fiscal n.º 234 567 890",
    page_number: 2,
    confidence: "0.98",
    review_status: "accepted",
    corrected_value_json: null,
  },
  {
    id: "fe05a5b5-5555-5555-5555-555555555555",
    source_section_id: SECTION_IDS.objeto,
    field_key: "property_address",
    field_value_json: "Rua de Cedofeita 45 3E, 4050-180 Porto",
    source_text:
      "prédio urbano sito na Rua de Cedofeita 45, 4050-180 Porto",
    page_number: 2,
    confidence: "0.92",
    review_status: "accepted",
    corrected_value_json: null,
  },
  {
    id: "fe06a6b6-6666-6666-6666-666666666666",
    source_section_id: SECTION_IDS.objeto,
    field_key: "property_registry_number",
    field_value_json: "5678/20100101",
    source_text:
      "descrito na Conservatória do Registo Predial do Porto sob o n.º 5678/20100101",
    page_number: 3,
    confidence: "0.90",
    review_status: "accepted",
    corrected_value_json: null,
  },
  {
    id: "fe07a7b7-7777-7777-7777-777777777777",
    source_section_id: SECTION_IDS.renda,
    field_key: "monthly_rent",
    field_value_json: 850,
    source_text: "A renda mensal é fixada em 850,00€",
    page_number: 4,
    confidence: "0.96",
    review_status: "accepted",
    corrected_value_json: null,
  },
  {
    id: "fe08a8b8-8888-8888-8888-888888888888",
    source_section_id: SECTION_IDS.renda,
    field_key: "rent_currency",
    field_value_json: "EUR",
    source_text: "850,00€ (oitocentos e cinquenta euros)",
    page_number: 4,
    confidence: "0.99",
    review_status: "accepted",
    corrected_value_json: null,
  },
  {
    id: "fe09a9b9-9999-9999-9999-999999999999",
    source_section_id: SECTION_IDS.renda,
    field_key: "payment_day",
    field_value_json: 1,
    source_text: "devida até ao primeiro dia útil do mês a que respeita",
    page_number: 4,
    confidence: "0.91",
    review_status: "accepted",
    corrected_value_json: null,
  },
  {
    id: "fe10a0b0-0000-0000-0000-000000000000",
    source_section_id: SECTION_IDS.prazo,
    field_key: "start_date",
    field_value_json: "2026-04-01",
    source_text: "com início em 1 de Abril de 2026",
    page_number: 3,
    confidence: "0.88",
    review_status: "corrected",
    corrected_value_json: "2026-04-01",
  },
  {
    id: "fe11b1c1-1111-2222-3333-444444444444",
    source_section_id: SECTION_IDS.prazo,
    field_key: "duration_months",
    field_value_json: 12,
    source_text: "pelo prazo de 12 (doze) meses",
    page_number: 3,
    confidence: "0.85",
    review_status: "corrected",
    corrected_value_json: 12,
  },
  {
    id: "fe12c2d2-2222-3333-4444-555555555555",
    source_section_id: SECTION_IDS.caucao,
    field_key: "deposit_amount",
    field_value_json: 1700,
    source_text:
      "a quantia de 1.700,00€ (mil e setecentos euros), correspondente a duas rendas mensais",
    page_number: 5,
    confidence: "0.78",
    review_status: "pending",
    corrected_value_json: null,
  },
  {
    id: "fe13d3e3-3333-4444-5555-666666666666",
    source_section_id: SECTION_IDS.prazo,
    field_key: "renewal_clause",
    field_value_json: true,
    source_text:
      "renovando-se automaticamente por iguais e sucessivos períodos",
    page_number: 3,
    confidence: "0.72",
    review_status: "pending",
    corrected_value_json: null,
  },
  {
    id: "fe14e4f4-4444-5555-6666-777777777777",
    source_section_id: SECTION_IDS.resolucao,
    field_key: "termination_notice_days",
    field_value_json: 90,
    source_text:
      "O Arrendatário pode resolver o contrato com antecedência mínima de 90 dias",
    page_number: 10,
    confidence: "0.65",
    review_status: "rejected",
    corrected_value_json: null,
  },
];

// ---------------------------------------------------------------------------
// Review bundle — aggregated sections + field evidence for review UI
// ---------------------------------------------------------------------------

export const FAKE_SOURCE_REVIEW_BUNDLE: SourceReviewBundleRead = {
  source_document_id: DOC_ID,
  filename: "contrato-arrendamento-habitacional-modelo-2026.pdf",
  upload_status: "extracted",
  sections: FAKE_SOURCE_SECTIONS,
  field_evidence: FAKE_FIELD_EVIDENCE,
};

// ---------------------------------------------------------------------------
// Section analysis — AI classification of each section
// ---------------------------------------------------------------------------

export const FAKE_SECTION_ANALYSIS_RUN: SourceSectionAnalysisRunRead = {
  id: ANALYSIS_RUN_ID,
  source_document_id: DOC_ID,
  provider: "anthropic",
  model_name: "claude-sonnet-4-20250514",
  prompt_version: "v2",
  status: "succeeded",
  created_at: "2026-03-10T10:00:00Z",
  completed_at: "2026-03-10T10:02:34Z",
};

export const FAKE_SECTION_ANALYSIS_BUNDLE: SourceSectionAnalysisBundleRead = {
  analysis_run: FAKE_SECTION_ANALYSIS_RUN,
  analyses: [
    {
      id: "sa01-1111-1111-1111-111111111111",
      source_section_analysis_run_id: ANALYSIS_RUN_ID,
      source_section_id: SECTION_IDS.preambulo,
      section_type: "static",
      reasoning:
        "Texto introdutório padrão que referencia o enquadramento legal (NRAU). Não contém variáveis nem condições — é idêntico em todos os contratos de arrendamento habitacional.",
      risk_level: "low",
      recommended_strategy: "literal",
      review_status: "accepted",
      review_notes: null,
      corrected_section_type: null,
      corrected_risk_level: null,
      corrected_strategy: null,
      created_at: "2026-03-10T10:02:34Z",
      updated_at: "2026-03-10T10:02:34Z",
      references: [],
    },
    {
      id: "sa02-2222-2222-2222-222222222222",
      source_section_analysis_run_id: ANALYSIS_RUN_ID,
      source_section_id: SECTION_IDS.partes,
      section_type: "parameterized",
      reasoning:
        "Contém dados variáveis das partes contratuais (nomes, NIFs, moradas, documentos de identificação). A estrutura é fixa mas os valores mudam em cada contrato.",
      risk_level: "low",
      recommended_strategy: "template",
      review_status: "accepted",
      review_notes: null,
      corrected_section_type: null,
      corrected_risk_level: null,
      corrected_strategy: null,
      created_at: "2026-03-10T10:02:34Z",
      updated_at: "2026-03-10T10:02:34Z",
      references: [
        {
          id: "ref01-1111-1111-1111-111111111111",
          reference_type: "field",
          reference_key: "landlord_name",
          display_label: "Nome do Senhorio",
          confidence: "0.97",
          created_at: "2026-03-10T10:02:34Z",
        },
        {
          id: "ref02-2222-2222-2222-222222222222",
          reference_type: "field",
          reference_key: "landlord_nif",
          display_label: "NIF do Senhorio",
          confidence: "0.99",
          created_at: "2026-03-10T10:02:34Z",
        },
        {
          id: "ref03-3333-3333-3333-333333333333",
          reference_type: "field",
          reference_key: "tenant_name",
          display_label: "Nome do Arrendatário",
          confidence: "0.95",
          created_at: "2026-03-10T10:02:34Z",
        },
        {
          id: "ref04-4444-4444-4444-444444444444",
          reference_type: "field",
          reference_key: "tenant_nif",
          display_label: "NIF do Arrendatário",
          confidence: "0.98",
          created_at: "2026-03-10T10:02:34Z",
        },
      ],
    },
    {
      id: "sa03-3333-3333-3333-333333333333",
      source_section_analysis_run_id: ANALYSIS_RUN_ID,
      source_section_id: SECTION_IDS.objeto,
      section_type: "parameterized",
      reasoning:
        "Identifica o imóvel arrendado com dados específicos (morada, artigo matricial, número de descrição predial). Estrutura padronizada com campos variáveis.",
      risk_level: "low",
      recommended_strategy: "template",
      review_status: "accepted",
      review_notes: null,
      corrected_section_type: null,
      corrected_risk_level: null,
      corrected_strategy: null,
      created_at: "2026-03-10T10:02:34Z",
      updated_at: "2026-03-10T10:02:34Z",
      references: [
        {
          id: "ref05-5555-5555-5555-555555555555",
          reference_type: "field",
          reference_key: "property_address",
          display_label: "Morada do Imóvel",
          confidence: "0.92",
          created_at: "2026-03-10T10:02:34Z",
        },
        {
          id: "ref06-6666-6666-6666-666666666666",
          reference_type: "field",
          reference_key: "property_registry_number",
          display_label: "N.º Descrição Predial",
          confidence: "0.90",
          created_at: "2026-03-10T10:02:34Z",
        },
      ],
    },
    {
      id: "sa04-4444-4444-4444-444444444444",
      source_section_analysis_run_id: ANALYSIS_RUN_ID,
      source_section_id: SECTION_IDS.prazo,
      section_type: "parameterized",
      reasoning:
        "Define a duração do contrato, datas de início e termo, e cláusula de renovação automática. Valores numéricos e datas são variáveis; a renovação pode ser condicional.",
      risk_level: "medium",
      recommended_strategy: "template",
      review_status: "corrected",
      review_notes:
        "A cláusula de renovação deve ser condicional — nem todos os contratos incluem renovação automática.",
      corrected_section_type: null,
      corrected_risk_level: null,
      corrected_strategy: "template_variant",
      created_at: "2026-03-10T10:02:34Z",
      updated_at: "2026-03-12T14:30:00Z",
      references: [
        {
          id: "ref07-7777-7777-7777-777777777777",
          reference_type: "field",
          reference_key: "start_date",
          display_label: "Data de Início",
          confidence: "0.88",
          created_at: "2026-03-10T10:02:34Z",
        },
        {
          id: "ref08-8888-8888-8888-888888888888",
          reference_type: "field",
          reference_key: "duration_months",
          display_label: "Duração (meses)",
          confidence: "0.85",
          created_at: "2026-03-10T10:02:34Z",
        },
        {
          id: "ref09-9999-9999-9999-999999999999",
          reference_type: "condition",
          reference_key: "renewal_clause",
          display_label: "Cláusula de Renovação",
          confidence: "0.72",
          created_at: "2026-03-10T10:02:34Z",
        },
      ],
    },
    {
      id: "sa05-5555-5555-5555-555555555555",
      source_section_analysis_run_id: ANALYSIS_RUN_ID,
      source_section_id: SECTION_IDS.renda,
      section_type: "parameterized",
      reasoning:
        "Estipula o valor da renda, forma e data de pagamento, e mecanismo de atualização anual. Valores monetários e IBAN são variáveis.",
      risk_level: "medium",
      recommended_strategy: "template",
      review_status: "accepted",
      review_notes: null,
      corrected_section_type: null,
      corrected_risk_level: null,
      corrected_strategy: null,
      created_at: "2026-03-10T10:02:34Z",
      updated_at: "2026-03-10T10:02:34Z",
      references: [
        {
          id: "ref10-0000-0000-0000-000000000000",
          reference_type: "field",
          reference_key: "monthly_rent",
          display_label: "Renda Mensal",
          confidence: "0.96",
          created_at: "2026-03-10T10:02:34Z",
        },
        {
          id: "ref11-1111-2222-3333-444444444444",
          reference_type: "field",
          reference_key: "payment_day",
          display_label: "Dia de Pagamento",
          confidence: "0.91",
          created_at: "2026-03-10T10:02:34Z",
        },
      ],
    },
    {
      id: "sa06-6666-6666-6666-666666666666",
      source_section_analysis_run_id: ANALYSIS_RUN_ID,
      source_section_id: SECTION_IDS.caucao,
      section_type: "conditional",
      reasoning:
        "A caução é opcional — nem todos os contratos de arrendamento a incluem. Quando presente, o valor e condições de devolução variam. A inclusão desta secção depende de se foi acordada caução.",
      risk_level: "medium",
      recommended_strategy: "template_variant",
      review_status: "pending",
      review_notes: null,
      corrected_section_type: null,
      corrected_risk_level: null,
      corrected_strategy: null,
      created_at: "2026-03-10T10:02:34Z",
      updated_at: "2026-03-10T10:02:34Z",
      references: [
        {
          id: "ref12-2222-3333-4444-555555555555",
          reference_type: "field",
          reference_key: "deposit_amount",
          display_label: "Valor da Caução",
          confidence: "0.78",
          created_at: "2026-03-10T10:02:34Z",
        },
        {
          id: "ref13-3333-4444-5555-666666666666",
          reference_type: "condition",
          reference_key: "has_deposit",
          display_label: "Caução Acordada",
          confidence: "0.85",
          created_at: "2026-03-10T10:02:34Z",
        },
      ],
    },
    {
      id: "sa07-7777-7777-7777-777777777777",
      source_section_analysis_run_id: ANALYSIS_RUN_ID,
      source_section_id: SECTION_IDS.obrigSenhorio,
      section_type: "static",
      reasoning:
        "As obrigações do senhorio decorrem diretamente do Código Civil (artigo 1074.º) e do NRAU. O texto é padronizado e não contém variáveis.",
      risk_level: "low",
      recommended_strategy: "literal",
      review_status: "accepted",
      review_notes: null,
      corrected_section_type: null,
      corrected_risk_level: null,
      corrected_strategy: null,
      created_at: "2026-03-10T10:02:34Z",
      updated_at: "2026-03-10T10:02:34Z",
      references: [],
    },
    {
      id: "sa08-8888-8888-8888-888888888888",
      source_section_analysis_run_id: ANALYSIS_RUN_ID,
      source_section_id: SECTION_IDS.obrigArrendatario,
      section_type: "static",
      reasoning:
        "Obrigações padrão do arrendatário baseadas na legislação vigente. Texto fixo sem campos variáveis.",
      risk_level: "low",
      recommended_strategy: "literal",
      review_status: "pending",
      review_notes: null,
      corrected_section_type: null,
      corrected_risk_level: null,
      corrected_strategy: null,
      created_at: "2026-03-10T10:02:34Z",
      updated_at: "2026-03-10T10:02:34Z",
      references: [],
    },
    {
      id: "sa09-9999-9999-9999-999999999999",
      source_section_analysis_run_id: ANALYSIS_RUN_ID,
      source_section_id: SECTION_IDS.resolucao,
      section_type: "conditional",
      reasoning:
        "As cláusulas de resolução podem variar significativamente. O prazo de pré-aviso e os fundamentos específicos dependem do tipo de contrato e negociação entre partes. Risco elevado por impacto jurídico direto.",
      risk_level: "high",
      recommended_strategy: "template_variant",
      review_status: "rejected",
      review_notes:
        "Secção necessita revisão jurídica aprofundada — os fundamentos de resolução listados não estão completos face ao NRAU atual.",
      corrected_section_type: "generative",
      corrected_risk_level: null,
      corrected_strategy: "ai_draft",
      created_at: "2026-03-10T10:02:34Z",
      updated_at: "2026-03-13T09:15:00Z",
      references: [
        {
          id: "ref14-4444-5555-6666-777777777777",
          reference_type: "field",
          reference_key: "termination_notice_days",
          display_label: "Prazo de Pré-aviso (dias)",
          confidence: "0.65",
          created_at: "2026-03-10T10:02:34Z",
        },
      ],
    },
    {
      id: "sa10-0000-0000-0000-000000000000",
      source_section_analysis_run_id: ANALYSIS_RUN_ID,
      source_section_id: SECTION_IDS.disposicoes,
      section_type: "static",
      reasoning:
        "Disposições finais padronizadas (foro competente, número de exemplares, data de assinatura). A comarca pode variar mas é facilmente parametrizável.",
      risk_level: "low",
      recommended_strategy: "literal",
      review_status: "accepted",
      review_notes: null,
      corrected_section_type: null,
      corrected_risk_level: null,
      corrected_strategy: null,
      created_at: "2026-03-10T10:02:34Z",
      updated_at: "2026-03-10T10:02:34Z",
      references: [],
    },
  ],
};

// ---------------------------------------------------------------------------
// Template version — derived from the reviewed source document
// ---------------------------------------------------------------------------

export const FAKE_TEMPLATE_VERSION_READ: TemplateVersionRead = {
  id: VERSION_ID,
  contract_template_id: TEMPLATE_ID,
  source_document_id: DOC_ID,
  version_number: 1,
  render_engine: "jinja",
  schema_json: {
    landlord_name: { type: "string", required: true },
    landlord_nif: { type: "string", required: true },
    landlord_address: { type: "string", required: true },
    landlord_document_id: { type: "string", required: true },
    tenant_name: { type: "string", required: true },
    tenant_nif: { type: "string", required: true },
    tenant_address: { type: "string", required: true },
    tenant_document_id: { type: "string", required: true },
    property_address: { type: "string", required: true },
    property_registry_number: { type: "string", required: true },
    monthly_rent: { type: "number", required: true },
    rent_currency: { type: "string", default: "EUR" },
    payment_day: { type: "number", default: 1 },
    start_date: { type: "string", format: "date", required: true },
    duration_months: { type: "number", required: true },
    renewal_clause: { type: "boolean", default: true },
    deposit_amount: { type: "number", required: false },
    termination_notice_days: { type: "number", default: 90 },
  },
  computed_rules_json: {
    include_caucao: {
      condition: "deposit_amount != null and deposit_amount > 0",
      description: "Incluir secção de caução apenas quando existe valor de caução definido.",
    },
    include_renewal: {
      condition: "renewal_clause == true",
      description: "Incluir cláusula de renovação automática.",
    },
  },
  status: "draft",
  review_notes: null,
  created_by: null,
  approved_by: null,
  created_at: "2026-03-14T09:00:00Z",
  approved_at: null,
};

// ---------------------------------------------------------------------------
// Generated contract — from template + CRM data
// ---------------------------------------------------------------------------

export const FAKE_GENERATED_CONTRACT: GeneratedContractRead = {
  id: GEN_CONTRACT_ID,
  contract_template_id: TEMPLATE_ID,
  template_version_id: VERSION_ID,
  organization_id: ORG_ID,
  crm_contact_id: "crm-contact-pedro-alves",
  crm_property_id: "crm-property-cedofeita-45",
  status: "draft",
  input_payload_json: {
    landlord_name: "Maria Santos Silva",
    landlord_nif: "123456789",
    landlord_address: "Rua de Santa Catarina 245, 4000-450 Porto",
    landlord_document_id: "CC 12345678",
    tenant_name: "Pedro Miguel Alves",
    tenant_nif: "234567890",
    tenant_address: "Rua do Almada 200, 4050-032 Porto",
    tenant_document_id: "CC 23456789",
    property_address: "Rua de Cedofeita 45 3E, 4050-180 Porto",
    property_registry_number: "5678/20100101",
    monthly_rent: 850,
    rent_currency: "EUR",
    payment_day: 1,
    start_date: "2026-04-01",
    duration_months: 12,
    renewal_clause: true,
    deposit_amount: 1700,
    termination_notice_days: 90,
  },
  rendered_schema_json: {
    landlord_name: { type: "string", resolved: true },
    tenant_name: { type: "string", resolved: true },
    property_address: { type: "string", resolved: true },
    monthly_rent: { type: "number", resolved: true },
    start_date: { type: "string", resolved: true },
    duration_months: { type: "number", resolved: true },
    deposit_amount: { type: "number", resolved: true },
  },
  created_at: "2026-03-18T16:00:00Z",
  updated_at: "2026-03-18T16:00:00Z",
};

// ---------------------------------------------------------------------------
// Render response — PDF artifact
// ---------------------------------------------------------------------------

export const FAKE_RENDER_RESPONSE: RenderGeneratedContractResponse = {
  id: ARTIFACT_ID,
  artifact_type: "pdf",
  storage_url: `s3://predileto-contracts/${ORG_ID}/generated/${GEN_CONTRACT_ID}/contrato-arrendamento-cedofeita-45.pdf`,
  created_at: "2026-03-18T16:01:12Z",
};
