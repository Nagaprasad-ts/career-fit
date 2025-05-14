'use client';

import React, { useState } from 'react';
import CareerFitForm from '@/components/careerfit-ai/careerfit-form';
import ResultsDisplay from '@/components/careerfit-ai/results-display';
import type { FullAnalysisResult, CareerFitAiError } from '@/lib/types/careerfit-types';
import { Toaster } from '@/components/ui/toaster';
import { useToast } from '@/hooks/use-toast';
import Image from 'next/image';

export default function CareerFitAiPage() {
  const [analysisResults, setAnalysisResults] = useState<FullAnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleAnalysisComplete = (results: FullAnalysisResult) => {
    setAnalysisResults(results);
    toast({
      title: "Analysis Complete!",
      description: "Your resume and job description have been analyzed.",
      variant: "default",
    });
  };

  const handleAnalysisError = (error: CareerFitAiError) => {
    console.error("Analysis Error:", error);
    setAnalysisResults(null); // Clear previous results on error
    toast({
      title: "Analysis Failed",
      description: error.message || "An unknown error occurred. Please try again.",
      variant: "destructive",
    });
  };

  return (
    <>
      <main className="container mx-auto px-4 py-8 md:py-12">
        <header className="text-center mb-10 md:mb-16">
           <div className="inline-flex items-center justify-center mb-4">
             <Image 
                src="https://picsum.photos/seed/careerlogo/80/80" // Placeholder logo
                alt="CareerFit AI Logo" 
                width={80} 
                height={80} 
                className="rounded-xl shadow-md"
                data-ai-hint="abstract logo"
             />
           </div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-primary">
            CareerFit AI
          </h1>
          <p className="mt-3 text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            Elevate your job application with AI-powered resume analysis, improvement suggestions, and mock interview preparation.
          </p>
        </header>

        <div className="max-w-4xl mx-auto">
          <CareerFitForm
            onAnalysisComplete={handleAnalysisComplete}
            onAnalysisError={handleAnalysisError}
            setIsLoading={setIsLoading}
            isLoading={isLoading}
          />
        </div>

        {isLoading && (
          <div className="text-center mt-10">
            {/* You can use a more sophisticated loader/spinner here */}
            <p className="text-lg text-primary animate-pulse">Analyzing your documents, please wait...</p>
          </div>
        )}

        {!isLoading && analysisResults && (
          <div className="mt-10 md:mt-16 max-w-5xl mx-auto">
            <ResultsDisplay results={analysisResults} />
          </div>
        )}
      </main>
      <Toaster />
       <footer className="text-center py-8 mt-12 border-t">
        <p className="text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} CareerFit AI. All rights reserved. Powered by GenAI.
        </p>
      </footer>
    </>
  );
}
