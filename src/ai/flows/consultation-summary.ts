'use server';

/**
 * @fileOverview Generates a summary of a patient consultation, including key findings,
 * treatment plans, and follow-up actions.
 *
 * - generateConsultationSummary - A function that generates the consultation summary.
 * - ConsultationSummaryInput - The input type for the generateConsultationSummary function.
 * - ConsultationSummaryOutput - The return type for the generateConsultationSummary function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ConsultationSummaryInputSchema = z.object({
  patientName: z.string().describe('The name of the patient.'),
  consultationNotes: z.string().describe('Detailed notes from the consultation.'),
  treatmentPlan: z.string().describe('The planned treatment for the patient.'),
  followUpActions: z.string().describe('Any follow-up actions required for the patient.'),
  patientHistory: z.string().describe('The patient medical history.'),
});

export type ConsultationSummaryInput = z.infer<typeof ConsultationSummaryInputSchema>;

const ConsultationSummaryOutputSchema = z.object({
  summary: z.string().describe('A comprehensive summary of the consultation.'),
});

export type ConsultationSummaryOutput = z.infer<typeof ConsultationSummaryOutputSchema>;

export async function generateConsultationSummary(
  input: ConsultationSummaryInput
): Promise<ConsultationSummaryOutput> {
  return consultationSummaryFlow(input);
}

const consultationSummaryPrompt = ai.definePrompt({
  name: 'consultationSummaryPrompt',
  input: {schema: ConsultationSummaryInputSchema},
  output: {schema: ConsultationSummaryOutputSchema},
  prompt: `You are an experienced dentist summarizing patient consultation notes.

  Based on the following information, generate a concise and informative summary of the consultation, 
  including key findings, the treatment plan, and any necessary follow-up actions.

  Patient Name: {{{patientName}}}
  Consultation Notes: {{{consultationNotes}}}
  Treatment Plan: {{{treatmentPlan}}}
  Follow-Up Actions: {{{followUpActions}}}
  Patient Medical History: {{{patientHistory}}}

  Summary:`, // Removed explicit instruction for output format; relying on schema description.
});

const consultationSummaryFlow = ai.defineFlow(
  {
    name: 'consultationSummaryFlow',
    inputSchema: ConsultationSummaryInputSchema,
    outputSchema: ConsultationSummaryOutputSchema,
  },
  async input => {
    const {output} = await consultationSummaryPrompt(input);
    return output!;
  }
);
