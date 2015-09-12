import bookshelf from '../config/bookshelf';
import Timeslot from './timeslot';
import User from './user';

var Event = bookshelf.Model.extend({
  tableName: 'events',
  timeslots: function () {
    return this.hasMany(Timeslot, 'event_id');
  },
  result: function () {
    return this.hasMany(Timeslot, 'event_id').query(function(qb) {
      qb.leftJoin('availabilities','availabilities.timeslot_id', 'timeslots.id').
        select('timeslots').
        count('availabilities as available_count').
        groupBy('timeslots.id').
        orderBy('available_count', 'desc');
    });
  },
  owner: () => {
    return this.belongsTo(User, 'owner_id');
  },
  participants: () => {
    return this.belongsToMany(User, 'events_users', 'event_id', 'user_id');
  },
  important_participants: () => {
    return this.participants().where('important', true);
  },
  normal_participants: () => {
    return this.participants().where('important', false);
  },
  participated_participants: () => {
    return this.participants().where('participated', true);
  },
  unparticipated_participants: () => {
    return this.participants().where('participated', false);
  }
});

module.exports = Event;
