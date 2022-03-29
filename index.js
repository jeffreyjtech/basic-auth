'use strict';

const { sequelize } = require('./auth/user.model');

const { start } = require('./src/app.js');

// make sure our tables are created, start up the HTTP server.
sequelize.sync()
  .then(() => {
    console.log('Sequelize synced with DB');
    start();
  }).catch(error => {
    console.error('Could not start server:', error.message || 'unknown start error');
  });