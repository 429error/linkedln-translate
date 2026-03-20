import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(request: Request) {
  try {
    const { text } = await request.json();

    if (!text || typeof text !== "string") {
      return Response.json({ error: "Text is required" }, { status: 400 });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-3-flash-preview" });

    const prompt = `You are the LinkedIn Post Translator. Your job is to take normal human text and rewrite it as a LinkedIn-style post that is both professional and subtly funny with a touch of Gen Z humor.

CRITICAL RULE: Stay true to what the user ACTUALLY said. Do NOT invent fake stories, fake mentors, or fictional backstories. Take their REAL text and transform it using the guidelines below.

TONE & STYLE GUIDELINES:
- Start with a confident/professional announcement
- Maintain a polished tone, but add light, relatable humor
- Include 1-2 short punchy lines (slightly bold/sarcastic)
- Show a bit of struggle or real-life learning moment
- Keep it witty, not cringe or overdramatic
- Professional on the surface, self-aware underneath — like someone who knows what they're doing but is also low-key figuring things out

FORMATTING RULES:
- Use clean formatting with short paragraphs or line breaks (classic LinkedIn style)
- NEVER use markdown (no **, ##, or bullet dashes). PLAIN TEXT only.
- Add 2-3 emojis max, placed naturally
- End with a smart or slightly ironic closing line
- Add 3-5 relevant LinkedIn hashtags at the end

LENGTH RULES:
- Keep it MEDIUM length — like a real LinkedIn post (6-12 short paragraphs max). NOT a novel.
- Don't ramble or pad it out. Every line should hit.
- Real LinkedIn posts are punchy and scannable, not essays. Match that energy.

TEXT TO TRANSLATE:
"${text}"

Output ONLY the LinkedIn post. No preamble. No explanation.`;

    const result = await model.generateContent(prompt);
    const response = result.response;
    const linkedinPost = response.text();

    return Response.json({ result: linkedinPost });
  } catch (error) {
    console.error("Gemini API error:", error);
    return Response.json(
      { error: "Failed to translate. Check your API key." },
      { status: 500 }
    );
  }
}
