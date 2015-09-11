import bookshelf from '../config/bookshelf';
import Timeslot from './timeslot';
import User from './user';

var Availability = bookshelf.Model.extend({
  tableName: 'availabilities',
  idAttribute: null,
  user: () => {
    return this.belongsTo(User, 'user_id');
  },
  timeslot: () => {
    return this.belongsTo(Timeslot, 'timeslot_id');
  }
});

module.exports = Availability;
