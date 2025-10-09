'use server';
/**
 * @fileOverview Menu item description analyzer flow.
 *
 * - analyzeMenuItemDescription - A function that analyzes a menu item description and extracts key information.
 * - AnalyzeMenuItemDescriptionInput - The input type for the analyzeMenuItemDescription function.
 * - AnalyzeMenuItemDescriptionOutput - The return type for the analyzeMenuItemDescription function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeMenuItemDescriptionInputSchema = z.object({
  menuItemDescription: z
    .string()
    .describe('The description of the menu item to analyze.'),
});
export type AnalyzeMenuItemDescriptionInput = z.infer<
  typeof AnalyzeMenuItemDescriptionInputSchema
>;

const AnalyzeMenuItemDescriptionOutputSchema = z.object({
  ingredients: z
    .array(z.string())
    .describe('List of key ingredients in the menu item.'),
  allergens: z
    .array(z.string())
    .describe('List of potential allergens present in the menu item.'),
  nutritionalInformation: z
    .string()
    .describe('Summary of nutritional information for the menu item.'),
  winePairing: z
    .object({
      recommendation: z.string().describe('The name or type of wine recommended.'),
      reasoning: z.string().describe('A brief explanation for why this wine is a good pairing.'),
    })
    .describe('A wine pairing suggestion for the menu item.'),
});
export type AnalyzeMenuItemDescriptionOutput = z.infer<
  typeof AnalyzeMenuItemDescriptionOutputSchema
>;

export async function analyzeMenuItemDescription(
  input: AnalyzeMenuItemDescriptionInput
): Promise<AnalyzeMenuItemDescriptionOutput> {
  return analyzeMenuItemDescriptionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeMenuItemDescriptionPrompt',
  input: {schema: AnalyzeMenuItemDescriptionInputSchema},
  output: {schema: AnalyzeMenuItemDescriptionOutputSchema},
  prompt: `You are a restaurant expert and sommelier. Analyze the following menu item description to extract key ingredients, allergens, and nutritional information. Also, provide a thoughtful wine pairing recommendation with a brief reason. Be concise and accurate.

Menu Item Description: {{{menuItemDescription}}}

Output the ingredients, allergens, nutritional information, and wine pairing in JSON format.`,
});

const analyzeMenuItemDescriptionFlow = ai.defineFlow(
  {
    name: 'analyzeMenuItemDescriptionFlow',
    inputSchema: AnalyzeMenuItemDescriptionInputSchema,
    outputSchema: AnalyzeMenuItemDescriptionOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
