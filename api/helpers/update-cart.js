module.exports = {


  friendlyName: 'Update cart',


  description: 'Title',


  inputs: {
    req:{
      type: 'ref',
      required: true
    },
    edited:{
      type: 'boolean',
      required: true
    },
  },


  fn: async function (inputs, exits) {
    if(inputs.req.param('quantity') != undefined && inputs.req.param('quantity') >= 1){
      var qty = inputs.req.param('quantity');
    } 
    else{
      var qty = 1;
    }

    if(inputs.req.param('id') != undefined){
      var product = await Products.findOne({id: inputs.req.param('id')});
    }

    var currentCart = inputs.req.session.cart;
    

    //Product exists in the cart
    if('item'+product.id in currentCart.items){
      var productID = 'item'+product.id;

      oldQuantity = currentCart.items[productID].qty;
      oldPrice = currentCart.items[productID].qty * currentCart.items[productID].product.price;

      var updatedCart = currentCart;
      //if just adding another item through AddToCart button add to quantity, if editing the final value - overwrite (unused here)
      if(inputs.edited){
        updatedCart.items[productID].qty = qty;
      }
      else{
        updatedCart.items[productID].qty += qty;
      }
      //update total quantities and prices
      updatedCart.totalQuantity = updatedCart.totalQuantity - oldQuantity;
      updatedCart.totalPrice = updatedCart.totalPrice - oldPrice;

      updatedCart.totalQuantity += updatedCart.items[productID].qty;
      updatedCart.totalPrice += updatedCart.items[productID].product.price * updatedCart.items[productID].qty;
    }
    else{
      //push new item
      currentCart.items['item'+inputs.req.param('id')] = {
        qty: qty,
        product: product
      };

      currentCart.totalQuantity += qty;
      currentCart.totalPrice += product.price * qty;
  
      var updatedCart = currentCart;
    }

    return exits.success(updatedCart);
  }


};

