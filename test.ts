import { compareTwoStrings } from 'string-similarity';

const cases = [
  [
    "black & white seascape",
    "back-country path",
    "footbridge",
    "hide-a-way cove"
  ],
  [
    "black and white seascape",
    "back country path",
    "the footbridge",
    "hide-a-way cove"
  ],
  [
    "black and white seascape",
    "back country",
    "the footbridge",
    "hide a way cove"
  ]
];

for (let i = 0; i < 3; i++) {
  for (let j = i; j < 3; j++) {
    for (let k = 0; k < 4; k++) {
      const similarity = compareTwoStrings(cases[i][k], cases[j][k]);
      console.log(
        `The similarity between case ${i + 1}, line ${k + 1} and case ${j + 1}, line ${k} is ${similarity}`
      );
    }
    console.log('');
  }
}
