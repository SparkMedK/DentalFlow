
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
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select as ShadSelect,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Act, Consultation } from "@/lib/types";
import { useAppContext } from "@/context/app-context";
import React, { useMemo } from "react";
import Select from "react-select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";

const consultationSchema = z.object({
  patientId: z.string().min(1, "Patient is required."),
  date: z.string().refine((val) => !isNaN(Date.parse(val)), "Invalid date."),
  time: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Invalid time format (HH:MM)."),
  reason: z.string().min(2, "Reason must be at least 2 characters."),
  price: z.coerce.number().min(0, "Price must be a positive number."),
  status: z.enum(["Scheduled", "Completed", "Cancelled"]),
  treatmentPlan: z.string().optional(),
  followUpActions: z.string().optional(),
  acts: z.array(z.string()).optional(),
});

type ConsultationFormValues = z.infer<typeof consultationSchema>;

interface ConsultationFormProps {
  consultation?: Partial<Consultation>;
  children?: React.ReactNode;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ConsultationForm({
  consultation,
  children,
  open,
  onOpenChange,
}: ConsultationFormProps) {
  const { patients, addConsultation, updateConsultation, actChapters } = useAppContext();
  const [step, setStep] = React.useState(1);
  const [selectedSectionId, setSelectedSectionId] = React.useState<string | null>(null);
  const [actSearchQuery, setActSearchQuery] = React.useState("");

  const form = useForm<z.infer<typeof consultationSchema>>({
    resolver: zodResolver(consultationSchema),
    defaultValues: consultation ? {
      ...consultation,
      acts: consultation.acts || [],
    } : {
      patientId: "",
      date: new Date().toISOString().split('T')[0],
      time: "10:00",
      reason: "",
      price: 0,
      status: "Scheduled",
      treatmentPlan: "",
      followUpActions: "",
      acts: [],
    },
  });
  
  React.useEffect(() => {
    setStep(1);
    setSelectedSectionId(null);
    setActSearchQuery("");
    const defaultValues = {
      patientId: "",
      date: new Date().toISOString().split('T')[0],
      time: "10:00",
      reason: "",
      price: 0,
      status: "Scheduled",
      treatmentPlan: "",
      followUpActions: "",
      acts: [],
    };
    form.reset(consultation ? { ...defaultValues, ...consultation, acts: consultation.acts || [] } : defaultValues);
    if (actChapters.length > 0 && actChapters[0].sections.length > 0) {
      setSelectedSectionId(actChapters[0].sections[0].id);
    }
  }, [consultation, form, open, actChapters]);


  const onSubmit = (values: z.infer<typeof consultationSchema>) => {
    const finalValues = {
        ...values,
        treatmentPlan: values.treatmentPlan || 'Not specified',
        followUpActions: values.followUpActions || 'Not specified',
        acts: values.acts || [],
    };

    if (consultation?.id) {
      updateConsultation({ ...consultation, ...finalValues, id: consultation.id });
    } else {
      addConsultation(finalValues); 
    }
    onOpenChange(false);
  };
  
  const handleNext = async () => {
    const fieldsToValidate: (keyof ConsultationFormValues)[] = [
      "patientId",
      "date",
      "time",
      "reason",
      "price",
      "status"
    ];
    const isValid = await form.trigger(fieldsToValidate);
    if (isValid) {
      setStep(2);
    }
  };

  const patientOptions = React.useMemo(() => patients.map(p => ({
    value: p.id,
    label: `${p.firstName} ${p.lastName} - ${p.phone}`,
  })), [patients]);

  const isEditing = !!consultation?.id;

  const sections = useMemo(() => {
    return actChapters.flatMap(chapter => chapter.sections);
  }, [actChapters]);

  const displayedActs = useMemo(() => {
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
  
  const selectedActCodes = form.watch("acts") || [];

  const handleActToggle = (actCode: string) => {
    const currentCodes = form.getValues("acts") || [];
    const newCodes = currentCodes.includes(actCode)
        ? currentCodes.filter(code => code !== actCode)
        : [...currentCodes, actCode];
    form.setValue("acts", newCodes, { shouldValidate: true, shouldDirty: true });
  }

  const selectStyles = {
    control: (base: any, state: any) => ({
      ...base,
      backgroundColor: 'hsl(var(--input))',
      borderColor: state.isFocused ? 'hsl(var(--ring))' : 'hsl(var(--border))',
      color: 'hsl(var(--foreground))',
      minHeight: '40px',
      boxShadow: 'none',
      '&:hover': {
        borderColor: 'hsl(var(--ring))',
      }
    }),
    singleValue: (base: any) => ({
      ...base,
      color: 'hsl(var(--foreground))',
    }),
    input: (base: any) => ({
      ...base,
      color: 'hsl(var(--foreground))',
    }),
    menu: (base: any) => ({
      ...base,
      backgroundColor: 'hsl(var(--popover))',
      borderColor: 'hsl(var(--border))',
      zIndex: 9999
    }),
    option: (base: any, state: { isFocused: any; isSelected: any; }) => ({
      ...base,
      backgroundColor: state.isSelected ? 'hsl(var(--accent))' : state.isFocused ? 'hsl(var(--muted))' : 'hsl(var(--popover))',
      color: 'hsl(var(--popover-foreground))',
      '&:active': {
        backgroundColor: 'hsl(var(--accent))',
      }
    }),
    placeholder: (base: any) => ({
      ...base,
      color: 'hsl(var(--muted-foreground))',
    }),
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {children && <div onClick={() => onOpenChange(true)}>{children}</div>}
      <DialogContent className="sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle>{consultation?.id ? "Edit Consultation" : "Add Consultation"}</DialogTitle>
          <DialogDescription>
            Step {step} of 2 - {step === 1 ? "Consultation Details" : "Medical Acts"}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className={cn("space-y-4", step !== 1 && "hidden")}>
            <ScrollArea className="max-h-[60vh] pr-4">
            <div className="space-y-4 p-1">
              <FormField
                control={form.control}
                name="patientId"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Patient</FormLabel>
                      <Select
                        instanceId="patient-select"
                        options={patientOptions}
                        value={patientOptions.find(option => option.value === field.value) || null}
                        onChange={(option) => field.onChange(option?.value || "")}
                        placeholder="Select or search for a patient..."
                        styles={selectStyles}
                        isDisabled={isEditing || (!!consultation?.patientId && !consultation?.id)}
                      />
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                  control={form.control}
                  name="date"
                  render={({ field }) => (
                      <FormItem>
                      <FormLabel>Date</FormLabel>
                      <FormControl>
                          <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                      </FormItem>
                  )}
                  />
                  <FormField
                  control={form.control}
                  name="time"
                  render={({ field }) => (
                      <FormItem>
                      <FormLabel>Time</FormLabel>
                      <FormControl>
                          <Input type="time" {...field} />
                      </FormControl>
                      <FormMessage />
                      </FormItem>
                  )}
                  />
              </div>

              <FormField
                control={form.control}
                name="reason"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Reason for Visit</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="E.g., routine check-up, toothache..."
                        {...field}
                        value={field.value ?? ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="treatmentPlan"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Treatment Plan</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="E.g., filling, extraction, cleaning..."
                        {...field}
                        value={field.value ?? ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="followUpActions"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Follow-up Actions</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="E.g., schedule next appointment, prescription details..."
                        {...field}
                        value={field.value ?? ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                      <FormItem>
                      <FormLabel>Price ($)</FormLabel>
                      <FormControl>
                          <Input type="number" step="0.01" {...field} />
                      </FormControl>
                      <FormMessage />
                      </FormItem>
                  )}
                  />
                  <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                      <FormItem>
                      <FormLabel>Status</FormLabel>
                      <ShadSelect onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                          <SelectTrigger>
                              <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                          <SelectItem value="Scheduled">Scheduled</SelectItem>
                          <SelectItem value="Completed">Completed</SelectItem>
                          <SelectItem value="Cancelled">Cancelled</SelectItem>
                          </SelectContent>
                      </ShadSelect>
                      <FormMessage />
                      </FormItem>
                  )}
                  />
              </div>
            </div>
            </ScrollArea>
          </div>

          <div className={cn("space-y-4", step !== 2 && "hidden")}>
             <div className="grid grid-cols-3 gap-6 h-[400px]">
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
                    <ScrollArea className="h-[320px] rounded-md border p-2">
                       {displayedActs.length > 0 ? (
                           displayedActs.map(act => (
                               <div key={act.code} className="flex items-center space-x-2 p-2 hover:bg-muted rounded-md">
                                  <Checkbox
                                    id={`act-${act.code}`}
                                    checked={selectedActCodes.includes(act.code)}
                                    onCheckedChange={() => handleActToggle(act.code)}
                                  />
                                  <label htmlFor={`act-${act.code}`} className="flex-1 cursor-pointer">
                                      <p className="font-medium">{act.designation}</p>
                                      <p className="text-xs text-muted-foreground">{act.code} - {act.cotation}</p>
                                  </label>
                               </div>
                           ))
                       ) : (
                           <p className="text-sm text-center text-muted-foreground p-4">No acts found.</p>
                       )}
                    </ScrollArea>
                </div>
             </div>
          </div>
            <DialogFooter className="pt-4">
              {step === 1 && (
                  <>
                    <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>Cancel</Button>
                    <Button type="button" onClick={handleNext}>Next</Button>
                  </>
              )}
               {step === 2 && (
                <>
                  <Button type="button" variant="ghost" onClick={() => setStep(1)}>
                    Back
                  </Button>
                  <Button type="submit">Save</Button>
                </>
              )}
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
