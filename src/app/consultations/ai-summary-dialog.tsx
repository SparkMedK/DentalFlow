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
import { Textarea } from "@/components/ui/textarea";
import { Consultation } from "@/lib/types";
import { useAppContext } from "@/context/app-context";
import React, { useState } from "react";
import { getConsultationSummary } from "@/lib/actions";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { format } from "date-fns";

interface AiSummaryDialogProps {
  consultation: Consultation;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AiSummaryDialog({
  consultation,
  open,
  onOpenChange,
}: AiSummaryDialogProps) {
  const { getPatientById } = useAppContext();
  const { toast } = useToast();
  const [summary, setSummary] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const patient = getPatientById(consultation.patientId);

  const handleGenerateSummary = async () => {
    if (!patient) {
        toast({
            variant: "destructive",
            title: "Error",
            description: "Patient not found for this consultation.",
        });
        return;
    }

    setIsLoading(true);
    setSummary("");
    
    const input = {
        patientName: patient.name,
        consultationNotes: consultation.reason,
        treatmentPlan: consultation.treatmentPlan,
        followUpActions: consultation.followUpActions,
        patientHistory: patient.patientHistory,
        dentalChart: patient.dentalChart,
    };

    const result = await getConsultationSummary(input);
    setIsLoading(false);

    if (result.success && result.summary) {
        setSummary(result.summary);
        toast({ title: "Success", description: "Summary generated successfully." });
    } else {
        toast({
            variant: "destructive",
            title: "Error",
            description: result.error || "Failed to generate summary.",
        });
    }
  };
  
  const handleOpenChange = (isOpen: boolean) => {
    onOpenChange(isOpen);
    if (!isOpen) {
      setSummary("");
      setIsLoading(false);
    }
  }

  if (!patient) return null;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>AI-Powered Consultation Summary</DialogTitle>
          <DialogDescription>
            Generate a summary of the consultation for your records.
          </DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
            <Card>
                <CardHeader>
                    <h3 className="font-semibold">Consultation Details</h3>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                    <p><strong>Patient:</strong> {patient.name}</p>
                    <p><strong>Date:</strong> {format(new Date(consultation.date), "MM/dd/yyyy")} at {consultation.time}</p>
                    <p><strong>Reason:</strong> {consultation.reason}</p>
                    <Separator className="my-2"/>
                    <p><strong>Treatment Plan:</strong> {consultation.treatmentPlan}</p>
                    <p><strong>Follow-up:</strong> {consultation.followUpActions}</p>
                </CardContent>
            </Card>
            <div className="space-y-4">
                <Button onClick={handleGenerateSummary} disabled={isLoading} className="w-full">
                    {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                    Generate Summary
                </Button>
                <Textarea
                    placeholder="AI-generated summary will appear here..."
                    value={summary}
                    readOnly
                    className="min-h-[200px] bg-muted"
                />
            </div>
        </div>
        <DialogFooter>
          <Button type="button" variant="secondary" onClick={() => handleOpenChange(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
