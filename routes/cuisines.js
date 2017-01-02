var express = require('express');
var multer  = require('multer')
var upload = multer({ dest:'public/uploads/' })
var router = express.Router();
var cuisineModel  =  require("../model/Cuisine.js");

/* GET dishs listing. */
router.get('/', function(req, res, next) {
	var response={};
	cuisineModel.find({}, null, {sort: {name: 1}},function(err,data){
		if (err) {
			response = {"error" : true,"message" : "Error fetching data"};
		} else{
			response = {"error" : false,"message" : data};
		};
		res.json(response);
	});	
});


// dishs add
router.post('/',function(req, res){
	var response={};
	var dish = new cuisineModel(req.body);
    dish.save(function(err){
    	if(err) {
            response = {"error" : true,"message" : err};
        } else {
            response = {"error" : false,"message" : "Data added"};
        }
        res.json(response);
    });
});

// dish update
router.put('/:id',function(req, res){
	var response={};
	cuisineModel.findByIdAndUpdate(req.params.id, req.body, function(err, dish) {
	    	if(err) {
	            response = {"error" : true,"message" : err};
	        } else {
	            response = {"error" : false,"message" : "Data Update"};
	        }
	        res.json(response);
        });
});

// dish Detail
router.get('/:id',function(req,res){
	var response={};
	console.log(req.params.id);
	cuisineModel.findById(req.params.id,function(err,data){
		if (err) {
			response = {"error" : true,"message" : "Error fetching data"};
		} else{
			response = {"error" : false,"message" : data};
		};
		res.json(response);
	});	
});

// dish Detail
router.get('/active/:id',function(req,res){
	var response={};
	req.body.status = true;
	cuisineModel.findByIdAndUpdate(req.params.id, req.body, function(err, dish) {
    	if(err) {
            response = {"error" : true,"message" : err};
        } else {
            response = {"error" : false,"message" : "Data Update"};
        }
        res.json(response);
    });
});

// dish Detail
router.get('/deactive/:id',function(req,res){
	var response={};
	req.body.status = false;
	cuisineModel.findByIdAndUpdate(req.params.id, req.body, function(err, dish) {
    	if(err) {
            response = {"error" : true,"message" : err};
        } else {
            response = {"error" : false,"message" : "Data Update"};
        }
        res.json(response);
    });
});

// dish Delete
router.delete('/:id',function(req,res){
	var response={};
	console.log(req.params.id);
	cuisineModel.remove({_id:req.params.id},function(err,data){
		if (err) {
			response = {"error" : true,"message" : "Error fetching data"};
		} else{
			response = {"error" : false,"message" : "Deleted Successfully"};
		};
		res.json(response);
	});	
});

module.exports = router;
