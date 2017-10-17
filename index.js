var express 			= require('express')
,	pug					= require('pug')
,	sass				= require('node-sass')
,   sassMiddleware		= require('node-sass-middleware')
,	errorhandler		= require('errorhandler')
,	morgan 				= require('morgan')
,   dotenv				= require('dotenv').config({silent: true})
,	body_parser			= require('body-parser').urlencoded({ extended: true })
,	fs					= require('fs');

var app = express();

//Setup App
if ('development' == app.get('env')) {
	app.locals.pretty = false;
	app.use(sassMiddleware({
		debug: true,
		src: __dirname + '/sass',
		dest: __dirname + '/public',
		outputStyle: 'compressed'
	}));
	app.use(errorhandler({ dumpExceptions: true, showStack: true })); 
}

if ('production' == app.get('env')) {
	app.locals.pretty = false;
	app.use(sassMiddleware({
		src: __dirname + '/sass',
		dest: __dirname + '/public',
		debug: false,
		outputStyle: 'compressed'
	}));
}

app.use(morgan('combined'));
app.use(body_parser);
app.set('views', __dirname + '/views');
app.set('view engine', 'pug');
app.use(express.static(__dirname + '/public'));

//Set up routes
require('./app/routes.js')(app);

var listener = app.listen(process.env.PORT || 8080, function () {
	console.log("Info: 'Lurpak Soundboard' listening on port " + listener.address().port + " in " + process.env.NODE_ENV + " mode.");
});