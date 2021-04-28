const models = require('../database/models');
const HttpError = require('../helpers/ErrorHandler');

const { shopping_cart, product, category } = models;

class ShoppingCartService {
  // removed "attributes"
  static async addProductToCart({ cartId, product_id, quantity, added_on }) {
    const itemExists = await ShoppingCartService.fetchShoppingCartProduct({cartId, product_id});

    let cart;
    // console.log(itemExists);
    // console.log(itemExists.quantity);

    if(itemExists && itemExists.length!=0){
      const new_quantity = itemExists.quantity + quantity;
      [cart] = await shopping_cart.update({
        quantity: new_quantity,
        added_on
      },
        {
        where: {
          cart_id: cartId,
          product_id
        }
      });
    } else {
      [cart] = await shopping_cart.findOrCreate({
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
    }

    // const [cart] = await shopping_cart.findOrCreate({
    //   where: {
    //     cart_id: cartId,
    //     product_id
    //   },
    //   defaults: {
    //     // attributes,
    //     quantity,
    //     added_on
    //   }
    // });

    return cart;
  }

  static async fetchShoppingCart(cartId) {
    const cart = await shopping_cart.findAll({
      where: {
        cart_id: cartId
      },
      include: [{
        model: product,
        include: [{
          model: category,
          as: 'Category',
        }]
      },
    ]
    });
    // HttpError.throwErrorIfNullOrEmpty(cart, 'Your cart is currently empty', 200);
    return cart;
  }

  static async fetchShoppingCartProduct({cartId, product_id}) {
    const cart = await shopping_cart.findOne({
      where: {
        cart_id: cartId,
        product_id
      },
      include: [{
        model: product,
        include: [{
          model: category,
          as: 'Category',
        }]
      },
    ]
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
