const ShoppingCartService  = require('../../services/ShoppingCartService');
// const ShoppingCartHelper  = require('../../services/ShoppingCartHelper');
const AddressService = require('../../services/AddressService');
const ProductService = require('../../services/ProductService');
const HttpError = require('../../helpers/ErrorHandler');

class ShoppingController {
  static async addProductToCart(req, res, next) {
    try {
      const { body: {  product_id, quantity }, session: { cartId } } = req;

      // const [product, productSize, productColor] = await Promise.all([
      //   ProductService.fetchProductDetails(product_id),
      //   ProductService.fetchProductByIdAndAttributeValue(size),
      //   ProductService.fetchProductByIdAndAttributeValue(color),
      // ]);
      const [product] = await Promise.all([
        ProductService.fetchProductDetails(product_id),
      ]);

      HttpError.throwErrorIfNullOrEmpty(product, 'Provide a valid product_id');
      // HttpError.throwErrorIfNullOrEmpty(productSize, `This product is currently not available in '${size}' size`);
      // HttpError.throwErrorIfNullOrEmpty(productColor, `This product is currently not available in color '${color}'.`);

      // const attributes = `${size}, ${color}`;
      // const quantity = quantity;
      const added_on = Date.now();
      // const cart = await ShoppingCartService.addProductToCart({ cartId, product_id, attributes, quantity, added_on });
      const cart = await ShoppingCartService.addProductToCart({ cartId, product_id, quantity, added_on });

      // return res.status(200).send(cart);
      return res.redirect('/shoppingCart');
    } catch (error) {
      next(error);
    }
  }

  static async removeItemFromShoppingCart(req, res, next) {
    try {
      const { body: { item_id } ,session: { cartId } } = req;

      const shoppingCart = await ShoppingCartService.removeItemFromShoppingCart(item_id,cartId);

      // return res.status(200).send(shoppingCart);

      console.log(shoppingCart);
      return res.redirect('/shoppingCart')
    } catch (error) {
      next(error);
    }
  }

  static async emptyShoppingCart(req, res, next) {
    try {
      const { session: { cartId } } = req;

      await ShoppingCartService.emptyShoppingCartByCartId(cartId);

      // return res.status(200).send([]);
      return res.redirect("/shoppingCart");
    } catch (error) {
      next(error);
    }
  }

  static async getShoppingCart(req, res, next) {
    try {
      const { session: { cartId } } = req;

      const shoppingCart = await ShoppingCartService.fetchShoppingCart(cartId);

      console.log(shoppingCart);

      // return res.status(200).send(shoppingCart);

      // console.log(shoppingCart);
      return res.render("cart",{
        shoppingCart
      });

    } catch (error) {
      next(error);
    }
  }
  static async showCheckout(req,res,next){
    try {
      
      const { session: { cartId }, decoded } = req;

      const shoppingCart = await ShoppingCartService.fetchShoppingCart(cartId);
      const { rows } =  await AddressService.findAllAddress({ customer_id: decoded.customer_id });


      return res.render("checkout",{
        shoppingCart,
        addresses: rows
      });

    } catch (error) {
      next(error);
    }
  }
}

module.exports = ShoppingController;
