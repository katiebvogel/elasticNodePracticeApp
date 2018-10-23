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

const indexName = 'contact_blog_7'

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
          index: indexName
        }, function(err, resp) {
          if(err) {
            console.log("---> error checking exists: ", err);
          } else {
            console.log("response : ",  resp);
            if(resp === true) {
              console.log("This index exists. Response: ", resp);
               client.index({
                   index: indexName,
                   id: myUUID(),
                   type: 'posts',
                   body: {
                       "message": message,
                       "email": email
                   }
               }, function(err, resp, status) {
                   console.log(resp);
               });
            } else if(resp == false){
              console.log("This index does not yet exist. Response: ", resp);
              // included mapping on creation of index so email matches
              // on search will be for exact keyword
              // before, was matching all *@gmail.com  (unwanted behavior)
              client.indices.create(
               {"index": indexName,
                 "body": {
                   "mappings": {
                     "posts": {
                       "properties": {
                         "message": {
                           "type":  "text"
                         },
                         "email": {
                           "type":  "keyword"
                         }
                       }
                     }
                   }
                 }
               },
              function(err, resp, status) {
                   if (err) {
                       console.log("error creating new index: ", err);
                   } else {
                       console.log("creating new index 'blog':  ", resp);
                        client.index({
                            index: indexName,
                            id: myUUID(),
                            type: 'posts',
                            body: {
                                "message": message,
                                "email": email
                            }
                        }, function(err, resp, status) {
                            console.log("response  ", resp);
                            console.log("status  ", status);
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
