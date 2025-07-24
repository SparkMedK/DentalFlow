
"use client";

import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import { useEffect, useState } from 'react';
import { AssuranceRecord } from './columns';
import { format } from 'date-fns';

export default function CNAMPreview({ record }: { record: AssuranceRecord }) {
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);

  useEffect(() => {
    const generatePdf = async () => {
      // NOTE: You must add cnam.pdf to your /public folder for this to work.
      const formUrl = '/cnam.pdf';
      const formBytes = await fetch(formUrl).then(res => {
        if (!res.ok) {
            throw new Error(`Failed to fetch PDF: ${res.statusText}. Make sure cnam.pdf exists in the /public folder.`);
        }
        return res.arrayBuffer();
      }).catch(err => {
        console.error(err);
        return null;
      });

      if (!formBytes) {
        setPdfUrl(null); // Or set an error state
        return;
      }

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
      const lineHeight = 18; // space between each act line
      
      acts.slice(0, 10).forEach(selectedAct => { // Limit to 10 acts to avoid overflow
          const { act, date, dent, cps } = selectedAct;
          
          page.drawText(format(date, 'dd/MM/yy'), { x: 45, y: yPosition, size: 10, font });
          page.drawText(act.code || '', { x: 100, y: yPosition, size: 9, font });
          page.drawText(dent || '', { x: 200, y: yPosition, size: 10, font });
          page.drawText(act.cotation || '', { x: 230, y: yPosition, size: 10, font });
          page.drawText(act.honoraire?.toFixed(3) || '0.000', { x: 280, y: yPosition, size: 10, font });
          // Assuming CPS goes somewhere, example position:
          page.drawText(cps || '', { x: 360, y: yPosition, size: 10, font });
          
          yPosition -= lineHeight;
      });

      const totalHonoraire = acts.reduce((sum, item) => sum + (item.act.honoraire || 0), 0);
      page.drawText(totalHonoraire.toFixed(3), { x: 280, y: 328, size: 11, font });


      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      setPdfUrl(url);
    };

    if (record) {
        generatePdf();
    }
    
    // Cleanup the object URL on component unmount
    return () => {
        if (pdfUrl) {
            URL.revokeObjectURL(pdfUrl);
        }
    }
  }, [record, pdfUrl]);

  return (
    <div className="w-full h-[80vh]">
      {pdfUrl ? (
        <iframe src={pdfUrl} width="100%" height="100%" className="border" />
      ) : (
        <div className="flex items-center justify-center h-full">
            <p className='text-destructive'>Generating preview... If this takes too long, make sure you have added <strong>cnam.pdf</strong> to your <strong>/public</strong> folder.</p>
        </div>
      )}
    </div>
  );
}
