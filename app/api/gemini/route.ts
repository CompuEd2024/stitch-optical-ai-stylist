import { NextResponse } from 'next/server';
import { GoogleGenAI } from "@google/genai";

// Standard Node.js runtime for Vercel Serverless
export const runtime = 'nodejs';

export async function POST(req: Request) {
  try {
    const { centerFrame, rightFrame, leftFrame } = await req.json();

    if (!centerFrame || !rightFrame || !leftFrame) {
      return NextResponse.json({ error: "Frame data is corrupted or incomplete." }, { status: 400 });
    }

    const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "GOOGLE_GENERATIVE_AI_API_KEY is not configured on server." }, { status: 500 });
    }

    const ai = new GoogleGenAI(apiKey);
    
    const prompt = `You are an expert optical precision analyzer. 
    Analyze these three sequential frames (center, right, left) of a person. 
    The person was holding a standard credit card (85.6mm width) to their forehead in the center frame (calibrate based on this standard).
    
    Calculate:
    1. Interpupillary Distance (IPD) in mm.
    2. Face Shape (Oval, Round, Square, Heart, Diamond).
    3. Facial Symmetry Index (0.0 to 1.0).
    4. Optimal Bridge Width (mm).
    5. Stylist Recommendation: A brief fashion-forward reason for the suggested style.

    Return ONLY a JSON object with these keys: 
    "ipd", "faceShape", "symmetry", "bridgeWidth", "styleRecommendation"`;

    const response = await ai.getGenerativeModel({
      model: "gemini-3.1-flash-lite-preview",
      generationConfig: {
        responseMimeType: "application/json"
      }
    }).generateContent({
      contents: [
        {
          role: 'user',
          parts: [
            { text: prompt },
            { inlineData: { data: centerFrame, mimeType: "image/jpeg" } },
            { inlineData: { data: rightFrame, mimeType: "image/jpeg" } },
            { inlineData: { data: leftFrame, mimeType: "image/jpeg" } },
          ]
        }
      ]
    });

    const results = JSON.parse(response.response.text() || '{}');
    return NextResponse.json(results);

  } catch (error: any) {
    console.error("Gemini API Error:", error);
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}
