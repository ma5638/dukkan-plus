class ShoppingCartHelpers {
  
    static formatData(data, descriptionLength) {
      return data.map((product) => {
        const {
          item_id, cart_id, product_id, quantity,
        } = product;
  
        return {
            item_id, 
            cart_id, 
            product_id, 
            quantity,
        };
      });
    }
  }
  
  module.exports = ShoppingCartHelpers;