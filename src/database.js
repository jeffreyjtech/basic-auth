'use strict';

const { Sequelize, DataTypes } = require('sequelize');

// Assign the DB URL conditionally
const DATABASE_URL = process.env.NODE_ENV === 'test' ?
  'sqlite:memory' : // Either to sqlite:memory in testing mode
  process.env.DATABASE_URL || 'postgresql://localhost:5432'; // Or process.env.DATABASE_URL in deployment

const sequelize = new Sequelize(DATABASE_URL);

module.exports = {
  sequelize,
  DataTypes,
};

