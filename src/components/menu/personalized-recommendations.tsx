"use client";

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

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
import { Lightbulb, Loader2 } from 'lucide-react';

const formSchema = z.object({
  userPreferences: z.string().min(10, 'Please describe your preferences in a bit more detail.'),
  dietaryNeeds: z.string().optional(),
});

export function PersonalizedRecommendations({ menu }: { menu: string }) {
  const [recommendations, setRecommendations] = useState<PersonalizedRecommendationsOutput | null>(null);
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
    setRecommendations(null);
    try {
      const result = await getPersonalizedRecommendations({
        ...values,
        dietaryNeeds: values.dietaryNeeds || 'None',
        menu,
      });
      setRecommendations(result);
    } catch (e) {
      setError('Failed to get recommendations. Please try again.');
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Accordion type="single" collapsible>
      <AccordionItem value="item-1" className="border-b-0">
        <AccordionTrigger className="text-xl font-headline hover:no-underline">
          <div className="flex items-center gap-2">
            <Lightbulb className="text-accent" />
            Get Personalized Recommendations
          </div>
        </AccordionTrigger>
        <AccordionContent className="pt-4">
          <p className="text-muted-foreground mb-4">
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
                      <Textarea placeholder="e.g., 'I love spicy food, but I'm not a fan of cilantro. I'm looking for something light and healthy.'" {...field} />
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
                    <FormLabel>Any dietary restrictions?</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., 'vegetarian, gluten-free'" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Get Recommendations
              </Button>
            </form>
          </Form>
          
          {error && <p className="mt-4 text-destructive">{error}</p>}

          {recommendations && (
            <Alert className="mt-6">
              <Lightbulb className="h-4 w-4" />
              <AlertTitle>Our Chef Recommends</AlertTitle>
              <AlertDescription>
                <div className="whitespace-pre-wrap font-sans">
                  {recommendations.recommendations}
                </div>
              </AlertDescription>
            </Alert>
          )}
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
