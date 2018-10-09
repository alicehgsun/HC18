// this is a revised version of Codelabs (part 1 and part 2) for building Actions for the Google Assistant

'use strict';

const {
  dialogflow,
  Permission,
  Suggestions,
  BasicCard,
} = require('actions-on-google');

const functions = require('firebase-functions');
const app = dialogflow({debug: true});

app.intent('Default Welcome Intent', (conv) => {
  conv.ask(new Permission({
    context: 'Hello, to get to know you better',
    permissions: 'NAME'
  }));
});

app.intent('actions_intent_PERMISSION', (conv, params, permissionGranted) => {
  if (!permissionGranted) {
    conv.ask(`Ok, no worries. Let's get creative. What's your favorite color?`);
    conv.ask(new Suggestions('Red', 'Blue', 'Green'));
  } else {
    conv.data.userName = conv.user.name.display;
    conv.ask(`Thanks, ${conv.data.userName}. Let's get creative. What's your favorite color?`);
    conv.ask(new Suggestions('Red', 'Blue', 'Green'));
  }
});

const dhmis = {
      image: {
        url: 'http://www.alicehgsun.com/wp-content/uploads/2018/10/dhmis.gif',
        accessibilityText: 'Green is rejected by the Sketchbook, because it is not creative color.',
      },
      display: 'BLACK',
};


app.intent('favorite color', (conv, {color}) => {
    let reply;
    let audioSound;
    if (conv.data.userName){
      if (color == "green") {
        reply = `${conv.data.userName}, green is not a creative color.`;
        audioSound = 'https://actions.google.com/sounds/v1/crowds/voices_angry.ogg';
      } else {
        reply = `${conv.data.userName}, ` + color + ` is a creative color!`;
        audioSound = 'https://actions.google.com/sounds/v1/crowds/battle_crowd_celebrate_stutter.ogg';
      }
    } else {
      if (color == "green") {
        reply = `Green is not a creative color.`;
        audioSound = 'https://actions.google.com/sounds/v1/crowds/voices_angry.ogg';
      } else {
        reply = color.charAt(0).toUpperCase() + color.slice(1) + ` is a creative color!`;
        audioSound = 'https://actions.google.com/sounds/v1/crowds/battle_crowd_celebrate_stutter.ogg';
      }
    }

    conv.close(`<speak>${reply}<audio src="${audioSound}"></audio></speak>`, new BasicCard(dhmis));

});


exports.week4 = functions.https.onRequest(app);
