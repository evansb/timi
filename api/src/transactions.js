import bookshelf from './config/bookshelf';
import Promise from 'bluebird';
import Availability from './models/availability';

exports.newEvent = (params) => {
  var timeslots = params['timeslots'],
      participants = params['participants'];
  delete params['timeslots'];
  delete params['participants'];

  bookshelf.transaction(function (t) {
    new Event(params, true).
      save(null, {transacting: t}).
      then((event) => {
        var eventId = event.get('id');
        timeslots.forEach((timeslot) => {
          new Timeslot(timeslot, true).save('event_id', eventId, {transacting: t}).then(() => {});
        });
        participants.forEach((participant) => {
          new EventUser({user_id: participant}, true).save('event_id', eventId, {transacting: t}).then(() => {});
        });
      });
  });
};

exports.userNewEventAvailabilities = (user, availabilities) => {
  bookshelf.transaction(function (t) {
    Availability.forEach((availability) => {
      new Availability(availability, true).save('user_id', user.id, {transacting: t}).then(() => {});
    });
  });
};
