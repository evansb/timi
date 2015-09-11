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
  new Event(params, true).save().then((event) => {
    var eventId =  event.get('id');
    timeslots.forEach(function(timeslot) {
      new Timeslot(timeslot, true).save('event_id', eventId).then(function(){});
    });
    participants.forEach(function(participant) {
      new EventUser({user_id: participant}, true).save('event_id', eventId).then(function(){});
    });
  }).catch(function(err){
    console.log(err);
  });
}
