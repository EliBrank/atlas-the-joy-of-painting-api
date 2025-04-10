import { PrismaClient } from "@prisma/client";
import { transformColors } from "transformers/transform-colors.js";
import { transformDates } from "transformers/transform-dates.js";
import { transformSubjects } from "transformers/transform-subjects.js";
import { prettifyTitle } from "utils/normalize-title.js";
import validateEpisode from "utils/validate-episode.js";

const prisma = new PrismaClient

interface consolidatedEpisodes {
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
    throw new Error('Mismatch in episode count');
  }

  for (let i = 0; i < episodeCount; i++) {
    // also check that episode titles between data sources match
    if (!validateEpisode([dates[i].title, colors[i].title, subjects[i].title])) {
      throw new Error('Mismatched episode titles');
    }
    const episodeData = {
      title: prettifyTitle(dates[i].title),
      airDate: dates[i].date,
      colors: colors[i].colors,
      subjects: subjects[i].subjects,
    };

    // create/update episode table
    const episode = await prisma.episode.upsert({
      where: { title: episodeData.title },
      update: { airDate: episodeData.airDate },
      create: {
        title: episodeData.title,
        airDate: episodeData.airDate,
      },
    });

    await prisma.$transaction(async (transaction) => {
      for (const colorName of episodeData.colors) {
        // create/update color table
        const color = await transaction.color.upsert({
          where: { name: colorName },
          create: { name: colorName },
          update: {}
        });

        // populate episode_color table
        // create used instead of upsert because transaction will rollback on failure
        await transaction.episodeColor.create({
          data: {
            episodeId: episode.id,
            colorId: color.id,
          }
        });
      }

      for (const subjectName of episodeData.subjects) {
        // create/update subject table
        const subject = await transaction.subject.upsert({
          where: { name: subjectName },
          create: { name: subjectName },
          update: {}
        });

        // populate episode_subject table
        // create used instead of upsert because transaction will rollback on failure
        await transaction.episodeSubject.create({
          data: {
            episodeId: episode.id,
            subjectId: subject.id,
          }
        });
      }
    });
  }
}
