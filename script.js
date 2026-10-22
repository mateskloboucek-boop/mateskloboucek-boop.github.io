const interestContent = {
  it: {
    symbol: "</>",
    index: "01",
    kicker: "ZVĚDAVOST / TECHNOLOGIE",
    title: "IT Student & Kodér",
    text: "IT znamená informační technologie: obor, který spojuje počítače, programy, sítě a práci s daty. IT student se učí, jak tyhle věci fungují, jak řešit technické problémy a jak vytvářet vlastní projekty — třeba web nebo aplikaci. „Kodér“ je člověk, který píše instrukce, díky nimž počítač udělá, co potřebujeme.",
    tags: ["Programování", "Tvorba webů", "Objevování"]
  },
  football: {
    symbol: "⚽",
    index: "02",
    kicker: "TÝMOVOST / FOTBAL",
    title: "Fotbalista",
    text: "Fotbal kombinuje práci celého týmu s momenty, kdy jeden hráč rozhodne zápas. Tady jsou čtyři výrazné osobnosti, každý se svým stylem a příběhem.",
    teams: [
      ["Lionel Messi · Inter Miami", "Argentinský mistr světa proslulý přesnou levačkou, driblinkem a přihrávkami. Dlouhá léta zářil v Barceloně."],
      ["Cristiano Ronaldo · Al-Nassr", "Portugalský útočník známý rychlostí, výskokem a góly. Patří k nejlepším střelcům fotbalové historie."],
      ["Michael Olise · Bayern Mnichov", "Francouzský ofenzivní hráč, který vyniká technikou, tvořivostí a přesnými přihrávkami."],
      ["Lamine Yamal · FC Barcelona", "Mladý španělský křídelník, který soupeře překvapuje odvážným driblinkem a rychlostí."]
    ]
  },
  games: {
    symbol: "✳",
    index: "03",
    kicker: "HRAVOST / HRY",
    title: "Hry & E-sport",
    text: "Hry jsou skvělý způsob, jak potrénovat postřeh i trpělivost. Vyber si jednu z miniher níže a vyzkoušej si ji přímo na webu.",
    tags: ["Ping-pong proti počítači", "Závodní auta", "Zábava"]
  }
};

const interestTabs = document.querySelectorAll(".interest-card");
const detailPanel = document.getElementById("interest-detail");

function showInterest(name) {
  const content = interestContent[name];
  if (!content) return;

  interestTabs.forEach((tab) => {
    const active = tab.dataset.interest === name;
    tab.classList.toggle("is-active", active);
    tab.setAttribute("aria-selected", String(active));
  });

  detailPanel.setAttribute("aria-labelledby", `tab-${name}`);
  document.getElementById("detail-symbol").textContent = content.symbol;
  document.getElementById("detail-index").textContent = content.index;
  document.getElementById("detail-kicker").textContent = content.kicker;
  document.getElementById("detail-title").textContent = content.title;
  document.getElementById("detail-text").textContent = content.text;

  const tags = document.getElementById("detail-tags");
  tags.replaceChildren();
  if (content.teams) {
    const teamGrid = document.createElement("div");
    teamGrid.className = "team-grid";
    content.teams.forEach(([team, description]) => {
      const note = document.createElement("div");
      note.className = "team-note";
      const name = document.createElement("strong");
      name.textContent = team;
      const details = document.createElement("span");
      details.textContent = description;
      note.append(name, details);
      teamGrid.append(note);
    });
    tags.append(teamGrid);
  } else {
    content.tags.forEach((label) => {
      const tag = document.createElement("span");
      tag.textContent = label;
      tags.append(tag);
    });
  }

  if (name === "games") {
    document.getElementById("games").scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

interestTabs.forEach((tab) => {
  tab.addEventListener("click", () => showInterest(tab.dataset.interest));
});

const menuToggle = document.getElementById("menu-toggle");
const navigation = document.getElementById("navigation");
menuToggle.addEventListener("click", () => {
  const isOpen = navigation.classList.toggle("is-open");
  menuToggle.setAttribute("aria-expanded", String(isOpen));
  menuToggle.setAttribute("aria-label", isOpen ? "Zavřít navigaci" : "Otevřít navigaci");
});
navigation.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    navigation.classList.remove("is-open");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Otevřít navigaci");
  });
});

