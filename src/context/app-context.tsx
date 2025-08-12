
"use client";

import React, { createContext, useContext, useState, ReactNode, useEffect, useCallback } from 'react';
import { Patient, Consultation, ActChapter, Act, ActSection, ActGroup, SocialSecurityDocument } from '@/lib/types';
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
  where,
  runTransaction
} from "firebase/firestore";
import { useRouter } from 'next/navigation';

interface AppContextType {
  user: User | null;
  authLoading: boolean;
  signOutUser: () => void;
  patients: Patient[];
  consultations: Consultation[];
  actChapters: ActChapter[];
  socialSecurityDocuments: SocialSecurityDocument[];
  isLoading: boolean;
  addPatient: (patient: Omit<Patient, 'id' | 'createdAt'>) => Promise<void>;
  updatePatient: (patient: Patient) => Promise<void>;
  deletePatient: (patientId: string) => Promise<void>;
  addConsultation: (consultation: Omit<Consultation, 'id'>) => Promise<void>;
  updateConsultation: (consultation: Consultation) => Promise<void>;
  deleteConsultation: (consultationId: string) => Promise<void>;
  getPatientById: (patientId: string) => Patient | undefined;
  addAct: (chapterId: string, sectionId: string, groupTitle: string, act: Omit<Act, 'id'>) => Promise<void>;
  updateAct: (chapterId: string, sectionId: string, groupTitle: string, act: Act) => Promise<void>;
  deleteAct: (chapterId: string, sectionId: string, groupTitle: string, actCode: string) => Promise<void>;
  addSocialSecurityDocument: (doc: Omit<SocialSecurityDocument, 'id'>) => Promise<void>;
  deleteSocialSecurityDocument: (docId: string) => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [actChapters, setActChapters] = useState<ActChapter[]>([]);
  const [socialSecurityDocuments, setSocialSecurityDocuments] = useState<SocialSecurityDocument[]>([]);
  const [dataLoading, setDataLoading] = useState(true);
  const { toast } = useToast();
  const router = useRouter();

  const fetchActData = useCallback(async () => {
    if (!db) return;
    try {
        const chaptersCollection = collection(db, 'actChapters');
        const chaptersSnapshot = await getDocs(chaptersCollection);
        
        const chaptersListPromises = chaptersSnapshot.docs.map(async (chapterDoc) => {
            const sectionsCollection = collection(db, 'actChapters', chapterDoc.id, 'sections');
            const sectionsSnapshot = await getDocs(sectionsCollection);
            
            const sectionsListPromises = sectionsSnapshot.docs.map(async (sectionDoc) => {
                const groupsCollection = collection(db, 'actChapters', chapterDoc.id, 'sections', sectionDoc.id, 'groups');
                const groupsSnapshot = await getDocs(groupsCollection);
                
                const groupsList = groupsSnapshot.docs.map(groupDoc => {
                    const groupData = groupDoc.data();
                    return {
                        title: groupData.title,
                        acts: groupData.acts || []
                    } as ActGroup;
                });

                return {
                    id: sectionDoc.id,
                    title: sectionDoc.data().title,
                    groups: groupsList,
                } as ActSection;
            });

            const sectionsList = await Promise.all(sectionsListPromises);

            return {
                id: chapterDoc.id,
                title: chapterDoc.data().title,
                sections: sectionsList,
            } as ActChapter;
        });

        const chaptersList = await Promise.all(chaptersListPromises);
        setActChapters(chaptersList);
    } catch (error) {
        console.error("Error fetching act data:", error);
        toast({
          variant: "destructive",
          title: "Error Fetching Acts",
          description: "Could not load medical acts data.",
        });
    }
  }, [toast]);

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
      setActChapters([]);
      setSocialSecurityDocuments([]);
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

