import { drawSquare, startDraw, stopDraw, stopDrawingSquare } from "./draw.js";
import { start, stopSound } from "./eightBits.js";
import { startSine, stopSine } from "./sine.js";

const play = document.getElementById("play");
const stopSong = document.getElementById("stop");
const startSongs = [start, startSine];
const stopSongs = [stopSound, stopSine];
const songChoices = document.getElementById("songChoice");
const modal = document.getElementById("welcome-modal");
const span = document.getElementsByClassName("close")[0];
const discoverButton = document.getElementById("discover-button");

let isPlaying = false;
let songChoice = songChoices.value;
let playingSong;

function stopAll() {
  isPlaying = false;
  stopSongs[playingSong]();
  stopDrawingSquare();
}

songChoices.addEventListener("input", () => {
  songChoice = songChoices.value;
});

play.addEventListener("click", () => {
  isPlaying = !isPlaying;
  if (isPlaying) {
    startSongs[songChoice]();
    playingSong = songChoice;
    drawSquare();
  } else {
    stopAll();
  }
});

stopSong.addEventListener("click", () => {
  stopAll();
});

if (!localStorage.getItem("has-seen-modal")) {
  modal.style.display = "block";
}

span.onclick = function () {
  modal.style.display = "none";
  localStorage.setItem("has-seen-modal", true);
};

discoverButton.addEventListener("click", function () {
  modal.style.display = "none";
  localStorage.setItem("has-seen-modal", true);
});
