
'use server';
/**
 * @fileOverview Generates a tailored resume based on an original resume, job description, and key skills.
 *
 * - generateTailoredResume - A function that orchestrates the resume generation.
 * - GenerateTailoredResumeInput - The input type for the generateTailoredResume function.
 * - GenerateTailoredResumeOutput - The return type for the generateTailoredResume function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateTailoredResumeInputSchema = z.object({
  originalResume: z.string().describe('The original resume content as text.'),
  jobDescription: z.string().describe('The job description as text.'),
  keySkills: z.array(z.string()).describe('A list of key skills to emphasize.'),
});
export type GenerateTailoredResumeInput = z.infer<typeof GenerateTailoredResumeInputSchema>;

const GenerateTailoredResumeOutputSchema = z.object({
  tailoredResumeText: z.string().describe('The full text of the newly generated, tailored resume.'),
});
export type GenerateTailoredResumeOutput = z.infer<typeof GenerateTailoredResumeOutputSchema>;

export async function generateTailoredResume(input: GenerateTailoredResumeInput): Promise<GenerateTailoredResumeOutput> {
  return generateTailoredResumeFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateTailoredResumePrompt',
  input: {schema: GenerateTailoredResumeInputSchema},
  output: {schema: GenerateTailoredResumeOutputSchema},
  prompt: `You are an expert resume writer and career coach. You will be given an original resume, a job description, and a list of key skills.

Your task is to generate a new, tailored resume based on the original resume's content and structure, but optimized to highlight the candidate's suitability for the specific job description. Incorporate the provided key skills effectively.

Ensure the generated resume is professional, concise, and impactful. Focus on aligning the candidate's experience and skills with the requirements of the job description. Maintain a similar tone and style to the original resume where appropriate, but prioritize clarity and effectiveness for the target role.

Original Resume:
{{{originalResume}}}

Job Description:
{{{jobDescription}}}

Key Skills to Emphasize:
{{#each keySkills}}
- {{{this}}}
{{/each}}

Return the full text of the generated tailored resume in the 'tailoredResumeText' field of the JSON output.
`,
  config: {
    safetySettings: [
      { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
      { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
      { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
      { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
    ],
  },
});

const generateTailoredResumeFlow = ai.defineFlow(
  {
    name: 'generateTailoredResumeFlow',
    inputSchema: GenerateTailoredResumeInputSchema,
    outputSchema: GenerateTailoredResumeOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    if (!output) {
      throw new Error('No output received from the AI model for resume generation.');
    }
    return output;
  }
);

