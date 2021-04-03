const express = require('express');
const CustomerController = require('./CustomerController');
const InputValidator = require('../../helpers/InputValidator');
const ErrorValidator = require('../../middleware/ErrorValidator');
const AuthValidator = require('../../middleware/AuthValidator');
const HelperUtility = require('../../middleware/HelperUtility');

const customerRouter = express.Router();

// customerRouter.get('/account',(req,res)=>{
//   const token = req.headers['user-key'];
//   console.log("Token:",token);
//   if(token){
//     const decodedData = JwtHelper.decodeToken(authToken);
//     return res.send(decodedData);
//   }
//   return res.send(token);
// });

// Pre-built POST and PUT routes
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


// Figure out how to check for login anywhere else
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
