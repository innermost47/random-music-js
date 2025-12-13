import { startDraw, stopDraw } from "./draw.js";
import { start, stopSound } from "./eightBits.js";
import { startSine, stopSine } from "./sine.js";

const play = document.getElementById("play");
const stopSong = document.getElementById("stop");
const startSongs = [start, startSine];
const stopSongs = [stopSound, stopSine];
const songChoices = document.getElementById("songChoice");
const modal = document.getElementById("welcome-modal");

let isPlaying = false;
let songChoice = songChoices.value;
let playingSong;

function stopAll() {
  isPlaying = false;
  stopSongs[playingSong]();
  stopDraw();

  play.classList.remove("playing");
  const icon = play.querySelector("i");
  if (icon) {
    icon.className = "bi bi-play-fill me-2";
  }
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

    play.classList.add("playing");
    const icon = play.querySelector("i");
    if (icon) {
      icon.className = "bi bi-pause-fill me-2";
    }
  } else {
    stopAll();
  }
});

stopSong.addEventListener("click", () => {
  stopAll();
});

if (!localStorage.getItem("has-seen-modal")) {
  setTimeout(() => {
    const welcomeModal = new bootstrap.Modal(modal);
    welcomeModal.show();

    modal.addEventListener("hidden.bs.modal", () => {
      localStorage.setItem("has-seen-modal", true);
    });
  }, 100);
}
