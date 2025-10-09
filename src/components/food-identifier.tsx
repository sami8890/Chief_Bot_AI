'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { identifyFoodItem, type IdentifyFoodItemOutput } from '@/ai/flows/identify-food-flow';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Upload, X, BrainCircuit, Flame, Utensils, AlertTriangle, Camera, Image as ImageIcon, Sparkles, User, FileUp } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

const SUPPORTED_MIME_TYPES = ['image/jpeg', 'image/png'];
const MAX_FILE_SIZE_MB = 4;

const foodExamples = ['pizza-slice', 'healthy-salad', 'burger-fries'];

export function FoodIdentifier() {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<IdentifyFoodItemOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mode, setMode] = useState<'upload' | 'webcam'>('upload');
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (mode === 'webcam' && hasCameraPermission === null) {
      getCameraPermission();
    }
    
    // Cleanup function to stop video stream when component unmounts or mode changes
    return () => {
      if (videoRef.current?.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
      }
    }
  }, [mode]);

  const getCameraPermission = async () => {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setError("Webcam is not supported by your browser.");
        setHasCameraPermission(false);
        return;
      }
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        setHasCameraPermission(true);
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (error) {
        console.error('Error accessing camera:', error);
        setHasCameraPermission(false);
        toast({
          variant: 'destructive',
          title: 'Camera Access Denied',
          description: 'Please enable camera permissions in your browser settings.',
        });
      }
    };


  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const processFile = (file: File) => {
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
      const result = reader.result as string;
      setImagePreview(result);
      handleIdentify(result);
    };
    reader.readAsDataURL(file);
  }

  const handleCapture = () => {
    if (!videoRef.current || !canvasRef.current) return;
    
    const video = videoRef.current;
    const canvas = canvasRef.current;
    
    // Set canvas dimensions to match video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const context = canvas.getContext('2d');
    context?.drawImage(video, 0, 0, canvas.width, canvas.height);
    
    const dataUri = canvas.toDataURL('image/jpeg');
    setImagePreview(dataUri);
    handleIdentify(dataUri);
  }

  const handleIdentify = async (imageDataUri: string) => {
    if (!imageDataUri) return;
    setIsLoading(true);
    setError(null);
    setAnalysis(null);

    try {
      const result = await identifyFoodItem({ photoDataUri: imageDataUri });
      if (!result.isFood) {
        setError("That's an interesting object! But it doesn't look like food to me. Try another angle or a different item.");
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

  const clearState = (isSwitchingMode = false) => {
    setImagePreview(null);
    setAnalysis(null);
    setError(null);
    if (!isSwitchingMode && videoRef.current?.srcObject) {
         const stream = videoRef.current.srcObject as MediaStream;
         stream.getTracks().forEach(track => track.stop());
         setHasCameraPermission(null);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }
  
  const switchMode = (newMode: 'upload' | 'webcam') => {
    clearState(true);
    setMode(newMode);
  }

  const handleExampleClick = (imageId: string) => {
    const image = PlaceHolderImages.find(p => p.id === imageId);
    if(image) {
      setImagePreview(image.imageUrl);
      handleIdentify(image.imageUrl);
    }
  }

  return (
    <section id="food-identifier" className="container mx-auto">
      <Card className="w-full mx-auto overflow-hidden">
        <CardHeader className="text-center">
          <div className="flex justify-center items-center gap-2 mb-2">
            <BrainCircuit className="w-8 h-8 text-primary" />
            <CardTitle className="text-3xl font-headline">AI Calorie Scanner</CardTitle>
          </div>
          <CardDescription>
            Curious about your meal? Use your camera or upload a photo to get an AI-powered nutritional estimate.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
            
            {/* Left Column: Image Upload/Webcam */}
            <div className="space-y-4">
               <div className="flex justify-center gap-2 p-1 bg-muted rounded-lg">
                  <Button onClick={() => switchMode('upload')} variant={mode === 'upload' ? 'secondary' : 'ghost'} className="flex-1">
                    <FileUp className="mr-2" /> Upload
                  </Button>
                  <Button onClick={() => switchMode('webcam')} variant={mode === 'webcam' ? 'secondary' : 'ghost'} className="flex-1">
                    <Camera className="mr-2" /> Webcam
                  </Button>
                </div>

              {mode === 'upload' && !imagePreview && (
                <div
                  className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-muted-foreground/30 rounded-lg text-center aspect-video"
                   onDragOver={(e) => e.preventDefault()}
                   onDrop={(e) => {
                       e.preventDefault();
                       if(e.dataTransfer.files) {
                           processFile(e.dataTransfer.files[0]);
                       }
                   }}
                >
                  <Upload className="w-12 h-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Upload Your Food Photo</h3>
                  <p className="text-sm text-muted-foreground mb-4">Drag & drop or click to browse (JPEG/PNG).</p>
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
              )}
              
              {mode === 'webcam' && !imagePreview && (
                  <div className="relative w-full aspect-video rounded-md overflow-hidden border bg-muted flex items-center justify-center">
                    <video ref={videoRef} className="w-full h-full object-cover" autoPlay muted playsInline />
                    <canvas ref={canvasRef} className="hidden" />
                    {hasCameraPermission === false && (
                       <div className="text-center text-destructive-foreground p-4">
                         <AlertTriangle className="mx-auto mb-2" />
                         <p>Camera access denied or unavailable.</p>
                       </div>
                    )}
                    {hasCameraPermission && <Button onClick={handleCapture} className="absolute bottom-4 z-10" size="lg">Capture Photo</Button>}
                  </div>
              )}

              {imagePreview && (
                <div className="relative w-full aspect-video rounded-md overflow-hidden border">
                  <Image src={imagePreview} alt="Food preview" layout="fill" objectFit="contain" />
                  <Button variant="destructive" size="icon" className="absolute top-2 right-2 z-10" onClick={() => clearState()}>
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              )}
            </div>

            {/* Right Column: Analysis Results */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-center md:text-left font-headline">Nutritional Analysis</h3>
              {error && (
                <Alert variant="destructive" className="mt-4">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertTitle>Analysis Failed</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {isLoading && <AnalysisSkeleton />}
              
              {!isLoading && !analysis && !error && (
                <div className="flex flex-col items-center justify-center text-center p-8 border-2 border-dashed border-muted-foreground/30 rounded-lg aspect-video">
                  <Sparkles className="w-12 h-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Awaiting Image</h3>
                  <p className="text-sm text-muted-foreground">Your food analysis will appear here.</p>
                </div>
              )}

              {analysis && (
                <div className="p-4 bg-muted/50 rounded-lg border space-y-4">
                    <div className="flex items-center gap-4">
                        <Utensils className="w-8 h-8 text-primary flex-shrink-0" />
                        <div>
                        <p className="text-sm text-muted-foreground">Identified Food</p>
                        <p className="text-xl font-bold">{analysis.foodName}</p>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-center">
                        <div className="p-3 bg-background rounded-lg border">
                             <Flame className="w-6 h-6 text-accent mx-auto mb-1" />
                             <p className="text-lg font-bold">{analysis.calories}</p>
                             <p className="text-xs text-muted-foreground">Calories</p>
                        </div>
                         <div className="p-3 bg-background rounded-lg border">
                             <User className="w-6 h-6 text-blue-400 mx-auto mb-1" />
                             <p className="text-lg font-bold">{analysis.protein}</p>
                             <p className="text-xs text-muted-foreground">Protein</p>
                        </div>
                         <div className="p-3 bg-background rounded-lg border">
                             <ImageIcon className="w-6 h-6 text-orange-400 mx-auto mb-1" />
                             <p className="text-lg font-bold">{analysis.carbs}</p>
                             <p className="text-xs text-muted-foreground">Carbs</p>
                        </div>
                         <div className="p-3 bg-background rounded-lg border">
                             <ImageIcon className="w-6 h-6 text-yellow-400 mx-auto mb-1" />
                             <p className="text-lg font-bold">{analysis.fats}</p>
                             <p className="text-xs text-muted-foreground">Fats</p>
                        </div>
                    </div>
                     <Alert className="text-xs">
                        <AlertTriangle className="h-4 w-4" />
                        <AlertTitle>Disclaimer</AlertTitle>
                        <AlertDescription>
                           This is an AI-generated estimate. Actual nutritional values may vary.
                        </AlertDescription>
                    </Alert>
                </div>
              )}
            </div>
          </div>
          
          {/* Example Images */}
           <div className="mt-12">
                <h3 className="text-xl font-semibold text-center mb-4 font-headline">Or Try an Example</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {foodExamples.map(id => {
                        const image = PlaceHolderImages.find(p => p.id === id);
                        if (!image) return null;
                        return (
                            <button key={id} onClick={() => handleExampleClick(id)} className="relative aspect-video rounded-md overflow-hidden border group">
                                <Image src={image.imageUrl} alt={image.description} layout="fill" objectFit="cover" />
                                <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                    <p className="text-white font-bold">{image.description}</p>
                                </div>
                            </button>
                        )
                    })}
                </div>
           </div>
        </CardContent>
      </Card>
    </section>
  );
}


function AnalysisSkeleton() {
    return (
      <div className="p-4 bg-muted/50 rounded-lg border space-y-4">
        <div className="flex items-center gap-4">
          <Skeleton className="w-8 h-8 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-6 w-40" />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
        </div>
        <Skeleton className="h-10 w-full" />
      </div>
    )
}

    