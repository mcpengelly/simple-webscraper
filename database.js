var pg = require('pg');
var connectionString = 'postgres://localhost:8080/scrape';

var client = new pg.Client(connectionString);
client.connect();
// query.on('end', () => { client.end(); });
