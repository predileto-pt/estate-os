export type ApplicantStatus = "pending" | "approved" | "rejected";

export interface IncomeRecord {
  month: string; // "YYYY-MM"
  amount: number; // EUR
  source: string; // employer/source name
}

export interface ApplicantRow {
  id: string;
  property_id: string;
  property_title: string;
  property_price: number | null;
  property_address: string | null;
  visitor_name: string;
  visitor_email: string;
  visitor_phone: string | null;
  has_id_document: boolean;
  has_proof_of_income: boolean;
  justification: string | null;
  message: string | null;
  status: ApplicantStatus;
  agency_id: string;
  created_at: string;
  visitor_nif: string | null;
  visitor_date_of_birth: string | null;
  income_records: IncomeRecord[] | null;
  updated_at: string;
  resolved_at: string | null;
}

export interface ApplicantInsert {
  id?: string;
  property_id: string;
  property_title: string;
  property_price?: number | null;
  property_address?: string | null;
  visitor_name: string;
  visitor_email: string;
  visitor_phone?: string | null;
  has_id_document?: boolean;
  has_proof_of_income?: boolean;
  justification?: string | null;
  message?: string | null;
  status?: ApplicantStatus;
  agency_id: string;
  created_at?: string;
  visitor_nif?: string | null;
  visitor_date_of_birth?: string | null;
  income_records?: IncomeRecord[] | null;
  updated_at?: string;
  resolved_at?: string | null;
}

export interface ApplicantUpdate {
  id?: string;
  property_id?: string;
  property_title?: string;
  property_price?: number | null;
  property_address?: string | null;
  visitor_name?: string;
  visitor_email?: string;
  visitor_phone?: string | null;
  has_id_document?: boolean;
  has_proof_of_income?: boolean;
  justification?: string | null;
  message?: string | null;
  status?: ApplicantStatus;
  agency_id?: string;
  created_at?: string;
  updated_at?: string;
  visitor_nif?: string | null;
  visitor_date_of_birth?: string | null;
  income_records?: IncomeRecord[] | null;
  resolved_at?: string | null;
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

export interface IntakeFormRequestRow {
  id: string;
  agency_id: string;
  applicant_name: string;
  applicant_email: string;
  applicant_phone: string | null;
  property_id: string;
  property_title: string | null;
  property_price: number | null;
  property_address: string | null;
  status: IntakeFormRequestStatus;
  created_at: string;
  updated_at: string;
}

export interface IntakeFormRequestInsert {
  id?: string;
  agency_id: string;
  applicant_name: string;
  applicant_email: string;
  applicant_phone?: string | null;
  property_id: string;
  property_title?: string | null;
  property_price?: number | null;
  property_address?: string | null;
  status?: IntakeFormRequestStatus;
  created_at?: string;
  updated_at?: string;
}

export interface Database {
  public: {
    Tables: {
      agendamentos: {
        Row: ApplicantRow;
        Insert: ApplicantInsert;
        Update: ApplicantUpdate;
        Relationships: [];
      };
};
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: {
      agendamento_status: ApplicantStatus;
    };
    CompositeTypes: Record<string, never>;
  };
}
