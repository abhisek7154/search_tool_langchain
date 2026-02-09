import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import { getChatModel } from "../shared/model";
import { SummerizeInputSchema, SummerizeOutputSchema } from "./schemas";

export async function summerize(text: string) {
  const { text: raw } = SummerizeInputSchema.parse({ text });

  const clipped = clip(raw, 5000);

  const model = getChatModel({
    temperature: 0.2,
  });

  const res = await model.invoke([
    new SystemMessage(
      [
        "You are a helpful assistant that writes short and accurate summaries",
        "Guidelines:",
        "- Be factual or can be biased , avoid marketing language.",
        "- 5-8 sentences , no list unless its absolutely necessary",
        "- Don't invert sources ,you can only summarize the provided text .",
        "- Keep it readable",
        "- can use slangs",
      ].join("\n")
    ),

    new HumanMessage(
      [
        "Summarize the following content for a beginner friendly audience.",
        "Focus on key facts and remove fluff",
        "TEXT:",
        clipped,
      ].join("\n\n")
    ),
  ]);

  const rawModelOutput =
    typeof res.content === "string" ? res.content : String(res.content);

  const summary = normalizeSummery(rawModelOutput);

  return SummerizeOutputSchema.parse({ summary });
}

function clip(s: string, max: number) {
  return s.length > max ? s.slice(0, max) : s;
}

function normalizeSummery(s: string) {
  const t = s
    .replace(/\s+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();

  return t.slice(0, 3000);
}