const products = require('../controllers/products');
const customers = require('../controllers/customers');
const attributes = require('../controllers/attributes');
const shoppingCart = require('../controllers/shoppingCart');
const orders = require('../controllers/orders');
const stripe = require('../controllers/stripe');

const routes = (app) => {
  app.use(products);
  app.use(customers);
  app.use(attributes);
  app.use(shoppingCart);
  app.use(orders);
  app.use(stripe);

  return app;
};

module.exports = routes;
