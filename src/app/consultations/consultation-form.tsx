
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
import { Consultation } from "@/lib/types";
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
  const [selectedSection, setSelectedSection] = React.useState<any>(null);

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
    setSelectedSection(null);
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
  }, [consultation, form, open]);


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

  const allActs = useMemo(() => {
    return actChapters.flatMap(chapter => 
        chapter.sections.flatMap(section => 
            section.groups.flatMap(group => group.acts)
        )
    );
  }, [actChapters]);

  const sectionOptions = useMemo(() => {
    return actChapters.flatMap(chapter => 
        chapter.sections.map(section => ({
            value: section.id,
            label: `${chapter.title} - ${section.title}`,
            originalSection: section
        }))
    );
  }, [actChapters]);

  const actOptions = useMemo(() => {
    if (!selectedSection) return [];
    return selectedSection.originalSection.groups.flatMap((group: any) => 
        group.acts.map((act: any) => ({
            value: act.code,
            label: `${act.designation} (${act.code})`
        }))
    );
  }, [selectedSection]);

  const selectedActCodes = form.watch("acts") || [];
  const selectedActs = useMemo(() => {
    return allActs.filter(act => selectedActCodes.includes(act.code));
  }, [selectedActCodes, allActs]);

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
    multiValue: (base: any) => ({
        ...base,
        backgroundColor: 'hsl(var(--secondary))',
    }),
    multiValueLabel: (base: any) => ({
        ...base,
        color: 'hsl(var(--secondary-foreground))',
    }),
    multiValueRemove: (base: any) => ({
        ...base,
        color: 'hsl(var(--secondary-foreground))',
        ':hover': {
            backgroundColor: 'hsl(var(--destructive))',
            color: 'hsl(var(--destructive-foreground))',
        },
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
          <ScrollArea className="max-h-[70vh] pr-4">
            <div className="space-y-4 p-1">
              <div className={cn("space-y-4", step !== 1 && "hidden")}>
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

              <div className={cn("space-y-6", step !== 2 && "hidden")}>
                <div className="space-y-2">
                    <FormLabel>Section</FormLabel>
                    <Select
                        instanceId="section-select"
                        options={sectionOptions}
                        value={selectedSection}
                        onChange={(option) => setSelectedSection(option)}
                        placeholder="Select or search for a section..."
                        styles={selectStyles}
                    />
                </div>
                
                {selectedSection && (
                     <FormField
                        control={form.control}
                        name="acts"
                        render={({ field }) => (
                        <FormItem className="flex flex-col">
                            <FormLabel>Medical Acts</FormLabel>
                            <Select
                                instanceId="act-select"
                                isMulti
                                options={actOptions}
                                value={actOptions.filter(option => field.value?.includes(option.value))}
                                onChange={(options) => field.onChange(options.map(option => option.value))}
                                placeholder="Select one or more acts..."
                                styles={selectStyles}
                            />
                             <FormMessage />
                        </FormItem>
                        )}
                    />
                )}
                {selectedActs.length > 0 && (
                    <div className="space-y-2">
                        <FormLabel>Selected Acts</FormLabel>
                        <div className="flex flex-wrap gap-2 rounded-md border p-2 min-h-[40px]">
                            {selectedActs.map(act => (
                                <Badge key={act.code} variant="secondary" className="text-sm py-1">
                                    {act.designation}
                                </Badge>
                            ))}
                        </div>
                    </div>
                )}
              </div>
            </div>
          </ScrollArea>
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
