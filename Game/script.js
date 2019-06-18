const SIZE = 30
const SPACE_BETWEEN = SIZE + SIZE/2
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
const PLAY_BUTTON_POSITION_ADJUSTMENT_PERCENT = 0.15*HEIGHT
const PAUSE_BUTTON_WIDTH = 150
const PAUSE_BUTTON_HEIGHT = 32

let boy = {
  x: WIDTH / 2,
  y: (HEIGHT - BOY_HEIGHT) - 50
}

const body = document.querySelector('body')
const canvas = document.createElement('canvas')
body.append(canvas)

canvas.setAttribute('width', WIDTH)
canvas.setAttribute('height', HEIGHT)
const ctx = canvas.getContext('2d')

function drawBurger(x, y, width, height, color = 'black') {
  ctx.fillStyle = color
  ctx.fillRect(x, y, width, height)
}
let isPlaying = false;

var images
addClickEventToCanvas();
loadAllImages().then(values => {
  images = values
  animate()
})

function animate() {
  drawGame()
  requestAnimationFrame(animate)
}

function drawGame() {
  drawBackground();
  drawBurgers();
  drawBoy();
  drawPauseButton();

  if (!isPlaying) {
    drawInstruction();
    drawPlayButton();
    drawCounter(5)
  }
}

function addClickEventToCanvas(){
  canvas.addEventListener('click', function(event){
    let relativeClickX =  event.x - canvas.offsetLeft;
    let relativeClickY = event.y - canvas.offsetTop;

    if (!isPlaying) {
      if (checkIfclickOnPlayButton(relativeClickX,relativeClickY)) {
        isPlaying = true
      }
    } else {
      if (checkIfclickOnPauseButton(relativeClickX,relativeClickY)) {
        isPlaying = false
      }
    }
  })
}

function loadAllImages () {
  const imagesNames = ['background', 'instruction', 'burger', 'pause', 'play', 'boy-skinny']
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
  let maxPlayClickScopeX = (WIDTH + PLAY_BUTTON_WIDTH)/2
  let minPlayClickScopeX = (WIDTH - PLAY_BUTTON_WIDTH)/2
  let maxPlayClickScopeY = HEIGHT/2 + PLAY_BUTTON_POSITION_ADJUSTMENT_PERCENT + PLAY_BUTTON_HEIGHT
  let minPlayClickScopeY = HEIGHT/2 + PLAY_BUTTON_POSITION_ADJUSTMENT_PERCENT

  return relativeClickX < maxPlayClickScopeX && relativeClickX > minPlayClickScopeX && 
  relativeClickY < maxPlayClickScopeY && relativeClickY > minPlayClickScopeY
}

function checkIfclickOnPauseButton(relativeClickX,relativeClickY) {
  return relativeClickX < PAUSE_BUTTON_WIDTH && relativeClickY < PAUSE_BUTTON_HEIGHT
}

function drawBurgers() {

  for (let i = 0; i < numOfBurgers; i++) {
    drawBurger(i * SPACE_BETWEEN + FREE_SPACE, SIZE, SIZE, SIZE)
  }
  
  for (let i = 0; i < numOfBurgers; i++) {
    drawBurger(i * SPACE_BETWEEN + FREE_SPACE , SIZE + SPACE_BETWEEN, SIZE, SIZE)
  }
  
  for (let i = 0; i < numOfBurgers; i++) {
    drawBurger(i * SPACE_BETWEEN + FREE_SPACE, SIZE + 2 * SPACE_BETWEEN, SIZE, SIZE)
  }

}

function drawBackground() {
  ctx.drawImage(images.background, 0, 0, WIDTH, HEIGHT)
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


window.addEventListener('keydown', example, false);
function example(e) {
  if (e.keyCode == 37) {
    moveLeft()
  } else if (e.keyCode == 39) {
    moveRight()
  }
}

function drawInstruction() {
  ctx.drawImage(images.instruction, (WIDTH - INSTRUCTION_WIDTH) / 2, (HEIGHT - INSTRUCTION_HEIGHT) / 2, INSTRUCTION_WIDTH, INSTRUCTION_HEIGHT)
}

function drawBoy() {
  ctx.drawImage(images.boyskinny, boy.x, boy.y, BOY_WIDTH, BOY_HEIGHT)
}

function drawPlayButton() {
  ctx.drawImage(images.play, WIDTH/2 - PLAY_BUTTON_WIDTH/2, HEIGHT/2 + PLAY_BUTTON_POSITION_ADJUSTMENT_PERCENT, PLAY_BUTTON_WIDTH, PLAY_BUTTON_HEIGHT)
}

function drawPauseButton() {
  ctx.drawImage(images.pause, 0, 0, PAUSE_BUTTON_WIDTH, PAUSE_BUTTON_HEIGHT)
}

function drawBurger(x, y, width, height) {
  ctx.drawImage(images.burger, x, y, width, height)
}

function drawCounter(number) {
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.font = '50px Arial'
  ctx.fillStyle = '#000'
  ctx.fillText(number, WIDTH / 2, HEIGHT / 2)
}

function drawImage(imageUrl, x, y, w, h, onload = () => { }) {
  const image = new Image()
  image.src = imageUrl
  image.onload = function () {
    ctx.drawImage(image, x, y, w, h)
    onload()
  }
  return image
}

function loadImage (imageUrl) {
  return new Promise((resolve) => {
    const image = new Image()
    image.src = imageUrl
    image.onload = function () {
      resolve(image)
    }
  })
}
