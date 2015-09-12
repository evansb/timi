import bookshelf from '../config/bookshelf';
import Timeslot from './timeslot';
import User from './user';

var Event = bookshelf.model('Event', {
  tableName: 'events',
  hidden: ['created_at', 'updated_at'],
  timeslots: function () {
    return this.hasMany('Timeslot', 'event_id');
  },
  result: function () {
    return this.timeslots().query(function(qb) {
      qb.leftJoin('availabilities','availabilities.timeslot_id', 'timeslots.id').
        select('timeslots').
        count('availabilities as available_count').
        groupBy('timeslots.id').
        orderBy('available_count', 'desc');
    });
  },
  owner: function () {
    return this.belongsTo('User', 'owner_id');
  },
  participants: function () {
    return this.belongsToMany('User', 'events_users', 'event_id', 'user_id');
  },
  important_participants: function () {
    return this.participants().where('important', true);
  },
  normal_participants: function () {
    return this.participants().where('important', false);
  },
  participated_participants: function () {
    return this.participants().where('participated', true);
  },
  unparticipated_participants: function () {
    return this.participants().where('participated', false);
  }
});

module.exports = Event;
