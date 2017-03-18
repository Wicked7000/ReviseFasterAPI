var express = require('express');
var app = express();
var bodyParser = require('body-parser');

var NameObject = require('../app/models/name');

var mongoose =  require("mongoose");
var uri = "mongodb://Test:test@ds135820.mlab.com:35820/revisefaster";
mongoose.connect(uri);
var conn = mongoose.connection;
conn.on("error",console.error.bind(console,"Connection error:"));

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

router.route('/names')
.post(function(req,res){
	var newName = new NameObject();
	newName.name = req.body.name;
	console.log(newName.name);

	newName.save(function(err){
		if(!err){
			console.log("no error!");
			res.json({message:"Name Created!"});
		}else{
			console.log("error!");
		}
	});
});

app.use('/api',router);

app.listen(port);
console.log("Magic happens!");