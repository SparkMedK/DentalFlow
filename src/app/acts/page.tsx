
"use client";

import { useState, useMemo } from "react";
import { useAppContext } from "@/context/app-context";
import { Loader2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ActForm } from "./act-form";
import { ActsTable } from "./acts-table";
import type { Act } from "@/lib/types";

export default function ActsPage() {
  const { actChapters, isLoading, deleteAct } = useAppContext();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<"add" | "edit">("add");
  const [currentAct, setCurrentAct] = useState<Act | undefined>(undefined);
  const [currentContext, setCurrentContext] = useState<{ chapterId: string; sectionId: string; groupTitle: string } | null>(null);
  
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSectionId, setSelectedSectionId] = useState("all");

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
  
  const handleDeleteClick = (actCode: string) => {
    if (!currentContext) return;
    deleteAct(currentContext.chapterId, currentContext.sectionId, currentContext.groupTitle, actCode);
  };
  
  const sectionOptions = useMemo(() => {
    return actChapters.flatMap(chapter => 
        chapter.sections.map(section => ({
            value: section.id,
            label: `${chapter.title} - ${section.title}`,
        }))
    );
  }, [actChapters]);

  const filteredChapters = useMemo(() => {
    let chapters = actChapters;

    if (selectedSectionId !== 'all') {
      chapters = chapters.map(chapter => ({
        ...chapter,
        sections: chapter.sections.filter(section => section.id === selectedSectionId)
      })).filter(chapter => chapter.sections.length > 0);
    }
    
    if (searchQuery) {
        chapters = chapters.map(chapter => ({
            ...chapter,
            sections: chapter.sections.map(section => ({
                ...section,
                groups: section.groups.map(group => ({
                    ...group,
                    acts: group.acts.filter(act => 
                        act.designation.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        act.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        act.notes?.toLowerCase().includes(searchQuery.toLowerCase())
                    )
                })).filter(group => group.acts.length > 0)
            })).filter(section => section.groups.length > 0)
        })).filter(chapter => chapter.sections.length > 0);
    }

    return chapters;
  }, [actChapters, searchQuery, selectedSectionId]);

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
                <CardDescription>Browse, search, and manage the medical acts catalog.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="flex items-center gap-4 py-4">
                    <Input 
                        placeholder="Search by code, designation, or notes..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="max-w-sm"
                    />
                    <Select value={selectedSectionId} onValueChange={setSelectedSectionId}>
                        <SelectTrigger className="w-[400px]">
                            <SelectValue placeholder="Filter by section..." />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Sections</SelectItem>
                            {sectionOptions.map(option => (
                                <SelectItem key={option.value} value={option.value}>
                                    {option.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <div className="space-y-6">
                    {filteredChapters.map(chapter => (
                        <div key={chapter.id}>
                            <h3 className="text-xl font-bold tracking-tight mb-2">{chapter.title}</h3>
                            {chapter.sections.map(section => (
                                <div key={section.id} className="pl-4 space-y-4 border-l-2 border-border ml-2">
                                    <h4 className="text-lg font-semibold tracking-tight">{section.title}</h4>
                                    {section.groups.length > 0 ? (
                                        section.groups.map((group, groupIndex) => (
                                            <div key={groupIndex} className="pl-4">
                                                <div className="flex justify-between items-center mb-2">
                                                    <h5 className="font-semibold">{group.title || 'General Acts'}</h5>
                                                    <Button variant="outline" size="sm" onClick={() => handleAddClick(chapter.id, section.id, group.title)}>
                                                        <Plus className="mr-2 h-4 w-4" /> Add Act
                                                    </Button>
                                                </div>
                                                <ActsTable
                                                    acts={group.acts}
                                                    onEdit={(act) => handleEditClick(act, chapter.id, section.id, group.title)}
                                                    onDelete={(actCode) => {
                                                        setCurrentContext({ chapterId: chapter.id, sectionId: section.id, groupTitle: group.title });
                                                        handleDeleteClick(actCode);
                                                    }}
                                                />
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-muted-foreground pl-4">No groups match your search criteria in this section.</p>
                                    )}
                                </div>
                            ))}
                        </div>
                    ))}
                    {filteredChapters.length === 0 && (
                        <div className="text-center text-muted-foreground p-8">
                            No medical acts found matching your criteria.
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
      </div>
    </>
  );
}
