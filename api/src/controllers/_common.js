exports.permit = (user, eventId) => {
  return user.belongToEvent(eventId)
    .then((result) => {
      if(!result) {
        throw new Error('You are not in this event');
      } else {
        return user;
      }
    });
};
