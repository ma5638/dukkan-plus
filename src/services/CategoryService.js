// const Sequelize = require('sequelize');
const models = require('../database/models');
const PaginationHelper = require('../helpers/PaginationHelper');

// const { Op } = Sequelize;
const { category } = models;

const categoryAttributes = [
    'category_id',
    'name',
    'description',
  ];


class CategoryService {  
    static async fetchAndCountCategories({ page, limit }) {
        const paginationQuery = PaginationHelper.paginate(page, limit);
        const result = await category.findAndCountAll({
            ...paginationQuery,
            attributes: categoryAttributes,
            raw: true
        });

        return result;
    }
    static formatData(data, descriptionLength) {
        return data.map((category) => {
            const {
            category_id, name, description,
            } = category;

            return {
            category_id,
            name,
            description: CategoryService.trimDescriptionLength(description, descriptionLength),
            };
        });
    }
    static trimDescriptionLength(description, length) {
        return `${description.substring(0, length)}...`;
    }
}

module.exports = CategoryService;