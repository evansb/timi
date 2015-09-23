import Joi from 'joi';

var emailSchema = Joi.string().email().required();
var idSchema = Joi.number().integer().positive().required();
var passwordSchema = Joi.string().min(4).required();

var userSchema = Joi.object().keys({
  email: emailSchema,
  password: passwordSchema,
  name: Joi.string().max(30),
  nusmods: Joi.string().max(30)
});

var updateUserSchema = Joi.object().keys({
  email: emailSchema,
  name: Joi.string().max(30),
  nusmods: Joi.string().max(30)
});

var rangeSchema = Joi.object().keys({
  date: Joi.date().format('YYYY-MM-DD').required().min(new Date()),
  start: Joi.string().required(),
  end: Joi.string().required()
});

var participantSchema = Joi.object().keys({
  id: idSchema,
  registered: Joi.boolean().required(),
  important: Joi.boolean().required()
});

var eventSchema = Joi.object().keys({
  name: Joi.string().max(50).required(),
  deadline: Joi.date().min(new Date()),
  duration: Joi.number().integer().positive().required(),
  latitude: Joi.number(),
  longitude: Joi.number(),
  ranges: Joi.array().items(rangeSchema).min(1).unique().required(),
  participants: Joi.array().items(participantSchema).min(1).unique().required()
});

var availabilitySchema = Joi.object().keys({
  timeslot_id: Joi.number().integer().positive().required(),
  weight: Joi.number().integer().positive().required()
});

var availabilitiesSchema = Joi.array().items(availabilitySchema);

var confirmationsSchema = Joi.array().items(idSchema);

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
  payload: eventSchema
};

exports.newAvailabilities = {
  params: {
    eventId: idSchema
  },
  payload: availabilitiesSchema
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

exports.newConfirmations = {
  params: {
    eventId: idSchema
  },
  payload: confirmationsSchema
};
