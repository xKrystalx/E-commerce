/**
 * PageController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
  
    addProduct: function(req, res){
        let product = {};

        product = {
            name: req.body.name,
            description: req.body.description,
            price: req.body.price
        };

        Products.create(product).fetch().exec(function(err, product){
            if(err){
                return err;
            }
            return res.redirect('back');
        });
    },

    viewProducts: function(req, res){
        Products.find().exec(function(err, products){
            if(err){
                return err;
            }
            return res.send({products: products});
        });
    }
};

