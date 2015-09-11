import Joi from 'joi';
import User from './models/user';

var emailSchema = Joi.string().email();

var userSchema = Joi.object().keys({
  email: emailSchema.required(),
  password: Joi.string().regex(/[a-zA-Z0-9]{3,30}/).required(),
  name: Joi.string().alphanum().max(30)
});

var timeslotSchema = Joi.object().keys({
  event_id: Joi.number().integer().positive().required(),
  start: Joi.date().required(),
  end: Joi.date().required()
}).min(1).unique();

var eventSchema = Joi.object().keys({
  name: Joi.string().max(50),
  deadline: Joi.date().min(new Date()),
  owner_id: Joi.number().integer().positive().required(),
  participants: Joi.array().items(Joi.number().integer().positive()).min(1).unique(),
  timeslots: Joi.array().items(timeslotSchema)
});

var availabilitySchema = Joi.object().keys({
  timeslot_id: Joi.number().integer().positive().required(),
  weight: Joi.number().integer().positive().required()
});

var availabilitiesSchema = Joi.array().items(availabilitySchema);

exports.newUser = (user) => {
  Joi.attempt(user, userSchema);
};

exports.newEvent = (event) => {
  Joi.attempt(event, eventSchema);
};

exports.userEmail = (email) => {
  Joi.attempt(email, emailSchema);
}

exports.userId = (id) => {
  Joi.attempt(id, Joi.number().integer().positive().required());
}

exports.availabilities = (availabilities) => {
  Joi.attempt(availabilities, emailSchema);
}
