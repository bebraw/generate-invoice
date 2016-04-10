const generate = require('./');

generate({
  sender: require('./examples/sender'),
  recipient: require('./examples/recipient'),
  invoice: require('./examples/invoice')
});
