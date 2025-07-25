
"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import CNAMPreview from "../cnam-preview";
import { SocialSecurityDocument } from "@/lib/types";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function CNAMPreviewPage({ params: paramsPromise }: { params: Promise<{ id: string }> }) {
    const params = React.use(paramsPromise); // Unwrap the params Promise
    const [record, setRecord] = React.useState<SocialSecurityDocument | null>(null);
    const [loading, setLoading] = React.useState(true);
    const router = useRouter();
    
    React.useEffect(() => {
        try {
            const dataString = sessionStorage.getItem('cnam-preview-data');
            if (dataString) {
                const data = JSON.parse(dataString);
                // Validate if the ID from the URL matches the one in session storage for extra safety
                if (data.id === params.id) {
                    setRecord(data);
                } else {
                     router.push('/socialsecuritydoc');
                }
            } else {
                // If no data, redirect back
                router.push('/socialsecuritydoc');
            }
        } catch (error) {
            console.error("Failed to parse session storage data", error);
            router.push('/socialsecuritydoc');
        } finally {
            setLoading(false);
        }
    }, [params.id, router]);

    return (
        <div className="flex-1 space-y-8 p-4 md:p-8 pt-6">
            <Button variant="outline" onClick={() => router.push('/socialsecuritydoc')}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Assurance List
            </Button>
            <Card>
                <CardHeader>
                    <CardTitle>CNAM PDF Preview</CardTitle>
                    <CardDescription>
                        This is a preview of the generated CNAM form for {record?.patient ? `${record.patient.firstName} ${record.patient.lastName}` : ""}.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {loading ? (
                         <div className="flex items-center justify-center h-[60vh] bg-muted rounded-md">
                            <p className="text-muted-foreground">Loading preview data...</p>
                        </div>
                    ) : record ? (
                        <CNAMPreview record={record} /> 
                    ) : (
                        <div className="flex items-center justify-center h-[60vh] bg-muted rounded-md">
                            <p className="text-destructive">Could not load preview. Please go back and try again.</p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
