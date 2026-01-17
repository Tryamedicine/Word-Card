export interface WordData {
  id: string;
  text: string;
  phonetic: string;
  definition: string;
  example: string;
  partOfSpeech: string;
  mastery: number; // 0 to 5
  lastReviewed: number; // Timestamp
}

export enum AppView {
  SEARCH = 'SEARCH',
  REVIEW = 'REVIEW',
  LIBRARY = 'LIBRARY'
}

export interface GeminiWordResponse {
  definition: string;
  example: string;
  phonetic: string;
  partOfSpeech: string;
}