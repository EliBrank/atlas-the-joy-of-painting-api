import { compareTwoStrings } from 'string-similarity';
import { normalizeTitle } from '../utils/normalize-title.js';
const cases = [
    [
        '"""BLACK & WHITE SEASCAPE"""',
        '"""BACK COUNTRY"""',
        '"""THE FOOTBRIDGE"""',
        '"""HIDE-A-WAY COVE"""'
    ],
    [
        'Black and White Seascape',
        'Back-Country Path',
        'The Footbridge',
        'Hide A Way Cove'
    ],
    [
        '"Black & White Seascape"',
        '"Back-Country Path"',
        '"Footbridge"',
        '"Hide-a-Way Cove"'
    ]
];
for (let i = 0; i < 3; i++) {
    for (let j = i; j < 3; j++) {
        for (let k = 0; k < 4; k++) {
            const similarity = compareTwoStrings(normalizeTitle(cases[i][k]), normalizeTitle(cases[j][k]));
            console.log(`The similarity between case ${i + 1} and case ${j + 1}, on line ${k + 1} is ${similarity}`);
        }
        console.log('');
    }
}
//# sourceMappingURL=test.js.map