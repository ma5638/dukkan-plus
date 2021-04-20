const stripe = require('stripe');
const OrderService = require('../../services/OrderService');
// const EmailUtil =require('../../helpers/EmailUtil');

// Publishable Test Key: pk_test_51IhEVzHhVSj3JFrUMnjhHoqYrHhvMZgjPUlyNKUY7mRP8SolfZ6CS0x1h3KD5Z4OHRzYLPbPmKKpKGcZAZ23HGqf00pRtEN61D
// Secret Test Key: 	sk_test_51IhEVzHhVSj3JFrUKG0pYkQipPnviLZq7shnQWx8uFM0lIpJHWUVEfnSQSjXkjJcdQed0Rm8YdF56OaQIMcDr69N00F1mryVQp
const stripeKey = process.env.STRIPE_SECRET_KEY;
const stripePay = stripe(stripeKey);

class StripeController {
  static async handlePayment(req, res, next) {
    try {
      const { body: { stripeToken, order_id }, decoded: { email, customer_id } } = req;
      // const { body: { stripeToken, order_id }, decoded: { email, customer_id } } = req;
      

      const order = await OrderService.fetchOrderInfo({ order_id, customer_id });

      if (order.status === 1) {
        return res.status(400).send({
          message: 'Order has already been paid for'
        });
      }

      const { total_amount } = order;
      const finalAmount = Math.floor(total_amount*100);

      // const subTotal = Number(total_amount) + Number(shipping_cost);
      // const tax = subTotal * (tax_percentage / 100);
      // const finalAmount = Math.floor((subTotal + tax) * 100);

      const result = await stripePay.charges.create({
        amount: finalAmount,
        currency: 'usd',
        description: `Order #${order_id} Payment`,
        source: stripeToken,
        // metadata: { orderId: 1 }
        metadata: { orderId: order_id }
      });

      order.status = 1; // needs to be 1 but made it 0 for testing purposes
      await order.save();

      // await EmailUtil.sendConfirmationMail({ email });
      
      // return res.status(200).send(result);
      return res.redirect(307, '/orders/end');
    } catch (error) {
      next(error);
    }
  }
}

module.exports = StripeController;
