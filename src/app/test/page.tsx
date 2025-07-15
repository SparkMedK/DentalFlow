"use client";

import * as React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import CNAMPreview from "./cnam-preview";
import { GenerateAssuranceDialog } from "./generate-assurance-dialog";
import { Button } from "@/components/ui/button";
import { Patient, Consultation } from "@/lib/types";
import { DataTable } from "./data-table";
import { columns } from "./columns";
import type { AssuranceRecord } from "./columns";

export default function TestPage() {
    const [isDialogOpen, setIsDialogOpen] = React.useState(false);
    const [selectedPatient, setSelectedPatient] = React.useState<Patient | null>(null);
    const [selectedConsultation, setSelectedConsultation] = React.useState<Consultation | null>(null);
    const [assuranceRecords, setAssuranceRecords] = React.useState<AssuranceRecord[]>([]);
    
    const handleSelectionsComplete = (patient: Patient, consultation: Consultation) => {
        const newRecord: AssuranceRecord = {
            id: `${patient.id}-${consultation.id}-${new Date().getTime()}`,
            patient,
            consultation,
            assuranceType: "CNAM",
            generationDate: new Date().toISOString(),
        };

        // Add to records and set as current preview
        setAssuranceRecords(prev => [newRecord, ...prev]);
        setSelectedPatient(patient);
        setSelectedConsultation(consultation);
        setIsDialogOpen(false);
    };

    const handleShowPreview = (record: AssuranceRecord) => {
        setSelectedPatient(record.patient);
        setSelectedConsultation(record.consultation);
        // Scroll to top to see the preview
        window.scrollTo(0, 0);
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
                <Card>
                    <CardHeader>
                        <CardTitle>CNAM PDF Preview</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {selectedPatient && selectedConsultation ? (
                            <CNAMPreview patient={selectedPatient} consultation={selectedConsultation} />
                        ) : (
                            <div className="flex items-center justify-center h-[60vh] bg-muted rounded-md">
                                <p className="text-muted-foreground">Select a patient and consultation to see the preview.</p>
                            </div>
                        )}
                    </CardContent>
                </Card>

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
