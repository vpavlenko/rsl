const _ = require('lodash');
const input = require('./digitgestus.json');
const youtube = require('./digitgestus_youtube.json');

output = [];

// 1. В списке youtube заменить все слова на номера. У вариантов заменять последовательно.
// 2. Пройтись по input и преобразовать все пары в output.

const wordToNumbers = {};

input.forEach(([word, variants]) => {
  if (typeof variants === "string") {
    wordToNumbers[word] = [variants];
  } else {
    wordToNumbers[word] = variants.slice();
  }
});

// console.log(JSON.stringify(wordToNumbers));

const numberToVideo = {};

for (const value of youtube) {
  if (!new RegExp("[0-9]{4}").test(value.word)) {
    if (wordToNumbers[value.word] === undefined || wordToNumbers.length === 0) {
      throw value.word;
    }
    numberToVideo[wordToNumbers[value.word].pop()] = value.video;
  } else {
    numberToVideo[value.word] = value.video;
  }
}

// console.log(JSON.stringify(numberToVideo));

input.forEach(([word, variants]) => {
  output.push({
    word,
    "variants": (typeof variants === "string" ? [variants] : variants).map(number => {
      if (!numberToVideo[number]) {
        throw number;
      }
      return {
        "video": numberToVideo[number],
        "source": "http://www.digitgestus.com/"
      };
    })
  });
});

// console.log(JSON.stringify(output, null, 2));
