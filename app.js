const http = require('http');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = process.env.PORT || 3000;
const path = require('path');
const layout = require('express-layout');
const routes = require('./routes');
const validator = require('express-validator');
const elastic = require ('./elastic');


app.use(express.static('public'));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

const middlewares = [
  layout(),
  express.static(path.join(__dirname, 'public')),
  bodyParser.json(),
  bodyParser.urlencoded({ extended: true }),
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



app.post('/', function(req, resp) {
  resp.send('name: ', req.query['name']);
});
