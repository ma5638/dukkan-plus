const shortid = require('shortid');

class ShoppingCartUtility {
  static generateCartId(req, res, next) {
    const { session: { cartId } } = req;
    if (cartId) {
      return next();
    }

    const newCartId = shortid.generate();
    req.session.cartId = newCartId;
    next();
  }
}

module.exports = ShoppingCartUtility;
