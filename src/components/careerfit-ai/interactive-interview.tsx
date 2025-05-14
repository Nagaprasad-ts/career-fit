'use client';

import React, { useState, useEffect, useCallback } from 'react';
import type { AnalyzeUserResponseOutput } from '@/lib/types/careerfit-types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Mic, StopCircle, Play, SkipForward, Volume2, MessageSquare, Info } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { getTextToSpeech, getSpeechToText, analyzeSpokenResponse } from '@/lib/actions/careerfit-actions';
import { useToast } from '@/hooks/use-toast';

interface InteractiveInterviewProps {
  questions: string[];
  jobDescription?: string; // Optional: For context, though questions are already tailored
}

const InteractiveInterview: React.FC<InteractiveInterviewProps> = ({ questions }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isQuestionPlaying, setIsQuestionPlaying] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [userTranscript, setUserTranscript] = useState<string | null>(null);
  const [responseAnalysis, setResponseAnalysis] = useState<AnalyzeUserResponseOutput | null>(null);
  const [isLoading, setIsLoading] = useState<'tts' | 'stt' | 'analysis' | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [audioPlayer, setAudioPlayer] = useState<HTMLAudioElement | null>(null);

  const { toast } = useToast();

  useEffect(() => {
    const newAudioPlayer = new Audio();
    setAudioPlayer(newAudioPlayer);

    return () => {
      if (newAudioPlayer) {
        newAudioPlayer.pause();
        newAudioPlayer.src = '';
      }
    };
  }, []);
  
  const currentQuestion = questions[currentQuestionIndex];

  const handlePlayQuestion = async () => {
    if (!currentQuestion || !audioPlayer) return;
    setIsLoading('tts');
    setError(null);
    try {
      const { audioDataUri, error: ttsError } = await getTextToSpeech({ text: currentQuestion });
      if (ttsError || !audioDataUri) {
        throw new Error(ttsError || 'Failed to get audio for the question.');
      }
      audioPlayer.src = audioDataUri;
      audioPlayer.play();
      setIsQuestionPlaying(true);
      audioPlayer.onended = () => setIsQuestionPlaying(false);
    } catch (e: any) {
      setError(e.message);
      toast({ title: 'Error', description: e.message, variant: 'destructive' });
    } finally {
      setIsLoading(null);
    }
  };

  const handleStartRecording = () => {
    // Placeholder: Actual microphone recording logic would be complex and involve browser APIs
    // For now, we simulate it and move to a state where the user can "submit" a mock recording.
    setIsRecording(true);
    setUserTranscript(null); // Clear previous transcript
    setResponseAnalysis(null); // Clear previous analysis
    setError(null);
    toast({ title: 'Recording Started', description: 'Please speak your answer. (This is a simulation)' });
  };

  const handleStopRecordingAndAnalyze = async () => {
    setIsRecording(false);
    setIsLoading('stt');
    setError(null);
    toast({ title: 'Recording Stopped', description: 'Processing your response... (Simulating STT and Analysis)' });

    try {
      // Simulate STT by using a placeholder audio URI or directly using a mock transcript
      // In a real app, you'd send actual recorded audioDataUri
      const { transcription, error: sttError } = await getSpeechToText({ audioDataUri: 'data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAVFYAAFRWAAABAAgAZGF0YQAAAAA=' }); // Placeholder silent WAV
      if (sttError || transcription === null) {
        throw new Error(sttError || 'Failed to transcribe your response.');
      }
      setUserTranscript(transcription);
      setIsLoading('analysis');

      const { analysis, error: analysisError } = await analyzeSpokenResponse({
        transcribedResponse: transcription,
        interviewQuestion: currentQuestion,
      });
      if (analysisError || !analysis) {
        throw new Error(analysisError || 'Failed to analyze your response.');
      }
      setResponseAnalysis(analysis);
      toast({ title: 'Analysis Complete', description: 'Feedback on your response is available.' });
    } catch (e: any) {
      setError(e.message);
      setUserTranscript(null);
      setResponseAnalysis(null);
      toast({ title: 'Error', description: e.message, variant: 'destructive' });
    } finally {
      setIsLoading(null);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setUserTranscript(null);
      setResponseAnalysis(null);
      setError(null);
      if (audioPlayer) audioPlayer.pause();
      setIsQuestionPlaying(false);
    } else {
      toast({ title: 'Interview Complete', description: 'You have answered all questions.' });
    }
  };
  
  const progressPercentage = ((currentQuestionIndex + 1) / questions.length) * 100;

  return (
    <Card className="w-full shadow-xl mt-8">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-primary flex items-center">
          <MessageSquare className="mr-3 h-7 w-7" /> Interactive Mock Interview
        </CardTitle>
        <CardDescription>
          Practice your responses. Questions will be read out, and you can record your answers for AI analysis.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6 p-6">
        {error && (
          <Alert variant="destructive">
            <Info className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="space-y-2">
            <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Question {currentQuestionIndex + 1} of {questions.length}</h3>
                <Button 
                    onClick={handlePlayQuestion} 
                    variant="outline" 
                    size="sm"
                    disabled={isLoading === 'tts' || isQuestionPlaying}
                >
                    {isLoading === 'tts' ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Volume2 className="h-4 w-4 mr-2" />}
                    {isQuestionPlaying ? 'Playing...' : 'Read Question'}
                </Button>
            </div>
            <Progress value={progressPercentage} className="w-full h-2 [&>div]:bg-primary" />
            <p className="text-md text-foreground p-4 bg-secondary/30 rounded-md shadow-inner min-h-[60px]">
                {currentQuestion || "Loading question..."}
            </p>
        </div>
        
        <div className="space-y-4">
          {!isRecording ? (
            <Button 
              onClick={handleStartRecording} 
              className="w-full sm:w-auto text-lg px-6 py-5 bg-green-600 hover:bg-green-700 text-white"
              disabled={isLoading !== null}
            >
              <Mic className="mr-2 h-5 w-5" /> Start Recording Answer
            </Button>
          ) : (
            <Button 
              onClick={handleStopRecordingAndAnalyze} 
              className="w-full sm:w-auto text-lg px-6 py-5 bg-red-600 hover:bg-red-700 text-white"
              disabled={isLoading !== null}
            >
              {isLoading === 'stt' || isLoading === 'analysis' ? (
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              ) : (
                <StopCircle className="mr-2 h-5 w-5" />
              )}
              Stop Recording & Analyze
            </Button>
          )}
          {isRecording && <p className="text-sm text-center text-primary animate-pulse">Recording... (Simulated)</p>}
        </div>

        {isLoading === 'stt' && <p className="text-sm text-center text-primary animate-pulse">Transcribing your speech...</p>}
        {userTranscript && (
          <div className="space-y-2">
            <h4 className="text-md font-semibold">Your Transcribed Response:</h4>
            <Textarea value={userTranscript} readOnly rows={4} className="bg-muted/50"/>
          </div>
        )}
        
        {isLoading === 'analysis' && <p className="text-sm text-center text-primary animate-pulse">Analyzing your response...</p>}
        {responseAnalysis && (
          <Card className="bg-background border-primary/30">
            <CardHeader>
              <CardTitle className="text-xl text-primary">Response Feedback</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div>
                <strong className="text-foreground">Communication Style:</strong>
                <p className="text-muted-foreground">{responseAnalysis.communicationStyle}</p>
              </div>
              <div>
                <strong className="text-foreground">Confidence Level:</strong>
                <p className="text-muted-foreground">{responseAnalysis.confidenceLevel}</p>
              </div>
              <div>
                <strong className="text-foreground">Content Relevance:</strong>
                <p className="text-muted-foreground">{responseAnalysis.contentRelevance}</p>
              </div>
              <div>
                <strong className="text-foreground">Overall Feedback & Suggestions:</strong>
                <p className="text-muted-foreground">{responseAnalysis.overallFeedback}</p>
              </div>
            </CardContent>
          </Card>
        )}
      </CardContent>
      <CardFooter className="border-t px-6 py-4">
        <Button 
            onClick={handleNextQuestion} 
            disabled={isLoading !== null || currentQuestionIndex >= questions.length - 1 || isRecording}
            className="w-full sm:w-auto"
        >
            <SkipForward className="mr-2 h-5 w-5" /> Next Question
        </Button>
      </CardFooter>
    </Card>
  );
};

export default InteractiveInterview;
