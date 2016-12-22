var cheerio = require('cheerio');
var request = require('request');
var fs = require('fs');
var readlineSync = require('readline-sync');

var url, validUrl;

//user must enter valid url to proceed scraping
do {
	url = readlineSync.question('Enter an imdb movie url: ');
	validUrl = url.indexOf('www.imdb');
} while(validUrl === -1);

//request to url user provides
request(url, function(err, res, html) {
	if (!err) {
		var title, datePublished, rating, description;
		var json = { title: '', datePublished: '', rating: '', description: ''};
		var $ = cheerio.load(html);

		$('.header').filter(function() {
			var element = $(this);
			//traverse DOM to find title, publishDate
			title = element.children().first().text();
			datePublished = element.children().last().text();

			json.title = title;
			json.datePublished = datePublished;
		});

		$("#title-overview-widget").filter(function() {
			var element = $(this);
			//traverse DOM to find description
			description = element.children().find('p').first().next().text().trim();
			json.description = description;
		});

		$('.star-box-giga-star').filter(function() {
			var element = $(this);
			//find rating
			rating = element.text().trim();
			json.rating = rating;
		});

		fs.writeFile('movieInfo.json', JSON.stringify(json, null, 4), function(err) {
			if (err) throw err;
			console.log("File Written to project directory");
		});
	}
});
