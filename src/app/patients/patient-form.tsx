
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Patient } from "@/lib/types";
import { useAppContext } from "@/context/app-context";
import React from "react";
import { Separator } from "@/components/ui/separator";

const socialSecuritySchema = z.object({
  idAssurance: z.string().min(1, "Assurance ID is required."),
  firstName: z.string().min(2, "First name is required."),
  lastName: z.string().min(2, "Last name is required."),
  address: z.string().min(1, "Address is required."),
  codePostal: z.string().min(4, "Postal code is required."),
  typeAssurance: z.enum(["CNSS", "CNRPS", "Convention bilatérale"]),
});

const patientSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  phone: z.string().regex(/^\d{8}$/, "Phone number must be exactly 8 digits."),
  dob: z.string().refine((val) => !isNaN(Date.parse(val)), "Invalid date."),
  address: z.string().min(1, "Address is required."),
  patientHistory: z.string().min(1, "Patient history is required."),
  socialSecurity: socialSecuritySchema.optional(),
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
      socialSecurity: {
        idAssurance: "",
        firstName: "",
        lastName: "",
        address: "",
        codePostal: "",
        typeAssurance: "CNSS",
      },
    },
  });

  React.useEffect(() => {
    form.reset(patient || {
      name: "",
      phone: "",
      dob: "",
      address: "",
      patientHistory: "",
       socialSecurity: {
        idAssurance: "",
        firstName: "",
        lastName: "",
        address: "",
        codePostal: "",
        typeAssurance: "CNSS",
      },
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
      <DialogContent className="sm:max-w-xl">
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
            <div className="max-h-[70vh] overflow-y-auto pr-4 pl-1 space-y-4">
              <h3 className="text-lg font-semibold">Patient Information</h3>
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
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
                      <Textarea
                        placeholder="123 Main St, Anytown, USA"
                        {...field}
                      />
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
                      <Textarea
                        placeholder="Allergies, past surgeries, etc."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Separator className="my-6" />

              <h3 className="text-lg font-semibold">Security Insurance</h3>
              <FormField
                control={form.control}
                name="socialSecurity.idAssurance"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Insurance ID</FormLabel>
                    <FormControl>
                      <Input placeholder="Insurance ID" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="socialSecurity.firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>First Name</FormLabel>
                      <FormControl>
                        <Input placeholder="First Name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <FormField
                  control={form.control}
                  name="socialSecurity.lastName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Last Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Last Name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
               <FormField
                  control={form.control}
                  name="socialSecurity.address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Insurance Address</FormLabel>
                      <FormControl>
                        <Input placeholder="Insurance Address" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-2 gap-4">
                    <FormField
                    control={form.control}
                    name="socialSecurity.codePostal"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Postal Code</FormLabel>
                        <FormControl>
                            <Input placeholder="Postal Code" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                    <FormField
                    control={form.control}
                    name="socialSecurity.typeAssurance"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Assurance Type</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select type" />
                                </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                <SelectItem value="CNSS">CNSS</SelectItem>
                                <SelectItem value="CNRPS">CNRPS</SelectItem>
                                <SelectItem value="Convention bilatérale">Convention bilatérale</SelectItem>
                                </SelectContent>
                            </Select>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                </div>
            </div>
            <DialogFooter className="pt-4">
              <Button
                type="button"
                variant="ghost"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button type="submit">Save</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
