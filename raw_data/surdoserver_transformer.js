const _ = require('lodash');
const input = require('./surdoserver.json');

output = [];

input.forEach(({video, word}) => {
  const variant = {
    video,
    source: "http://surdoserver.ru/",
  };

  const index = _.findIndex(output, {word});
  if (index == -1) {
    output.push({word, variants: [variant]});
  } else {
    output[index].variants.push(variant);
  }
});

console.log(JSON.stringify(output, null, 2));
