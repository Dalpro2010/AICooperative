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

const AIChatPersonalityInputSchema = z.object({
  personality: z
    .string()
    .describe("The desired AI personality (e.g., programmer, therapist, creative writer)."),
  userMessage: z.string().describe('The user message to be processed.'),
  chatHistory: z.string().describe('The chat history.'),
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

Response:`,
});

const aiChatPersonalityFlow = ai.defineFlow(
  {
    name: 'aiChatPersonalityFlow',
    inputSchema: AIChatPersonalityInputSchema,
    outputSchema: AIChatPersonalityOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
