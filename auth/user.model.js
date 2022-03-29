'use strict';

// I'm assuming there will only be one user schema and interface, so in this file I will create the model AND the interface class, then export the class.

const bcrypt = require('bcrypt');
const { sequelize, DataTypes } = require('../src/database');

// Create a Sequelize model with beforeCreate hook
const UsersModel = sequelize.define('User', {
  username: { type: DataTypes.STRING, allowNull: false },
  password: { type: DataTypes.STRING, allowNull: false },
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

module.exports = UsersModel;