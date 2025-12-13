import { startDraw, stopDraw } from "./draw.js";
import {
  start,
  stopSound,
  timer as eightBitsTimer,
  setPaused as setEightBitsPaused,
} from "./eightBits.js";
import {
  startSine,
  stopSine,
  timer as sineTimer,
  setPaused as setSinePaused,
} from "./sine.js";
import { audioCtx } from "./utils/utils.js";

const play = document.getElementById("play");
const stopSong = document.getElementById("stop");
const startSongs = [start, startSine];
const stopSongs = [stopSound, stopSine];
const songChoices = document.getElementById("songChoice");
const modal = document.getElementById("welcome-modal");
const helpBtn = document.getElementById("help");

let isPlaying = false;
let isPaused = false;
let songChoice = songChoices.value;
let playingSong;

function stopAll() {
  isPlaying = false;
  isPaused = false;
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
  if (!isPlaying) {
    isPlaying = true;
    isPaused = false;
    startSongs[songChoice]();
    playingSong = songChoice;
    startDraw();

    play.classList.add("playing");
    const icon = play.querySelector("i");
    if (icon) {
      icon.className = "bi bi-pause-fill me-2";
    }
  } else {
    isPaused = !isPaused;
    const currentTimer = playingSong === "0" ? eightBitsTimer : sineTimer;
    const setPaused = playingSong === "0" ? setEightBitsPaused : setSinePaused;

    if (isPaused) {
      setPaused(true);
      if (audioCtx && audioCtx.state === "running") {
        audioCtx.suspend();
      }
      if (currentTimer) {
        currentTimer.pause();
      }
      const icon = play.querySelector("i");
      if (icon) {
        icon.className = "bi bi-play-fill me-2";
      }
    } else {
      setPaused(false);
      if (audioCtx && audioCtx.state === "suspended") {
        audioCtx.resume();
      }
      if (currentTimer) {
        currentTimer.resume();
      }
      const icon = play.querySelector("i");
      if (icon) {
        icon.className = "bi bi-pause-fill me-2";
      }
    }
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

helpBtn.addEventListener("click", () => {
  const welcomeModal = new bootstrap.Modal(modal);
  welcomeModal.show();
});
