var knex = require('knex')({
    client: 'postgresql',
    connection: {
        host     : '127.0.0.1',
        user     : 'your db username',
        password : 'your db password',
        database : 'test',
        charset  : 'utf8'
    }
});

module.exports = require('bookshelf')(knex);
