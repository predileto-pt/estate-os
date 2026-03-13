export type RiskLevel = "LOW" | "MEDIUM" | "HIGH";

export interface ScreeningReport {
  applicant_id: string;
  risk_level: RiskLevel;
  identity_verified: boolean;
  income_verified: boolean;
  dti_ratio: number;
  justification: string;
  property_type: string;
  average_monthly_income: number;
}

export interface Applicant {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  owner_id: string;
  form_request_id: string;
  property_type: string;
  property_value: number | null;
  monthly_rent: number | null;
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
  agency_id: string;
  applicant_name: string;
  applicant_email: string;
  applicant_phone: string | null;
  property_id: string;
  property_type: string;
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
  agency_id: string;
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

export interface Database {
  public: {
    Tables: Record<string, never>;
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}
