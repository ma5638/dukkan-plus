class ProductHelpers {
  static trimDescriptionLength(description, length) {
    return `${description.substring(0, length)}...`;
  }

  static formatData(data, descriptionLength) {
    console.log("Her");
    return data.map((product) => {
      const {
        product_id, name, description, price, discounted_price, image, Category
      } = product;

      let category = null;

      if(Category.length !=0 && Category[0].name){
        category = Category[0];
        category = {name:category.name}
      }

      const trimmed_description = descriptionLength==-1? description: ProductHelpers.trimDescriptionLength(description, descriptionLength);

      return {
        product_id,
        name,
        description: trimmed_description,
        price,
        discounted_price,
        image,
        category
      };
    });
  }
}

module.exports = ProductHelpers;
