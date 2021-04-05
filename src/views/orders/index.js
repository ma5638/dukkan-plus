const express = require('express');
const OrderController = require('./OrderController');
const AuthValidator = require('../../middleware/AuthValidator');
const InputValidator = require('../../helpers/InputValidator');
const ErrorValidator = require('../../middleware/ErrorValidator');

const orderRouter = express.Router();

orderRouter.post(
  '/orders',
  AuthValidator.validateToken,
  InputValidator.integerValidator('shipping_id'),
  InputValidator.integerValidator('tax_id'),
  ErrorValidator.check,
  OrderController.create
);

orderRouter.get(
  '/orders/:order_id',
  AuthValidator.validateToken,
  InputValidator.integerValidator('order_id'),
  ErrorValidator.check,
  OrderController.getOrderDetails
);

module.exports = orderRouter;
