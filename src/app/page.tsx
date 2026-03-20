"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  ArrowRightLeft,
  ThumbsUp,
  MessageCircle,
  Copy,
  Check,
  Loader2,
  Sparkles,
  Languages,
  ArrowRight,
} from "lucide-react";

type Mode = "to-linkedin" | "to-human";

export default function Home() {
  const [inputText, setInputText] = useState("");
  const [outputText, setOutputText] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [mode, setMode] = useState<Mode>("to-linkedin");

  const handleTranslate = async () => {
    if (!inputText.trim()) return;
    setLoading(true);
    setOutputText("");
    setCopied(false);

    try {
      const endpoint =
        mode === "to-linkedin" ? "/api/translate" : "/api/detranslate";
      const body = { text: inputText };

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();
      if (data.error) {
        setOutputText(`Error: ${data.error}`);
      } else {
        setOutputText(data.result);
      }
    } catch {
      setOutputText("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSwap = () => {
    if (outputText) {
      setInputText(outputText);
      setOutputText("");
    }
    setMode(mode === "to-linkedin" ? "to-human" : "to-linkedin");
    setCopied(false);
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(outputText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <main className="min-h-screen bg-[#f4f2ee]">
      <div className="max-w-[620px] mx-auto px-4 py-8 space-y-4">
        {/* Header */}
        <div className="text-center py-6">
          <div className="inline-flex items-center gap-2.5 mb-3">
            <div className="h-9 w-9 rounded bg-[#0a66c2] flex items-center justify-center">
              <span className="text-white font-bold text-base tracking-tight">in</span>
            </div>
            <h1 className="text-2xl font-bold text-[#191919]">
              LinkedIn Translator
            </h1>
          </div>
          <p className="text-[#666] text-sm">
            {mode === "to-linkedin"
              ? "Type like a human. Post like a corporate psychopath."
              : "Paste the LinkedIn cringe. Get the brutal truth."}
          </p>
        </div>

        {/* Mode Toggle */}
        <div className="bg-white rounded-lg shadow-[0_0_0_1px_rgba(0,0,0,0.08),0_2px_4px_rgba(0,0,0,0.04)] p-1.5 flex gap-1">
          <button
            onClick={() => { setMode("to-linkedin"); setOutputText(""); }}
            className={`flex-1 py-2.5 rounded-md text-[13px] font-semibold transition-all cursor-pointer inline-flex items-center justify-center gap-1.5 ${
              mode === "to-linkedin"
                ? "bg-[#0a66c2] text-white shadow-sm"
                : "text-[#666] hover:bg-[#f8f8f8]"
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            Normal
            <ArrowRight className="w-3 h-3" />
            LinkedIn
          </button>
          <button
            onClick={() => { setMode("to-human"); setOutputText(""); }}
            className={`flex-1 py-2.5 rounded-md text-[13px] font-semibold transition-all cursor-pointer inline-flex items-center justify-center gap-1.5 ${
              mode === "to-human"
                ? "bg-[#0a66c2] text-white shadow-sm"
                : "text-[#666] hover:bg-[#f8f8f8]"
            }`}
          >
            <Languages className="w-3.5 h-3.5" />
            LinkedIn
            <ArrowRight className="w-3 h-3" />
            Normal
          </button>
        </div>

        {/* Input Card */}
        <div className="bg-white rounded-lg shadow-[0_0_0_1px_rgba(0,0,0,0.08),0_2px_4px_rgba(0,0,0,0.04)] p-5 space-y-5">
          <div>
            <label className="text-xs font-semibold text-[#666] uppercase tracking-wide mb-2 block">
              {mode === "to-linkedin" ? "What you actually mean" : "Paste the LinkedIn post"}
            </label>
            <Textarea
              placeholder={
                mode === "to-linkedin"
                  ? 'e.g. "I made a sandwich today"'
                  : 'Paste a cringy LinkedIn post here...'
              }
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="min-h-[110px] text-[15px] resize-none border-0 bg-[#f8f8f8] rounded-lg p-4 placeholder:text-[#999] focus-visible:ring-1 focus-visible:ring-[#0a66c2]/30 font-[family-name:var(--font-sans)]"
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-2">
            <Button
              onClick={handleTranslate}
              disabled={loading || !inputText.trim()}
              className="flex-1 text-[15px] py-5 cursor-pointer rounded-full bg-[#0a66c2] hover:bg-[#004182] font-semibold transition-colors"
              size="lg"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  {mode === "to-linkedin" ? "Manifesting thought leadership..." : "Extracting the actual point..."}
                </span>
              ) : mode === "to-linkedin" ? (
                "Translate to LinkedIn"
              ) : (
                "Translate to Human"
              )}
            </Button>

            {/* Swap button */}
            <button
              onClick={handleSwap}
              title="Swap mode & move output to input"
              className="w-12 h-12 rounded-full border border-[#ddd] bg-white hover:bg-[#f8f8f8] flex items-center justify-center transition-colors cursor-pointer shrink-0 self-center"
            >
              <ArrowRightLeft className="w-4 h-4 text-[#666]" />
            </button>
          </div>
        </div>

        {/* Output */}
        {outputText && (
          mode === "to-linkedin" ? (
            /* Fake LinkedIn Post */
            <div className="bg-white rounded-lg shadow-[0_0_0_1px_rgba(0,0,0,0.08),0_2px_4px_rgba(0,0,0,0.04)]">
              <div className="flex items-start gap-3 p-4 pb-0">
                <div className="h-12 w-12 rounded-full bg-gradient-to-br from-[#0a66c2] to-[#004182] flex items-center justify-center shrink-0">
                  <span className="text-white font-bold text-lg">CB</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-[14px] text-[#191919]">
                    Corporate Bro
                  </div>
                  <div className="text-[12px] text-[#666] leading-snug">
                    Thought Leader | Disruption Enthusiast | Ex-Everything
                  </div>
                  <div className="text-[12px] text-[#999] mt-0.5">Just now</div>
                </div>
              </div>

              <div className="px-4 pt-3 pb-3 whitespace-pre-wrap text-[14px] leading-[1.6] text-[#191919] font-[family-name:var(--font-sans)]">
                {outputText}
              </div>

              <div className="px-4 py-2 flex items-center justify-between text-[12px] text-[#666] border-t border-[#eee]">
                <div className="flex items-center gap-1">
                  <span className="flex -space-x-0.5">
                    <span className="w-[18px] h-[18px] rounded-full bg-blue-500 inline-flex items-center justify-center text-white text-[9px]">
                      <ThumbsUp className="w-2.5 h-2.5" />
                    </span>
                    <span className="w-[18px] h-[18px] rounded-full bg-red-400 inline-flex items-center justify-center text-white text-[9px]">
                      <Sparkles className="w-2.5 h-2.5" />
                    </span>
                  </span>
                  <span className="ml-0.5">4,209 and Elon Musk</span>
                </div>
                <span>847 comments</span>
              </div>

              <div className="border-t border-[#eee] px-2 py-1 flex items-center justify-around">
                <button className="flex items-center gap-1.5 text-[13px] text-[#666] font-semibold py-3 px-4 rounded hover:bg-[#f8f8f8] transition-colors cursor-default">
                  <ThumbsUp className="w-[18px] h-[18px]" />
                  Like
                </button>
                <button className="flex items-center gap-1.5 text-[13px] text-[#666] font-semibold py-3 px-4 rounded hover:bg-[#f8f8f8] transition-colors cursor-default">
                  <MessageCircle className="w-[18px] h-[18px]" />
                  Comment
                </button>
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-1.5 text-[13px] font-semibold py-3 px-4 rounded hover:bg-[#f8f8f8] transition-colors cursor-pointer text-[#0a66c2]"
                >
                  {copied ? (
                    <Check className="w-[18px] h-[18px]" />
                  ) : (
                    <Copy className="w-[18px] h-[18px]" />
                  )}
                  {copied ? "Copied!" : "Copy"}
                </button>
              </div>
            </div>
          ) : (
            /* Human translation output */
            <div className="bg-white rounded-lg shadow-[0_0_0_1px_rgba(0,0,0,0.08),0_2px_4px_rgba(0,0,0,0.04)] p-5">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-[#666] uppercase tracking-wide">
                  What they actually meant
                </span>
                <button
                  onClick={handleCopy}
                  className="inline-flex items-center gap-1 text-[12px] font-semibold text-[#0a66c2] hover:underline cursor-pointer"
                >
                  {copied ? (
                    <><Check className="w-3 h-3" /> Copied!</>
                  ) : (
                    <><Copy className="w-3 h-3" /> Copy</>
                  )}
                </button>
              </div>
              <div className="text-[16px] leading-relaxed text-[#191919] font-[family-name:var(--font-sans)]">
                {outputText}
              </div>
            </div>
          )
        )}

        <p className="text-center text-[11px] text-[#999] pb-6">
          No actual thought leaders were harmed in the making of this tool.
        </p>
      </div>
    </main>
  );
}
