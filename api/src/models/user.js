import bookshelf from '../config/bookshelf';
import Event from './event';

var User = bookshelf.Model.extend({
  tableName: 'users',
  basic_info: function() {
    return {email: this.get('email'), name: this.get('name')};
  },
  own_events: function() {
    return this.hasMany(Event, 'owner_id');
  },
  invited_events: function() {
    this.belongsToMany(Event, 'events_users', 'user_id', 'event_id');
  },
  participated_events: function() {
    this.invited_events.where('participated', true);
  },
  unparticipated_events: function() {
    this.invited_events.where('participated', false);
  }
});

module.exports = User;
