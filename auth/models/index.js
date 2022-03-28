'use strict';

// I'm assuming there will only be one user schema and interface, so in this file I will create the model AND the interface class, then export the class.

const bcrypt = require('bcrypt');
const { Sequelize, DataTypes } = require('sequelize');

// Assign the DB URL conditionally
const DATABASE_URL = process.env.NODE_ENV === 'test' ?
  'sqlite:memory' : // Either to sqlite:memory in testing mode
  process.env.DATABASE_URL || 'postgresql://localhost:5432'; // Or process.env.DATABASE_URL in deployment

const sequelize = new Sequelize(DATABASE_URL);

// Create a Sequelize model
const UsersModel = sequelize.define('User', {
  username: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

UsersModel.authenticateBasic = async function (username, password) {
  let user = await this.findOne({ where: { username } });

  if (user) {
    return await bcrypt.compare(password, user.password);
  } 
};

module.exports = {
  sequelize,
  UsersModel,
};