const canvas = document.getElementById("game-canvas");
const context = canvas.getContext("2d");
const gameLabel = document.getElementById("game-label");
const gameTitle = document.getElementById("game-title");
const gameScore = document.getElementById("game-score");
const gameInstructions = document.getElementById("game-instructions");
const gameStart = document.getElementById("game-start");
const canvasMessage = document.getElementById("canvas-message");
const gameChoices = document.querySelectorAll(".game-choice");
const difficultyControl = document.getElementById("ai-difficulty-control");
const difficultySelect = document.getElementById("ai-difficulty");
const difficultySpeeds = { easy: 0.55, normal: 0.83, hard: 1.12 };
const raceDifficultySpeeds = {
  easy: [0.39, 0.42, 0.45],
  normal: [0.48, 0.51, 0.54],
  hard: [0.58, 0.62, 0.66]
};
const raceHud = document.getElementById("race-hud");
const racePositionDisplay = document.getElementById("race-position");
const raceTimeDisplay = document.getElementById("race-time");
const raceLapDisplay = document.getElementById("race-lap");
const raceSpeedDisplay = document.getElementById("race-speed");
const gamePanel = document.getElementById("game-panel");
const keysPressed = new Set();
const gameWidth = canvas.width;
const gameHeight = canvas.height;
const raceLaps = 3;
const trackWidth = 112;
const trackControls = [
  { x: 320, y: 86 },
  { x: 590, y: 86 },
  { x: 657, y: 102 },
  { x: 675, y: 148 },
  { x: 651, y: 180 },
  { x: 602, y: 178 },
  { x: 653, y: 214 },
  { x: 673, y: 269 },
  { x: 640, y: 315 },
  { x: 575, y: 333 },
  { x: 215, y: 333 },
  { x: 150, y: 315 },
  { x: 128, y: 273 },
  { x: 147, y: 236 },
  { x: 186, y: 215 },
  { x: 144, y: 185 },
  { x: 126, y: 142 },
  { x: 151, y: 103 },
  { x: 212, y: 86 }
];
const trackPoints = createTrackPoints(trackControls, 16);
const trackPointCount = trackPoints.length;
let selectedGame = "pong";
let gameRunning = false;
let animationFrame = 0;
let previousFrame = 0;
let playerScore = 0;
let computerScore = 0;
let pongPlayerY = 168;
let pongComputerY = 168;
let pongBall = { x: 400, y: 210, vx: 4, vy: 2 };
let raceCar = { x: 0, y: 0, angle: 0, speed: 0, progress: 0 };
let opponents = [];
let raceElapsed = 0;
let raceFinished = false;
let raceFinishPosition = 1;

function createTrackPoints(controls, stepsPerTurn) {
  const points = [];
  for (let index = 0; index < controls.length; index++) {
    const p0 = controls[(index - 1 + controls.length) % controls.length];
    const p1 = controls[index];
    const p2 = controls[(index + 1) % controls.length];
    const p3 = controls[(index + 2) % controls.length];
    for (let step = 0; step < stepsPerTurn; step++) {
      const t = step / stepsPerTurn;
      const t2 = t * t;
      const t3 = t2 * t;
      points.push({
        x: 0.5 * ((2 * p1.x) + (-p0.x + p2.x) * t + (2 * p0.x - 5 * p1.x + 4 * p2.x - p3.x) * t2 + (-p0.x + 3 * p1.x - 3 * p2.x + p3.x) * t3),
        y: 0.5 * ((2 * p1.y) + (-p0.y + p2.y) * t + (2 * p0.y - 5 * p1.y + 4 * p2.y - p3.y) * t2 + (-p0.y + 3 * p1.y - 3 * p2.y + p3.y) * t3)
      });
    }
  }
  return points;
}

function getTrackPoint(progress) {
  const wrapped = ((progress % trackPointCount) + trackPointCount) % trackPointCount;
  const index = Math.floor(wrapped);
  const next = (index + 1) % trackPointCount;
  const blend = wrapped - index;
  return {
    x: trackPoints[index].x + (trackPoints[next].x - trackPoints[index].x) * blend,
    y: trackPoints[index].y + (trackPoints[next].y - trackPoints[index].y) * blend
  };
}

function getTrackTangent(progress) {
  const before = getTrackPoint(progress - 1);
  const after = getTrackPoint(progress + 1);
  return Math.atan2(after.y - before.y, after.x - before.x);
}

