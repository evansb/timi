import bookshelf from '../config/bookshelf';

var Confirmation = bookshelf.model('Confirmation', {
  tableName: 'confirmations',
  hidden: ['created_at', 'updated_at'],
  user: function () {
    return this.belongsTo('User', 'user_id');
  },
  timeslot: function () {
    return this.belongsTo('Timeslot', 'timeslot_id');
  }
});

module.exports = Confirmation;
