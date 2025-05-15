
import { config } from 'dotenv';
config();

import '@/ai/flows/suggest-resume-improvements.ts';
import '@/ai/flows/analyze-resume-fit.ts';
import '@/ai/flows/generate-interview-script.ts';
import '@/ai/flows/analyze-user-response-flow.ts';
import '@/ai/flows/synthesize-speech-flow.ts';
import '@/ai/flows/transcribe-speech-flow.ts';
import '@/ai/flows/generate-tailored-resume-flow.ts'; // Added import
