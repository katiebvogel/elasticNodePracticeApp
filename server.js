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
        client.indices.exists(
          {
          index: 'blog'
        }, function(err, resp) {
          if(err) {
            console.log("---> error checking exists: ", err);
          } else {
            console.log("response : ",  resp);
            var stringResponse = resp.toString();
            console.log("----> response to exists : ", stringResponse);
            if(stringResponse == 'true') {
              console.log("This index exists. Response: ", resp);
            } else if(stringResponse == 'false'){
              console.log("This index does not yet exist. Response: ", resp);
               client.indices.create({
                   index: 'blog'
               }, function(err, resp, status) {
                   if (err) {
                       console.log("error creating new index: ", err);
                   } else {
                       console.log("creating new index 'blog':  ", resp);
                   }
               });
            } else {
              console.log("if/else error with boolean logic. Response: ", resp);
            }
          }

        });
      }
    }
);

//
//
//  client.index({
//      index: 'blog',
//      id: '1',
//      type: 'posts',
//      body: {
//          "PostName": "Integrating Elasticsearch Into Your Node.js Application",
//          "PostType": "Tutorial",
//          "PostBody": "This is the text of our tutorial about using Elasticsearch in your Node.js application.",
//      }
//  }, function(err, resp, status) {
//      console.log(resp);
//  });
//
//
//  client.search({
//     index: 'blog',
//     type: 'posts',
//     body: {
//         query: {
//             match: {
//                 "PostName": 'Node.js'
//             }
//         }
//     }
// }).then(function(resp) {
//     console.log(resp);
// }, function(err) {
//     console.trace(err.message);
// });
