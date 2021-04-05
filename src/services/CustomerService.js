const models = require('../database/models');
const HttpError = require('../helpers/ErrorHandler');

const { customer } = models;

class CustomerService {
  static async findOrCreateUser({ name, email, password }) {
    const result = await customer.findOrCreate({ where: { email }, defaults: { name, password } });
    return result;
  }

  static async findUser({ email }) {
    const user = await customer.findOne({ where: { email } });
    return user;
  }


  // Right now you cannot update an email
  static async updateUser(details) {
    const { body, currEmail } = details;

    const user = await CustomerService.findUser({ email:currEmail });
    HttpError.throwErrorIfNullOrEmpty(user, 'User not found');
    

    const [result] = await customer.update({ ...body }, { where: { email:currEmail } });
    if (result) {
      const updatedUser = await CustomerService.findUser({ email:body.email });
      return { ...updatedUser.toJSON() };
    }

    HttpError.throwErrorIfNullOrEmpty(result, 'Update Failed', 500);
  }
}

module.exports = CustomerService;
