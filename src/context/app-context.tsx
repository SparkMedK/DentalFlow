"use client";

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Patient, Consultation } from '@/lib/types';
import { mockPatients, mockConsultations } from '@/lib/data';
import { useToast } from "@/hooks/use-toast"

interface AppContextType {
  patients: Patient[];
  consultations: Consultation[];
  addPatient: (patient: Patient) => void;
  updatePatient: (patient: Patient) => void;
  deletePatient: (patientId: string) => void;
  addConsultation: (consultation: Consultation) => void;
  updateConsultation: (consultation: Consultation) => void;
  deleteConsultation: (consultationId: string) => void;
  getPatientById: (patientId: string) => Patient | undefined;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [patients, setPatients] = useState<Patient[]>(mockPatients);
  const [consultations, setConsultations] = useState<Consultation[]>(mockConsultations);
  const { toast } = useToast();

  const addPatient = (patient: Patient) => {
    setPatients(prev => [...prev, { ...patient, id: `pat-${Date.now()}` }]);
    toast({ title: "Success", description: "Patient added successfully." });
  };

  const updatePatient = (updatedPatient: Patient) => {
    setPatients(prev => prev.map(p => p.id === updatedPatient.id ? updatedPatient : p));
     toast({ title: "Success", description: "Patient updated successfully." });
  };

  const deletePatient = (patientId: string) => {
    setPatients(prev => prev.filter(p => p.id !== patientId));
    setConsultations(prev => prev.filter(c => c.patientId !== patientId));
    toast({ title: "Success", description: "Patient and their consultations deleted." });
  };

  const addConsultation = (consultation: Consultation) => {
    setConsultations(prev => [...prev, { ...consultation, id: `con-${Date.now()}` }]);
    toast({ title: "Success", description: "Consultation added successfully." });
  };

  const updateConsultation = (updatedConsultation: Consultation) => {
    setConsultations(prev => prev.map(c => c.id === updatedConsultation.id ? updatedConsultation : c));
    toast({ title: "Success", description: "Consultation updated successfully." });
  };

  const deleteConsultation = (consultationId: string) => {
    setConsultations(prev => prev.filter(c => c.id !== consultationId));
    toast({ title: "Success", description: "Consultation deleted." });
  };
  
  const getPatientById = (patientId: string) => {
    return patients.find(p => p.id === patientId);
  }

  return (
    <AppContext.Provider value={{ 
      patients, 
      consultations, 
      addPatient, 
      updatePatient, 
      deletePatient,
      addConsultation,
      updateConsultation,
      deleteConsultation,
      getPatientById,
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
