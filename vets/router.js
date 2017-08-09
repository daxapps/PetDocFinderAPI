const express = require('express');
const bodyParser = require('body-parser');
const passport = require('passport');

const {Vet, Services} = require('./models');

const router = express.Router();

const jsonParser = bodyParser.json();

// Post to add a price for a service
router.post('/dashboard', jsonParser, (req, res) => {
  
  
      res.status(500).json({code: 500, message: 'Internal server error'});
    });
});

// Never expose all your users like below in a prod application
// we're just doing this so we have a quick way to see
// if we're creating users. keep in mind, you can also
// verify this in the Mongo shell.
router.get('/', (req, res) => {
  return User
    .find()
    .then(users => res.json(users.map(user => user.apiRepr())))
    .catch(err => res.status(500).json({message: 'Internal server error'}));
});

module.exports = {router};
