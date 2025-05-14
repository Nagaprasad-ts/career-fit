
import type { 
  AnalyzeResumeFitOutput, 
  SuggestResumeImprovementsOutput, 
  GenerateInterviewScriptOutput as GenkitGenerateInterviewScriptOutput,
  SynthesizeSpeechInput as GenkitSynthesizeSpeechInput,
  SynthesizeSpeechOutput as GenkitSynthesizeSpeechOutput,
  TranscribeSpeechInput as GenkitTranscribeSpeechInput,
  TranscribeSpeechOutput as GenkitTranscribeSpeechOutput,
  AnalyzeUserResponseInput as GenkitAnalyzeUserResponseInput,
  AnalyzeUserResponseOutput as GenkitAnalyzeUserResponseOutput
} from '@/ai/flows';

export interface CareerFitFormData {
  resumeText: string;
  jobDescriptionText: string;
  resumeSkills: string; // Comma-separated string from textarea
}

export type { GenkitGenerateInterviewScriptOutput as GenerateInterviewScriptOutput };

export interface FullAnalysisResult {
  resumeFit: AnalyzeResumeFitOutput;
  resumeImprovements: SuggestResumeImprovementsOutput;
  interviewScript: GenkitGenerateInterviewScriptOutput; 
}

export interface CareerFitAiError {
  message: string;
  source?: 'analyzeResumeFit' | 'suggestResumeImprovements' | 'generateInterviewScript' | 'synthesizeSpeech' | 'transcribeSpeech' | 'analyzeUserResponse' | 'unknown';
}

// Types for new interactive interview features
export type { GenkitSynthesizeSpeechInput as SynthesizeSpeechInput }; 
export type { GenkitSynthesizeSpeechOutput as SynthesizeSpeechOutput }; 
export type { GenkitTranscribeSpeechInput as TranscribeSpeechInput };
export type { GenkitTranscribeSpeechOutput as TranscribeSpeechOutput };
export type { GenkitAnalyzeUserResponseInput as AnalyzeUserResponseInput };
export type { GenkitAnalyzeUserResponseOutput as AnalyzeUserResponseOutput };
