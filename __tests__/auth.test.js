'use strict';

const supertest = require('supertest');
const { app } = require('../src/app');
const request = supertest(app);

const base64 = require('base-64');

const { sequelize } = require('../src/database');

beforeAll(async () => await sequelize.sync());

afterAll(async () => await sequelize.drop());

describe('Testing API authentication', () => {
  const username = 'Jeffrey';
  const password = 'supersecret';

  test('Testing that we can create a user record', async () => {
    let response = await request.post('/signup').send({
      username,
      password,
    });

    expect(response.status).toBe(201);
    expect(response.body.username).toBe(username);
    expect(response.body.id).toBeTruthy();
  });

  test('Testing that we get if the new user\'s credentials are not provided', async () => {
    let response = await request.post('/signup');

    expect(response.status).toBe(400);
  });

  test('Testing that we can sign in with the new user credentials', async () => {
    const authString = `${username}:${password}`;
    let encodedString = await base64.encode(authString);
    let response = await request.post('/signin').set('authorization', `Basic ${encodedString}`);

    expect(response.status).toBe(200);
    expect(response.body.username).toBe(username);
  });

  test('Testing that we get 403\'d if invalid username is provided', async () => {
    const authString = `potato:patato`;
    let encodedString = await base64.encode(authString);
    let response = await request.post('/signin').set('authorization', `Basic ${encodedString}`);

    expect(response.status).toBe(403);
  });

  test('Testing that we get 403\'d if invalid password is provided', async () => {
    const authString = `${username}:patato`;
    let encodedString = await base64.encode(authString);
    let response = await request.post('/signin').set('authorization', `Basic ${encodedString}`);

    expect(response.status).toBe(403);
  });
});