const functions = require('firebase-functions');
const {
  dialogflow,
  Suggestions,
} = require('actions-on-google');
const Sentiment = require('sentiment');
const sentiment = new Sentiment();
const fs = require("fs");
const app = dialogflow();

const colorVector = JSON.parse(fs.readFileSync(__dirname + "/sorted.json", "utf8"));
const nearestColors = [];
let pos;


// give nearest
function findNearest(v) {
  var dist = require('vectors/dist')(3)
  let keys = Object.keys(colorVector);
  keys.sort((a, b) => {
    let d1 = dist(v, colorVector[a]);
    let d2 = dist(v, colorVector[b]);
    return d1 - d2;
  });
  nearestColors.length = 0;
  for (let i = 0; i < 7; i++){
    nearestColors.push(keys[i]);
  }
}

app.intent('Default Welcome Intent', conv => {
  conv.ask(
    'Hello, I am your Makeup guru. Tell me your favorite color to start!'
  );
  conv.ask(new Suggestions('lavender pink', 'cloudy blue', 'gross green', 'plum purple', 'dirty orange'));
});

app.intent('Pick Color', (conv, params) => {
  conv.data.favColor = params.xkcd;
  pos = colorVector[conv.data.favColor]
  findNearest(pos);
  console.log(nearestColors);
  const colorSentiment = sentiment.analyze(params.xkcd);
  let firstResponse;
  console.log(colorSentiment);
  if (colorSentiment.score < -1) {
    firstResponse = 'Aw, are you having a horrible day by any chance? Let\'s do exciting makeup to change your mood!';
  } else {
    firstResponse = 'Seems like you are having a good day! More makeup always makes your day better!';
  }
  conv.ask(firstResponse + ` So your favorite color is ${conv.data.favColor}. Would you like to hear my FRESH MAKEUP TUTORIAL: WITH BRAND NEW ` + nearestColors[1].toUpperCase() + ` EYESHADOW!?`);
  conv.ask(new Suggestions('yes', 'no'));
});

app.intent('Pick Color - yes', conv => {
  conv.ask(
    `Great! I’m going to start off the eyeshadow called, ` +
    nearestColors[1].charAt(0).toUpperCase() + nearestColors[1].slice(1) + `.` +
    ` It’s this ` + nearestColors[2] +` shade right here.` +
    ` Do you like using flat or round brush?`
  );
  conv.ask(new Suggestions('flat', 'round', 'soft blending', 'sharp look'));
});

app.intent('Pick Color - flat', conv => {
  conv.ask(
    `Ok, and using a flat brush, I will apply it all over your eyelid area.` +
    ` Are you going to a party or is this a everyday look?`
  );
  conv.ask(new Suggestions('party', 'casual', 'club', 'parents', 'daily'));
});

app.intent('Pick Color - round', conv => {
  conv.ask(
    `And using a round brush, I will apply it all over your eyelid area.` +
    ` Are you going to a party or is this an everyday look?`
  );
  conv.ask(new Suggestions('party', 'casual', 'club', 'parents', 'daily'));
});

app.intent('Pick Color - party', conv => {
  conv.close(
    `How exciting! To give you a bold look, I'm switching to a bigger blending brush.` +
    ` And I’ll use it to blend out the edges of that ` +
    nearestColors[3] + ` shade into the crease and, you know, make it look really nice and seamless.` +
    ` And see how that eyeshadow kind of blended into more of like a ` +
    nearestColors[4] + ` shade? When it’s fading, it looks more ` +
    nearestColors[5] + `, rather than ` + nearestColors[6] + `.` +
    ` It is really nice. It looks like I used many different colors when I just used one single eyeshadow.`
  );
});

app.intent('Pick Color - casual', conv => {
  conv.close(
    `Cool! This will be perfect for your daily look. I’m switching to a smaller blending brush.` +
    ` And I’ll use it to blend out the edges of that ` +
    nearestColors[3] + ` shade into the crease and, you know, make it look really nice and seamless.` +
    ` And see how that eyeshadow kind of blended into more of like a ` +
    nearestColors[4] + ` shade? When it’s fading, it looks more ` +
    nearestColors[5] + `, rather than ` + nearestColors[6] + `.` +
    ` It is really nice. It looks like I used many different colors when I just used one single eyeshadow.`
  );
});


// done
exports.myMakeupGuru2 = functions.https.onRequest(app);
