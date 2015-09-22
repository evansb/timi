import bookshelf from './config/bookshelf';
import moment from 'moment';
import Bcrypt from 'bcrypt';
import Promise from 'bluebird';
import _ from 'lodash';

export default async function() {
  let hashPasswords = (users) => {
    return _.map(users, (user) => {
      let salt = Bcrypt.genSaltSync(5);
      user.password = Bcrypt.hashSync(user.password, salt);
      return user;
    });
  };

  let userData = hashPasswords([
    {
      email: "evansb@gmail.com",
      password: "evansebastian",
      name: "Evan Sebastian",
      nusmods: 'http://modsn.us/wzaC7'
    },
    {
      email: "v.sharon.lynn@gmail.com",
      password: "sharonlynn",
      name: "Sharon Lynn",
      nusmods: 'http://modsn.us/racU2'
    },
    {
      email: "patriciawongxiwei@gmail.com",
      password: "patriciawongxiwei",
      name: "Patricia Wong Xi Wei",
      nusmods: "http://modsn.us/srPA6"
    },
    {
      email: "a0133920@u.nus.edu",
      password: "liuyang",
      name: "Liu Yang",
      nusmods: 'http://modsn.us/zDqUG'
    },
    {
      email: "a0126539@u.nus.edu",
      password: "anthony",
      name: "Anthony Chandra",
      nusmods: 'http://modsn.us/7JuvW',
    },
    {
      email: "nathanajah@gmail.com",
      password: "nathanazaria",
      name: "Nathan Azaria",
      nusmods: 'http://modsn.us/zzevJ',
    }
  ]);

  // users
  await bookshelf.knex('users').insert(userData);

  // events
  await bookshelf.knex('events').insert([
    {
      name: "CS3216 Assignment 3 Meeting",
      deadline: moment('2015-09-18').toDate(),
      owner_id: 1,
      latitude: 10.28,
      longitude: 5.00
    },
    {
      name: "Lunch",
      deadline: moment('2015-09-25').toDate(),
      owner_id: 1,
      latitude: 10.28,
      longitude: 5.00
    },
    {
      name: "NUSSU commIT Meeting 4",
      deadline: moment('2015-10-01').toDate(),
      owner_id: 2,
      latitude: 10.28,
      longitude: 5.00
    },
    {
      name: "CS1101S Avengers Meeting",
      deadline: moment('2015-10-15').toDate(),
      owner_id: 1,
      latitude: 14.28,
      longitude: 5.90
    }
  ]);

  // events_users
  await bookshelf.knex('events_users').insert([
    {
      event_id: 1,
      user_id: 1,
      important: true,
      participated: true,
      confirmed: true,
    },
    {
      event_id: 1,
      user_id: 2,
      important: true,
      participated: true,
      confirmed: true,
    },
    {
      event_id: 1,
      user_id: 3,
      important: true,
      participated: true,
      confirmed: true,
    },
    {
      event_id: 1,
      user_id: 4,
      important: true,
      participated: true,
      confirmed: true, //2015-09-22 9.00 am
    },
    {
      event_id: 2,
      user_id: 1,
      important: true,
      participated: true,
      confirmed: false,
    },
    {
      event_id: 2,
      user_id: 2,
      important: true,
      participated: false,
      confirmed: false,
    },
    {
      event_id: 3,
      user_id: 1,
      important: true,
      participated: false,
      confirmed: false,
    },
    {
      event_id: 3,
      user_id: 2,
      important: false,
      participated: false,
      confirmed: false,
    },
    {
      event_id: 3,
      user_id: 5,
      important: false,
      participated: false,
      confirmed: false,
    },
    {
      event_id: 3,
      user_id: 6,
      important: false,
      participated: false,
      confirmed: false,
    },
    { //cmi
      event_id: 4,
      user_id: 1,
      important: false,
      participated: true,
      confirmed: true,
    },
    { //cmi
      event_id: 4,
      user_id: 6,
      important: false,
      participated: true,
      confirmed: true,
    }
  ]);
  // timeslots
  await bookshelf.knex('timeslots').insert([
    {
      event_id: 1,
      start: moment('2015-09-21 09:00').toDate(),
      end: moment('2015-09-21 12:00').toDate(),
    },
    {
      event_id: 1,
      start: moment('2015-09-22 09:00').toDate(),
      end: moment('2015-09-22 12:00').toDate(),
    },
    {
      event_id: 2,
      start: moment('2015-09-27 11:00').toDate(),
      end: moment('2015-09-27 12:00').toDate(),
    },
    {
      event_id: 2,
      start: moment('2015-09-27 12:00').toDate(),
      end: moment('2015-09-27 13:00').toDate(),
    },
    {
      event_id: 2,
      start: moment('2015-09-27 13:00').toDate(),
      end: moment('2015-09-27 14:00').toDate(),
    },
    {
      event_id: 3,
      start: moment('2015-10-11 10:00').toDate(),
      end: moment('2015-10-11 13:00').toDate(),
    },
    {
      event_id: 3,
      start: moment('2015-10-11 11:00').toDate(),
      end: moment('2015-10-11 14:00').toDate(),
    },
    {
      event_id: 3,
      start: moment('2015-10-11 12:00').toDate(),
      end: moment('2015-10-11 15:00').toDate(),
    },
    {
      event_id: 3,
      start: moment('2015-10-11 13:00').toDate(),
      end: moment('2015-10-11 16:00').toDate(),
    },
    {
      event_id: 3,
      start: moment('2015-10-11 14:00').toDate(),
      end: moment('2015-10-11 17:00').toDate(),
    },
    {
      event_id: 3,
      start: moment('2015-10-11 15:00').toDate(),
      end: moment('2015-10-11 18:00').toDate(),
    },
    {
      event_id: 3,
      start: moment('2015-10-11 16:00').toDate(),
      end: moment('2015-10-11 19:00').toDate(),
    },
    {
      event_id: 3,
      start: moment('2015-10-11 17:00').toDate(),
      end: moment('2015-10-11 20:00').toDate(),
    },
    {
      event_id: 3,
      start: moment('2015-10-11 18:00').toDate(),
      end: moment('2015-10-11 21:00').toDate(),
    },
    {
      event_id: 3,
      start: moment('2015-10-11 19:00').toDate(),
      end: moment('2015-10-11 20:00').toDate(),
    },
    {
      event_id: 4,
      start: moment('2015-10-16 17:00').toDate(),
      end: moment('2015-10-16 18:00').toDate(),
    },
    {
      event_id: 4,
      start: moment('2015-10-17 17:00').toDate(),
      end: moment('2015-10-17 18:00').toDate(),
    },
    {
      event_id: 4,
      start: moment('2015-10-18 17:00').toDate(),
      end: moment('2015-10-18 18:00').toDate(),
    },
    {
      event_id: 4,
      start: moment('2015-10-19 17:00').toDate(),
      end: moment('2015-10-19 18:00').toDate(),
    },
    {
      event_id: 4,
      start: moment('2015-10-19 17:00').toDate(),
      end: moment('2015-10-19 18:00').toDate(),
    }
  ]);
  await bookshelf.knex('availabilities').insert([
    // availabilities
    {
      user_id: 1,
      timeslot_id: 2,
      weight: 1,
    },
    {
      user_id: 2,
      timeslot_id: 1,
      weight: 2,
    },
    {
      user_id: 2,
      timeslot_id: 2,
      weight: 1,
    },
    {
      user_id: 3,
      timeslot_id: 1,
      weight: 1,
    },
    {
      user_id: 3,
      timeslot_id: 2,
      weight: 2,
    },
    {
      user_id: 4,
      timeslot_id: 1,
      weight: 1,
    },
    {
      user_id: 4,
      timeslot_id: 2,
      weight: 2,
    },
    {
      user_id: 1,
      timeslot_id: 3,
      weight: 3,
    },
    {
      user_id: 1,
      timeslot_id: 4,
      weight: 2,
    },
    {
      user_id: 1,
      timeslot_id: 5,
      weight: 1,
    }
  ]);
  await bookshelf.knex('confirmations').insert([
    // confirmations
    {
      user_id: 1,
      timeslot_id: 2,
    },
    {
      user_id: 2,
      timeslot_id: 2,
    },
    {
      user_id: 3,
      timeslot_id: 2,
    },
    {
      user_id: 4,
      timeslot_id: 2,
    }
  ]);
  console.log("seeding done");
}
