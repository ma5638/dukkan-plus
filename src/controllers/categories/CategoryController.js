const CategoryService = require('../../services/CategoryService');
// const ProductService = require('../../services/ProductService');
// const ProductHelpers = require('../../helpers/ProductHelpers');
const HttpError = require('../../helpers/ErrorHandler');

class CategoryController{
    static async getAllCategories(req, res) {
        try {
            const {
            query: { page, limit, description_length }
            } = req;
            const requiredPage = page || 1;
            const requiredLimit = limit || 20;
            const descriptionLength = description_length || 200;

            const { rows, count } = await CategoryService.fetchAndCountCategories({
            page: requiredPage,
            limit: requiredLimit
            });

            // Supposed to be ProductHelpers lol
            const categories = await CategoryService.formatData(rows, descriptionLength);
            // return res.status(200).send({
            //   count,
            //   rows: products
            // });
            return res.render("shop-grid-full-categories",{
                categories
            });

            // return {count, rows:products};
        } catch (error) {
            return HttpError.sendErrorResponse(error, res);
        //   return {count:-1, rows:HttpError.sendErrorResponse(error, res)};
        }
    }
}

module.exports = CategoryController;