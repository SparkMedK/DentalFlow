"use client";

import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, PlusCircle } from "lucide-react";
import { columns } from "./columns";
import { DataTable } from "./data-table";
import { useAppContext } from "@/context/app-context";
import { ConsultationForm } from "./consultation-form";
import type { Consultation, Patient } from "@/lib/types";

export type ConsultationWithPatient = Consultation & { patient?: Patient };

export default function ConsultationsPage() {
  const { consultations, patients, isLoading } = useAppContext();
  const [isFormOpen, setIsFormOpen] = useState(false);

  const augmentedConsultations: ConsultationWithPatient[] = useMemo(() => {
    if (isLoading) return [];
    return consultations.map(consultation => {
        const patient = patients.find(p => p.id === consultation.patientId);
        return { ...consultation, patient };
    });
  }, [consultations, patients, isLoading]);

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
        <h2 className="text-3xl font-bold tracking-tight">Consultations</h2>
        <div className="flex items-center space-x-2">
          <ConsultationForm open={isFormOpen} onOpenChange={setIsFormOpen}>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" /> Add Consultation
            </Button>
          </ConsultationForm>
        </div>
      </div>
      <DataTable data={augmentedConsultations} columns={columns} />
    </div>
  );
}
