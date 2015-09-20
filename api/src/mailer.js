exports.sendConfirmationEmail = (mailer, event, users) => {
  let eventName = event.get('name');
  users.map((user) => {
    let data = {
      from: 'timeapp.me@gmail.com',
      to: user.get('email'),
      subject: 'Please confirm your availabilities for event ' + eventName,
      html: {
        path: 'confirmation.html'
      },
      context: {
        name: user.get('name'),
        eventName: eventName
      }
    };
    mailer.sendMail(data, () => { console.log('email sent to '+ user.get('email'))});
  });
};
