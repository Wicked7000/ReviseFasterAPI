var express = require('express');
var app = express();
var bodyParser = require('body-parser');

var NameObject = require('../app/models/name');

var mongoose =  require("mongoose");
mongoose.connect("mongodb://Wicked:Helen12345@ds135830.mlab.com:35830/revisefaster")

app.use(bodyParser.urlencoded({ extended: true}));
app.use(bodyParser.json());

var port = process.env.PORT || 8080;
var router = express.Router();

router.use(function(req,res,next){
	console.log("Something is happening!");
	next();
});

router.get("/",function(req,res){
	res.json({ message: 'hooray it works!' });
});

router.route('/names').post(function(req,res){
	var Name = new NameObject();
	Name.name = req.body.name;
	console.log(Name.name);

	Name.save(function(err){
		if(err)
			res.send(err);
		res.json({ message:"Name Created!"});
	});
});

app.use('/api',router);

app.listen(port);
console.log("Magic happens!");