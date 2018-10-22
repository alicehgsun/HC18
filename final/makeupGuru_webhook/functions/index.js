const functions = require('firebase-functions');
const {dialogflow} = require('actions-on-google');
const Sentiment = require('sentiment');
const sentiment = new Sentiment();
const fs = require("fs");
const shuffle = require('shuffle-array'),collection = [1,2,3,4,5];
const _ = require('lodash');
const app = dialogflow();



let vectors;
let pos;

const colorData = JSON.parse(fs.readFileSync(__dirname + "/sortedColors.json", "utf8"));

app.intent('Default Welcome Intent', conv => {
  conv.ask(
    'Hello, I am a makeup guru. Tell me your favorite color!'
  );
});


app.intent('Pick Color', (conv, params) => {
  conv.data.favColor = params.xkcd;
  const colorSentiment = sentiment.analyze(params.xkcd);
  // console.log(colorSentiment);
  let firstResponse;

  if (colorSentiment.score < -2) {
    firstResponse = 'Aw, are you having a horrible day by any chance? Let do exciting makeup to change your mood!';
  } else if (colorSentiment.score >= -2 && colorSentiment.score < 2) {
    firstResponse = 'Hmm, it seems like you are having a fine day! More makeup always makes your day better!';
  } else {
    firstResponse = 'Seems like you are having the best day! You will need a perfect makeup for your perfect day!';
  }

  console.log(conv.data);
  conv.ask(firstResponse + ` So your favorite color is ${conv.data.favColor}. Would you like to hear my brand new makeup tutorial?`);
  q = colorData.indexOf(`${conv.data.favColor}`);
});


app.intent('Pick Color - yes', conv => {
  conv.ask(
    `So, I’m going to start off the eyeshadow called, ` +
    colorData[q+1] + `.` +
    ` It’s this ` + colorData[q+2] +` shade right here.` +
    ` Do you like using flat or round brush?`
  );
});


app.intent('Pick Color - flat', conv => {
  conv.ask(
    `Ok, and using a flat brush, I will apply it all over your eyelid area.` +
    ` Are you going to a party or is this a everyday look?`
  );
});

app.intent('Pick Color - round', conv => {
  conv.ask(
    `And using a round brush, I will apply it all over your eyelid area.` +
    ` Are you going to a party or is this an everyday look?`
  );
});

app.intent('Pick Color - party', conv => {
  conv.close(
    `Cool! Next, I’m switching to a bigger blending brush.` +
    ` And I’ll use it to blend out the edges of that ` +
    colorData[q-1] + ` shade into the crease and, you know, make it look really nice and seamless.` +
    ` And see how that eyeshadow kind of blended into more of like a ` +
    colorData[q-2] + ` shade? When it’s fading, it looks more ` +
    colorData[q-3] + `, rather than ` + colorData[q+6] + `.` +
    ` It’s really nice. It looks like I used many different colors when I just used one single eyeshadow.`
  );
});


app.intent('Pick Color - casual', conv => {
  conv.close(
    `Cool! Next, I’m switching to a smaller blending brush.` +
    ` And I’ll use it to blend out the edges of that ` +
    colorData[q+3] + ` shade into the crease and, you know, make it look really nice and seamless.` +
    ` And see how that eyeshadow kind of blended into more of like a ` +
    colorData[q+4] + ` shade? When it’s fading, it looks more ` +
    colorData[q+5] + `, rather than ` + colorData[q+6] + `.` +
    ` It’s really nice. It looks like I used many different colors when I just used one single eyeshadow.`
  );
});

exports.myMakeupGuru = functions.https.onRequest(app);
