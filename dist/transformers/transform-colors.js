import { parse } from 'csv-parse/sync';
import extractColors from '../extrators/extract-colors.js';
import { normalizeTitle } from '../utils/normalize-title.js';
export async function transformColors() {
    const content = await extractColors();
    const records = parse(content, {
        columns: true,
        skipEmptyLines: true
    });
    return records.map((record, index) => {
        const episodeNumber = index + 1;
        const rawTitle = record.painting_title;
        // remove carriage returns from colors array
        const rawColors = record.colors.replace(/\\r|\\n/g, '');
        const title = normalizeTitle(rawTitle);
        // format colors array as JSON for easy parsing
        const colors = JSON.parse(rawColors.replace(/'/g, '"'));
        return {
            episodeNumber,
            title,
            colors
        };
    });
}
//# sourceMappingURL=transform-colors.js.map