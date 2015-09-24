import bookshelf    from '../config/bookshelf';
import Event        from './event';
import Availability from './availability';
import User         from './user';
import Promise      from 'bluebird';

var Timeslot = bookshelf.model('Timeslot', {
  tableName: 'timeslots',
  event: function () {
    return this.belongsTo('Event', 'event_id');
  },
  availabilities: function () {
    return this.belongsToMany('User', 'availabilities', 'timeslot_id', 'user_id').withPivot('weight').fetch();
  },
  availableForUser: function (userId) {
    return Availability.where({user_id: userId, timeslot_id: this.get('id')}).count()
      .then((count) => parseInt(count) ? true : false);
  },
  allImportantAvailable: function () {
    return this.event().fetch()
      .then((event) => event.important_participants().fetch())
      .then((participants) => {
        return Promise.map(participants.toArray(), (participant) => {
          return this.availableForUser(participant.get('id'));
        });
      })
      .then((result) => result.filter((entry)=> !entry).length)
      .then((result) => result === 0);
  }
});

module.exports = Timeslot;
