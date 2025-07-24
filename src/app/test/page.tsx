
"use client";

import * as React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { GenerateAssuranceDialog } from "./generate-assurance-dialog";
import { Button } from "@/components/ui/button";
import { Patient, Act } from "@/lib/types";
import { DataTable } from "./data-table";
import { columns } from "./columns";
import type { AssuranceRecord } from "./columns";
import { useRouter } from "next/navigation";

export interface SelectedAssuranceAct {
    date: Date;
    dent: string;
    cps: string;
    act: Act;
}

export default function TestPage() {
    const [isDialogOpen, setIsDialogOpen] = React.useState(false);
    const [assuranceRecords, setAssuranceRecords] = React.useState<AssuranceRecord[]>([]);
    const router = useRouter();
    
    const handleSelectionsComplete = (patient: Patient, acts: SelectedAssuranceAct[]) => {
        const newRecord: AssuranceRecord = {
            id: `${patient.id}-${new Date().getTime()}`,
            patient,
            acts,
            assuranceType: "CNAM",
            generationDate: new Date().toISOString(),
        };
        setAssuranceRecords(prev => [newRecord, ...prev]);
        setIsDialogOpen(false);
    };

    const handleShowPreview = (record: AssuranceRecord) => {
        sessionStorage.setItem('cnam-preview-data', JSON.stringify(record));
        router.push(`/test/${record.id}`);
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
                        <DataTable columns={columns({ onShow: handleShowPreview })} data={assuranceRecords} />
                    </CardContent>
                </Card>
            </div>
        </>
    );
}
