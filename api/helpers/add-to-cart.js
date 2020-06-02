module.exports = {


  friendlyName: 'Add to cart',


  description: 'Title',


  inputs: {
      productID:{
        type: 'string',
        required: true
      },

      productQuantity:{
        type: 'number',
        required: true
      }
  },

  fn: async function (inputs, exits) {
    
    var product = await Products.findOne({id: inputs.productID});

    var cart = {
      items: {},
      totalQuantity: inputs.productQuantity,
      totalPrice: product.price
    };

    cart.items['item' + product.id] = {
      qty: inputs.productQuantity,
      product: product
    };

    return exits.success(cart);
  }

};

