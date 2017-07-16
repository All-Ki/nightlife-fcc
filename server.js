'use strict';

var express = require('express');
var routes = require('./app/routes/index.js');
var bp = require('body-parser');
var mongoose = require('mongoose');
var passport = require('passport');
var session = require('express-session');

var app = express();

require('dotenv').load();
require('./app/config/passport')(passport);

mongoose.connect(process.env.MONGO_URI);

mongoose.Promise = global.Promise;

app.use(bp.json());
app.use(bp.urlencoded({extended: true}));
app.use('/controllers', express.static(process.cwd() + '/app/controllers'));
app.use('/public', express.static(process.cwd() + '/public'));
app.use('/common', express.static(process.cwd() + '/app/common'));

app.use(session({
	secret: 'secretClementine',
	resave: false,
	saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());

app.set('view engine', 'pug');

routes(app, passport);

var port = process.env.PORT || 8080;
app.listen(port,  function () {
	console.log('Node.js listening on port ' + port + '...');
});