<!--  This is a template repo -->
# my project

An Express server that implements Basic Authentication, with signup and signin capabilities, using a Postgres database for storage.

<!-- Insert links to deploy(s) here -->
[Deployed API](https://jjtech-basic-auth.herokuapp.com/)

<!-- Insert UML diagram here -->
![UML Diagram](./assets/lab-6-uml.jpg)

## Installation

1. Clone from this repo `git clone <GIT URL>`
2. `cd` into `<REPO NAME>`
3. Run `npm install`
4. Optionally, create an .env file with variable `PORT` to assign your preferred port number. The default `PORT` is `3000`.

## Usage

After installation, run `npm start`.

## Contributors / Authors

- Jeffrey Jenkins

## Features / Routes

### Routes

#### `/signin`

- POST : `/signup` : Creates a user account
  - Request body
    - Requires a JSON body with username and password properties
      - `{ username: <your-username>, password: <your-password> }`
  - Response
    - status `201`, and a JSON body with the newly created user record.
    - status `400` if user account could not be created.

#### `/signin`

- POST : `/signin` : Logs into a user account
  - Headers
    - Requires a header with base-64 encoded username and password.
      - `<username>:<password>` -> encode in base-64 -> `Basic <encodedAuthString>`
  - Response
    - status `200`, and a JSON body with the signed-in user record
    - status `403` if either the username or password are invalid.

