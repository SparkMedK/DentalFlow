"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import CNAMPreview from "./cnam-preview";

export default function TestPage() {
    
    // Mock data for previewing the component
    const mockPatient = {
        id: "mockPatient123",
        name: "John Doe",
        phone: "555-1234",
        dob: "1990-01-15",
        address: "123 Main St, Anytown, USA",
        patientHistory: "No known allergies.",
        createdAt: new Date().toISOString(),
        cin: "12345678"
    };

    const mockConsultation = {
        id: "mockConsultation456",
        patientId: "mockPatient123",
        date: "2024-07-29",
        time: "10:00",
        reason: "Routine Checkup",
        price: 75,
        status: "Completed",
        treatmentPlan: "Standard cleaning.",
        followUpActions: "Schedule next appointment in 6 months.",
        actCode: "DC-01",
        toothNumber: "18"
    };

    return (
        <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
            <h2 className="text-3xl font-bold tracking-tight mb-4">Test Page</h2>
            <Card>
                <CardHeader>
                    <CardTitle>CNAM PDF Preview</CardTitle>
                    <CardDescription>
                        This page demonstrates filling a PDF form using `pdf-lib`.
                        You must place a `cnam.pdf` file in the `/public` directory for this to work.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <CNAMPreview patient={mockPatient} consultation={mockConsultation} />
                </CardContent>
            </Card>
        </div>
    );
}
