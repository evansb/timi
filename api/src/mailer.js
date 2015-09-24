exports.sendInvitationEmail = (mailer, event, owner, users) => {
  let eventName = event.get('name');
  let ownerName = owner.get('name');
  let ownerId = owner.get('id');

  users.map((user) => {
    let data = {
      from: 'timiapp.me@gmail.com',
      to: user.get('email'),
      subject: ownerName + ' invites you to event ' + eventName,
      html: {
        path: '../email/invitation.html'
      },
      context: {
        name: user.get('name'),
        onwerName: ownerName,
        eventName: eventName
      }
    };
    if(user.get('id') !== ownerId) {
      mailer.sendMail(data, (err) => {
        if(!err) {
          console.log('email sent to '+ user.get('email'))
        } else {
          console.log(err);
        }
      });
    }
  });
};

exports.sendConfirmationEmail = (mailer, event, users) => {
  let eventName = event.get('name');
  users.map((user) => {
    let data = {
      from: 'timiapp.me@gmail.com',
      to: user.get('email'),
      subject: 'Please confirm your availabilities for event ' + eventName,
      html: {
        path: '../email/confirmation.html'
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

exports.sendScheduleEmail = (mailer, event, users) => {
  let eventName = event.get('name');
  users.map((user) => {
    let data = {
      from: 'timiapp.me@gmail.com',
      to: user.get('email'),
      subject: 'The event ' + eventName + ' has been scheduled',
      html: {
        path: '../email/schedule.html'
      },
      context: {
        name: user.get('name'),
        eventName: eventName,
        eventId: event.get('id')
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
