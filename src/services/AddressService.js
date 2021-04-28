const models = require('../database/models');
const HttpError = require('../helpers/ErrorHandler');

const { address } = models;

class AddressService {
    static async findAllAddress({ customer_id }) {
        const result = await address.findAndCountAll({ where: { customer_id } });
        return result;
    }

    static async findAddressWithId({ customer_id, address_id }) {
        const result = await address.findOne({ where: { customer_id, address_id } });
        return result;
    }


    // Right now you cannot update an email
    static async addAddress({ body, customer_id, address_id }) {
        const result = await address.create({
            customer_id,
            address_1: body.address_1,
            address_2: body.address_2,
            city: body.city,
            country: body.country
        });
        return result;
    }

    static async updateAddress({ body, customer_id, address_id }) {
        const result = await address.update({
            customer_id,
            address_1: body.address_1,
            address_2: body.address_2,
            city: body.city,
            country: body.country
        },
        {
            where: {
                address_id
            }
        }
        );
        return result;
    }

    static async removeAddress({ customer_id, address_id }) {
        const result = await address.destroy({
            where: {
                address_id,
                customer_id
            },
            // force: true
        }
        );
        return result;
    }


}

module.exports = AddressService;
