'use strict';
require('node-jsx').install();

const pdf = require('html-pdf');
const ReactDom = require('react-dom/server');
const template = require('./template.jsx');

module.exports = function(o, cb) {
  o.ctx = o.ctx || {};
  o.ctx.i18n = require('./languages/' + (o.ctx.language || 'en'));
  o.filename = o.filename || 'tmp.pdf';
  o.format = o.format || 'A4';

  pdf.create(
    ReactDom.renderToStaticMarkup(template(o.ctx)),
    o
  ).toFile(cb);
};
