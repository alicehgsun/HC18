console.log("hello from script");
const synth = window.speechSynthesis;

document.querySelector("#button").onclick = () => {
  console.log("button clicked");
  let textInput = document.querySelector("#text-input").value;
  let utterThis = new SpeechSynthesisUtterance(textInput);
  let utterNothing = new SpeechSynthesisUtterance("There is no input");
  let words = textInput.split(" ");

  if (words.length >= 5) {
    document.getElementById("display").style.backgroundColor = "red";
    utterThis.rate = 2;
    synth.speak(utterThis);
  } else if (words[0] == "") {
    utterNothing.rate = 0.5;
    synth.speak(utterNothing);
    document.getElementById("display").style.backgroundColor = "white";
  } else {
    document.getElementById("display").style.backgroundColor = "blue";
    utterThis.rate = 1;
    synth.speak(utterThis);
  }
  document.getElementById("display").innerHTML = textInput;
};
