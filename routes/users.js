var express = require('express');
var router = express.Router();
var models = require('../models')
var wrap = require('../wrap')
const { v4: uuid } = require('uuid');
var sanateError = require('../exception/sanateError')

const User = models.sanate_user

router.post('/login', wrap(async function(req, res) {
  const { password, username } = req.body

  if (!password || !username) {
    throw sanateError('MISSING_PARAMS', 400, 'MISSING_PARAMS')    
  }

  const user = await User.validateCredentials(password, username)

  if(!user) {
    throw sanateError('INVALID_CREDENTIALS', 401, 'INVALID_CREDENTIALS')    
  }
  
  return res.send(user)
}));

module.exports = router;
