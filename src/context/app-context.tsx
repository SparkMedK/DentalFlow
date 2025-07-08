"use client";

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Patient, Consultation } from '@/lib/types';
import { useToast } from "@/hooks/use-toast";
import { db, auth, onAuthStateChanged, signOut, User } from "@/lib/firebase";
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
import { useRouter } from 'next/navigation';

interface AppContextType {
  user: User | null;
  authLoading: boolean;
  signOutUser: () => void;
  patients: Patient[];
  consultations: Consultation[];
  isLoading: boolean;
  addPatient: (patient: Omit<Patient, 'id' | 'createdAt'>) => Promise<void>;
  updatePatient: (patient: Patient) => Promise<void>;
  deletePatient: (patientId: string) => Promise<void>;
  addConsultation: (consultation: Omit<Consultation, 'id'>) => Promise<void>;
  updateConsultation: (consultation: Consultation) => Promise<void>;
  deleteConsultation: (consultationId: string) => Promise<void>;
  getPatientById: (patientId: string) => Patient | undefined;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [dataLoading, setDataLoading] = useState(true);
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    if (!auth) {
        setAuthLoading(false);
        setDataLoading(false);
        return;
    }
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setAuthLoading(false);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!user || !db) {
      if (!authLoading) setDataLoading(false);
      setPatients([]);
      setConsultations([]);
      return;
    }

    const fetchData = async () => {
      setDataLoading(true);
      try {
        const patientsCollection = collection(db, 'patients');
        const patientsSnapshot = await getDocs(patientsCollection);
        const patientsList = patientsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data(), createdAt: doc.data().createdAt?.toDate ? doc.data().createdAt.toDate().toISOString() : new Date().toISOString() } as Patient));
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
          description: "Could not load data from Firestore.",
        });
      } finally {
        setDataLoading(false);
      }
    };

    fetchData();
  }, [user, toast, authLoading]);
  
  const signOutUser = async () => {
    if (!auth) return;
    try {
        await signOut(auth);
        router.push('/login');
    } catch(error) {
        console.error("Error signing out: ", error);
        toast({
            variant: "destructive",
            title: "Error",
            description: "Could not sign out. Please try again.",
        });
    }
  }

  const addPatient = async (patient: Omit<Patient, 'id' | 'createdAt'>) => {
    if (!db || !user) return;
    try {
      const patientWithCreationDate = { ...patient, createdAt: new Date().toISOString() };
      const docRef = await addDoc(collection(db, "patients"), patientWithCreationDate);
      setPatients(prev => [...prev, { ...patientWithCreationDate, id: docRef.id }]);
      toast({ title: "Success", description: "Patient added successfully." });
    } catch (error) {
      console.error("Error adding patient:", error);
      toast({ variant: "destructive", title: "Error", description: "Could not add patient." });
    }
  };

  const updatePatient = async (updatedPatient: Patient) => {
    if (!db || !user) return;
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
    if (!db || !user) return;
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
    if (!db || !user) return;
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
    if (!db || !user) return;
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
    if (!db || !user) return;
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
      user,
      authLoading,
      signOutUser,
      patients, 
      consultations, 
      isLoading: authLoading || dataLoading,
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