function getNearestTrackProgress(x, y, currentProgress) {
  const base = Math.floor(currentProgress);
  let nearestProgress = currentProgress;
  let nearestDistance = Infinity;
  for (let offset = -18; offset <= 30; offset++) {
    const progress = base + offset;
    const point = getTrackPoint(progress);
    const distance = (point.x - x) ** 2 + (point.y - y) ** 2;
    if (distance < nearestDistance) {
      nearestDistance = distance;
      nearestProgress = progress;
    }
  }
  return { progress: nearestProgress, distance: Math.sqrt(nearestDistance) };
}

function setGame(name) {
  if (name === selectedGame) return;
  stopGame();
  selectedGame = name;
  gameChoices.forEach((choice) => {
    const active = choice.dataset.game === name;
    choice.classList.toggle("is-active", active);
    choice.setAttribute("aria-selected", String(active));
  });
  playerScore = 0;
  computerScore = 0;
  gameScore.innerHTML = name === "pong" ? '0 <span>:</span> 0' : "0 m";
  difficultyControl.hidden = false;
  raceHud.hidden = name !== "race";
  gamePanel.classList.toggle("is-racing", name === "race");
  if (name === "pong") {
    gameLabel.textContent = "MINIHRA / PING-PONG";
    gameTitle.textContent = "Poraz počítač!";
    gameInstructions.innerHTML = 'Pohyb pálky: <kbd>W</kbd> nahoru a <kbd>S</kbd> dolů. První k 5 bodům vyhrává.';
    canvas.setAttribute("aria-label", "Herní plocha; ping-pong se ovládá klávesami W a S");
    gameScore.innerHTML = '0 <span>:</span> 0';
  } else {
    gameLabel.textContent = "MINIHRA / ZÁVODNÍ AUTA";
    gameTitle.textContent = "Závod na 3 kola";
    gameInstructions.innerHTML = 'Ty řídíš svoje auto: drž <kbd>W</kbd> pro jízdu, <kbd>S</kbd> pro brzdu a <kbd>A</kbd>/<kbd>D</kbd> pro zatáčení. <kbd>S</kbd> při zastavení zařadí zpátečku.';
    canvas.setAttribute("aria-label", "Závodní hra; auto se ovládá klávesami W, A, S a D");
    gameScore.textContent = "0 km/h";
    racePositionDisplay.textContent = "1. / 4";
    raceTimeDisplay.textContent = "00:00.0";
    raceLapDisplay.textContent = "1 / 3";
  }
  canvasMessage.textContent = name === "pong" ? 'Klikni na „Začít hru“ a připrav se.' : 'Tvé auto ovládáš celé ty: plyn, brzdu i zatáčení. Zmáčkni W a vyraz!';
  canvasMessage.classList.remove("is-hidden");
  drawCurrentGame();
}

gameChoices.forEach((choice) => {
  choice.addEventListener("click", () => setGame(choice.dataset.game));
});

function stopGame() {
  gameRunning = false;
  cancelAnimationFrame(animationFrame);
}

function startGame() {
  stopGame();
  keysPressed.clear();
  previousFrame = 0;
  gameRunning = true;
  canvasMessage.classList.add("is-hidden");
  gameStart.textContent = "Začít znovu →";
  if (selectedGame === "pong") {
    playerScore = 0;
    computerScore = 0;
    pongPlayerY = 168;
    pongComputerY = 168;
    serveBall(Math.random() < 0.5 ? -1 : 1);
    updatePongScore();
  } else {
    const startPoint = getTrackPosition(1, 30);
    raceCar = {
      x: startPoint.x,
      y: startPoint.y,
      angle: startPoint.angle,
      speed: 0,
      progress: 1
    };
    const opponentSpeeds = raceDifficultySpeeds[difficultySelect.value];
    opponents = [
      { name: "BLUE", color: "#58c7ff", lane: -34, progress: -8, speed: opponentSpeeds[0], finishTime: null },
      { name: "PINK", color: "#ff7194", lane: -12, progress: -4, speed: opponentSpeeds[1], finishTime: null },
      { name: "GOLD", color: "#ffc65c", lane: 12, progress: -6, speed: opponentSpeeds[2], finishTime: null }
    ];
    raceElapsed = 0;
    raceFinished = false;
    raceFinishPosition = 1;
    raceTimeDisplay.textContent = "00:00.0";
    raceLapDisplay.textContent = "1 / 3";
    raceSpeedDisplay.textContent = "0 km/h";
    racePositionDisplay.textContent = "1. / 4";
  }
  animationFrame = requestAnimationFrame(gameLoop);
}

