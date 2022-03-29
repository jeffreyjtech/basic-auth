'use strict';

// I'm assuming there will only be one user schema and interface, so in this file I will create the model AND the interface class, then export the class.

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { sequelize, DataTypes } = require('../src/database');

const SECRET = process.env.API_SECRET || 'secretfortoken'; // The backup value HAS to match the one assigned in user.test.js

// Create a Sequelize model with beforeCreate hook
const UsersModel = sequelize.define('User', {
  username: { type: DataTypes.STRING, allowNull: false },
  password: { type: DataTypes.STRING, allowNull: false },
  // Virtual data type
  token: {
    type: DataTypes.VIRTUAL,
    get() { // This function runs on read
      return jwt.sign({ username: this.username }, SECRET); // .sign() is the token creation function
    }, 
    set(payload) { // This function runs when we try to set this variable
      return jwt.sign(payload, SECRET);
    }, 
  },
});

UsersModel.beforeCreate(async (user) => {
  let complexity = 5;
  user.password = await bcrypt.hash(user.password, complexity);
});

UsersModel.authenticateBasic = async function (username, password) {

  let user = await this.findOne({ where: { username } }); // Ask our DB if a matching record exists, returns a falsy value if it doesn't
  if (!user) throw new Error; // throw an error if user is falsy.

  let valid = await bcrypt.compare(password, user.password); // Ask bcrypt to validate the request's password against the record's password (hashed)
  if (valid === false) throw new Error; // If it's not valid, throw an error

  return user; // Return a user since that's in our endpoint specs
};

UsersModel.authenticateBearer = async function (token) {
  // We take in the token from the Bearer header
  let payload = jwt.verify(token, SECRET); // Decode and verify it using the SECRET
  let user = await this.findOne({where: {username: payload.username}}); // Then we search our DB for the username encrypted in that payload

  if(!user) throw new Error;

  return user;
};

module.exports = UsersModel;