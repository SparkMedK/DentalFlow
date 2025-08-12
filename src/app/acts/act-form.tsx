
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
import { Act } from "@/lib/types";
import { useAppContext } from "@/context/app-context";
import React, { useEffect } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";

const actSchema = z.object({
  code: z.string().min(1, "Code is required."),
  designation: z.string().min(1, "Designation is required."),
  cotation: z.string().min(1, "Cotation is required."),
  honoraire: z.coerce.number().nullable(),
  notes: z.string().optional(),
});

type ActFormValues = z.infer<typeof actSchema>;

interface ActFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: "add" | "edit";
  act?: Act;
  context: { chapterId: string; sectionId: string; groupTitle: string } | null;
}

export function ActForm({
  open,
  onOpenChange,
  mode,
  act,
  context,
}: ActFormProps) {
  const { addAct, updateAct } = useAppContext();

  const form = useForm<ActFormValues>({
    resolver: zodResolver(actSchema),
    defaultValues: {
      code: "",
      designation: "",
      cotation: "",
      honoraire: null,
      notes: "",
    },
  });
  
  useEffect(() => {
    if (open) {
      form.reset(
        mode === "edit" && act
          ? act
          : {
              code: "",
              designation: "",
              cotation: "",
              honoraire: null,
              notes: "",
            }
      );
    }
  }, [open, mode, act, form]);


  const onSubmit = (values: ActFormValues) => {
    if (!context) return;
    
    if (mode === "add") {
      addAct(context.chapterId, context.sectionId, context.groupTitle, values);
    } else if (act) {
      updateAct(context.chapterId, context.sectionId, context.groupTitle, { ...act, ...values });
    }
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>{mode === "add" ? "Add Medical Act" : "Edit Medical Act"}</DialogTitle>
          <DialogDescription>
            {mode === 'add' ? 'Enter the details for the new act.' : 'Update the details for the existing act.'}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <ScrollArea className="max-h-[70vh] pr-4">
              <div className="space-y-4 p-1">
                <FormField
                  control={form.control}
                  name="code"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Code</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., DCH010010" {...field} disabled={mode === 'edit'}/>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <FormField
                  control={form.control}
                  name="designation"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Designation</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Full description of the act" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <div className="grid grid-cols-2 gap-4">
                    <FormField
                    control={form.control}
                    name="cotation"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Cotation</FormLabel>
                        <FormControl>
                            <Input placeholder="e.g., D15" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                     <FormField
                    control={form.control}
                    name="honoraire"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Honoraire (TND)</FormLabel>
                        <FormControl>
                            <Input type="number" step="0.001" placeholder="e.g., 45.000" {...field} value={field.value ?? ""} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                 </div>
                 <FormField
                  control={form.control}
                  name="notes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Notes</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Optional notes about the act" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </ScrollArea>
            <DialogFooter className="pt-4">
              <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>
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
