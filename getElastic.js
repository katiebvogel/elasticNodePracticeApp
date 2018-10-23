const http = require('http');
const elasticsearch = require('elasticsearch');
const express = require('express');
const router = express.Router()
const bodyParser = require('body-parser');
const routes = require('./routes');
const validator = require('express-validator');
const { check, validationResult } = require('express-validator/check')

const indexName = 'contact_blog_7'
// elastic search basic functioning in the background
var client = new elasticsearch.Client({
  hosts: ['localhost:9200']
   // hosts: [ 'https://username:password@host:port']
});

function getElasticFunction(data, response) {
  console.log("initiating GET elastic function in other module",
data);
  var email = data.email;
  client.ping({
       requestTimeout: 30000,
   }, function(error) {
      if (error) return error;
      console.log('Everything is ok with elasticsearch');
      client.indices.exists(
        {
        index: indexName
      }, function(err, resp) {
        if(err) return err;
        console.log("This index exists : ",  resp);
        if(resp === true) {
         client.search({
             index: indexName,
             type: 'posts',
             body: {
               query: {
                 match: {
                   "email": email
                 }
               }
             }
         }).then(function (resp) {
          let messageArray = [];
          if (resp && resp.hits && resp.hits.hits.length > 0) {
            console.log("resp.hits.hits", resp.hits.hits);
            var hits = resp.hits.hits;
            for (var i = 0; i < hits.length; i++) {
              let hit = hits[i];
              let message = hit._source.message;
              messageArray.push(message);
          }
        } else {
          messageArray = ["There are no messages for this email address"];
        }
          console.log("message Array: ", messageArray);
          response.render('partials/extra',
            { email: email,
              messageArray: messageArray}
          )
        })
        } else {
          console.log("This index does not yet exist. Response: ", resp);
        }
      }); //end Client Exists function
  });
};

module.exports = getElasticFunction;
