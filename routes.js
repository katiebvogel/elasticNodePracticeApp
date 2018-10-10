const express = require('express')
const router = express.Router()
const { check, validationResult } = require('express-validator/check')
const { matchedData } = require('express-validator/filter')
const elasticFunction = require('./elastic')


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
// [
//   check('message')
//     .isLength({ min: 1 })
//     .withMessage('Message is required'),
//   check('email')
//     .isEmail()
//     .withMessage('That email doesn`t look correct')
//   ],
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
  res.render('partials/contact', {
    data: req.body,   //{message, email}
    errors: errors.mapped()
  })
  const data = matchedData(req)
  console.log('Sanitized: ', data);
  // initiate the elasticSearch function and pass in
  // client data (Sanitized)
  elasticFunction(data);
})






module.exports = router;
