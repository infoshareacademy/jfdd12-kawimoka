const SIZE = 30
const SPACE_BETWEEN = SIZE + SIZE / 2
let numOfBurgers = 15
const WIDTH = 900
const HEIGHT = 600
const INSTRUCTION_WIDTH = 300
const INSTRUCTION_HEIGHT = 300
const BOY_WIDTH = 100
const BOY_HEIGHT = 100
const FREE_SPACE = (WIDTH - (SIZE + (numOfBurgers - 1) * SPACE_BETWEEN)) / 2
const PLAY_BUTTON_WIDTH = 50
const PLAY_BUTTON_HEIGHT = 50
const PLAY_BUTTON_POSITION_ADJUSTMENT_PERCENT = 0.15 * HEIGHT
const PAUSE_BUTTON_WIDTH = 150
const PAUSE_BUTTON_HEIGHT = 32

function drawImage(imageUrl, x, y, w, h, onload = () => {}) {
  const image = new Image()
  image.src = imageUrl
  image.onload = function() {
    drawImage(image, x, y, w, h)
    onload()
  }
  return image
}
function randomNumber(min, max) {
  return Math.random() * (max - min) + min
}

let isPlaying = false

function Boy(x, y) {
  this.initX = x
  this.initY = y
}

Boy.prototype = {
  drawBoy: function(context) {
    context.drawImage(boyImage, this.x, this.y, BOY_WIDTH, BOY_HEIGHT)
  }
}

function Burger(x, y) {
  this.initX = x
  this.initY = y
  this.vx = 5
  this.reset()
}

Burger.prototype = {
  draw: function(context) {
    context.drawImage(burgerImage, this.x, this.y, SIZE, SIZE)
  },
  reset: function() {
    this.x = this.initX
    this.y = this.initY
    this.r = 20
    this.color = 'black'
  },
  move: function() {
    this.x += this.vx
  },
  changeDirection: function() {
    this.vx = -this.vx
    this.y += SIZE / 2
  }
}

function Lab(width, height, color, numberOfBurgers = 1) {
  this.width = width
  this.height = height
  this.color = color
  this.numberOfBurgers = numberOfBurgers

  this.createCanvas()
  this.clearCanvas()
  this.generateBurgers()
}

Lab.prototype = {
  drawBackg: function() {
    drawImage(backgroundImage, 0, 0, WIDTH, HEIGHT)
  },
  generateBurgers: function() {
    const burgers = []
    for (let i = 0; i < this.numberOfBurgers; i++) {
      burgers.push(new Burger(i * SPACE_BETWEEN + FREE_SPACE, SIZE))
      burgers.push(new Burger(i * SPACE_BETWEEN + FREE_SPACE, SIZE + SPACE_BETWEEN))
      burgers.push(new Burger(i * SPACE_BETWEEN + FREE_SPACE, SIZE + 2 * SPACE_BETWEEN))
    }
    this.burgers = burgers
  },
  clearCanvas: function() {
    this.context.fillStyle = this.color
    this.context.fillRect(0, 0, this.width, this.height)
  },
  createCanvas: function() {
    const canvas = document.createElement('canvas')
    canvas.setAttribute('width', this.width)
    canvas.setAttribute('height', this.height)
    this.context = canvas.getContext('2d')
    const body = document.querySelector('body')
    body.append(canvas)
    burgerImage = drawImage('game-images/burger.png')
    boyImage = drawImage('game-images/boy-skinny.png')
  },
  simulate: function() {
    this.clearCanvas()
    if (this.burgerOutOfLeft() || this.burgerOutOfRight()) {
      this.burgers.forEach(burger => burger.changeDirection())
    }
    this.burgers.forEach(this.simulateBurger.bind(this))
    requestAnimationFrame(this.simulate.bind(this))
  },
  simulateBurger: function(burger) {
    burger.draw(this.context)
    burger.move()
    /* if (this.collisionWithBoy(burger)) {
      burger.reset()
    } */
  },
  simulateBoy: function(boy) {
    boy.drawBoy(this.context)
  },
  burgerOutOfRight: function() {
    const burger = this.burgers[this.numberOfBurgers * 3 - 1]
    const burgerOutOfRight = burger.x + burger.r > this.width

    return burgerOutOfRight
  },
  burgerOutOfLeft: function() {
    const burger = this.burgers[0]
    const burgerOutOfLeft = burger.x - burger.r < 0

    return burgerOutOfLeft
  },
  collisionWithBoy: function(burger) {
    const burgerOutOfBottom = burger.y - burger.r > boy.y
    return burgerOutOfBottom
  }
}

window.addEventListener('keydown', example, false)
function example(e) {
  if (e.keyCode == 37) {
    moveLeft()
  } else if (e.keyCode == 39) {
    moveRight()
  }
}

function addClickEventToCanvas() {
  canvas.addEventListener('click', function(event) {
    let relativeClickX = event.x - canvas.offsetLeft
    let relativeClickY = event.y - canvas.offsetTop

    if (!isPlaying) {
      if (checkIfclickOnPlayButton(relativeClickX, relativeClickY)) {
        isPlaying = true
      }
    } else {
      if (checkIfclickOnPauseButton(relativeClickX, relativeClickY)) {
        isPlaying = false
      }
    }
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

let backgroundImage
let burgerImage
let boyImage
const lab = new Lab(WIDTH, HEIGHT, '#ddd', numOfBurgers)
lab.simulate()
