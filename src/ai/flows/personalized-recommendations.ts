// src/ai/flows/personalized-recommendations.ts
'use server';

/**
 * @fileOverview A personalized menu recommendation AI agent.
 *
 * - getPersonalizedRecommendations - A function that returns personalized menu recommendations.
 * - PersonalizedRecommendationsInput - The input type for the getPersonalizedRecommendations function.
 * - PersonalizedRecommendationsOutput - The return type for the getPersonalizedRecommendations function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PersonalizedRecommendationsInputSchema = z.object({
  userPreferences: z
    .string()
    .describe('The user’s food preferences, likes, and dislikes.'),
  dietaryNeeds: z
    .string()
    .describe(
      'The user’s dietary restrictions and needs, e.g., vegetarian, gluten-free.'
    ),
  menu: z.string().describe('A markdown list of the restaurant’s menu dishes, used to constrain the recommendations. The AI should only recommend items from this list.'),
});
export type PersonalizedRecommendationsInput = z.infer<
  typeof PersonalizedRecommendationsInputSchema
>;

const PersonalizedRecommendationsOutputSchema = z.object({
  recommendations: z.array(
      z.object({
          name: z.string().describe("The exact name of a dish from the provided menu."),
          reasoning: z.string().describe("A brief explanation for why this dish is a good recommendation for the user."),
      })
  ).describe("A list of personalized menu recommendations for the user.")
});
export type PersonalizedRecommendationsOutput = z.infer<
  typeof PersonalizedRecommendationsOutputSchema
>;

export async function getPersonalizedRecommendations(
  input: PersonalizedRecommendationsInput
): Promise<PersonalizedRecommendationsOutput> {
  return personalizedRecommendationsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'personalizedRecommendationsPrompt',
  input: {schema: PersonalizedRecommendationsInputSchema},
  output: {schema: PersonalizedRecommendationsOutputSchema},
  prompt: `You are a helpful and friendly restaurant sommelier. Your goal is to recommend a few dishes to a patron based on their preferences and dietary restrictions from the menu provided.

  You MUST only recommend dishes that are explicitly listed in the Menu below. Do not invent dishes.

  User Information:
  - Preferences: {{{userPreferences}}}
  - Dietary Needs: {{{dietaryNeeds}}}

  Menu:
  {{{menu}}}

  Based on this information, what dishes would you recommend to the user? For each dish, provide the exact name and a short, compelling reason why it's a good fit.
  Format your response as a JSON object with a 'recommendations' array.
  `,
});

const personalizedRecommendationsFlow = ai.defineFlow(
  {
    name: 'personalizedRecommendationsFlow',
    inputSchema: PersonalizedRecommendationsInputSchema,
    outputSchema: PersonalizedRecommendationsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
