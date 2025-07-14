export interface Patient {
  id: string;
  name: string;
  phone: string;
  dob: string;
  address: string;
  patientHistory: string;
  createdAt: string;
  cin: string;
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
  actCode?: string;
  toothNumber?: string;
}
