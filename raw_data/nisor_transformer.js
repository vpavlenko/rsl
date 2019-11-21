const _ = require('lodash');
const input = require('./nisor.json');

output = [];

input.forEach(({video, word}) => {
  const variant = {
    video,
    source: "http://www.nisor.ru/snews/oa-/iooa-uoo-ooo-a",
  };

  if (word.endsWith(' 2')) {
    word = word.slice(0, -2);
  }

  const index = _.findIndex(output, {word});
  if (index == -1) {
    output.push({word, variants: [variant]});
  } else {
    output[index].variants.push(variant);
  }
});

console.log(JSON.stringify(output, null, 2));
