import { startDraw, stopDraw } from "./draw.js";
import { start, stopSound } from "./heightBits.js";
import { startSine, stopSine } from "./sine.js";

const play = document.getElementById("play");
const stopSong = document.getElementById("stop");
const songs = [start, startSine];

let isPlaying = false;

function stopAll() {
  isPlaying = false;
  stopSound();
  stopSine();
  stopDraw();
}

play.addEventListener("click", () => {
  isPlaying = !isPlaying;
  if (isPlaying) {
    songs[Math.floor(Math.random() * songs.length)]();
    startDraw();
  } else {
    stopAll();
  }
});

stopSong.addEventListener("click", () => {
  stopAll();
});
