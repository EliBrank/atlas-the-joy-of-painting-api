import { parse } from 'csv-parse/sync';
import extractSubjects from 'extrators/extract-subjects.js';
import { normalizeTitle, prettifyTitle } from 'utils/normalize-title.js';

export interface EpisodeSubjectData {
  episodeNumber: number;
  title: string;
  subjects: string[];
}

export async function transformSubjects(): Promise<EpisodeSubjectData[]> {
  const content = await extractSubjects();
  const records: Array<Record<string, string>> = parse(content, {
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

const stuff = await transformSubjects();
console.log(stuff[5]);
console.log(stuff[6]);
