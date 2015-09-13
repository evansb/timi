import bookshelf from '../config/bookshelf';
import Bcrypt from 'bcrypt';
import Promise from 'bluebird';

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
          return Bcrypt.hashAsync(this.get('password'), 5)
            .then((password) => {
              return this.save('password', password);
            });
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
    return this.involvedEvents()
      .query({where: {id: eventId, owner_id: this.get('id')}})
      .count()
      .then((count) => {
         return (parseInt(count) > 0) ? this : false;
      });
  },
  timeslots: function () {
    return this.belongsToMany('Timeslot', 'availabilities', 'user_id', 'timeslot_id');
  },
  availableForEvent: function (eventId) {
    return this.timeslots().withPivot(['weight']).query({where: {event_id: eventId}}).fetch();
  }
});

/*
User.prototype.create = function (params) {

};
*/

module.exports = User;
