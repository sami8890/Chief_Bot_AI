
"use client";

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import type { MenuItem } from '@/lib/data';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { getPersonalizedRecommendations, type PersonalizedRecommendationsOutput } from '@/ai/flows/personalized-recommendations';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Lightbulb, Loader2, Sparkles, ChefHat } from 'lucide-react';
import { MenuCard } from './menu-card';
import { Separator } from '../ui/separator';

const formSchema = z.object({
  userPreferences: z.string().min(10, 'Please describe your preferences in a bit more detail.'),
  dietaryNeeds: z.string().optional(),
});

const examplePrompts = [
    "I'm looking for a popular spicy dish.",
    "Something light and healthy for lunch.",
    "A comforting vegetarian meal.",
    "Surprise me with a unique appetizer!",
]

export function PersonalizedRecommendations({ menu, allMenuItems }: { menu: string, allMenuItems: MenuItem[] }) {
  const [recommendations, setRecommendations] = useState<MenuItem[]>([]);
  const [reasonings, setReasonings] = useState<{[key: string]: string}>({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      userPreferences: '',
      dietaryNeeds: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setError(null);
    setRecommendations([]);
    setReasonings({});
    try {
      const result = await getPersonalizedRecommendations({
        ...values,
        dietaryNeeds: values.dietaryNeeds || 'None',
        menu,
      });
      
      if (result && result.recommendations) {
        const recommendedItems = result.recommendations
            .map(rec => allMenuItems.find(item => item.name === rec.name))
            .filter((item): item is MenuItem => !!item);
        
        const reasoningsMap = result.recommendations.reduce((acc, rec) => {
            acc[rec.name] = rec.reasoning;
            return acc;
        }, {} as {[key: string]: string});

        setRecommendations(recommendedItems);
        setReasonings(reasoningsMap);
      }

    } catch (e) {
      setError('Failed to get recommendations. Please try again.');
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  }

  const handleExamplePrompt = (prompt: string) => {
    form.setValue('userPreferences', prompt);
    onSubmit({ userPreferences: prompt, dietaryNeeds: form.getValues('dietaryNeeds') });
  }

  return (
    <Accordion type="single" collapsible className="w-full">
      <AccordionItem value="item-1" className="border-b-0">
        <AccordionTrigger className="text-xl font-headline hover:no-underline">
          <div className="flex items-center gap-2">
            <Sparkles className="text-accent" />
            AI-Powered Recommendations
          </div>
        </AccordionTrigger>
        <AccordionContent className="pt-4">
          <p className="text-muted-foreground mb-6">
            Tell us what you like, and our AI chef will suggest the perfect dishes for you from our menu.
          </p>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="userPreferences"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>What are you in the mood for?</FormLabel>
                    <FormControl>
                      <Textarea placeholder="e.g., 'I love spicy food, but I'm not a fan of cilantro...'" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="dietaryNeeds"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Any dietary restrictions? (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., 'vegetarian, gluten-free'" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
               <div className="flex flex-wrap items-center gap-2">
                <Button type="submit" disabled={isLoading}>
                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {isLoading ? 'Thinking...' : 'Get Recommendations'}
                </Button>
                <span className="text-sm text-muted-foreground hidden sm:inline-block">or try an example:</span>
                 <div className="flex flex-wrap gap-2">
                    {examplePrompts.slice(0,2).map(prompt => (
                        <Button key={prompt} variant="outline" size="sm" onClick={() => handleExamplePrompt(prompt)} disabled={isLoading}>
                            "{prompt}"
                        </Button>
                    ))}
                 </div>
               </div>
            </form>
          </Form>
          
          {isLoading && (
            <div className="mt-8 flex items-center justify-center text-muted-foreground">
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              <span>Our AI Chef is thinking...</span>
            </div>
          )}
          {error && <p className="mt-4 text-destructive">{error}</p>}

          {recommendations.length > 0 && !isLoading && (
            <div className="mt-8">
                <Separator className="my-6" />
                <h3 className="text-2xl font-headline mb-4 flex items-center gap-2">
                    <ChefHat className="text-primary"/>
                    Our AI Chef Recommends...
                </h3>
                <div className="space-y-6">
                    {recommendations.map(item => (
                        <div key={item.id}>
                            <Alert className="mb-2 bg-accent/10 border-accent/20 text-accent-foreground">
                                <Lightbulb className="h-4 w-4 text-accent" />
                                <AlertTitle className="font-semibold text-accent">Why you'll love it:</AlertTitle>
                                <AlertDescription>{reasonings[item.name]}</AlertDescription>
                            </Alert>
                            <MenuCard item={item} />
                        </div>
                    ))}
                </div>
            </div>
          )}

          {!isLoading && !error && recommendations.length === 0 && form.formState.isSubmitSuccessful && (
             <Alert className="mt-6">
                <Lightbulb className="h-4 w-4" />
                <AlertTitle>No specific recommendations found</AlertTitle>
                <AlertDescription>
                  We couldn't find a perfect match for your specific request. Try broadening your preferences, or feel free to browse our full menu below!
                </AlertDescription>
            </Alert>
          )}

        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
