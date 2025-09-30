"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
  DialogClose,
} from '@/components/ui/dialog';
import { analyzeMenuItemDescription, type AnalyzeMenuItemDescriptionOutput } from '@/ai/flows/analyze-menu-item-descriptions';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Sparkles } from 'lucide-react';

export function MenuAnalyzer({ menuItemDescription }: { menuItemDescription: string }) {
  const [analysis, setAnalysis] = useState<AnalyzeMenuItemDescriptionOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async () => {
    setIsLoading(true);
    setError(null);
    setAnalysis(null);
    try {
      const result = await analyzeMenuItemDescription({ menuItemDescription });
      setAnalysis(result);
    } catch (e) {
      setError("Failed to analyze item. Please try again.");
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog onOpenChange={(open) => { if (open) handleAnalyze() }}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Sparkles className="mr-2 h-4 w-4" />
          Analyze
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="text-primary" />
            Menu Item Analysis
          </DialogTitle>
          <DialogDescription>
            AI-powered breakdown of ingredients, allergens, and nutritional info.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4 space-y-6">
          {isLoading && <AnalysisSkeleton />}
          {error && <p className="text-destructive">{error}</p>}
          {analysis && (
            <div className="space-y-4 text-sm">
              <div>
                <h4 className="font-semibold mb-2">Key Ingredients</h4>
                <div className="flex flex-wrap gap-2">
                  {analysis.ingredients.map((item, i) => <Badge key={i} variant="secondary">{item}</Badge>)}
                </div>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Potential Allergens</h4>
                <div className="flex flex-wrap gap-2">
                  {analysis.allergens.length > 0 ? (
                    analysis.allergens.map((item, i) => <Badge key={i} variant="destructive">{item}</Badge>)
                  ) : (
                    <p className="text-muted-foreground">None detected.</p>
                  )}
                </div>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Nutritional Summary</h4>
                <p className="text-muted-foreground">{analysis.nutritionalInformation}</p>
              </div>
            </div>
          )}
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              Close
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function AnalysisSkeleton() {
    return (
        <div className="space-y-6">
            <div>
                <Skeleton className="h-5 w-32 mb-2" />
                <div className="flex flex-wrap gap-2">
                    <Skeleton className="h-6 w-20" />
                    <Skeleton className="h-6 w-24" />
                    <Skeleton className="h-6 w-16" />
                </div>
            </div>
            <div>
                <Skeleton className="h-5 w-40 mb-2" />
                <div className="flex flex-wrap gap-2">
                    <Skeleton className="h-6 w-20" />
                </div>
            </div>
            <div>
                <Skeleton className="h-5 w-48 mb-2" />
                <Skeleton className="h-12 w-full" />
            </div>
        </div>
    )
}
