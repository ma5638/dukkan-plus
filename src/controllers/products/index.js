const express = require('express');
const ProductController = require('./ProductController');
const ProductValidator = require('../../middleware/ProductValidator');
const InputValidator = require('../../helpers/InputValidator');
const AuthValidator = require('../../middleware/AuthValidator');
const productRouter = express.Router();

// Get all products
// productRouter.get('/products', ProductController.getAllProducts);
productRouter.get('/products', ProductController.getAllProducts);

// Get products by search string
productRouter.get(
  '/products/search',
  ProductValidator.validateQuery,
  ProductValidator.validateSearchQuery,
  ProductController.getProductsBySearchString
);

// Get single product details
productRouter.get(
  '/products/:product_id',
  ProductValidator.validateParamId,
  ProductController.getProductDetails
);

productRouter.post(
  '/products/:product_id/submitReview',
  AuthValidator.validateToken,
  ProductValidator.validateParamId,
  InputValidator.reviewValidator(),
  ProductController.createOrUpdateReview
)


// Get products by category
productRouter.get(
  '/products/inCategory/:category_id',
  ProductValidator.validateParamId,
  ProductValidator.validateQuery,
  ProductController.getProductsByCategory
);

module.exports = productRouter;
