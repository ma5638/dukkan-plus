const express = require('express');
const AttributeController = require('./AttributeController');
const InputValidator = require('../../helpers/InputValidator');
const ErrorValidator = require('../../middleware/ErrorValidator');
const attributeRouter = express.Router();

attributeRouter.get('/attributes', AttributeController.getAllAttributes);
attributeRouter.get(
  '/attributes/values/:attribute_id',
  InputValidator.integerValidator('attribute_id'),
  ErrorValidator.check,
  AttributeController.getAttributeValues
);
attributeRouter.get(
  '/attributes/inProduct/:product_id',
  InputValidator.integerValidator('product_id'),
  ErrorValidator.check,
  AttributeController.getProductAttributes
);

module.exports = attributeRouter;
