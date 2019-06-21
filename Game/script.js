const BURGER_SIZE = 30
const SPACE_BETWEEN = BURGER_SIZE + BURGER_SIZE / 2
let numOfBurgers = 15
const WIDTH = 900
const HEIGHT = 600
const FREE_SPACE = (WIDTH - (BURGER_SIZE + (numOfBurgers - 1) * SPACE_BETWEEN)) / 2
const INSTRUCTION_WIDTH = 300
const INSTRUCTION_HEIGHT = 300
const BOY_WIDTH = 100
const BOY_HEIGHT = 100
const PLAY_BUTTON_WIDTH = 50
const PLAY_BUTTON_HEIGHT = 50
const PLAY_BUTTON_POSITION_ADJUSTMENT_PERCENT = 0.15 * HEIGHT
const PAUSE_BUTTON_WIDTH = 150
const PAUSE_BUTTON_HEIGHT = 32
const BROKUL_WIDTH = 70 / 2
const BROKUL_HEIGHT = 80 / 2
const GRAVITY = 15
let counter = 3
let points = 0
let burgers = []
const POINTS_FOR_VEGETABLE = 10
const POINTS_FOR_BOMB = -50

class Burger {
  constructor(x, y) {
    this.initX = x
    this.initY = y
    this.vx = 5
    this.reset()
  }

  reset() {
    this.x = this.initX
    this.y = this.initY
  }
  move() {
    this.x += this.vx
  }
  changeDirection() {
    this.vx = -this.vx
    this.y += BURGER_SIZE / 2
  }
}

let boy = {
  x: WIDTH / 2,
  y: HEIGHT - BOY_HEIGHT - 50
}

let apples = []

const body = document.querySelector('body')
const canvas = document.createElement('canvas')
body.append(canvas)

canvas.setAttribute('width', `${30 * BURGER_SIZE}px`)
canvas.setAttribute('height', `${20 * BURGER_SIZE}px`)
const ctx = canvas.getContext('2d')

let isPlaying = false
let isShooting = false

var images
addClickEventToCanvas()
loadAllImages().then(values => {
  images = values;
  animate(0);
});

let lastTime = 0;
let delta = 0;
let elapsedTime = 0;
let timeToGameStart = 3;
function animate(time) {
  delta = time - lastTime;
  drawGame();
  requestAnimationFrame(animate);
  lastTime = time;
}

function doEverySecond(callback) {
  elapsedTime += delta;
  if (elapsedTime > 1000) {
    elapsedTime = 0;
    callback();
  }
}

function fallingVeggies() {
  setInterval(() => {
    if (!isPlaying) {
      return;
    }
    let vegetable = new Vegetable()
    vegetables = [...vegetables, vegetable]
  }, 1000)
}

let vegetables = []

fallingVeggies()
generateBurgers()

function drawGame() {
  drawBackground()
  drawBoy()
  drawPauseButton()

  // vegetablesInterval = setInterval(drawVegetable, 5000)
  drawCounter(timeToGameStart)
  appleBurgerCollision();

  if (!isPlaying) {
    drawInstruction()
    drawPlayButton()
  } else {
    doEverySecond(() => {
      timeToGameStart = timeToGameStart === 0 ? 0 : timeToGameStart - 1
    })
    movingBoy()
    boyIsShootingByApple()
    drawVegetables()
    animateBurgers()
    drawPoints()
  }
}

function addClickEventToCanvas() {
  canvas.addEventListener('click', function(event) {
    // console.log(event)
    let relativeClickX = event.x - canvas.offsetLeft
    let relativeClickY = event.y - canvas.offsetTop

    if (!isPlaying) {
      if (checkIfclickOnPlayButton(relativeClickX, relativeClickY)) {
        isPlaying = true
      }
    } else {
      if (checkIfclickOnPauseButton(relativeClickX, relativeClickY)) {
        isPlaying = false
        timeToGameStart = 3
      }
    }
  })
}

function loadImage(imageUrl) {
  return new Promise(resolve => {
    const image = new Image()
    image.src = imageUrl
    image.onload = function() {
      resolve(image)
    }
  })
}

function loadAllImages() {
  const imagesNames = [
    "background",
    "instruction",
    "burger",
    "pause",
    "play",
    "boy-skinny",
    "brokul",
    "marchew",
    "bomb"
  ];
  const imagesPaths = imagesNames.map(
    imageName => `game-images/${imageName}.png`
  );
  const imagesPromises = imagesPaths.map(imagePath => loadImage(imagePath))

  return Promise.all(imagesPromises).then(loadedImages => {
    const images = imagesNames.reduce((acc, imageName, index) => {
      const name = imageName.replace('-', '')
      return {
        ...acc,
        [name]: loadedImages[index]
      }
    }, {})

    return images
  })
}

