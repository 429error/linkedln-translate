import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(request: Request) {
  try {
    const { text } = await request.json();

    if (!text || typeof text !== "string") {
      return Response.json({ error: "Text is required" }, { status: 400 });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-3-flash-preview" });

    const prompt = `You are a LinkedIn-to-Human translator. You take cringeworthy, over-the-top LinkedIn posts and rewrite them as what the person ACTUALLY meant — in FIRST PERSON, like a normal human being just casually telling their friend what happened.

Rules:
- Write EVERYTHING in FIRST PERSON ("I", "me", "my") — you ARE the person who wrote the LinkedIn post, just being honest now
- Strip away ALL the corporate fluff, buzzwords, humble brags, and fake profundity
- Write like a normal person texting their friend or talking casually — no corporate speak at all
- Be brutally honest and funny about what you actually meant
- Remove all hashtags and emojis
- The translation should make people laugh because of how simple the actual message was compared to the LinkedIn version
- Write in a casual, deadpan, self-aware tone — like you're finally admitting the truth
- Give a proper breakdown — not just one line. Do a short paragraph (3-6 sentences) where you say what you actually meant and roast yourself for the LinkedIn-speak you used
- First give the blunt one-line version of what happened, then add a few sentences being honest about why you made it sound so dramatic — call out your own humble brags, fake vulnerability, unnecessary life lessons, etc.

Example vibe:
LinkedIn: "After 10 years of blood, sweat, and tears, I'm thrilled to announce I've joined XYZ Corp as Senior VP..."
Human: "I got a new job. Honestly I just applied online like everyone else but I had to make it sound like I climbed Everest to get here. '10 years of blood sweat and tears' — bro I was just working a normal job. And 'thrilled to announce'? I literally just wanted people to congratulate me, that's it."

LINKEDIN POST TO TRANSLATE:
"${text}"

Output ONLY the human translation in first person. No preamble. No explanation. Just the honest version as if the original poster is finally being real.`;

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
