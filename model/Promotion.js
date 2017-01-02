var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// create a schema
var PromotionSchema = new Schema({
  	name: { type: String, required: true},
  	picture: { type: String, required: true},
  	description: { type: String, required: false},
  	status: { type: Boolean, default: true },
  	created_at: { type: Date, default: Date.now },
  	updated_at: { type: Date, default: Date.now }
});

// we need to create a model using it
var Promotion = mongoose.model('Promotion', PromotionSchema);

module.exports = Promotion;