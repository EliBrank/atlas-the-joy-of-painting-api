import { parse } from 'csv-parse/sync';
import extractSubjects from '../extrators/extract-subjects.js';
import { normalizeTitle, prettifyTitle } from '../utils/normalize-title.js';
export async function transformSubjects() {
    const content = await extractSubjects();
    const records = parse(content, {
        columns: true,
        skipEmptyLines: true
    });
    return records.map((record, index) => {
        const episodeNumber = index + 1;
        const title = normalizeTitle(record.TITLE);
        const subjects = [];
        for (const column in record) {
            if (column === 'EPISODE' || column === 'TITLE') {
                continue;
            }
            if (record[column] === '1') {
                subjects.push(prettifyTitle(column));
            }
        }
        return {
            episodeNumber,
            title,
            subjects
        };
    });
}
//# sourceMappingURL=transform-subjects.js.map