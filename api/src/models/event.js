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
  result: function () {
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
    return this.involvedUsers().query('where', 'id', '<>', this.get('owner_id'));
  },
  getParticipants: function () {
    return this.participants().withPivot(['important', 'participated', 'confirmed']).fetch();
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
