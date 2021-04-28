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
    return res.render("layout",{
      template: "signup",
      data: req.auth,
    });
  }
);

customerRouter.get(
  '/signin', (req, res) => {
    return res.render("layout",{
      template: "signin",
      data: req.auth,
    });
  }
);

customerRouter.get(
  '/signout', async (req, res) => {
    try{
      req.session.token = null;
      req.session.save(err=>{
        if(err) throw err;
        return res.redirect('signin');
      });
    } catch(error){
      return next(error);
    }

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
    return res.render("layout",{
      template: "dashboard",
      data: req.decoded,
    });
  }
);

customerRouter.get(
  '/dashboard/profile',
  AuthValidator.validateToken,
  (req, res) => {
    return res.render("layout",{
      template: 'dash-my-profile',
      data: req.decoded,
    });
  }
);

customerRouter.get(
  '/dashboard/editprofile',
  AuthValidator.validateToken,
  (req, res) => {
    return res.render("layout",{
      template: 'dash-edit-profile',
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
  '/dashboard/address',
  AuthValidator.validateToken,
  async (req, res,next) => {
    const addresses = await CustomerController.getAddresses(req,res);
    return res.render("layout",{
      template: 'dash-address-book',
      data: req.decoded,
      addresses
    });
  }
);

customerRouter.get(
  '/dashboard/address/add',
  AuthValidator.validateToken,
  async (req, res,next) => {
    return res.render("layout",{
      template: 'dash-address-add',
      data: req.auth
    });
  }
);

customerRouter.post(
  '/dashboard/address/add',
  AuthValidator.validateToken,
  InputValidator.addressValidator(),
  ErrorValidator.check,
  CustomerController.createAddress,
);



// customerRouter.put(
//   '/customers/address',
//   AuthValidator.validateToken,
//   InputValidator.addressValidator(),
//   ErrorValidator.check,
//   HelperUtility.filterRequestBody,
//   CustomerController.updateCustomer
// );

customerRouter.get(
  '/dashboard/address/:addressid/edit',
  AuthValidator.validateToken,
  CustomerController.getOneAddress,  
);

customerRouter.post(
  '/dashboard/address/:addressid/edit',
  AuthValidator.validateToken,
  InputValidator.addressValidator(),
  ErrorValidator.check,
  CustomerController.updateAddress,
);

customerRouter.post(
  '/dashboard/address/remove',
  AuthValidator.validateToken,
  InputValidator.addressIdValidator(),
  ErrorValidator.check,
  CustomerController.removeAddress,
);

customerRouter.get(
  '/dashboard/orders',
  AuthValidator.validateToken,
  async (req, res,next) => {
    try{
      const {count, rows} = await CustomerController.getOrders(req,res,next);
    // console.log(rows[0].order_details[0].product.Category[0].name);
    return res.render("layout",{
      template: 'dash-my-order',
      data: req.auth,
      orders: rows,
    });
    } catch(error){
      return next(error);
    }
    
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



module.exports = customerRouter;
