import bookshelf from '../config/bookshelf';

var Timeslot = bookshelf.model('Timeslot', {
  tableName: 'timeslots',
  hidden: ['created_at', 'updated_at'],
  event: function () {
    return this.belongsTo('Event', 'event_id');
  },
  availabilities: function () {
    return this.belongsToMany('User', 'availabilities', 'timeslot_id', 'user_id');
  }
});

module.exports = Timeslot;
