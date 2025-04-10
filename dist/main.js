import { PrismaClient } from "@prisma/client";
import { loadEpisodes } from "./loaders/load-episodes.js";
const prisma = new PrismaClient;
async function main() {
    try {
        await loadEpisodes();
        console.log('Episodes loaded successfully!');
    }
    catch (error) {
        console.error(`Failed to load episodes: ${error}`);
        process.exit(1);
    }
    finally {
        await prisma.$disconnect();
    }
}
//# sourceMappingURL=main.js.map