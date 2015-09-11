import bookshelf from '../config/bookshelf';
import Event from './event';
import EventUser from './event_user';
import Timeslot from './timeslot';
import Availability from './availability';

var User = bookshelf.Model.extend({
  tableName: 'users',
  basic_info: function () {
    return {email: this.get('email'), name: this.get('name')};
  },
  ownEvents: function () {
    return this.hasMany(Event, 'owner_id');
  },
  invitedEvents: function () {
    return this.belongsToMany(Event, 'events_users', 'user_id', 'event_id');
  },
  participated_events: () => {
    this.invited_events.where('participated', true);
  },
  unparticipated_events: () => {
    this.invited_events.where('participated', false);
  },
  availableForEvent: function(event) {
    return this.belongsToMany(Timeslot, 'availabilities', 'user_id', 'timeslot_id').withPivot(['weight']).query({where: {event_id: event.get('id')}});
  },
  belongToEvent: function(event) {
    return EventUser.query({where: {event_id: event.get('id'), user_id: this.get('id')}}).count().then((count) => {
      return count > 0;
    });
  }
});

module.exports = User;
