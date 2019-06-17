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

let boy = {
  x: WIDTH / 2,
  y: HEIGHT - BOY_HEIGHT - 50
}

function randomNumber(min, max) {
  return Math.random() * (max - min) + min
}

function Particle(x, y) {
  this.initX = x
  this.initY = y
  this.vx = 5
  this.reset()
}

Particle.prototype = {
  draw: function(context) {
    context.fillStyle = this.color
    context.beginPath()
    context.arc(this.x, this.y, this.r, 0, 2 * Math.PI)
    context.fill()
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

function Lab(width, height, color, numberOfParticles = 1) {
  this.width = width
  this.height = height
  this.color = color
  this.numberOfParticles = numberOfParticles

  this.createCanvas()
  this.clearCanvas()
  this.generateParticles()
}

Lab.prototype = {
  generateParticles: function() {
    // TODO: change imperative code to more functional way
    const particles = []
    for (let i = 0; i < this.numberOfParticles; i++) {
      particles.push(new Particle(i * SPACE_BETWEEN + FREE_SPACE, SIZE))
      particles.push(new Particle(i * SPACE_BETWEEN + FREE_SPACE, SIZE + SPACE_BETWEEN))
      particles.push(new Particle(i * SPACE_BETWEEN + FREE_SPACE, SIZE + 2 * SPACE_BETWEEN))
    }
    this.particles = particles
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
  },
  simulate: function() {
    this.clearCanvas()
    if (this.particleOutOfLeft() || this.particleOutOfRight()) {
      this.particles.forEach(particle => particle.changeDirection())
    }
    this.particles.forEach(this.simulateParticle.bind(this))
    requestAnimationFrame(this.simulate.bind(this))
  },
  simulateParticle: function(particle) {
    particle.draw(this.context)
    particle.move()
    if (this.collisionWithBoy(particle)) {
      particle.reset()
    }
  },
  particleOutOfRight: function() {
    const particle = this.particles[this.numberOfParticles * 3 - 1]
    const particleOutOfRight = particle.x + particle.r > this.width

    return particleOutOfRight
  },
  particleOutOfLeft: function() {
    const particle = this.particles[0]
    const particleOutOfLeft = particle.x - particle.r < 0

    return particleOutOfLeft
  },
  collisionWithBoy: function(particle) {
    const particleOutOfBottom = particle.y - particle.r > boy.y
    return particleOutOfBottom
  }
}

const lab = new Lab(WIDTH, HEIGHT, '#ddd', 15)
lab.simulate()
