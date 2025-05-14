// src/ai/flows/generate-interview-script.ts
'use server';

/**
 * @fileOverview Generates a mock interview script based on a job description and resume skills.
 *
 * - generateInterviewScript - A function that generates the interview script.
 * - GenerateInterviewScriptInput - The input type for the generateInterviewScript function.
 * - GenerateInterviewScriptOutput - The return type for the generateInterviewScript function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateInterviewScriptInputSchema = z.object({
  jobDescription: z.string().describe('The job description for the role.'),
  resumeSkills: z.array(z.string()).describe('Skills extracted from the resume.'),
});

export type GenerateInterviewScriptInput = z.infer<typeof GenerateInterviewScriptInputSchema>;

const GenerateInterviewScriptOutputSchema = z.object({
  interviewScript: z.string().describe('The generated interview script.'),
});

export type GenerateInterviewScriptOutput = z.infer<typeof GenerateInterviewScriptOutputSchema>;

export async function generateInterviewScript(input: GenerateInterviewScriptInput): Promise<GenerateInterviewScriptOutput> {
  return generateInterviewScriptFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateInterviewScriptPrompt',
  input: {schema: GenerateInterviewScriptInputSchema},
  output: {schema: GenerateInterviewScriptOutputSchema},
  prompt: `You are an AI-powered interview script generator. You will generate a mock interview script based on the job description and the candidate's resume skills.

Job Description: {{{jobDescription}}}

Resume Skills:
{{#each resumeSkills}}
- {{{this}}}
{{/each}}


Generate a comprehensive interview script with questions that assess the candidate's fit for the role, considering both the job requirements and the candidate's skills. The script should include questions that cover technical skills, behavioral competencies, and cultural fit. The interview script should be formatted for easy readability.
`, 
});

const generateInterviewScriptFlow = ai.defineFlow(
  {
    name: 'generateInterviewScriptFlow',
    inputSchema: GenerateInterviewScriptInputSchema,
    outputSchema: GenerateInterviewScriptOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
