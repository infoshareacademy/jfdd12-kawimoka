const SIZE = 30
const SPACE_BETWEEN = SIZE + SIZE/2
const FREE_SPACE = (SIZE * 10 + 9 * SPACE_BETWEEN) / 2 

const body = document.querySelector('body')
const canvas = document.createElement('canvas')
body.append(canvas)

canvas.setAttribute('width', `${45 * SIZE}px`)
canvas.setAttribute('height', `${30 * SIZE}px`)

const ctx = canvas.getContext('2d')

function drawBurger (x, y, width, height, color = 'black') {
  ctx.fillStyle = color
  ctx.fillRect(x, y, width, height)
}


for (let i = 0; i < 10; i++) {
  drawBurger(i * SPACE_BETWEEN + FREE_SPACE, SIZE, SIZE, SIZE)
}

for (let i = 0; i < 10; i++) {
  drawBurger(i * SPACE_BETWEEN + FREE_SPACE , SIZE + SPACE_BETWEEN, SIZE, SIZE)
}

for (let i = 0; i < 10; i++) {
  drawBurger(i * SPACE_BETWEEN + FREE_SPACE, SIZE + 2 * SPACE_BETWEEN, SIZE, SIZE)
}