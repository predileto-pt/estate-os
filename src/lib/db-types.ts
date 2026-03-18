export type RiskLevel = "LOW" | "MEDIUM" | "HIGH";

export interface ScreeningReport {
  applicant_id: string;
  risk_level: RiskLevel;
  identity_verified: boolean;
  income_verified: boolean;
  dti_ratio: number;
  justification: string;
  listing_type: string;
  property_type: string | null;
  average_monthly_income: number;
}

export interface Applicant {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  organization_id: string;
  form_request_id: string;
  listing_type: string;
  property_type: string | null;
  property_value: number | null;
  monthly_rent: number | null;
  property_title: string | null;
  property_address: string | null;
  status: string | null;
  screening_report: ScreeningReport | null;
}

export interface CompanyRow {
  id: string;
  user_id: string;
  name: string;
  nif: string;
  address: string;
  created_at: string;
  updated_at: string;
}

export type IntakeFormRequestStatus = "pending" | "completed" | "expired";

export interface IntakeFormSubmission {
  id: string;
  status: string;
  created_at: string;
}

export interface IntakeFormRequestRow {
  id: string;
  organization_id: string;
  applicant_name: string;
  applicant_email: string;
  applicant_phone: string | null;
  property_id: string;
  property_type: string | null;
  listing_type: string;
  property_title: string | null;
  property_price: number | null;
  property_address: string | null;
  status: IntakeFormRequestStatus;
  created_at: string;
  updated_at: string;
  submission: IntakeFormSubmission | null;
}

export interface IntakeFormRequestInsert {
  id?: string;
  organization_id: string;
  applicant_name: string;
  applicant_email: string;
  applicant_phone?: string | null;
  property_id: string;
  listing_type?: string;
  property_title?: string | null;
  property_price?: number | null;
  property_address?: string | null;
  status?: IntakeFormRequestStatus;
  created_at?: string;
  updated_at?: string;
}

export interface Person {
  full_name: string;
  address: string;
  nif: string;
  date_of_birth: string;
  document_id: string;
  document_type: string;
  email: string;
  phone_number: string;
  tenant_id: string;
}

export interface Owner {
  name: string;
  address: string;
  nif: string;
  phone: string;
  email: string;
}

export type ListingType = "sale" | "purchase";
export type Typology = "house" | "apartment" | "land" | "ruin";
export type PropertyStatus = "draft" | "active" | "sold" | "rented" | "withdrawn";
export type CivilStatus = "single" | "married" | "divorced" | "widowed" | "civil_union" | "separated";
export type DocumentType = "cartao_cidadao" | "passport" | "visto_residencia" | "titulo_residencia";

export interface PropertyCharacteristics {
  area_in_m2: number | null;
  num_of_bedrooms: number | null;
  num_of_bathrooms: number | null;
  built_at: number | null;
  energy_rating: string | null;
  floor: number | null;
  parking_spaces: number | null;
  has_elevator: boolean | null;
  has_garden: boolean | null;
  has_pool: boolean | null;
}

export interface PropertyOwner {
  id: string;
  property_id: string;
  full_name: string;
  civil_status: CivilStatus;
  address: string;
  nif: string;
  document_type: DocumentType;
  document_id: string;
  issued_by: string;
  issuing_district: string | null;
  date_of_birth: string;
  created_at: string;
  updated_at: string;
}

export interface PropertyRecord {
  id: string;
  user_id: string;
  address: string;
  listing_type: ListingType;
  typology: Typology;
  status: PropertyStatus;
  description: string | null;
  characteristics: PropertyCharacteristics | null;
  owners: PropertyOwner[];
  created_at: string;
  updated_at: string;
}

export interface Property {
  uuid: string;
  title: string;
  address: string;
  listing_type: "venda" | "arrendamento";
  property_type: "apartamento" | "moradia";
  property_value: number;
  monthly_rent: number | null;
  owners: Owner[];
  tenant_id: string;
}

export interface ContractProperty {
  property_title: string;
  property_address: string;
  property_value: number | null;
  monthly_rent: number | null;
}

export interface Contract {
  uuid: string;
  url: string;
  tenant_id: string;
  created_at: string;
  is_signed: boolean;
  type: "venda" | "arrendamento";
  property: ContractProperty;
  seller?: Person;
  buyer?: Person;
  landlord?: Person;
  tenant?: Person;
}

export type TemplateVersionStatus =
  | "draft"
  | "review"
  | "approved"
  | "deprecated"
  | "archived";

export type UploadStatus =
  | "pending"
  | "processing"
  | "completed"
  | "failed";

export interface SourceDocument {
  filename: string;
  page_count: number;
  language: string;
  upload_status: UploadStatus;
  sha256_hash: string;
}

export interface TemplateVersion {
  version: number;
  status: TemplateVersionStatus;
  render_engine: string;
  schema_json: Record<string, unknown>;
  created_at: string;
  approved_at: string | null;
  review_notes: string | null;
}

export interface ReductoBlock {
  type: "Title" | "Text" | "Key Value" | "Section Header" | "Footer";
  content: string;
  bbox: {
    left: number;
    top: number;
    width: number;
    height: number;
    page: number;
    original_page: number;
  };
  confidence: "high" | "medium" | "low";
}

export interface ReductoChunk {
  content: string;
  blocks: ReductoBlock[];
}

export interface ReductoParseResult {
  job_id: string;
  result: { type: string; chunks: ReductoChunk[] };
}

export interface ContractModel {
  uuid: string;
  url: string;
  tenant_id: string;
  created_at: string;
  template_version?: TemplateVersion;
  source_document?: SourceDocument;
  parse_result?: ReductoParseResult;
}

export interface Database {
  public: {
    Tables: Record<string, never>;
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}
