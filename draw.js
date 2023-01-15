import { Timer } from "./src/Timer.js";

const timer = new Timer();
const canvas = document.getElementById("canva");
const ctx = canvas.getContext("2d");

let angle = 0;
let radius = 0;
let centerX = canvas.width / 2;
let centerY = canvas.height / 2;

function getRandomColor() {
  const r = Math.floor(Math.random() * 256);
  const g = Math.floor(Math.random() * 256);
  const b = Math.floor(Math.random() * 256);
  return "rgb(" + r + ", " + g + ", " + b + ")";
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.strokeStyle = getRandomColor();

  for (let i = 0; i < 100; i++) {
    let x = centerX + Math.random() * radius * Math.cos(angle);
    let y = centerY + Math.random() * radius * Math.sin(angle);
    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.rotate(angle);
    ctx.translate(-centerX, -centerY);
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(centerX, centerY);
    ctx.stroke();
    ctx.restore();
    radius += 2;
    angle += 0.1;
  }
}

export function startDraw() {
  timer._callback = draw;
  timer._timeInterval = 150;
  timer._errorCallback = "error";
  timer.start();
}

export function stopDraw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  timer.stop();
}
