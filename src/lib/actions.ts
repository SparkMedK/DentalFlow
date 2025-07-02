"use server";

import { generateConsultationSummary, ConsultationSummaryInput } from "@/ai/flows/consultation-summary";

export async function getConsultationSummary(input: ConsultationSummaryInput) {
  try {
    const result = await generateConsultationSummary(input);
    return { success: true, summary: result.summary };
  } catch (error) {
    console.error("Error generating consultation summary:", error);
    return { success: false, error: "Failed to generate summary." };
  }
}
