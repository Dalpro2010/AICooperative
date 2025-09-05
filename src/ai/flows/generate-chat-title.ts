'use server';

/**
 * @fileOverview A flow to generate a short, relevant title for a chat conversation.
 *
 * - generateChatTitle - A function that generates a title based on the first user message.
 * - GenerateChatTitleInput - The input type for the generateChatTitle function.
 * - GenerateChatTitleOutput - The return type for the generateChatTitle function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const languageMap: Record<string, string> = {
  es: 'Spanish',
  en: 'English',
  fr: 'French',
  de: 'German',
  pt: 'Portuguese',
};

const GenerateChatTitleInputSchema = z.object({
  userMessage: z.string().describe('The first message from the user in the conversation.'),
  language: z.string().optional().describe('The language for the title (e.g., "es", "en").'),
});
export type GenerateChatTitleInput = z.infer<typeof GenerateChatTitleInputSchema>;

const GenerateChatTitleOutputSchema = z.object({
  title: z.string().describe('A short, relevant title for the chat (2-4 words).'),
});
export type GenerateChatTitleOutput = z.infer<typeof GenerateChatTitleOutputSchema>;

export async function generateChatTitle(input: GenerateChatTitleInput): Promise<GenerateChatTitleOutput> {
  return generateChatTitleFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateChatTitlePrompt',
  input: {schema: GenerateChatTitleInputSchema},
  output: {schema: GenerateChatTitleOutputSchema},
  prompt: `Based on the following user message, create a short, relevant title for the chat conversation. The title should be 2-4 words long.

{{#if language}}
The title must be in {{lookup languageMap language}}.
{{/if}}

User Message:
"{{{userMessage}}}"

Title:`,
});

const generateChatTitleFlow = ai.defineFlow(
  {
    name: 'generateChatTitleFlow',
    inputSchema: GenerateChatTitleInputSchema,
    outputSchema: GenerateChatTitleOutputSchema,
  },
  async input => {
    // Only use a fast model for this simple task
    const {output} = await prompt(input, { 
        model: 'googleai/gemini-2.5-flash',
        helpers: {
            languageMap: (key: string) => languageMap[key] || 'the specified language',
        }
    });
    return output!;
  }
);
