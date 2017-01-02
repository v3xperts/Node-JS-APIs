// grab the things we need
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
ItemSchema = require('../model/Restaurant.js');
ItemSchema = require('../model/User.js');
ItemSchema = require('../model/Dish.js');

// create a schema
var OrderSchema = new Schema({
  restaurant: { type: Schema.Types.ObjectId, ref: 'Restaurant', required: true },
  typeOforder:{ type: String, required: true },
  quantity:{ type: String, required: true },
  status:{type: String, enum: ['Pending', 'Cancelled', 'Completed']},
  price:{ type: Number, required: true },
  user:{ type: Schema.Types.ObjectId, ref: 'User', required: true },
  items:[{ type: Schema.Types.ObjectId, ref: 'Dish', required: true }],
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
});

// the schema is useless so far
// we need to create a model using it
var Order = mongoose.model('Order', OrderSchema);

// make this available to our users in our Node applications
module.exports = Order;