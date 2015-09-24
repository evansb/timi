
let createDetails = () => {
  return { restrict: 'E', templateUrl: __dirname + '/create-details.html' };
};

let createLink = () => {
  return { restrict: 'E', templateUrl: __dirname + '/create-link.html' };
};

let createAvailability = () => {
  return { restrict: 'E', templateUrl: __dirname + '/create-availability.html' };
};

let createParticipants = () => {
  return { restrict: 'E', templateUrl: __dirname + '/create-participants.html' };
};

export default { createDetails, createParticipants, createLink,
  createAvailability };
