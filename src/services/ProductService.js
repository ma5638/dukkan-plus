const Sequelize = require('sequelize');
const models = require('../database/models');
const PaginationHelper = require('../helpers/PaginationHelper');

const { Op } = Sequelize;
const { product, category, attribute, attribute_value } = models;
const productAttributes = [
  'product_id',
  'name',
  'description',
  'price',
  'discounted_price',
  'image'
];

class ProductService {
  static async fetchAndCountProducts({ page, limit }) {
    const paginationQuery = PaginationHelper.paginate(page, limit);
    const result = await product.findAndCountAll({
      include: [
        {
          model: category,
          as: 'Category',
          // attributes: []
        }
      ],
      ...paginationQuery,
      attributes: productAttributes,
      // raw: true,
    });

    return result;
  }

  static async fetchProductsByCategory({ page, limit, category_id }) {
    const paginationQuery = PaginationHelper.paginate(page, limit);
    const products = await product.findAndCountAll({
      include: [
        {
          model: category,
          as: 'Category',
          where: {
            category_id
          }
        }
      ],
      ...paginationQuery,
      attributes: productAttributes
    });

    return products;
  }

  static async fetchProductsByDepartment({ page, limit, department_id }) {
    const paginationQuery = PaginationHelper.paginate(page, limit);

    const products = await product.findAndCountAll({
      include: [
        {
          model: category,
          as: 'Category',
          where: {
            department_id
          }
        }
      ],
      ...paginationQuery,
      attributes: productAttributes
    });

    return products;
  }

  static async fetchProductsBySearchKeyword({ page, limit, query_string }) {
    const paginationQuery = PaginationHelper.paginate(page, limit);

    const result = await product.findAndCountAll({
      ...paginationQuery,
      attributes: productAttributes,
      include: [
        {
          model: category,
          as: 'Category',
        }
      ],
      where: {
        [Op.or]: [
          {
            name: {
              [Op.like]: `%${query_string}%`
            }
          },
          {
            description: {
              [Op.like]: `%${query_string}%`
            }
          }
        ]
      }
    });

    return result;
  }

  static async fetchProductDetails(product_id) {
    const result = await product.findByPk(
      
      +product_id, 
      { 
        include: [
          {
            model: category,
            as: 'Category',
            // attributes: []
          }
        ],
        // raw: true 
      }
      );
    return result;
  }

  static async fetchProductByIdAndAttributeValue(value) {
    const result = await product.findByPk(1, {
      include: [{
        model: attribute_value,
        as: 'ProductAttributes',
        include: [
          {
            model: attribute
          }
        ],
        where: {
          value
        }
      }],
    });

    return result;
  }
}

module.exports = ProductService;
