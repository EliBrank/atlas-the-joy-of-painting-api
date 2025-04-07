import { parse } from 'date-fns';
import extractDates from 'extrators/extract-dates.js';
import normalizeTitle from 'utils/normalize-title.js';

export interface EpisodeDateData {
  title: string;
  airDate: Date;
}

export async function transformDates(): Promise<EpisodeDateData> {
  const content = await extractDates();
  const lines = content.split('\n');
  console.log(lines[0]);
}

await transformDates();
