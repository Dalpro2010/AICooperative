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
  availableModels: z.array(z.enum(["gemini", "chatgpt", "claude"])).describe("A list of available models based on user's API keys."),
  customInstructions: z.string().optional().describe('Custom instructions for the AI for this specific chat.'),
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

{{#if customInstructions}}
Additionally, you must follow these special instructions for this chat:
{{{customInstructions}}}
{{/if}}

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
    let modelToUse: AIModel | null = null;
    const { model, availableModels } = input;

    if (availableModels.length === 0) {
      return {
        response: "Por favor, configura al menos una clave de API en los Ajustes para poder chatear."
      };
    }
    
    if (availableModels.length === 1) {
      modelToUse = availableModels[0];
      console.log(`Only one model available, forcing use of: ${modelToUse}`);
    } else {
      if (model === 'automatic') {
        // If automatic and multiple models are available, pick one randomly.
        // This could be replaced with more sophisticated logic in the future.
        modelToUse = availableModels[Math.floor(Math.random() * availableModels.length)];
        console.log(`Automatic selection chose: ${modelToUse}`);
      } else {
        // If a specific model is selected, check if it's available.
        if (availableModels.includes(model)) {
          modelToUse = model;
        } else {
          // Fallback to the first available model if the selected one is not configured.
          modelToUse = availableModels[0];
          console.log(`Selected model "${model}" not available, falling back to: ${modelToUse}`);
        }
      }
    }

    if (!modelToUse) {
         return {
            response: "No se pudo determinar qué modelo de IA usar. Por favor, comprueba tus ajustes de clave de API."
        }
    }
    
    if (modelToUse === 'chatgpt' || modelToUse === 'claude') {
        return {
            response: `(Simulado desde ${modelToUse}) Hola, soy un asistente con la personalidad de ${input.personality}. ¿En qué puedo ayudarte hoy?`
        }
    }

    const {output} = await prompt(input);
    return output!;
  }
);