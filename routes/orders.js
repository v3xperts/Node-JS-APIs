var express = require('express');
var router = express.Router();
var orderModel  =  require("../model/Order.js");
var dishModel  =  require("../model/Dish.js");

/* Orders listing */
router.get('/', function(req, res, next) {
	var response={};

	var logedInUserId = req.decoded._doc._id;
	var logedInUserRole = req.decoded._doc.role;
	if (logedInUserRole=="Customer") {
		orderModel.find({owner:logedInUserId}).populate('items').populate('restaurant').populate('user').exec(function (err, data) {
	  		if (err)
	  		response = {"error" : true,"message" : "Error fetching data"};
			
			response = {"error" : false,"message" : data};
			res.json(response);
		});
	}else{
		orderModel.find().populate('items').populate('restaurant').populate('user').exec(function (err, data) {
	  		if (err)
	  		response = {"error" : true,"message" : "Error fetching data"};
			
			response = {"error" : false,"message" : data};
			res.json(response);
		});
	}
});


// Order Add
router.post('/',function(req, res){
	var response={};

	var logedInUserId = req.decoded._doc._id;
	var logedInUserRole = req.decoded._doc.role;
	if (logedInUserRole=="Customer") {
		req.body.user = logedInUserId;
	}
	req.body.status = 'Pending';
	var order = new orderModel(req.body);
    dishModel.findById(req.body.items, function(err, dish) {
    	if(err) {
            response = {"error" : true,"message" : err};
        } else {
			order.items.push(dish._id);
		    order.save(function(err){
		    	if(err) {
		            response = {"error" : true,"message" : err};
		        } else {
		            response = {"error" : false,"message" : "Data added"};
		        }
		        res.json(response);
		    });
        }
    });
});

// Order update
router.put('/:id',function(req, res){
	var response={};
	var logedInUserId = req.decoded._doc._id;
	var logedInUserRole = req.decoded._doc.role;
	if ((logedInUserRole=="Owner") || (logedInUserRole=="Admin")) {
		orderModel.findByIdAndUpdate(req.params.id, req.body, function(err, order) {
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

// Order Detail
router.get('/:id',function(req,res){
	var response={};
	orderModel.findById(req.params.id).populate('items').exec(function (err, data) {
		if (err) {
			response = {"error" : true,"message" : "Error fetching data"};
		} else{
			response = {"error" : false,"message" : data};
		};
		res.json(response);
	});	
});

// Order delete
router.delete('/:id',function(req,res){
	var response={};
	console.log(req.params.id);
	var logedInUserId = req.decoded._doc._id;
	var logedInUserRole = req.decoded._doc.role;
	if ((logedInUserRole=="Owner") || (logedInUserRole=="Admin")) {
		orderModel.remove({_id:req.params.id},function(err,data){
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