function serveBall(direction) {
  pongBall = { x: gameWidth / 2, y: gameHeight / 2, vx: direction * 4.2, vy: (Math.random() - 0.5) * 3.5 };
}

function updatePongScore() {
  gameScore.innerHTML = `${playerScore} <span>:</span> ${computerScore}`;
}

gameStart.addEventListener("click", startGame);

difficultySelect.addEventListener("change", () => {
  if (selectedGame !== "race" || !gameRunning) return;
  raceDifficultySpeeds[difficultySelect.value].forEach((speed, index) => {
    if (opponents[index]) opponents[index].speed = speed;
  });
});

window.addEventListener("keydown", (event) => {
  const key = event.key.toLowerCase();
  if (!["w", "a", "s", "d"].includes(key)) return;
  if (!gameRunning) return;
  event.preventDefault();
  keysPressed.add(key);
});

window.addEventListener("keyup", (event) => keysPressed.delete(event.key.toLowerCase()));
window.addEventListener("blur", () => keysPressed.clear());

canvas.addEventListener("pointermove", (event) => {
  if (!gameRunning || selectedGame !== "pong") return;
  const bounds = canvas.getBoundingClientRect();
  pongPlayerY = (event.clientY - bounds.top) * gameHeight / bounds.height - 42;
  pongPlayerY = Math.max(0, Math.min(gameHeight - 84, pongPlayerY));
});

function gameLoop(timestamp) {
  if (!gameRunning) return;
  const delta = previousFrame ? Math.min((timestamp - previousFrame) / 16.67, 2) : 1;
  previousFrame = timestamp;
  if (selectedGame === "pong") updatePong(delta);
  else updateRace(delta);
  drawCurrentGame();
  if (gameRunning) animationFrame = requestAnimationFrame(gameLoop);
}

function updatePong(delta) {
  if (keysPressed.has("w")) pongPlayerY -= 5.2 * delta;
  if (keysPressed.has("s")) pongPlayerY += 5.2 * delta;
  pongPlayerY = Math.max(0, Math.min(gameHeight - 84, pongPlayerY));

  const computerCenter = pongComputerY + 42;
  const computerTarget = pongBall.y - 42;
  const computerSpeed = 3.2 * difficultySpeeds[difficultySelect.value];
  pongComputerY += Math.max(-computerSpeed * delta, Math.min(computerSpeed * delta, computerTarget - computerCenter));
  pongComputerY = Math.max(0, Math.min(gameHeight - 84, pongComputerY));

  pongBall.x += pongBall.vx * delta;
  pongBall.y += pongBall.vy * delta;
  if (pongBall.y < 10 || pongBall.y > gameHeight - 10) pongBall.vy *= -1;
  if (pongBall.vx < 0 && pongBall.x < 65 && pongBall.x > 48 && pongBall.y > pongPlayerY - 9 && pongBall.y < pongPlayerY + 93) {
    pongBall.vx = Math.abs(pongBall.vx) * 1.04;
    pongBall.vy += ((pongBall.y - (pongPlayerY + 42)) / 42) * 1.5;
  }
  if (pongBall.vx > 0 && pongBall.x > gameWidth - 65 && pongBall.x < gameWidth - 48 && pongBall.y > pongComputerY - 9 && pongBall.y < pongComputerY + 93) {
    pongBall.vx = -Math.abs(pongBall.vx) * 1.04;
    pongBall.vy += ((pongBall.y - (pongComputerY + 42)) / 42) * 1.2;
  }

  if (pongBall.x < 0) {
    computerScore++;
    updatePongScore();
    if (computerScore >= 5) finishGame("Počítač vyhrál. Zkusíš odvetu?");
    else serveBall(1);
  } else if (pongBall.x > gameWidth) {
    playerScore++;
    updatePongScore();
    if (playerScore >= 5) finishGame("Vyhrál jsi! Skvělá hra.");
    else serveBall(-1);
  }
}

