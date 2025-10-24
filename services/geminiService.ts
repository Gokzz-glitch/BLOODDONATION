// Fix: Use GenerateContentParameters instead of deprecated GenerateContentRequest.
import { GoogleGenAI, GenerateContentParameters } from "@google/genai";
import { ChatMessage, MessageAuthor, Coordinates } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

export const getChatResponse = async (
  prompt: string,
  location: Coordinates | null
): Promise<ChatMessage> => {
  
  const request: GenerateContentParameters = {
    model: 'gemini-2.5-flash-lite',
    contents: prompt,
    config: {
      tools: [{ googleSearch: {} }, { googleMaps: {} }],
    },
  };
  
  if (location) {
    request.config!.toolConfig = {
      retrievalConfig: {
        latLng: {
          latitude: location.latitude,
          longitude: location.longitude,
        }
      }
    };
  }

  try {
    const response = await ai.models.generateContent(request);

    let text = response.text;
    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];

    // Find the first maps chunk with review snippets to highlight.
    const mapChunkWithReviews = groundingChunks.find(
      (chunk) => chunk.maps?.placeAnswerSources?.reviewSnippets?.length,
    );

    if (mapChunkWithReviews) {
      const reviews = mapChunkWithReviews.maps!.placeAnswerSources!.reviewSnippets!;
      
      // Format the reviews into a markdown blockquote string
      const formattedReviews = reviews.map(r => `> "${r.text.trim()}"`).join('\n');
      
      // Append the reviews to the main text response for prominence.
      if (formattedReviews) {
        text += `\n\n**Here's what people are saying:**\n${formattedReviews}`;
      }
    }


    return {
      author: MessageAuthor.BOT,
      text: text,
      groundingChunks: groundingChunks,
    };
  } catch (error) {
    console.error("Gemini API call failed:", error);
    return {
      author: MessageAuthor.BOT,
      text: "Sorry, I encountered an error while processing your request.",
    };
  }
};