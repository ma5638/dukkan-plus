const CustomerService = require('../../services/CustomerService');
const AddressService = require('../../services/AddressService');
const JwtHelper = require('../../helpers/JwtHelper');
const OrderService = require('../../services/OrderService');
const { body } = require('express-validator/check');

class CustomerController {
  static async signUp(req, res, next) {
    try {
      const { body } = req;
      console.log(body);
      const [user, created] = await CustomerService.findOrCreateUser(body);

      console.log("help");

      if (!created) return next();

      const customer = user.toJSONData();
      const expiresIn = '1h';
      const accessToken = JwtHelper.generateToken({ data: customer, expiresIn });

      return res.redirect('/signin');
    } catch (error) {
      return next(error);
    }
  }

  static async login(req, res, next) {
    try {
      const { body } = req;
      const user = await CustomerService.findUser(body);
      const isPasswordMatch = user ? await user.checkPassword(body.password, user.toJSON().password) : user;

      if (!isPasswordMatch) return next();

      const customer = user.toJSONData();
      const expiresIn = '1h';
      // req.session.token = null;
      const accessToken = JwtHelper.generateToken({ data: customer, expiresIn });
      req.session.token = accessToken;
      // req.token = accessToken;
      req.session.save( err => {
        if(err) throw err;
        return res.redirect('/dashboard');
      });

      // return res.redirect('/dashboard');
    } catch (error) {
      next();
    }
  }


  static async updateCustomer(req, res, next) {
    try {
      const { body, decoded } = req;
      const currEmail = decoded.email || body.email;
      // const user = await CustomerService.updateUser({ ...body, email });
      const user = await CustomerService.updateUser({ body, currEmail });
      const expiresIn = '1h';
      const accessToken = JwtHelper.generateToken({ data: user, expiresIn });
      req.session.token = accessToken;

      req.session.save(err=>{
        if(err) throw err;
        return res.redirect('/dashboard');
      });

      // return res.status(200).send(user);
      // return res.redirect('/dashboard/editprofile');
      
    } catch (error) {
      return next(error);
    }
  }
  static async getOrders(req, res, next) {
    try {
      const { decoded } = req;
      return await OrderService.fetchOrders({ customer_id: decoded.customer_id });;
    } catch (error) {
      console.error(error);
      return [];
    }

  }
  static async getAddresses(req,res){
    try {
      const { decoded } = req;
      const { rows } =  await AddressService.findAllAddress({ customer_id: decoded.customer_id });
      return rows;
    } catch (error) {
      return [];
    }
  }

  static async getOneAddress(req,res,next){
    try{

      const { decoded, params } = req;


      const address = await AddressService.findAddressWithId({
        customer_id: decoded.customer_id, 
        address_id: params.addressid
      });
  
      if(!address) return res.redirect('/dashboard/address');

      return res.render("layout",{
        template: 'dash-address-edit',
        data: req.auth,
        address
      });
    } catch(error){
      return next(error);
    }
  }

  static async createAddress(req,res,next){
    try {
      const { decoded } = req;
      await AddressService.addAddress({body: req.body, customer_id: decoded.customer_id });
      return res.redirect('/dashboard/address');
    } catch (error) {
      return next(error);
    }
  }

  static async updateAddress(req,res,next){
    try {
      const { body, decoded, params } = req;

      // Validate Address belongs to Customer

      const addresses = AddressService.findAddressWithId({
        customer_id: decoded.customer_id, 
        address_id: params.addressid
      });

      if(addresses.length==0) return res.redirect('/dashboard/address');

      // Update Address

      await AddressService.updateAddress({
        body, 
        customer_id: decoded.customer_id, 
        address_id: params.addressid
       });
      return res.redirect('/dashboard/address');
    } catch (error) {
      return next(error);
    }
  }

  static async removeAddress(req,res,next){
    try {
      const { body, decoded } = req;
      await AddressService.removeAddress({ customer_id: decoded.customer_id, address_id: body.address_id });
      return res.redirect('/dashboard/address');
    } catch (error) {
      return next(error);
    }
  }

}

module.exports = CustomerController;
