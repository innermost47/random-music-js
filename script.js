import { startDraw, stopDraw } from "./draw.js";
import { start, stopSound } from "./heightBits.js";
import { startSine, stopSine } from "./sine.js";

const play = document.getElementById("play");
const stopSong = document.getElementById("stop");
const startSongs = [start, startSine];
const stopSongs = [stopSound, stopSine];
const songChoices = document.getElementById("songChoice");

let isPlaying = false;
let songChoice = songChoices.value;
let playingSong;

function stopAll() {
  isPlaying = false;
  stopSongs[playingSong]();
  stopDraw();
}

songChoices.addEventListener("input", () => {
  songChoice = songChoices.value;
});

play.addEventListener("click", () => {
  isPlaying = !isPlaying;
  if (isPlaying) {
    startSongs[songChoice]();
    playingSong = songChoice;
    startDraw();
  } else {
    stopAll();
  }
});

stopSong.addEventListener("click", () => {
  stopAll();
});
