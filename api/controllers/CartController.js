/**
 * CartController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

const { dotpayID } = require('../../config/local');

module.exports = {
    addToCart: async function(req, res){ 
        if(req.session.cart){
            var updateCart = await sails.helpers.updateCart(req, false);

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
    },

    processOrder: function(req, res){
        if(req.session.cart){
            var data = {
                products: req.session.cart.items,
                total: req.session.cart.totalPrice,
                paid: false,
            }
            //create a new order to get its id
            var order = Order.create(data).fetch().exec(function(err, order){
                if(err) return err;
                //DotPay requires a sha256 checksum that consists of parameters sent in the url and a few others
                var shajs = require('sha.js');
                var digest = shajs('sha256').update(dotpayID + req.session.cart.totalPrice+'PLN'+order.id+'http://localhost:1337/order_completed/'+order.id+'0').digest('hex');
                return res.redirect('https://ssl.dotpay.pl/test_payment/?id=722484&amount='+req.session.cart.totalPrice+'&currency=PLN&url=http://localhost:1337/order_completed/'+order.id+'&description='+order.id+'&type=0&chk='+digest);
            });
        }
        else return res.redirect('back');
    },

    viewOrders: function(req, res){
        Order.find().exec(function(err, orders){
            if(err) return err;
            return res.json(orders);
        });
    },

    orderCompleted: async function(req, res){
        var order = await Order.updateOne({id: req.param('id')})
        .set({
            paid: true,
        });
        if(order){
            return res.view('pages/order_completed', {order: order, layout: 'layouts/layout'});
        }  
    },
};

