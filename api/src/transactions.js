import bookshelf from './config/bookshelf';
import validates from './validates';
import Event from '.models/event';
import Timeslot from '.models/timeslot';
import EventUser from '.models/event_user';

exports.newEvent = (params) => {
  var timeslots = params['timeslots'],
      participants = params['participants'];
  delete params['timeslots'];
  delete params['participants'];
  new Event(params, true).save({transacting: t}).then((event) => {
    var eventId =  event.get('id');
    timeslots.forEach((timeslot) => {
      new Timeslot(timeslot, true).save('event_id', eventId, {transacting: t}).then(() => {});
    });
    participants.forEach((participant) => {
      new EventUser({user_id: participant}, true).save('event_id', eventId, {transacting: t}).then(() => {});
    });
  }).catch((err) => {
    console.log(err);
  });
}
