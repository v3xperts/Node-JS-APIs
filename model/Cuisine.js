var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// create a schema
var cuisineSchema = new Schema({
  name: { type: String, required: true},
  picture: { type: String, required: false},
  status: { type: Boolean, default: true },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
});

// we need to create a model using it
var Cuisine = mongoose.model('Cuisine', cuisineSchema);

// make this available to our users in our Node applications
module.exports = Cuisine;