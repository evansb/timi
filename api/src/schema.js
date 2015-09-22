import bookshelf from './config/bookshelf';

export default function () {
  return bookshelf.knex.schema
    .dropTableIfExists('confirmations')
    .dropTableIfExists('availabilities')
    .dropTableIfExists('events_users')
    .dropTableIfExists('timeslots')
    .dropTableIfExists('events')
    .dropTableIfExists('users')
    .createTable('users', (t) => {
      t.increments().primary();
      t.string('email').unique().notNullable();
      t.string('password').notNullable();
      t.string('name').notNullable();
      t.string('profile_url');
      t.string('NUSMods');
      t.string('google_id');
      t.timestamps();
    })
    .createTable('events',  (t) => {
      t.increments().primary();
      t.string('name').notNullable();
      t.timestamp('deadline');
      t.integer('owner_id').unsigned()
        .notNullable()
        .references('users.id')
        .onDelete('cascade')
        .onUpdate('cascade');
      t.decimal('latitude');
      t.decimal('longitude');
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
    .dropTableIfExists('timeslots')
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
    });
}