        const ssDocsCollection = collection(db, 'socialSecurityDocuments');
        const ssDocsSnapshot = await getDocs(ssDocsCollection);
        const ssDocsList = ssDocsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as SocialSecurityDocument));
        setSocialSecurityDocuments(ssDocsList);

        await fetchActData();

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
  }, [user, toast, authLoading, fetchActData]);
  
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

  const runActTransaction = async (chapterId: string, sectionId: string, groupTitle: string, updateLogic: (group: ActGroup) => ActGroup | null) => {
    if (!db) throw new Error("Database not initialized");

    const groupsQuery = query(
        collection(db, `actChapters/${chapterId}/sections/${sectionId}/groups`),
        where("title", "==", groupTitle)
    );

    try {
        await runTransaction(db, async (transaction) => {
            const groupSnapshot = await getDocs(groupsQuery);
            if (groupSnapshot.empty) {
                // If group doesn't exist for an "add" operation, create it.
                const newGroupRef = doc(collection(db, `actChapters/${chapterId}/sections/${sectionId}/groups`));
                const newGroupData = { title: groupTitle, acts: [] };
                const updatedGroup = updateLogic(newGroupData);
                if (updatedGroup) {
                    transaction.set(newGroupRef, updatedGroup);
                }
                return;
            }

            const groupDoc = groupSnapshot.docs[0];
            const groupRef = groupDoc.ref;
            const groupData = groupDoc.data() as ActGroup;
            const updatedGroup = updateLogic(groupData);

            if (updatedGroup) {
                transaction.update(groupRef, { acts: updatedGroup.acts });
            } else {
                // If updateLogic returns null, it means delete the group if empty
                if(groupData.acts.length === 1) { // Deleting the last act
                    transaction.delete(groupRef);
                }
            }
        });
        await fetchActData(); // Refresh data from Firestore
    } catch (error) {
        console.error("Transaction failed: ", error);
        throw error;
    }
  };

  const addAct = async (chapterId: string, sectionId: string, groupTitle: string, act: Act) => {
    try {
        await runActTransaction(chapterId, sectionId, groupTitle, (group) => {
            const newActs = [...group.acts, act];
            return { ...group, acts: newActs };
        });
        toast({ title: "Success", description: "Medical act added successfully." });
    } catch (e) {
        toast({ variant: "destructive", title: "Error", description: "Could not add medical act." });
    }
  };

  const updateAct = async (chapterId: string, sectionId: string, groupTitle: string, updatedAct: Act) => {
     try {
        await runActTransaction(chapterId, sectionId, groupTitle, (group) => {
            const actIndex = group.acts.findIndex(a => a.code === updatedAct.code);
            if (actIndex === -1) throw new Error("Act not found");
            const newActs = [...group.acts];
            newActs[actIndex] = updatedAct;
            return { ...group, acts: newActs };
        });
        toast({ title: "Success", description: "Medical act updated successfully." });
    } catch (e) {
        toast({ variant: "destructive", title: "Error", description: "Could not update medical act." });
    }
  };

  const deleteAct = async (chapterId: string, sectionId: string, groupTitle: string, actCode: string) => {
     try {
        await runActTransaction(chapterId, sectionId, groupTitle, (group) => {
            const newActs = group.acts.filter(a => a.code !== actCode);
            if (newActs.length === 0) {
              return null; // Signal to delete the group if it becomes empty
            }
            return { ...group, acts: newActs };
        });
        toast({ title: "Success", description: "Medical act deleted successfully." });
    } catch (e) {
        toast({ variant: "destructive", title: "Error", description: "Could not delete medical act." });
    }
  };

  const addSocialSecurityDocument = async (docData: Omit<SocialSecurityDocument, 'id'>) => {
    if (!db || !user) return;
    try {
      const docRef = await addDoc(collection(db, "socialSecurityDocuments"), docData);
      setSocialSecurityDocuments(prev => [...prev, { ...docData, id: docRef.id }]);
      toast({ title: "Success", description: "Social security document created." });
    } catch (error) {
      console.error("Error adding social security document:", error);
      toast({ variant: "destructive", title: "Error", description: "Could not create document." });
    }
  };

  const deleteSocialSecurityDocument = async (docId: string) => {
    if (!db || !user) return;
    const ssDocRef = doc(db, "socialSecurityDocuments", docId);
    try {
      await deleteDoc(ssDocRef);
      setSocialSecurityDocuments(prev => prev.filter(d => d.id !== docId));
      toast({ title: "Success", description: "Social security document deleted." });
    } catch (error) {
      console.error("Error deleting social security document:", error);
      toast({ variant: "destructive", title: "Error", description: "Could not delete document." });
    }
  };

  return (
    <AppContext.Provider value={{ 
      user,
      authLoading,
      signOutUser,
      patients, 
      consultations, 
      actChapters,
      socialSecurityDocuments,
      isLoading: authLoading || dataLoading,
      addPatient, 
      updatePatient, 
      deletePatient,
      addConsultation,
      updateConsultation,
      deleteConsultation,
      getPatientById,
      addAct,
      updateAct,
      deleteAct,
      addSocialSecurityDocument,
      deleteSocialSecurityDocument,
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
