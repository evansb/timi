import bookshelf from '../config/bookshelf';
import Timeslot from './timeslot';
import User from './user';

var Confirmation = bookshelf.Model.extend({
  tableName: 'confirmations',
  user: function() {
    return this.belongsTo(User, 'user_id');
  },
  timeslot: function() {
    return this.belongsTo(Timeslot, 'timeslot_id');
  }
});

module.exports = Confirmation;
