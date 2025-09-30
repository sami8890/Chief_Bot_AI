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
    .describe('The user\u2019s food preferences, likes, and dislikes.'),
  dietaryNeeds: z
    .string()
    .describe(
      'The user\u2019s dietary restrictions and needs, e.g., vegetarian, gluten-free.'
    ),
  menu: z.string().describe('The restaurant\u2019s menu, including dish descriptions.'),
});
export type PersonalizedRecommendationsInput = z.infer<
  typeof PersonalizedRecommendationsInputSchema
>;

const PersonalizedRecommendationsOutputSchema = z.object({
  recommendations: z
    .string()
    .describe('A list of personalized menu recommendations for the user.'),
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
  prompt: `You are a restaurant sommelier who recommends dishes to patrons based on their preferences and dietary restrictions.

  Consider the following information about the user:
  User Preferences: {{{userPreferences}}}
  Dietary Needs: {{{dietaryNeeds}}}

  Consider the following menu from the restaurant:
  Menu: {{{menu}}}

  Based on this information, what dishes would you recommend to the user? Explain why each dish is a good recommendation.
  Format your response as a list of dish recommendations with explanations.
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
