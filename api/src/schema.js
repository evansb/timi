import bookshelf from './bookshelf';

bookshelf.knex.schema
  .createTable('users', function (t) {
    t.increments().primary();
    t.string('email').unique().notNullable();
    t.string('name');
    t.timestamps();
  })
  .createTable('polls', function (t) {
    t.increments().primary();
    t.timestamp('deadline');
    t.integer('owner_id').unsigned().notNullable().references('users.id').onDelete('cascade').onUpdate('cascade');
    t.timestamps();
  })
  .createTable('polls_users', function (t) {
    t.integer('poll_id').unsigned().notNullable().references('polls.id').onDelete('cascade').onUpdate('cascade');
    t.integer('user_id').unsigned().notNullable().references('users.id').onDelete('cascade').onUpdate('cascade');
    t.boolean('important').notNullable().defaultTo(false);
    t.boolean('participated').notNullable().defaultTo(false);
    t.boolean('confirmed').notNullable().defaultTo(false);
    t.timestamps();

    t.primary(['poll_id', 'user_id']);
  })
  .createTable('timeslots', function (t) {
    t.increments().primary();
    t.integer('poll_id').unsigned().notNullable().references('polls.id').onDelete('cascade').onUpdate('cascade');
    t.timestamp('start').notNullable();
    t.timestamp('end').notNullable();
    t.timestamps();
  })
  .createTable('availabilities', function (t) {
    t.integer('user_id').unsigned().notNullable().references('users.id').onDelete('cascade').onUpdate('cascade');
    t.integer('timeslot_id').unsigned().notNullable().references('timeslots.id').onDelete('cascade').onUpdate('cascade');
    t.integer('weight').unsigned().notNullable();
    t.timestamps();

    t.primary(['user_id', 'timeslot_id']);
  })
  .createTable('confirmations', function (t) {
    t.integer('user_id').unsigned().notNullable().references('users.id').onDelete('cascade').onUpdate('cascade');
    t.integer('timeslot_id').unsigned().notNullable().references('timeslots.id').onDelete('cascade').onUpdate('cascade');
    t.timestamps();

    t.primary(['user_id', 'timeslot_id']);
  })
  .then(function () {
    console.log('success');
  });
