import bookshelf from '../config/bookshelf';
import Timeslot from './timeslot';
import User from './user';

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
