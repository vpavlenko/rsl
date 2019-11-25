const _ = require('lodash');
const input = require('./tserkov.json');

output = [];

input.forEach(({video, words}) => {
  words.forEach(({word, startTime, endTime}) => {
    const variant = {
      video: `https://www.youtube.com/watch?v=${video}`,
      start: startTime,
      end: endTime,
      source: "https://www.youtube.com/playlist?list=PLzQrZe3EemP7-hrTR9OEtFWOMkz9HTGoR",
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
