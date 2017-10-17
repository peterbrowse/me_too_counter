var express 			= require('express')
,	pug					= require('pug')
,	sass				= require('node-sass')
,   sassMiddleware		= require('node-sass-middleware')
,	errorhandler		= require('errorhandler')
,	morgan 				= require('morgan')
,   dotenv				= require('dotenv').config({silent: true})
,	body_parser			= require('body-parser').urlencoded({ extended: true })
,	fs					= require('fs')
,	socket_io    		= require('socket.io');

var app = express();
var server = require('http').createServer(app);  
var io = require('socket.io')(server);

//
var num = 300046;

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

io.on('connection', function(client) {
	if ('development' == app.get('env')) {
    	console.log('Client connected...');
	}
	
    client.on('join', function(data) {
	    if ('development' == app.get('env')) {
        	console.log(data);
		}
		client.emit('count_start', num);
	});
});

var listener = server.listen(process.env.PORT || 8080, function () {
	console.log("Info: '#METOO Counter' listening on port " + listener.address().port + " in " + process.env.NODE_ENV + " mode.");
});