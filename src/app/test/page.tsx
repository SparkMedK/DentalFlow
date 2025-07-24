
"use client";

import * as React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { GenerateAssuranceDialog } from "./generate-assurance-dialog";
import { Button } from "@/components/ui/button";
import { Patient, Act, SocialSecurityDocument } from "@/lib/types";
import { DataTable } from "./data-table";
import { columns } from "./columns";
import { useRouter } from "next/navigation";
import { useAppContext } from "@/context/app-context";
import { Loader2 } from "lucide-react";

export interface SelectedAssuranceAct {
    date: Date;
    dent: string;
    cps: string;
    act: Act;
}

export default function TestPage() {
    const { socialSecurityDocuments, addSocialSecurityDocument, isLoading } = useAppContext();
    const [isDialogOpen, setIsDialogOpen] = React.useState(false);
    const router = useRouter();
    
    const handleSelectionsComplete = (patient: Patient, acts: SelectedAssuranceAct[]) => {
        const newRecord: Omit<SocialSecurityDocument, 'id'> = {
            patient,
            acts: acts.map(a => ({ 
                ...a.act, 
                dent: a.dent, 
                cps: a.cps, 
                date: a.date.toISOString() 
            })),
            assuranceType: "CNAM",
            generationDate: new Date().toISOString(),
        };
        addSocialSecurityDocument(newRecord);
        setIsDialogOpen(false);
    };

    const handleShowPreview = (record: SocialSecurityDocument) => {
        sessionStorage.setItem('cnam-preview-data', JSON.stringify(record));
        router.push(`/test/${record.id}`);
    }

    if (isLoading) {
      return (
        <div className="flex h-full flex-1 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      );
    }

    return (
        <>
            <GenerateAssuranceDialog 
                open={isDialogOpen}
                onOpenChange={setIsDialogOpen}
                onComplete={handleSelectionsComplete}
            />
            <div className="flex-1 space-y-8 p-4 md:p-8 pt-6">
                <div className="flex items-center justify-between">
                    <h2 className="text-3xl font-bold tracking-tight">Social Assurance Management</h2>
                    <Button onClick={() => setIsDialogOpen(true)}>Generate Assurance Form</Button>
                </div>
                <Card>
                    <CardHeader>
                         <CardTitle>Generated Forms</CardTitle>
                         <CardDescription>
                            A list of previously generated social assurance forms.
                         </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <DataTable columns={columns({ onShow: handleShowPreview })} data={socialSecurityDocuments} />
                    </CardContent>
                </Card>
            </div>
        </>
    );
}
