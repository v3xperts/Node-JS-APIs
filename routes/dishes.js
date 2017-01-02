var express = require('express');
var router = express.Router();
var dishModel  =  require("../model/Dish.js");

/* GET Dishes listing */
router.get('/', function(req, res, next) {
	var response={};
	dishModel.find({},function(err,data){
		if (err) {
			response = {"error" : true,"message" : "Error fetching data"};
		} else{
			response = {"error" : false,"message" : data};
		};
		res.json(response);
	});	
});


// Dish add
router.post('/',function(req, res){
	var response={};
	var logedInUserId = req.decoded._doc._id;
	var logedInUserRole = req.decoded._doc.role;
	if ((logedInUserRole=="Owner") || (logedInUserRole=="Admin")) {
	    var dish = new dishModel(req.body);
	    dish.save(function(err){
	    	if(err) {
	            response = {"error" : true,"message" : err};
	        } else {
	            response = {"error" : false,"message" : "Data added"};
	        }
	        res.json(response);
	    });
	}else{
		response = {"error" : false,"message" : "Access Denied"};
		res.json(response);
	}
});

// Dish update
router.put('/:id',function(req, res){
	var response={};
	var logedInUserId = req.decoded._doc._id;
	var logedInUserRole = req.decoded._doc.role;
	if ((logedInUserRole=="Owner") || (logedInUserRole=="Admin")) {
		dishModel.findByIdAndUpdate(req.params.id, req.body, function(err, dish) {
		    	if(err) {
		            response = {"error" : true,"message" : err};
		        } else {
		            response = {"error" : false,"message" : "Data Update"};
		        }
		        res.json(response);
	        });
	}else{
		response = {"error" : false,"message" : "Access Denied"};
		res.json(response);
	}
});

// Dish Detail
router.get('/:id',function(req,res){
	var response={};
	console.log(req.params.id);
	dishModel.findById(req.params.id,function(err,data){
		if (err) {
			response = {"error" : true,"message" : "Error fetching data"};
		} else{
			response = {"error" : false,"message" : data};
		};
		res.json(response);
	});	
});

// Dish Delete
router.delete('/:id',function(req,res){
	var response={};
	
	var logedInUserId = req.decoded._doc._id;
	var logedInUserRole = req.decoded._doc.role;
	if ((logedInUserRole=="Owner") || (logedInUserRole=="Admin")) {
		dishModel.remove({_id:req.params.id},function(err,data){
			if (err) {
				response = {"error" : true,"message" : "Error fetching data"};
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
