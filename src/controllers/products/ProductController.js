const ProductService = require('../../services/ProductService');
const ProductHelpers = require('../../helpers/ProductHelpers');
const HttpError = require('../../helpers/ErrorHandler');

class ProductController {
  static async getAllProducts(req, res) {
    try {
      const {
        query: { page, limit, description_length }
      } = req;
      const requiredPage = page || 1;
      const requiredLimit = limit || 20;
      const descriptionLength = description_length || 200;

      const { rows } = await ProductService.fetchAndCountProducts({
        page: requiredPage,
        limit: requiredLimit
      });
      // ------------------------
      // Count is always 100. Why???
      console.log(rows);

      const products = await ProductHelpers.formatData(rows, descriptionLength);
      // return res.status(200).send({
      //   count,
      //   rows: products
      // });
      // console.log(products);

      return res.render("shop-grid-full",{
        products
      });

      // return {count, rows:products};
    } catch (error) {
      return HttpError.sendErrorResponse(error, res);
      // return {count:-1, rows:HttpError.sendErrorResponse(error, res)};
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

      // Can comment this out
      // if (rows && rows.length < 1) {
      //   return res.status(200).json({
      //     message: 'Sorry no products match your search keyword',
      //     count,
      //     rows
      //   });
      // }

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

  static async getProductDetails(req, res) {
    try {
      const { params: { product_id } } = req;

      let product = await ProductService.fetchProductDetails(product_id);

      if(product.Category.length!=0){
        product.category = product.Category[0];
      }
      
      console.log(product);

      if (!product) {
        // return res.status(200).json({
        //   message: 'Product not found',
        // });
        return next();
      }

      // return res.status(200).send({
      //   ...product
      // });
      return res.render('product-detail',{
        product
      });
    } catch (error) {
      return HttpError.sendErrorResponse(error, res);
    }
  }
}

module.exports = ProductController;
