var express 			= require('express')
,	pug					= require('pug')
,	sass				= require('node-sass')
,   sassMiddleware		= require('node-sass-middleware')
,	errorhandler		= require('errorhandler')
,	morgan 				= require('morgan')
,   dotenv				= require('dotenv').config({silent: true})
,	body_parser			= require('body-parser').urlencoded({ extended: true })
,	fs					= require('fs')
,	socket_io    		= require('socket.io')
, 	async 				= require('async')
,	readline 			= require('readline');

if (process.env.NODE_ENV !== 'production') {
	require('dotenv').load();
}

var app = express();
var server = require('http').createServer(app);  
var io = require('socket.io')(server);

const google = require('googleapis');
const sheetsApi = google.sheets('v4');
const googleAuth = require('./auth');

//
var current_count = 0;

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

googleAuth.authorize()
    .then((auth) => {
        sheetsApi.spreadsheets.values.get({
            auth: auth,
            spreadsheetId: process.env.GOOGLE_SHEET_ID,
            range: process.env.GOOGLE_SHEET_RANGE,
        }, function (err, response) {
            if (err) {
                console.log('The API returned an error: ' + err);
                return console.log(err);
            }
            var results = response.values[0][0];
            current_count = results;
            console.log("Current count stands at: " + results);

			setInterval(count_db_update, 1000*10);
        });
    })
    .catch((err) => {
        console.log('auth error', err);
    });
    
function count_db_update() {
	var values = [[current_count]];
	var body = {values: values};
	
	googleAuth.authorize()
    .then((auth) => {
        sheetsApi.spreadsheets.values.update({
	        auth: auth,
	        spreadsheetId: process.env.GOOGLE_SHEET_ID,
	        range: process.env.GOOGLE_SHEET_RANGE,
	        valueInputOption: "USER_ENTERED",
	        resource: body
	    }, function(err, result) {
		    if(err) {
			    console.log(err);
		    } else {
			    console.log('Count stands at %d.', body.values);
		    }
        });
	});
}

io.on('connection', function(client) {
	if ('development' == app.get('env')) {
    	console.log('Client connected...');
	}
	
    client.on('join', function(data) {
	    if ('development' == app.get('env')) {
        	console.log(data);
		}
		client.emit('count_start', current_count);
	});
	
	client.on('button_pressed', function() {
		current_count++;
		
		client.emit('count_accepted');
		io.sockets.emit('count_updated', current_count);
	});
});

var listener = server.listen(process.env.PORT || 8080, function () {
	console.log("Info: '#METOO Counter' listening on port " + listener.address().port + " in " + process.env.NODE_ENV + " mode.");
});