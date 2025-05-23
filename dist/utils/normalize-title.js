export function normalizeTitle(text) {
    let textClean = text
        // remove leading/trailing quotes/whitespace
        .replace(/^["\s]+|["\s]+$/g, '')
        // replace '&' with 'and'
        .replace(/&/g, 'and')
        // replace '-' with spaces
        .replace(/-/g, ' ');
    return textClean.toLowerCase().trim();
}
export function prettifyTitle(text) {
    const exceptions = new Set([
        'a', 'an', 'and', 'as', 'at', 'but', 'by', 'down', 'for', 'from', 'if', 'in', 'into', 'is', 'like', 'nor', 'of', 'off', 'on', 'once', 'onto', 'or', 'past', 'so', 'the', 'than', 'that', 'to', 'upon', 'when', 'with', 'yet'
    ]);
    const textClean = text
        .split(' ')
        .map(word => {
        const wordLower = word.toLowerCase();
        if (exceptions.has(wordLower)) {
            return wordLower;
        }
        else {
            // for all non-exception words, capitalize first letter
            return wordLower.charAt(0).toUpperCase() + wordLower.slice(1);
        }
    })
        .join(' ');
    // use same technique to ensure first letter of string always capitalized
    return textClean.charAt(0).toUpperCase() + textClean.slice(1);
}
//# sourceMappingURL=normalize-title.js.map