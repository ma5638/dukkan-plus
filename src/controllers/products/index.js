const express = require('express');
const ProductController = require('./ProductController');
const ProductValidator = require('../../middleware/ProductValidator');
const productRouter = express.Router();

// Get all products
// productRouter.get('/products', ProductController.getAllProducts);
productRouter.get('/products', async (req,res)=>{
  const {count,rows} = await ProductController.getAllProducts(req,res);
  if(count==-1) // -1 means error
  {
    return rows;  // rows represents an error if count = -1
  }

  // Put code to render the actual webpage here

  return res.send({count,rows});  // Temporary
});

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

// Get products by category
productRouter.get(
  '/products/inCategory/:category_id',
  ProductValidator.validateParamId,
  ProductValidator.validateQuery,
  ProductController.getProductsByCategory
);

// Get products by department
productRouter.get(
  '/products/inDepartment/:department_id',
  ProductValidator.validateParamId,
  ProductValidator.validateQuery,
  ProductController.getProductsByDepartment
);

module.exports = productRouter;
