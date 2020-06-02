/**
 * CartController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
    addToCart: async function(req, res){ 
        if(req.session.cart){
            var updateCart = await sails.helpers.updateCart(req);

            req.session.cart = updateCart;

            return res.redirect('back');
        }
        else{
            var cart = await sails.helpers.addToCart(req.param('id'), 1);

            req.session.cart = cart;
            return res.redirect('back');
        }
    },

    viewCart: function(req, res){
        if(req.session.cart){
            return res.view('pages/cart', {cart: req.session.cart, layout: 'layouts/layout'});
        }
        else return res.redirect('back');
    }
};

