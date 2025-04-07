export default function normalizeTitle(text: string): string {
  const exceptions = new Set([
    'a', 'and', 'as', 'at', 'but', 'by', 'down', 'for', 'from', 'if', 'in', 'into', 'is', 'like', 'near', 'nor', 'of', 'off' , 'on', 'once', 'onto', 'or', 'over', 'past', 'so', 'than', 'that', 'to', 'upon', 'when', 'with', 'yet'
  ]);
  const textClean = text
    .split(' ')
    .map(word => {
      const wordLower = word.toLowerCase();
      if (exceptions.has(wordLower)) {
        return wordLower;
      } else {
        // for all non-exception words, capitalize first letter
        return wordLower.charAt(0).toUpperCase() + wordLower.slice(1);
      }
    })
    .join(' ');
  // use same technique to ensure first letter of string always capitalized
  return textClean.charAt(0).toUpperCase() + textClean.slice(1)
}

