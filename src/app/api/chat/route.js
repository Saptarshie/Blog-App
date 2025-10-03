// app/api/chat/route.js
import { OpenAI } from "openai";
import { OpenAIStream } from "ai";

// Initialize OpenAI client but point it to OpenRouter
const client = new OpenAI({
  apiKey: process.env.OPENROUTER_API_KEY,
  baseURL: "https://openrouter.ai/api/v1",
  defaultHeaders: {
    "HTTP-Referer": "http://localhost:3000", // change to your domain in prod
    "X-Title": "My Next.js Chatbot",
  },
});

export async function POST(req) {
  // Fixed: Changed 'request' to 'req'
  const { messages, context } = await req.json();
  
  const systemPrompt = `You are a helpful AI assistant. The user will ask questions about this blog post and You would ans it in good quality, concise and very well-structured (and well-formatted) markdown format ,... Here's the blog content for context:\n\n${context}`;
  
  // Prepend system prompt
  const fullMessages = [
    { role: "system", content: systemPrompt },
    ...messages,
  ];

  // Call OpenRouter
  const response = await client.chat.completions.create({
    model: process.env.MODEL_NAME, // or any model available on OpenRouter
    messages: fullMessages,
    stream: true,
  });

  // Stream back to frontend
  const stream = OpenAIStream(response);
  return new Response(stream);
}