import bookshelf from '../config/bookshelf';
import Bcrypt from 'bcrypt';
import Promise from 'bluebird';
import EventUser from './event_user';
import Event from './event';

Promise.promisifyAll(Bcrypt);

var User = bookshelf.model('User', {
  tableName: 'users',
  hidden: ['password'],
  trySave: function () {
    return User.where('email', this.get('email'))
      .count()
      .then((count) => {
        if(count > 0) {
          return false;
        } else {
          return Bcrypt.genSaltAsync(5)
            .then((salt) => Bcrypt.hashAsync(this.get('password'), salt))
            .then((password) => this.save('password', password));
        }
      });
  },
  updatePassword: function (newPw) {
    return Bcrypt.genSaltAsync(5)
      .then((salt) => Bcrypt.hashAsync(newPw, salt))
      .then((password) => this.save('password', password, {method: 'update', patch: true}));
  },
  involvedEvents: function () {
    return this.belongsToMany('Event', 'events_users', 'user_id', 'event_id');
  },
  ownEvents: function () {
    return this.hasMany('Event', 'owner_id');
  },
  goingEvents: function (){
    return this.involvedEvents().query({
      where: {
        participated: true
      }
    });
  },
  notGoingEvents: function () {
    return this.involvedEvents().query({
      where: {
        participated: false
      }
    });
  },
  pendingEvents: function () {
    return this.involvedEvents().query({
      where: {
        participated: null
      }
    });
  },
  belongToEvent: function (eventId) {
    return EventUser
      .where({event_id: eventId, user_id: this.get('id')})
      .count()
      .then((count) => parseInt(count) ? this : false);
  },
  timeslots: function () {
    return this.belongsToMany('Timeslot', 'availabilities', 'user_id', 'timeslot_id');
  },
  availableForEvent: function (eventId) {
    return this.timeslots().withPivot(['weight']).query({where: {event_id: eventId}}).fetch();
  },
  going: function(eventId) {
    return EventUser.where({event_id: eventId, user_id: this.get('id')}).save({participated: true}, {method: 'update', patch: true});
  },
  notGoing: function(eventId) {
    return EventUser.where({event_id: eventId, user_id: this.get('id')}).save({participated: false}, {method: 'update', patch: true});
  },
  update: function(params) {
    return this.save(params, {method: 'update', patch: true});
  },
  hasParticipated: function(eventId) {
    return EventUser.where({event_id: eventId, user_id: this.get('id')}).fetch()
      .then((eventUser) => eventUser.get('participated'))
      .then((result) => result !== null);
  }
});

module.exports = User;
