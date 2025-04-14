import { PrismaClient } from "@prisma/client";
import { transformColors } from "transformers/transform-colors.js";
import { transformDates } from "transformers/transform-dates.js";
import { transformSubjects } from "transformers/transform-subjects.js";
import { prettifyTitle } from "utils/normalize-title.js";
import validateEpisode from "utils/validate-episode.js";

const prisma = new PrismaClient

interface ConsolidatedEpisodes {
  episodeNumber: number;
  title: string;
  airDate: Date;
  colors: string[];
  subjects: string[];
}

export async function loadEpisodes() {
  // get all transformed data at once
  const [dates, colors, subjects] = await Promise.all([
    transformDates(),
    transformColors(),
    transformSubjects()
  ]);

  // first check that episode counts are consistent (just in case)
  // dates data serves as primary source of truth to check other data
  const episodeCount = dates.length;
  if (episodeCount !== colors.length || episodeCount !== subjects.length) {
    throw new Error(`Mismatch in episode count:
      Dates: ${dates.length},
      Colors: ${colors.length},
      Subjects: ${subjects.length}`
    );
  }

  const allEpisodes: ConsolidatedEpisodes[] = dates.map((date, index) => {
    // also check that episode titles between data sources match
    if (!validateEpisode([date.title, colors[index].title, subjects[index].title])) {
      throw new Error(`Mismatched episode titles:
        Title in Dates: ${date.title},
        Title in Colors: ${colors[index].title},
        Title in Subjects: ${subjects[index].title}`
      );
    }

    return {
      episodeNumber: date.episodeNumber,
      title: prettifyTitle(date.title),
      airDate: date.date,
      colors: colors[index].colors,
      subjects: subjects[index].subjects,
    };
  });

  await prisma.$transaction(async (subTx) => {
    // clear out existing data in database
    await subTx.episodeColor.deleteMany();
    await subTx.episodeSubject.deleteMany();
    await subTx.episode.deleteMany();
    // reset auto-incremented ids
    await subTx.$executeRaw`DELETE FROM sqlite_sequence WHERE name IN ('Episode','Color','Subject')`;

    for (const episodeData of allEpisodes) {
      // create/update episode table
      const episode = await subTx.episode.upsert({
        where: { episodeNumber: episodeData.episodeNumber },
        create: {
          episodeNumber: episodeData.episodeNumber,
          title: episodeData.title,
          airDate: episodeData.airDate,
        },
        update: {
          title: episodeData.title,
          airDate: episodeData.airDate,
        },
      });

      await Promise.all(episodeData.colors.map(async (colorName) => {
        const color = await subTx.color.upsert({
          where: { name: colorName },
          create: { name: colorName },
          update: {},
        });
        await subTx.episodeColor.create({
          data: {
            episodeId: episode.id,
            colorId: color.id,
          }
        });
      }));

      await Promise.all(episodeData.subjects.map(async (subjectName) => {
        const subject = await subTx.subject.upsert({
          where: { name: subjectName },
          create: { name: subjectName },
          update: {},
        });
        await subTx.episodeSubject.create({
          data: {
            episodeId: episode.id,
            subjectId: subject.id,
          }
        });
      }));
    }
  });
}
