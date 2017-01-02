// grab the things we need
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
// var bcrypt = require('bcrypt'),
// SALT_WORK_FACTOR = 10;

// create a schema
var OwnerSchema = new Schema({
  firstName: { type: String, required: true },
  lastName: String,
  picture:String,
  email: { type: String, trim: true, lowercase: true, match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address'], required: true, unique: true },
  password: { type: String, match: [/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{6,})/, 'Password must be strong 1 uppercase, 1 lowercase, 1 numeric, 1 special character and minimum 6 characters'], required: true},
  //password: { type: String, required: true},
  cellPhoneNumber: { type: Number},
  status:Boolean,
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
});

OwnerSchema.pre('save', function(next) {
    var owner = this;       
owner.password = require('crypto')
                  .createHash('sha1')
                  .update(owner.password)
                  .digest('base64');
                  next();
    // only hash the password if it has been modified (or is new)
    // if (!owner.isModified('password')) return next();

    // // generate a salt
    // bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
    //     if (err) return next(err);

    //     // hash the password along with our new salt
    //     bcrypt.hash(owner.password, salt, function(err, hash) {
    //         if (err) return next(err);

    //         // override the cleartext password with the hashed one
    //         owner.password = hash;
    //         next();
    //     });
    // });
});

// the schema is useless so far
// we need to create a model using it
var Owner = mongoose.model('Owner', OwnerSchema);

// make this available to our users in our Node applications
module.exports = Owner;