// app/routes.js
var functions 	= require('./functions');
const normalizePort = require('normalize-port');

module.exports = function(app) {
	var socket_route = '';
	var port = normalizePort(process.env.PORT || '3000');
	
	if ('production' == app.get('env')) {
		socket_route = 'http://metoothreefour.com:' + 80;
	} else {
		socket_route = 'http://localhost:' + port;
	}
	
	app.get('/', function (req, res) {
		res.render('index', {
			title: "Me Too Three Four",
			socket_route: socket_route
		});
	});
}