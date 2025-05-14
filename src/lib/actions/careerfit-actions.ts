'use server';

import { analyzeResumeFit, suggestResumeImprovements, generateInterviewScript } from '@/ai/flows';
import type { CareerFitFormData, FullAnalysisResult, CareerFitAiError } from '@/lib/types/careerfit-types';

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
        // Provide a default or handle as an error if skills are critical for script generation and none are provided
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
      errorSource = error.source;
    } else if (error && error.message) {
      errorMessage = error.message;
    }
    
    return { result: null, error: { message: errorMessage, source: errorSource } };
  }
}
