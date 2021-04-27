const ProductService = require('../../services/ProductService');
const ReviewService = require('../../services/ReviewService');
const ProductHelpers = require('../../helpers/ProductHelpers');
const HttpError = require('../../helpers/ErrorHandler');

class ProductController {
  static async getAllProducts(req, res) {
    try {
      const {
        query: { page, limit, description_length }
      } = req;
      const requiredPage = page || 1;
      const requiredLimit = limit || 2;
      const descriptionLength = description_length || 200;

      const { count, rows } = await ProductService.fetchAndCountProducts({
        page: requiredPage,
        limit: requiredLimit
      });
      const maxPage = Math.ceil(count/requiredLimit);

      const products = await ProductHelpers.formatData(rows, descriptionLength);
      return res.render("layout",{
        template: "shop-grid-full",
        data: req.auth,
        products,
        maxPage
      });
    } catch (error) {
      return HttpError.sendErrorResponse(error, res);
    }
  }

  static async getProductsByCategory(req, res) {
    try {
      const {
        params: { category_id },
        query: { page, limit, description_length }
      } = req;
      const requiredPage = page || 1;
      const requiredLimit = limit || 20;
      const descriptionLength = description_length || 200;

      const { rows, count } = await ProductService.fetchProductsByCategory({
        page: requiredPage,
        limit: requiredLimit,
        category_id
      });

      if (rows && rows.length < 1) {
        return res.status(200).json({
          message: 'There are no products in this category',
          count,
          rows
        });
      }

      const products = await ProductHelpers.formatData(rows, descriptionLength);
      return res.status(200).send({
        count,
        rows: products
      });
    } catch (error) {
      return HttpError.sendErrorResponse(error, res);
    }
  }

  static async getProductsBySearchString(req, res) {
    try {
      let {     // converted const to let because had to change query_string later
        query: {
          page, limit, description_length, query_string
        }
      } = req;
      const requiredPage = page || 1;
      const requiredLimit = limit || 20;
      const descriptionLength = description_length || 200;

      const { rows, count } = await ProductService.fetchProductsBySearchKeyword(
        {
          page: requiredPage,
          limit: requiredLimit,
          query_string: query_string.trim()
        }
      );

      const products = await ProductHelpers.formatData(rows, descriptionLength);

      // return proper webpage instead here
      
      return res.status(200).send({
        count,
        rows: products
      });
    } catch (error) {
      return HttpError.sendErrorResponse(error, res);
    }
  }

  static async getProductDetails(req, res, next) {
    try {
      const { params: { product_id } } = req;

      let product = await ProductService.fetchProductDetails(product_id);

      if(product.Category.length!=0){
        product.category = product.Category[0];
      }
      
      const { count, rows } = await ReviewService.fetchAndCountReviews({ product_id });

      let customer_review = null;

      if(req.auth){
        customer_review = await ReviewService.findCustomerReview({
          customer_id: req.auth.customer_id,
          product_id
        });
      }

      if (!product) return next();
      
      return res.render('layout',{
        template: 'product-detail',
        product,
        reviews: rows,
        data: req.auth,
        customer_review
      });
    } catch (error) {
      return HttpError.sendErrorResponse(error, res);
    }
  }

  static async createOrUpdateReview(req,res,next){
    // 
    try{
      const { params: { product_id }, body:{ review, rating} } = req;
      // const { params: { product_id } } = req;

      const customer_id = req.decoded.customer_id;
      
      const existing_customer_review = await ReviewService.findCustomerReview( { 
        customer_id,
        product_id 
      });
      let customer_review;
      if(existing_customer_review){
        // If a customer review exists, update
        customer_review = await ReviewService.updateCustomerReview({
          customer_id,
          product_id,
          review_text: review,
          rating
        });
      } else{
        // If a customer review does not exist, create
        customer_review = await ReviewService.createCustomerReview({
          customer_id,
          product_id,
          review_text: review,
          rating
        });
      }
      return res.redirect(`/products/${product_id}`);
    } catch(error){
      return next(error);
    }
  }
}

module.exports = ProductController;
