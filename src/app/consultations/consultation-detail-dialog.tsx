
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
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { format } from "date-fns";
import type { ConsultationWithPatient } from "./page";

interface ConsultationDetailDialogProps {
  consultation: ConsultationWithPatient;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ConsultationDetailDialog({
  consultation,
  open,
  onOpenChange,
}: ConsultationDetailDialogProps) {
  const patient = consultation.patient;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Consultation Details</DialogTitle>
          <DialogDescription>
            Full details for the consultation on{" "}
            {format(new Date(consultation.date), "MMMM dd, yyyy")}.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4 text-sm">
          <div className="space-y-1">
            <h4 className="font-semibold text-base">Patient Information</h4>
            <p>
              <strong>Name:</strong> {patient ? `${patient.firstName} ${patient.lastName}` : "N/A"}
            </p>
            <p>
              <strong>Phone:</strong> {patient?.phone ?? "N/A"}
            </p>
            <p>
              <strong>Date of Birth:</strong>{" "}
              {patient?.dob
                ? format(new Date(patient.dob), "MM/dd/yyyy")
                : "N/A"}
            </p>
          </div>
          <Separator />
          <div className="space-y-1">
            <h4 className="font-semibold text-base">Consultation Information</h4>
            <div className="flex justify-between items-start">
              <div>
                <p>
                  <strong>Date:</strong>{" "}
                  {format(new Date(consultation.date), "MM/dd/yyyy")}
                </p>
                <p>
                  <strong>Time:</strong> {consultation.time}
                </p>
              </div>
              <Badge
                className={
                  consultation.status === "Completed"
                    ? "bg-green-600 hover:bg-green-700"
                    : consultation.status === "Scheduled"
                    ? "bg-secondary"
                    : "bg-destructive"
                }
              >
                {consultation.status}
              </Badge>
            </div>
            <p>
                <strong>Price:</strong> {formatCurrency(consultation.price)}
            </p>
          </div>
          <Separator />
          <div className="space-y-1">
            <p className="font-semibold">Reason for Visit:</p>
            <p className="text-muted-foreground">{consultation.reason}</p>
          </div>
          <div className="space-y-1">
            <p className="font-semibold">Treatment Plan:</p>
            <p className="text-muted-foreground">
              {consultation.treatmentPlan}
            </p>
          </div>
          <div className="space-y-1">
            <p className="font-semibold">Follow-up Actions:</p>
            <p className="text-muted-foreground">
              {consultation.followUpActions}
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
