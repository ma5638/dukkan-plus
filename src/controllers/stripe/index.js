const express = require('express');
const StripController =require('./StripeController');
const AuthValidator = require('../../middleware/AuthValidator');
const InputValidator = require('../../helpers/InputValidator');
const ErrorValidator = require('../../middleware/ErrorValidator');

const stripeRouter = express.Router();

stripeRouter.post(
  '/stripe/charge',
  AuthValidator.validateToken,
  InputValidator.stripeValidator,
  ErrorValidator.check,
  StripController.handlePayment
);

module.exports = stripeRouter;
