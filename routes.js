const express = require('express')
const router = express.Router()
const { check, validationResult } = require('express-validator/check')
const { matchedData } = require('express-validator/filter')
const elasticFunction = require('./elastic')
const getElasticFunction = require('./getElastic')

// a random wait function used during testing of getElasticFunction
function wait(ms)
{
var d = new Date();
var d2 = null;
do { d2 = new Date(); }
while(d2-d < ms);
}

router.get('/', (req, res) => {
  res.render('index')
})

router.get('/partials/about', (req, res) => {
  res.render('partials/about')
})

router.post('/partials/about', (req, res) => {
  res.render('partials/about')
})

router.get('/partials/contact',
  (req, res) => {
    const errors = validationResult(req)
    res.render('partials/contact', {
      data: req.body,
      errors: errors.mapped()
    }
  )
})

router.post('/partials/contact', [
  check('message')
    .isLength({ min: 1 })
    .withMessage('Message is required')
    .trim(),
  check('email')
    .isEmail()
    .withMessage('That email doesn`t look correct')
    .trim()
    .normalizeEmail()
],(req, res) => {
  const errors = validationResult(req)
  const data = matchedData(req)

  res.render('partials/contact', {
    data: req.body,   //{message, email}
    errors: errors.mapped()
  })
  console.log('Sanitized: ', data);
  elasticFunction(data);
})

router.get('/partials/showPosts',
  (req, res) => {
    const errors = validationResult(req)
    const data = req.body
    res.render('partials/showPosts', {
      data: req.body,
      errors: errors.mapped()
    }
  )
})

router.post('/partials/showPosts', [
  check('email')
    .isEmail()
    .withMessage('Nothing Matches this Email.')
    .trim()
    .normalizeEmail()
],(req, res) => {
  const errors = validationResult(req)
  const myEmail = errors.mapped().email
  var data = req.body
  console.log("here are the errors: ", errors.mapped());
  if (myEmail && errors.mapped().email.msg && errors.mapped().email.msg == 'Nothing Matches this Email.') {
    res.render('partials/showPosts', {
      data: req.body,
      errors: errors.mapped()
    })
  } else {
  getElasticFunction(data,res);
  }
})


module.exports = router;
