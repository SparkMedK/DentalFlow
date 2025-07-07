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
import { Patient } from "@/lib/types";
import { useAppContext } from "@/context/app-context";
import React from "react";

const patientSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  phone: z.string().regex(/^\d{8}$/, "Phone number must be exactly 8 digits."),
  dob: z.string().refine((val) => !isNaN(Date.parse(val)), "Invalid date."),
  address: z.string().min(1, "Address is required."),
  patientHistory: z.string().min(1, "Patient history is required."),
});

interface PatientFormProps {
  patient?: Patient;
  children?: React.ReactNode;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function PatientForm({
  patient,
  children,
  open,
  onOpenChange,
}: PatientFormProps) {
  const { addPatient, updatePatient } = useAppContext();
  const form = useForm<z.infer<typeof patientSchema>>({
    resolver: zodResolver(patientSchema),
    defaultValues: patient || {
      name: "",
      phone: "",
      dob: "",
      address: "",
      patientHistory: "",
    },
  });

  React.useEffect(() => {
    form.reset(patient || {
      name: "",
      phone: "",
      dob: "",
      address: "",
      patientHistory: "",
    });
  }, [patient, form]);

  const onSubmit = (values: z.infer<typeof patientSchema>) => {
    if (patient) {
      updatePatient({ ...patient, ...values });
    } else {
      addPatient(values);
    }
    onOpenChange(false);
    form.reset();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {children && <div onClick={() => onOpenChange(true)}>{children}</div>}
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{patient ? "Edit Patient" : "Add Patient"}</DialogTitle>
          <DialogDescription>
            {patient
              ? "Update the patient's details."
              : "Add a new patient to the directory."}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="John Doe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone</FormLabel>
                  <FormControl>
                    <Input placeholder="12345678" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="dob"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Date of Birth</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Address</FormLabel>
                  <FormControl>
                    <Textarea placeholder="123 Main St, Anytown, USA" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="patientHistory"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Patient History</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Allergies, past surgeries, etc." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
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