function checkIfclickOnPlayButton(relativeClickX, relativeClickY) {
  let maxPlayClickScopeX = (WIDTH + PLAY_BUTTON_WIDTH) / 2
  let minPlayClickScopeX = (WIDTH - PLAY_BUTTON_WIDTH) / 2
  let maxPlayClickScopeY = HEIGHT / 2 + PLAY_BUTTON_POSITION_ADJUSTMENT_PERCENT + PLAY_BUTTON_HEIGHT
  let minPlayClickScopeY = HEIGHT / 2 + PLAY_BUTTON_POSITION_ADJUSTMENT_PERCENT

  return (
    relativeClickX < maxPlayClickScopeX &&
    relativeClickX > minPlayClickScopeX &&
    relativeClickY < maxPlayClickScopeY &&
    relativeClickY > minPlayClickScopeY
  )
}

function checkIfclickOnPauseButton(relativeClickX, relativeClickY) {
  return relativeClickX < PAUSE_BUTTON_WIDTH && relativeClickY < PAUSE_BUTTON_HEIGHT
}

function generateBurgers() {
  for (let i = 0; i < numOfBurgers; i++) {
    burgers.push(new Burger(i * SPACE_BETWEEN + FREE_SPACE, BURGER_SIZE))
    burgers.push(new Burger(i * SPACE_BETWEEN + FREE_SPACE, BURGER_SIZE + SPACE_BETWEEN))
    burgers.push(new Burger(i * SPACE_BETWEEN + FREE_SPACE, BURGER_SIZE + 2 * SPACE_BETWEEN))
  }
}

function drawBackground() {
  ctx.drawImage(images.background, 0, 0, WIDTH, HEIGHT)
}

function movingBoy() {
  const moveRight = () => {
    if (WIDTH - BOY_WIDTH > boy.x) {
      boy.x = boy.x + 10
    }
  }
  const moveLeft = () => {
    if (boy.x > 0) {
      boy.x = boy.x - 10
    }
  }

  kd.RIGHT.down(function() {
    if (isPlaying === true && timeToGameStart === 0) {
      moveRight()
    }
  })

  kd.LEFT.down(function() {
    if (isPlaying === true && timeToGameStart === 0) {
      moveLeft()
    }
  })
}

// This update loop is the heartbeat of Keydrown
kd.run(function() {
  if (isPlaying === true && timeToGameStart === 0) {
    kd.tick()
  }
})

function drawInstruction() {
  ctx.drawImage(
    images.instruction,
    (WIDTH - INSTRUCTION_WIDTH) / 2,
    (HEIGHT - INSTRUCTION_HEIGHT) / 2,
    INSTRUCTION_WIDTH,
    INSTRUCTION_HEIGHT
  )
}

function drawBoy() {
  ctx.drawImage(images.boyskinny, boy.x, boy.y, BOY_WIDTH, BOY_HEIGHT)
}

function drawPlayButton() {
  ctx.drawImage(
    images.play,
    WIDTH / 2 - PLAY_BUTTON_WIDTH / 2,
    HEIGHT / 2 + PLAY_BUTTON_POSITION_ADJUSTMENT_PERCENT,
    PLAY_BUTTON_WIDTH,
    PLAY_BUTTON_HEIGHT
  )
}

function drawPauseButton() {
  ctx.drawImage(images.pause, 0, 0, PAUSE_BUTTON_WIDTH, PAUSE_BUTTON_HEIGHT)
}

function drawBurger(x, y, width, height) {
  ctx.drawImage(images.burger, x, y, width, height)
}

function drawCounter(value) {
  if (value === 0) {
    return;
  }
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.font = "50px Arial";
  ctx.fillStyle = "#000";
  ctx.fillText(value, WIDTH / 2, HEIGHT / 2);
}

function drawImage(imageUrl, x, y, w, h, onload = () => {}) {
  const image = new Image()
  image.src = imageUrl
  image.onload = function() {
    ctx.drawImage(image, x, y, w, h)
    onload()
  }
  return image
}

window.addEventListener('keydown', spaceKeyCheck, false)

function spaceKeyCheck(s) {
  if (s.keyCode == 32) {
    fixAppleToBoy()
    return true
  }
}

function fixAppleToBoy() {
  //console.log("bang bang")
  const boyClone = { ...boy }
  const apple = new Apple(boyClone.x, boyClone.y)
  apples = [...apples, apple]
}

function Apple(x, y) {
  this.x = x
  this.y = y
}

Apple.prototype = {
  draw: function() {
    ctx.drawImage(
      images.brokul,
      this.x + BOY_WIDTH / 2 - BROKUL_WIDTH / 2,
      this.y,
      BROKUL_WIDTH,
      BROKUL_HEIGHT
    )
  },
  move: function() {
    this.y = this.y - GRAVITY
  }
}

function boyIsShootingByApple() {
  if (timeToGameStart === 0) {
    apples.forEach(apple => {
      if (apple.y > 0) {
        apple.draw()
        apple.move()
      }
    })
  }
}


