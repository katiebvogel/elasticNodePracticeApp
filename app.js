const http = require('http');
const elasticsearch = require('elasticsearch');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = process.env.PORT || 3000;
const path = require('path');
const layout = require('express-layout');
const routes = require('./routes');
const validator = require('express-validator');

app.use(express.static('public'));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

const middlewares = [
  layout(),
  express.static(path.join(__dirname, 'public')),
  bodyParser.urlencoded(),
  validator()

]

app.use(middlewares)

app.use('/', routes)

app.use((req, res, next) => {
  res.status(404).send("Sorry can't find that!")
})

app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).send('Something broke!')
})


// app.use('/scripts',
//   express.static(`${__dirname}/node_modules/`));

app.listen(port, () => {
  console.log('listening on %d', port);
});

// app.post('/', function(req, resp) {
//   resp.send('name: ', req.query['name']);
// });


// elastic search basic functioning in the background
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
            // var stringResponse = resp.toString();
            // console.log("----> response to exists : ", stringResponse);
            if(resp === true) {
              console.log("This index exists. Response: ", resp);

               client.index({
                   index: 'blog',
                   id: '1',
                   type: 'posts',
                   body: {
                       "PostName": "Integrating Elasticsearch Into Your Node.js Application",
                       "PostType": "Tutorial",
                       "PostBody": "This is the text of our tutorial about using Elasticsearch in your Node.js application.",
                   }
               }, function(err, resp, status) {
                   console.log(resp);
               });
            } else if(resp == false){
              console.log("This index does not yet exist. Response: ", resp);
               client.indices.create({
                   index: 'blog'
               }, function(err, resp, status) {
                   if (err) {
                       console.log("error creating new index: ", err);
                   } else {
                       console.log("creating new index 'blog':  ", resp);

                        client.index({
                            index: 'blog',
                            id: '1',
                            type: 'posts',
                            body: {
                                "PostName": "Integrating Elasticsearch Into Your Node.js Application",
                                "PostType": "Tutorial",
                                "PostBody": "This is the text of our tutorial about using Elasticsearch in your Node.js application.",
                            }
                        }, function(err, resp, status) {
                            console.log(resp);
                        });
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
