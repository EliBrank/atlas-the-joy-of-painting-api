import extractDates from '../extrators/extract-dates.js';
import { normalizeTitle } from '../utils/normalize-title.js';
export async function transformDates() {
    const content = await extractDates();
    const lines = content.split('\n')
        .filter(line => line.trim() !== ''); // remove blank lines
    return lines.map((line, index) => {
        const episodeNumber = index + 1;
        // captures "title" and (date) in two separate groups
        const pattern = /"([^"]+)"\s*\((\w+\s\d{1,2},\s\d{4})\)/;
        const match = line.match(pattern);
        if (!match) {
            throw new Error(`Invalid data pattern: ${line}`);
        }
        // match[0] contains the full matched string
        // match[1], match[2]... contain capture groups
        const rawTitle = match[1];
        const rawDate = match[2];
        const title = normalizeTitle(rawTitle);
        if (!title) {
            throw new Error(`Invalid title: ${line}`);
        }
        const date = new Date(rawDate);
        if (isNaN(date.getTime())) {
            throw new Error(`Invalid date: ${line}`);
        }
        return { episodeNumber, title, date };
    });
}
//# sourceMappingURL=transform-dates.js.map