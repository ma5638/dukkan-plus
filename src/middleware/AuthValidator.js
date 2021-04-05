const JwtHelper = require('../helpers/JwtHelper');

class AuthValidator {
  static validateToken(req, res, next) {
    try {
      // const token = req.headers['user-key'];
      const token = req.session.token || null;

      // Token means that the customer is logged in
      if (!token) {
        // return res.status(401).send({
        //   code: 'AUT_O1',
        //   message: 'USER-KEY is required',
        //   field: 'USER-KEY'
        // });
        return res.redirect('/signin');
      }

      const authToken = token.split('Bearer ')[1];
      const decodedData = JwtHelper.decodeToken(authToken);
      req.decoded = decodedData;

      return next();
    } catch (error) {
      // return res.status(400).send({
      //   code: 'AUT_02',
      //   message: 'The USER-KEY is invalid',
      //   field: 'USER-KEY'
      // });
      return res.redirect('/signin');
    }
  }

  // returns decoded data if token exists. Otherwise null
  static validateTokenNormal(req){
    try {
      const token = req.session.token || null;

      if (!token) {
        return null;
      }

      const authToken = token.split('Bearer ')[1];
      const decodedData = JwtHelper.decodeToken(authToken);

      return decodedData;
    } catch (error) {
      return null;
    }
  }
}

module.exports = AuthValidator;
