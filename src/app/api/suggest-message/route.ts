import { streamText, Output, generateObject } from "ai";
import { google } from "@ai-sdk/google";
import { z } from "zod";
import dbConnect from "@/lib/db";

const prompt = `
You are a JSON generator.

Generate EXACTLY 3 anonymous feedback messages.

OUTPUT RULES:
- Return ONLY valid JSON
- No markdown, no explanation, no extra text
- Must be directly parsable with JSON.parse()

RESPONSE FORMAT:
{
  "suggestions": [
    {
      "message": "string"
    },
    {
      "message": "string"
    },
    {
      "message": "string"
    }
  ]
}

STRICT REQUIREMENTS:
- suggestions array MUST contain exactly 3 items
- each message must be:
  - short and natural
  - realistic anonymous feedback
  - human-like (not robotic)
- do NOT include empty strings
- do NOT include duplicates

STYLE GUIDELINES:
- mix of positive, neutral, and slightly critical feedback
- keep tone natural and conversational
- avoid overly formal language
`;

export async function POST() {
  const result = await generateObject({
    model: google("gemini-2.5-flash"),
    schema: z.object({
      suggestions: z.array(z.object({ message: z.string() })).length(3),
    }),
    prompt,
  });

  return Response.json(result.object);
}
