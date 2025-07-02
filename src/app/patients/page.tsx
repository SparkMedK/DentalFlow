"use client";

import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { columns } from "./columns";
import { DataTable } from "./data-table";
import { useAppContext } from "@/context/app-context";
import { PatientForm } from "./patient-form";
import { useState } from "react";

export default function PatientsPage() {
  const { patients } = useAppContext();
  const [isFormOpen, setIsFormOpen] = useState(false);

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
      <DataTable data={patients} columns={columns} />
    </div>
  );
}
