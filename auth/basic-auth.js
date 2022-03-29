'use strict';

// This file contains the general-use middleware for authenticating a user

const base64 = require('base-64');

const UsersModel = require('./user-model');

async function basicAuth (request, response, next) {
  /*
    request.headers.authorization is : "Basic sdkjdsljd="
    To get username and password from this, take the following steps:
      - Turn that string into an array by splitting on ' '
      - Pop off the last value
      - Decode that encoded string so it returns to user:pass
      - Split on ':' to turn it into an array
      - Pull username and password from that array
  */
  let basicHeaderParts = request.headers.authorization.split(' ');  // ['Basic', 'sdkjdsljd=']
  let encodedString = basicHeaderParts.pop();  // sdkjdsljd=
  let decodedString = await base64.decode(encodedString); // "username:password"
  let [username, password] = decodedString.split(':'); // username, password

  try {
    let { valid, user } = await UsersModel.authenticateBasic(username, password);
    if (valid) {
      request.user = user;
      next();
    }
    else {
      throw new Error('Invalid User');
    }
  } catch (error) {
    error.status = 403;
    next(error);
  }
} 

module.exports = basicAuth;