function appleBurgerCollision() {
  burgers.forEach((burger, indexBurger) => {
    const burgerArea = { x: burger.x, y: burger.y, width: BURGER_SIZE, height: BURGER_SIZE };

    apples.forEach((apple, indexApple) => {
      const appleArea = {
        x: apple.x,
        y: apple.y,
        width: BROKUL_WIDTH,
        height: BROKUL_HEIGHT
      };

      const appleHasCollision =
      appleArea.x < burgerArea.x + burgerArea.width &&
      appleArea.x + appleArea.width > burgerArea.x &&
      appleArea.y < burgerArea.y + burgerArea.height &&
      appleArea.y + appleArea.height > burgerArea.y;
   
    if (appleHasCollision) {
      points = points + 10;
      console.log(burgers[indexBurger]);
      burgers = burgers.filter((b, i) => !(i === indexBurger));
      apples = apples.filter((a, i) => !(i === indexApple));
      
    }
    })
  })

 }




function Vegetable() {
  this.x = Math.floor(Math.random() * 900 - 50)
  this.y = -30
  const vegetables = [
    {
      name: "marchew",
      width: 30,
      height: 30,
      isSafe: true
    },
    {
      name: 'brokul',
      width: 50,
      height: 50,
      isSafe: true
    },
    {
      name: "bomb",
      width: 40,
      height: 40,
      isSafe: false
    }
  ];

  const randomIndex = Math.floor(Math.random() * vegetables.length);
  const vegetable = vegetables[randomIndex];
  this.image = images[vegetable.name];
  this.width = vegetable.width;
  this.height = vegetable.height;
  this.isSafe = vegetable.isSafe;
}

Vegetable.prototype = {
  draw: function() {
    ctx.drawImage(this.image, this.x, this.y, this.width, this.height)
  },
  move: function() {
    this.y = this.y + 2
  }
}

function drawVegetables() {
  // console.log(timeToGameStart)
  if (isPlaying === true && timeToGameStart === 0) {
    vegetables.forEach(vegetable => {
      vegetable.draw()
      vegetable.move()
      listenToCollision(vegetable)
    })
  }
}


function simulateBurger(burger) {
  //console.log(burger)
  burger.move()
  ctx.drawImage(images.burger, burger.x, burger.y, BURGER_SIZE, BURGER_SIZE)

  if (hasBurgerCollisionWithBoy(burger)) {
    burger.reset()
  }
}

function burgerOutOfRight() {
  const burger = burgers[burgers.length - 1]
  return burger.x + BURGER_SIZE > WIDTH
}

function burgerOutOfLeft() {
  const burger = burgers[0]
  return burger.x < 0
}

function hasBurgerCollisionWithBoy(burger) {
  const burgerOutOfBottom = burger.y + BURGER_SIZE > HEIGHT - BOY_HEIGHT - 50
  return burgerOutOfBottom
}

function clearCanvas() {
  ctx.fillStyle = 'white'
  ctx.fillRect(0, 0, WIDTH, HEIGHT)
}

function animateBurgers() {
  burgers.forEach(burger => simulateBurger(burger))
  if (burgerOutOfLeft() || burgerOutOfRight()) {
    burgers.forEach(burger => burger.changeDirection())}
  }

function listenToCollision(vegetable) {
  var rect1 = {
    x: vegetable.x,
    y: vegetable.y,
    width: vegetable.width,
    height: vegetable.height
  };
  var rect2 = { x: boy.x, y: boy.y, width: BOY_WIDTH, height: BOY_HEIGHT };

  const hasCollision =
    rect1.x < rect2.x + rect2.width &&
    rect1.x + rect1.width > rect2.x &&
    rect1.y < rect2.y + rect2.height &&
    rect1.y + rect1.height > rect2.y;

  function itemDisappears(item) {
    item.y = -100;
  }

  if (hasCollision && vegetable.isSafe) {
    itemDisappears(vegetable);
    points = points + POINTS_FOR_VEGETABLE;
  }

  if (hasCollision && !vegetable.isSafe) {
    itemDisappears(vegetable);
    points = points + POINTS_FOR_BOMB;
  }
}

function simulateBurger(burger) {
  // console.log(burger)
  burger.move();
  ctx.drawImage(images.burger, burger.x, burger.y, BURGER_SIZE, BURGER_SIZE);

  if (hasBurgerCollisionWithBoy(burger)) {
    burger.reset();
  }
}

function burgerOutOfRight() {
  const burger = burgers[burgers.length - 1];
  const burgerOutOfRight = burger.x + BURGER_SIZE > WIDTH;

  return burgerOutOfRight;
}

function burgerOutOfLeft() {
  const burger = burgers[0];
  const burgerOutOfLeft = burger.x < 0;

  return burgerOutOfLeft;
}

function hasBurgerCollisionWithBoy(burger) {
  const burgerOutOfBottom = burger.y + BURGER_SIZE > HEIGHT - BOY_HEIGHT - 50;
  return burgerOutOfBottom;
}

function clearCanvas() {
  ctx.fillStyle = "white";
  ctx.fillRect(0, 0, WIDTH, HEIGHT);
}

function animateBurgers() {
  if (timeToGameStart === 0) {
    burgers.forEach(burger => simulateBurger(burger));
    if (burgerOutOfLeft() || burgerOutOfRight()) {
      burgers.forEach(burger => burger.changeDirection());
    }
  }
}

function drawPoints() {
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.font = "30px Arial";
  ctx.fillStyle = "#000";
  ctx.fillText(`SCORE: ${points}`, WIDTH - 100, 15);
}