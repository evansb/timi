import bookshelf from '../config/bookshelf';
import Event from './event'

var Timeslot = bookshelf.Model.extend({
  tableName: 'timeslots',
  event: () => {
    return this.belongsTo(Event, 'event_id');
  }
});

module.exports = Timeslot;
