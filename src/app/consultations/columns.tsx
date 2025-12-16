
"use client";

import { ColumnDef, FilterFn } from "@tanstack/react-table";
import { Consultation, Patient } from "@/lib/types";
import { Pencil, Trash2, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAppContext } from "@/context/app-context";
import { useState } from "react";
import { ConsultationForm } from "./consultation-form";
import { ConsultationDetailDialog } from "./consultation-detail-dialog";
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
import { type DateRange } from "react-day-picker";
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
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  return (
    <TooltipProvider>
      <ConsultationForm
        consultation={consultation}
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
      />
      <ConsultationDetailDialog
        consultation={consultation}
        open={isDetailOpen}
        onOpenChange={setIsDetailOpen}
      />
      <AlertDialog>
        <div className="flex items-center gap-1">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" onClick={() => setIsDetailOpen(true)}>
                <Eye className="h-4 w-4" />
                <span className="sr-only">View Details</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>View Details</p>
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

const dateFilterFn: FilterFn<any> = (row, columnId, value) => {
  const date = new Date(row.getValue(columnId));
  const range = value as DateRange | undefined;

  if (!range?.from) {
    return true;
  }

  date.setHours(0, 0, 0, 0);

  const fromDate = new Date(range.from);
  fromDate.setHours(0, 0, 0, 0);

  if (!range.to) {
    return date.getTime() === fromDate.getTime();
  }

  const toDate = new Date(range.to);
  toDate.setHours(0, 0, 0, 0);

  return date.getTime() >= fromDate.getTime() && date.getTime() <= toDate.getTime();
};

export const columns: ColumnDef<ConsultationWithPatient>[] = [
  {
    id: "patientInfo",
    header: "Patient",
    cell: ({ row }) => row.original.patient ? `${row.original.patient.firstName} ${row.original.patient.lastName}` : "Unknown",
    accessorFn: (row) =>
      row.patient ? `${row.patient.firstName} ${row.patient.lastName} ${row.patient.phone} ${row.patient.dob}` : "",
  },
  {
    accessorKey: "date",
    header: "Date",
    cell: ({ row }) => format(new Date(row.original.date), "MM/dd/yyyy"),
    filterFn: dateFilterFn,
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

      if (status === "Completed") {
        return <Badge className="bg-green-600 hover:bg-green-700">{status}</Badge>
      }
      if (status === "Scheduled") {
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
