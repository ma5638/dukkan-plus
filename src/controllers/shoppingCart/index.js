const express = require('express');
const ShoppingCartController = require('./ShoppingCartController');
const InputValidator = require('../../helpers/InputValidator');
const ErrorValidator = require('../../middleware/ErrorValidator');
const AuthValidator = require('../../middleware/AuthValidator');

const shoppingCartRouter = express.Router();

shoppingCartRouter.post(
  '/shoppingCart/add',
  (req,res,next)=>{
    console.log(req.body);
    return next();
  },
  InputValidator.cartValidator(),
  ErrorValidator.check,
  ShoppingCartController.addProductToCart
);

shoppingCartRouter.get('/shoppingCart', ShoppingCartController.getShoppingCart);

shoppingCartRouter.post('/shoppingCart/empty', ShoppingCartController.emptyShoppingCart);

shoppingCartRouter.post('/shoppingCart/remove', 
  InputValidator.cartItemValidator(),
  ErrorValidator.check,
  ShoppingCartController.removeItemFromShoppingCart);


shoppingCartRouter.get('/checkout', 
  AuthValidator.validateToken,
  ShoppingCartController.showCheckout);

module.exports = shoppingCartRouter;
