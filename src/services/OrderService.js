const models = require('../database/models');
const OrderDetailService = require('./OrderDetailService');
const ShoppingCartService = require('./ShoppingCartService');
const HttpError = require('../helpers/ErrorHandler');
// const address = require('../database/models/address');

const { orders, order_detail, address, product, category} = models;

class OrderService {
  static async createOrder({
    total_amount,
    customer_id,
    cart,
    cart_id,
    shipping_address_id,
    billing_address_id
  }) {
    const created_on = Date.now();

    const orderInfo = await orders.create({
      total_amount,
      customer_id,
      created_on,
      shipping_address_id,
      billing_address_id
    });

    await OrderDetailService.bulkCreateOrderDetail({ cart, orderInfo });
    await ShoppingCartService.emptyShoppingCartByCartId(cart_id);

    return orderInfo;
  }

  static async fetchOrderInfo({ order_id, customer_id }) {
    const orderDetails = await orders.findOne({
      where: { customer_id, order_id },
      include: [
        {
          model:order_detail,
          include:[{
            model: product,
            include: [{
              model: category,
              as: 'Category'
            }],
            attributes:['product_id', 'image']
          }]
        },
        {
          model: address,
          as: 'Shipping'
        },
        {
          model: address,
          as: 'Billing'
        }
      ]
    });

    HttpError.throwErrorIfNullOrEmpty(orderDetails, 'Order not found');
    return orderDetails;
  }

  static async fetchOrders({customer_id}){
    const orderDetails = await orders.findAndCountAll({
      where: { customer_id },
      include: [
        {
          model:order_detail,
          include:[{
            model: product,
            include: [{
              model: category,
              as: 'Category'
            }],
            attributes:['product_id', 'image']
          }]
        }
      ]
    });
    return orderDetails;
  }
}

module.exports = OrderService;
