"use client";

import * as React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { GenerateAssuranceDialog } from "./generate-assurance-dialog";
import { Button } from "@/components/ui/button";
import { Patient, Consultation } from "@/lib/types";
import { DataTable } from "./data-table";
import { columns } from "./columns";
import type { AssuranceRecord } from "./columns";
import { useRouter } from "next/navigation";

export default function TestPage() {
    const [isDialogOpen, setIsDialogOpen] = React.useState(false);
    const [assuranceRecords, setAssuranceRecords] = React.useState<AssuranceRecord[]>([]);
    const router = useRouter();
    
    const handleSelectionsComplete = (patient: Patient, consultation: Consultation) => {
        const newRecord: AssuranceRecord = {
            id: `${patient.id}-${consultation.id}-${new Date().getTime()}`,
            patient,
            consultation,
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
                    <h2 className="text-3xl font-bold tracking-tight">Test Page</h2>
                    <Button onClick={() => setIsDialogOpen(true)}>Generate Assurance Form</Button>
                </div>
                <div className="space-y-4">
                    <h2 className="text-2xl font-bold tracking-tight">Social Assurance Management</h2>
                    <Card>
                        <CardContent className="pt-6">
                           <DataTable columns={columns({ onShow: handleShowPreview })} data={assuranceRecords} />
                        </CardContent>
                    </Card>
                </div>
            </div>
        </>
    );
}
