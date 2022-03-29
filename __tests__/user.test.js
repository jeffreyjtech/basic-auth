'use strict';

const UsersModel = require('../auth/user.model');
const { sequelize } = require('../src/database');
const jwt = require('jsonwebtoken');

const SECRET = process.env.API_SECRET || 'secretfortoken'; // The backup value HAS to match the one assigned in user.model.js

beforeAll(async () => await sequelize.sync());

afterAll(async () => await sequelize.drop());

describe('Testing the user model', () => {
  const testUsername = 'Jeffrey';
  const testPassword = 'supersecret';

  test('User should have a decode-able token', async () => {
    const testUser = await UsersModel.create({username: testUsername, password: testPassword});
    const { token } = testUser;
    const validToken = jwt.verify(token, SECRET);

    expect(token).toBeTruthy(); // Our getter works
    expect(validToken).toBeTruthy(); // And the testUser's token can be decoded and verified with the secret
  });
});

