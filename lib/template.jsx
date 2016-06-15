'use strict';
const React = require('react');
const moment = require('moment');
const makeReference = require('./makeReference');

module.exports = function(ctx) {
  const sender = ctx.sender || {};
  const recipient = ctx.recipient || {};
  const invoice = ctx.invoice || {};
  invoice.products = invoice.products || [];

  const i18n = ctx.i18n;

  const vat = invoice.vat;
  const currency = invoice.currency || function(v) {
    return '$' + v;
  };

  // products
  invoice.products = invoice.products.map(function(product) {
    product.tax = product.price * (1 + vat) - product.price;

    return product;
  });

  // dates
  const dateFormat = invoice.dateFormat || 'DD.MM.YYYY';
  const startDate = moment(new Date(invoice.date));
  invoice.date = startDate.format(dateFormat);
  invoice.due = startDate.clone().add.apply(startDate, invoice.due).format(dateFormat);

  // reference
  invoice.reference = makeReference.apply(null, invoice.reference);

  // summaries
  const summaries = {
    price: invoice.products.reduce(function(a, b) {
      return a + b.price;
    }, 0),
    tax: invoice.products.reduce(function(a, b) {
      return a + b.tax;
    }, 0),
    total: invoice.products.reduce(function(a, b) {
      return a + b.price + b.tax;
    }, 0)
  };

  const invoiceType = invoice.type || 'invoice';

  return (
    <html>
      <head>
        <base href={'file://' + __dirname + '/'} />
        <link rel="stylesheet" type="text/css" href="./style.css" />
      </head>
      <body>
        <div className="preview">
          <header>
            <h1 className="company">{sender.company}</h1>
            <div className="sender">
              <div className="name">{sender.name}</div>
              <div className="company">{sender.company}</div>
              <div className="address">{sender.address}</div>
              <div className="city">{sender.postalCode} {sender.city}</div>
              <div className="country">{sender.country}</div>
              {invoiceType === 'invoice' && <div className="phone">{i18n.phone}: {sender.phone}</div>}
              {invoiceType === 'invoice' && <div className="iban">IBAN: {sender.iban}</div>}
              {(invoiceType === 'invoice' && sender.bic) && <div className="bic">BIC/SWIFT: {sender.bic}</div> }
              <div className="companyId">{i18n.companyId}: {sender.companyId}</div>
            </div>
            <div className="extra">
              <div className="invoice">{i18n[invoiceType]}</div>
              <div className="date">
                <span className="label">{i18n.date}:</span>
                <span>{invoice.date}</span>
              </div>
              <div className="reference">
                <span className="label">{invoiceType === 'invoice' ?
                  i18n.invoiceReference : i18n.creditNoteReference}:</span>
                <span>{invoice.reference}</span>
              </div>
              {invoice.warningTerm && <div className="paymentTerm">
                <span className="label">{i18n.paymentTerm}:</span>
                <span>{invoice.paymentTerm}</span>
              </div>}
              {invoiceType === 'invoice' && invoice.due && <div className="due">
                <span className="label">{i18n.due}:</span>
                <span>{invoice.due}</span>
              </div>}
              <div className="blank">&nbsp;</div>
              {invoice.warningTerm && <div className="warningTerm">
                <span className="label">{i18n.warningTerm}:</span>
                <span>{invoice.warningTerm}</span>
              </div>}
              {invoice.interest && <div className="interest">
                <span className="label">{i18n.interest}:</span>
                <span>{invoice.interest}%</span>
              </div>}
            </div>
          </header>
          <article>
            <div className="info">
              <div className="recipient">
                <div className="name">{recipient.name}</div>
                <div className="company">{recipient.company}</div>
                <div className="address">{recipient.address}</div>
                <div className="city">{recipient.postalCode} {recipient.city}</div>
                <div className="country">{recipient.country}</div>
                <div className="phone">{recipient.phone}</div>
                <div className="companyId">{recipient.companyId}</div>
              </div>
            </div>
            <table className="products">
              <thead>
                <tr>
                  <th>{i18n.description}</th>
                  <th>{i18n.amount}</th>
                </tr>
              </thead>
              <tbody>
              {invoice.products.map(function(product, i) {
                return <tr key={'product' + i}>
                  <td>{product.name}</td>
                  <td>{toFixed(product.price)}</td>
                </tr>;
              })}
              </tbody>
              <tfoot>
                <tr>
                  <td>{invoiceType === 'invoice' ? i18n.brutto : i18n.subtotal}</td>
                  <td>{currency(summaries.price.toFixed(2))}</td>
                </tr>
                {invoiceType === 'invoice' && <tr>
                  <td>{i18n.vat}</td>
                  <td>{(vat * 100).toFixed(0) + '%'}</td>
                </tr>}
                {invoiceType === 'invoice' && <tr>
                  <td>{i18n.tax}</td>
                  <td>{currency(summaries.tax.toFixed(2))}</td>
                </tr>}
                {invoiceType === 'invoice' && <tr>
                  <td>{i18n.other}</td>
                  <td>{currency(0)}</td>
                </tr>}
                <tr>
                  <td>{i18n.total}</td>
                  <td>{currency(summaries.total.toFixed(2))}</td>
                </tr>
              </tfoot>
            </table>
          </article>
          <footer>
            <div className="companyDetails"></div>
          </footer>
        </div>
      </body>
    </html>
  );
};

function toFixed(a) {
  if(a) {
    return a.toFixed(2);
  }
}
