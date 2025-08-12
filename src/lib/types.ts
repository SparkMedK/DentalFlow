
export interface SocialSecurity {
  idAssurance: string;
  firstName: string;
  lastName: string;
  address: string;
  codePostal: string;
  typeAssurance: "CNSS" | "CNRPS" | "Convention bilatérale";
}

export interface Patient {
  id: string;
  firstName: string;
  lastName: string;
  phone: string;
  dob: string;
  address: string;
  patientHistory: string;
  createdAt: string;
  socialSecurity?: SocialSecurity;
}

export interface Consultation {
  id: string;
  patientId: string;
  date: string;
  time: string;
  reason: string;
  price: number;
  status: 'Scheduled' | 'Completed' | 'Cancelled';
  treatmentPlan: string;
  followUpActions: string;
  acts?: string[];
}

export interface Act {
  code: string;
  designation: string;
  cotation: string;
  honoraire: number | null;
  notes?: string;
}

export interface ActGroup {
    title: string;
    acts: Act[];
}

export interface ActSection {
    id: string;
    title: string;
    groups: ActGroup[];
}

export interface ActChapter {
    id: string;
    title: string;
    sections: ActSection[];
}

export interface SocialSecurityDocument {
  id: string;
  patient: Patient;
  acts: {
    code: string;
    designation: string;
    cotation: string;
    honoraire: number | null;
    dent: string;
    cps: string;
    date: string;
    sectionTitle: string;
  }[];
  generationDate: string;
  assuranceType: string;
}