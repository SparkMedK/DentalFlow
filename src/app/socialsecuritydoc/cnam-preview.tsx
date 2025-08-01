
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
        const pageConsultation = pdfDoc.getPage(1);
        const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

        console.log("Generating PDF...", patient, acts, patient.socialSecurity)
        // --- Patient Info ---!
        let yPosition = 490;
        let yConsultation = 410;
        let yAssurance = 382;
        const lineHeight = 25;
        const xStart = 550;

        const type = patient.socialSecurity?.typeAssurance?.toLowerCase();

        if (type === 'cnss') {
          page.drawText("X", { x:xStart, y: yAssurance, size: 10, font });
        } else if (type === 'cnrps') {
          page.drawText("X", { x:xStart+80, y: yAssurance, size: 10, font });
        } else if (type === 'convention bilatérale') {
          page.drawText("X", { x: xStart+211, y: yAssurance, size: 10, font });
        }
        
        if (patient.socialSecurity) {
          const spacing = 8 ; // You can adjust this value for more or less space
          const text = patient.socialSecurity.idAssurance || 'N/A';
          const y = 405;
          const fontSize = 14;
          let x = xStart;
          for (const char of text) {
            page.drawText(char, { x, y, size: fontSize, font });
            const width = font.widthOfTextAtSize(char, fontSize);
            x += width + spacing;
          }

          page.drawText(patient.socialSecurity.firstName , { x: xStart , y: 350, size: 10, font });
          page.drawText(patient.socialSecurity.lastName  , { x: xStart , y: 330, size: 10, font });
          page.drawText(patient.socialSecurity.address || 'N/A', { x: xStart, y: 310, size: 10, font });
          page.drawText(patient.socialSecurity.codePostal || 'N/A', { x: xStart, y: 275, size: 10, font });

          page.drawText(patient.firstName , { x: xStart , y: 185, size: 10, font });
          page.drawText(patient.lastName  , { x: xStart , y: 168, size: 10, font });
          page.drawText(patient.dob  , { x: xStart , y: 149, size: 10, font });
          page.drawText(patient.phone  , { x: 620, y: 133, size: 10, font });

  
        }


        acts.slice(0, 10).forEach(selectedAct => {
            const { date, dent, cps, code, cotation, honoraire } = selectedAct;
            // --- Consultation Info ---
            pageConsultation.drawText(format(new Date(date), 'dd/MM/yy'), { x: 65, y: yConsultation, size: 10, font });
            pageConsultation.drawText('CD', { x: 115, y: yConsultation, size: 10, font });
            pageConsultation.drawText('50.000', { x: 145, y: yConsultation, size: 10, font });
            pageConsultation.drawText(cps || '', { x: 205, y: yConsultation, size: 9, font });

            // --- Acts Info ---
            page.drawText(format(new Date(date), 'dd/MM/yy'), { x: 60, y: yPosition, size: 10, font });
            page.drawText(dent || '', { x: 110, y: yPosition, size: 10, font });
            page.drawText(code || '', { x: 140, y: yPosition, size: 9, font });
            page.drawText(cotation || '', { x: 220, y: yPosition, size: 10, font });
            page.drawText(honoraire?.toFixed(3) || '0.000', { x: 245, y: yPosition, size: 10, font });
            page.drawText(cps || '', { x: 295, y: yPosition, size: 10, font });
            yPosition -= lineHeight;

          });

        const totalHonoraire = acts.reduce((sum, item) => sum + (item.honoraire || 0), 0);
        page.drawText("Total = "+totalHonoraire.toFixed(3), { x: 245, y: 340, size: 11, font });



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
