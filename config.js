const dotenv = require('dotenv');
dotenv.config();

const pg = require('pg');

const isProduction = process.env.NODE_ENV === 'production';
const connectionString = `postgres://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_DATABASE}`;

const client = new pg.Client({
    connectionString : isProduction ? process.env.DATABASE_URL : connectionString,
});

module.exports = {client};