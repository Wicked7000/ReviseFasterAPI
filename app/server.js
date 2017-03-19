var express = require('express');
var app = express();
var bodyParser = require('body-parser');

var DeckOBJ = require('../app/models/name');

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

router.route('/decks')
//This adds a new item to the DB.
.post(function(req,res){
	var newDeck = new DeckOBJ();
	newDeck.name = req.body.name;
	newDeck.xml = req.body.xml;
	newDeck.author = req.body.author;

	newDeck.save(function(err){
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
	DeckOBJ.find(function(err,decks){
		if(err)
			res.send(err);
		res.json(decks);
	});
});

//get a specific name by id!
router.route('/decks/:deck_id')
.get(function(req,res){
	DeckOBJ.findById(req.params.deck_id,function(err,deck){
		if(err)
			res.send(err);
		res.json(deck);
	});
})
.put(function(req,res){
	DeckOBJ.findById(req.params.deck_id,function(err,deck){
		if(err)
			res.send(err);

		deck.name = req.body.name;
		deck.xml = req.body.xml;
		deck.author = req.body.author;

		deck.save(function(err){
			if(err)
				res.send(err);
			res.json({ message:'Deck Updated!'});
		})
	});
})
.delete(function(req,res){
	DeckOBJ.remove({
		_id: req.params.deck_id
	},function(err,name){
		if(err)
			res.send(err);
		res.send({message:"deleted deck!"});
	});
});



app.use('/api',router);

app.listen(port);
console.log("Magic happens!");