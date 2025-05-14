import type { 
  AnalyzeResumeFitOutput, 
  SuggestResumeImprovementsOutput, 
  GenerateInterviewScriptOutput as GenkitGenerateInterviewScriptOutput, // Rename to avoid conflict
  SynthesizeSpeechOutput,
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
export type { SynthesizeSpeechOutput, TranscribeSpeechOutput, AnalyzeUserResponseOutput };

export interface InteractiveInterviewResponse {
    audioDataUri?: string; // For TTS of question
    transcription?: string; // For STT of user answer
    analysis?: AnalyzeUserResponseOutput; // For feedback on user answer
    error?: string;
}
