'use server';

/**
 * @fileOverview Dynamically adjusts the story presentation based on player understanding.
 *
 * This file exports:
 * - `adaptStory` - an async function to adjust the story.
 * - `AdaptiveStoryInput` - the input type for the adaptStory function.
 * - `AdaptiveStoryOutput` - the output type for the adaptStory function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AdaptiveStoryInputSchema = z.object({
  playerStoryProgress: z
    .string()
    .describe('The current story progress of the player.'),
  playerInventory: z
    .string()
    .describe(
      'The current inventory of the player, including items and resources.'
    ),
  playerUnderstandingScore: z
    .number()
    .describe(
      'A score representing the players understanding of the current game mechanics, concepts and story. The score can be any number between 0 and 100.'
    ),
  dialogueSnippet: z.string().describe('A potential dialogue snippet to present.'),
});
export type AdaptiveStoryInput = z.infer<typeof AdaptiveStoryInputSchema>;

const AdaptiveStoryOutputSchema = z.object({
  shouldPresentDialogue: z
    .boolean()
    .describe(
      'Whether the dialogue snippet should be presented to the player based on their understanding and game progress.'
    ),
  reasoning: z
    .string()
    .describe('The reason why the dialogue snippet should or should not be presented.'),
});
export type AdaptiveStoryOutput = z.infer<typeof AdaptiveStoryOutputSchema>;

export async function adaptStory(input: AdaptiveStoryInput): Promise<AdaptiveStoryOutput> {
  return adaptiveStoryFlow(input);
}

const adaptiveStoryPrompt = ai.definePrompt({
  name: 'adaptiveStoryPrompt',
  input: {schema: AdaptiveStoryInputSchema},
  output: {schema: AdaptiveStoryOutputSchema},
  prompt: `You are an expert game designer tasked with controlling the pacing of a game story.

You are provided with the following information about the player:
- Their current story progress: {{{playerStoryProgress}}}
- Their current inventory: {{{playerInventory}}}
- Their current understanding score: {{{playerUnderstandingScore}}}

You are considering presenting the following dialogue snippet: {{{dialogueSnippet}}}

Based on the player's current state, determine whether the dialogue snippet should be presented to the player.

Consider the player's understanding score. If the score is too low, it is possible the player does not have the understanding or context to understand the dialogue.

Consider the player's story progress. It is possible the dialogue snippet is not relevant or is a spoiler for future events.

Consider the player's inventory. It is possible the dialogue snippet provides information that the player already knows based on their inventory.

Return a JSON object with the following format:
{
  "shouldPresentDialogue": boolean,
  "reasoning": string
}
`,
});

const adaptiveStoryFlow = ai.defineFlow(
  {
    name: 'adaptiveStoryFlow',
    inputSchema: AdaptiveStoryInputSchema,
    outputSchema: AdaptiveStoryOutputSchema,
  },
  async input => {
    const {output} = await adaptiveStoryPrompt(input);
    return output!;
  }
);
