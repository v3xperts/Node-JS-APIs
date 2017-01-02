var express = require('express');
var router = express.Router();
var retaurantModel  =  require("../model/Restaurant.js");
var NodeGeocoder = require('node-geocoder');

var options = {
  provider: 'google',
 
  // Optional depending on the providers 
  httpAdapter: 'https', // Default 
  apiKey: null, // for Mapquest, OpenCage, Google Premier 
  formatter: null         // 'gpx', 'string', ... 
};
 
var geocoder = NodeGeocoder(options);

/* GET Restaurants listing admin and Customers can see all but Owner can see own  */
router.get('/', function(req, res, next) {
	var response={};
	var logedInUserId = req.decoded._doc._id;
	var logedInUserRole = req.decoded._doc.role;
	if (logedInUserRole=="Owner") {
		retaurantModel.find({owner:logedInUserId},function(err,data){
			if (err) {
				response = {"error" : true,"message" : "Error fetching data"};
			} else{
				response = {"error" : false,"message" : data};
			};
			res.json(response);
		});	
	}else{
		retaurantModel.find({},function(err,data){
			if (err) {
				response = {"error" : true,"message" : "Error fetching data"};
			} else{
				response = {"error" : false,"message" : data};
			};
			res.json(response);
		});	

	}
});


// Restaurant Add
router.post('/',function(req, res){
	var response,resaddress={};
	var logedInUserId = req.decoded._doc._id;
	var logedInUserRole = req.decoded._doc.role;
	var response={};
	if ((logedInUserRole=="Owner") || (logedInUserRole=="Admin")) {
		var logedInUserId = req.decoded._doc._id;
		req.body.owner = logedInUserId;
		resaddress.shopNo = req.body.shopNo
	    resaddress.street = req.body.street
	    resaddress.state = req.body.state
	    resaddress.city = req.body.city
	    resaddress.country = req.body.country
	    var fullAddress = req.body.shopNo+" "+req.body.street+" "+req.body.city+" "+req.body.state+" "+req.body.country;
	    geocoder.geocode(fullAddress, function(err, gResponse) {
			if(gResponse[0])
			{
				req.body.latitude = gResponse[0].latitude;
				req.body.longitude = gResponse[0].longitude;
			}
		    var retaurant = new retaurantModel(req.body);
		    retaurant.address = resaddress;
		    retaurant.save(function(err){
		    	if(err) {
		            response = {"error" : true,"message" : err};
		        } else {
		            response = {"error" : false,"message" : "Data added"};
		        }
		        res.json(response);
		    });
		});
	}else{
		response = {"error" : true,"message" : "Access Denied"};
		res.json(response);
	}
});

// Restaurant update
router.put('/:id',function(req, res){
	var response={};
	var logedInUserId = req.decoded._doc._id;
	var logedInUserRole = req.decoded._doc.role;
	if ((logedInUserRole=="Owner") || (logedInUserRole=="Admin")) {
	//req.body.owner = logedInUserId;
	retaurantModel.findByIdAndUpdate(req.params.id, req.body, function(err, retaurant) {
	    	if(err) {
	            response = {"error" : true,"message" : err};
	        } else {
	            response = {"error" : false,"message" : "Data Update"};
	        }
	        res.json(response);
        });
	}else{
		response = {"error" : true,"message" : "Access Denied"};
		res.json(response);
	}
});

router.get('/:id',function(req,res){
	var response={};
	retaurantModel.find({_id:req.params.id},function(err,data){
		if (err) {
			response = {"error" : true,"message" : err};
		} else{
			response = {"error" : false,"message" : data[0]};
		};
		res.json(response);
	});	
});

router.delete('/:id',function(req,res){
	var response={};
	var logedInUserId = req.decoded._doc._id;
	var logedInUserRole = req.decoded._doc.role;
	if ((logedInUserRole=="Owner") || (logedInUserRole=="Admin")) {
	retaurantModel.remove({_id:req.params.id},function(err,data){
		if (err) {
			response = {"error" : true,"message" : err};
		} else{
			response = {"error" : false,"message" : "Deleted Successfully"};
		};
		res.json(response);
	});	
	}else{
		response = {"error" : false,"message" : "Access Denied"};
		res.json(response);
	}
});

module.exports = router;
