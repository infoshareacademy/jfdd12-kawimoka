const SIZE = 30
const SPACE_BETWEEN = SIZE + SIZE/2
let numOfEnemies = 15
const FREE_SPACE = (40*SIZE - (SIZE + (numOfEnemies - 1) * SPACE_BETWEEN)) / 2 
const WIDTH = 900
const HEIGHT = 600
const INSTRUCTION_WIDTH = 300
const INSTRUCTION_HEIGHT = 300

const body = document.querySelector('body')
const canvas = document.createElement('canvas')
body.append(canvas)

canvas.setAttribute('width', `${30 * SIZE}px`)
canvas.setAttribute('height', `${20 * SIZE}px`)
const ctx = canvas.getContext('2d')

let backgroundImage;
let instructionImage;
let burgers;

backgroundImage = drawImage ('game-images/background.png', 0, 0, WIDTH, HEIGHT, () => {
  instructionImage = drawImage("game-images/instruction.png", (WIDTH - INSTRUCTION_WIDTH)/2, (HEIGHT - INSTRUCTION_HEIGHT)/2, INSTRUCTION_WIDTH, INSTRUCTION_HEIGHT)
})

var button = document.createElement('button')
button.innerHTML = "PLAY"
button.classList.add("button-style");
body.append(button);


function drawBurger (x, y, width, height, color = 'black') {
  ctx.fillStyle = color
  ctx.fillRect(x, y, width, height)
}


for (let i = 0; i < numOfEnemies; i++) {
  drawBurger(i * SPACE_BETWEEN + FREE_SPACE, SIZE, SIZE, SIZE)
}

for (let i = 0; i < numOfEnemies; i++) {
  drawBurger(i * SPACE_BETWEEN + FREE_SPACE , SIZE + SPACE_BETWEEN, SIZE, SIZE)
}

for (let i = 0; i < numOfEnemies; i++) {
  drawBurger(i * SPACE_BETWEEN + FREE_SPACE, SIZE + 2 * SPACE_BETWEEN, SIZE, SIZE)
}

function drawImage (imageUrl, x, y, w, h, onload = () => {}) {
  const image = new Image()
  image.src = imageUrl
  image.onload = function() {
    ctx.drawImage(image, x, y, w, h)
    onload()
  }
  return image
}