import extractDates from 'extrators/extract-dates.js';
import normalizeTitle from 'utils/normalize-title.js';

export interface EpisodeDateData {
  title: string;
  date: Date;
}

export async function transformDates(): Promise<EpisodeDateData[]> {
  const content = await extractDates();
  const lines = content.split('\n');

  return lines.map(line => {
    // captures "title" (date) in two separate groups
    const pattern = /"([^"]+)"\s*\((\w+\s\d{1,2},\s\d{4})\)/;
    const match = line.match(pattern);

    if (!match) {
      throw new Error('Invalid data pattern: ${line}');
    }
    // match[0] contains the full matched string
    // match[1], match[2]... contain capture groups
    const rawTitle = match[1];
    const rawDate = match[2];

    const title = normalizeTitle(rawTitle);
    if (!title) {
      throw new Error('Invalid title: ${line}');
    }

    const date = new Date(rawDate);
    if (isNaN(date.getTime())) {
      throw new Error('Invalid date: ${line}');
    }

    return { title, date };
  });
}

console.log(await transformDates());
