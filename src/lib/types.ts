
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
  name: string;
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
}
