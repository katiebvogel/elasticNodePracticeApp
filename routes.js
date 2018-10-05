const express = require('express')
const router = express.Router()
const { check, validationResult } = require('express-validator/check')
const { matchedData } = require('express-validator/filter')

router.get('/', (req, res) => {
  res.render('index')
})

router.get('/contact', [
  check('message')
    .isLength({ min: 1 })
    .withMessage('Message is required'),
  check('email')
    .isEmail()
    .withMessage('That email doesn`t look correct')
  ], (req, res) => {
    const errors = validationResult(req)
    res.render('contact', {
      data: req.body,
      errors: errors.mapped()
    })
})

router.post('/contact', [
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
  res.render('contact', {
    data: req.body,   //{message, email}
    errors: errors.mapped()
    // errors: {
    //   message: {
    //     msg: 'A message is required'
    //   },
    //   email: {
    //     msg: 'That email doesn`t look correct'
    //   }
    // }
  })

  const data = matchedData(req)
  console.log('Sanitized: ', data);
})

module.exports = router
