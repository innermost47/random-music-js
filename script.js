import { startDraw, stopDraw } from "./draw.js";
import { start, stopSound } from "./heightBits.js";
import { startSine, stopSine } from "./sine.js";

const playEightBits = document.getElementById("play");
const stopSong = document.getElementById("stop");
const playSine = document.getElementById("startSine");

let isPlaying = false;

function stopAll() {
  isPlaying = false;
  stopSound();
  stopSine();
  stopDraw();
}

playEightBits.addEventListener("click", () => {
  isPlaying = !isPlaying;
  if (isPlaying) {
    start();
    stopSine();
    startDraw();
  } else {
    stopAll();
  }
});

stopSong.addEventListener("click", () => {
  stopAll();
});

playSine.addEventListener("click", () => {
  isPlaying = !isPlaying;
  if (isPlaying) {
    startSine();
    stopSound();
    startDraw();
  } else {
    stopAll();
  }
});
