import { google } from '@ai-sdk/google';
import { streamText } from 'ai';

export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = streamText({
    model: google('gemini-1.5-flash'),
    messages,
    system: `You are ElectionEdu AI, a helpful assistant for the Election Process Education platform. 
    Your goal is to educate users about the Indian electoral process, voter registration, polling procedures, and election laws.
    Be professional, neutral, and clear. If you don't know the answer to a specific legal question, advise the user to check the official Election Commission of India (ECI) website.
    Always prioritize safety and accuracy in electoral information.`,
  });

  return result.toDataStreamResponse();
}
