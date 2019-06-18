const SIZE = 30;
const SPACE_BETWEEN = SIZE + SIZE / 2;
let numOfEnemies = 15;
const FREE_SPACE =
  (40 * SIZE - (SIZE + (numOfEnemies - 1) * SPACE_BETWEEN)) / 2;
const WIDTH = 900;
const HEIGHT = 600;
const INSTRUCTION_WIDTH = 300;
const INSTRUCTION_HEIGHT = 300;
const BOY_WIDTH = 100;
const BOY_HEIGHT = 100;
const PLAY_BUTTON_WIDTH = 50;
const PLAY_BUTTON_HEIGHT = 50;
const PLAY_BUTTON_POSITION_ADJUSTMENT_PERCENT = 0.15 * HEIGHT;
const PAUSE_BUTTON_WIDTH = 150;
const PAUSE_BUTTON_HEIGHT = 32;
let vegetablesIntervalId;

const vegetables = [
  {
    path: "game-images/marchew.png",
    width: 30,
    height: 30
  },
  {
    path: "game-images/brokul.png",
    width: 50,
    height: 50
  }
];

let boy = {
  x: WIDTH / 2,
  y: HEIGHT - BOY_HEIGHT - 50
};

const body = document.querySelector("body");
const canvas = document.createElement("canvas");
body.append(canvas);

canvas.setAttribute("width", `${30 * SIZE}px`);
canvas.setAttribute("height", `${20 * SIZE}px`);
const ctx = canvas.getContext("2d");

function drawBurger(x, y, width, height, color = "black") {
  ctx.fillStyle = color;
  ctx.fillRect(x, y, width, height);
}
let isPlaying = false;

function animate() {
  drawGame();
  requestAnimationFrame(animate);
}
animate();
drawPlayButton();
addClickEventToCanvas();

function drawGame() {
  drawBackground();
  drawBurgers();
  drawBoy();
  drawPauseButton();
  vegetablesInterval = setInterval(drawVegetable, 5000);

  if (!isPlaying) {
    drawInstruction();
    drawPlayButton();
  }
}

function addClickEventToCanvas() {
  canvas.addEventListener("click", function(event) {
    let relativeClickX = event.x - canvas.offsetLeft;
    let relativeClickY = event.y - canvas.offsetTop;

    if (!isPlaying) {
      if (checkIfclickOnPlayButton(relativeClickX, relativeClickY)) {
        isPlaying = true;
      }
    } else {
      if (checkIfclickOnPauseButton(relativeClickX, relativeClickY)) {
        isPlaying = false;
      }
    }
  });
}

function checkIfclickOnPlayButton(relativeClickX, relativeClickY) {
  let maxPlayClickScopeX = (WIDTH + PLAY_BUTTON_WIDTH) / 2;
  let minPlayClickScopeX = (WIDTH - PLAY_BUTTON_WIDTH) / 2;
  let maxPlayClickScopeY =
    HEIGHT / 2 + PLAY_BUTTON_POSITION_ADJUSTMENT_PERCENT + PLAY_BUTTON_HEIGHT;
  let minPlayClickScopeY = HEIGHT / 2 + PLAY_BUTTON_POSITION_ADJUSTMENT_PERCENT;

  return (
    relativeClickX < maxPlayClickScopeX &&
    relativeClickX > minPlayClickScopeX &&
    relativeClickY < maxPlayClickScopeY &&
    relativeClickY > minPlayClickScopeY
  );
}

function checkIfclickOnPauseButton(relativeClickX, relativeClickY) {
  return (
    relativeClickX < PAUSE_BUTTON_WIDTH && relativeClickY < PAUSE_BUTTON_HEIGHT
  );
}

function drawBurgers() {
  for (let i = 0; i < numOfEnemies; i++) {
    drawBurger(i * SPACE_BETWEEN + FREE_SPACE, SIZE, SIZE, SIZE);

    drawBurger(
      i * SPACE_BETWEEN + FREE_SPACE,
      SIZE + SPACE_BETWEEN,
      SIZE,
      SIZE
    );

    drawBurger(
      i * SPACE_BETWEEN + FREE_SPACE,
      SIZE + 2 * SPACE_BETWEEN,
      SIZE,
      SIZE
    );
  }
}

function drawBackground() {
  drawImage("game-images/background.png", 0, 0, WIDTH, HEIGHT);
}

const moveRight = () => {
  if (WIDTH - BOY_WIDTH > boy.x) {
    boy.x = boy.x + 10;
  }
};
const moveLeft = () => {
  if (boy.x > 0) {
    boy.x = boy.x - 10;
  }
};

kd.RIGHT.down(function() {
  moveRight();
});

kd.LEFT.down(function() {
  moveLeft();
});

kd.run(function() {
  kd.tick();
});

function drawInstruction() {
  drawImage(
    "game-images/instruction.png",
    (WIDTH - INSTRUCTION_WIDTH) / 2,
    (HEIGHT - INSTRUCTION_HEIGHT) / 2,
    INSTRUCTION_WIDTH,
    INSTRUCTION_HEIGHT
  );
}

function drawBoy() {
  drawImage("game-images/boy-skinny.png", boy.x, boy.y, BOY_WIDTH, BOY_HEIGHT);
}

function drawPlayButton() {
  drawImage(
    "game-images/play.png",
    WIDTH / 2 - PLAY_BUTTON_WIDTH / 2,
    HEIGHT / 2 + PLAY_BUTTON_POSITION_ADJUSTMENT_PERCENT,
    PLAY_BUTTON_WIDTH,
    PLAY_BUTTON_HEIGHT
  );
}

function drawPauseButton() {
  drawImage(
    "game-images/pause.png",
    0,
    0,
    PAUSE_BUTTON_WIDTH,
    PAUSE_BUTTON_HEIGHT
  );
}

function drawBurger(x, y, width, height) {
  drawImage("game-images/burger.png", x, y, width, height);
}

function drawImage(imageUrl, x, y, w, h, onload = () => {}) {
  console.log(imageUrl);
  const image = new Image();
  image.src = imageUrl;
  image.onload = function() {
    ctx.drawImage(image, x, y, w, h);
    onload();
  };
  return image;
}

function drawVegetable() {
  const randomIndex = Math.floor(Math.random() * vegetables.length);
  const vegetable = vegetables[randomIndex];
  drawImage(
    vegetable.path,
    WIDTH / Math.ceil(Math.random() * 30),
    30,
    vegetable.width,
    vegetable.height
  );
}
