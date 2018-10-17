const express = require('express')
const router = express.Router()
const { check, validationResult } = require('express-validator/check')
const { matchedData } = require('express-validator/filter')
const elasticFunction = require('./elastic')
const getElasticFunction = require('./getElastic')

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
  // initiate the elasticSearch function and pass in
  // client data (Sanitized)
  elasticFunction(data);
})




router.get('/partials/showPosts',
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
    const data = req.body
    const messageArray = {}
    res.render('partials/showPosts', {
      data: req.body,
      errors: errors.mapped(),
      messageArray: messageArray
    }
  )
  // return getElasticFunction(data);
})






function messageGetter(data) {
  return new Promise ((resolve, reject) => {
    getElasticFunction(data)
      .then(res => res.json())
      .then(data => resolve(data))
      .catch(err => reject(err))
  })
}

router.post('/partials/showPosts', [
  check('email')
    .isEmail()
    .withMessage('Nothing Matches this Email.')
    .trim()
    .normalizeEmail()
],(req, res) => {
  const errors = validationResult(req)
  const data = req.body
  const messageArray = {}
  messageArray.value = getElasticFunction(data)
  Promise.all([messageGetter(data)])
    .then(
  // const messageArray = messageArray
  // messageArray.value = getElasticFunction(data)
    res.render('partials/showPosts', {
      data: req.body,   //{message, email}
      errors: errors.mapped(),
      messageArray: messageArray.value
      },
    ))
    .catch(err => res.send("something is terribly wrong"))
})




  // router.get('/partials/extra',
  //   (req, res) => {
  //     const errors = validationResult(req)
  //     // const message = res.body
  //     res.render('partials/extra', {
  //       data: req.body,
  //       errors: errors.mapped()
  //     }
  //   )
  // })










module.exports = router;
