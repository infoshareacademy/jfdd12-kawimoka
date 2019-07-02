const BURGER_SIZE = 30
const SPACE_BETWEEN = BURGER_SIZE + BURGER_SIZE / 2
let numOfBurgers = 15
const WIDTH = 900
const HEIGHT = 600
const FREE_SPACE = (WIDTH - (BURGER_SIZE + (numOfBurgers - 1) * SPACE_BETWEEN)) / 2
const INSTRUCTION_WIDTH = 300
const INSTRUCTION_HEIGHT = 300
const BOY_WIDTH = 75
const BOY_HEIGHT = 75
const PLAY_BUTTON_WIDTH = 50
const PLAY_BUTTON_HEIGHT = 50
const PLAY_BUTTON_POSITION_ADJUSTMENT_PERCENT = 0.15 * HEIGHT
const PAUSE_BUTTON_WIDTH = 150
const PAUSE_BUTTON_HEIGHT = 32
const BROKUL_WIDTH = 70 / 4
const BROKUL_HEIGHT = 80 / 4
const GRAVITY = 15
let counter = 3
let points = 0
let LIVES = 5
const LIVES_FOR_BOMB = -1
let burgers = []
const POINTS_FOR_VEGETABLE = 10
const POINTS_FOR_BOMB = -50
const POINTS_FOR_BURGER = 10
const GAMEOVER_SIZE = 192
const innerHeight = window.innerHeight
let isItGameOver = false
let speed = 2
let boySpeed = 10
let bestScoreColor = '#000'

let bestScore = 0
let initialBestScore = 0

let rank = JSON.parse(localStorage.getItem('rank'))
if (rank == null) {
  rank = []
}
if (rank.length > 0) {
  initialBestScore = rank[0]
  bestScore = initialBestScore
}

