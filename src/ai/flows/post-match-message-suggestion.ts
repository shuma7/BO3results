// src/ai/flows/post-match-message-suggestion.ts
'use server';

/**
 * @fileOverview A Genkit flow for suggesting post-match messages based on match details.
 *
 * - suggestPostMatchMessage - A function that suggests a post-match message.
 * - SuggestPostMatchMessageInput - The input type for the suggestPostMatchMessage function.
 * - SuggestPostMatchMessageOutput - The return type for the suggestPostMatchMessage function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestPostMatchMessageInputSchema = z.object({
  matchResult: z.enum(['win', 'loss']),
  opponentName: z.string().optional().describe('The name of the opponent.'),
  userNotes: z.string().describe('User notes about the match.'),
  gameDetails: z.array(
    z.object({
      userClass: z.string().describe('The class used by the user.'),
      opponentClass: z.string().describe('The class used by the opponent.'),
      turnOrder: z.string().describe('Whether the user went first or second.'),
      gameResult: z.enum(['win', 'loss']),
    })
  ),
});

export type SuggestPostMatchMessageInput = z.infer<
  typeof SuggestPostMatchMessageInputSchema
>;

const SuggestPostMatchMessageOutputSchema = z.object({
  suggestedMessage: z.string().describe('A suggested post-match message.'),
});

export type SuggestPostMatchMessageOutput = z.infer<
  typeof SuggestPostMatchMessageOutputSchema
>;

export async function suggestPostMatchMessage(
  input: SuggestPostMatchMessageInput
): Promise<SuggestPostMatchMessageOutput> {
  return suggestPostMatchMessageFlow(input);
}

const postMatchMessagePrompt = ai.definePrompt({
  name: 'postMatchMessagePrompt',
  input: {schema: SuggestPostMatchMessageInputSchema},
  output: {schema: SuggestPostMatchMessageOutputSchema},
  prompt: `You are a helpful assistant that suggests a short post-match message for a Shadowverse player.

        Based on the match result, opponent's name (if available), user's notes, and game details, suggest a suitable message that the user can copy and paste.

        Match Result: {{{matchResult}}}
        Opponent Name: {{#if opponentName}}{{{opponentName}}}{{else}}Unknown Opponent{{/if}}
        User Notes: {{{userNotes}}}
        Game Details:
        {{#each gameDetails}}
        - User Class: {{{userClass}}}, Opponent Class: {{{opponentClass}}}, Turn Order: {{{turnOrder}}}, Game Result: {{{gameResult}}}
        {{/each}}

        Suggested Message:`,
});

const suggestPostMatchMessageFlow = ai.defineFlow(
  {
    name: 'suggestPostMatchMessageFlow',
    inputSchema: SuggestPostMatchMessageInputSchema,
    outputSchema: SuggestPostMatchMessageOutputSchema,
  },
  async input => {
    const {output} = await postMatchMessagePrompt(input);
    return output!;
  }
);
