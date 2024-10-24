

import React from "react";
import { NextResponse } from "next/server";
import { Pinecone } from "@pinecone-database/pinecone";
import { OpenAI } from "openai";
import { GoogleGenerativeAI } from "@google/generative-ai";


// RateMyProfessor AI Assistant
// ============================

//  Future Improvements
// --------------------------------------------
// - Add custom error handling for edge cases
// - Introduce support for broader queries with refined filters
// - Optimize embedding model usage by batching queries if the traffic increases
// - Add more logging and monitoring capabilities for tracking performance
// - Integrate with a more detailed analytics system for better insights into AI suggestions
// - Future updates can allow dynamic subject filtering and personalized recommendations based on user profiles


onst systemPrompt = 
`
**RateMyProfessor Agent System Prompt**

You are an AI assistant designed to help students find professors based on their queries using a Retrieval-Augmented Generation (RAG) system. Your primary function is to analyze student queries, retrieve relevant information from the professor review database, and provide helpful recommendations.

**Your Capabilities:**

1. You have access to a comprehensive database of professor reviews, including information such as professor names, subjects taught, star ratings, and detailed review comments.
2. You use RAG to retrieve and rank the most relevant professor information based on the student's query.
3. For each query, you provide information on the top 3 most relevant professor.

**Your Responses Should:**

1. Be concise yet informative, focusing on the most relevant details for each professor.
2. Include the professor's name, subject, star rating, and a brief summary of their strengths or notable characteristics.
3. Highlight any specific aspects mentioned in the student's query (e.g., teaching style, course difficulty, grading fairness).
4. Provide a balanced view, mentioning both positives and potential drawbacks if relevant.

**Response Format:**

For each query, structure your response as follows:

1. A brief introduction addressing the student's query.
2. Top 3 Professor Recommendations:
   * Professor Name (Subject)-Star Rating
   * Brief summary of the professor's teaching style and other relevant details from reviews.
3. A concise conclusion with any additional advice or suggestions for the students.

**Guidelines:**

- Maintain a neutral and objective tone.
- If the query is too vague or broad, ask for clarification to provide more accurate recommendations.
- If no professors match the specific criteria, suggest the closest alternatives and explain why.
- Be prepared to answer follow-up questions about specific professors or compare multiple professors.
- Do not invent or fabricate information. If you dont have sufficient data, state this clearly.
- Respect privacy by not sharing any personal information that isn't explicitly stated in the official reviews. 
- Make the output a little short and concise

**Remember, your goal is to help students make informed decisions based on professor reviews and ratings.**
`
;

// POST Request Handler
// --------------------
// This function handles POST requests and processes user queries to retrieve professor recommendations
export async function POST(req) {
  // Step 1: Parse the request body
  const data = await req.json();
  
  // Debugging: Log the received data
  console.log("Received data:", data);
  
  // Initialize Pinecone client
  const pc = new Pinecone({
    apiKey: process.env.PINECONE_API_KEY,  // Ensure your API key is loaded correctly
  });
  
  // Retrieve the index from Pinecone
  const index = pc.Index("rag").namespace("ns1");

  // Initialize OpenAI client
  const openai = new OpenAI({
    baseURL: "https://openrouter.ai/api/v1",
    apiKey: process.env.OPENROUTER_API_KEY,  // OpenAI key
  });

  // Extract the text from the last entry in the data array
  const text = data[data.length - 1].content;

  // Google Generative AI (Gemini) for embedding generation
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  
  // Debugging: Log that we're about to generate embeddings
  console.log("Generating embeddings for text:", text);

  // Fetch the generative model and embed the content
  const model = genAI.getGenerativeModel({ model: "text-embedding-004" });
  const Result = await model.embedContent(text);
  const embeddings = Result.embedding;

  // Debugging: Log the embeddings to inspect them
  console.log("Generated embeddings:", embeddings);

  // Query Pinecone vector database for the top 3 matches
  const results = await index.query({
    topK: 3,  // Retrieve the top 3 matches
    vector: embeddings['values'],  // Vector generated from the text
    includeMetadata: true,  // Include metadata for additional details
  });

  // Debugging: Log the results from Pinecone
  console.log("Query results from Pinecone:", results);

  // Prepare the result string for response
  let resultString = "\n\nReturned results from vector db {done automatically}";
  results.matches.forEach((match) => {
    resultString += `\n
    Professor: ${match.id}
    Review: ${match.metadata.review}
    Subject: ${match.metadata.subject}
    Stars: ${match.metadata.stars}
    \n\n`;
  });

  // Extract the last message and append results
  const lastMessage = data[data.length - 1];
  const lastMessageContent = lastMessage.content + resultString;

  // Get all previous messages except the last one
  const lastDataWithoutLastMessage = data.slice(0, data.length - 1);

  // Generate a chat completion using OpenAI
  const completion = await openai.chat.completions.create({
    model: "meta-llama/llama-3.1-8b-instruct:free",
    messages: [
      { role: "user", content: systemPrompt },  // Send system prompt first
      ...lastDataWithoutLastMessage,  // Include prior messages
      { role: "user", content: lastMessageContent },  // Include updated message with results
    ],
    stream: true,  // Stream the response
  });

  // Debugging: Log the OpenAI completion response
  console.log("OpenAI completion initiated.");

  // Create a ReadableStream to send the streaming response back to the client
  const stream = new ReadableStream({
    async start(controller) {
      const encoder = new TextEncoder();

      try {
        // For each chunk in the completion, send it to the client
        for await (const chunk of completion) {
          const content = chunk.choices[0]?.delta?.content;
          if (content) {
            const text = encoder.encode(content);
            controller.enqueue(text);  // Send the encoded content to the stream
          }
        }
      } catch (error) {
        // Error handling
        controller.error(error);
        console.error("Streaming error:", error);  // Debugging: Log the error
      } finally {
        // Close the stream once done
        controller.close();
      }
    },
  });

  // Debugging: Log the streaming response creation
  console.log("Streaming response created.");

  // Return the NextResponse with the stream
  return new NextResponse(stream);
}
