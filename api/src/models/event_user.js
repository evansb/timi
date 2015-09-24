import bookshelf from '../config/bookshelf';

var EventUser = bookshelf.model('EventUser', {
  tableName: 'events_users',
  idAttribute: null,
  event: function () {
    return this.belongsTo('Event', 'event_id');
  },
  user: function () {
    return this.belongsTo('User', 'user_id');
  }
});

module.exports = EventUser;
