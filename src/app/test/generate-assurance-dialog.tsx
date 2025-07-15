"use client";

import * as React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useAppContext } from "@/context/app-context";
import type { Patient, Consultation } from "@/lib/types";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

interface GenerateAssuranceDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onComplete: (patient: Patient, consultation: Consultation) => void;
}

export function GenerateAssuranceDialog({ open, onOpenChange, onComplete }: GenerateAssuranceDialogProps) {
    const { patients, consultations, isLoading } = useAppContext();
    const [step, setStep] = React.useState(1);
    const [selectedPatientId, setSelectedPatientId] = React.useState<string | null>(null);
    const [selectedConsultationId, setSelectedConsultationId] = React.useState<string | null>(null);
    const [isPatientPopoverOpen, setIsPatientPopoverOpen] = React.useState(false);

    React.useEffect(() => {
        if (open) {
            setStep(1);
            setSelectedPatientId(null);
            setSelectedConsultationId(null);
        }
    }, [open]);

    const handlePatientSelect = (patientId: string) => {
        setSelectedPatientId(patientId);
        setIsPatientPopoverOpen(false);
        setStep(2);
    };
    
    const handleComplete = () => {
        const patient = patients.find(p => p.id === selectedPatientId);
        const consultation = consultations.find(c => c.id === selectedConsultationId);
        if (patient && consultation) {
            onComplete(patient, consultation);
        }
    };

    const patientOptions = React.useMemo(() => patients.map(p => ({
        value: p.id,
        label: p.name
    })), [patients]);

    const availableConsultations = React.useMemo(() => {
        return consultations.filter(c => c.patientId === selectedPatientId);
    }, [consultations, selectedPatientId]);

    const selectedPatient = patients.find(p => p.id === selectedPatientId);

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-xl">
                <DialogHeader>
                    <DialogTitle>Generate Assurance Form</DialogTitle>
                    <DialogDescription>
                        {step === 1 ? "Select a patient to begin." : "Select a consultation for the chosen patient."}
                    </DialogDescription>
                </DialogHeader>

                <div className="py-4 space-y-6">
                    {/* Step 1: Patient Selection */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Step 1: Patient</label>
                         <Popover open={isPatientPopoverOpen} onOpenChange={setIsPatientPopoverOpen}>
                            <PopoverTrigger asChild>
                                <Button
                                variant="outline"
                                role="combobox"
                                aria-expanded={isPatientPopoverOpen}
                                className="w-full justify-between font-normal"
                                >
                                {selectedPatientId
                                    ? patientOptions.find((p) => p.value === selectedPatientId)?.label
                                    : "Select a patient..."}
                                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                                <Command>
                                    <CommandInput placeholder="Search patient..." />
                                    <CommandList>
                                        <CommandEmpty>No patient found.</CommandEmpty>
                                        <CommandGroup>
                                        {patientOptions.map((option) => (
                                            <CommandItem
                                            key={option.value}
                                            value={option.label}
                                            onSelect={() => handlePatientSelect(option.value)}
                                            >
                                            <Check
                                                className={cn(
                                                "mr-2 h-4 w-4",
                                                selectedPatientId === option.value ? "opacity-100" : "opacity-0"
                                                )}
                                            />
                                            {option.label}
                                            </CommandItem>
                                        ))}
                                        </CommandGroup>
                                    </CommandList>
                                </Command>
                            </PopoverContent>
                        </Popover>
                    </div>

                    {/* Step 2: Consultation Selection */}
                    {step === 2 && selectedPatient && (
                         <div className="space-y-2">
                            <label className="text-sm font-medium">Step 2: Consultation for {selectedPatient.name}</label>
                            {availableConsultations.length > 0 ? (
                                <ScrollArea className="h-48 rounded-md border p-2">
                                     <div className="space-y-2">
                                        {availableConsultations.map(consultation => (
                                            <button
                                                key={consultation.id}
                                                onClick={() => setSelectedConsultationId(consultation.id)}
                                                className={cn(
                                                    "w-full text-left p-2 rounded-md border text-sm flex justify-between items-center",
                                                    selectedConsultationId === consultation.id 
                                                        ? "bg-primary text-primary-foreground border-primary" 
                                                        : "hover:bg-muted"
                                                )}
                                            >
                                               <div>
                                                    <p className="font-semibold">{format(new Date(consultation.date), "MMMM dd, yyyy")} - {consultation.time}</p>
                                                    <p className="text-xs text-muted-foreground">{consultation.reason}</p>
                                               </div>
                                               <Check className={cn("h-4 w-4", selectedConsultationId === consultation.id ? "opacity-100" : "opacity-0")} />
                                            </button>
                                        ))}
                                    </div>
                                </ScrollArea>
                            ) : (
                                <div className="text-sm text-center text-muted-foreground p-4 border rounded-md">
                                    No consultations found for this patient.
                                </div>
                            )}
                        </div>
                    )}
                </div>

                <DialogFooter>
                    <Button variant="ghost" onClick={() => onOpenChange(false)}>Cancel</Button>
                    <Button 
                        onClick={handleComplete}
                        disabled={!selectedPatientId || !selectedConsultationId}
                    >
                        Generate
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
