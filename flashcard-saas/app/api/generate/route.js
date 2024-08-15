
import { NextResponse } from 'next/server'; // Import NextResponse from Next.js for handling responses

// System prompt for the AI, providing guidelines on how to respond to users
const systemPrompt = `
You are a flashcard creator, you take in text and create multiple flashcards from it. Make sure to create exactly 10 flashcards.
Both front and back should be one sentence long.
You should return in the following JSON format:
{
  "flashcards":[
    {
      "front": "Front of the card",
      "back": "Back of the card"
    }
  ]
}
`

// POST function to handle incoming requests
export async function POST(req) {
    const data = await req.json(); // Parse the JSON body of the incoming request
  
    
    // Make a request to the Meta Llama API
    const completion = await fetch('https://api.meta.com/v1/llama/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.META_LLAMA_API_KEY}`, // Use your Meta API key from environment variables
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [{ role: 'system', content: systemPrompt }, ...data], // Include the system prompt and user messages
          model: 'llama-3.1-8b-instruct', // Specify the model to use
          response_format: { type: 'json_object' },
        }),
      })
      // Parse the JSON response from the OpenAI API
      const flashcards = JSON.parse(completion.choices[0].message.content)

      // Return the flashcards as a JSON response
      return NextResponse.json(flashcards.flashcards)
  
       
    }