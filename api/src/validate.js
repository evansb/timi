import Joi from 'joi';

var emailSchema = Joi.string().email().required();
var idSchema = Joi.number().integer().positive();
var passwordSchema = Joi.string().alphanum().min(8).max(30).required();
var nameSchema = Joi.string().alphanum().max(30);

var userSchema = Joi.object().keys({
  email: emailSchema,
  password: passwordSchema,
  name: nameSchema,
  nusmods: Joi.string().uri().max(25)
});

var updateUserSchema = Joi.object().keys({
  email: emailSchema,
  name: nameSchema,
  nusmods: Joi.string().uri().max(25)
});

var rangeSchema = Joi.object().keys({
  date: Joi.date().required().min(new Date()),
  start: Joi.string().required(),
  end: Joi.string().required()
});

var participantSchema = Joi.object().keys({
  id: idSchema.required(),
  registered: Joi.boolean().required(),
  important: Joi.boolean().required()
});

var eventSchema = Joi.object().keys({
  name: nameSchema.required(),
  deadline: Joi.date().min(new Date()),
  duration: Joi.number().integer().positive().required().multiple(60000).min(600000).max(86400000),
  location: Joi.string().alphanum().max(50),
  latitude: Joi.number().min(-90).max(90),
  longitude: Joi.number().min(-180).max(180),
  ranges: Joi.array().items(rangeSchema).min(1).max(10).unique().required(),
  participants: Joi.array().items(participantSchema).min(1).unique().required()
});

var availabilitySchema = Joi.object().keys({
  timeslot_id: idSchema.required(),
  weight: Joi.number().integer().positive().required()
});

var availabilitiesSchema = Joi.array().items(availabilitySchema);

exports.userLogin = {
  payload: {
    email: emailSchema,
    password: passwordSchema
  }
};

exports.newUser = {
  payload: userSchema
};

exports.updateUser = {
  payload: updateUserSchema
};

exports.resetPassword = {
  payload: passwordSchema
};

exports.userInfo = {
  params: {
    userId: idSchema.required()
  }
};

exports.eventInfo = {
  params: {
    eventId: idSchema.required()
  }
};

exports.myEventsAvailabilities = {
  params: {
    eventId: idSchema.required()
  }
};

exports.userEventsAvailabilities = {
  params: {
    userId: idSchema.required(),
    eventId: idSchema.required()
  }
};

exports.newEvent = {
  payload: eventSchema
};

exports.newAvailabilities = {
  params: {
    eventId: idSchema.required()
  },
  payload: availabilitiesSchema
};

exports.eventTimeslots = {
  params: {
    eventId: idSchema.required()
  }
};

exports.eventParticipants = {
  params: {
    eventId: idSchema.required()
  }
};

exports.eventResult = {
  params: {
    eventId: idSchema.required()
  }
};

exports.eventTimeslotAvailabilities = {
  params: {
    eventId: idSchema.required(),
    timeslotId: idSchema.required()
  }
};
