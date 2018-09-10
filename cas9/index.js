const mongoClient = require('mongodb').MongoClient;
const url = "mongodb://admin:admin1@ds151012.mlab.com:51012/cas9semos";
var db;

const express = require('express');
const app = express();

const bodyParser = require('body-parser');

const recipe = require("./Recipe");

app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'ejs');


app.listen(8000);

mongoClient.connect(url, (err, client) =>{
	if(err) {
		console.log(err);
	}
	else{
		db = client.db("cas9semos");
		console.log("connected");
	}
});

app.get('/newRecipe', (req, res) => {
	res.render('newRecipe');
});

app.post('/newRecipe', (req, res) => {
	let recName = req.body.recName;
	let ingridients = req.body.ingridients;
	let prepTime = req.body.prepTime;

	let r = new recipe.create(recName, ingridients, prepTime);
	console.log(r);

	db.collection('recipes').insertOne(r, (err) =>{
		if (err) console.log(err);
		else{
			console.log("new recipe added");
			res.render('allRecipes');
		}
	})
})

app.get('/allRecipes', (req, res) =>{

	db.collection('recipes').find({}).toArray((err, result) =>{
		res.render('allRecipes', {recipes: result});

	})
})