class Burger {
  constructor(x, y) {
    this.initX = x
    this.initY = y
    this.vx = speed
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

canvas.setAttribute('width', WIDTH)
canvas.setAttribute('height', HEIGHT)
const ctx = canvas.getContext('2d')

let isPlaying = false
let isShooting = false

var images
addClickEventToCanvas()
loadAllImages().then(values => {
  images = values
  animate(0)
})

let lastTime = 0
let delta = 0
let elapsedTime = 0
let timeToGameStart = 3
function animate(time) {
  delta = time - lastTime
  drawGame()
  requestId = window.requestAnimationFrame(animate)
  lastTime = time
}

function doEverySecond(callback) {
  elapsedTime += delta
  if (elapsedTime > 1000) {
    elapsedTime = 0
    callback()
  }
}

function fallingVeggies() {
  if (isItGameOver) {
    return
  }
  setInterval(() => {
    if (!isPlaying) {
      return
    }
    let vegetable = new Vegetable()
    vegetables = [...vegetables, vegetable]
  }, 1000)
}

let vegetables = []

fallingVeggies()
generateBurgers()

function generateAgain() {
  if (burgers.length === 0) {
    speed += 2
    generateBurgers()
  }
}

enterToPlayAfterGameover()
enterToPlay()

function drawGame() {
  drawBackground()
  drawBoy()
  drawPauseButton()
  drawPoints()
  drawLives()
  drawBestScore()
  drawCounter(timeToGameStart)
  appleBurgerCollision()
  drawGameOver()
  drawPlayAgain()
  congratsMessage()
  displayRanking()

  if (LIVES <= 2) {
    boySpeed = 5
    drawFatBoy()
  }

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
    generateAgain()
    animateBurgers()
  }
}

function increasePointsAndCheckIfBestScoreShouldBeReplaced(pointDelta) {
  points += pointDelta
  if (points < 0) {
    points = 0
  }
  if (points >= initialBestScore) {
    bestScore = points
    if (initialBestScore !== 0) {
      bestScoreColor = 'white'
    }
  }
}

function enterToPlay() {
  window.addEventListener('keydown', enterKeyCheck, false)

  function enterKeyCheck(s) {
    if (s.keyCode == 13) {
      isPlaying = true
      return true
    }
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

  canvas.addEventListener('touchend', function(event) {
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
    'background',
    'instruction',
    'burger',
    'pause',
    'play',
    'boy-skinny',
    'brokul',
    'marchew',
    'bomb',
    'game-over',
    'boy-fat'
  ]

  const imagesPaths = imagesNames.map(imageName => `game-images/${imageName}.png`)
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
  if (isItGameOver) {
    return
  }

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
      boy.x = boy.x + boySpeed
    }
  }
  const moveLeft = () => {
    if (boy.x > 0) {
      boy.x = boy.x - boySpeed
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
    return
  }
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.font = '50px Russo One'
  ctx.fillStyle = '#000'
  ctx.fillText(value, WIDTH / 2, HEIGHT / 2)
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

window.addEventListener('keyup', spaceKeyCheck, false)

function spaceKeyCheck(s) {
  if (s.keyCode == 32) {
    fixAppleToBoy()
    return true
  }
}

function fixAppleToBoy() {
  if (timeToGameStart === 0) {
    const boyClone = { ...boy }
    const apple = new Apple(boyClone.x, boyClone.y)
    apples = [...apples, apple]
  }
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
  if (isItGameOver) {
    return
  }
  apples.forEach(apple => {
    if (apple.y > 0) {
      apple.draw()
      apple.move()
    }
  })
}

function appleBurgerCollision() {
  if (isItGameOver) {
    return
  }

  burgers.forEach((burger, indexBurger) => {
    const burgerArea = { x: burger.x, y: burger.y, width: BURGER_SIZE, height: BURGER_SIZE }

    apples.forEach((apple, indexApple) => {
      const appleArea = {
        x: apple.x,
        y: apple.y,
        width: BROKUL_WIDTH,
        height: BROKUL_HEIGHT
      }

      const appleHasCollision =
        appleArea.x < burgerArea.x + burgerArea.width &&
        appleArea.x + appleArea.width > burgerArea.x &&
        appleArea.y < burgerArea.y + burgerArea.height &&
        appleArea.y + appleArea.height > burgerArea.y

      if (appleHasCollision) {
        increasePointsAndCheckIfBestScoreShouldBeReplaced(POINTS_FOR_BURGER)
        burgers = burgers.filter((b, i) => !(i === indexBurger))
        apples = apples.filter((a, i) => !(i === indexApple))
      }
    })
  })
}

function Vegetable() {
  this.x = Math.floor(Math.random() * 900 - 50)
  this.y = -30
  const vegetables = [
    {
      name: 'marchew',
      width: 18,
      height: 60,
      isSafe: true
    },
    {
      name: 'brokul',
      width: 30,
      height: 30,
      isSafe: true
    },
    {
      name: 'bomb',
      width: 30,
      height: 30,
      isSafe: false
    }
  ]

  const randomIndex = Math.floor(Math.random() * vegetables.length)
  const vegetable = vegetables[randomIndex]
  this.image = images[vegetable.name]
  this.width = vegetable.width
  this.height = vegetable.height
  this.isSafe = vegetable.isSafe
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
  if (isItGameOver) {
    return
  }
  if (isPlaying === true && timeToGameStart === 0) {
    vegetables.forEach(vegetable => {
      vegetable.draw()
      vegetable.move()
      listenToCollision(vegetable)
    })
  }
}

function listenToCollision(vegetable) {
  var rect1 = {
    x: vegetable.x,
    y: vegetable.y,
    width: vegetable.width,
    height: vegetable.height
  }
  var rect2 = { x: boy.x, y: boy.y, width: BOY_WIDTH, height: BOY_HEIGHT }

  const hasCollision =
    rect1.x < rect2.x + rect2.width &&
    rect1.x + rect1.width > rect2.x &&
    rect1.y < rect2.y + rect2.height &&
    rect1.y + rect1.height > rect2.y

  function itemDisappears(item) {
    item.y = -100
  }

  if (hasCollision && vegetable.isSafe) {
    itemDisappears(vegetable)
    increasePointsAndCheckIfBestScoreShouldBeReplaced(POINTS_FOR_VEGETABLE)
  }

  if (hasCollision && !vegetable.isSafe) {
    itemDisappears(vegetable)
    increasePointsAndCheckIfBestScoreShouldBeReplaced(POINTS_FOR_BOMB)
    LIVES = LIVES + LIVES_FOR_BOMB
    if (LIVES === 0) {
      setGameOver()
    }
  }
}

function setGameOver() {
  saveScore()
  isItGameOver = true
}

function simulateBurger(burger) {
  if (isItGameOver) {
    return
  }
  burger.move()
  ctx.drawImage(images.burger, burger.x, burger.y, BURGER_SIZE, BURGER_SIZE)

  if (hasBurgerCollisionWithBoy(burger)) {
    burger.reset()
    setGameOver()
  }
}

function burgerOutOfRight() {
  const burger = burgers[burgers.length - 1]
  const burgerOutOfRight = burger.x + BURGER_SIZE > WIDTH

  return burgerOutOfRight
}

function burgerOutOfLeft() {
  const burger = burgers[0]
  const burgerOutOfLeft = burger.x < 0

  return burgerOutOfLeft
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
  if (timeToGameStart === 0) {
    burgers.forEach(burger => simulateBurger(burger))
    if (burgerOutOfLeft() || burgerOutOfRight()) {
      burgers.forEach(burger => burger.changeDirection())
    }
  }
}

function drawPoints() {
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.font = '25px Russo One'
  ctx.fillStyle = '#000'
  ctx.fillText(`SCORE: ${points}`, WIDTH - 100, 18)
}

function saveScore() {
  rank.push(points)
  rank.sort((a, b) => b - a)
  localStorage.setItem('rank', JSON.stringify(rank))
}

function drawBestScore() {
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.font = '25px Russo One'
  ctx.fillStyle = bestScoreColor

  ctx.fillText(`BEST SCORE: ${bestScore}`, WIDTH - 400, 18)
}

function drawGameOver() {
  if (isItGameOver) {
    ctx.drawImage(images.gameover, (WIDTH - GAMEOVER_SIZE) / 2, 40, GAMEOVER_SIZE, GAMEOVER_SIZE)
  }
}

function drawLives() {
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.font = '25px Russo One'
  ctx.fillStyle = '#fff'
  ctx.fillText(`LIVES: ${LIVES}`, WIDTH - 670, 18)
}

function drawFatBoy() {
  ctx.drawImage(images.boyfat, boy.x, boy.y, BOY_WIDTH, BOY_HEIGHT)
}

function congratsMessage() {
  if (isItGameOver && bestScore > initialBestScore) {
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.font = '25px Russo One'
    ctx.fillStyle = 'black'
    ctx.fillText(`Congrats, You set new record: ${bestScore}!`, WIDTH / 2, HEIGHT / 2 - 50)
  }
}

function displayRanking() {
  if (isItGameOver) {
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.font = '25px Russo One'
    ctx.fillStyle = 'black'
    ctx.fillText(`Ranking:`, WIDTH / 2, 300)
    if (rank.length >= 1) {
      ctx.fillText(`#1: ${rank[0]}`, WIDTH / 2, 340)
    }
    if (rank.length >= 2) {
      ctx.fillText(`#2: ${rank[1]}`, WIDTH / 2, 380)
    }
    if (rank.length >= 3) {
      ctx.fillText(`#3: ${rank[2]}`, WIDTH / 2, 420)
    }
  }
}

function drawPlayAgain() {
  if (!isItGameOver) {
    return
  }
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.font = '25px Russo One'
  ctx.fillStyle = 'white'
  ctx.fillText('Press enter to play again', 180, HEIGHT - 70)
}

function enterToPlayAfterGameover() {
  window.addEventListener('keydown', enterKeyCheck, false)

  function enterKeyCheck(s) {
    if (s.keyCode == 13 && isItGameOver) {
      location.reload()
      isPlaying = true
      return true
    }
  }
}

canvas.addEventListener('touchmove', function(e) {
  var rect = canvas.getBoundingClientRect()
  var x = e.touches[0].clientX - rect.left

  if (e.touches) {
    boy.x = parseInt(x) - BOY_WIDTH / 2
  }
})

body.addEventListener('touchstart', fixAppleToBoy)
