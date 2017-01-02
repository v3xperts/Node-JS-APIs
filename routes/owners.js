var express = require('express');
var router = express.Router();
var ownerModel  =  require("../model/Owner.js");
var jwt    = require('jsonwebtoken');

/* GET owners listing. */
router.get('/', function(req, res, next) {
	var response={};
	ownerModel.find({},function(err,data){
		if (err) {
			response = {"error" : true,"message" : "Error fetching data"};
		} else{
			response = {"error" : false,"message" : data};
		};
		res.json(response);
	});	
});


// owners authenticate
router.post('/authenticate',function(req, res){
	var epassword = require('crypto')
                          .createHash('sha1')
                          .update(req.body.password)
                          .digest('base64');
	console.log(req.secret);
	ownerModel.findOne({email:req.body.email,password:epassword}, function(err, user) {
		if (err) throw err;

		if (!user) {
			res.json({ success: false, message: 'Authentication failed. User not found.' });
		} else if (user) {
			var token = jwt.sign(user, 'restaurentcrudapp');
			res.json({success: true,message: 'Enjoy your token!',token: token});
		}
	});
});

// owners add
router.post('/',function(req, res){
	var response={};
	// req.body.password = require('crypto')
 //                          .createHash('sha1')
 //                          .update(req.body.password)
 //                          .digest('base64');
    var owner = new ownerModel(req.body);
    owner.save(function(err){
    	if(err) {
            response = {"error" : true,"message" : err};
        } else {
            response = {"error" : false,"message" : "Data added"};
        }
        res.json(response);
    });
});

// Owner update
router.put('/:id',function(req, res){
	var response={};
	ownerModel.findByIdAndUpdate(req.params.id, req.body, function(err, owner) {
	    	if(err) {
	            response = {"error" : true,"message" : err};
	        } else {
	            response = {"error" : false,"message" : "Data Update"};
	        }
	        res.json(response);
        });
});

// Owner Detail
router.get('/:id',function(req,res){
	var response={};
	console.log(req.params.id);
	ownerModel.findById(req.params.id,function(err,data){
		if (err) {
			response = {"error" : true,"message" : "Error fetching data"};
		} else{
			response = {"error" : false,"message" : data};
		};
		res.json(response);
	});	
});

// Owner Delete
router.delete('/:id',function(req,res){
	var response={};
	console.log(req.params.id);
	ownerModel.remove({_id:req.params.id},function(err,data){
		if (err) {
			response = {"error" : true,"message" : "Error fetching data"};
		} else{
			response = {"error" : false,"message" : "Deleted Successfully"};
		};
		res.json(response);
	});	
});

module.exports = router;
