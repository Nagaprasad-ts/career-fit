'use server';
/**
 * @fileOverview Analyzes a user's transcribed interview response.
 *
 * - analyzeUserResponse - Analyzes response for style, confidence, relevance.
 * - AnalyzeUserResponseInput - Input type for analyzeUserResponse.
 * - AnalyzeUserResponseOutput - Output type for analyzeUserResponse.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeUserResponseInputSchema = z.object({
  transcribedResponse: z.string().describe("The user's transcribed verbal response to an interview question."),
  interviewQuestion: z.string().describe('The interview question the user was responding to.'),
});
export type AnalyzeUserResponseInput = z.infer<typeof AnalyzeUserResponseInputSchema>;

const AnalyzeUserResponseOutputSchema = z.object({
  communicationStyle: z.string().describe('Feedback on the user communication style (e.g., clarity, tone).'),
  confidenceLevel: z.string().describe('Assessment of the user confidence level conveyed in the response.'),
  contentRelevance: z.string().describe('Analysis of how relevant the response content was to the question.'),
  overallFeedback: z.string().describe('Overall constructive feedback and suggestions for improvement.'),
});
export type AnalyzeUserResponseOutput = z.infer<typeof AnalyzeUserResponseOutputSchema>;

export async function analyzeUserResponse(input: AnalyzeUserResponseInput): Promise<AnalyzeUserResponseOutput> {
  return analyzeUserResponseFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeUserResponsePrompt',
  input: {schema: AnalyzeUserResponseInputSchema},
  output: {schema: AnalyzeUserResponseOutputSchema},
  prompt: `You are an expert interview coach. Analyze the user's transcribed response to an interview question.

Interview Question:
"{{{interviewQuestion}}}"

User's Transcribed Response:
"{{{transcribedResponse}}}"

Provide an analysis covering the following aspects:
1.  **Communication Style**: Evaluate clarity, conciseness, tone, and professionalism.
2.  **Confidence Level**: Assess the perceived confidence based on the language used.
3.  **Content Relevance**: Determine how well the response addresses the question directly and thoroughly.
4.  **Overall Feedback**: Offer constructive feedback and specific, actionable suggestions for improvement.

Structure your output in the specified JSON format.
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

const analyzeUserResponseFlow = ai.defineFlow(
  {
    name: 'analyzeUserResponseFlow',
    inputSchema: AnalyzeUserResponseInputSchema,
    outputSchema: AnalyzeUserResponseOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    return output!;
  }
);
