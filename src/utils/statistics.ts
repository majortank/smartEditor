import { DocumentStats } from '../types';

export function computeStats(text: string): DocumentStats {
  const trimmed = text.trim();
  if (!trimmed) {
    return {
      words: 0,
      characters: 0,
      lines: 0,
      readingTimeMinutes: 0,
      readingEase: 'N/A',
    };
  }

  const words = trimmed.split(/\s+/).filter(Boolean);
  const wordCount = words.length;
  const charCount = text.length;
  const lineCount = text.split('\n').length;

  // Average reading speed: 200 words per minute
  const readingTime = Math.max(1, Math.ceil(wordCount / 200));

  // Estimate reading ease based on sentence and word length heuristics
  const sentences = trimmed.split(/[.!?]+/).filter(Boolean).length || 1;
  const avgWordsPerSentence = wordCount / sentences;
  const avgSyllablesPerWord = words.reduce((acc, w) => acc + estimateSyllables(w), 0) / (wordCount || 1);

  // Flesch Reading Ease Formula approximation: 206.835 - (1.015 * ASL) - (84.6 * ASW)
  const score = Math.round(206.835 - (1.015 * avgWordsPerSentence) - (84.6 * avgSyllablesPerWord));
  let easeLabel = 'Standard';
  if (score >= 90) easeLabel = 'Very Easy';
  else if (score >= 70) easeLabel = 'Easy / Accessible';
  else if (score >= 60) easeLabel = 'Standard / Professional';
  else if (score >= 40) easeLabel = 'Technical / Dense';
  else easeLabel = 'Advanced Academic';

  return {
    words: wordCount,
    characters: charCount,
    lines: lineCount,
    readingTimeMinutes: readingTime,
    readingEase: easeLabel,
  };
}

function estimateSyllables(word: string): number {
  word = word.toLowerCase().trim();
  if (word.length <= 3) return 1;
  word = word.replace(/(?:[^laeiouy]|ed|es|e)$/, '');
  word = word.replace(/^y/, '');
  const matches = word.match(/[aeiouy]{1,2}/g);
  return matches ? matches.length : 1;
}
