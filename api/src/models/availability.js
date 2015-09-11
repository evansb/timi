import bookshelf from '../config/bookshelf';
import Timeslot from './timeslot';
import User from './user';

var Availability = bookshelf.Model.extend({
  tableName: 'availabilities',
  user: function() {
    return this.belongsTo(User, 'user_id');
  },
  timeslot: function() {
    return this.belongsTo(Timeslot, 'timeslot_id');
  }
});

module.exports = Availability;