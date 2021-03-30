const models = require('../database/models');
const HttpError = require('../helpers/ErrorHandler');

const { tax } = models;

class TaxService {
  static async fetchTaxDetailsById(tax_id) {
    const taxInfo = await tax.findByPk(tax_id);

    HttpError.throwErrorIfNullOrEmpty(
      taxInfo,
      "tax_id doesn't exist, Please Provide a valid tax_id"
    );
    return taxInfo;
  }
}

module.exports = TaxService;
