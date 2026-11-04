import type { TextStats, WordFrequency } from "../types";

export function analyzeText(text: string): TextStats {
  const trimmed = text.trim();
  const characters = text.length;
  const charactersNoSpaces = text.replace(/\s/g, "").length;

  const words = trimmed
    ? (trimmed.match(/\b[\w'-]+\b/g) || []).filter((w) => /[a-zA-Z]/.test(w))
    : [];
  const wordCount = words.length;

  const sentences = trimmed
    ? (trimmed.match(/[.!?]+(?=\s|$)/g) || []).length || (wordCount > 0 ? 1 : 0)
    : 0;

  const paragraphs = trimmed
    ? trimmed.split(/\n\s*\n/).filter((p) => p.trim().length > 0).length
    : 0;

  const readingTimeMin = wordCount > 0 ? Math.max(1, Math.ceil(wordCount / 200)) : 0;
  const speakingTimeMin = wordCount > 0 ? Math.max(1, Math.ceil(wordCount / 130)) : 0;

  const uniqueWords = new Set(words.map((w) => w.toLowerCase())).size;

  const totalWordLength = words.reduce((sum, w) => sum + w.length, 0);
  const avgWordLength = wordCount > 0 ? Math.round((totalWordLength / wordCount) * 10) / 10 : 0;

  const avgSentenceLength = sentences > 0 ? Math.round((wordCount / sentences) * 10) / 10 : 0;

  const longestWord = words.reduce((longest, w) => (w.length > longest.length ? w : longest), "");

  const lexicalDensity =
    wordCount > 0
      ? Math.round((uniqueWords / wordCount) * 100)
      : 0;

  return {
    characters,
    charactersNoSpaces,
    words: wordCount,
    sentences,
    paragraphs,
    readingTimeMin,
    speakingTimeMin,
    uniqueWords,
    avgWordLength,
    avgSentenceLength,
    longestWord,
    lexicalDensity,
  };
}

export function getWordFrequency(text: string, limit: number = 20): WordFrequency[] {
  const trimmed = text.trim();
  if (!trimmed) return [];

  const words = trimmed.match(/\b[\w'-]+\b/g) || [];
  const stopWords = new Set([
    "the", "a", "an", "and", "or", "but", "in", "on", "at", "to", "for",
    "of", "with", "by", "from", "is", "was", "are", "were", "be", "been",
    "being", "have", "has", "had", "do", "does", "did", "will", "would",
    "could", "should", "may", "might", "must", "shall", "can", "need",
    "it", "its", "he", "she", "they", "we", "you", "i", "me", "him", "her",
    "them", "us", "my", "your", "his", "their", "our", "this", "that",
    "these", "those", "as", "if", "then", "than", "so", "not", "no",
  ]);

  const englishWords = words.filter((w) => /[a-zA-Z]/.test(w));

  const freq: Record<string, number> = {};
  for (const word of englishWords) {
    const lower = word.toLowerCase();
    if (stopWords.has(lower)) continue;
    freq[lower] = (freq[lower] || 0) + 1;
  }

  return Object.entries(freq)
    .map(([word, count]) => ({ word, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, limit);
}

export function getKeywordDensity(text: string): { keyword: string; density: number }[] {
  const words = text.trim().match(/\b[\w'-]+\b/g) || [];
  const englishWords = words.filter((w) => /[a-zA-Z]/.test(w));
  if (englishWords.length === 0) return [];

  const freq: Record<string, number> = {};
  for (const word of englishWords) {
    const lower = word.toLowerCase();
    freq[lower] = (freq[lower] || 0) + 1;
  }

  const total = englishWords.length;
  return Object.entries(freq)
    .map(([keyword, count]) => ({
      keyword,
      density: Math.round((count / total) * 1000) / 10,
    }))
    .sort((a, b) => b.density - a.density)
    .slice(0, 10);
}
