// using voice recognition in snake game example by Prashant Gupta

const SpeechRecognition = webkitSpeechRecognition;

const getSpeech = () => {
  const recognition = new SpeechRecognition();
  recognition.lang = 'en-US';
  recognition.start();
  console.log('---start---');

  recognition.onresult = event => {
    const speechResult = event.results[0][0].transcript;
    console.log('speechResult: ' + speechResult);
    console.log('confidence: ' + event.results[0][0].confidence);
          if (direction != 'right' && speechResult == 'turn left' ) {
            direction = 'left';
          } else if (direction != 'left' && speechResult == 'turn right'){
            direction = 'right';
          } else if (direction != 'down' && speechResult == 'turn up') {
            direction = 'up';
          } else if (direction != 'up' && speechResult == 'turn down') {
            direction = 'down';
          }
          if (speechResult == 'turn left' || speechResult == 'turn right' || speechResult == 'turn up' || speechResult == 'turn down'){
            document.querySelector('#speech').textContent = 'You said the snake to ';
            document.querySelector('#spoken').textContent = speechResult;
            document.querySelector('#spoken').style.color = "#00FF00"
          } else {
            document.querySelector('#speech').textContent = 'The snake does not understand ';
            document.querySelector('#spoken').textContent = speechResult;
            document.querySelector('#spoken').style.color = "#FF0000"
          }
  };
  recognition.onend = () => {
    console.log('---end---');
    recognition.stop();
    getSpeech();
  };
  recognition.onerror = event => {
    console.log('error!!!' + event.error);
  };
};

getSpeech();

var numSegments = 6;
var direction = 'right';

var xStart = 0;
var yStart = 250; 
var diff = 10;

var xCor = [];
var yCor = [];

var xFruit = 0;
var yFruit = 0;

function setup() {

  createCanvas(windowWidth, windowHeight);
  frameRate(15);
  stroke(255);
  strokeWeight(10);
  updateFruitCoordinates();

  for (var i = 0; i < numSegments; i++) {
    xCor.push(xStart + (i * diff));
    yCor.push(yStart);
  }
  // slowing down for speech
  frameRate(4);
}

function draw() {
  background(0);
  for (var i = 0; i < numSegments - 1; i++) {
    line(xCor[i], yCor[i], xCor[i + 1], yCor[i + 1]);
  }
  updateSnakeCoordinates();
  checkGameStatus();
  checkForFruit();
}


function updateSnakeCoordinates() {

  for (var i = 0; i < numSegments - 1; i++) {
    xCor[i] = xCor[i + 1];
    yCor[i] = yCor[i + 1];
  }
  switch (direction) {
    case 'right':
      xCor[numSegments - 1] = xCor[numSegments - 2] + diff;
      yCor[numSegments - 1] = yCor[numSegments - 2];
      break;
    case 'up':
      xCor[numSegments - 1] = xCor[numSegments - 2];
      yCor[numSegments - 1] = yCor[numSegments - 2] - diff;
      break;
    case 'left':
      xCor[numSegments - 1] = xCor[numSegments - 2] - diff;
      yCor[numSegments - 1] = yCor[numSegments - 2];
      break;
    case 'down':
      xCor[numSegments - 1] = xCor[numSegments - 2];
      yCor[numSegments - 1] = yCor[numSegments - 2] + diff;
      break;
  }
}

function checkGameStatus() {
  if (xCor[xCor.length - 1] > width ||
      xCor[xCor.length - 1] < 0 ||
      yCor[yCor.length - 1] > height ||
      yCor[yCor.length - 1] < 0 ||
      checkSnakeCollision()) {
    noLoop();
    document.querySelector('#speech').textContent = 'Game Ended';
    document.querySelector('#spoken').textContent = '';
    document.querySelector('#speech').style.color = "#FFFFFF";
  }
}

function checkSnakeCollision() {
  var snakeHeadX = xCor[xCor.length - 1];
  var snakeHeadY = yCor[yCor.length - 1];
  for (var i = 0; i < xCor.length - 1; i++) {
    if (xCor[i] === snakeHeadX && yCor[i] === snakeHeadY) {
      return true;
    }
  }
}

function checkForFruit() {
  point(xFruit, yFruit);
  if (xCor[xCor.length - 1] === xFruit && yCor[yCor.length - 1] === yFruit) {
    xCor.unshift(xCor[0]);
    yCor.unshift(yCor[0]);
    numSegments++;
    updateFruitCoordinates();
  }
}

function updateFruitCoordinates() {
  xFruit = floor(random(10, (width - 100) / 10)) * 10;
  yFruit = floor(random(10, (height - 100) / 10)) * 10;
}
