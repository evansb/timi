import Joi from 'joi';
import User from './models/user';

var emailSchema = Joi.string().email();
var idSchema = Joi.number().integer().positive().required();

var userSchema = Joi.object().keys({
  email: emailSchema.required(),
  password: Joi.string().regex(/[a-zA-Z0-9]{3,30}/).required(),
  name: Joi.string().alphanum().max(30)
});

var timeslotSchema = Joi.object().keys({
  start: Joi.date().required().min(new Date()),
  end: Joi.date().required().min(Joi.ref('start'))
});

var eventSchema = Joi.object().keys({
  name: Joi.string().max(50).required(),
  deadline: Joi.date().min(new Date()),
  participants: Joi.array().items(idSchema).min(1).unique().required(),
  timeslots: Joi.array().items(timeslotSchema).min(1).unique().required()
});

var availabilitySchema = Joi.object().keys({
  timeslot_id: Joi.number().integer().positive().required(),
  weight: Joi.number().integer().positive().required()
});

var availabilitiesSchema = Joi.array().items(availabilitySchema);

exports.newUser = {
  payload: {
    user: userSchema
  }
};

exports.userInfo = {
  params: {
    userId: idSchema
  }
};

exports.myEventsAvailabilities = {
  params: {
    eventId: idSchema
  }
};

exports.userEventsAvailabilities = {
  params: {
    userId: idSchema,
    eventId: idSchema
  }
};

exports.newEvent = {
  payload: {
    event: eventSchema
  }
};

exports.newAvailabilities = {
  params: {
    eventId: idSchema
  },
  payload: {
    availabilities: availabilitiesSchema
  }
};

exports.eventTimeslots = {
  params: {
    eventId: idSchema
  }
};

exports.eventParticipants = {
  params: {
    eventId: idSchema
  }
};

exports.eventResult = {
  params: {
    eventId: idSchema
  }
};

exports.eventTimeslotAvailabilities = {
  params: {
    eventId: idSchema,
    timeslotId: idSchema
  }
};
