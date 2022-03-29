'use strict';

const { Sequelize, DataTypes } = require('sequelize');

// Assign the DB URL conditionally. In the local/test environment, we'll use sqlite:memory
const DATABASE_URL = process.env.DATABASE_URL || 'sqlite:memory'; 

// We'll use process.env.DATABASE_URL as a flag for including the Heroku options
// These options will BREAK a locally run server
const herokuOptions = process.env.DATABASE_URL ?
  undefined :
  { 
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
  };

const sequelize = new Sequelize(DATABASE_URL, herokuOptions);  

module.exports = {
  sequelize,
  DataTypes,
};

