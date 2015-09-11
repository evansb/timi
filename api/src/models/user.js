import bookshelf from '../config/bookshelf';
import Event from './event';

var User = bookshelf.Model.extend({
  tableName: 'users',
  basic_info: () => {
    return {email: this.get('email'), name: this.get('name')};
  },
  own_events: () => {
    return this.hasMany(Event, 'owner_id');
  },
  invited_events: () => {
    this.belongsToMany(Event, 'events_users', 'user_id', 'event_id');
  },
  participated_events: () => {
    this.invited_events.where('participated', true);
  },
  unparticipated_events: () => {
    this.invited_events.where('participated', false);
  }
});

module.exports = User;
