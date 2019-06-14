const SIZE = 30
const SPACE_BETWEEN = SIZE + SIZE/2
let numOfEnemies = 15
const FREE_SPACE = (40*SIZE - (SIZE + (numOfEnemies - 1) * SPACE_BETWEEN)) / 2 

const body = document.querySelector('body')
const canvas = document.createElement('canvas')
body.append(canvas)

canvas.setAttribute('width', `${40 * SIZE}px`)
canvas.setAttribute('height', `${30 * SIZE}px`)

const ctx = canvas.getContext('2d')

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