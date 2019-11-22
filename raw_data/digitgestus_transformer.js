const _ = require('lodash');
const input = require('./digitgestus.json');
const youtube = require('./digitgestus_youtube.json');

output = [];

input.forEach(([word, variants]) => {


  const variant = {
    video,
    source
  };

  const index = _.findIndex(output, {word});
  if (index == -1) {
    output.push({word, variants: [variant]});
  } else {
    output[index].variants.push(variant);
  }
});

console.log(JSON.stringify(output, null, 2));
