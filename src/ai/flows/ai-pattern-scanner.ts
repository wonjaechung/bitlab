'use server';

/**
 * @fileOverview AI Pattern Scanner flow.
 *
 * This flow identifies chart patterns like 'Golden Cross' and 'RSI Oversold'
 * to find potentially profitable trading opportunities.
 *
 * @interface AIPatternScannerInput
 * @interface AIPatternScannerOutput
 * @function aiPatternScanner
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AIPatternScannerInputSchema = z.object({
  ticker: z.string().describe('The ticker symbol of the stock to analyze.'),
});

export type AIPatternScannerInput = z.infer<typeof AIPatternScannerInputSchema>;

const AIPatternScannerOutputSchema = z.object({
  pattern: z.string().describe('The identified chart pattern (e.g., Golden Cross, RSI Oversold).'),
  recommendation: z.string().describe('A trading recommendation based on the identified pattern.'),
  confidence: z.number().describe('The confidence level (0-1) in the identified pattern.'),
});

export type AIPatternScannerOutput = z.infer<typeof AIPatternScannerOutputSchema>;

export async function aiPatternScanner(input: AIPatternScannerInput): Promise<AIPatternScannerOutput> {
  return aiPatternScannerFlow(input);
}

const aiPatternScannerPrompt = ai.definePrompt({
  name: 'aiPatternScannerPrompt',
  input: {schema: AIPatternScannerInputSchema},
  output: {schema: AIPatternScannerOutputSchema},
  prompt: `You are an AI trading assistant that identifies chart patterns and provides trading recommendations.

  Analyze the following stock ticker symbol: {{ticker}}

  Identify any relevant chart patterns, such as Golden Cross, RSI Oversold, etc.
  Provide a trading recommendation based on the identified pattern.
  Also, provide a confidence score of how sure you are of the identified pattern.  Return a JSON object.

  Here's the output schema that must be returned:
  ${JSON.stringify(AIPatternScannerOutputSchema.shape, null, 2)}`,
});

const aiPatternScannerFlow = ai.defineFlow(
  {
    name: 'aiPatternScannerFlow',
    inputSchema: AIPatternScannerInputSchema,
    outputSchema: AIPatternScannerOutputSchema,
  },
  async input => {
    const {output} = await aiPatternScannerPrompt(input);
    return output!;
  }
);
