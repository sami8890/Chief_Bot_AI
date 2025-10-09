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
  foodName: z
    .string()
    .describe('The most common, culturally specific name of the identified food item (e.g., "Biryani" not "Chicken and Pilaf Rice").'),
  calories: z
    .string()
    .describe('An approximate calorie range for a typical serving of the food item (e.g., "400-600 kcal").'),
  protein: z
    .string()
    .describe('The estimated protein in grams (e.g., "30g").'),
  carbs: z.string().describe('The estimated carbohydrates in grams (e.g., "50g").'),
  fats: z.string().describe('The estimated fats in grams (e.g., "20g").'),
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
  prompt: `You are an expert nutritionist. Your task is to identify the food item in the provided image and estimate its nutritional information for a typical serving size.

If the image does not contain food, set the 'isFood' flag to false and provide appropriate values for the other fields.

Analyze the image and provide the following:
1.  The most common and culturally specific name for the dish. For example, use "Biryani" instead of a generic description like "Chicken and Pilaf Rice".
2.  An estimated calorie range (e.g., "400-600 kcal").
3.  Estimated protein, carbohydrates, and fats in grams.

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

    