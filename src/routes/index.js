const products = require('../controllers/products');
const customers = require('../controllers/customers');
const shoppingCart = require('../controllers/shoppingCart');
const orders = require('../controllers/orders');
const categories = require('../controllers/categories');
const path = require('path');

const JwtHelper = require('../helpers/JwtHelper');

const routes = (app) => {


  // app.get('route', function(request,response))

  // Verify if user is logged in
  app.use((req,res,next)=>{
    try{
      if(!req.session.token) {
        req.auth = null;
        return next();
      }

      const authToken = req.session.token.split('Bearer ')[1];
      const data = JwtHelper.decodeToken(authToken);
      // Globally assign the data inside request
      req.auth = data;
      
    } catch(error){
      console.error(error);
      req.session.token = null;     // ------------ Should I do this?
    }

    return next();
  });


  // Home Page
  app.get('/',(req,res)=>{
    pageTitle = "Home Page | Dukkan";
    return res.render('layout',{
      template: 'index',
      data: req.auth,
      pageTitle
    });
  });



      // const token = req.headers['user-key'];
    // console.log("Token:",token);
    // return res.send(token);

  app.use(products);
  app.use(customers);
  app.use(shoppingCart);
  app.use(orders);
  // app.use(stripe);
  app.use(categories);

  return app;
};

module.exports = routes;
