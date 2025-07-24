
"use client";

import * as React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useAppContext } from "@/context/app-context";
import type { Patient, Act } from "@/lib/types";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { SelectedAssuranceAct } from "./page";


interface GenerateAssuranceDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onComplete: (patient: Patient, acts: SelectedAssuranceAct[]) => void;
}

export function GenerateAssuranceDialog({ open, onOpenChange, onComplete }: GenerateAssuranceDialogProps) {
    const { patients, actChapters, isLoading } = useAppContext();
    const [step, setStep] = React.useState(1);
    
    // Step 1 state
    const [selectedPatientId, setSelectedPatientId] = React.useState<string | null>(null);
    const [isPatientPopoverOpen, setIsPatientPopoverOpen] = React.useState(false);

    // Step 2 state
    const [selectedSectionId, setSelectedSectionId] = React.useState<string | null>(null);
    const [actSearchQuery, setActSearchQuery] = React.useState("");
    const [selectedActs, setSelectedActs] = React.useState<SelectedAssuranceAct[]>([]);


    React.useEffect(() => {
        if (open) {
            setStep(1);
            setSelectedPatientId(null);
            setSelectedSectionId(null);
            setActSearchQuery("");
            setSelectedActs([]);
            if (actChapters.length > 0 && actChapters[0].sections.length > 0) {
                setSelectedSectionId(actChapters[0].sections[0].id);
            }
        }
    }, [open, actChapters]);

    const handlePatientSelect = (patientId: string) => {
        setSelectedPatientId(patientId);
        setIsPatientPopoverOpen(false);
    };
    
    const handleNextStep = () => {
        setStep(2);
    }

    const handleComplete = () => {
        const patient = patients.find(p => p.id === selectedPatientId);
        if (patient && selectedActs.length > 0) {
            onComplete(patient, selectedActs);
        }
    };

    const patientOptions = React.useMemo(() => patients.map(p => ({
        value: p.id,
        label: `${p.firstName} ${p.lastName}`
    })), [patients]);
    
    const sections = React.useMemo(() => {
        return actChapters.flatMap(chapter => chapter.sections);
    }, [actChapters]);

    const displayedActs = React.useMemo(() => {
        if (!selectedSectionId) return [];
        const section = sections.find(s => s.id === selectedSectionId);
        if (!section) return [];
        
        const allActs = section.groups.flatMap(g => g.acts);

        if (!actSearchQuery) return allActs;

        return allActs.filter(act => 
            act.designation.toLowerCase().includes(actSearchQuery.toLowerCase()) ||
            act.code.toLowerCase().includes(actSearchQuery.toLowerCase())
        );
    }, [selectedSectionId, sections, actSearchQuery]);


    const handleActToggle = (act: Act) => {
        setSelectedActs(prev => {
            const isSelected = prev.some(a => a.act.code === act.code);
            if (isSelected) {
                return prev.filter(a => a.act.code !== act.code);
            } else {
                return [...prev, { date: new Date(), dent: '', cps: '', act }];
            }
        });
    };
    
    const handleActInputChange = (actCode: string, field: 'dent' | 'cps', value: string) => {
        setSelectedActs(prev => 
            prev.map(a => a.act.code === actCode ? { ...a, [field]: value } : a)
        );
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-4xl">
                <DialogHeader>
                    <DialogTitle>Generate Assurance Form</DialogTitle>
                    <DialogDescription>
                         Step {step} of 2 - {step === 1 ? "Select Patient" : "Select Medical Acts"}
                    </DialogDescription>
                </DialogHeader>
                
                {step === 1 && (
                    <div className="py-4 space-y-6 min-h-[200px]">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Patient</label>
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
                    </div>
                )}
                
                {step === 2 && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-[500px] py-4">
                        {/* Left Panel: Sections */}
                        <div className="col-span-1">
                            <h4 className="font-semibold mb-2">Sections</h4>
                            <ScrollArea className="h-full rounded-md border p-2">
                                <div className="flex flex-col gap-1">
                                {sections.map(section => (
                                    <Button
                                        type="button"
                                        key={section.id}
                                        variant={selectedSectionId === section.id ? "secondary" : "ghost"}
                                        className="w-full justify-start text-left h-auto py-2"
                                        onClick={() => setSelectedSectionId(section.id)}
                                    >
                                        {section.title}
                                    </Button>
                                ))}
                                </div>
                            </ScrollArea>
                        </div>

                        {/* Right Panel: Acts */}
                        <div className="col-span-2 space-y-2">
                            <h4 className="font-semibold">Acts for {sections.find(s => s.id === selectedSectionId)?.title}</h4>
                            <Input 
                                placeholder="Search acts by code or designation..."
                                value={actSearchQuery}
                                onChange={(e) => setActSearchQuery(e.target.value)}
                            />
                            <ScrollArea className="h-[calc(100%-40px)] rounded-md border p-2">
                            {displayedActs.length > 0 ? (
                                displayedActs.map(act => {
                                    const currentSelection = selectedActs.find(a => a.act.code === act.code);
                                    const isSelected = !!currentSelection;
                                    return (
                                        <div key={act.code} className="p-2 hover:bg-muted rounded-md border-b">
                                            <div className="flex items-start space-x-2">
                                                <input
                                                    type="checkbox"
                                                    id={`act-${act.code}`}
                                                    checked={isSelected}
                                                    onChange={() => handleActToggle(act)}
                                                    className="mt-1.5 h-4 w-4"
                                                />
                                                <label htmlFor={`act-${act.code}`} className="flex-1 cursor-pointer">
                                                    <p className="font-medium">{act.designation}</p>
                                                    <p className="text-xs text-muted-foreground">{act.code} - {act.cotation}</p>
                                                </label>
                                            </div>
                                            {isSelected && (
                                                <div className="mt-2 pl-6 grid grid-cols-2 gap-2">
                                                    <Input 
                                                        placeholder="Dent"
                                                        value={currentSelection.dent}
                                                        onChange={(e) => handleActInputChange(act.code, 'dent', e.target.value)}
                                                    />
                                                    <Input
                                                        placeholder="CPS"
                                                        value={currentSelection.cps}
                                                        onChange={(e) => handleActInputChange(act.code, 'cps', e.target.value)}
                                                    />
                                                </div>
                                            )}
                                        </div>
                                    )
                                })
                            ) : (
                                <p className="text-sm text-center text-muted-foreground p-4">No acts found.</p>
                            )}
                            </ScrollArea>
                        </div>
                    </div>
                )}


                <DialogFooter>
                    {step === 1 && (
                        <>
                            <Button variant="ghost" onClick={() => onOpenChange(false)}>Cancel</Button>
                            <Button onClick={handleNextStep} disabled={!selectedPatientId}>Next</Button>
                        </>
                    )}
                    {step === 2 && (
                         <>
                            <Button variant="ghost" onClick={() => setStep(1)}>Back</Button>
                            <Button 
                                onClick={handleComplete}
                                disabled={selectedActs.length === 0}
                            >
                                Generate
                            </Button>
                        </>
                    )}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
