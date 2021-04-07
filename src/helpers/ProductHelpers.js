class ProductHelpers {
  static trimDescriptionLength(description, length) {
    return `${description.substring(0, length)}...`;
  }

  static formatData(data, descriptionLength) {
    return data.map((product) => {
      const {
        product_id, name, description, price, discounted_price, image, Category
      } = product;

      let category = null;

      if(Category.length !=0 && Category[0].name){
        category = Category[0];
        category = {name:category.name}
      }

      return {
        product_id,
        name,
        description: ProductHelpers.trimDescriptionLength(description, descriptionLength),
        price,
        discounted_price,
        image,
        category
      };
    });
  }
}

module.exports = ProductHelpers;
