'use strict';

const supertest = require('supertest');
const { app } = require('../src/app');
const request = supertest(app);

describe('Testing API authentication', () => {
  test('Testing that we can create a user record', () => {
    let response = request.post('/signup').send({
      username: 'Jeffrey',
      password: 'supersecret',
    });

    expect(response.status).toBe(200);
  });
});