function drawPong() {
  context.fillStyle = "#152018";
  context.fillRect(0, 0, gameWidth, gameHeight);
  context.strokeStyle = "#d9ecc030";
  context.setLineDash([9, 10]);
  context.lineWidth = 3;
  context.beginPath();
  context.moveTo(gameWidth / 2, 0);
  context.lineTo(gameWidth / 2, gameHeight);
  context.stroke();
  context.setLineDash([]);
  context.strokeStyle = "#d9ecc030";
  context.beginPath();
  context.arc(gameWidth / 2, gameHeight / 2, 66, 0, Math.PI * 2);
  context.stroke();
  context.fillStyle = "#c8f169";
  context.beginPath();
  context.roundRect(48, pongPlayerY, 12, 84, 6);
  context.roundRect(gameWidth - 60, pongComputerY, 12, 84, 6);
  context.fill();
  context.fillStyle = "#f4f4e9";
  context.beginPath();
  context.arc(pongBall.x, pongBall.y, 9, 0, Math.PI * 2);
  context.fill();
}

function updateRace(delta) {
  if (raceFinished) return;
  raceElapsed += delta * 16.67;
  opponents.forEach((opponent) => {
    if (opponent.progress < raceLaps * trackPointCount) {
      opponent.progress = Math.min(raceLaps * trackPointCount, opponent.progress + opponent.speed * delta);
      if (opponent.progress >= raceLaps * trackPointCount) opponent.finishTime = raceElapsed;
    }
  });

  const steering = Number(keysPressed.has("d")) - Number(keysPressed.has("a"));
  if (keysPressed.has("w")) raceCar.speed = Math.min(raceCar.speed + 0.11 * delta, 5.8);
  else if (!keysPressed.has("s")) raceCar.speed *= Math.pow(0.988, delta);

  if (keysPressed.has("s")) {
    if (raceCar.speed > 0.08) raceCar.speed = Math.max(0, raceCar.speed - 0.2 * delta);
    else raceCar.speed = Math.max(-2.8, raceCar.speed - 0.08 * delta);
  }

  const steeringAuthority = Math.max(0.3, Math.min(Math.abs(raceCar.speed) / 2.4, 1));
  raceCar.angle += steering * 0.065 * steeringAuthority * delta * (raceCar.speed < -0.08 ? -1 : 1);
  raceCar.x += Math.cos(raceCar.angle) * raceCar.speed * delta;
  raceCar.y += Math.sin(raceCar.angle) * raceCar.speed * delta;

  const nearest = getNearestTrackProgress(raceCar.x, raceCar.y, raceCar.progress);
  raceCar.progress = nearest.progress;
  if (nearest.distance > trackWidth * 0.46) {
    raceCar.speed *= Math.pow(0.96, delta);
  }

  const completedLaps = Math.max(0, Math.min(Math.floor(raceCar.progress / trackPointCount), raceLaps));
  raceLapDisplay.textContent = `${Math.min(completedLaps + 1, raceLaps)} / ${raceLaps}`;
  raceSpeedDisplay.textContent = `${Math.round(raceCar.speed * 280)} km/h`;
  raceTimeDisplay.textContent = formatRaceTime(raceElapsed);
  updateRacePosition();

  if (completedLaps >= raceLaps) {
    raceFinished = true;
    raceFinishPosition = Number.parseInt(racePositionDisplay.textContent, 10);
    finishGame(`Cíl! Dojel jsi na ${raceFinishPosition}. místě za ${formatRaceTime(raceElapsed)}.`);
  }
}

