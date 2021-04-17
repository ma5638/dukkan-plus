const express = require('express');
const StripController =require('./StripeController');
const StripHelpers = require('../../helpers/StripeHelper');
const AuthValidator = require('../../middleware/AuthValidator');
const InputValidator = require('../../helpers/InputValidator');
const ErrorValidator = require('../../middleware/ErrorValidator');

const stripeRouter = express.Router();

// stripeRouter.get(
//   '/stripe/charge',
//   AuthValidator.validateToken,
//   StripHelpers.createToken,
//   // (req,res,next)=>{
//   //   console.log(req.body.order_id);

//   //   return next();
//   // },
//   InputValidator.stripeValidator(),
//   ErrorValidator.check,
//   StripController.handlePayment
// );

module.exports = stripeRouter;
