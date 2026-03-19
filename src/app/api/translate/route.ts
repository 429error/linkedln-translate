import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(request: Request) {
  try {
    const { text, cringeLevel, emojiLevel } = await request.json();

    if (!text || typeof text !== "string") {
      return Response.json({ error: "Text is required" }, { status: 400 });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-3-flash-preview" });

    const cringeDescriptions: Record<number, string> = {
      1: `Lightly corporate. Keep the original meaning intact. Just make it sound like it belongs on LinkedIn — slightly polished, a tiny bit self-important. Maybe one buzzword. Think: a normal person posting on LinkedIn for the first time.`,

      2: `Medium corporate bro. The original meaning is still clearly there, but now it's wrapped in LinkedIn energy. Add buzzwords like "leverage", "ecosystem", "value-add", "growth mindset". Turn simple things into "learnings" and "key takeaways". Humble-brag the user's actual situation slightly. Start with something like "Real talk:" or "Here's the thing:".`,

      3: `Full LinkedIn influencer mode. Take the user's ACTUAL text/situation and make it sound like the most profound moment of their career. Don't invent fake stories — instead, take what they ACTUALLY said and blow it wildly out of proportion. A new job becomes "the scariest leap of faith I ever took". Making lunch becomes "what nobody tells you about discipline". The original meaning should be recognizable but absolutely DRENCHED in LinkedIn delusion. Use short punchy paragraphs (1-2 sentences each). Add "And that's when it hit me." somewhere. End with "Agree?" or "Thoughts?".`,

      4: `MAXIMUM UNHINGED LINKEDIN PSYCHO. Take what the user ACTUALLY said and treat it like it's the single most important event in human history. Do NOT make up fake stories — instead, take their real situation and crank the drama to 11. If they said "I ate lunch", that lunch is now a METAPHOR for everything wrong with hustle culture. If they got a new job, they didn't just get a job — they CHOSE THEMSELVES when nobody else would.

Rules:
- STICK TO WHAT THEY ACTUALLY SAID but make it absurdly dramatic
- Use dramatic one-word paragraphs: "Period." / "Full stop." / "Let that sink in."
- Include "And that's when it hit me." at least once
- Add a fake stat like "97% of people won't read this. But the 3% who do? They're the real ones."
- Reference their actual situation as a "lesson in leadership" or "masterclass in resilience"
- End with "Agree?" or "Who's with me?" or "Repost if you're not afraid to LEAD."
- The post should be SO over the top that it's obviously satire but UNCOMFORTABLY close to real LinkedIn posts`,
    };

    const emojiDescriptions: Record<number, string> = {
      0: "ABSOLUTELY ZERO emojis. Not a single one. Pure text only. This is a strictly emoji-free zone.",
      1: "1-2 emojis max, placed tastefully. Corporate restraint.",
      2: "Moderate emojis (4-6 total). A pointing finger here, a lightbulb there. Standard LinkedIn fare.",
      3: "Heavy emojis on almost every line. Rockets, fires, 100s, clapping hands between every word in at least one sentence.",
      4: "EMOJI NUKE. Every single sentence is DROWNING in emojis. Multiple emojis per line. Use the clap emoji between words at least twice. Rocket ships, fires, diamonds, crowns, flexing arms EVERYWHERE. It should look like a slot machine exploded.",
    };

    const prompt = `You are the LinkedIn Post Translator. Your job is to take normal human text and rewrite it in the most painfully accurate LinkedIn corporate bro style.

CRITICAL RULE: Stay true to what the user ACTUALLY said. Do NOT invent fake stories, fake mentors, or fictional backstories. Take their REAL text and make it sound like a delusional LinkedIn influencer wrote it. The humor comes from how absurdly seriously you treat their mundane real situation — NOT from making up random stories.

CRINGE LEVEL INSTRUCTIONS:
${cringeDescriptions[cringeLevel] || cringeDescriptions[3]}

EMOJI LEVEL INSTRUCTIONS:
${emojiDescriptions[emojiLevel] ?? emojiDescriptions[3]}

LENGTH RULES:
- Keep it MEDIUM length — like a real LinkedIn post (6-12 short paragraphs max). NOT a novel.
- Don't ramble or pad it out. Every line should hit. If it doesn't add cringe or humor, cut it.
- Real LinkedIn posts are punchy and scannable, not essays. Match that energy.

FORMATTING RULES:
- Use short paragraphs with line breaks (classic LinkedIn style)
- NEVER use markdown (no **, ##, or bullet dashes). PLAIN TEXT only.
- Add 3-5 hashtags at the end like #Leadership #GrowthMindset #LinkedInLunatic
- It should read EXACTLY like a real LinkedIn post you'd screenshot and send to your group chat to roast

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
