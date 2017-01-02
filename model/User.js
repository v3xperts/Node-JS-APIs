// grab the things we need
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt'),
SALT_WORK_FACTOR = 10;
var owasp = require('owasp-password-strength-test');

// create a schema

var UserAddressSchema = new Schema({apartmentNo:String,houseNo:String,streetNo:String,city:String,country:String});

var userSchema = new Schema({
  firstName: { type: String, required: true },
  middleName: String,
  lastName: String,
  email: { type: String, trim: true, lowercase: true, match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address'], required: true, unique: true },
  picture: String,
  address: [UserAddressSchema],
  latitude: String,
  longitude: String,
  homePhoneNumber: Number,
  cellPhoneNumber: Number,
  password: { type: String, match: [/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{6,})/, 'Password must be strong 1 uppercase, 1 lowercase, 1 numeric, 1 special character and minimum 6 characters'], required: true},
  status:Boolean,
  role:{type: String, enum: ['Admin', 'Owner', 'Customer']},
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
});

userSchema.pre('save', function(next) {
    var user = this;
    user.password = require('crypto')
                  .createHash('sha1')
                  .update(user.password)
                  .digest('base64');
                  next();
	/*
	var result = owasp.test('password');	
	if	(result.errors) 
	{
		console.log('here');
		return next(result.errors); 
		next();
	}
	*/
                 

    // only hash the password if it has been modified (or is new)
    // if (!user.isModified('password')) return next();

    // // generate a salt
    // bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
    //     if (err) return next(err);

    //     // hash the password along with our new salt
    //     bcrypt.hash(user.password, salt, function(err, hash) {
    //         if (err) return next(err);

    //         // override the cleartext password with the hashed one
    //         user.password = hash;
    //         next();
    //     });
    // });
});



// the schema is useless so far
// we need to create a model using it
var User = mongoose.model('User', userSchema);
//var UserAddress = mongoose.model('UserAddress', UserAddressSchema);

// make this available to our users in our Node applications
module.exports = User;