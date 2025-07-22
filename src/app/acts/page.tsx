
"use client";

import { useState } from "react";
import { useAppContext } from "@/context/app-context";
import { Loader2, Plus, Pencil, Trash2 } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ActForm } from "./act-form";
import { Act } from "@/lib/types";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

export default function ActsPage() {
  const { actChapters, isLoading, deleteAct } = useAppContext();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<"add" | "edit">("add");
  const [currentAct, setCurrentAct] = useState<Act | undefined>(undefined);
  const [currentContext, setCurrentContext] = useState<{ chapterId: string; sectionId: string; groupTitle: string } | null>(null);

  const handleAddClick = (chapterId: string, sectionId: string, groupTitle: string) => {
    setFormMode("add");
    setCurrentAct(undefined);
    setCurrentContext({ chapterId, sectionId, groupTitle });
    setIsFormOpen(true);
  };

  const handleEditClick = (act: Act, chapterId: string, sectionId: string, groupTitle: string) => {
    setFormMode("edit");
    setCurrentAct(act);
    setCurrentContext({ chapterId, sectionId, groupTitle });
    setIsFormOpen(true);
  };
  
  const handleDeleteClick = (chapterId: string, sectionId: string, groupTitle: string, actCode: string) => {
    deleteAct(chapterId, sectionId, groupTitle, actCode);
  };

  if (isLoading) {
    return (
      <div className="flex h-full flex-1 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <>
      <ActForm
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        mode={formMode}
        act={currentAct}
        context={currentContext}
      />
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold tracking-tight">Medical Acts</h2>
        </div>
        <Card>
            <CardHeader>
                <CardTitle>Acts Catalog</CardTitle>
                <CardDescription>Browse and manage the medical acts catalog.</CardDescription>
            </CardHeader>
            <CardContent>
                <Accordion type="multiple" className="w-full">
                {actChapters.map((chapter) => (
                    <AccordionItem value={chapter.id} key={chapter.id}>
                    <AccordionTrigger className="text-lg font-semibold">{chapter.title}</AccordionTrigger>
                    <AccordionContent>
                        <Accordion type="multiple" className="w-full pl-4">
                        {chapter.sections.map((section) => (
                            <AccordionItem value={section.id} key={section.id}>
                            <AccordionTrigger className="text-md font-medium">{section.title}</AccordionTrigger>
                            <AccordionContent>
                                {section.groups.length > 0 ? (
                                    section.groups.map((group, groupIndex) => (
                                    <div key={groupIndex} className="py-2 pl-4">
                                        <div className="flex justify-between items-center mb-2">
                                            <h4 className="font-semibold text-sm">{group.title || 'General Acts'}</h4>
                                             <Button variant="ghost" size="sm" onClick={() => handleAddClick(chapter.id, section.id, group.title)}>
                                                <Plus className="mr-2 h-4 w-4" /> Add Act
                                            </Button>
                                        </div>
                                        <div className="space-y-2">
                                        {group.acts.map((act) => (
                                            <div key={act.code} className="flex justify-between items-center p-2 rounded-md border">
                                                <div>
                                                    <p className="font-medium">{act.designation} <span className="text-muted-foreground text-xs">({act.code})</span></p>
                                                    <p className="text-sm text-muted-foreground">Cotation: {act.cotation} | Honoraire: {act.honoraire?.toFixed(3) ?? 'N/A'} TND</p>
                                                    {act.notes && <p className="text-xs text-muted-foreground italic">Note: {act.notes}</p>}
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <Button variant="ghost" size="icon" onClick={() => handleEditClick(act, chapter.id, section.id, group.title)}>
                                                        <Pencil className="h-4 w-4"/>
                                                    </Button>
                                                     <AlertDialog>
                                                        <AlertDialogTrigger asChild>
                                                          <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive">
                                                              <Trash2 className="h-4 w-4" />
                                                          </Button>
                                                        </AlertDialogTrigger>
                                                        <AlertDialogContent>
                                                            <AlertDialogHeader>
                                                                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                                                <AlertDialogDescription>
                                                                This action cannot be undone. This will permanently delete the medical act.
                                                                </AlertDialogDescription>
                                                            </AlertDialogHeader>
                                                            <AlertDialogFooter>
                                                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                                <AlertDialogAction onClick={() => handleDeleteClick(chapter.id, section.id, group.title, act.code)} className="bg-destructive hover:bg-destructive/90">Delete</AlertDialogAction>
                                                            </AlertDialogFooter>
                                                        </AlertDialogContent>
                                                    </AlertDialog>
                                                </div>
                                            </div>
                                        ))}
                                        </div>
                                    </div>
                                    ))
                                ) : (
                                    <div className="text-center text-muted-foreground p-4">No groups in this section.</div>
                                )}
                            </AccordionContent>
                            </AccordionItem>
                        ))}
                        </Accordion>
                    </AccordionContent>
                    </AccordionItem>
                ))}
                </Accordion>
            </CardContent>
        </Card>
      </div>
    </>
  );
}
