'use strict';

const base64 = require('base-64');

const express = require('express');

const router = express.Router();

// Import UsersModel
const { UsersModel } = require('./userModel');

// Signup Route -- create a new user
// Two ways to test this route with httpie
// echo '{"username":"john","password":"foo"}' | http post :3000/signup
// http post :3000/signup usernmae=john password=foo

router.post('/signup', async (req, res) => {

  try {
    console.log(req.body);
    const record = await UsersModel.create(req.body);
    res.status(200).json(record);
  } catch (error) {
    console.error(error.message);
    res.status(403).send('Invalid Login');
  }
});

// Signin Route -- login with username and password
// test with httpie
// http post :3000/signin -a john:foo
router.post('/signin', async (req, res) => {

  /*
    req.headers.authorization is : "Basic sdkjdsljd="
    To get username and password from this, take the following steps:
      - Turn that string into an array by splitting on ' '
      - Pop off the last value
      - Decode that encoded string so it returns to user:pass
      - Split on ':' to turn it into an array
      - Pull username and password from that array
  */

  let basicHeaderParts = req.headers.authorization.split(' ');  // ['Basic', 'sdkjdsljd=']
  let encodedString = basicHeaderParts.pop();  // sdkjdsljd=
  let decodedString = base64.decode(encodedString); // "username:password"
  let [username, password] = decodedString.split(':'); // username, password

  try {
    let { valid, user } = UsersModel.authenticateBasic(username, password);
    if (valid) {
      res.status(200).json(user);
    }
    else {
      throw new Error('Invalid User');
    }
  } catch (error) {
    console.error(error.message);
    res.status(403).send('Invalid Login');
  }

});

module.exports = router;