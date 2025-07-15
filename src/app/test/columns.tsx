"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Patient, Consultation } from "@/lib/types";
import { Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { format } from "date-fns";

export type AssuranceRecord = {
  id: string;
  patient: Patient;
  consultation: Consultation;
  generationDate: string;
  assuranceType: string;
};

const ActionsCell = ({
  record,
  onShow,
}: {
  record: AssuranceRecord;
  onShow: (record: AssuranceRecord) => void;
}) => {
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
      </div>
    </TooltipProvider>
  );
};

export const columns = ({
  onShow,
}: {
  onShow: (record: AssuranceRecord) => void;
}): ColumnDef<AssuranceRecord>[] => [
  {
    accessorKey: "patient.name",
    header: "Patient Name",
    cell: ({ row }) => row.original.patient.name,
  },
  {
    accessorKey: "consultation.date",
    header: "Consultation Date",
    cell: ({ row }) =>
      format(new Date(row.original.consultation.date), "MM/dd/yyyy"),
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
