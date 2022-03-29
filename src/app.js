'use strict';

// 3rd Party Resources
const express = require('express');

// Prepare the express app
const app = express();

// Process JSON input and put the data on req.body
app.use(express.json());

// Process FORM input and put the data on req.body
app.use(express.urlencoded({ extended: true }));

// Import auth mini-app, aka the middleware set
const authRouter = require('../auth/router');

app.use(authRouter);

// General purpose error catcher
app.use((error, request, response, next) => {
  console.error(error);
  response.status(error.status || 500).send(error.message || 'Unknown server error');
});

function start() {
  app.listen(process.env.PORT || 3000, () => console.log('server up'));
}

module.exports = {
  start,
  app,
};
