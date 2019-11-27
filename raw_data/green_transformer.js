const _ = require('lodash');
const input = require('./green.json');

output = [];

input.forEach(({video, words}) => {
  words.forEach(({word, startTime, endTime}) => {
    word = word.toLowerCase();

    const variant = {
      video: `https://www.youtube.com/watch?v=${video}`,
      start: startTime,
      end: endTime,
      source: "https://signlang.ru/studyrsl/topics/",
    };

    const index = _.findIndex(output, {word});
    if (index == -1) {
      output.push({word, variants: [variant]});
    } else {
      output[index].variants.push(variant);
    }
  });
});

console.log(JSON.stringify(output, null, 2));
