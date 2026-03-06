export type AgendamentoStatus = "pending" | "approved" | "rejected";

export interface AgendamentoRow {
  id: string;
  property_id: string;
  property_title: string;
  visitor_name: string;
  visitor_email: string;
  visitor_phone: string | null;
  has_id_document: boolean;
  has_proof_of_income: boolean;
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
  visitor_name: string;
  visitor_email: string;
  visitor_phone?: string | null;
  has_id_document?: boolean;
  has_proof_of_income?: boolean;
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
  visitor_name?: string;
  visitor_email?: string;
  visitor_phone?: string | null;
  has_id_document?: boolean;
  has_proof_of_income?: boolean;
  message?: string | null;
  status?: AgendamentoStatus;
  agency_id?: string;
  created_at?: string;
  updated_at?: string;
  resolved_at?: string | null;
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
