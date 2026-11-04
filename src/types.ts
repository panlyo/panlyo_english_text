export interface TextStats {
  characters: number;
  charactersNoSpaces: number;
  words: number;
  sentences: number;
  paragraphs: number;
  readingTimeMin: number;
  speakingTimeMin: number;
  uniqueWords: number;
  avgWordLength: number;
  avgSentenceLength: number;
  longestWord: string;
  lexicalDensity: number;
}

export interface WordFrequency {
  word: string;
  count: number;
}

export interface SavedText {
  id: string;
  title: string;
  content: string;
  created_at: string;
  updated_at: string;
}
