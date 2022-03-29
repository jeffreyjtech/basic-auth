'use strict';

const UsersModel = require('../user.model');

async function bearerAuth(request, response, next) {

  try {
    let bearerHeaderParts = request.headers.authorization.split(' ');
    let token = bearerHeaderParts.pop();

    let validUser = await UsersModel.authenticateBearer(token);

    request.user = validUser;
    next();
  } catch (error) {
    console.error(error);
    next(error);
  }

}

module.exports = bearerAuth;