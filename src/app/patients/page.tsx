"use client";

import { Button } from "@/components/ui/button";
import { Loader2, PlusCircle } from "lucide-react";
import { columns } from "./columns";
import { DataTable } from "./data-table";
import { useAppContext } from "@/context/app-context";
import { PatientForm } from "./patient-form";
import { useState, useMemo } from "react";

export default function PatientsPage() {
  const { patients, consultations, isLoading } = useAppContext();
  const [isFormOpen, setIsFormOpen] = useState(false);

  // Augment patient data with last consultation date for sorting
  const augmentedPatients = useMemo(() => {
    if (isLoading) return [];
    return patients.map(patient => {
        const patientConsultations = consultations.filter(c => c.patientId === patient.id);
        if (patientConsultations.length === 0) {
            return { ...patient, lastConsultationDate: null };
        }
        const latestConsultation = patientConsultations.reduce((latest, current) => {
            return new Date(latest.date) > new Date(current.date) ? latest : current;
        });
        return { ...patient, lastConsultationDate: latestConsultation.date };
    });
  }, [patients, consultations, isLoading]);

  if (isLoading) {
    return (
      <div className="flex h-full flex-1 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Patients</h2>
        <div className="flex items-center space-x-2">
          <PatientForm open={isFormOpen} onOpenChange={setIsFormOpen}>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" /> Add Patient
            </Button>
          </PatientForm>
        </div>
      </div>
      <DataTable data={augmentedPatients} columns={columns} />
    </div>
  );
}
