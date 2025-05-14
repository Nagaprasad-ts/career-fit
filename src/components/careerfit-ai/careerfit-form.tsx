'use client';

import type { SubmitHandler } from 'react-hook-form';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Wand2 } from 'lucide-react';
import FileInputArea from './file-input-area';
import type { CareerFitFormData, FullAnalysisResult, CareerFitAiError } from '@/lib/types/careerfit-types';
import { performFullAnalysis } from '@/lib/actions/careerfit-actions';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const formSchema = z.object({
  resumeText: z.string().min(50, { message: 'Resume text must be at least 50 characters.' }),
  jobDescriptionText: z.string().min(50, { message: 'Job description text must be at least 50 characters.' }),
  resumeSkills: z.string().optional(), // User will input comma-separated skills
});

interface CareerFitFormProps {
  onAnalysisComplete: (results: FullAnalysisResult) => void;
  onAnalysisError: (error: CareerFitAiError) => void;
  setIsLoading: (isLoading: boolean) => void;
  isLoading: boolean;
}

const CareerFitForm: React.FC<CareerFitFormProps> = ({ onAnalysisComplete, onAnalysisError, setIsLoading, isLoading }) => {
  const [serverError, setServerError] = useState<string | null>(null);
  
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CareerFitFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      resumeText: '',
      jobDescriptionText: '',
      resumeSkills: '',
    },
  });

  const resumeText = watch('resumeText');
  const jobDescriptionText = watch('jobDescriptionText');

  const onSubmit: SubmitHandler<CareerFitFormData> = async (data) => {
    setIsLoading(true);
    setServerError(null);
    const response = await performFullAnalysis(data);
    setIsLoading(false);

    if (response.error) {
      onAnalysisError(response.error);
      setServerError(response.error.message);
    } else if (response.result) {
      onAnalysisComplete(response.result);
    }
  };

  return (
    <Card className="w-full shadow-xl">
      <CardHeader>
        <CardTitle className="text-3xl font-bold text-primary flex items-center">
          <Wand2 className="mr-3 h-8 w-8" /> Analyze Your Career Fit
        </CardTitle>
        <CardDescription className="text-md">
          Upload or paste your resume and job description, then add key skills from your resume. Our AI will provide a detailed analysis and improvement suggestions.
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className="space-y-8 p-6">
          {serverError && (
            <Alert variant="destructive">
              <Wand2 className="h-4 w-4" />
              <AlertTitle>Analysis Error</AlertTitle>
              <AlertDescription>{serverError}</AlertDescription>
            </Alert>
          )}
          <FileInputArea
            id="resumeText"
            label="Your Resume"
            placeholder="Paste your full resume text here, or upload a .txt/.pdf file..."
            value={resumeText}
            onTextChange={(text) => setValue('resumeText', text, { shouldValidate: true })}
            errorMessage={errors.resumeText?.message}
          />
          <FileInputArea
            id="jobDescriptionText"
            label="Job Description"
            placeholder="Paste the full job description text here, or upload a .txt/.pdf file..."
            value={jobDescriptionText}
            onTextChange={(text) => setValue('jobDescriptionText', text, { shouldValidate: true })}
            errorMessage={errors.jobDescriptionText?.message}
          />
          <div className="space-y-2">
            <Label htmlFor="resumeSkills" className="text-lg font-semibold">Key Skills from Your Resume</Label>
            <Textarea
              id="resumeSkills"
              placeholder="Enter key skills from your resume, separated by commas (e.g., Project Management, JavaScript, Data Analysis)"
              {...register('resumeSkills')}
              className={`min-h-[4rem] resize-y border-2 ${errors.resumeSkills ? 'border-destructive' : 'border-input'} focus:border-primary transition-colors duration-200`}
              rows={3}
            />
            {errors.resumeSkills && <p className="text-sm text-destructive font-medium">{errors.resumeSkills.message}</p>}
             <p className="text-xs text-muted-foreground">These skills help generate a more relevant mock interview script.</p>
          </div>
        </CardContent>
        <CardFooter className="border-t px-6 py-4">
          <Button type="submit" disabled={isLoading} className="w-full sm:w-auto text-lg px-8 py-6 bg-primary hover:bg-primary/90 text-primary-foreground">
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <Wand2 className="mr-2 h-5 w-5" />
                Start Analysis
              </>
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default CareerFitForm;
