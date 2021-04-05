const express = require('express');
const CategoryController = require('./CategoryController');
// const ProductValidator = require('../../middleware/ProductValidator');
const categoryRouter = express.Router();


categoryRouter.get(
    '/categories', CategoryController.getAllCategories
);




module.exports = categoryRouter;