const express = require('express');
const CustomerController = require('./CustomerController');
const InputValidator = require('../../helpers/InputValidator');
const ErrorValidator = require('../../middleware/ErrorValidator');
const AuthValidator = require('../../middleware/AuthValidator');
const HelperUtility = require('../../middleware/HelperUtility');

const customerRouter = express.Router();

customerRouter.put(
  '/customer',
  AuthValidator.validateToken,
  InputValidator.customerDetailsValidator(),
  ErrorValidator.check,
  CustomerController.updateCustomer
);

customerRouter.post(
  '/customers',
  InputValidator.signUpValidator(),
  ErrorValidator.check,
  CustomerController.signUp
);

customerRouter.post(
  '/customers/login',
  InputValidator.loginValidator(),
  ErrorValidator.check,
  CustomerController.login
);

customerRouter.put(
  '/customers/creditCard',
  AuthValidator.validateToken,
  InputValidator.creditCardValidator(),
  ErrorValidator.check,
  HelperUtility.filterRequestBody,
  CustomerController.updateCustomer
);

customerRouter.put(
  '/customers/address',
  AuthValidator.validateToken,
  InputValidator.addressValidator(),
  ErrorValidator.check,
  HelperUtility.filterRequestBody,
  CustomerController.updateCustomer
);

module.exports = customerRouter;
