
'use client';

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { X, ImagePlus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ImageUploadProps {
  value: string | null;
  onChange: (file: File | null) => void;
  onRemove: () => void;
}

export function ImageUpload({ value, onChange, onRemove }: ImageUploadProps) {
  const [preview, setPreview] = useState<string | null>(value);
  const { toast } = useToast();

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles && acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
       if (file.size > 4 * 1024 * 1024) { // 4MB limit
        toast({
          variant: "destructive",
          title: "Image too large",
          description: "Please upload an image smaller than 4MB.",
        });
        return;
      }
      setPreview(URL.createObjectURL(file));
      onChange(file);
    }
  }, [onChange, toast]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/jpeg': [],
      'image/png': [],
    },
    multiple: false,
  });

  const handleRemove = () => {
    setPreview(null);
    onRemove();
  }

  if (preview) {
    return (
      <div className="relative w-full h-48 rounded-md overflow-hidden">
        <Image
          src={preview}
          alt="Image preview"
          layout="fill"
          objectFit="cover"
        />
        <Button
          type="button"
          variant="destructive"
          size="icon"
          className="absolute top-2 right-2 h-7 w-7"
          onClick={handleRemove}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    );
  }

  return (
    <div
      {...getRootProps()}
      className={`
        w-full h-48 rounded-md border-2 border-dashed
        flex items-center justify-center text-center text-muted-foreground
        cursor-pointer transition-colors
        ${isDragActive ? 'border-primary bg-primary/10' : 'border-input'}
      `}
    >
      <input {...getInputProps()} />
      <div className="flex flex-col items-center gap-2">
        <ImagePlus className="w-8 h-8" />
        <p className="text-sm">
            {isDragActive ? 'Drop the image here...' : "Drag 'n' drop an image, or click to select"}
        </p>
         <p className="text-xs text-muted-foreground/80">
            PNG or JPG up to 4MB
        </p>
      </div>
    </div>
  );
}
