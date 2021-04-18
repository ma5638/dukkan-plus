const express = require('express');
const OrderController = require('./OrderController');
const AuthValidator = require('../../middleware/AuthValidator');
const InputValidator = require('../../helpers/InputValidator');
const StripHelpers = require('../../helpers/StripeHelper');
const ErrorValidator = require('../../middleware/ErrorValidator');
const StripController =require('../stripe/StripeController');

const orderRouter = express.Router();

orderRouter.post(
  '/orders',
  AuthValidator.validateToken,
  ErrorValidator.check,
  InputValidator.checkoutValidator(),
  ErrorValidator.check,
  OrderController.create,
  StripHelpers.createToken,
  InputValidator.stripeValidator(),
  ErrorValidator.check,
  StripController.handlePayment,
);

orderRouter.get(
  '/orders/:order_id',
  AuthValidator.validateToken,
  InputValidator.integerValidator('order_id'),
  ErrorValidator.check,
  OrderController.getOrderDetails
);

module.exports = orderRouter;
