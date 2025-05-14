
'use client';

import React from 'react';
import type { FullAnalysisResult } from '@/lib/types/careerfit-types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { FileScan, Lightbulb, ClipboardList, CheckCircle, AlertTriangle, MessageSquare } from 'lucide-react';
import InteractiveInterview from './interactive-interview'; // Import the new component

interface ResultsDisplayProps {
  results: FullAnalysisResult;
}

const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ results }) => {
  const { resumeFit, resumeImprovements, interviewScript } = results;

  // Helper to format multiline strings into paragraphs
  const formatMultilineText = (text: string | undefined) => {
    if (!text) return <p>No information available.</p>;
    return text.split('\n').map((paragraph, index) => (
      <p key={index} className="mb-2 last:mb-0">{paragraph || <br />}</p>
    ));
  };

  // Helper to process suggestion strings: converts **text** to <b>text</b>
  const processSuggestionMarkdownToHtml = (markdownText: string): string => {
    // Replace **bold** with <b>bold</b>
    // This specifically targets the Markdown double-asterisk syntax.
    return markdownText.replace(/\*\*(.*?)\*\*/g, '<b>$1</b>');
  };

  return (
    <div className="space-y-8 mt-10">
      <h2 className="text-3xl font-bold text-center text-primary">Your CareerFit AI Analysis</h2>
      
      <Accordion type="multiple" defaultValue={['resume-fit', 'improvements', 'interview-script-static', 'interactive-interview']} className="w-full space-y-6">
        
        {/* Resume Fit Analysis Card */}
        <AccordionItem value="resume-fit" className="border-none">
          <Card className="shadow-lg overflow-hidden">
            <AccordionTrigger className="w-full hover:no-underline">
              <CardHeader className="flex flex-row items-center justify-between w-full p-6">
                <div className="flex items-center">
                  <FileScan className="h-8 w-8 mr-3 text-primary" />
                  <div>
                    <CardTitle className="text-2xl font-semibold">Resume Fit Analysis</CardTitle>
                    <CardDescription>How well your resume matches the job description.</CardDescription>
                  </div>
                </div>
              </CardHeader>
            </AccordionTrigger>
            <AccordionContent>
              <CardContent className="p-6 space-y-6">
                <div className="space-y-2">
                  <div className="flex justify-between items-center mb-1">
                    <h4 className="text-lg font-semibold text-foreground">Fit Score:</h4>
                    <Badge variant="outline" className={`text-xl font-bold border-2 px-3 py-1 ${resumeFit.fitScore > 70 ? "border-green-500 text-green-600" : resumeFit.fitScore > 40 ? "border-yellow-500 text-yellow-600" : "border-red-500 text-red-600"}`}>
                      {resumeFit.fitScore} / 100
                    </Badge>
                  </div>
                  <Progress value={resumeFit.fitScore} className="w-full h-3 [&>div]:bg-primary" />
                   <p className="text-sm text-muted-foreground mt-1">
                    {resumeFit.fitScore >= 75 && <><CheckCircle className="inline h-4 w-4 mr-1 text-green-500" />Great fit! Your resume strongly aligns with the job.</>}
                    {resumeFit.fitScore >= 50 && resumeFit.fitScore < 75 && <><AlertTriangle className="inline h-4 w-4 mr-1 text-yellow-500" />Good fit, but there's room for improvement.</>}
                    {resumeFit.fitScore < 50 && <><AlertTriangle className="inline h-4 w-4 mr-1 text-red-500" />Needs improvement to better match the job requirements.</>}
                  </p>
                </div>

                <div className="space-y-2">
                  <h4 className="text-lg font-semibold text-foreground">Feedback:</h4>
                  <div className="text-sm text-muted-foreground p-4 bg-secondary/30 rounded-md shadow-inner">
                    {formatMultilineText(resumeFit.feedback)}
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="text-lg font-semibold text-foreground">Targeted Suggestions:</h4>
                   <div className="text-sm text-muted-foreground p-4 bg-secondary/30 rounded-md shadow-inner">
                    {formatMultilineText(resumeFit.suggestions)}
                  </div>
                </div>
              </CardContent>
            </AccordionContent>
          </Card>
        </AccordionItem>

        {/* Resume Improvement Suggestions Card */}
        <AccordionItem value="improvements" className="border-none">
           <Card className="shadow-lg overflow-hidden">
            <AccordionTrigger className="w-full hover:no-underline">
              <CardHeader className="flex flex-row items-center justify-between w-full p-6">
                <div className="flex items-center">
                  <Lightbulb className="h-8 w-8 mr-3 text-accent" />
                  <div>
                    <CardTitle className="text-2xl font-semibold">Resume Improvement Suggestions</CardTitle>
                    <CardDescription>Actionable tips to enhance your resume for this role.</CardDescription>
                  </div>
                </div>
              </CardHeader>
            </AccordionTrigger>
            <AccordionContent>
              <CardContent className="p-6">
                {resumeImprovements.improvements && resumeImprovements.improvements.length > 0 ? (
                  <ul className="space-y-3 list-disc list-inside pl-2">
                    {resumeImprovements.improvements.map((suggestionText, index) => {
                      const processedSuggestionHtml = processSuggestionMarkdownToHtml(suggestionText);
                      return (
                        <li key={index} className="text-sm text-foreground leading-relaxed">
                          <strong className="text-accent">Suggestion {index + 1}:</strong>
                          {' '}
                          <span dangerouslySetInnerHTML={{ __html: processedSuggestionHtml }} />
                        </li>
                      );
                    })}
                  </ul>
                ) : (
                  <p className="text-sm text-muted-foreground">No specific improvement suggestions available at this time. Your resume might be a good fit already, or more details are needed.</p>
                )}
              </CardContent>
            </AccordionContent>
          </Card>
        </AccordionItem>

        {/* Static Interview Script Card (List of Questions) */}
        <AccordionItem value="interview-script-static" className="border-none">
          <Card className="shadow-lg overflow-hidden">
            <AccordionTrigger className="w-full hover:no-underline">
               <CardHeader className="flex flex-row items-center justify-between w-full p-6">
                 <div className="flex items-center">
                    <ClipboardList className="h-8 w-8 mr-3 text-primary" />
                    <div>
                      <CardTitle className="text-2xl font-semibold">Generated Interview Questions</CardTitle>
                      <CardDescription>Review the AI-generated questions for your mock interview.</CardDescription>
                    </div>
                  </div>
               </CardHeader>
            </AccordionTrigger>
            <AccordionContent>
              <CardContent className="p-6">
                {interviewScript.questions && interviewScript.questions.length > 0 ? (
                  <div className="p-4 bg-secondary/30 rounded-md shadow-inner max-h-96 overflow-y-auto">
                    <ul className="space-y-3 list-decimal list-inside">
                      {interviewScript.questions.map((question, index) => (
                        <li key={index} className="text-sm text-foreground leading-relaxed">
                          {question}
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">Interview questions could not be generated. Please ensure all inputs are correctly provided.</p>
                )}
              </CardContent>
            </AccordionContent>
          </Card>
        </AccordionItem>

        {/* Interactive Mock Interview Card */}
        <AccordionItem value="interactive-interview" className="border-none">
          <Card className="shadow-lg overflow-hidden">
             <AccordionTrigger className="w-full hover:no-underline">
               <CardHeader className="flex flex-row items-center justify-between w-full p-6">
                  <div className="flex items-center">
                    <MessageSquare className="h-8 w-8 mr-3 text-green-600" />
                    <div>
                      <CardTitle className="text-2xl font-semibold">Interactive Mock Interview</CardTitle>
                      <CardDescription>Practice your responses with AI voice and get feedback.</CardDescription>
                    </div>
                  </div>
                </CardHeader>
             </AccordionTrigger>
             <AccordionContent>
                <CardContent className="p-0 sm:p-2 md:p-4"> {/* Reduce padding on smaller screens for InteractiveInterview component */}
                    {interviewScript.questions && interviewScript.questions.length > 0 ? (
                        <InteractiveInterview questions={interviewScript.questions} />
                    ) : (
                        <p className="text-sm text-muted-foreground p-6">
                            Interactive interview cannot start as no questions were generated.
                        </p>
                    )}
                </CardContent>
             </AccordionContent>
          </Card>
        </AccordionItem>

      </Accordion>
    </div>
  );
};

export default ResultsDisplay;
