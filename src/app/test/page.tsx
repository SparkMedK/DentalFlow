"use client";

import * as React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import CNAMPreview from "./cnam-preview";
import { GenerateAssuranceDialog } from "./generate-assurance-dialog";
import { Button } from "@/components/ui/button";
import { Patient, Consultation } from "@/lib/types";

export default function TestPage() {
    const [isDialogOpen, setIsDialogOpen] = React.useState(false);
    const [selectedPatient, setSelectedPatient] = React.useState<Patient | null>(null);
    const [selectedConsultation, setSelectedConsultation] = React.useState<Consultation | null>(null);
    
    const handleSelectionsComplete = (patient: Patient, consultation: Consultation) => {
        setSelectedPatient(patient);
        setSelectedConsultation(consultation);
        setIsDialogOpen(false);
    };

    return (
        <>
            <GenerateAssuranceDialog 
                open={isDialogOpen}
                onOpenChange={setIsDialogOpen}
                onComplete={handleSelectionsComplete}
            />
            <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
                <div className="flex items-center justify-between">
                    <h2 className="text-3xl font-bold tracking-tight mb-4">Test Page</h2>
                    <Button onClick={() => setIsDialogOpen(true)}>Generate Assurance Form</Button>
                </div>
                <Card>
                    <CardHeader>
                        <CardTitle>CNAM PDF Preview</CardTitle>
                        <CardDescription>
                            This page demonstrates filling a PDF form using `pdf-lib`.
                            You must place a `cnam.pdf` file in the `/public` directory for this to work.
                            Click "Generate Assurance Form" to select a patient and consultation.
                        </CardDescription>
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
            </div>
        </>
    );
}
