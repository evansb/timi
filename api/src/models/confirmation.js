import bookshelf from '../config/bookshelf';
import Timeslot from './timeslot';
import User from './user';

var Confirmation = bookshelf.Model.extend({
  tableName: 'confirmations',
  user: () => {
    return this.belongsTo(User, 'user_id');
  },
  timeslot: () => {
    return this.belongsTo(Timeslot, 'timeslot_id');
  }
});

module.exports = Confirmation;
