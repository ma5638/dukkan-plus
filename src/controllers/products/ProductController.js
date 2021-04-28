const ProductService = require('../../services/ProductService');
const ReviewService = require('../../services/ReviewService');
const ProductHelpers = require('../../helpers/ProductHelpers');
const HttpError = require('../../helpers/ErrorHandler');

const DEFAULTLIMIT = 4;

class ProductController {
  static async getAllProducts(req, res, next) {
    try {
      const {
        query: { page, limit, description_length }
      } = req;
      const requiredPage = page || 1;
      const requiredLimit = limit || DEFAULTLIMIT;
      const descriptionLength = description_length || 200;

      const { count, rows } = await ProductService.fetchAndCountProducts({
        page: requiredPage,
        limit: requiredLimit
      });
      const maxPage = Math.ceil(count/requiredLimit);

      let products = [];

      if(rows.length>0){
        products = await ProductHelpers.formatData(rows, descriptionLength);
      }

      return res.render("layout",{
        template: "shop-grid-full",
        data: req.auth,
        products,
        maxPage
      });
    } catch (error) {
      return next(error);
    }
  }

  static async getProductsByCategory(req, res, next) {
    try {
      const {
        params: { category_id },
        query: { page, limit, description_length }
      } = req;
      const requiredPage = page || 1;
      const requiredLimit = limit || DEFAULTLIMIT;
      const descriptionLength = description_length || 200;

      const { rows, count } = await ProductService.fetchProductsByCategory({
        page: requiredPage,
        limit: requiredLimit,
        category_id
      });

      const maxPage = Math.ceil(count/requiredLimit);

      let products = [];

      if(rows.length>0){
        products = await ProductHelpers.formatData(rows, descriptionLength);
      }

      return res.render("layout",{
        template: "shop-grid-full",
        data: req.auth,
        products,
        maxPage
      });
    } catch (error) {
      return next(error);
    }
  }

  static async getProductsBySearchString(req, res, next) {
    try {
      const {     // converted const to let because had to change query_string later
        query: {
          page, limit, description_length, query_string
        }
      } = req;
      const requiredPage = page || 1;
      const requiredLimit = limit || DEFAULTLIMIT;
      const descriptionLength = description_length || 200;
      const { rows, count } = await ProductService.fetchProductsBySearchKeyword(
        {
          page: requiredPage,
          limit: requiredLimit,
          query_string: query_string.trim()
        }
      );

      const maxPage = Math.ceil(count/requiredLimit);

      let products = [];

      if(rows.length>0){
        products = await ProductHelpers.formatData(rows, descriptionLength);
      }
      
      return res.render("layout",{
        template: "shop-grid-full",
        data: req.auth,
        products,
        maxPage
      });
    } catch (error) {
      // return HttpError.sendErrorResponse(error, res);
      return next(error);
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
      return next(error);
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
