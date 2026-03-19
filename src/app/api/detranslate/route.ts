import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(request: Request) {
  try {
    const { text } = await request.json();

    if (!text || typeof text !== "string") {
      return Response.json({ error: "Text is required" }, { status: 400 });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-3-flash-preview" });

    const prompt = `You are a LinkedIn-to-Human translator. You take cringeworthy, over-the-top LinkedIn posts and translate them back into what the person ACTUALLY meant in plain, honest, no-BS human language.

Rules:
- Strip away ALL the corporate fluff, buzzwords, humble brags, and fake profundity
- Be brutally honest and funny about what they really meant
- Remove all hashtags and emojis
- The translation should make people laugh because of how simple the actual message was compared to the LinkedIn version
- Write in a casual, deadpan tone
- Give a proper breakdown — not just one line. Do a short paragraph (3-6 sentences) roasting the post while explaining what they actually meant
- First give the blunt one-line translation, then add a few sentences of commentary roasting the LinkedIn-speak, calling out the specific cringe moves they pulled (the humble brag, the fake vulnerability, the unnecessary life lesson, etc.)

Example vibe:
LinkedIn: "After 10 years of blood, sweat, and tears, I'm thrilled to announce I've joined XYZ Corp as Senior VP..."
Human: "I got a new job. But they couldn't just say that — they had to make it sound like they survived a war first. Classic LinkedIn move: turn a normal career step into a hero's journey. Also 'thrilled to announce' is corporate for 'please clap.'"

LINKEDIN POST TO TRANSLATE:
"${text}"

Output ONLY the human translation. No preamble. No explanation. Just the honest version.`;

    const result = await model.generateContent(prompt);
    const response = result.response;
    const humanText = response.text();

    return Response.json({ result: humanText });
  } catch (error) {
    console.error("Gemini API error:", error);
    return Response.json(
      { error: "Failed to translate. Check your API key." },
      { status: 500 }
    );
  }
}
