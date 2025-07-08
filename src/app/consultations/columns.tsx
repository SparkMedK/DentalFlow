"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Consultation, Patient } from "@/lib/types";
import { Pencil, Sparkles, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAppContext } from "@/context/app-context";
import { useState } from "react";
import { ConsultationForm } from "./consultation-form";
import { AiSummaryDialog } from "./ai-summary-dialog";
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
} from "@/components/ui/alert-dialog"
import { format } from "date-fns";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { ConsultationWithPatient } from "./page";


const ActionsCell = ({ consultation }: { consultation: ConsultationWithPatient }) => {
  const { deleteConsultation } = useAppContext();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isSummaryOpen, setIsSummaryOpen] = useState(false);

  return (
    <TooltipProvider>
      <ConsultationForm
        consultation={consultation}
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
      />
      <AiSummaryDialog
        consultation={consultation}
        open={isSummaryOpen}
        onOpenChange={setIsSummaryOpen}
      />
      <AlertDialog>
        <div className="flex items-center gap-1">
            <Tooltip>
                <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" onClick={() => setIsSummaryOpen(true)}>
                        <Sparkles className="h-4 w-4" />
                        <span className="sr-only">AI Summary</span>
                    </Button>
                </TooltipTrigger>
                <TooltipContent>
                    <p>AI Summary</p>
                </TooltipContent>
            </Tooltip>

            <Tooltip>
                <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" onClick={() => setIsFormOpen(true)}>
                        <Pencil className="h-4 w-4" />
                        <span className="sr-only">Edit Consultation</span>
                    </Button>
                </TooltipTrigger>
                <TooltipContent>
                    <p>Edit Consultation</p>
                </TooltipContent>
            </Tooltip>
            
            <Tooltip>
                <AlertDialogTrigger asChild>
                    <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive">
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Delete Consultation</span>
                    </Button>
                </AlertDialogTrigger>
                <TooltipContent>
                    <p>Delete Consultation</p>
                </TooltipContent>
            </Tooltip>
        </div>

        <AlertDialogContent>
            <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the consultation record.
                </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={() => deleteConsultation(consultation.id)} className="bg-destructive hover:bg-destructive/90">Delete</AlertDialogAction>
            </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </TooltipProvider>
  );
};

export const columns: ColumnDef<ConsultationWithPatient>[] = [
  {
    id: "patientInfo",
    header: "Patient",
    cell: ({ row }) => row.original.patient?.name ?? "Unknown",
    accessorFn: (row) =>
      `${row.patient?.name} ${row.patient?.phone} ${row.patient?.dob}`,
  },
  {
    accessorKey: "date",
    header: "Date",
    cell: ({ row }) => format(new Date(row.original.date), "MM/dd/yyyy"),
  },
  {
    accessorKey: "time",
    header: "Time",
  },
  {
    accessorKey: "reason",
    header: "Reason",
  },
  {
    accessorKey: "price",
    header: "Price",
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("price"));
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(amount);
      return <div className="font-medium">{formatted}</div>;
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.status;
      const variant: "default" | "secondary" | "destructive" =
        status === "Completed"
          ? "default"
          : status === "Scheduled"
          ? "secondary"
          : "destructive";

      if(status === "Completed") {
        return <Badge className="bg-green-600 hover:bg-green-700">{status}</Badge>
      }
      if(status === "Scheduled") {
        return <Badge variant="secondary">{status}</Badge>
      }
      return <Badge variant={variant}>{status}</Badge>;
    },
  },
  {
    id: "actions",
    cell: ({ row }) => <ActionsCell consultation={row.original} />,
  },
];
