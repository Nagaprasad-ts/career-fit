'use client';

import type { ChangeEvent } from 'react';
import React, { useState, useCallback } from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { AlertCircle, FileText, UploadCloud } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import * as pdfjsLib from 'pdfjs-dist';

// Set workerSrc for pdfjs-dist
if (typeof window !== 'undefined') {
  pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;
}

interface FileInputAreaProps {
  id: string;
  label: string;
  placeholder: string;
  value: string;
  onTextChange: (text: string) => void;
  errorMessage?: string;
  rows?: number;
}

const FileInputArea: React.FC<FileInputAreaProps> = ({
  id,
  label,
  placeholder,
  value,
  onTextChange,
  errorMessage,
  rows = 10,
}) => {
  const [fileError, setFileError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFileChange = useCallback(
    async (event: ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) return;

      setFileError(null);
      setIsProcessing(true);

      try {
        if (file.type === 'text/plain') {
          const text = await file.text();
          onTextChange(text);
        } else if (file.type === 'application/pdf') {
          const arrayBuffer = await file.arrayBuffer();
          const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
          let textContent = '';
          for (let i = 1; i <= pdf.numPages; i++) {
            const page = await pdf.getPage(i);
            const text = await page.getTextContent();
            textContent += text.items.map((item: any) => item.str).join(' ') + '\n';
          }
          onTextChange(textContent);
        } else {
          setFileError('Unsupported file type. Please upload a .txt or .pdf file.');
          onTextChange(''); // Clear text if file is unsupported
        }
      } catch (error) {
        console.error('Error processing file:', error);
        setFileError('Error processing file. Please try again or paste the content manually.');
        onTextChange(''); // Clear text on error
      } finally {
        setIsProcessing(false);
         // Reset file input to allow re-uploading the same file
        event.target.value = '';
      }
    },
    [onTextChange]
  );

  return (
    <div className="space-y-2">
      <Label htmlFor={id} className="flex items-center text-lg font-semibold">
        <FileText className="mr-2 h-5 w-5 text-primary" /> {label}
      </Label>
      <Textarea
        id={id}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onTextChange(e.target.value)}
        className={`min-h-[${rows * 1.5}rem] resize-y border-2 ${errorMessage ? 'border-destructive' : 'border-input'} focus:border-primary transition-colors duration-200`}
        rows={rows}
        aria-invalid={!!errorMessage}
        aria-describedby={errorMessage ? `${id}-error` : undefined}
      />
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pt-1">
        <Label htmlFor={`${id}-file`} className="flex items-center text-sm text-muted-foreground cursor-pointer hover:text-primary transition-colors">
          <UploadCloud className="mr-2 h-4 w-4" />
          Or upload a .txt or .pdf file
        </Label>
         <Input
          id={`${id}-file`}
          type="file"
          accept=".txt,.pdf"
          onChange={handleFileChange}
          className="block w-full max-w-xs text-sm text-muted-foreground file:mr-2 file:py-1.5 file:px-3 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
          disabled={isProcessing}
        />
      </div>
      {isProcessing && <p className="text-sm text-primary animate-pulse">Processing file...</p>}
      {fileError && (
        <Alert variant="destructive" className="mt-2">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{fileError}</AlertDescription>
        </Alert>
      )}
      {errorMessage && (
         <p id={`${id}-error`} className="text-sm text-destructive font-medium flex items-center mt-1">
            <AlertCircle className="h-4 w-4 mr-1" />
            {errorMessage}
        </p>
      )}
    </div>
  );
};

export default FileInputArea;
