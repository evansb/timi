import bookshelf from './config/bookshelf';
import Promise from 'bluebird';
import Availability from './models/availability';

Bookshelf.transaction(function (t) {
  return new Library({name: 'Old Books'})
    .save(null, {transacting: t})
    .tap(function (model) {
      return Promise.map([
        {title: 'Canterbury Tales'},
        {title: 'Moby Dick'},
        {title: 'Hamlet'}
      ], function (info) {

        // Some validation could take place here.
        return new Book(info).save({'shelf_id': model.id}, {transacting: t});
      });
    });
}).then(function (library) {
  console.log(library.related('books').pluck('title'));
}).catch(function (err) {
  console.error(err);
});

exports.newEvent = (params) => {
  var timeslots = params['timeslots'],
      participants = params['participants'];
  delete params['timeslots'];
  delete params['participants'];

  Bookshelf.transaction(function (t) {
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
  Bookshelf.transaction(function (t) {
    Availability.forEach((availability) => {
      new Availability(availability, true).save('user_id', user.id, {transacting: t}).then(() => {});
    });
  });
};
