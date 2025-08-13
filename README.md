# Recipes API

This is a very simple Web Server to access a MySQL database to store and retrieve simple recipes.

# Requirements:
- Node version 24
- A MySQL database

# How to make it run locally
- First, you must run the `/sql/create.sql` script inside your MySQL database to generate the desired tables
- Copy the `.env.local` to `.env` with the desired env variables
- Run `npm i` to install the dependencies
- Run `npm run dev` to start the dev server on your local machine

# Future Improvements
- Add more tests (even though we got the API tests)
- Write better documentation for all the APIs