"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Patient } from "@/lib/types";
import { format } from "date-fns";

interface PatientDetailDialogProps {
  patient: Patient;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function PatientDetailDialog({
  patient,
  open,
  onOpenChange,
}: PatientDetailDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Patient Details</DialogTitle>
          <DialogDescription>
            Complete information for {patient.name}.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4 text-sm">
          <div className="space-y-1">
            <p>
              <strong>Name:</strong> {patient.name}
            </p>
            <p>
              <strong>Phone:</strong> {patient.phone}
            </p>
            <p>
              <strong>Date of Birth:</strong>{" "}
              {format(new Date(patient.dob), "MM/dd/yyyy")}
            </p>
          </div>
          <Separator />
          <div className="space-y-1">
            <p className="font-semibold">Address:</p>
            <p className="text-muted-foreground">{patient.address}</p>
          </div>
          <Separator />
          <div className="space-y-1">
            <p className="font-semibold">Patient History:</p>
            <p className="text-muted-foreground">{patient.patientHistory}</p>
          </div>
           <Separator />
           <div className="space-y-1">
            <p>
                <strong>Patient Added:</strong>{" "}
                {format(new Date(patient.createdAt), "MMMM dd, yyyy")}
            </p>
           </div>
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="secondary"
            onClick={() => onOpenChange(false)}
          >
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
