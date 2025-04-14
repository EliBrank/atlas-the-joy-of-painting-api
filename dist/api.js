import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
const app = express();
const PORT = 5000;
app.use(cors());
app.use(express.json());
// URL approach
// month endpoint
app.get('/episodes/month/:month', async (req, res) => {
    try {
        const month = parseInt(req.params.month);
        if (month < 1 || month > 12) {
            throw new Error('Invalid month. Month must be between 1 and 12.');
        }
        res.json(await findEpisodes({
            months: [month]
        }));
    }
    catch (error) {
        res.status(400).json({
            error: error
        });
    }
});
// color endpoint
app.get('/episodes/color/:color', async (req, res) => {
    try {
        const color = req.params.color;
        if (!color) {
            throw new Error('Invalid color');
        }
        res.json(await findEpisodes({
            colors: [color]
        }));
    }
    catch (error) {
        res.status(400).json({
            error: error
        });
    }
});
// subject endpoint
app.get('/episodes/subject/:subject', async (req, res) => {
    try {
        const subject = req.params.subject;
        if (!subject) {
            throw new Error('Invalid subject');
        }
        res.json(await findEpisodes({
            subjects: [subject]
        }));
    }
    catch (error) {
        res.status(400).json({
            error: error
        });
    }
});
// query approach
app.get('/episodes', async (req, res) => {
    try {
        const filters = {
            months: normalizeParam(req.query.months)?.map(Number),
            colors: normalizeParam(req.query.colors),
            subjects: normalizeParam(req.query.subjects)
        };
        const episodes = await findEpisodes(filters);
        res.json(episodes);
    }
    catch (error) {
        res.status(400).json({
            error: error
        });
    }
});
async function findEpisodes(filters) {
    const where = buildQuery(filters);
    const episodes = await prisma.episode.findMany({
        where,
        include: {
            colors: {
                include: { color: true }
            },
            subjects: {
                include: { subject: true }
            }
        }
    });
    return episodes.map(episode => ({
        id: episode.id,
        title: episode.title,
        airDate: episode.airDate,
        colors: episode.colors.map(epColor => epColor.color.name),
        subjects: episode.subjects.map(epSubjects => epSubjects.subject.name),
    }));
}
function buildQuery(filters) {
    if (!filters.months && !filters.colors && !filters.subjects) {
        return {};
    }
    const conditions = [];
    if (filters.months?.length) {
        conditions.push({
            airDate: {
                in: filters.months.map(month => {
                    const date = new Date();
                    date.setMonth(month - 1);
                    return date;
                })
            }
        });
    }
    if (filters.colors?.length) {
        conditions.push({
            colors: {
                every: {
                    color: {
                        name: { in: filters.colors }
                    }
                }
            }
        });
    }
    if (filters.subjects?.length) {
        conditions.push({
            subjects: {
                every: {
                    subject: {
                        name: { in: filters.subjects }
                    }
                }
            }
        });
    }
    return conditions.length > 0 ? { AND: conditions } : {};
}
function normalizeParam(param) {
    // ensures parameters are consistent (all in an array)
    if (!param) {
        return undefined;
    }
    return Array.isArray(param) ? param : [String(param)];
}
app.listen(PORT || 5000, () => {
    console.log(`API running on port ${PORT}`);
});
process.on('SIGINT', async () => {
    await prisma.$disconnect();
    process.exit(1);
});
//# sourceMappingURL=api.js.map