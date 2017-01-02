// grab the things we need
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
ItemSchema = require('../model/User.js');

var RestaurantAddressSchema = new Schema({
	shopNo:{ type: String, required: true },
	street:{ type: String, required: true },
	city:{ type: String, required: true },
	state:{ type: String, required: true },
	country:{ type: String, required: true },
});

// create a schema
var RestaurantSchema = new Schema({
  owner: { type: Schema.Types.ObjectId, ref: 'User' , required: true}, 	
  restaurantName:{ type: String, required: true },
  logo: { type: String, required: true },
  daysOperation: String,
  hoursOperation: String,
  serviceOperation: String,
  capacity: String,
  foodType:{type: String, enum: ['','Pakistani', 'Indian', 'Chinese', 'American', 'Italian' ]},
  deliveryService: Boolean,
  address: [RestaurantAddressSchema],
  landlineNumber: { type: Number, required: true },
  cellNumber: { type: Number, required: true },
  otherDocumentation: String,
  status: Boolean,
  latitude: String,
  longitude: String,
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
});

// the schema is useless so far
// we need to create a model using it
var Restaurant = mongoose.model('Restaurant', RestaurantSchema);

// make this available to our users in our Node applications
module.exports = Restaurant;