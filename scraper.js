var request = require('request');
var cheerio = require('cheerio');
var cron = require('node-cron');

var hostname = 'http://www.imdb.com';
var path = '/movies-coming-soon';
var url = hostname + path;

//have scheduled job make a request to application endpoint after scraping data

//schedule task every minute for now - debugging
cron.schedule('* * * * *', function(){
	//make a request to page
	request(url, function(err, res, html){
		if(err){
			throw err;
		}
		//like using jquer serverside
		var $ = cheerio.load(html);

		var movieList = [];

		$('#main').filter(function(){
			var upcomingMovieList = $(this).children().children().find('.list_item');

			for(var i = 0; i < upcomingMovieList.length; i++){
				var movie = upcomingMovieList[i];
				var title = $(movie).find('h4').children().first().text().trim();
				var info = $(movie).find('.cert-runtime-genre');
				var ratings = $(movie).find('.rating_txt');
				var genre = $(info).children().first().next().next().text();
				var genre2 = $(info).children().last().text();
				var runtime = $(info).children().first().next().text();
				var metascore = $(ratings).find('.metascore').children().first().text();

				movieList.push({
					title: title || 'N/A',
					genre: genre || 'N/A',
					genre2: genre2 || 'N/A',
					runtime: runtime || 'N/A',
					metascore: metascore || 'N/A'
				});
			}
			console.log(movieList);
		});
	});
});
