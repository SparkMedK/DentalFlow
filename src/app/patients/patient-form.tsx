
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
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

const socialSecuritySchema = z.object({
  idAssurance: z.string().min(1, "Assurance ID is required."),
  firstName: z.string().min(2, "First name is required."),
  lastName: z.string().min(2, "Last name is required."),
  address: z.string().min(1, "Address is required."),
  codePostal: z.string().min(4, "Postal code is required."),
  typeAssurance: z.enum(["CNSS", "CNRPS", "Convention bilatérale"]),
});

const patientSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters."),
  lastName: z.string().min(2, "Last name must be at least 2 characters."),
  phone: z.string().regex(/^\d{8}$/, "Phone number must be exactly 8 digits."),
  dob: z.string().refine((val) => !isNaN(Date.parse(val)), "Invalid date."),
  address: z.string().min(1, "Address is required."),
  patientHistory: z.string().min(1, "Patient history is required."),
  socialSecurity: socialSecuritySchema.optional(),
});

type PatientFormValues = z.infer<typeof patientSchema>;

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
  const [step, setStep] = React.useState(1);

  const form = useForm<PatientFormValues>({
    resolver: zodResolver(patientSchema),
    defaultValues: patient || {
      firstName: "",
      lastName: "",
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
    setStep(1); // Reset to step 1 when dialog opens/closes
    form.reset(patient || {
      firstName: "",
      lastName: "",
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
  }, [patient, form, open]);

  const onSubmit = (values: PatientFormValues) => {
    if (patient) {
      updatePatient({ ...patient, ...values });
    } else {
      addPatient(values);
    }
    onOpenChange(false);
  };
  
  const handleNext = async () => {
    const fieldsToValidate: (keyof PatientFormValues)[] = [
      "firstName",
      "lastName",
      "phone",
      "dob",
      "address",
      "patientHistory",
    ];
    const isValid = await form.trigger(fieldsToValidate);
    if (isValid) {
      setStep(2);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {children && <div onClick={() => onOpenChange(true)}>{children}</div>}
      <DialogContent className="sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle>{patient ? "Edit Patient" : "Add Patient"}</DialogTitle>
          <DialogDescription>
             Step {step} of 2 - {step === 1 ? "Patient Information" : "Security Insurance"}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <ScrollArea className="max-h-[70vh] pr-4 pl-1">
              <div className="space-y-4 p-1">
                {/* Step 1: Patient Information */}
                <div className={cn("space-y-4", step !== 1 && "hidden")}>
                  <h3 className="text-lg font-semibold">Patient Information</h3>
                   <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                     <FormField
                      control={form.control}
                      name="firstName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>First Name</FormLabel>
                          <FormControl>
                            <Input placeholder="John" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="lastName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Last Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Doe" {...field} />
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
                  </div>
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
                </div>

                {/* Step 2: Security Insurance */}
                <div className={cn("space-y-4", step !== 2 && "hidden")}>
                  <h3 className="text-lg font-semibold">Security Insurance</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                    <FormField
                      control={form.control}
                      name="socialSecurity.typeAssurance"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Assurance Type</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="CNSS">CNSS</SelectItem>
                              <SelectItem value="CNRPS">CNRPS</SelectItem>
                              <SelectItem value="Convention bilatérale">
                                Convention bilatérale
                              </SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
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
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                </div>
              </div>
            </ScrollArea>
            <DialogFooter className="pt-4">
              {step === 1 && (
                <>
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => onOpenChange(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="button" onClick={handleNext}>
                    Next
                  </Button>
                </>
              )}
              {step === 2 && (
                <>
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => setStep(1)}
                  >
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
