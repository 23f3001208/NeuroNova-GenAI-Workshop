import dotenv from "dotenv";
import axios from "axios";
import { Document } from "@langchain/core/documents";

dotenv.config({ path: "../../.env" });

const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";
const OPENROUTER_HEADERS = {
  Authorization: `Bearer ${process.env.OPENROUTER_API_KEY!}`,
  "Content-Type": "application/json",
};

export const aiSummariseCommit = async (diff: string): Promise<string> => {
  const prompt = `
  You are an expert developer. Summarize the following git diff using concise bullet points only.

  Git Diff Format:
  - Lines starting with '+' were added.
  - Lines starting with '-' were removed.
  - Lines without a prefix are context.

  Instructions:
  - Output only bullet points (no explanations before or after).
  - Do not include filenames or line-by-line changes unless critical.
  - No introductory or closing remarks - just clean bullet points.
  - No new lines between bullet points.
  - Keep it under 5 bullet points.

  Git Diff:
  ${diff}
  `;

  const response = await axios.post(
    OPENROUTER_URL,
    {
      model: "openrouter/anthropic/claude-3.5-sonnet",
      messages: [{ role: "user", content: prompt }],
    },
    { headers: OPENROUTER_HEADERS },
  );

  return response.data.choices[0].message.content.trim();
};

export async function summariseCode(doc: Document) {
  console.log("Getting Summary for", doc.metadata.source);
  const code = doc.pageContent.slice(0, 10000);

  const prompt = `
  You are an intelligent senior software engineer who specialises in onboarding junior software engineers onto projects.
  You are onboarding a junior software engineer and explaining to them the purpose of the ${doc.metadata.source} file.
  Here is the code:
  ---
  ${code}
  ---
  Give a summary no more than 100 words of the code above.
  `;

  const response = await axios.post(
    OPENROUTER_URL,
    {
      model: "openrouter/openai/gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
    },
    { headers: OPENROUTER_HEADERS },
  );

  return response.data.choices[0].message.content.trim();
}

export async function generateEmbedding(summary: string) {
  const response = await axios.post(
    "https://openrouter.ai/api/v1/embeddings",
    {
      model: "openrouter/openai/text-embedding-3-small",
      input: summary,
    },
    { headers: OPENROUTER_HEADERS },
  );

  return response.data.data[0].embedding;
}
