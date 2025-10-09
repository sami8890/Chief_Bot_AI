'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { identifyFoodItem, type IdentifyFoodItemOutput } from '@/ai/flows/identify-food-flow';
import { Upload, X, BrainCircuit, Flame, Utensils, AlertTriangle } from 'lucide-react';

const SUPPORTED_MIME_TYPES = ['image/jpeg', 'image/png'];
const MAX_FILE_SIZE_MB = 4;

export function FoodIdentifier() {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<IdentifyFoodItemOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setError(null);
      setAnalysis(null);

      if (!SUPPORTED_MIME_TYPES.includes(file.type)) {
        setError('Invalid file type. Please upload a JPEG or PNG image.');
        return;
      }

      if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) { 
        setError(`Image is too large. Please upload an image smaller than ${MAX_FILE_SIZE_MB}MB.`);
        return;
      }
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleIdentify = async () => {
    if (!imagePreview) return;
    setIsLoading(true);
    setError(null);
    setAnalysis(null);

    try {
      const result = await identifyFoodItem({ photoDataUri: imagePreview });
      if (!result.isFood) {
        setError("This doesn't look like food. Please try another image.");
      } else {
        setAnalysis(result);
      }
    } catch (e) {
      setError('Failed to analyze the image. Please try again later.');
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };
  
  const clearState = () => {
    setImagePreview(null);
    setAnalysis(null);
    setError(null);
    if(fileInputRef.current) {
        fileInputRef.current.value = "";
    }
  }

  return (
    <section id="food-identifier" className="container mx-auto">
      <Card className="max-w-2xl mx-auto overflow-hidden">
        <CardHeader className="text-center">
          <div className="flex justify-center items-center gap-2 mb-2">
            <BrainCircuit className="w-8 h-8 text-primary" />
            <CardTitle className="text-3xl font-headline">AI Calorie Scanner</CardTitle>
          </div>
          <CardDescription>
            Curious about your meal? Upload a photo (JPEG/PNG) to identify the food and get an estimated calorie count.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          {!imagePreview ? (
            <div 
                className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-muted-foreground/30 rounded-lg text-center"
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                    e.preventDefault();
                    if(e.dataTransfer.files) {
                        fileInputRef.current!.files = e.dataTransfer.files;
                        handleFileChange({target: fileInputRef.current} as any);
                    }
                }}
            >
              <Upload className="w-12 h-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">Upload Your Food Photo</h3>
              <p className="text-sm text-muted-foreground mb-4">Drag & drop a JPEG or PNG image or click to select a file.</p>
              <Button onClick={() => fileInputRef.current?.click()}>
                Browse Files
              </Button>
              <Input
                type="file"
                ref={fileInputRef}
                className="hidden"
                onChange={handleFileChange}
                accept="image/png, image/jpeg"
              />
            </div>
          ) : (
            <div className="space-y-4">
              <div className="relative w-full aspect-video rounded-md overflow-hidden border">
                <Image src={imagePreview} alt="Food preview" layout="fill" objectFit="contain" />
                 <Button variant="destructive" size="icon" className="absolute top-2 right-2 z-10" onClick={clearState}>
                    <X className="w-4 h-4" />
                </Button>
              </div>
              <Button onClick={handleIdentify} disabled={isLoading} className="w-full">
                {isLoading ? 'Analyzing...' : 'Identify Food & Calories'}
              </Button>
            </div>
          )}

          {error && (
            <Alert variant="destructive" className="mt-4">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Upload Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {isLoading && (
            <div className="mt-4 space-y-4">
              <Skeleton className="w-full h-8" />
              <Skeleton className="w-full h-8" />
            </div>
          )}

          {analysis && (
            <div className="mt-6 space-y-4">
              <div className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg border">
                <Utensils className="w-8 h-8 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Identified Food</p>
                  <p className="text-xl font-bold">{analysis.foodName}</p>
                </div>
              </div>
              <div className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg border">
                <Flame className="w-8 h-8 text-accent" />
                <div>
                  <p className="text-sm text-muted-foreground">Estimated Calories</p>
                  <p className="text-xl font-bold">{analysis.calories}</p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </section>
  );
}
