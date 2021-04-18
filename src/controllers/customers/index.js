const express = require('express');
const CustomerController = require('./CustomerController');
const InputValidator = require('../../helpers/InputValidator');
const ErrorValidator = require('../../middleware/ErrorValidator');
const AuthValidator = require('../../middleware/AuthValidator');
const HelperUtility = require('../../middleware/HelperUtility');
//Temp:
const JwtHelper = require('../../helpers/JwtHelper');

const customerRouter = express.Router();

// customerRouter.get('/account',(req,res)=>{
//   const token = req.session.token;
//   console.log("Token:",token);
//   if(token){
//     const authToken = token.split('Bearer ')[1];
//     const decodedData = JwtHelper.decodeToken(authToken);
//     return res.send(decodedData);
//   }
//   return res.send(token);
//   }
// );
// customerRouter.get('/validate',
//   AuthValidator.validateToken,
//   (req,res)=>{
//     // console.log(req.session);
//     const token = req.session.token;
//     console.log("Token:",token);
//     if(token){
//       const authToken = token.split('Bearer ')[1];
//       const decodedData = JwtHelper.decodeToken(authToken);
//       return res.send(decodedData);
//     }
//     return res.send(token);
//     }
// );

customerRouter.get(
  '/signup', (req, res) => {
    return res.render('signup');
  }
);

customerRouter.get(
  '/signin', (req, res) => {
    return res.render('signin');
  }
);


// COMMENT THIS OUT LATER
// LAZY SIGN IN
customerRouter.get(
  '/devsignin', (req, res, next) => {
    req.body.email = "test@hotmail.com";
    req.body.password = "password123";
    return CustomerController.login(req,res,next);
  }
);

// customerRouter.get(
//   '/dashboard', (req,res,next)=>{
//     if(!req.auth) return next();
//     return res.render('dashboard',{
//         data: req.auth,
//       });
//   }
// );
customerRouter.get(
  '/dashboard',
  AuthValidator.validateToken,
  (req, res) => {
    // if(!req.auth) return next();
    return res.render('dashboard', {
      data: req.decoded,
    });
  }
);

customerRouter.get(
  '/dashboard/profile',
  AuthValidator.validateToken,
  (req, res) => {
    return res.render('dash-my-profile', {
      data: req.decoded,
    });
  }
);

customerRouter.get(
  '/dashboard/editprofile',
  AuthValidator.validateToken,
  (req, res) => {
    return res.render('dash-edit-profile', {
      data: req.decoded,
    });
  }
);

customerRouter.post(
  '/dashboard/updateprofile',
  AuthValidator.validateToken,
  // If fields were left blank, give original values
  (req, res, next) => {
    // console.log(req.body);
    req.body.name = req.body.name == "" ? req.decoded.name : req.body.name;
    req.body.email = req.body.email == "" ? req.decoded.email : req.body.email;
    req.body.mob_phone = req.body.mob_phone == "" ? null : req.body.mob_phone;
    req.body.mob_phone = req.body.mob_phone == null && req.decoded.mob_phone != null ? req.decoded.mob_phone : req.body.mob_phone;
    return next();
  },
  InputValidator.customerDetailsValidator(),
  ErrorValidator.check,
  // (req,res,next)=>{
  //   console.log(req.body);
  //   return next();
  // },
  CustomerController.updateCustomer
);

customerRouter.get(
  '/dashboard/orders',
  AuthValidator.validateToken,
  async (req, res,next) => {
    const {count, rows} = await CustomerController.getOrders(req,res,next);
    return res.render('dash-my-order', {
      data: req.auth,
      orders: rows,
    });
  }
);




// Pre-built POST and PUT routes
// customerRouter.put(
//   '/customer',
//   AuthValidator.validateToken,
//   InputValidator.customerDetailsValidator(),
//   ErrorValidator.check,
//   CustomerController.updateCustomer
// );

customerRouter.post(
  // '/customers',
  '/signup',
  // (req,res)=>{
  //   console.log("Params ====================");
  //   const j = InputValidator.signUpValidator();
  //   console.log(j);
  // }
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
