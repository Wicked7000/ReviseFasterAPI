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
//This adds a new item to the DB.
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
})
//This gets all the names in the DB.
.get(function(req,res){
	NameObject.find(function(err,names){
		if(err)
			res.send(err);
		res.json(names);
	});
});

//get a specific name by id!
router.route('/names/:name_id')
.get(function(req,res){
	NameObject.findById(req.params.name_id,function(err,name){
		if(err)
			res.send(err);
		res.json(name);
	});
})
.put(function(req,res){
	NameObject.findById(req.params.name_id,function(err,name){
		if(err)
			res.send(err);

		name.name = req.body.name;

		name.save(function(err){
			if(err)
				res.send(err);
			res.json({ message:'Name Updated!'});
		})
	});
})
.delete(function(req,res){
	NameObject.remove({
		_id: req.params.name_id
	},function(err,name){
		if(err)
			res.send(err);
		res.send({message:"deleted name!"});
	});
});



app.use('/api',router);

app.listen(port);
console.log("Magic happens!");