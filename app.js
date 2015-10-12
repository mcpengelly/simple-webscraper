var cheerio = require('cheerio');
var request = require('request');
var prompt = require('prompt');
var fs = require('fs');

//prompt.start();

var url = 'http://www.imdb.com/title/tt3659388/';

/*prompt.get(['url'], function(err, result){
	if (err) throw err;
	url = result.url;
});*/

request(url, function(err, res, html) {
	if (!err) {
		var title, datePublished, rating, description;
		var json = { title: '', datePublished: '', rating: '', description: ''};
		var $ = cheerio.load(html);

		$('.header').filter(function() {
			var element = $(this);
			//traverse DOM to find title, publishDate and rating
			title = element.children().first().text();
			datePublished = element.children().last().text();

			json.title = title;
			json.datePublished = datePublished;
		});

		$("#title-overview-widget").filter(function() {
			var element = $(this);
			description = element.children().find('p').first().next().text().trim();
			json.description = description;
		});

		$('.star-box-giga-star').filter(function() {
			var element = $(this);
			rating = element.text().trim();
			json.rating = rating;
		});

		fs.writeFile('theMartianIMBD.json', JSON.stringify(json, null, 4), function(err) {
			if (err) throw err;
			console.log("File Written to project directory");
		});
	}
});
