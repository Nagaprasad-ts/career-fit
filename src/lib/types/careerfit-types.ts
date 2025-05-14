import type { AnalyzeResumeFitOutput, SuggestResumeImprovementsOutput, GenerateInterviewScriptOutput } from '@/ai/flows';

export interface CareerFitFormData {
  resumeText: string;
  jobDescriptionText: string;
  resumeSkills: string; // Comma-separated string from textarea
}

export interface FullAnalysisResult {
  resumeFit: AnalyzeResumeFitOutput;
  resumeImprovements: SuggestResumeImprovementsOutput;
  interviewScript: GenerateInterviewScriptOutput;
}

export interface CareerFitAiError {
  message: string;
  source?: 'analyzeResumeFit' | 'suggestResumeImprovements' | 'generateInterviewScript' | 'unknown';
}
