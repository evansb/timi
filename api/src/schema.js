var bookshelf = require('./bookshelf');

bookshelf.knex.schema
    .createTable('users', function (t) {
        t.string('username').primary();
        t.string('password').notNullable();
        t.timestamps();
    })
    .createTable('vendors', function (t) {
        t.increments().primary();
        t.string('name').notNullable();
        t.string('icon');
        t.boolean('is_email').notNullable();
        t.boolean('verifiable').notNullable();
        t.timestamps();
    })
    .createTable('identities', function (t) {
        t.increments().primary();
        t.string('user_username').notNullable().references('users.username').onDelete('cascade').onUpdate('cascade');
        t.integer('vendor_id').unsigned().notNullable().references('vendors.id').onDelete('cascade').onUpdate('cascade');
        t.string('field').notNullable();
        t.boolean('verified');
        t.timestamps();
    })
    .createTable('cards', function (t) {
        t.increments().primary();
        t.string('user_username').notNullable().references('users.username').onDelete('cascade').onUpdate('cascade');
        t.string('name').notNullable();
        t.timestamps();
    })
    .createTable('cards_identities', function (t) {
        t.integer('card_id').unsigned().notNullable().references('cards.id').onDelete('cascade').onUpdate('cascade');
        t.integer('identity_id').unsigned().notNullable().references('identities.id').onDelete('cascade').onUpdate('cascade');
        t.primary(['card_id', 'identity_id']);
        t.timestamps();
    })
    .createTable('groups', function (t) {
        t.increments().primary();
        t.string('name').notNullable();
        t.timestamps();
    })
    .createTable('roles', function (t) {
        t.increments().primary();
        t.string('name').notNullable();
        t.timestamps();
    })
    .createTable('users_groups_roles', function (t) {
        t.string('user_username').notNullable().references('users.username').onDelete('cascade').onUpdate('cascade');
        t.integer('group_id').unsigned().notNullable().references('groups.id').onDelete('cascade').onUpdate('cascade');
        t.integer('role_id').unsigned().notNullable().references('roles.id').onDelete('cascade').onUpdate('cascade');
        t.primary(['user_username', 'group_id', 'role_id']);
        t.timestamps();
    }).
    then(function () {
        console.log('success');
    });