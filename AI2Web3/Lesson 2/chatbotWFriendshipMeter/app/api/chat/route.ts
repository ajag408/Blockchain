import OpenAI from "openai";
import { NextResponse } from "next/server";

const openai = new OpenAI();

export const runtime = "edge";

export async function POST(req: Request) {
  const { messages, friendshipMeter } = await req.json();

  let systemMessage = "You are a helpful assistant.";
  if (friendshipMeter > 50) {
    systemMessage = "You are a friendly and enthusiastic assistant who knows the user well.";
  } else if (friendshipMeter > 80) {
    systemMessage = "You are the user's best friend, very excited to chat and catch up!";
  }

  const response = await openai.chat.completions.create({
    model: "gpt-4-0125-preview",
    messages: [
      { role: "system", content: systemMessage },
      ...messages
    ],
  });

  return NextResponse.json({
    content: response.choices[0].message.content,
  });
}