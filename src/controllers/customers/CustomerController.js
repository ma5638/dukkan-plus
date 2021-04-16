const CustomerService = require('../../services/CustomerService');
const JwtHelper = require('../../helpers/JwtHelper');

class CustomerController {
  static async signUp(req, res, next) {
    try {
      const { body } = req;
      const [user, created] = await CustomerService.findOrCreateUser(body);

      if (!created) {
        // return res.status(409).send({
        //   error: {
        //     code: 'USR_04',
        //     message: 'User already exists with this email address'
        //   }
        // });
        return next();
      }

      const customer = user.toJSONData();
      const expiresIn = '1h';
      const accessToken = JwtHelper.generateToken({ data: customer, expiresIn });



      // return res.status(201).send({
      //   customer: user.toJSONData(),
      //   accessToken,
      //   expires_in: expiresIn
      // });
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

      if (!isPasswordMatch) {
        // return res.status(409).send({
        //   error: {
        //     message: 'Invalid credentials'
        //   }
        // });
        return next();
      }

      const customer = user.toJSONData();
      const expiresIn = '1h';
      req.session.token = null;

      console.log(user);
      
      const accessToken = JwtHelper.generateToken({ data: customer, expiresIn });
      console.log("Logging In...");
      // const authToken = accessToken.split('Bearer ')[1];
      // const decoded = JwtHelper.decodeToken(authToken);

      // console.log(decoded);

      req.session.token = accessToken;

      // return res.status(200).send({
      //   customer,
      //   accessToken,
      //   expires_in: expiresIn
      // });
      return res.redirect('/dashboard');
    } catch (error) {
      // return next(error);
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
}

module.exports = CustomerController;
