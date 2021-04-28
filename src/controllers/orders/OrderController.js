const ShoppingCartService  = require('../../services/ShoppingCartService');
const OrderService = require('../../services/OrderService');
const ErrorHandler = require('../../helpers/ErrorHandler');

const paymentOptions = ["cash", "card"]

class OrderController {
  static async create(req, res, next) {
    try {
      const { body:{ payment, shipping_address_id, billing_address_id },session: { cartId }, decoded: { customer_id } } = req;

      if(!paymentOptions.includes(payment)) return ErrorHandler.next(
        {
          message: "Payment option not selected"
        }
      );

      const [cart] = await Promise.all([
        ShoppingCartService.fetchShoppingCart(cartId),
      ]);
      ErrorHandler.throwErrorIfNullOrEmpty(cart, "Cart is empty");

      const subTotal = cart.reduce((acc, item) => {
        const { product: { price, discounted_price }, quantity } = item;
        let actualPrice = +price;

        if (discounted_price > 0.00) {
          actualPrice = +discounted_price;
        }
        const finalPrice = actualPrice * quantity;
        return acc + finalPrice;
      }, 0);

      const newOrder = await OrderService.createOrder({
        customer_id,
        cart,
        cart_id: cartId,
        total_amount: subTotal,
        shipping_address_id,
        billing_address_id
      });
      req.body.order_id = newOrder.order_id;
      if(payment == "cash") return res.redirect(`/dashboard/orders/${newOrder.order_id}`);
      return next();
    } catch (error) {
      return next(error);
    }
  }

  static async getOrderDetails(req, res, next) {
    try {
      const { params: { order_id }, decoded: { customer_id } } = req;
      const details = await OrderService.fetchOrderInfo({ order_id, customer_id });

      return res.render('layout',{
        template: 'dash-manage-order',
        data: req.decoded,
        order: details,
      })
    } catch (error) {
      next(error);
    }
  }
}

module.exports = OrderController;
