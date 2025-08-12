
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
import { Badge } from "@/components/ui/badge";

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
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Patient Details</DialogTitle>
          <DialogDescription>
            Complete information for {patient.firstName} {patient.lastName}.
          </DialogDescription>
        </DialogHeader>
        <div className="max-h-[70vh] overflow-y-auto pr-4 pl-1">
          <div className="space-y-4 py-4 text-sm">
            <h4 className="font-semibold text-base mb-2">Patient Information</h4>
            <div className="space-y-1">
              <p>
                <strong>Name:</strong> {patient.firstName} {patient.lastName}
              </p>
              <p>
                <strong>Phone:</strong> {patient.phone}
              </p>
              <p>
                <strong>Date of Birth:</strong>{" "}
                {format(new Date(patient.dob), "MM/dd/yyyy")}
              </p>
            </div>
            <div className="space-y-1">
              <p className="font-semibold">Address:</p>
              <p className="text-muted-foreground">{patient.address}</p>
            </div>
            <div className="space-y-1">
              <p className="font-semibold">Patient History:</p>
              <p className="text-muted-foreground">{patient.patientHistory}</p>
            </div>
            <div className="space-y-1">
              <p>
                <strong>Patient Added:</strong>{" "}
                {format(new Date(patient.createdAt), "MMMM dd, yyyy")}
              </p>
            </div>

            {patient.socialSecurity && (
              <>
                <Separator className="my-4" />
                <h4 className="font-semibold text-base mb-2">
                  Security Insurance Details
                </h4>
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                     <p>
                        <strong>Insurance ID:</strong> {patient.socialSecurity.idAssurance}
                    </p>
                    <Badge variant="secondary">{patient.socialSecurity.typeAssurance}</Badge>
                  </div>
                  <p>
                    <strong>Full Name:</strong> {patient.socialSecurity.firstName}{" "}
                    {patient.socialSecurity.lastName}
                  </p>
                   <p>
                    <strong>Address:</strong> {patient.socialSecurity.address}
                  </p>
                   <p>
                    <strong>Postal Code:</strong> {patient.socialSecurity.codePostal}
                  </p>
                </div>
              </>
            )}
          </div>
        </div>

        <DialogFooter className="pt-4">
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