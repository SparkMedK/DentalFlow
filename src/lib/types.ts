export interface Patient {
  id: string;
  name: string;
  email: string;
  phone: string;
  dob: string;
  patientHistory: string;
  dentalChart: string;
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
