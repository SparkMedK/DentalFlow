"use client";

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Patient, Consultation } from '@/lib/types';
import { useToast } from "@/hooks/use-toast"
import { db } from "@/lib/firebase";
import { 
  collection, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  writeBatch, 
  query, 
  where 
} from "firebase/firestore";

interface AppContextType {
  patients: Patient[];
  consultations: Consultation[];
  isLoading: boolean;
  addPatient: (patient: Omit<Patient, 'id'>) => Promise<void>;
  updatePatient: (patient: Patient) => Promise<void>;
  deletePatient: (patientId: string) => Promise<void>;
  addConsultation: (consultation: Omit<Consultation, 'id'>) => Promise<void>;
  updateConsultation: (consultation: Consultation) => Promise<void>;
  deleteConsultation: (consultationId: string) => Promise<void>;
  getPatientById: (patientId: string) => Patient | undefined;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    if (!db) {
      toast({
        variant: "destructive",
        title: "Firebase Not Configured",
        description: "Please set up your Firebase credentials in .env.",
      });
      setIsLoading(false);
      return;
    }

    const fetchData = async () => {
      setIsLoading(true);
      try {
        const patientsCollection = collection(db, 'patients');
        const patientsSnapshot = await getDocs(patientsCollection);
        const patientsList = patientsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Patient));
        setPatients(patientsList);

        const consultationsCollection = collection(db, 'consultations');
        const consultationsSnapshot = await getDocs(consultationsCollection);
        const consultationsList = consultationsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Consultation));
        setConsultations(consultationsList);

      } catch (error) {
        console.error("Error fetching data from Firestore:", error);
        toast({
          variant: "destructive",
          title: "Error Fetching Data",
          description: "Could not load data from Firestore. Using local data.",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [toast]);

  const addPatient = async (patient: Omit<Patient, 'id'>) => {
    if (!db) return;
    try {
      const docRef = await addDoc(collection(db, "patients"), patient);
      setPatients(prev => [...prev, { ...patient, id: docRef.id }]);
      toast({ title: "Success", description: "Patient added successfully." });
    } catch (error) {
      console.error("Error adding patient:", error);
      toast({ variant: "destructive", title: "Error", description: "Could not add patient." });
    }
  };

  const updatePatient = async (updatedPatient: Patient) => {
    if (!db) return;
    const { id, ...patientData } = updatedPatient;
    const patientDoc = doc(db, "patients", id);
    try {
      await updateDoc(patientDoc, patientData);
      setPatients(prev => prev.map(p => p.id === id ? updatedPatient : p));
      toast({ title: "Success", description: "Patient updated successfully." });
    } catch (error) {
      console.error("Error updating patient:", error);
      toast({ variant: "destructive", title: "Error", description: "Could not update patient." });
    }
  };

  const deletePatient = async (patientId: string) => {
    if (!db) return;
    try {
      const batch = writeBatch(db);
      const patientDoc = doc(db, "patients", patientId);
      batch.delete(patientDoc);
      
      const q = query(collection(db, "consultations"), where("patientId", "==", patientId));
      const consultationsSnapshot = await getDocs(q);
      consultationsSnapshot.forEach((doc) => batch.delete(doc.ref));
      
      await batch.commit();

      setPatients(prev => prev.filter(p => p.id !== patientId));
      setConsultations(prev => prev.filter(c => c.patientId !== patientId));
      toast({ title: "Success", description: "Patient and associated consultations deleted." });
    } catch (error) {
      console.error("Error deleting patient:", error);
      toast({ variant: "destructive", title: "Error", description: "Could not delete patient." });
    }
  };

  const addConsultation = async (consultation: Omit<Consultation, 'id'>) => {
    if (!db) return;
    try {
      const docRef = await addDoc(collection(db, "consultations"), consultation);
      setConsultations(prev => [...prev, { ...consultation, id: docRef.id }]);
      toast({ title: "Success", description: "Consultation added successfully." });
    } catch (error) {
      console.error("Error adding consultation:", error);
      toast({ variant: "destructive", title: "Error", description: "Could not add consultation." });
    }
  };

  const updateConsultation = async (updatedConsultation: Consultation) => {
    if (!db) return;
    const { id, ...consultationData } = updatedConsultation;
    const consultationDoc = doc(db, "consultations", id);
    try {
      await updateDoc(consultationDoc, consultationData);
      setConsultations(prev => prev.map(c => c.id === id ? updatedConsultation : c));
      toast({ title: "Success", description: "Consultation updated successfully." });
    } catch(error) {
      console.error("Error updating consultation:", error);
      toast({ variant: "destructive", title: "Error", description: "Could not update consultation." });
    }
  };

  const deleteConsultation = async (consultationId: string) => {
    if (!db) return;
    const consultationDoc = doc(db, "consultations", consultationId);
    try {
      await deleteDoc(consultationDoc);
      setConsultations(prev => prev.filter(c => c.id !== consultationId));
      toast({ title: "Success", description: "Consultation deleted." });
    } catch (error) {
      console.error("Error deleting consultation:", error);
      toast({ variant: "destructive", title: "Error", description: "Could not delete consultation." });
    }
  };
  
  const getPatientById = (patientId: string) => {
    return patients.find(p => p.id === patientId);
  }

  return (
    <AppContext.Provider value={{ 
      patients, 
      consultations, 
      isLoading,
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
