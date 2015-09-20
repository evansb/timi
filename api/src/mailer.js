exports.sendInvitationEmail = (mailer, event, owner, users) => {
  let eventName = event.get('name');
  let ownerName = owner.get('name');

  users.map((user) => {
    let data = {
      from: 'timeapp.me@gmail.com',
      to: user.get('email'),
      subject: ownerName + ' invites you to event ' + eventName,
      html: {
        path: 'invitation.html'
      },
      context: {
        name: user.get('name'),
        onwerName: ownerName,
        eventName: eventName
      }
    };
    mailer.sendMail(data, (err, info) => {
      if(!err) {
        console.log('email sent to '+ user.get('email'))
      } else {
        console.log(err);
      }
    });
  });
};

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
    mailer.sendMail(data, (err, info) => {
      if(!err) {
        console.log('email sent to '+ user.get('email'))
      } else {
        console.log(err);
      }
    });
  });
};