function formatRaceTime(milliseconds) {
  const totalTenths = Math.floor(milliseconds / 100);
  const minutes = Math.floor(totalTenths / 600);
  const seconds = Math.floor((totalTenths % 600) / 10);
  const tenths = totalTenths % 10;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}.${tenths}`;
}

function updateRacePosition() {
  const playerProgress = Math.min(raceCar.progress, raceLaps * trackPointCount);
  const place = 1 + opponents.filter((opponent) =>
    opponent.progress > playerProgress || (opponent.finishTime !== null && opponent.finishTime < raceElapsed)
  ).length;
  racePositionDisplay.textContent = `${place}. / ${opponents.length + 1}`;
}

function getTrackPosition(progress, lane) {
  const point = getTrackPoint(progress);
  const tangent = getTrackTangent(progress);
  return {
    x: point.x - Math.sin(tangent) * lane,
    y: point.y + Math.cos(tangent) * lane,
    angle: tangent
  };
}

function traceTrack() {
  context.beginPath();
  trackPoints.forEach((point, index) => {
    if (index === 0) context.moveTo(point.x, point.y);
    else context.lineTo(point.x, point.y);
  });
  context.closePath();
}

function drawFinishLine() {
  const start = getTrackPoint(0);
  const angle = getTrackTangent(0);
  context.save();
  context.translate(start.x, start.y);
  context.rotate(angle);
  const square = 8;
  for (let column = -1; column < 2; column++) {
    for (let row = -6; row < 7; row++) {
      context.fillStyle = (column + row) % 2 === 0 ? "#f7f7ee" : "#20231e";
      context.fillRect(column * square, row * square, square, square);
    }
  }
  context.restore();
}

function drawRaceCar(x, y, angle, color, label, isPlayer = false) {
  context.save();
  context.translate(x, y);
  context.rotate(angle);
  context.fillStyle = "#0c110c88";
  context.beginPath();
  context.ellipse(0, 3, 22, 13, 0, 0, Math.PI * 2);
  context.fill();
  context.fillStyle = "#111510";
  context.beginPath();
  context.roundRect(-11, -13, 10, 6, 2);
  context.roundRect(7, -13, 10, 6, 2);
  context.roundRect(-11, 7, 10, 6, 2);
  context.roundRect(7, 7, 10, 6, 2);
  context.fill();
  context.fillStyle = color;
  context.strokeStyle = isPlayer ? "#efffcf" : "#ffffff99";
  context.lineWidth = isPlayer ? 1.8 : 1;
  context.beginPath();
  context.moveTo(20, 0);
  context.lineTo(14, -9);
  context.lineTo(-12, -9);
  context.lineTo(-18, -5);
  context.lineTo(-18, 5);
  context.lineTo(-12, 9);
  context.lineTo(14, 9);
  context.closePath();
  context.fill();
  context.stroke();
  context.fillStyle = "#182b31";
  context.beginPath();
  context.moveTo(8, -6);
  context.lineTo(12, -3);
  context.lineTo(12, 3);
  context.lineTo(8, 6);
  context.lineTo(-5, 6);
  context.lineTo(-8, 0);
  context.lineTo(-5, -6);
  context.closePath();
  context.fill();
  context.fillStyle = "#fff4ba";
  context.fillRect(16, -6, 3, 3);
  context.fillRect(16, 3, 3, 3);
  context.fillStyle = "#ff5555";
  context.fillRect(-17, -6, 3, 3);
  context.fillRect(-17, 3, 3, 3);
  context.restore();

  if (label) {
    context.fillStyle = isPlayer ? "#f1ffd8" : "#ffffffcc";
    context.font = "bold 9px sans-serif";
    context.textAlign = "center";
    context.fillText(label, x, y - 19);
  }
}

function drawRace() {
  context.fillStyle = "#24472f";
  context.fillRect(0, 0, gameWidth, gameHeight);
  context.fillStyle = "#ffffff08";
  for (let x = 10; x < gameWidth; x += 48) {
    context.fillRect(x, 0, 1, gameHeight);
  }
  context.lineJoin = "round";
  context.lineCap = "round";

  traceTrack();
  context.strokeStyle = "#e7eee0";
  context.lineWidth = trackWidth + 18;
  context.stroke();
  traceTrack();
  context.strokeStyle = "#dc6158";
  context.lineWidth = trackWidth + 12;
  context.setLineDash([22, 22]);
  context.stroke();
  context.setLineDash([]);
  traceTrack();
  context.strokeStyle = "#353a37";
  context.lineWidth = trackWidth;
  context.stroke();
  traceTrack();
  context.strokeStyle = "#747873";
  context.lineWidth = 2;
  context.setLineDash([11, 13]);
  context.stroke();
  context.setLineDash([]);

  drawFinishLine();
  opponents.forEach((opponent, index) => {
    const point = getTrackPosition(opponent.progress, opponent.lane);
    drawRaceCar(
      point.x,
      point.y,
      point.angle,
      opponent.color,
      `AI ${index + 1}`
    );
  });
  drawRaceCar(raceCar.x, raceCar.y, raceCar.angle, "#c8f169", "TY", true);
}

function drawCurrentGame() {
  if (selectedGame === "pong") drawPong();
  else drawRace();
}

function finishGame(message) {
  gameRunning = false;
  canvasMessage.textContent = message;
  canvasMessage.classList.remove("is-hidden");
  gameStart.textContent = "Hrát znovu →";
}

drawCurrentGame();
