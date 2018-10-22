const http = require('http');
const elasticsearch = require('elasticsearch');
const express = require('express');
const router = express.Router()
const bodyParser = require('body-parser');
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
//       message: messageArray
//     })
//   }
//   )
// }



// elastic search basic functioning in the background
var client = new elasticsearch.Client({
  hosts: ['localhost:9200']
   // hosts: [ 'https://username:password@host:port']
});


// var getElasticFunction = function(data, response) {
//   console.log("initiating GET elastic function in other module",
// data);
function getElasticFunction(data, response) {
  console.log("initiating GET elastic function in other module",
data);
  var email = data.email;
  // let messageArray = [];
  // var messageArray = [];

  client.ping({
       requestTimeout: 30000,
   }, function(error) {
       if (error) {
           console.error('elasticsearch cluster is down!');
           return error;
       } else {
           console.log('Everything is ok with elasticsearch');
          client.indices.exists(
            {
            index: 'blog'
          }, function(err, resp) {
            if(err) {
              console.log("---> error checking exists: ", err);
              return err;
            } else {
              console.log("This index exists : ",  resp);
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
                 }
                 // ,
                 // function (err, resp, status) {
                 //   let messageArray = [];
                 //   if(err) {
                 //     console.log("error with matching email: ", err);
                 //     return err;
                 //   }
                 //   else if (resp && resp.hits && resp.hits.hits) {
                 //     var hits = resp.hits.hits;
                 //   } else {
                 //     var hits = ["no messages"];
                 //   }
                 //     for (var i = 0; i < hits.length; i++) {
                 //       let hit = hits[i];
                 //       let message = hit._source.Message;
                 //       messageArray.push(message);
                 //     }
                 //     console.log("Returning message Array: ", messageArray);
                 //     return messageArray;
                 // }
               ).then(          function (resp) {
                                  let messageArray = [];
                                  if (resp && resp.hits && resp.hits.hits) {
                                    var hits = resp.hits.hits;
                                  } else {
                                    var hits = ["no messages"];
                                  }
                                    for (var i = 0; i < hits.length; i++) {
                                      let hit = hits[i];
                                      let message = hit._source.Message;
                                      messageArray.push(message);
                                    }
                                    console.log("Returning message Array: ", messageArray);
                                    response.render('partials/extra', {messageArray: messageArray})

                                })
              } else {
                console.log("This index does not yet exist. Response: ", resp);
              }
            }
          });
        }
      }
    );
};




module.exports = getElasticFunction;
