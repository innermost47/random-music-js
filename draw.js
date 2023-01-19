import { Timer } from "./src/Timer.js";

const timer = new Timer();
const canvas = document.getElementById("canva");
const ctx = canvas.getContext("2d");
const totalSquares = 120;

let angle = 0;
let radius = 0;
let centerX = canvas.width / 2;
let centerY = canvas.height / 2;
let timeDrawing = Math.random() * 3000;
let positions = [];
let speed = 1;
let colors = [];
let animationId;

window.addEventListener("resize", resizeCanvas, true);

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

function resizeCanvas() {
  if (window.innerWidth < 768) {
    canvas.width = (window.innerWidth * 90) / 100;
  } else if (window.innerWidth > 768 && window.innerWidth < 1200) {
    canvas.width = (window.innerWidth * 75) / 100;
  } else if (window.innerWidth > 1200) {
    canvas.width = 1200;
  }
  canvas.height = (window.innerHeight * 83) / 100;
  controls.style.top = `${canvas.offsetHeight + 100}px`;
}

resizeCanvas();

function initPositions() {
  for (let i = 0; i < totalSquares; i++) {
    let sides = Math.random() * 200;
    let width = sides;
    let height = sides;

    positions[i] = {
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      direction: Math.random(),
      width: width,
      height: height,
      alpha: Math.random(),
      speed: Math.random() * 0.5,
      rotate: Math.random(),
      canRotate: Math.random() < 0.3,
      speedRotate: Math.random() * 0.01,
    };

    colors[i] = getRandomColor();
  }
}

initPositions();

export function drawSquare() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  animationId = requestAnimationFrame(drawSquare);
  for (let i = 0; i < totalSquares; i++) {
    let x = positions[i].x;
    let y = positions[i].y;
    let rotate = positions[i].rotate;
    if (positions[i].direction < 1 / 8) {
      x += positions[i].speed;
      y += positions[i].speed;
      if (x > canvas.width * 2) x = 0 - canvas.width;
      if (y > canvas.height * 2) y = 0 - canvas.height;
    } else if (positions[i].direction < 2 / 8) {
      x -= positions[i].speed;
      y -= positions[i].speed;
      if (x < -canvas.width * 2) x = canvas.width * 2;
      if (y < -positions[i].height * 2) y = canvas.height * 2;
    } else if (positions[i].direction < 3 / 8) {
      x -= positions[i].speed;
      y += positions[i].speed;
      if (x < -canvas.width * 2) x = canvas.width * 2;
      if (y > canvas.height * 2) y = 0 - canvas.height;
    } else if (positions[i].direction < 4 / 8) {
      x += positions[i].speed;
      y -= positions[i].speed;
      if (x > canvas.width * 2) x = 0 - canvas.width;
      if (y < -positions[i].height * 2) y = canvas.height * 2;
    } else if (positions[i].direction < 5 / 8) {
      x += positions[i].speed;
      y = positions[i].y;
      if (x > canvas.width * 2) x = 0 - canvas.width;
    } else if (positions[i].direction < 6 / 8) {
      x = positions[i].x;
      y += positions[i].speed;
      if (y > canvas.height * 2) y = 0 - canvas.height;
    } else if (positions[i].direction < 7 / 8) {
      x -= positions[i].speed;
      y = positions[i].y;
      if (x < -canvas.width * 2) x = canvas.width * 2;
    } else if (positions[i].direction < 8 / 8) {
      x = positions[i].x;
      y -= positions[i].speed;
      if (y < -positions[i].height * 2) y = canvas.height * 2;
    }
    ctx.globalAlpha = 1;
    ctx.fillStyle = colors[i];
    ctx.save();
    if (positions[i].canRotate) {
      ctx.translate(x + positions[i].width / 2, y + positions[i].height / 2);
      ctx.rotate(rotate);
      ctx.translate(-x - positions[i].width / 2, -y - positions[i].height / 2);
      positions[i].rotate += positions[i].speedRotate;
    }
    ctx.globalAlpha = positions[i].alpha;
    ctx.fillRect(x, y, positions[i].width, positions[i].height);
    ctx.strokeStyle = "black";
    ctx.lineWidth = 1;
    ctx.strokeRect(x, y, positions[i].width, positions[i].height);
    ctx.restore();
    positions[i].x = x;
    positions[i].y = y;
  }
}

export function stopDrawingSquare() {
  cancelAnimationFrame(animationId);
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  initPositions();
}
