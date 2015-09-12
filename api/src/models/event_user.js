import bookshelf from '../config/bookshelf';
import Event from './event';
import User from './user';

var EventUser = bookshelf.model('EventUser', {
  tableName: 'events_users',
  idAttribute: null,
  hidden: ['created_at', 'updated_at'],
  event: function () {
    return this.belongsTo('Event', 'event_id');
  },
  user: function () {
    return this.belongsTo('User', 'user_id');
  }
});

module.exports = EventUser;
