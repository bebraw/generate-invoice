#!/usr/bin/env node
const path = require('path');
const render = require('./lib').render;

if(require.main === module) {
  main();
}
else {
  module.exports = generate;
}

function main(invoice) {
  const program = require('commander');
  const pkg = require('./package.json');
  const cwd = process.cwd();

  program.version(pkg.version).
    description(pkg.description).
    option('-l, --language [language]', 'Language, defaults to `en`').
    option('-s, --sender [sender]', 'Sender definition').
    option('-r, --recipient [recipient]', 'Recipient definition').
    option('-i, --invoice [invoice]', 'Invoice definition').
    option('-f, --filename [filename]', 'Output filename, defaults to tmp.pdf').
    option('-F, --format [format]', 'Output format, defaults to A4').
    parse(process.argv);

  if(program.sender) {
    program.sender = require(
      path.join(cwd, program.sender)
    );
  }
  else {
    return console.error('Missing sender');
  }

  if(program.recipient) {
    program.recipient = require(
      path.join(cwd, program.recipient)
    );
  }
  else {
    return console.error('Missing recipient');
  }

  if(program.invoice) {
    program.invoice = require(
      path.join(cwd, program.invoice)
    );
  }
  else {
    return console.error('Missing invoice');
  }

  generate(program);
}

function generate(options) {
  render({
    language: options.language,
    ctx: {
      sender: options.sender,
      recipient: options.recipient,
      invoice: options.invoice
    },
    filename: options.filename,
    format: options.format
  }, function(err, d) {
    if(err) {
      return console.error(err);
    }

    console.log('Generated ' + d.filename);
  });
}
