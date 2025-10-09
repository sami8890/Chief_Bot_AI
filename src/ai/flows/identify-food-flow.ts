'use server';
/**
 * @fileOverview A food identification AI agent.
 *
 * - identifyFoodItem - A function that handles food identification from an image.
 * - IdentifyFoodItemInput - The input type for the identifyFoodItem function.
 * - IdentifyFoodItemOutput - The return type for the identifyFoodItem function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const IdentifyFoodItemInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo of a food item, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type IdentifyFoodItemInput = z.infer<typeof IdentifyFoodItemInputSchema>;

const IdentifyFoodItemOutputSchema = z.object({
  isFood: z.boolean().describe('Whether or not the image contains food.'),
  foodName: z.string().describe('The name of the identified food item.'),
  calories: z.string().describe('The estimated calorie count for the food item.'),
});
export type IdentifyFoodItemOutput = z.infer<typeof IdentifyFoodItemOutputSchema>;

export async function identifyFoodItem(
  input: IdentifyFoodItemInput
): Promise<IdentifyFoodItemOutput> {
  return identifyFoodItemFlow(input);
}

const prompt = ai.definePrompt({
  name: 'identifyFoodItemPrompt',
  input: {schema: IdentifyFoodItemInputSchema},
  output: {schema: IdentifyFoodItemOutputSchema},
  prompt: `You are an expert nutritionist. Your task is to identify the food item in the provided image and estimate its calorie count.

If the image does not contain food, set the 'isFood' flag to false and provide appropriate values for the other fields.

Analyze the image and provide the name of the food and its estimated calories.

Photo: {{media url=photoDataUri}}`,
});

const identifyFoodItemFlow = ai.defineFlow(
  {
    name: 'identifyFoodItemFlow',
    inputSchema: IdentifyFoodItemInputSchema,
    outputSchema: IdentifyFoodItemOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
