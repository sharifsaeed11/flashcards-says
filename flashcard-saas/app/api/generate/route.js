
import { NextResponse } from "next/server";


const systemPrompt = `
You are a flashcard creator. You take in text and create exactly 10 flashcards from it. Both front and back should be one sentence long and not include unessesarily long words and keep them under 120 characters. Please ensure the JSON format is as follows:
{
  "flashcards":[
    {
      "front": "Front of the card",
      "back": "Back of the card"
    }
  ]
}
Make sure the response strictly adheres to this format. Do not include any additional text outside of the JSON. 
`;

export async function POST(req) {

  try {
    const data = await req.json();
    console.log("Received request data:", data);

    const response = await fetch("https://api.llama-api.com/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.META_LLAMA_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: data.text },
        ],
        model: "llama3.1-70b",
        response_format: "json",
        max_tokens: 512, // Increase the token limit if possible
      }),
    });

    console.log("API request completed with status:", response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Error response from API:", errorText);
      throw new Error(
        `API responded with status ${response.status}: ${errorText}`
      );
    }

    const rawResponseText = await response.text();
    console.log("Raw API response:", rawResponseText);

    // Attempt to fix incomplete JSON by trimming at the last complete JSON object
    let jsonResponseText = rawResponseText;

    const lastCurlyBraceIndex = jsonResponseText.lastIndexOf("}");
    if (lastCurlyBraceIndex !== -1) {
      jsonResponseText = jsonResponseText.slice(0, lastCurlyBraceIndex + 1);
    } else {
      throw new Error("Incomplete JSON response received from the API.");
    }

    let responseData;
    try {
      responseData = JSON.parse(jsonResponseText);
    } catch (parseError) {
      console.error("Failed to parse JSON:", parseError.message);
      throw new Error(`Failed to parse API response: ${parseError.message}`);
    }

    console.log("Parsed API response:", responseData);

    // Correct extraction of flashcards
    const flashcards = responseData.choices[0]?.message?.content;
    if (!flashcards) {
      throw new Error("Unexpected response format");
    }

    // Parse the content if it's still in string form
    let parsedFlashcards;
    try {
      parsedFlashcards = JSON.parse(flashcards).flashcards;
    } catch (parseError) {
      console.error("Failed to parse flashcards content:", parseError.message);
      throw new Error(
        `Failed to parse flashcards content: ${parseError.message}`
      );
    }

    console.log("Parsed flashcards:", parsedFlashcards);

    return NextResponse.json(parsedFlashcards);
  } catch (error) {
    console.error("Error:", error.message);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
}
