// grab the things we need
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
ItemSchema = require('../model/Restaurant.js');

// create a schema
var DishSchema = new Schema({
  restaurant: { type: Schema.Types.ObjectId, ref: 'Restaurant', required: true },	
  name: { type: String, required: true },
  picture:String,
  personToEat:Number,
  foodItem:{type: String, enum: ['','Appetizer', 'Main course', 'Seafood', 'Salads', 'Soups', 'Sweet', 'bakery', 'Drinks' ]},
  foodType:{type: String, enum: ['','Pakistani', 'Indian', 'Chinese', 'American', 'Italian' ]},
  customAttr:String,
  specialNeed:String,
  instructions:String,
  price:{ type: Number, required: true },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
});

// the schema is useless so far
// we need to create a model using it
var Dish = mongoose.model('Dish', DishSchema);

//var error = badDish.validateSync();
//assert.equal(error.errors['eggs'].message, 'Too few eggs');
//assert.equal(!error.errors['bacon']);
//assert.equal(error.errors['drink'].message, '`Milk` is not a valid enum value for path `drink`.');

// make this available to our users in our Node applications
module.exports = Dish;