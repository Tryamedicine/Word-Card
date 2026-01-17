import { WordData } from '../types';

// Use import.meta.env for Vite
const API_URL = import.meta.env.VITE_GOOGLE_APP_SCRIPT_URL;

export const fetchWords = async (): Promise<WordData[]> => {
  if (!API_URL) {
    console.warn('GOOGLE_APP_SCRIPT_URL is not set. Returning empty list.');
    return [];
  }

  try {
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error('Network response was not ok');
    const data = await response.json();
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error('Error fetching words:', error);
    return [];
  }
};

export const addWord = async (word: WordData): Promise<boolean> => {
  if (!API_URL) return false;

  try {
    // GAS often requires 'text/plain' to avoid CORS preflight complex requests if the script isn't handling OPTIONS perfectly,
    // but we'll try standard JSON first or no-cors if needed.
    // However, for best results with the provided GAS script, we send a POST with text/plain body which GAS parses.
    const response = await fetch(API_URL, {
      method: 'POST',
      body: JSON.stringify({ ...word, action: 'add' }),
    });

    // With GAS Web App, we might get a redirect or opaque response if not configured perfectly.
    // But assuming the GAS script uses ContentService.createTextOutput, it should return JSON.
    const result = await response.json();
    return result.status === 'success';
  } catch (error) {
    console.error('Error adding word:', error);
    return false;
  }
};

export const updateWordMastery = async (id: string, mastery: number, lastReviewed: number): Promise<boolean> => {
  if (!API_URL) return false;

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      body: JSON.stringify({
        action: 'update',
        id,
        mastery,
        lastReviewed
      }),
    });

    const result = await response.json();
    return result.status === 'success';
  } catch (error) {
    console.error('Error updating word:', error);
    return false;
  }
};
