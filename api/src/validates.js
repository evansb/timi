import Joi from 'joi';
import User from './models/user';

var user_schema = Joi.object().keys({
  email: Joi.string().email().required(),
  password: Joi.string().regex(/[a-zA-Z0-9]{3,30}/).required(),
  name: Joi.string().alphanum().max(30)
});

var event_schema = Joi.object().keys({
  deadline: Joi.date().min(new Date()),
  owner_id: Joi.number().integer().min(1).required(),
  participants: Joi.array().items(Joi.number().integer().min(1)).min(1).unique()
});

var timeslot_schema = Joi.object().keys({
  event_id: Joi.number().integer().min(1).required(),
  start: Joi.date().required(),
  end: Joi.date().required()
});

exports.new_user = (user) => {
  Joi.attempt(user, user_schema);
};

exports.new_event = (event) => {
  var timeslots = event['timeslots'];
  delete event['timeslots'];
  Joi.attempt(event, event_schema);
  timeslots.forEach(function (timeslot) {
    Joi.attempt(timeslot, timeslot_schema);
  });
};
