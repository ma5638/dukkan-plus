const express = require('express');
const ShoppingCartController = require('./ShoppingCartController');
const InputValidator = require('../../helpers/InputValidator');
const ErrorValidator = require('../../middleware/ErrorValidator');

const shoppingCartRouter = express.Router();

shoppingCartRouter.post(
  '/shoppingCart/add',
  InputValidator.cartValidator(),
  ErrorValidator.check,
  ShoppingCartController.addProductToCart
);

shoppingCartRouter.get('/shoppingCart', ShoppingCartController.getShoppingCart);

shoppingCartRouter.delete('/shoppingCart/empty', ShoppingCartController.emptyShoppingCart);

module.exports = shoppingCartRouter;
