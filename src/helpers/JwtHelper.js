const jwt = require('jsonwebtoken');

const secret = process.env.SECRET;

class JwtHelper {
  static generateToken({ data, expiresIn }) {
    const token = jwt.sign(data, secret, { expiresIn });
    return `Bearer ${token}`;
  }

  static decodeToken(token) {
    return jwt.verify(token, secret);
  }
}

module.exports = JwtHelper;
