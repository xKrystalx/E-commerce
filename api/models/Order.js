/**
 * Order.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    id: { 
      type: 'number', 
      autoIncrement: true,
    },

    products: {
      type: 'json'
    },

    total:{
      type: 'number'
    },

    createdAt: { 
      type: 'number', 
      autoCreatedAt: true, 
    },
  },

};

