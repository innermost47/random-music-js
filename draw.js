import { Timer } from "./src/Timer.js";

const timer = new Timer();
const canvas = document.getElementById("canva");
const ctx = canvas.getContext("2d");
const totalSquares = 150; // Un peu moins pour la perf

let animationId;
let centerX = canvas.width / 2;
let centerY = canvas.height / 2;
let squares = [];
let stars = [];
let time = 0;

window.addEventListener("resize", resizeCanvas, true);

function getRandomColor() {
  const r = Math.floor(Math.random() * 256);
  const g = Math.floor(Math.random() * 256);
  const b = Math.floor(Math.random() * 256);
  return "rgb(" + r + ", " + g + ", " + b + ")";
}

// Palette psyché
const psychedelicColors = [
  "rgb(255, 0, 150)", // Rose fluo
  "rgb(0, 255, 200)", // Cyan électrique
  "rgb(255, 200, 0)", // Jaune vif
  "rgb(150, 0, 255)", // Violet fluo
  "rgb(0, 255, 100)", // Vert lime
  "rgb(255, 100, 0)", // Orange brûlant
];

function getPsychColor() {
  return psychedelicColors[
    Math.floor(Math.random() * psychedelicColors.length)
  ];
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
  centerX = canvas.width / 2;
  centerY = canvas.height / 2;
}

resizeCanvas();

// Initialisation des étoiles
function initStars() {
  stars = [];
  for (let i = 0; i < 200; i++) {
    stars.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: Math.random() * 2,
      twinkleSpeed: Math.random() * 0.05,
      brightness: Math.random(),
      color: Math.random() > 0.7 ? getPsychColor() : "rgb(255, 255, 255)",
    });
  }
}

// Dessin du ciel étoilé
function drawStars() {
  stars.forEach((star) => {
    star.brightness += star.twinkleSpeed;
    if (star.brightness > 1 || star.brightness < 0) {
      star.twinkleSpeed *= -1;
    }

    ctx.globalAlpha = star.brightness * 0.8;
    ctx.fillStyle = star.color;
    ctx.beginPath();
    ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
    ctx.fill();

    // Petit glow pour les étoiles colorées
    if (star.color !== "rgb(255, 255, 255)") {
      ctx.shadowBlur = 10;
      ctx.shadowColor = star.color;
      ctx.fill();
      ctx.shadowBlur = 0;
    }
  });
  ctx.globalAlpha = 1;
}

// Initialisation des carrés psyché
function initSquares() {
  squares = [];
  for (let i = 0; i < totalSquares; i++) {
    let sides = Math.random() * 60 + 20; // Taille plus contrôlée
    squares[i] = {
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      direction: Math.random(),
      width: 0,
      height: 0,
      alpha: Math.random() * 0.3 + 0.5, // Plus visible
      speed: Math.random() * 0.8 + 0.2,
      rotate: Math.random() * Math.PI * 2,
      canRotate: Math.random() < 0.7, // Plus de rotation
      speedRotate: (Math.random() - 0.5) * 0.03,
      limitSide: sides,
      growthRatio: Math.random() * 0.4 + 0.1,
      color: getPsychColor(),
      pulseSpeed: Math.random() * 0.05,
      pulseOffset: Math.random() * Math.PI * 2,
      trail: Math.random() > 0.5, // Certains laissent une traînée
    };
  }
}

initStars();
initSquares();

export function drawSquare() {
  // Fond noir avec légère transparence pour effet de traînée
  ctx.fillStyle = "rgba(0, 0, 20, 0.15)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Dessiner les étoiles
  drawStars();

  time += 0.02;

  animationId = requestAnimationFrame(drawSquare);

  for (let i = 0; i < totalSquares; i++) {
    let square = squares[i];
    let x = square.x;
    let y = square.y;
    let rotate = square.rotate;

    // Mouvement des carrés (simplifié)
    if (square.direction < 0.25) {
      x += square.speed;
      y += square.speed;
    } else if (square.direction < 0.5) {
      x -= square.speed;
      y -= square.speed;
    } else if (square.direction < 0.75) {
      x -= square.speed;
      y += square.speed;
    } else {
      x += square.speed;
      y -= square.speed;
    }

    // Wrapping aux bords
    if (x > canvas.width + 100) x = -100;
    if (x < -100) x = canvas.width + 100;
    if (y > canvas.height + 100) y = -100;
    if (y < -100) y = canvas.height + 100;

    // Effet de pulsation
    let pulse = Math.sin(time + square.pulseOffset) * 0.3 + 1;
    let currentSize = Math.min(square.width * pulse, square.limitSide * 1.3);

    ctx.save();

    // Rotation
    if (square.canRotate) {
      ctx.translate(x + currentSize / 2, y + currentSize / 2);
      ctx.rotate(rotate);
      ctx.translate(-x - currentSize / 2, -y - currentSize / 2);
      square.rotate += square.speedRotate;
    }

    // Glow psychédélique
    ctx.shadowBlur = 15 + Math.sin(time + i * 0.1) * 10;
    ctx.shadowColor = square.color;

    // Dessin du carré
    ctx.globalAlpha =
      square.alpha * (0.7 + Math.sin(time + square.pulseOffset) * 0.3);
    ctx.fillStyle = square.color;
    ctx.fillRect(x, y, currentSize, currentSize);

    // Bordure qui pulse
    ctx.strokeStyle = "rgba(255, 255, 255, 0.5)";
    ctx.lineWidth = 1 + Math.sin(time * 2 + i * 0.2) * 1;
    ctx.strokeRect(x, y, currentSize, currentSize);

    ctx.restore();

    // Croissance progressive
    if (square.width < square.limitSide) {
      square.width += square.growthRatio;
      square.height += square.growthRatio;
    }

    square.x = x;
    square.y = y;
  }

  ctx.globalAlpha = 1;
  ctx.shadowBlur = 0;
}

export function stopDrawingSquare() {
  cancelAnimationFrame(animationId);
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  initStars();
  initSquares();
  time = 0;
}

export function startDraw() {
  initStars();
  initSquares();
  drawSquare();
}

export function stopDraw() {
  stopDrawingSquare();
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
