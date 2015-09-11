import bookshelf from '../config/bookshelf';
import Timeslot from './timeslot';
import User from './user';

var Event = bookshelf.Model.extend({
  tableName: 'events',
  timeslots: function() {
    return this.hasMany(Timeslot, 'event_id');
  },
  owner: function() {
    return this.belongsTo(User, 'owner_id');
  },
  participants: function() {
    return this.belongsToMany(User, 'events_users', 'event_id', 'user_id');
  },
  important_participants: function() {
    return this.participants().where('important', true);
  },
  normal_participants: function() {
    return this.participants().where('important', false);
  },
  participated_participants: function() {
    return this.participants().where('participated', true);
  },
  unparticipated_participants: function() {
    return this.participants().where('participated', false);
  }
});

module.exports = Event;
