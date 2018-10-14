const http = require('http');
const elasticsearch = require('elasticsearch');
const express = require('express');
const router = express.Router()
const bodyParser = require('body-parser');
// const app = express();
// const port = process.env.PORT || 3000;
// const path = require('path');
// const layout = require('express-layout');
const routes = require('./routes');
const validator = require('express-validator');


// function renderPosts(messageArray) {
//   console.log("renderPosts is being called: ", messageArray);
//   for (var i = 0; i < messageArray.length; i++) {
//     messageArray[i]
//   }
//   router.get('/partials/extra',
//   (req, res) => {
//     console.log("here is the request in renderPosts: ", req);
//     res.render('partials/showPosts', {
//       message: req.body.mapped()
//     })
//   }
//   )
// }



// elastic search basic functioning in the background
var client = new elasticsearch.Client({
  hosts: ['localhost:9200']
   // hosts: [ 'https://username:password@host:port']
});


var getElasticFunction = function(data) {
  console.log("initiating GET elastic function in other module",
data);

var email = data.email;

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
            if(resp === true) {
              console.log("This index exists. Response: ", resp);
               client.search({
                   index: 'blog',
                   type: 'posts',
                   body: {
                     query: {
                       match: {
                         "email": email
                       }
                     }
                   }
               }, function(err, resp, status) {
                   var hits = resp.hits.hits;
                   var messageArray = [];
                   for (var i = 0; i < hits.length; i++) {
                     let hit = hits[i];
                     let message = hit._source.Message;
                     // console.log("my Message # ", i, "  -> ", message);
                     messageArray.push(message);
                   }
                   console.log("message ARray: ", messageArray);
                   // renderPosts(messageArray);
                   return messageArray;
               });
            } else if(resp == false){
              console.log("This index does not yet exist. Response: ", resp);
            } else {
              console.log("if/else error with boolean logic. Response: ", resp);
            }
          }

        });
      }
    }
  );
};


module.exports = getElasticFunction;
