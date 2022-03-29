'use strict';

const express = require('express');
const basicAuth = require('./middleware/basic-auth');

const router = express.Router();

// Import UsersModel
const UsersModel = require('./user.model');

// Signup Route -- create a new user
// Two ways to test this route with httpie
// echo '{"username":"john","password":"foo"}' | http post :3000/signup
// http post :3000/signup usernmae=john password=foo

router.post('/signup', async (request, response, next) => {

  try {
    const record = await UsersModel.create(request.body);
    response.status(201).json(record);
  } catch (error) {
    error.status = 400;
    error.message = 'Error creating user account';
    next(error);
  }
});

// Signin Route -- login with username and password
// test with httpie
// http post :3000/signin -a john:foo
router.post('/signin', basicAuth, async (request, response, next) => {
  // If basicAuth succeeds, this middleware will execute
  response.status(200).json(request.user);
});

module.exports = router;