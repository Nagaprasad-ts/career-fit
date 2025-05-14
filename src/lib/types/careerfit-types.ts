import type { 
  AnalyzeResumeFitOutput, 
  SuggestResumeImprovementsOutput, 
  GenerateInterviewScriptOutput as GenkitGenerateInterviewScriptOutput,
  SynthesizeSpeechInput as GenkitSynthesizeSpeechInput, // Import input type
  SynthesizeSpeechOutput as GenkitSynthesizeSpeechOutput, // Import output type
  TranscribeSpeechOutput,
  AnalyzeUserResponseOutput
} from '@/ai/flows';

export interface CareerFitFormData {
  resumeText: string;
  jobDescriptionText: string;
  resumeSkills: string; // Comma-separated string from textarea
}

// Use the modified GenerateInterviewScriptOutput from Genkit which has `questions: string[]`
export type { GenkitGenerateInterviewScriptOutput as GenerateInterviewScriptOutput };

export interface FullAnalysisResult {
  resumeFit: AnalyzeResumeFitOutput;
  resumeImprovements: SuggestResumeImprovementsOutput;
  interviewScript: GenkitGenerateInterviewScriptOutput; // Use the aliased type
}

export interface CareerFitAiError {
  message: string;
  source?: 'analyzeResumeFit' | 'suggestResumeImprovements' | 'generateInterviewScript' | 'synthesizeSpeech' | 'transcribeSpeech' | 'analyzeUserResponse' | 'unknown';
}

// Types for new interactive interview features
export type { GenkitSynthesizeSpeechInput as SynthesizeSpeechInput }; // Export input type
export type { GenkitSynthesizeSpeechOutput as SynthesizeSpeechOutput }; // Export output type
export type { TranscribeSpeechOutput, AnalyzeUserResponseOutput };
