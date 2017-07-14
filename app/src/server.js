var express = require('express');
var app = express();
var request = require('request');
var path = require('path');


/**** Homepage routes *******/
app.get('/', function (req, res) {
	res.sendFile(path.join(__dirname, '/static', 'homepage.html'));
});

app.get('/homepage', function (req, res) {
	res.redirect('/');
});

app.get('/homepage.html', function (req, res) {
	res.redirect('/');
});



/**** Validate page routes *******/
app.get('/validate', function (req, res) {
	res.sendFile(path.join(__dirname, '/static', 'validate.html'));
});

app.get('/validate.html', function (req, res) {
	res.redirect('/validate');
});


/**** Post routes *******/
app.get('/post', function (req, res) {
	res.sendFile(path.join(__dirname, '/static', 'post.html'));
});

app.get('/post.html', function (req, res) {
	res.redirect('/post');
});


/**** Favicon route *******/
app.get('/favicon.ico', function (req, res) {
	res.sendFile(path.join(__dirname, '/static', 'favicon.ico'));
});


app.use(express.static('static'))

app.listen(8080, function () {
  console.log('Example app listening on port 8080!');
});
