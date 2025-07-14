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
import { useReactToPrint } from "react-to-print";
import { useRef } from "react";
import type { ConsultationWithPatient } from "./page";
import { CnamForm } from "./cnam-form";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Printer } from "lucide-react";

interface CnamFormDialogProps {
  consultation: ConsultationWithPatient;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CnamFormDialog({
  consultation,
  open,
  onOpenChange,
}: CnamFormDialogProps) {
  const componentRef = useRef<HTMLDivElement>(null);
  
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: `CNAM_Form_${consultation.patient?.name?.replace(/\s/g, '_')}_${consultation.date}`,
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl w-[95%] max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>CNAM Reimbursement Form</DialogTitle>
          <DialogDescription>
            Preview of the form for {consultation.patient?.name}. Click "Print" to generate the PDF.
          </DialogDescription>
        </DialogHeader>
        <div className="flex-1 min-h-0">
          <ScrollArea className="h-full bg-gray-300 p-4 rounded-md">
            <div className="scale-[0.9] origin-top">
                <CnamForm ref={componentRef} consultation={consultation} />
            </div>
          </ScrollArea>
        </div>
        <DialogFooter className="pt-4">
            <Button variant="ghost" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button onClick={handlePrint}>
                <Printer className="mr-2 h-4 w-4" />
                Print
            </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
