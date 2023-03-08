const input = require("./voginfo.json");

output = input.map(({ word, cities }) => ({
  word: word.toLowerCase(),
  variants: cities.map(({ video }) => ({
    video: `https://voginfo.ru/lexicon/assets/video/webm/${video}`,
    source: "https://voginfo.ru/lexicon/",
  })),
}));

console.log(JSON.stringify(output, null, 2));
