import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
export default async function extractDates() {
    // path.resolve code doesn't work with ES6 module setup
    // these variables allow __dirname to still resolve correctly
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    const filePath = path.resolve(__dirname, '../sources/The Joy Of Painting - Episode Dates');
    return fs.readFile(filePath, 'utf-8');
}
//# sourceMappingURL=extract-dates.js.map