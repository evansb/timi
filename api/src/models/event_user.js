import bookshelf from '../config/bookshelf';
import Event from './event';
import User from './user';

var EventUser = bookshelf.Model.extend({
  tableName: 'events_users',
  idAttribute: null,
  event: function() {
    return this.belongsTo(Event, 'event_id');
  },
  user: function() {
    return this.belongsTo(User, 'user_id');
  }
});

module.exports = EventUser;
