"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import CNAMPreview from "../cnam-preview";
import { Patient, Consultation } from "@/lib/types";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function CNAMPreviewPage({ params }: { params: { id: string }}) {
    const [patient, setPatient] = React.useState<Patient | null>(null);
    const [consultation, setConsultation] = React.useState<Consultation | null>(null);
    const router = useRouter();
    
    React.useEffect(() => {
        try {
            const dataString = sessionStorage.getItem('cnam-preview-data');
            if (dataString) {
                const data = JSON.parse(dataString);
                // We could validate the ID here, but for now we'll trust the session data
                setPatient(data.patient);
                setConsultation(data.consultation);
            } else {
                // If no data, maybe redirect back or show an error
                router.push('/test');
            }
        } catch (error) {
            console.error("Failed to parse session storage data", error);
            router.push('/test');
        }
    }, [params.id, router]);
    
    return (
        <div className="flex-1 space-y-8 p-4 md:p-8 pt-6">
            <Button variant="outline" onClick={() => router.push('/test')}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Assurance List
            </Button>
            <Card>
                <CardHeader>
                    <CardTitle>CNAM PDF Preview</CardTitle>
                    <CardDescription>
                        This is a preview of the generated CNAM form for {patient?.name}.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {patient && consultation ? (
                        <CNAMPreview patient={patient} consultation={consultation} />
                    ) : (
                        <div className="flex items-center justify-center h-[60vh] bg-muted rounded-md">
                            <p className="text-muted-foreground">Loading preview...</p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
