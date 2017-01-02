var express = require('express');
var router = express.Router();
var NodeGeocoder = require('node-geocoder');
var jwt    = require('jsonwebtoken');
var userModel  =  require("../model/User.js");
var options = {
  provider: 'google',
 
  // Optional depending on the providers 
  httpAdapter: 'https', // Default 
  apiKey: null, // for Mapquest, OpenCage, Google Premier 
  formatter: null         // 'gpx', 'string', ... 
};
 
var geocoder = NodeGeocoder(options);

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/authenticate',function(req, res){
	var epassword = require('crypto')
                          .createHash('sha1')
                          .update(req.body.password)
                          .digest('base64');
	userModel.findOne({email:req.body.email,password:epassword}, function(err, user) {
		if (err) throw err;

		if (!user) {
			res.json({ success: false, message: 'Authentication failed. User not found.' });
		} else if (user) {
			var token = jwt.sign(user, 'restaurentcrudapp');
			res.json({success: true,message: 'Enjoy your token!',token: token});
		}
	});
});


router.post('/',function(req, res){
	var response={};
	var address = {};
    var fullAddress = req.body.apartmentNo+" "+req.body.houseNo+" "+req.body.streetNo+" "+req.body.city+" "+req.body.country;
	req.body.role = "Customer";

	geocoder.geocode(fullAddress, function(err, gResponse) {
		if(gResponse[0])
		{
			req.body.latitude = gResponse[0].latitude;
			req.body.longitude = gResponse[0].longitude;
		}
	});
	
	var user = new userModel(req.body);
	address.apartmentNo = req.body.apartmentNo
	address.houseNo = req.body.houseNo
	address.streetNo = req.body.streetNo
	address.city = req.body.city
	address.country = req.body.country		
	user.address.push(address);	
	
	user.save(function(err){
		if(err) {
			response = {"error" : true,"message" : err};
		} else {
			response = {"error" : false,"message" : "Data added"};
		}
		res.json(response);
	});
});
module.exports = router;
