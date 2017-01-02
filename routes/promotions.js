var express = require('express');
var router = express.Router();
var promotionModel  =  require("../model/Promotion.js");

/* GET dishs listing. */
router.get('/', function(req, res, next) {
	var response={};
	promotionModel.find({}, null, {sort: {name: 1}},function(err,data){
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
    var dish = new promotionModel(req.body);
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
	promotionModel.findByIdAndUpdate(req.params.id, req.body, function(err, dish) {
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
	promotionModel.findById(req.params.id,function(err,data){
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
	promotionModel.findByIdAndUpdate(req.params.id, req.body, function(err, dish) {
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
	promotionModel.findByIdAndUpdate(req.params.id, req.body, function(err, dish) {
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
	promotionModel.remove({_id:req.params.id},function(err,data){
		if (err) {
			response = {"error" : true,"message" : "Error fetching data"};
		} else{
			response = {"error" : false,"message" : "Deleted Successfully"};
		};
		res.json(response);
	});	
});

module.exports = router;
