
"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Patient } from "@/lib/types";
import { Pencil, Trash2, Stethoscope, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PatientForm } from "./patient-form";
import { PatientDetailDialog } from "./patient-detail-dialog";
import { useState } from "react";
import { useAppContext } from "@/context/app-context";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { format } from "date-fns";
import { ConsultationForm } from "../consultations/consultation-form";

export type PatientWithLastConsultation = Patient & { lastConsultationDate: string | null };

const ActionsCell = ({ patient }: { patient: Patient }) => {
  const { deletePatient } = useAppContext();
  const [isPatientFormOpen, setIsPatientFormOpen] = useState(false);
  const [isConsultationFormOpen, setIsConsultationFormOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const newConsultation = {
      patientId: patient.id,
  };

  return (
    <TooltipProvider>
      <PatientForm
        patient={patient}
        open={isPatientFormOpen}
        onOpenChange={setIsPatientFormOpen}
      />
       <ConsultationForm
        consultation={newConsultation}
        open={isConsultationFormOpen}
        onOpenChange={setIsConsultationFormOpen}
      />
      <PatientDetailDialog
        patient={patient}
        open={isDetailOpen}
        onOpenChange={setIsDetailOpen}
      />
      <AlertDialog>
        <div className="flex items-center gap-1">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" onClick={() => setIsDetailOpen(true)}>
                <Eye className="h-4 w-4" />
                <span className="sr-only">View Patient</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>View Patient</p>
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" onClick={() => setIsPatientFormOpen(true)}>
                <Pencil className="h-4 w-4" />
                <span className="sr-only">Edit Patient</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Edit Patient</p>
            </TooltipContent>
          </Tooltip>
           <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" onClick={() => setIsConsultationFormOpen(true)}>
                <Stethoscope className="h-4 w-4" />
                <span className="sr-only">Add Consultation</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Add Consultation</p>
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <AlertDialogTrigger asChild>
                <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive">
                    <Trash2 className="h-4 w-4" />
                    <span className="sr-only">Delete Patient</span>
                </Button>
            </AlertDialogTrigger>
            <TooltipContent>
              <p>Delete Patient</p>
            </TooltipContent>
          </Tooltip>
        </div>

        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the patient and all associated consultation records.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => deletePatient(patient.id)} className="bg-destructive hover:bg-destructive/90">Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </TooltipProvider>
  );
};

export const columns: ColumnDef<PatientWithLastConsultation>[] = [
  {
    accessorKey: "name",
    header: "Name",
    accessorFn: row => `${row.firstName} ${row.lastName}`,
  },
    {
    accessorKey: "cin",
    header: "CIN",
  },
  {
    accessorKey: "dob",
    header: "Date of Birth",
    cell: ({ row }) => format(new Date(row.original.dob), "MM/dd/yyyy"),
  },
  {
    accessorKey: "phone",
    header: "Phone",
  },
  {
    id: "actions",
    cell: ({ row }) => <ActionsCell patient={row.original} />,
  },
  // Hidden columns for sorting purposes
  {
    accessorKey: "createdAt",
  },
  {
    accessorKey: "lastConsultationDate",
  },
  {
      accessorKey: "address",
  }
];
