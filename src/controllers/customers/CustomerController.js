const CustomerService = require('../../services/CustomerService');
const JwtHelper = require('../../helpers/JwtHelper');
const OrderService = require('../../services/OrderService');

class CustomerController {
  static async signUp(req, res, next) {
    try {
      const { body } = req;
      const [user, created] = await CustomerService.findOrCreateUser(body);

      if (!created) return next();

      const customer = user.toJSONData();
      const expiresIn = '1h';
      // const accessToken = JwtHelper.generateToken({ data: customer, expiresIn });

      return res.redirect('/signin');
    } catch (error) {
      return next(error);
    }
  }

  static async login(req, res, next) {
    try {
      const { body } = req;
      const user = await CustomerService.findUser(body);
      const isPasswordMatch = user ? user.checkPassword(body.password, user.toJSON().password) : user;

      if (!isPasswordMatch) return next();

      const customer = user.toJSONData();
      const expiresIn = '1h';
      req.session.token = null;
      const accessToken = JwtHelper.generateToken({ data: customer, expiresIn });
      req.session.token = accessToken;

      return res.redirect('/dashboard');
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

      // return res.status(200).send(user);
      // return res.redirect('/dashboard/editprofile');
      return res.redirect('/dashboard');
    } catch (error) {
      return next(error);
    }
  }
  static async getOrders(req, res, next) {
    try {
      const { decoded } = req;
      return OrderService.fetchOrders({ customer_id: decoded.customer_id });
    } catch (error) {
      return [];
    }

  }
}

module.exports = CustomerController;
