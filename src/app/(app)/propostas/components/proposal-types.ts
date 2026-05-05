export interface ProposalEvent {
  id: string;
  type: "created" | "owner_signed" | "applicant_signed" | "signature_requested" | "expired" | "cancelled";
  actor: string;
  timestamp: string;
}

export interface Proposal {
  id: string;
  status: "pending" | "partially_signed" | "signed" | "expired" | "cancelled";
  property: {
    title: string;
    address: string;
    type: string;
    value: number;
    monthlyRent: number | null;
  };
  owner: {
    name: string;
    email: string;
    phone: string;
    nif: string;
    signed: boolean;
  };
  applicant: {
    name: string;
    email: string;
    phone: string;
    signed: boolean;
  };
  contract: {
    id: string;
    type: string;
    signed: boolean;
  };
  events: ProposalEvent[];
  createdAt: string;
}
