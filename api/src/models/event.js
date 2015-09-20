import bookshelf from '../config/bookshelf';
import Timeslot from './timeslot';
import User from './user';

var Event = bookshelf.model('Event', {
  tableName: 'events',
  hidden: ['created_at', 'updated_at'],
  timeslots: function () {
    return this.hasMany('Timeslot', 'event_id');
  },
  getTimeslots: function () {
    return this.timeslots().fetch();
  },
  getTimeslot: function (timeslotId) {
    return this.timeslots().query('where', 'id', '=', timeslotId).fetch();
  },
  getResult: function () {
    return this.timeslots().query(function(qb) {
      qb.leftJoin('availabilities','availabilities.timeslot_id', 'timeslots.id').
        select('timeslots.*').
        count('availabilities as available_count').
        groupBy('timeslots.id').
        orderBy('available_count', 'desc');
    }).fetch();
  },
  owner: function () {
    return this.belongsTo('User', 'owner_id');
  },
  involvedUsers: function () {
    return this.belongsToMany('User', 'events_users', 'event_id', 'user_id');
  },
  participants: function () {
    return this.involvedUsers();
  },
  getParticipants: function () {
    return this.involvedUsers()
               .withPivot(['important', 'participated', 'confirmed']).fetch();
  },
  important_participants: function () {
    return this.participants().query({
      where: {
        important: true
      }
    });
  },
  normal_participants: function () {
    return this.participants().query({
      where: {
        important: false
      }
    });
  },
  confirmed_participants: function () {
    return this.participants().query({
      where: {
        confirmed: true
      }
    });
  },
  unconfirmed_participants: function () {
    return this.participants().query({
      where: {
        confirmed: false
      }
    });
  },
  participated_participants: function () {
    return this.participants().query({
      where: {
        participated: true,
        confirmed: true
      }
    });
  },
  unparticipated_participants: function () {
    return this.participants().query({
      where: {
        participated: false,
        confirmed: true
      }
    });
  }
});

module.exports = Event;
