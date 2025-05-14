
'use server';

import { 
  analyzeResumeFit, 
  suggestResumeImprovements, 
  generateInterviewScript,
  analyzeUserResponse,
  synthesizeSpeech,
  transcribeSpeech 
} from '@/ai/flows';
import type { 
  CareerFitFormData, 
  FullAnalysisResult, 
  CareerFitAiError,
  SynthesizeSpeechInput,
  SynthesizeSpeechOutput,
  TranscribeSpeechInput,
  TranscribeSpeechOutput,
  AnalyzeUserResponseInput,
  AnalyzeUserResponseOutput
} from '@/lib/types/careerfit-types';

export async function performFullAnalysis(
  data: CareerFitFormData
): Promise<{ result: FullAnalysisResult | null; error: CareerFitAiError | null }> {
  try {
    const { resumeText, jobDescriptionText, resumeSkills } = data;

    if (!resumeText || !jobDescriptionText) {
      return { result: null, error: { message: 'Resume and Job Description text cannot be empty.' } };
    }
    
    const skillsArray = resumeSkills ? resumeSkills.split(',').map(skill => skill.trim()).filter(skill => skill.length > 0) : [];
    if (skillsArray.length === 0) {
        console.warn("No resume skills provided for interview script generation. Proceeding with job description only.");
    }

    const [fitResult, improvementResult, scriptResult] = await Promise.all([
      analyzeResumeFit({ resume: resumeText, jobDescription: jobDescriptionText })
        .catch(e => { throw { source: 'analyzeResumeFit', error: e }; }),
      suggestResumeImprovements({ resume: resumeText, jobDescription: jobDescriptionText })
        .catch(e => { throw { source: 'suggestResumeImprovements', error: e }; }),
      generateInterviewScript({ jobDescription: jobDescriptionText, resumeSkills: skillsArray })
        .catch(e => { throw { source: 'generateInterviewScript', error: e }; }),
    ]);

    return {
      result: {
        resumeFit: fitResult,
        resumeImprovements: improvementResult,
        interviewScript: scriptResult,
      },
      error: null,
    };
  } catch (error: any) {
    console.error('Error in performFullAnalysis:', error);
    let errorMessage = 'An unexpected error occurred during analysis.';
    let errorSource: CareerFitAiError['source'] = 'unknown';

    if (error && error.source && error.error && error.error.message) {
      errorMessage = `Error in ${error.source}: ${error.error.message}`;
      errorSource = error.source as CareerFitAiError['source'];
    } else if (error && error.message) {
      errorMessage = error.message;
    }
    
    return { result: null, error: { message: errorMessage, source: errorSource } };
  }
}

export async function getTextToSpeech(
  input: SynthesizeSpeechInput
): Promise<{ audioDataUri: string | null; error: string | null }> {
  try {
    const result: SynthesizeSpeechOutput = await synthesizeSpeech(input);
    return { audioDataUri: result.audioDataUri, error: null };
  } catch (e: any) {
    console.error('Error in getTextToSpeech:', e);
    return { audioDataUri: null, error: e.message || 'Failed to synthesize speech.' };
  }
}

export async function getSpeechToText(
  input: TranscribeSpeechInput 
): Promise<{ transcription: string | null; error: string | null }> {
  try {
    const result: TranscribeSpeechOutput = await transcribeSpeech(input);
    return { transcription: result.transcription, error: null };
  } catch (e: any) {
    console.error('Error in getSpeechToText:', e);
    return { transcription: null, error: e.message || 'Failed to transcribe speech.' };
  }
}

export async function analyzeSpokenResponse(
  input: AnalyzeUserResponseInput
): Promise<{ analysis: AnalyzeUserResponseOutput | null; error: string | null }> {
  try {
    const result: AnalyzeUserResponseOutput = await analyzeUserResponse(input);
    return { analysis: result, error: null };
  } catch (e: any) {
    console.error('Error in analyzeSpokenResponse:', e);
    return { analysis: null, error: e.message || 'Failed to analyze response.' };
  }
}
