const models = require('../database/models');

const { review, customer } = models;


class ReviewService {
    static async fetchAndCountReviews({ product_id }) {
        const result = await review.findAndCountAll({
            where: {
                product_id
            },
            include: [
                {
                    model: customer
                }
            ]
        });
        return result;
    }
    static async findCustomerReview({ customer_id, product_id }) {
        const result = await review.findOne({
            where: {
                customer_id,
                product_id
            }
        });
        return result;
    }

    // static async deleteCustomerReview({ customer_id, product_id }) {
    //     const result = await review.destroy({
    //         where: {
    //             customer_id,
    //             product_id
    //         }
    //     });
    //     return result;
    // }

    static async createCustomerReview({ customer_id, product_id, review_text, rating }) {
        const result = await review.create({
            customer_id,
            product_id,
            review: review_text,
            rating,
            created_on: Date.now()
        });
        console.log("Done!")
        return result;
    }

    static async updateCustomerReview({ customer_id, product_id, review_text, rating }) {
        const result = await review.update({
            review: review_text,
            rating,
            created_on: Date.now()
        },
            {
                where: {
                    customer_id,
                    product_id
                }
            }
        );
        return result;
    }
}

module.exports = ReviewService;
