import Joi from 'joi';
import User from './models/user';

var emailSchema = Joi.string().email();
var idSchema = Joi.number().integer().positive();

var userSchema = Joi.object().keys({
  email: emailSchema.required(),
  password: Joi.string().regex(/[a-zA-Z0-9]{3,30}/).required(),
  name: Joi.string().alphanum().max(30)
});

var timeslotSchema = Joi.object().keys({
  start: Joi.date().required(),
  end: Joi.date().required()
});

var eventSchema = Joi.object().keys({
  name: Joi.string().max(50).required(),
  deadline: Joi.date().min(new Date()),
  owner_id: Joi.number().integer().positive().required(),
  participants: Joi.array().items(idSchema).min(1).unique().required(),
  timeslots: Joi.array().items(timeslotSchema).min(1).unique().required()
});

var availabilitySchema = Joi.object().keys({
  timeslot_id: Joi.number().integer().positive().required(),
  weight: Joi.number().integer().positive().required()
});

var availabilitiesSchema = Joi.array().items(availabilitySchema);

exports.newUser = (user) => {
  Joi.assert(user, userSchema);
};

exports.newEvent = (event) => {
  Joi.assert(event, eventSchema);
};

exports.userEmail = (email) => {
  Joi.assert(email, emailSchema);
}

exports.userId = (id) => {
  Joi.assert(id, idSchema.required());
}

exports.availabilities = (availabilities) => {
  Joi.assert(availabilities, availabilitiesSchema);
}
