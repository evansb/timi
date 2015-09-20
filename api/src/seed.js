import bookshelf from './config/bookshelf';
import moment from 'moment';
import Promise from 'bluebird';

export default function() {
  return Promise.join(
    // users
    bookshelf.knex('users').insert({
      email: "evansb@gmail.com",
      password: "evansebastian",
      name: "Evan Sebastian"
    }),
    bookshelf.knex('users').insert({
      email: "v.sharon.lynn@gmail.com",
      password: "sharonlynn",
      name: "Sharon Lynn"
    }),
    bookshelf.knex('users').insert({
      email: "patriciawongxiwei@gmail.com",
      password: "patriciawongxiwei",
      name: "Patricia Wong Xi Wei"
    }),
    bookshelf.knex('users').insert({
      email: "a0133920@u.nus.edu",
      password: "liuyang",
      name: "Liu Yang"
    }),
    bookshelf.knex('users').insert({
      email: "nathanajah@gmail.com",
      password: "nathanazaria",
      name: "Nathan Azaria"
    }),
    bookshelf.knex('users').insert({
      email: "a0126539@u.nus.edu",
      password: "anthony",
      name: "Anthony"
    }),

    // events
    bookshelf.knex('events').insert({
      name: "CS3216 Assignment 3 Meeting",
      deadline: moment('2015-09-18').toDate(),
      owner_id: 1,
      location: "COM1 Level 2",
    }),
    bookshelf.knex('events').insert({
      name: "Lunch",
      deadline: moment('2015-09-25').toDate(),
      owner_id: 1,
      location: "PGPR e-Canteen",
    }),
    bookshelf.knex('events').insert({
      name: "NUSSU commIT Meeting 4",
      deadline: moment('2015-10-01').toDate(),
      owner_id: 2,
      location: "YIH NUSSU Sec",
    }),
    bookshelf.knex('events').insert({
      name: "CS1101S Avengers Meeting",
      deadline: moment('2015-10-15').toDate(),
      owner_id: 1,
      location: "COM1-0215",
    }),

    // events_users
    bookshelf.knex('events_users').insert({
      event_id: 1,
      user_id: 1,
      important: true,
      participated: true,
      confirmed: true,
    }),
    bookshelf.knex('events_users').insert({
      event_id: 1,
      user_id: 2,
      important: true,
      participated: true,
      confirmed: true,
    }),
    bookshelf.knex('events_users').insert({
      event_id: 1,
      user_id: 3,
      important: true,
      participated: true,
      confirmed: true,
    }),
    bookshelf.knex('events_users').insert({
      event_id: 1,
      user_id: 4,
      important: true,
      participated: true,
      confirmed: true, //2015-09-22 9.00 am
    }),
    bookshelf.knex('events_users').insert({
      event_id: 2,
      user_id: 1,
      important: true,
      participated: true,
      confirmed: false,
    }),
    bookshelf.knex('events_users').insert({
      event_id: 2,
      user_id: 2,
      important: true,
      participated: false,
      confirmed: false,
    }),
    bookshelf.knex('events_users').insert({
      event_id: 3,
      user_id: 1,
      important: true,
      participated: false,
      confirmed: false,
    }),
    bookshelf.knex('events_users').insert({
      event_id: 3,
      user_id: 2,
      important: false,
      participated: false,
      confirmed: false,
    }),
    bookshelf.knex('events_users').insert({
      event_id: 3,
      user_id: 5,
      important: false,
      participated: false,
      confirmed: false,
    }),
    bookshelf.knex('events_users').insert({
      event_id: 3,
      user_id: 6,
      important: false,
      participated: false,
      confirmed: false,
    }),
    bookshelf.knex('events_users').insert({ //cmi
      event_id: 4,
      user_id: 1,
      important: false,
      participated: true,
      confirmed: true,
    }),
    bookshelf.knex('events_users').insert({ //cmi
      event_id: 4,
      user_id: 6,
      important: false,
      participated: true,
      confirmed: true,
    }),

    // timeslots
    bookshelf.knex('timeslots').insert({
      event_id: 1,
      start: moment('2015-09-21 09:00').toDate(),
      end: moment('2015-09-21 12:00').toDate(),
    }),
    bookshelf.knex('timeslots').insert({
      event_id: 1,
      start: moment('2015-09-22 09:00').toDate(),
      end: moment('2015-09-22 12:00').toDate(),
    }),
    bookshelf.knex('timeslots').insert({
      event_id: 2,
      start: moment('2015-09-27 11:00').toDate(),
      end: moment('2015-09-27 12:00').toDate(),
    }),
    bookshelf.knex('timeslots').insert({
      event_id: 2,
      start: moment('2015-09-27 12:00').toDate(),
      end: moment('2015-09-27 13:00').toDate(),
    }),
    bookshelf.knex('timeslots').insert({
      event_id: 2,
      start: moment('2015-09-27 13:00').toDate(),
      end: moment('2015-09-27 14:00').toDate(),
    }),
    bookshelf.knex('timeslots').insert({
      event_id: 3,
      start: moment('2015-10-11 10:00').toDate(),
      end: moment('2015-10-11 13:00').toDate(),
    }),
    bookshelf.knex('timeslots').insert({
      event_id: 3,
      start: moment('2015-10-11 11:00').toDate(),
      end: moment('2015-10-11 14:00').toDate(),
    }),
    bookshelf.knex('timeslots').insert({
      event_id: 3,
      start: moment('2015-10-11 12:00').toDate(),
      end: moment('2015-10-11 15:00').toDate(),
    }),
    bookshelf.knex('timeslots').insert({
      event_id: 3,
      start: moment('2015-10-11 13:00').toDate(),
      end: moment('2015-10-11 16:00').toDate(),
    }),
    bookshelf.knex('timeslots').insert({
      event_id: 3,
      start: moment('2015-10-11 14:00').toDate(),
      end: moment('2015-10-11 17:00').toDate(),
    }),
    bookshelf.knex('timeslots').insert({
      event_id: 3,
      start: moment('2015-10-11 15:00').toDate(),
      end: moment('2015-10-11 18:00').toDate(),
    }),
    bookshelf.knex('timeslots').insert({
      event_id: 3,
      start: moment('2015-10-11 16:00').toDate(),
      end: moment('2015-10-11 19:00').toDate(),
    }),
    bookshelf.knex('timeslots').insert({
      event_id: 3,
      start: moment('2015-10-11 17:00').toDate(),
      end: moment('2015-10-11 20:00').toDate(),
    }),
    bookshelf.knex('timeslots').insert({
      event_id: 3,
      start: moment('2015-10-11 18:00').toDate(),
      end: moment('2015-10-11 21:00').toDate(),
    }),
    bookshelf.knex('timeslots').insert({
      event_id: 3,
      start: moment('2015-10-11 19:00').toDate(),
      end: moment('2015-10-11 20:00').toDate(),
    }),
    bookshelf.knex('timeslots').insert({
      event_id: 4,
      start: moment('2015-10-16 17:00').toDate(),
      end: moment('2015-10-16 18:00').toDate(),
    }),
    bookshelf.knex('timeslots').insert({
      event_id: 4,
      start: moment('2015-10-17 17:00').toDate(),
      end: moment('2015-10-17 18:00').toDate(),
    }),
    bookshelf.knex('timeslots').insert({
      event_id: 4,
      start: moment('2015-10-18 17:00').toDate(),
      end: moment('2015-10-18 18:00').toDate(),
    }),
    bookshelf.knex('timeslots').insert({
      event_id: 4,
      start: moment('2015-10-19 17:00').toDate(),
      end: moment('2015-10-19 18:00').toDate(),
    }),
    bookshelf.knex('timeslots').insert({
      event_id: 4,
      start: moment('2015-10-19 17:00').toDate(),
      end: moment('2015-10-19 18:00').toDate(),
    }),

    // availabilities
    bookshelf.knex('availabilities').insert({
      user_id: 1,
      timeslot_id: 2,
    }),
    bookshelf.knex('availabilities').insert({
      user_id: 2,
      timeslot_id: 1,
    }),
    bookshelf.knex('availabilities').insert({
      user_id: 2,
      timeslot_id: 2,
    }),
    bookshelf.knex('availabilities').insert({
      user_id: 3,
      timeslot_id: 1,
    }),
    bookshelf.knex('availabilities').insert({
      user_id: 3,
      timeslot_id: 2,
    }),
    bookshelf.knex('availabilities').insert({
      user_id: 4,
      timeslot_id: 1,
    }),
    bookshelf.knex('availabilities').insert({
      user_id: 4,
      timeslot_id: 2,
    }),
    bookshelf.knex('availabilities').insert({
      user_id: 1,
      timeslot_id: 3,
    }),
    bookshelf.knex('availabilities').insert({
      user_id: 1,
      timeslot_id: 4,
    }),
    bookshelf.knex('availabilities').insert({
      user_id: 1,
      timeslot_id: 5,
    }),

    // confirmations
    bookshelf.knex('confirmations').insert({
      user_id: 1,
      timeslot_id: 2,
    }),
    bookshelf.knex('confirmations').insert({
      user_id: 2,
      timeslot_id: 2,
    }),
    bookshelf.knex('confirmations').insert({
      user_id: 3,
      timeslot_id: 2,
    }),
    bookshelf.knex('confirmations').insert({
      user_id: 4,
      timeslot_id: 2,
    })).catch(console.log).then(() => {
      bookshelf.knex.select().from('users').then(console.log);
    });
}
