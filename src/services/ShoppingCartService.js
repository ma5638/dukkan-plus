const models = require('../database/models');
const HttpError = require('../helpers/ErrorHandler');

const { shopping_cart, product } = models;

class ShoppingCartService {
  // removed "attributes"
  static async addProductToCart({ cartId, product_id, quantity, added_on }) {
    const [cart] = await shopping_cart.findOrCreate({
      where: {
        cart_id: cartId,
        product_id
      },
      defaults: {
        // attributes,
        quantity,
        added_on
      }
    });

    return cart;
  }

  static async fetchShoppingCart(cartId) {
    const cart = await shopping_cart.findAll({
      where: {
        cart_id: cartId
      },
      include: [{
        model: product
      }]
    });
    // HttpError.throwErrorIfNullOrEmpty(cart, 'Your cart is currently empty', 200);
    return cart;
  }

  static async emptyShoppingCartByCartId(cart_id) {
    const cart = await shopping_cart.destroy({
      where: {
        cart_id
      },
      force: true
    });

    return cart;
  }
  static async removeItemFromShoppingCart(item_id,cart_id) {
    const cart = await shopping_cart.destroy({
      where: {
        item_id,
        cart_id
      }
    });

    return cart;
  }
}

module.exports = ShoppingCartService;
