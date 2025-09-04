'use server';

/**
 * @fileOverview An AI chat personality selector flow.
 *
 * - aiChatPersonality - A function that allows users to select an AI personality for a chat.
 * - AIChatPersonalityInput - The input type for the aiChatPersonality function.
 * - AIChatPersonalityOutput - The return type for the aiChatPersonality function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { AIModel } from '@/lib/types';

const AIChatPersonalityInputSchema = z.object({
  personality: z
    .string()
    .describe("The desired AI personality (e.g., programmer, therapist, creative writer)."),
  userMessage: z.string().describe('The user message to be processed.'),
  chatHistory: z.string().describe('The chat history.'),
  model: z.enum(["gemini", "chatgpt", "claude", "automatic"]).describe("The AI model to use."),
  photoDataUri: z.string().optional().describe(
    "A photo from the user, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
  ),
});
export type AIChatPersonalityInput = z.infer<typeof AIChatPersonalityInputSchema>;

const AIChatPersonalityOutputSchema = z.object({
  response: z.string().describe('The AI response tailored to the selected personality.'),
});
export type AIChatPersonalityOutput = z.infer<typeof AIChatPersonalityOutputSchema>;

export async function aiChatPersonality(input: AIChatPersonalityInput): Promise<AIChatPersonalityOutput> {
  return aiChatPersonalityFlow(input);
}

const prompt = ai.definePrompt({
  name: 'aiChatPersonalityPrompt',
  input: {schema: AIChatPersonalityInputSchema},
  output: {schema: AIChatPersonalityOutputSchema},
  prompt: `You are an AI assistant with the personality of a {{{personality}}}. Your responses should reflect this persona.

Chat History:
{{{chatHistory}}}

User Message:
{{{userMessage}}}
{{#if photoDataUri}}
[User has provided an image]
Photo: {{media url=photoDataUri}}
{{/if}}

Response:`,
});

const aiChatPersonalityFlow = ai.defineFlow(
  {
    name: 'aiChatPersonalityFlow',
    inputSchema: AIChatPersonalityInputSchema,
    outputSchema: AIChatPersonalityOutputSchema,
  },
  async input => {
    let model: AIModel = input.model;
    if (model === "automatic") {
      // Placeholder logic for automatic model selection
      const models: AIModel[] = ["gemini", "chatgpt", "claude"];
      model = models[Math.floor(Math.random() * models.length)];
      console.log("Automatic model selection chose:", model);
    }
    
    // Here you would add logic to call the specific model API
    // For now, we will simulate the response as if it came from the selected model
    // and just use the default genkit model.
    if (model === 'chatgpt' || model === 'claude') {
        return {
            response: `(Simulado desde ${model}) Hola, soy un asistente con la personalidad de ${input.personality}. ¿En qué puedo ayudarte hoy?`
        }
    }

    const {output} = await prompt(input);
    return output!;
  }
);
