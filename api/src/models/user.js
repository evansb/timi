import bookshelf from '../config/bookshelf';
import Bcrypt from 'bcrypt';
import Promise from 'bluebird';
import EventUser from './event_user';

Promise.promisifyAll(Bcrypt);

var User = bookshelf.model('User', {
  tableName: 'users',
  hidden: ['password', 'created_at', 'updated_at'],
  trySave: function () {
    return User.where('email', this.get('email'))
      .count()
      .then((count) => {
        if(count > 0) {
          throw new Error('User with this email exists.');
        } else {
          Bcrypt.genSaltAsync(5)
            .then((salt) => Bcrypt.hashAsync(this.get('password'), salt))
            .then((password) => this.save('password', password));
        }
      });
  },
  involvedEvents: function () {
    return this.belongsToMany('Event', 'events_users', 'user_id', 'event_id');
  },
  ownEvents: function () {
    return this.hasMany('Event', 'owner_id').fetch();
  },
  invitedEvents: function () {
    return this.involvedEvents().query((qb) => {
      qb.where('owner_id', '<>', this.get('id'));
    }).fetch();
  },
  participated_events: function (){
    this.invited_events.where('participated', true);
  },
  unparticipated_events: function () {
    this.invited_events.where('participated', false);
  },
  belongToEvent: function (eventId) {
    return EventUser
      .query({where: {event_id: eventId, user_id: this.get('id')}})
      .count()
      .then((count) => {
        return parseInt(count) ? this : false;
      });
  },
  timeslots: function () {
    return this.belongsToMany('Timeslot', 'availabilities', 'user_id', 'timeslot_id');
  },
  availableForEvent: function (eventId) {
    return this.timeslots().withPivot(['weight']).query({where: {event_id: eventId}}).fetch();
  }
});

module.exports = User;
