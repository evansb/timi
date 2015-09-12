import bookshelf from '../config/bookshelf';

bookshelf.knex.schema
  .createTable('users', (t) => {
    t.increments().primary();
    t.string('email').unique().notNullable();
    t.string('password').notNullable();
    t.string('name');
    t.timestamps();
  })
  .createTable('events',  (t) => {
    t.increments().primary();
    t.string('name').notNullable();
    t.timestamp('deadline');
    t.integer('owner_id').unsigned().notNullable().references('users.id').onDelete('cascade').onUpdate('cascade');
    t.timestamps();
  })
  .createTable('events_users', (t) => {
    t.integer('event_id').unsigned().notNullable().references('events.id').onDelete('cascade').onUpdate('cascade');
    t.integer('user_id').unsigned().notNullable().references('users.id').onDelete('cascade').onUpdate('cascade');
    t.boolean('important').notNullable().defaultTo(false);
    t.boolean('participated').notNullable().defaultTo(false);
    t.boolean('confirmed').notNullable().defaultTo(false);
    t.timestamps();

    t.primary(['event_id', 'user_id']);
  })
  .createTable('timeslots', (t) => {
    t.increments().primary();
    t.integer('event_id').unsigned().notNullable().references('events.id').onDelete('cascade').onUpdate('cascade');
    t.timestamp('start').notNullable();
    t.timestamp('end').notNullable();
    t.timestamps();
  })
  .createTable('availabilities', (t) => {
    t.integer('user_id').unsigned().notNullable().references('users.id').onDelete('cascade').onUpdate('cascade');
    t.integer('timeslot_id').unsigned().notNullable().references('timeslots.id').onDelete('cascade').onUpdate('cascade');
    t.integer('weight').unsigned().notNullable();
    t.timestamps();

    t.primary(['user_id', 'timeslot_id']);
  })
  .createTable('confirmations', (t) => {
    t.integer('user_id').unsigned().notNullable().references('users.id').onDelete('cascade').onUpdate('cascade');
    t.integer('timeslot_id').unsigned().notNullable().references('timeslots.id').onDelete('cascade').onUpdate('cascade');
    t.timestamps();

    t.primary(['user_id', 'timeslot_id']);
  })
  .then(function () {
    console.log('success');
  });