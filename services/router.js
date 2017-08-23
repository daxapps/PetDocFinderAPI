const express = require('express');
const bodyParser = require('body-parser');
const passport = require('passport');
const axios = require('axios');

const {Services} = require('./models');

const router = express.Router();

const jsonParser = bodyParser.json();

// Post to add a price for a service
// Use axios instead of router????
// router.post('/services', jsonParser, (req, res) => {
//   console.log('SERVICETEST', req.body.service, req.body.price);
//   Service
//     .create({
//       // _creator:req.params.id, 
//       service:req.body.service, 
//       price:req.body.price
//     })
//     .then(service => res.status(201).json(service.apiRepr()))
//     .catch(err => {
//       console.error(err);
//       res.status(500).json({message: 'Internal server error'});
//       });
// })

// router.get('/', (req, res) => {
// 	console.log('TESTINGROUTE');
// 	res.json({message: 'hello from router'});
// })


// });

// Never expose all your users like below in a prod application
// we're just doing this so we have a quick way to see
// if we're creating users. keep in mind, you can also
// verify this in the Mongo shell.
// router.get('/', (req, res) => {
//   return User
//     .find()
//     .then(users => res.json(users.map(user => user.apiRepr())))
//     .catch(err => res.status(500).json({message: 'Internal server error'}));
// });

module.exports = {router};
