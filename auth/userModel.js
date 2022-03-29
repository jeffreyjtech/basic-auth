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
  /*
  Now that we finally have username and password, let's see if it's valid
  1. Find the user in the database by username
  2. Compare the plaintext password we now have against the encrypted password in the db
      - bcrypt does this by re-encrypting the plaintext password and comparing THAT
  3. Either we're valid or we throw an error
*/
  let user = await this.findOne({ where: { username } });

  if (user) {
    let valid = await bcrypt.compare(password, user.password);
    return { valid, user };
  }
};

module.exports = {
  UsersModel,
};