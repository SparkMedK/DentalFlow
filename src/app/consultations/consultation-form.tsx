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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import React from "react";
import { Combobox } from "@/components/ui/combobox";

const consultationSchema = z.object({
  patientId: z.string().min(1, "Patient is required."),
  date: z.string().refine((val) => !isNaN(Date.parse(val)), "Invalid date."),
  time: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Invalid time format (HH:MM)."),
  reason: z.string().min(2, "Reason must be at least 2 characters."),
  price: z.coerce.number().min(0, "Price must be a positive number."),
  status: z.enum(["Scheduled", "Completed", "Cancelled"]),
  treatmentPlan: z.string().optional(),
  followUpActions: z.string().optional(),
});

interface ConsultationFormProps {
  consultation?: Consultation;
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
  const { patients, addConsultation, updateConsultation } = useAppContext();
  const form = useForm<z.infer<typeof consultationSchema>>({
    resolver: zodResolver(consultationSchema),
    defaultValues: consultation || {
      patientId: "",
      date: new Date().toISOString().split('T')[0],
      time: "10:00",
      reason: "",
      price: 0,
      status: "Scheduled",
      treatmentPlan: "",
      followUpActions: "",
    },
  });
  
  React.useEffect(() => {
    form.reset(consultation || {
      patientId: "",
      date: new Date().toISOString().split('T')[0],
      time: "10:00",
      reason: "",
      price: 0,
      status: "Scheduled",
      treatmentPlan: "",
      followUpActions: "",
    });
  }, [consultation, form]);


  const onSubmit = (values: z.infer<typeof consultationSchema>) => {
    const finalValues = {
        ...values,
        treatmentPlan: values.treatmentPlan || 'Not specified',
        followUpActions: values.followUpActions || 'Not specified',
    };

    if (consultation) {
      updateConsultation({ ...consultation, ...finalValues });
    } else {
      addConsultation(finalValues); 
    }
    onOpenChange(false);
    form.reset();
  };
  
  const patientOptions = patients.map(p => ({
    value: p.id,
    label: `${p.name} - ${p.phone}`,
  }));


  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {children && <div onClick={() => onOpenChange(true)}>{children}</div>}
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{consultation ? "Edit Consultation" : "Add Consultation"}</DialogTitle>
          <DialogDescription>
            {consultation
              ? "Update the consultation details."
              : "Schedule a new consultation."}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="patientId"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Patient</FormLabel>
                    <Combobox
                        options={patientOptions}
                        value={field.value}
                        onChange={field.onChange}
                        placeholder="Select a patient..."
                        searchPlaceholder="Search by name or phone..."
                        emptyPlaceholder="No patient found."
                    />
                  <FormMessage />
                </FormItem>
              )}
            />
             <div className="grid grid-cols-2 gap-4">
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
                    <Textarea placeholder="Routine check-up, toothache, etc." {...field} />
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
                      placeholder="Details of the treatment plan..."
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
            <div className="grid grid-cols-2 gap-4">
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
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
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
                    </Select>
                    <FormMessage />
                    </FormItem>
                )}
                />
            </div>
            <DialogFooter>
              <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>Cancel</Button>
              <Button type="submit">Save</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
