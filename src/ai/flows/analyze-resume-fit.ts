'use server';

/**
 * @fileOverview Analyzes the fit between a resume and a job description, providing a fit score and suggestions.
 *
 * - analyzeResumeFit - A function that analyzes the fit between a resume and a job description.
 * - AnalyzeResumeFitInput - The input type for the analyzeResumeFit function.
 * - AnalyzeResumeFitOutput - The return type for the analyzeResumeFit function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeResumeFitInputSchema = z.object({
  resume: z.string().describe('The resume content as text.'),
  jobDescription: z.string().describe('The job description as text.'),
});
export type AnalyzeResumeFitInput = z.infer<typeof AnalyzeResumeFitInputSchema>;

const AnalyzeResumeFitOutputSchema = z.object({
  fitScore: z.number().describe('A score (0-100) indicating how well the resume matches the job description.'),
  feedback: z.string().describe('Detailed feedback on the resume and its alignment with the job description.'),
  suggestions: z.string().describe('Specific improvements to the resume to better align it with the job requirements.'),
});
export type AnalyzeResumeFitOutput = z.infer<typeof AnalyzeResumeFitOutputSchema>;

export async function analyzeResumeFit(input: AnalyzeResumeFitInput): Promise<AnalyzeResumeFitOutput> {
  return analyzeResumeFitFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeResumeFitPrompt',
  input: {schema: AnalyzeResumeFitInputSchema},
  output: {schema: AnalyzeResumeFitOutputSchema},
  prompt: `You are a career expert. Analyze the resume below against the job description and provide a fit score, feedback, and suggestions.

Resume:
{{{resume}}}

Job Description:
{{{jobDescription}}}

Give me a fit score between 0 and 100, where 100 means the resume is a perfect fit for the job. Then provide detailed feedback on the resume and suggestions on how to improve it to better align with the job requirements.

Output the fitScore, feedback, and suggestions in the JSON format.`,
});

const analyzeResumeFitFlow = ai.defineFlow(
  {
    name: 'analyzeResumeFitFlow',
    inputSchema: AnalyzeResumeFitInputSchema,
    outputSchema: AnalyzeResumeFitOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
