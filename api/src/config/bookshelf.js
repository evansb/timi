import bookshelf from 'bookshelf';

var knex = require('knex')({
  client: 'postgresql',
  connection: {
    host: '127.0.0.1',
    user: 'liuyang',
    password: 'tainawujia',
    database: 'test',
    charset: 'utf8'
  }
});

module.exports = bookshelf(knex);
