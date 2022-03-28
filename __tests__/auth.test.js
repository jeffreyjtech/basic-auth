'use strict';

const supertest = require('supertest');
const { app } = require('../src/app');
const request = supertest(app);
const { sequelize } = require('../auth/models');

beforeAll(() => sequelize.sync());

afterAll(() => sequelize.drop());

describe('Testing API authentication', () => {
  test('Testing that we can create a user record', async () => {
    let response = await request.post('/signup').send({
      username: 'Jeffrey',
      password: 'supersecret',
    });

    expect(response.status).toBe(200);
  });
});