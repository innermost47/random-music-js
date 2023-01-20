import { Timer } from "./src/Timer.js";

const timer = new Timer();
const canvas = document.getElementById("canva");
const ctx = canvas.getContext("2d");
const totalSquares = 300;

let angle = 0;
let radius = 0;
let centerX = canvas.width / 2;
let centerY = canvas.height / 2;
let squares = [];
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

function initSquares() {
  for (let i = 0; i < totalSquares; i++) {
    let sides = Math.random() * 100;
    squares[i] = {
      x: Math.random() * (canvas.width * 1.6),
      y: Math.random() * (canvas.height * 1.6),
      direction: Math.random(),
      width: 0,
      height: 0,
      alpha: Math.random(),
      speed: Math.random(),
      rotate: Math.random(),
      canRotate: Math.random() < 0.3,
      speedRotate: Math.random() * 0.01,
      limitSide: sides,
      growthRatio: Math.random() * 0.3,
      color: getRandomColor(),
    };
  }
}

initSquares();

export function drawSquare() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  animationId = requestAnimationFrame(drawSquare);
  for (let i = 0; i < totalSquares; i++) {
    let x = squares[i].x;
    let y = squares[i].y;
    let rotate = squares[i].rotate;
    if (squares[i].direction < 1 / 8) {
      x += squares[i].speed;
      y += squares[i].speed;
      if (x > canvas.width * 2) x = 0 - canvas.width;
      if (y > canvas.height * 2) y = 0 - canvas.height;
    } else if (squares[i].direction < 2 / 8) {
      x -= squares[i].speed;
      y -= squares[i].speed;
      if (x < -canvas.width * 2) x = canvas.width * 2;
      if (y < -squares[i].height * 2) y = canvas.height * 2;
    } else if (squares[i].direction < 3 / 8) {
      x -= squares[i].speed;
      y += squares[i].speed;
      if (x < -canvas.width * 2) x = canvas.width * 2;
      if (y > canvas.height * 2) y = 0 - canvas.height;
    } else if (squares[i].direction < 4 / 8) {
      x += squares[i].speed;
      y -= squares[i].speed;
      if (x > canvas.width * 2) x = 0 - canvas.width;
      if (y < -squares[i].height * 2) y = canvas.height * 2;
    } else if (squares[i].direction < 5 / 8) {
      x += squares[i].speed;
      y = squares[i].y;
      if (x > canvas.width * 2) x = 0 - canvas.width;
    } else if (squares[i].direction < 6 / 8) {
      x = squares[i].x;
      y += squares[i].speed;
      if (y > canvas.height * 2) y = 0 - canvas.height;
    } else if (squares[i].direction < 7 / 8) {
      x -= squares[i].speed;
      y = squares[i].y;
      if (x < -canvas.width * 2) x = canvas.width * 2;
    } else if (squares[i].direction < 8 / 8) {
      x = squares[i].x;
      y -= squares[i].speed;
      if (y < -squares[i].height * 2) y = canvas.height * 2;
    }
    ctx.globalAlpha = 1;
    ctx.fillStyle = squares[i].color;
    ctx.save();
    if (squares[i].canRotate) {
      ctx.translate(x + squares[i].width / 2, y + squares[i].height / 2);
      ctx.rotate(rotate);
      ctx.translate(-x - squares[i].width / 2, -y - squares[i].height / 2);
      squares[i].rotate += squares[i].speedRotate;
    }
    ctx.globalAlpha = squares[i].alpha;
    ctx.fillRect(x, y, squares[i].width, squares[i].height);
    ctx.strokeStyle = "black";
    ctx.lineWidth = 1;
    ctx.strokeRect(x, y, squares[i].width, squares[i].height);
    ctx.restore();
    if (squares[i].width < squares[i].limitSide) {
      squares[i].width += squares[i].growthRatio;
      squares[i].height += squares[i].growthRatio;
    }

    squares[i].x = x;
    squares[i].y = y;
  }
}

export function stopDrawingSquare() {
  cancelAnimationFrame(animationId);
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  initSquares();
}

function toggleFullScreen() {
  if (!document.fullscreenElement) {
    canvas.requestFullscreen();
  } else {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    }
  }
}

canvas.addEventListener("click", toggleFullScreen);
