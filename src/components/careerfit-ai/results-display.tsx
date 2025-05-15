
'use client';

import React, { useState } from 'react';
import type { FullAnalysisResult, CareerFitAiError } from '@/lib/types/careerfit-types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { FileScan, Lightbulb, ClipboardList, CheckCircle, AlertTriangle, MessageSquare, FileText, Loader2, Wand2, Info } from 'lucide-react';
import InteractiveInterview from './interactive-interview';
import { generateTailoredResumeAction } from '@/lib/actions/careerfit-actions';
import { useToast } from '@/hooks/use-toast';


interface ResultsDisplayProps {
  results: FullAnalysisResult;
  originalResumeText: string;
  originalJobDescriptionText: string;
  originalSkillsString: string; // Comma-separated string
}

const ResultsDisplay: React.FC<ResultsDisplayProps> = ({
  results,
  originalResumeText,
  originalJobDescriptionText,
  originalSkillsString,
}) => {
  const { resumeFit, resumeImprovements, interviewScript } = results;
  const { toast } = useToast();

  const [generatedResumeText, setGeneratedResumeText] = useState<string | null>(null);
  const [isGeneratingResume, setIsGeneratingResume] = useState(false);
  const [resumeGenerationError, setResumeGenerationError] = useState<string | null>(null);

  // Helper to format multiline strings into paragraphs
  const formatMultilineText = (text: string | undefined) => {
    if (!text) return <p>No information available.</p>;
    return text.split('\n').map((paragraph, index) => (
      <p key={index} className="mb-2 last:mb-0">{paragraph || <br />}</p>
    ));
  };

  // Helper to process suggestion strings: converts **text** to <b>text</b>
  const processSuggestionMarkdownToHtml = (markdownText: string): string => {
    return markdownText.replace(/\*\*(.*?)\*\*/g, '<b>$1</b>');
  };

  const handleGenerateTailoredResume = async () => {
    setIsGeneratingResume(true);
    setResumeGenerationError(null);
    setGeneratedResumeText(null);

    const skillsArray = originalSkillsString ? originalSkillsString.split(',').map(skill => skill.trim()).filter(skill => skill.length > 0) : [];

    try {
      const response = await generateTailoredResumeAction({
        originalResume: originalResumeText,
        jobDescription: originalJobDescriptionText,
        keySkills: skillsArray,
      });

      if (response.error) {
        throw new Error(response.error.message);
      }
      if (response.tailoredResumeText) {
        setGeneratedResumeText(response.tailoredResumeText);
        toast({
          title: "Tailored Resume Generated!",
          description: "Your new resume is ready.",
          variant: "default",
        });
      } else {
        throw new Error("AI did not return a resume. Please try again.");
      }
    } catch (error: any) {
      console.error("Resume Generation Error:", error);
      setResumeGenerationError(error.message || "An unknown error occurred while generating the resume.");
      toast({
        title: "Resume Generation Failed",
        description: error.message || "An unknown error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGeneratingResume(false);
    }
  };


  return (
    <div className="space-y-8 mt-10">
      <h2 className="text-3xl font-bold text-center text-primary">Your CareerFit AI Analysis</h2>

      <Accordion type="multiple" defaultValue={['resume-fit', 'improvements', 'interview-script-static', 'interactive-interview', 'tailored-resume']} className="w-full space-y-6">

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
                <CardContent className="p-0 sm:p-2 md:p-4">
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

        {/* Tailored Resume Generator Card */}
        <AccordionItem value="tailored-resume" className="border-none">
          <Card className="shadow-lg overflow-hidden">
            <AccordionTrigger className="w-full hover:no-underline">
              <CardHeader className="flex flex-row items-center justify-between w-full p-6">
                <div className="flex items-center">
                  <FileText className="h-8 w-8 mr-3 text-purple-600" />
                  <div>
                    <CardTitle className="text-2xl font-semibold">Tailored Resume Generator</CardTitle>
                    <CardDescription>Generate an AI-optimized resume based on your inputs.</CardDescription>
                  </div>
                </div>
              </CardHeader>
            </AccordionTrigger>
            <AccordionContent>
              <CardContent className="p-6 space-y-4">
                {resumeGenerationError && (
                  <Alert variant="destructive">
                    <Info className="h-4 w-4" />
                    <AlertTitle>Resume Generation Error</AlertTitle>
                    <AlertDescription>{resumeGenerationError}</AlertDescription>
                  </Alert>
                )}
                <Button
                  onClick={handleGenerateTailoredResume}
                  disabled={isGeneratingResume}
                  className="w-full sm:w-auto text-lg px-8 py-6 bg-purple-600 hover:bg-purple-700 text-white"
                >
                  {isGeneratingResume ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Generating Resume...
                    </>
                  ) : (
                    <>
                      <Wand2 className="mr-2 h-5 w-5" />
                      Generate Tailored Resume
                    </>
                  )}
                </Button>
                {isGeneratingResume && (
                  <p className="text-sm text-center text-purple-600 animate-pulse">
                    AI is crafting your resume, please wait...
                  </p>
                )}
                {generatedResumeText && !isGeneratingResume && (
                  <div className="space-y-3 mt-4">
                    <h4 className="text-lg font-semibold text-foreground">Your Generated Tailored Resume:</h4>
                    <Textarea
                      value={generatedResumeText}
                      readOnly
                      rows={20}
                      className="bg-muted/30 border-purple-300 focus:border-purple-500 text-sm p-4 rounded-md shadow-inner"
                      placeholder="Your tailored resume will appear here."
                    />
                     <Button
                        onClick={() => navigator.clipboard.writeText(generatedResumeText)}
                        variant="outline"
                        size="sm"
                        className="mt-2"
                      >
                        Copy Resume to Clipboard
                      </Button>
                  </div>
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
