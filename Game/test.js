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

class Boy {
  constructor(x, y) {
    this.initX = x
    this.initY = y
  }

  drawBoy(context) {
    context.drawImage(boyImage, this.x, this.y, BOY_WIDTH, BOY_HEIGHT)
  }
}

class Burger {
  constructor(x, y) {
    this.initX = x
    this.initY = y
    this.vx = 5
    this.reset()
  }
  draw(context) {
    context.drawImage(burgerImage, this.x, this.y, SIZE, SIZE)
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
    this.y += SIZE / 2
  }
}

class Lab {
  constructor(width, height, numberOfBurgers) {
    this.width = width
    this.height = height
    this.numberOfBurgers = numberOfBurgers

    this.createCanvas()
    this.clearCanvas()
    this.generateBurgers()
  }
  drawBackg() {
    this.context.drawImage(backgroundImage, 0, 0, WIDTH, HEIGHT)
  }
  generateBurgers() {
    const burgers = []
    for (let i = 0; i < this.numberOfBurgers; i++) {
      burgers.push(new Burger(i * SPACE_BETWEEN + FREE_SPACE, SIZE))
      burgers.push(new Burger(i * SPACE_BETWEEN + FREE_SPACE, SIZE + SPACE_BETWEEN))
      burgers.push(new Burger(i * SPACE_BETWEEN + FREE_SPACE, SIZE + 2 * SPACE_BETWEEN))
    }
    this.burgers = burgers
  }
  clearCanvas() {
    this.context.fillStyle = this.color
    this.context.fillRect(0, 0, this.width, this.height)
  }
  createCanvas() {
    const canvas = document.createElement('canvas')
    canvas.setAttribute('width', this.width)
    canvas.setAttribute('height', this.height)
    this.context = canvas.getContext('2d')
    const body = document.querySelector('body')
    body.append(canvas)
    burgerImage = drawImage('game-images/burger.png')
    boyImage = drawImage('game-images/boy-skinny.png')
    backgroundImage = drawImage('game-images/background.png')
  }
  simulate() {
    this.clearCanvas()
    this.drawBackg()
    if (this.burgerOutOfLeft() || this.burgerOutOfRight()) {
      this.burgers.forEach(burger => burger.changeDirection())
    }
    this.burgers.forEach(this.simulateBurger.bind(this))
    requestAnimationFrame(this.simulate.bind(this))
  }
  simulateBurger(burger) {
    burger.draw(this.context)
    burger.move()
    if (this.collisionWithBoy(burger)) {
      burger.reset()
    }
  }
  burgerOutOfRight() {
    const burger = this.burgers[this.numberOfBurgers * 3 - 1]
    const burgerOutOfRight = burger.x + SIZE > this.width

    return burgerOutOfRight
  }
  burgerOutOfLeft() {
    const burger = this.burgers[0]
    const burgerOutOfLeft = burger.x < 0

    return burgerOutOfLeft
  }
  collisionWithBoy(burger) {
    const burgerOutOfBottom = burger.y + SIZE > HEIGHT - 4 * SIZE
    return burgerOutOfBottom
  }
}

let backgroundImage
let burgerImage
let boyImage

const lab = new Lab(WIDTH, HEIGHT, numOfBurgers)
lab.simulate()
