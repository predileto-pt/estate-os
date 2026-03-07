export type AgendamentoStatus = "pending" | "approved" | "rejected";

export interface AgendamentoRow {
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
  status: AgendamentoStatus;
  agency_id: string;
  created_at: string;
  updated_at: string;
  resolved_at: string | null;
}

export interface AgendamentoInsert {
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
  status?: AgendamentoStatus;
  agency_id: string;
  created_at?: string;
  updated_at?: string;
  resolved_at?: string | null;
}

export interface AgendamentoUpdate {
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
  status?: AgendamentoStatus;
  agency_id?: string;
  created_at?: string;
  updated_at?: string;
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

export interface Database {
  public: {
    Tables: {
      agendamentos: {
        Row: AgendamentoRow;
        Insert: AgendamentoInsert;
        Update: AgendamentoUpdate;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: {
      agendamento_status: AgendamentoStatus;
    };
    CompositeTypes: Record<string, never>;
  };
}
