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


// elastic search basic functioning in the background
var client = new elasticsearch.Client({
  hosts: ['localhost:9200']
   // hosts: [ 'https://username:password@host:port']
});

 var myUUID = function uuidv4() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

var elasticFunction = function(data) {
  console.log("initiating elastic function in other module",
data);
var message = data.message;
var email = data.email;
// myUUID();

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
                   id: myUUID(),
                   type: 'posts',
                   body: {
                       "Message": message,
                       "email": email,
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
                            id: myUUID(),
                            type: 'posts',
                            body: {
                                "Message": message,
                                "email": email,
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
};


module.exports = elasticFunction;
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
