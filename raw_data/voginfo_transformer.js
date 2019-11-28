const _ = require("lodash");
const input = require("./voginfo.json");

output = input.map(({ word, cities }) => ({
  word: word.toLowerCase(),
  variants: cities.map(({ video }) => ({
    video: `http://voginfo.ru/lexicon/assets/video/webm/${video}`,
    source: "http://voginfo.ru/lexicon/"
  })),
}));

console.log(JSON.stringify(output, null, 2));
