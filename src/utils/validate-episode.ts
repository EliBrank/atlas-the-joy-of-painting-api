import { compareTwoStrings } from 'string-similarity';
import { normalizeTitle } from './normalize-title.js';

const SIMILARITY_THRESHOLD = 0.75;

export default function validateEpisode(titles: string[]): boolean {
  let isValid = true;
  const numTitles = titles.length;

  for (let i = 0; i < numTitles; i++) {
    for (let j = i; j < numTitles; j++) {
      if (i === j) continue;
      // checks that all titles match reasonably well
      const title1 = normalizeTitle(titles[i]);
      const title2 = normalizeTitle(titles[j]);
      const similarity = compareTwoStrings(title1, title2);
      if (similarity < SIMILARITY_THRESHOLD) {
        isValid = false;
        return isValid;
      }
    }
  }

  return isValid;
}
