// This file is machine-generated - edit at your own risk!

'use server';

/**
 * @fileOverview AI-powered node suggestion tool to help users discover the next logical step in their workflow.
 *
 * - suggestNextNode - A function that suggests the next node in a workflow.
 * - SuggestNextNodeInput - The input type for the suggestNextNode function.
 * - SuggestNextNodeOutput - The return type for the suggestNextNode function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestNextNodeInputSchema = z.object({
  currentWorkflow: z
    .string()
    .describe('The current workflow configuration as a JSON string.'),
  availableNodes: z
    .string()
    .describe('A list of available nodes and their descriptions as a JSON string.'),
  userQuery: z.string().optional().describe('Optional user query for specific node suggestions.'),
});
export type SuggestNextNodeInput = z.infer<typeof SuggestNextNodeInputSchema>;

const SuggestNextNodeOutputSchema = z.object({
  suggestedNodes: z
    .array(z.string())
    .describe('An array of suggested node names based on the current workflow.'),
  reasoning: z.string().describe('The AI reasoning behind the node suggestions.'),
});
export type SuggestNextNodeOutput = z.infer<typeof SuggestNextNodeOutputSchema>;

export async function suggestNextNode(input: SuggestNextNodeInput): Promise<SuggestNextNodeOutput> {
  return suggestNextNodeFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestNextNodePrompt',
  input: {schema: SuggestNextNodeInputSchema},
  output: {schema: SuggestNextNodeOutputSchema},
  prompt: `You are an AI-powered workflow assistant designed to suggest the next logical node in a user's workflow.

  The user is currently working on the following workflow:
  {{currentWorkflow}}

  The following nodes are available for use:
  {{availableNodes}}

  Instructions: Analyze the current workflow and the available nodes to suggest the most relevant nodes that the user should add next.
  Consider the user's potential goals and the typical flow of data between nodes.
  If the user has provided a specific query, prioritize nodes that match the query.

  Output the suggested nodes as a JSON array of node names, and include a brief explanation of why each node is recommended.

  Desired output format:
  {
    "suggestedNodes": ["node1", "node2"],
    "reasoning": "Explanation of why each node is suggested."
  }`,
});

const suggestNextNodeFlow = ai.defineFlow(
  {
    name: 'suggestNextNodeFlow',
    inputSchema: SuggestNextNodeInputSchema,
    outputSchema: SuggestNextNodeOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
