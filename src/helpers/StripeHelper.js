const stripe = require('stripe');
const stripeKey = process.env.STRIPE_SECRET_KEY;
const stripePay = stripe(stripeKey);

class StripeHelpers {

    static async createToken(req, res, next) {
        try {
            // console.log(Date);
            const currentYear = new Date().getFullYear();
            const expiryYear = parseInt(currentYear.toString().substr(0,2) + req.body.exp_date_y.toString());

            const param = {
                card:{
                    number: req.body.card_number,
                    exp_month: req.body.exp_date_m,
                    exp_year: expiryYear,
                    cvc: '214'
                }
            }
            const token = await stripePay.tokens.create(param);
            req.body.stripeToken = token.id;
            return next();

        } catch (error) {
            return next(error);
        }

    }
}

module.exports = StripeHelpers;