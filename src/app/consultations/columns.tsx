"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Consultation } from "@/lib/types";
import { MoreHorizontal, ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
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

const ActionsCell = ({ consultation }: { consultation: Consultation }) => {
  const { deleteConsultation } = useAppContext();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isSummaryOpen, setIsSummaryOpen] = useState(false);

  return (
    <>
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
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => setIsSummaryOpen(true)}>
              AI Summary
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setIsFormOpen(true)}>
              Edit
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <AlertDialogTrigger asChild>
                <DropdownMenuItem className="text-destructive focus:text-destructive focus:bg-destructive/10">Delete</DropdownMenuItem>
            </AlertDialogTrigger>
          </DropdownMenuContent>
        </DropdownMenu>

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
    </>
  );
};

export const columns: ColumnDef<Consultation>[] = [
  {
    accessorKey: "patientId",
    header: "Patient",
    cell: ({ row }) => {
      const { getPatientById } = useAppContext();
      const patient = getPatientById(row.original.patientId);
      return patient ? patient.name : "Unknown";
    },
  },
  {
    accessorKey: "date",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Date
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => new Date(row.original.date).toLocaleDateString(),
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
