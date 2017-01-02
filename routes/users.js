var express = require('express');
var router = express.Router();
var userModel  =  require("../model/User.js");
var multer  = require('multer')
var upload = multer({ dest:'public/uploads/' });


/* GET Users listing */
router.get('/', function(req, res, next) {
	var response={};
	var logedInUserId = req.decoded._doc._id;
	var logedInUserRole = req.decoded._doc.role;
	if (logedInUserRole=="Admin") {		
		userModel.find({},function(err,data){
			if (err) {
				response = {"error" : true,"message" : "Error fetching data"};
			} else{
				response = {"error" : false,"message" : data};
			};
			res.json(response);
		});	
	}else{
		response = {"error" : false,"message" : "Access Denied"};
		res.json(response);
	}
});



// User update
router.put('/:id',function(req, res){
	var response={};
	userModel.findByIdAndUpdate(req.params.id, req.body, function(err, user) {
	    	if(err) {
	            response = {"error" : true,"message" : err};
	        } else {
	            response = {"error" : false,"message" : "Data Update"};
	        }
	        res.json(response);
        });
});

// User detail show
router.get('/:id',function(req,res){
	var response={};
	console.log(req.params.id);
	userModel.findById(req.params.id,function(err,data){
		if (err) {
			response = {"error" : true,"message" : "Error fetching data"};
		} else{
			response = {"error" : false,"message" : data};
		};
		res.json(response);
	});	
});

// User delete
router.delete('/:id',function(req,res){
	var response={};
	var logedInUserId = req.decoded._doc._id;
	var logedInUserRole = req.decoded._doc.role;
	if (logedInUserRole=="Admin") {
		userModel.remove({_id:req.params.id},function(err,data){
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

// User Add
router.post('/',function(req,res){
	var response={};
	var logedInUserId = req.decoded._doc._id;
	var logedInUserRole = req.decoded._doc.role;
	if (logedInUserRole=="Admin") {
	    var user = new userModel(req.body);
	    user.save(function(err){
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

module.exports = router;
