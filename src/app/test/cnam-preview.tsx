"use client";

import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import { useEffect, useState } from 'react';

export default function CNAMPreview({ patient, consultation }: { patient: any, consultation: any}) {
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

      const pdfDoc = await PDFDocument.load(formBytes);
      const page = pdfDoc.getPage(0);
      const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

      // 📝 Example Data Overlay
      page.drawText(patient?.name || 'Patient Name', {
        x: 90, // Adjust based on your PDF layout
        y: 615,
        size: 10,
        font,
        color: rgb(0, 0, 0),
      });

      page.drawText(patient?.cin || 'CIN123456', {
        x: 90,
        y: 600,
        size: 10,
        font,
        color: rgb(0, 0, 0),
      });

      page.drawText(consultation?.actCode || 'C01', {
        x: 80,
        y: 490,
        size: 10,
        font,
        color: rgb(0, 0, 0),
      });

      page.drawText(consultation?.price?.toString() || '100.000', {
        x: 200,
        y: 490,
        size: 10,
        font,
        color: rgb(0, 0, 0),
      });

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      setPdfUrl(url);
    };

    if (patient && consultation) {
        generatePdf();
    }
    
    // Cleanup the object URL on component unmount
    return () => {
        if (pdfUrl) {
            URL.revokeObjectURL(pdfUrl);
        }
    }
  }, [patient, consultation]);

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
