module.exports = {
  vat: 0.24,
  date: 'March 28, 2016',
  due: [8, 'days'], // -> moment.add(8, 'days')
  reference: [1, 1], // company id, member id
  paymentTerm: 'NET 8 DAYS',
  warningTerm: '5 DAYS',
  interest: '10.5',
  products: [
    {
      name: 'Awesome consulting ($100 per hour, 100 hours)',
      price: 100 * 100
    },
  ]
};
