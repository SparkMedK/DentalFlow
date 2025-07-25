
"use client";

import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import { useEffect, useState } from 'react';
import { SocialSecurityDocument } from '@/lib/types';
import { format } from 'date-fns';
import { Loader2 } from 'lucide-react';

export default function CNAMPreview({ record }: { record: SocialSecurityDocument }) {
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let objectUrl: string | null = null;
    const generatePdf = async () => {
      setLoading(true);
      setError(null);
      try {
        const formUrl = '/cnam.pdf';
        const formBytes = await fetch(formUrl).then(res => {
          if (!res.ok) {
              throw new Error(`Failed to fetch PDF: ${res.statusText}. Make sure cnam.pdf exists in the /public folder.`);
          }
          return res.arrayBuffer();
        });

        const { patient, acts } = record;
        const pdfDoc = await PDFDocument.load(formBytes);
        const page = pdfDoc.getPage(0);
        const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

        // --- Patient Info ---
        if (patient.socialSecurity) {
          page.drawText(patient.socialSecurity.idAssurance || 'N/A', { x: 140, y: 700, size: 10, font });
          page.drawText(`${patient.socialSecurity.lastName} ${patient.socialSecurity.firstName}`, { x: 120, y: 678, size: 10, font });
        }
        page.drawText(`${patient.lastName} ${patient.firstName}`, { x: 120, y: 652, size: 10, font });
        page.drawText(patient.address || 'N/A', { x: 120, y: 638, size: 10, font });

        // --- Acts Info ---
        let yPosition = 520;
        const lineHeight = 18;
        
        acts.slice(0, 10).forEach(selectedAct => {
            const { date, dent, cps, code, cotation, honoraire } = selectedAct;
            
            page.drawText(format(new Date(date), 'dd/MM/yy'), { x: 45, y: yPosition, size: 10, font });
            page.drawText(code || '', { x: 100, y: yPosition, size: 9, font });
            page.drawText(dent || '', { x: 200, y: yPosition, size: 10, font });
            page.drawText(cotation || '', { x: 230, y: yPosition, size: 10, font });
            page.drawText(honoraire?.toFixed(3) || '0.000', { x: 280, y: yPosition, size: 10, font });
            page.drawText(cps || '', { x: 360, y: yPosition, size: 10, font });
            
            yPosition -= lineHeight;
        });

        const totalHonoraire = acts.reduce((sum, item) => sum + (item.honoraire || 0), 0);
        page.drawText(totalHonoraire.toFixed(3), { x: 280, y: 328, size: 11, font });


        const pdfBytes = await pdfDoc.save();
        const blob = new Blob([pdfBytes], { type: 'application/pdf' });
        objectUrl = URL.createObjectURL(blob);
        setPdfUrl(objectUrl);
      } catch (err: any) {
        console.error(err);
        setError(err.message || 'An unexpected error occurred while generating the PDF.');
      } finally {
        setLoading(false);
      }
    };

    if (record) {
        generatePdf();
    }
    
    return () => {
        if (objectUrl) {
            URL.revokeObjectURL(objectUrl);
        }
    }
  }, [record]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[80vh] flex-col gap-4 bg-muted rounded-md">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-muted-foreground">Generating preview...</p>
      </div>
    );
  }

  if (error) {
    return (
       <div className="flex items-center justify-center h-[80vh] flex-col gap-4 bg-destructive/10 text-destructive rounded-md p-4">
        <h3 className="font-semibold">Error Generating PDF</h3>
        <p className="text-center">{error}</p>
        <p className="text-center text-xs">Please ensure the <strong>cnam.pdf</strong> file is present in the <strong>/public</strong> directory of your project.</p>
      </div>
    )
  }

  return (
    <div className="w-full h-[80vh]">
      {pdfUrl ? (
        <iframe src={pdfUrl} width="100%" height="100%" className="border" />
      ) : (
        <div className="flex items-center justify-center h-full">
            <p className='text-destructive'>Could not display PDF. Please try again.</p>
        </div>
      )}
    </div>
  );
}
