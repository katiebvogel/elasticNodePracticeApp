var http = require('http');
var elasticsearch = require('elasticsearch');

var server = http.createServer(function(req, res) {
res.writeHead(200);
res.end('Hi everybody!');
});
console.log("server listening on port 8080");
server.listen(8080);


var client = new elasticsearch.Client({
  hosts: ['localhost:9200']
   // hosts: [ 'https://username:password@host:port']
});

client.ping({
     requestTimeout: 30000,
 }, function(error) {
     if (error) {
         console.error('elasticsearch cluster is down!');
     } else {
         console.log('Everything is ok with elasticsearch');
     }
 });

 
