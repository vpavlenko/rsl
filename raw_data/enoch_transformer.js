const _ = require('lodash');
const input = require('./enoch.json');

output = [];

input.forEach(({video, words}) => {
  words.forEach(({word, startTime, endTime}) => {
    const variant = {
      video: `https://www.youtube.com/watch?v=${video}`,
      start: startTime,
      end: endTime,
      source: "https://www.youtube.com/playlist?list=PL_VzOPUOoGKQQ7hyco7uz5apagoF99raf",
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
