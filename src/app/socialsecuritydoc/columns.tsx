
"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Patient, Act, SocialSecurityDocument } from "@/lib/types";
import { Eye, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { format } from "date-fns";
import { SelectedAssuranceAct } from "./page";
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


const ActionsCell = ({
  record,
  onShow,
}: {
  record: SocialSecurityDocument;
  onShow: (record: SocialSecurityDocument) => void;
}) => {
  const { deleteSocialSecurityDocument } = useAppContext();
  return (
    <TooltipProvider>
      <div className="flex items-center gap-1">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onShow(record)}              
            >
              <Eye className="h-4 w-4" />
              <span className="sr-only">Show PDF</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Show PDF</p>
          </TooltipContent>
        </Tooltip>
        <AlertDialog>
          <Tooltip>
            <TooltipTrigger asChild>
              <AlertDialogTrigger asChild>
                  <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive">
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">Delete Document</span>
                  </Button>
              </AlertDialogTrigger>
            </TooltipTrigger>
            <TooltipContent>
              <p>Delete Document</p>
            </TooltipContent>
          </Tooltip>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the social security document.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={() => deleteSocialSecurityDocument(record.id)} className="bg-destructive hover:bg-destructive/90">Delete</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </TooltipProvider>
  );
};

export const columns = ({
  onShow,
}: {
  onShow: (record: SocialSecurityDocument) => void;
}): ColumnDef<SocialSecurityDocument>[] => [
  {
    accessorKey: "patient.name",
    header: "Patient Name",
    cell: ({ row }) => `${row.original.patient.firstName} ${row.original.patient.lastName}`,
  },
  {
    header: "Acts Performed",
    cell: ({ row }) => row.original.acts.length,
  },
  {
    accessorKey: "generationDate",
    header: "Date of Generation",
    cell: ({ row }) =>
      format(new Date(row.original.generationDate), "MM/dd/yyyy HH:mm"),
  },
  {
    accessorKey: "assuranceType",
    header: "Assurance Type",
  },
  {
    id: "actions",
    cell: ({ row }) => <ActionsCell record={row.original} onShow={onShow} />,
  },
];
