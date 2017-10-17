// app/routes.js
var functions 	= require('./functions');

module.exports = function(app) {
	app.get('/', function (req, res) {
		var number_of_sounds = 18;
		
		res.render('index', {
			title: "Lurpak - Soundboard",
			number_of_sounds: number_of_sounds
		});
	});
}