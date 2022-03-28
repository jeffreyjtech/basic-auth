'use strict';

const { sequelize } = require('./auth/models');

const { start } = require('./src/app.js');

// make sure our tables are created, start up the HTTP server.
sequelize.sync()
  .then(() => {
    console.log('Sequelize synced with DB');
    start();
  }).catch(e => {
    console.error('Could not start server', e.message);
  });